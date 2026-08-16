import json, os, sys, time, re
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

ROOT = Path(os.environ.get('DIVE_DEMO_ROOT','/mnt/data/dive-session-v02'))
OUT = Path(os.environ.get('DIVE_SCREENSHOT_DIR','/tmp/dive-session-v02-shots'))
OUT.mkdir(parents=True, exist_ok=True)

VIEWPORTS = [
    ('320x568',320,568),('375x667',375,667),('390x844',390,844),('430x932',430,932),
    ('844x390',844,390),('1024x768',1024,768)
]

def state(page):
    return page.evaluate('window.__DIVE_SESSION_TEST__.getState()')

def click_direction(page, type_name):
    row = page.locator('.direction-row').filter(has=page.locator(f'.direction-type:text-is("{type_name}")')).first
    expect(row).to_be_visible()
    row.locator('.direction-main').click()

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    context = browser.new_context(viewport={'width':390,'height':844})
    page = context.new_page()
    page.set_default_timeout(5000)
    page.evaluate('window.__DIVE_TEST_PERSIST__ = new Map()')
    def load_app():
        import re
        html=(ROOT/'index.html').read_text()
        html=re.sub(r'<link rel="stylesheet" href="\./style\.css" \/>', '', html)
        html=re.sub(r'<script src="\./[^"]+"></script>', '', html)
        page.set_content(html, wait_until='load')
        page.add_style_tag(content=(ROOT/'style.css').read_text())
        for name in ['fixtures.js','session-store.js','exploration-adapter.js','session-engine.js','app.js']:
            page.add_script_tag(content=(ROOT/name).read_text())
        page.wait_for_function('window.__DIVE_SESSION_TEST__ && document.querySelector("#articleView").classList.contains("active")')
    load_app()
    errors=[]
    page.on('console', lambda msg: errors.append(msg.text) if msg.type=='error' else None)
    page.on('pageerror', lambda exc: errors.append(str(exc)))
    page.evaluate('window.__DIVE_SESSION_TEST__.reset()')
    page.wait_for_timeout(150)

    print('phase article', flush=True)
    # Article → DIVE from an arbitrary reading position.
    page.evaluate('document.querySelector("#articleScroll").scrollTop=720')
    origin = page.evaluate('document.querySelector("#articleScroll").scrollTop')
    assert origin > 500, origin
    page.locator('#articleDiveQuick').click()
    expect(page.locator('#diveView')).to_have_class(re.compile(r'(^|\s)active(\s|$)'))
    s=state(page)
    assert s['draft'] is True and len(s['session']['steps'])==1

    print('phase evidence', flush=True)
    # First meaningful exploration persists the session.
    click_direction(page,'EVIDENCE')
    s=state(page); assert s['draft'] is False
    sessions=page.evaluate('window.__DIVE_SESSION_TEST__.getSessions()')
    assert any(x['id']==s['session']['id'] for x in sessions)

    # Deeper exploration.
    click_direction(page,'EVIDENCE')  # Satellite imagery is EVIDENCE under Evidence; first EVIDENCE row
    s=state(page); assert s['session']['steps'][-1]['nodeId']=='satellite'

    print('phase history', flush=True)
    # Sideways HISTORY and relation/provenance.
    click_direction(page,'HISTORY')
    expect(page.locator('#arrivalRelation')).to_contain_text('historically_similar_to')
    page.locator('#arrivalRelation').click()
    expect(page.locator('#sheet')).to_have_class(re.compile(r'(^|\s)open(\s|$)'))
    expect(page.locator('#sheetBody')).to_contain_text('今回の事件を支持する証拠ではありません')
    expect(page.locator('#sheetBody')).to_contain_text('SOURCE / PROVENANCE')
    page.wait_for_timeout(1400)
    page.screenshot(path=str(OUT/'390x844-historical-warning.png'), full_page=True)
    page.set_viewport_size({'width':844,'height':390}); page.wait_for_timeout(80); page.screenshot(path=str(OUT/'844x390-historical-warning.png'), full_page=True)
    page.set_viewport_size({'width':390,'height':844}); page.locator('#sheetClose').click()

    # Explicit saved discovery; visited != saved.
    before=state(page)['session']['savedDiscoveries']
    assert len(before)==0
    page.locator('#saveDiscoveryButton').click()
    page.wait_for_timeout(80)
    assert len(state(page)['session']['savedDiscoveries'])==1

    print('phase branch', flush=True)
    # BACK and branch to Technology; old HISTORY step must remain.
    page.locator('#backButton').click()
    page.wait_for_timeout(80)
    assert state(page)['session']['steps'][state(page)['session']['steps'].index(next(x for x in state(page)['session']['steps'] if x['id']==state(page)['session']['currentStepId']))]['nodeId']=='satellite'
    history_step_count=len(state(page)['session']['steps'])
    click_direction(page,'TECHNOLOGY')
    s=state(page)
    assert s['session']['steps'][-1]['nodeId']=='technology'
    assert len(s['session']['steps'])==history_step_count+1
    assert any(x['nodeId']=='history' for x in s['session']['steps'])
    tech_step=s['session']['currentStepId']
    parent=next(x for x in s['session']['steps'] if x['id']==tech_step)['parentStepId']
    hist_step=next(x for x in s['session']['steps'] if x['nodeId']=='history')
    assert hist_step['parentStepId']==parent, 'History and Technology should be sibling branches from Satellite'

    # Third semantic direction and explicit Open Question.
    page.locator('#keepQuestionButton').click()
    expect(page.locator('#questionInput')).to_be_visible()
    q=page.locator('#questionInput').input_value()
    assert len(q)>35
    page.locator('#confirmQuestion').click()
    page.wait_for_timeout(100)
    assert len(state(page)['session']['openQuestions'])==1
    assert state(page)['session']['openQuestions'][0]['state']=='open'

    # Session History shows both sibling branches.
    page.locator('#sessionPanelButton').click()
    expect(page.locator('#historyTree')).to_contain_text('過去に似たことは？')
    expect(page.locator('#historyTree')).to_contain_text('どんな技術が関係する？')
    page.locator('.history-step').filter(has_text='過去に似たことは？').click()
    assert state(page)['session']['steps'][next(i for i,x in enumerate(state(page)['session']['steps']) if x['id']==state(page)['session']['currentStepId'])]['nodeId']=='history'
    page.locator('.history-step').filter(has_text='どんな技術が関係する？').click()
    assert state(page)['session']['currentStepId']==tech_step
    page.press('body','Escape')

    # Portrait → Landscape → Portrait preserves exact session focus/state.
    snap_before=state(page)['session']
    page.set_viewport_size({'width':844,'height':390}); page.wait_for_timeout(120)
    assert state(page)['session']['currentStepId']==tech_step
    page.set_viewport_size({'width':390,'height':844}); page.wait_for_timeout(120)
    snap_after=state(page)['session']
    assert snap_after['currentStepId']==tech_step
    assert len(snap_after['savedDiscoveries'])==1 and len(snap_after['openQuestions'])==1

    print('phase leave-home', flush=True)
    # Leave → Home: Continue first, Recent multiple sessions.
    page.locator('#leaveDiveButton').click(); page.wait_for_timeout(120)
    expect(page.locator('#homeView')).to_have_class(re.compile(r'(^|\s)active(\s|$)'))
    expect(page.locator('#continueSection')).to_be_visible()
    assert page.locator('#recentList .session-row').count() >= 3
    expect(page.locator('#continueButton')).to_contain_text('SAVED 1')
    expect(page.locator('#continueButton')).to_contain_text('OPEN 1')

    # Continue exact current focus.
    page.locator('#continueButton').click(); page.wait_for_timeout(120)
    assert state(page)['session']['currentStepId']==tech_step
    expect(page.locator('#focusType')).to_have_text('TECHNOLOGY')

    print('phase reload', flush=True)
    # Leave, reload, Home, Continue: IndexedDB persistence.
    page.locator('#leaveDiveButton').click(); page.wait_for_timeout(80)
    current_id=state(page)['session']['id']
    load_app()
    page.locator('#diveDock').click(); page.wait_for_timeout(100)
    expect(page.locator('#continueSection')).to_be_visible()
    page.locator('#continueButton').click(); page.wait_for_timeout(100)
    s=state(page)
    assert s['session']['id']==current_id and s['session']['currentStepId']==tech_step
    assert len(s['session']['savedDiscoveries'])==1 and len(s['session']['openQuestions'])==1

    # Return to exact article reading position.
    page.locator('#cardsDock').click(); page.wait_for_timeout(160)
    restored=page.evaluate('document.querySelector("#articleScroll").scrollTop')
    assert abs(restored-origin)<=1, (origin,restored)

    print('phase visual', flush=True)
    # Visual matrix: Home with multiple sessions and Dive with long source/question states.
    page.locator('#diveDock').click(); page.wait_for_timeout(1500)
    for name,w,h in VIEWPORTS:
        page.set_viewport_size({'width':w,'height':h}); page.wait_for_timeout(100)
        page.screenshot(path=str(OUT/f'{name}-home.png'), full_page=True)
        assert page.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth')
    # Article long-headline visual stress.
    page.set_viewport_size({'width':390,'height':844}); page.locator('#cardsDock').click(); page.wait_for_timeout(1500)
    page.evaluate('document.querySelector("#articleScroll").scrollTop=0')
    for name,w,h in VIEWPORTS:
        page.set_viewport_size({'width':w,'height':h}); page.wait_for_timeout(80)
        page.screenshot(path=str(OUT/f'{name}-article.png'), full_page=True)
        assert page.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth')
    page.locator('#diveDock').click(); page.wait_for_timeout(80)
    page.set_viewport_size({'width':390,'height':844}); page.locator('#continueButton').click(); page.wait_for_timeout(80)
    # Focus state visual stress.
    for name,w,h in VIEWPORTS:
        page.set_viewport_size({'width':w,'height':h}); page.wait_for_timeout(80)
        page.screenshot(path=str(OUT/f'{name}-focus.png'), full_page=True)
        assert page.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth')
    page.locator('#arrivalRelation').click(); page.wait_for_timeout(70)
    for name,w,h in VIEWPORTS:
        page.set_viewport_size({'width':w,'height':h}); page.wait_for_timeout(100)
        page.screenshot(path=str(OUT/f'{name}-relation.png'), full_page=True)
        assert page.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth')
    page.locator('#sheetClose').click(); page.wait_for_timeout(50)
    page.locator('#keepQuestionButton').evaluate('(el)=>{el.disabled=false;el.click()}')
    page.wait_for_timeout(70)
    for name,w,h in VIEWPORTS:
        page.set_viewport_size({'width':w,'height':h}); page.wait_for_timeout(100)
        page.screenshot(path=str(OUT/f'{name}-question.png'), full_page=True)
        assert page.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth')

    assert errors==[], errors
    print(json.dumps({'PASS':True,'originScroll':origin,'restoredScroll':restored,'sessionId':current_id,'screenshots':len(list(OUT.glob('*.png')))}, ensure_ascii=False))
    browser.close()
