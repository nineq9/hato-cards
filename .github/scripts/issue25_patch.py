from pathlib import Path
import re

ROOT=Path('.')

def read(path): return (ROOT/path).read_text()
def write(path,text): (ROOT/path).write_text(text)
def once(text,old,new,label):
    n=text.count(old)
    if n!=1: raise SystemExit(f'{label}: expected 1 occurrence, found {n}')
    return text.replace(old,new,1)
def between(text,start,end,new,label):
    i=text.find(start); j=text.find(end,i+len(start))
    if i<0 or j<0: raise SystemExit(f'{label}: markers not found')
    return text[:i]+new+text[j:]

# --- production JS ---
p='kingfisher.js'; s=read(p)
s=once(s,"    manualReadMinDistance: 40\n", "    manualReadMinDistance: 40,\n    arcHorizontalActivation: 50,\n    arcHorizontalDominance: 1.35\n",'gesture arc defaults')
s=once(s,"    themeChoice: localStorage.getItem('kingfisherTheme') || 'dark',\n    undo: [],\n    toastTimer: null,\n", "    themeChoice: localStorage.getItem('kingfisherTheme') || 'dark',\n",'remove undo state')
s=once(s,"    stage?.classList.remove('is-nexting','is-saving');", "    stage?.classList.remove('is-nexting','is-saving','is-committed');",'reset committed class')
s=once(s,"      content.innerHTML='<div class=\"clear-card\"><span>CLEAR</span></div>';nextHost.innerHTML='';syncNav();return;", "      content.innerHTML='<div class=\"clear-card\"><span>CLEAR!</span></div>';nextHost.innerHTML='';syncNav();return;",'CLEAR exact text')
s=between(s,"  function snapshot(){","  function settleReader(){","  function settleReader(){",'remove undo functions')
old_block="""  function advanceNext(dx=0,vx=0){
    const a=currentArticle();if(!a)return;
    const next=nextArticleCandidate();snapshot();state.processed.add(a.id);addHistory(a.id);persist();
    const panel=$('#readerPanel'),travel=Math.max(innerWidth*1.12,420),remaining=Math.max(80,travel-Math.abs(dx));
    const exitSpeed=Math.max(.82,Math.abs(vx));
    const exitDuration=clamp(remaining/exitSpeed,185,295);
    panel.style.transition=`transform ${exitDuration}ms cubic-bezier(.12,.82,.16,1),opacity ${Math.min(190,exitDuration)}ms linear`;
    panel.style.transform='translate3d(-112vw,0,0) rotate(-2.5deg)';panel.style.opacity='.08';
    setTimeout(()=>{
      state.currentId=next?.id||null;
      renderReader({resetScroll:true});
      const p=$('#readerPanel');p.style.transition='none';p.style.transform='translate3d(14px,0,0)';p.style.opacity='.96';
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        p.style.transition='transform 220ms cubic-bezier(.2,.72,.18,1),opacity 180ms linear';p.style.transform='';p.style.opacity='1';
        setTimeout(()=>p.style.transition='',230);
      }));
      tutorialAction('next');
      showUndoOnly();
    },220);
  }
  function saveCurrent(){
    const a=currentArticle();if(!a)return false;
    if(state.saved.has(a.id)) return false;
    snapshot();state.saved.add(a.id);addHistory(a.id);persist();renderDrawer();showUndoOnly();return true;
  }
  function commitSave(dx=0){
    const panel=$('#readerPanel'),reveal=$('#readerSaveReveal');
    const added=saveCurrent();
    reveal.classList.add('committed');reveal.classList.toggle('already',state.saved.has(currentArticle()?.id));
    panel.style.transition='transform 150ms cubic-bezier(.18,.78,.18,1)';panel.style.transform=`translate3d(${Math.max(72,Math.min(dx,105))}px,0,0)`;
    tutorialAction('save');
    setTimeout(settleReader,115);
    return added;
  }
"""
new_block="""  function dismissCurrent(direction,{save=false,dx=0,vx=0,tutorialActionName=null}={}){
    const a=currentArticle();if(!a)return false;
    if(save) state.saved.add(a.id);
    state.processed.add(a.id);addHistory(a.id);persist();renderDrawer();
    const panel=$('#readerPanel'),stage=$('#readerStage'),reveal=$('#readerSaveReveal');
    const sign=direction==='right'?1:-1;
    if(save){stage.classList.add('is-saving','is-committed');reveal.classList.add('committed');reveal.classList.add('already');}
    else stage.classList.add('is-nexting');
    const travel=Math.max(innerWidth*1.12,420),remaining=Math.max(72,travel-Math.abs(dx));
    const exitSpeed=Math.max(.86,Math.abs(vx));
    const exitDuration=clamp(remaining/exitSpeed,180,290);
    panel.style.transition=`transform ${exitDuration}ms cubic-bezier(.12,.82,.16,1),opacity ${Math.min(190,exitDuration)}ms linear`;
    panel.style.transform=`translate3d(${sign*112}vw,0,0) rotate(${sign*2.5}deg)`;panel.style.opacity='.08';
    setTimeout(()=>{
      state.currentId=queueFor()[0]?.id||null;
      renderReader({resetScroll:true});
      if(tutorialActionName) tutorialAction(tutorialActionName);
    },exitDuration);
    return true;
  }
  function advanceNext(dx=0,vx=0){return dismissCurrent('left',{dx,vx,tutorialActionName:'next'});}
  function commitSave(dx=0,vx=0){return dismissCurrent('right',{save:true,dx,vx,tutorialActionName:'save'});}
"""
s=once(s,old_block,new_block,'replace dismiss actions')
s=once(s,"    if(ax>=GESTURE.horizontalActivation&&ax>=ay*GESTURE.horizontalDominance){g.axis='x';return g.axis;}\n", "    const strictHorizontal=ax>=GESTURE.horizontalActivation&&ax>=ay*GESTURE.horizontalDominance;\n    const thumbArcHorizontal=ax>=GESTURE.arcHorizontalActivation&&ax>=ay*GESTURE.arcHorizontalDominance;\n    if(strictHorizontal||thumbArcHorizontal){g.axis='x';return g.axis;}\n",'thumb arc intent')
s=once(s,"      if(dx>0&&(distanceCommit||flickCommit)){commitSave(dx);return;}", "      if(dx>0&&(distanceCommit||flickCommit)){commitSave(dx,effectiveVx);return;}",'save velocity')
old_home="""    if(state.drawerView==='home') body.innerHTML=`<div class="drawer-home"><div class="drawer-actions"><button data-view="liked"><span>♡</span><b>${tr('いいね','НРАВИТСЯ')}</b></button><button data-view="saved"><span class="drawer-save-icon"><svg viewBox="0 0 28 32" aria-hidden="true"><path d="M7 4h14v24l-7-5-7 5z"/></svg></span><b>${tr('保存','СОХРАНЁННОЕ')}</b></button></div><div class="drawer-section-title">${tr('履歴','ИСТОРИЯ')}</div><div class="drawer-history">${drawerRows(state.historyIds)}</div><div class="drawer-settings-entry"><button data-view="settings"><span>⚙︎</span><b>${tr('設定','НАСТРОЙКИ')}</b></button></div></div>`;
"""
new_home="""    body.classList.toggle('drawer-root-layout',state.drawerView==='home');
    if(state.drawerView==='home') body.innerHTML=`<div class="drawer-home drawer-home-fixed"><div class="drawer-fixed-top drawer-actions"><button data-view="liked"><span class="drawer-row-icon"><svg viewBox="0 0 28 32" aria-hidden="true"><path d="M14 27S5 21.6 5 14.5C5 10.8 7.4 8.5 10.4 8.5c1.8 0 3.2.9 3.6 2 .4-1.1 1.8-2 3.6-2 3 0 5.4 2.3 5.4 6C23 21.6 14 27 14 27z"/></svg></span><b>${tr('いいね','НРАВИТСЯ')}</b></button><button data-view="saved"><span class="drawer-row-icon"><svg viewBox="0 0 28 32" aria-hidden="true"><path d="M7 4h14v24l-7-5-7 5z"/></svg></span><b>${tr('保存','СОХРАНЁННОЕ')}</b></button></div><section class="drawer-history-region"><div class="drawer-section-title">${tr('履歴','ИСТОРИЯ')}</div><div class="drawer-history">${drawerRows(state.historyIds)}</div></section><div class="drawer-fixed-bottom"><button data-view="settings"><span class="drawer-row-icon drawer-settings-icon">⚙︎</span><b>${tr('設定','НАСТРОЙКИ')}</b></button></div></div>`;
"""
s=once(s,old_home,new_home,'drawer fixed root')
start="  function bindEdgeDrawerGesture(){"
end="  const TUTORIAL_COPY={"
new_gesture="""  function bindEdgeDrawerGesture(){
    let g=null;
    const drawer=$('#drawer'),backdrop=$('#drawerBackdrop');
    const resetOpenCandidate=()=>{drawer.style.transition='';drawer.style.transform='';backdrop.style.opacity='';backdrop.classList.remove('dragging');};
    const snapDrawerOpen=()=>{drawer.style.transition='transform 190ms cubic-bezier(.2,.72,.18,1)';drawer.style.transform='translate3d(0,0,0)';backdrop.style.transition='opacity 160ms linear';backdrop.style.opacity='';setTimeout(()=>{drawer.style.transition='';backdrop.style.transition='';drawer.style.transform='';backdrop.style.opacity='';},205);};
    const closeWithMotion=(vx=0)=>{const width=Math.max(280,drawer.getBoundingClientRect().width),duration=clamp(width/Math.max(.9,Math.abs(vx)),170,250);drawer.style.transition=`transform ${duration}ms cubic-bezier(.12,.82,.16,1)`;drawer.style.transform='translate3d(-105%,0,0)';backdrop.style.transition=`opacity ${Math.min(170,duration)}ms linear`;backdrop.style.opacity='0';setTimeout(closeDrawer,duration);};

    document.addEventListener('pointerdown',e=>{
      if($('#sourceSheet').classList.contains('open')||state.tab==='dive'||!$('#splash').classList.contains('hidden')) return;
      if(drawer.classList.contains('open')){
        const inDrawer=e.target instanceof Element&&(drawer.contains(e.target)||backdrop.contains(e.target));
        if(!inDrawer)return;
        g={mode:'close',id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastT:performance.now(),vx:0,axis:null};
        return;
      }
      if(e.clientX>edgeGestureWidth()||!$('#cardsScreen').classList.contains('active')||!$('#tutorial').classList.contains('hidden')) return;
      g={mode:'open',id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastT:performance.now(),vx:0,axis:null};state.edgeDrawerPointerId=e.pointerId;
    },true);

    document.addEventListener('pointermove',e=>{
      if(!g||e.pointerId!==g.id)return;
      const rawDx=e.clientX-g.x,dy=e.clientY-g.y,now=performance.now(),dt=Math.max(8,now-g.lastT);g.vx=g.vx*.44+((e.clientX-g.lastX)/dt)*.56;g.lastX=e.clientX;g.lastT=now;
      if(!g.axis){const ax=Math.abs(rawDx),ay=Math.abs(dy),dist=Math.hypot(rawDx,dy);if(dist<14)return;if(ay>ax*1.25){g.axis='y';return;}if(ax>ay*1.25)g.axis='x';else return;}
      if(g.axis!=='x')return;
      e.preventDefault();
      if(g.mode==='close'){
        const dx=Math.min(0,rawDx),width=Math.max(1,drawer.offsetWidth),progress=clamp(Math.abs(dx)/width,0,1);drawer.style.transition='none';drawer.style.transform=`translate3d(${dx}px,0,0)`;backdrop.style.transition='none';backdrop.style.opacity=String((1-progress)*.9);backdrop.classList.add('dragging');
      }else{
        const dx=Math.max(0,rawDx),width=Math.max(1,drawer.offsetWidth),progress=clamp(dx/width,0,1);drawer.style.transition='none';drawer.style.transform=`translate3d(${-103+103*progress}%,0,0)`;backdrop.style.opacity=String(progress*.9);backdrop.classList.add('dragging');
      }
    },{capture:true,passive:false});

    const end=e=>{
      if(!g||e.pointerId!==g.id)return;const data=g;g=null;state.edgeDrawerPointerId=null;const dx=e.clientX-data.x,dy=e.clientY-data.y;backdrop.classList.remove('dragging');
      if(data.mode==='close'){
        if(data.axis==='x'&&(dx<-70||data.vx<-.42)){closeWithMotion(data.vx);return;}
        snapDrawerOpen();return;
      }
      if(data.axis==='x'&&(dx>68||data.vx>.38)){openDrawer();return;}resetOpenCandidate();
    };
    document.addEventListener('pointerup',end,true);
    document.addEventListener('pointercancel',e=>{if(!g||e.pointerId!==g.id)return;const mode=g.mode;g=null;state.edgeDrawerPointerId=null;if(mode==='close')snapDrawerOpen();else resetOpenCandidate();},true);
  }

"""
s=between(s,start,end,new_gesture+end,'drawer gesture rewrite')
s=once(s,"    $('#sourceBackdrop').addEventListener('click',closeSource);$('#sourceClose').addEventListener('click',closeSource);$('#undoBtn').addEventListener('click',undo);", "    $('#sourceBackdrop').addEventListener('click',closeSource);$('#sourceClose').addEventListener('click',closeSource);",'remove undo listener')
write(p,s)

# --- index: remove persistent UNDO DOM ---
p='index.html'; s=read(p)
s=re.sub(r'\n\s*<div id="undoToast" class="undo-toast" role="status"><button id="undoBtn" aria-label="元に戻す">↶</button></div>\n','\n',s,count=1)
if 'undoToast' in s or 'undoBtn' in s: raise SystemExit('index undo DOM removal failed')
write(p,s)

# --- CSS ---
p='kingfisher.css'; s=read(p)
s=s.replace('.hamburger i{top:6.5px;width:15px}.hamburger:after{bottom:0;width:19px}', '.hamburger i{top:6.5px;width:22px}.hamburger:after{bottom:0;width:22px}')
s=re.sub(r'\.undo-toast\{[^}]*\}(?:\.undo-toast\.show\{[^}]*\})?(?:\.undo-toast button\{[^}]*\})?','',s)
s=s.replace('.clear-card{height:100%;display:grid;place-items:center;color:var(--muted);font-size:10px;letter-spacing:.18em}', '.clear-card{height:100%;display:grid;place-items:center;padding:24px;color:var(--text);font-size:clamp(30px,9vw,46px);font-weight:760;letter-spacing:.12em;text-align:center}')
append="""

/* Owner Issue #25: fixed utility menu + committed SAVE continuity */
.reader-stage.is-saving.is-committed .reader-save-reveal{opacity:0}
.reader-stage.is-saving.is-committed .reader-next-preview{opacity:1}
.drawer-body.drawer-root-layout{overflow:hidden!important;padding:0!important;min-height:0}
.drawer-home-fixed{height:100%;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr) auto}
.drawer-fixed-top{padding:10px 18px 8px;border-bottom:1px solid var(--line)}
.drawer-history-region{min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr);padding:8px 0 0}
.drawer-history-region .drawer-section-title{padding:8px 18px 6px}
.drawer-history-region .drawer-history{min-height:0;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:0 10px 14px;touch-action:pan-y}
.drawer-fixed-bottom{padding:10px 18px calc(12px + var(--safe-bottom));border-top:1px solid var(--line);background:var(--bg)}
.drawer-actions{display:grid;gap:2px}.drawer-actions button,.drawer-fixed-bottom button{width:100%;min-height:52px;border:0;background:transparent;color:var(--text);display:grid;grid-template-columns:32px minmax(0,1fr);align-items:center;column-gap:12px;text-align:left;padding:0 6px;border-radius:10px}
.drawer-actions button:active,.drawer-fixed-bottom button:active{background:color-mix(in srgb,var(--surface) 72%,transparent)}
.drawer-row-icon{width:28px;height:32px;display:grid;place-items:center;justify-self:start;color:var(--text2);font-size:21px;line-height:1}
.drawer-row-icon svg{width:24px;height:28px;fill:none;stroke:currentColor;stroke-width:1.45;stroke-linejoin:round;stroke-linecap:round}
.drawer-settings-icon{font-size:20px;transform:translateY(-1px)}
.drawer-actions b,.drawer-fixed-bottom b{font-size:13px;line-height:1.2;font-weight:620;letter-spacing:.01em}
"""
if 'Owner Issue #25: fixed utility menu' not in s: s+=append
if 'undo-toast' in s: raise SystemExit('undo CSS remains')
write(p,s)

# --- service worker cache ---
p='sw.js'; s=read(p); s=re.sub(r"const CACHE='kingfisher-v\\d+';", "const CACHE='kingfisher-v19';", s, count=1); write(p,s)

# --- smoke test patches ---
p='tests/smoke.mjs'; s=read(p)
s=once(s,"""  const y=await page.locator('#articleScroll').evaluate(e=>e.scrollTop);
  await touchDrag(page,'#articleScroll',135,2,210,[180,300]);await page.waitForTimeout(420);
  assert.equal(await page.locator('.story-page').getAttribute('data-id'),after,'tutorial SAVE navigated away');
  assert(Math.abs((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))-y)<5,'tutorial SAVE changed scroll position');
""", """  await touchDrag(page,'#articleScroll',135,2,210,[180,300]);await page.waitForTimeout(520);
  assert((await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]'))).includes(after),'tutorial SAVE did not persist saved state');
  assert.notEqual(await page.locator('.story-page').getAttribute('data-id'),after,'tutorial SAVE did not advance');
  assert((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))<3,'tutorial SAVE next article did not start at top');
""",'smoke tutorial save')
s=between(s,"// SAVE at top / middle / end and position preservation.","// Gestures beginning on interactive source controls", """// SAVE + ADVANCE at top / middle / end.
for(const pos of ['top','middle','end']){
  const page=await freshPage();await setPosition(page,pos);const id=await page.locator('.story-page').getAttribute('data-id');
  await touchDrag(page,'#articleScroll',135,2,210,[180,260]);await page.waitForTimeout(520);
  assert((await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]'))).includes(id),`SAVE failed at ${pos}`);
  assert.notEqual(await page.locator('.story-page').getAttribute('data-id'),id,`SAVE did not advance at ${pos}`);
  assert((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))<3,`SAVE next article scroll leak at ${pos}`);
  await page.close();
}

// Gestures beginning on interactive source controls""",'smoke save block')
s=once(s,"""  const id=await page.locator('.story-page').getAttribute('data-id');const y=await page.locator('#articleScroll').evaluate(e=>e.scrollTop);
  await touchDrag(page,'.story-source-card',135,1,210);await page.waitForTimeout(420);
  assert((await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]'))).includes(id),'SAVE from interactive source card failed');
  assert.equal(await page.locator('#sourceSheet.open').count(),0,'source click leaked after horizontal SAVE');
  assert(Math.abs((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))-y)<5);
""", """  const id=await page.locator('.story-page').getAttribute('data-id');
  await touchDrag(page,'.story-source-card',135,1,210);await page.waitForTimeout(520);
  assert((await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]'))).includes(id),'SAVE from interactive source card failed');
  assert.equal(await page.locator('#sourceSheet.open').count(),0,'source click leaked after horizontal SAVE');
  assert.notEqual(await page.locator('.story-page').getAttribute('data-id'),id,'SAVE from source card did not advance');
  assert((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))<3);
""",'smoke interactive save')
s=between(s,"// Menu subview edge return and edge-vs-SAVE separation.","// Mobile proportions / ARTICLE CARD containment.", """// Menu root has fixed utilities/history architecture and anywhere-left close.
{
  const page=await freshPage();const articleId=await page.locator('.story-page').getAttribute('data-id');const articleY=await page.locator('#articleScroll').evaluate(e=>e.scrollTop);
  await page.click('#menuButton');await page.waitForSelector('#drawer.open');
  assert.equal(await page.locator('.drawer-fixed-top [data-view="liked"]').count(),1);
  assert.equal(await page.locator('.drawer-fixed-top [data-view="saved"]').count(),1);
  assert.equal(await page.locator('.drawer-history-region .drawer-history').count(),1);
  assert.equal(await page.locator('.drawer-fixed-bottom [data-view="settings"]').count(),1);
  const beforeTransform=await page.locator('#drawer').evaluate(e=>getComputedStyle(e).transform);
  const box=await page.locator('#drawer').boundingBox();assert(box);
  const cdp=await page.context().newCDPSession(page);const sx=box.x+box.width*.62,sy=box.y+box.height*.48;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:sx,y:sy,radiusX:4,radiusY:4,force:1}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:sx-95,y:sy+2,radiusX:4,radiusY:4,force:1}]});await page.waitForTimeout(80);
  const during=await page.locator('#drawer').evaluate(e=>getComputedStyle(e).transform);assert.notEqual(during,beforeTransform,'drawer did not follow close gesture');
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();await page.waitForTimeout(360);
  assert.equal(await page.locator('#drawer.open').count(),0,'anywhere-left menu close failed');
  assert.equal(await page.locator('.story-page').getAttribute('data-id'),articleId,'menu close triggered article NEXT');
  assert(Math.abs((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))-articleY)<3,'menu close changed article scroll');
  assert.equal(await page.locator('#undoToast,#undoBtn').count(),0,'persistent UNDO UI remains');
  await page.close();
}

// Mobile proportions / ARTICLE CARD containment.""",'smoke menu block')
s=s.replace("for(const [w,h] of [[375,667],[390,844],[430,932]]){", "for(const [w,h] of [[320,568],[375,667],[390,844],[430,932],[844,390],[1024,768]]){")
write(p,s)

# --- mobile E2E patches ---
p='tests/mobile-e2e.mjs'; s=read(p)
s=between(s,"// NEXT and SAVE at top/middle/end.","// Mixed imperfect gestures must not leave stale state.", """// NEXT and SAVE + ADVANCE at top/middle/end, including natural thumb arcs.
const ARC_LEFT=[[-14,-8],[-34,-17],[-58,-25],[-86,-31],[-118,-36],[-150,-39]];
const ARC_RIGHT=ARC_LEFT.map(([x,y])=>[-x,y]);
for(const p of ['top','middle','end']){
  const savePage=await fresh();await pos(savePage,p);const saveId=await savePage.locator('.story-page').getAttribute('data-id');
  await touchPath(savePage,'#articleScroll',ARC_RIGHT,{duration:250,pos:[190,300]});await savePage.waitForTimeout(520);
  assert((await savePage.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]'))).includes(saveId),`arc SAVE failed at ${p}`);
  assert.notEqual(await savePage.locator('.story-page').getAttribute('data-id'),saveId,`arc SAVE did not advance at ${p}`);
  assert((await savePage.locator('#articleScroll').evaluate(e=>e.scrollTop))<3,`arc SAVE leaked scroll at ${p}`);await neutral(savePage,`arc SAVE ${p}`);await savePage.close();
  const nextPage=await fresh();await pos(nextPage,p);const nextId=await nextPage.locator('.story-page').getAttribute('data-id');
  await touchPath(nextPage,'#articleScroll',ARC_LEFT,{duration:250,pos:[190,300]});await nextPage.waitForTimeout(520);
  assert.notEqual(await nextPage.locator('.story-page').getAttribute('data-id'),nextId,`arc NEXT failed at ${p}`);
  assert((await nextPage.locator('#articleScroll').evaluate(e=>e.scrollTop))<3,`arc NEXT leaked scroll at ${p}`);await neutral(nextPage,`arc NEXT ${p}`);await nextPage.close();
}

// Ambiguous diagonal must cancel rather than commit.
{
  const page=await fresh();const id=await page.locator('.story-page').getAttribute('data-id');const saved0=(await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]'))).length;
  await touchPath(page,'#articleScroll',[[16,-12],[32,-25],[48,-37],[65,-50],[78,-61]],{duration:320,pos:[190,320]});await page.waitForTimeout(300);
  assert.equal(await page.locator('.story-page').getAttribute('data-id'),id,'ambiguous diagonal incorrectly advanced');
  assert.equal((await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]'))).length,saved0,'ambiguous diagonal incorrectly saved');await neutral(page,'ambiguous diagonal cancel');await page.close();
}

// Mixed imperfect gestures must not leave stale state.""",'mobile top mid end arcs')
s=between(s,"// Menu subview edge recovery; non-edge right swipe remains SAVE.","// Tutorial journey uses real reader", """// Menu fixed regions + anywhere RIGHT→LEFT close; underlying article must not NEXT.
{
  const page=await fresh();const id=await page.locator('.story-page').getAttribute('data-id');await page.click('#menuButton');await page.waitForSelector('#drawer.open');
  assert.equal(await page.locator('.drawer-fixed-top [data-view="liked"]').count(),1);assert.equal(await page.locator('.drawer-fixed-top [data-view="saved"]').count(),1);assert.equal(await page.locator('.drawer-fixed-bottom [data-view="settings"]').count(),1);
  const h=page.locator('.drawer-history');await h.evaluate(e=>{const row=e.querySelector('.drawer-article');if(row){for(let i=0;i<80;i++)e.append(row.cloneNode(true));}e.scrollTop=e.scrollHeight;});
  const topBox=await page.locator('.drawer-fixed-top').boundingBox(),bottomBox=await page.locator('.drawer-fixed-bottom').boundingBox();assert(topBox&&bottomBox&&bottomBox.y+bottomBox.height<=845,'fixed menu regions escaped viewport');
  await touchPath(page,'#drawer',[[-18,1],[-48,2],[-90,3],[-140,3]],{duration:220,pos:[220,390]});await page.waitForTimeout(360);
  assert.equal(await page.locator('#drawer.open').count(),0,'menu anywhere-left close failed');assert.equal(await page.locator('.story-page').getAttribute('data-id'),id,'menu close leaked article NEXT');
  await page.close();
}

// Tutorial journey uses real reader""",'mobile menu block')
s=once(s,"""  await touchPath(page,'#articleScroll',straight(145,2),{duration:220,pos:[180,300]});await page.waitForTimeout(420);
  await page.waitForFunction(()=>document.querySelector('#tutorial')?.classList.contains('hidden'),null,{timeout:1600});
""", """  const saveId=await page.locator('.story-page').getAttribute('data-id');
  await touchPath(page,'#articleScroll',ARC_RIGHT,{duration:250,pos:[180,300]});await page.waitForTimeout(520);
  assert((await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]'))).includes(saveId),'tutorial SAVE did not persist');
  assert.notEqual(await page.locator('.story-page').getAttribute('data-id'),saveId,'tutorial SAVE did not advance');
  assert((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))<3,'tutorial SAVE next card not at top');
  await page.waitForFunction(()=>document.querySelector('#tutorial')?.classList.contains('hidden'),null,{timeout:1600});
""",'mobile tutorial save')
s=once(s,"  assert.equal(await page.locator('.clear-card').count(),1,'finite queue did not render caught-up/CLEAR state');", "  assert.equal(await page.locator('.clear-card').count(),1,'finite queue did not render caught-up/CLEAR state');assert.equal((await page.locator('.clear-card').innerText()).trim(),'CLEAR!','caught-up text must be CLEAR!');")
write(p,s)

# --- gesture tuning: add arc profile params and new tests; update stale SAVE assumptions ---
p='tests/gesture-tuning.mjs'; s=read(p)
s=s.replace("manualReadMinDistance:36}","manualReadMinDistance:36,arcHorizontalActivation:46,arcHorizontalDominance:1.28}")
s=s.replace("manualReadMinDistance:40}","manualReadMinDistance:40,arcHorizontalActivation:50,arcHorizontalDominance:1.35}")
s=s.replace("manualReadMinDistance:44}","manualReadMinDistance:44,arcHorizontalActivation:56,arcHorizontalDominance:1.42}")
insert="""
const THUMB_ARC_LEFT=[[-14,-8],[-34,-17],[-58,-25],[-86,-31],[-118,-36],[-150,-39]];
const THUMB_ARC_RIGHT=THUMB_ARC_LEFT.map(([x,y])=>[-x,y]);
async function arcAttempt(profile,dir){
  const page=await fresh(profile),id=await page.locator('.story-page').getAttribute('data-id');
  await touchPath(page,'#articleScroll',dir==='right'?THUMB_ARC_RIGHT:THUMB_ARC_LEFT,{duration:250,pos:[190,320]});await page.waitForTimeout(520);
  const changed=(await page.locator('.story-page').getAttribute('data-id'))!==id,saved=(await page.evaluate(id=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]').includes(id),id));await page.close();
  return {changed,saved};
}
"""
s=once(s,"const READ_CASES=[",insert+"\nconst READ_CASES=[",'gesture arc helper')
s=once(s,"assert.equal(await nextAttempt(PROFILES.B_BALANCED,108,330,42),true,'B_BALANCED clear diagonal NEXT failed');", "assert.equal(await nextAttempt(PROFILES.B_BALANCED,108,330,42),true,'B_BALANCED clear diagonal NEXT failed');\nconst arcSave=await arcAttempt(PROFILES.B_BALANCED,'right');assert(arcSave.changed&&arcSave.saved,'B_BALANCED natural thumb arc SAVE+ADVANCE failed');\nconst arcNext=await arcAttempt(PROFILES.B_BALANCED,'left');assert(arcNext.changed&&!arcNext.saved,'B_BALANCED natural thumb arc NEXT failed');")
# Replace top/middle/end stale SAVE+then NEXT block with independent pages.
start="// Top / middle / end: SAVE preserves exact reading position, NEXT resets next card to top."
end="// Required mixed one-handed journey: READ → NEXT → READ → SAVE → READ → NEXT."
new="""// Top / middle / end: both committed horizontal actions advance and reset next card to top.
for(const p of ['top','middle','end']){
  const savePage=await fresh(PROFILES.B_BALANCED);await setPos(savePage,p);const saveId=await savePage.locator('.story-page').getAttribute('data-id');
  await touchPath(savePage,'#articleScroll',THUMB_ARC_RIGHT,{duration:250,pos:[190,310]});await savePage.waitForTimeout(520);
  assert((await savePage.evaluate(id=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]').includes(id),saveId)),`SAVE did not persist at ${p}`);assert.notEqual(await savePage.locator('.story-page').getAttribute('data-id'),saveId,`SAVE did not advance at ${p}`);assert((await savePage.locator('#articleScroll').evaluate(e=>e.scrollTop))<3,`SAVE leaked scroll at ${p}`);await neutral(savePage,`SAVE ${p}`);await savePage.close();
  const nextPage=await fresh(PROFILES.B_BALANCED);await setPos(nextPage,p);const nextId=await nextPage.locator('.story-page').getAttribute('data-id');
  await touchPath(nextPage,'#articleScroll',THUMB_ARC_LEFT,{duration:250,pos:[190,310]});await nextPage.waitForTimeout(520);assert.notEqual(await nextPage.locator('.story-page').getAttribute('data-id'),nextId,`NEXT failed at ${p}`);assert((await nextPage.locator('#articleScroll').evaluate(e=>e.scrollTop))<3,`NEXT leaked scroll at ${p}`);await neutral(nextPage,`NEXT ${p}`);await nextPage.close();
}

// Required mixed one-handed journey: READ → NEXT → READ → SAVE → READ → NEXT."""
s=between(s,start,end,new,'gesture top/mid/end')
# Rewrite mixed journey to account SAVE advancing.
start="// Required mixed one-handed journey: READ → NEXT → READ → SAVE → READ → NEXT."
end="fs.writeFileSync('test-output/gesture-profile-comparison.json'"
oldtail=s[s.find(start):s.find(end)]
newtail="""// Required mixed one-handed journey: READ → NEXT → READ → SAVE → READ → NEXT.
{
  const page=await fresh(PROFILES.B_BALANCED);let id=await page.locator('.story-page').getAttribute('data-id');
  await touchPath(page,'#articleScroll',[[12,-7],[15,-34],[13,-82],[16,-155]],{duration:290,pos:[190,530]});await page.waitForTimeout(120);assert((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))>50);assert.equal(await page.locator('.story-page').getAttribute('data-id'),id);
  await touchPath(page,'#articleScroll',THUMB_ARC_LEFT,{duration:250,pos:[190,310]});await page.waitForTimeout(520);let current=await page.locator('.story-page').getAttribute('data-id');assert.notEqual(current,id);assert((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))<3);
  id=current;await touchPath(page,'#articleScroll',[[2,-25],[6,-70],[4,-145]],{duration:260,pos:[190,530]});await page.waitForTimeout(100);assert((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))>40);
  await touchPath(page,'#articleScroll',THUMB_ARC_RIGHT,{duration:250,pos:[190,310]});await page.waitForTimeout(520);assert((await page.evaluate(id=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]').includes(id),id)));current=await page.locator('.story-page').getAttribute('data-id');assert.notEqual(current,id);assert((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))<3);
  id=current;await touchPath(page,'#articleScroll',[[4,-24],[10,-65],[6,-125]],{duration:250,pos:[190,510]});await page.waitForTimeout(100);assert((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))>30);
  await touchPath(page,'#articleScroll',THUMB_ARC_LEFT,{duration:250,pos:[190,310]});await page.waitForTimeout(520);assert.notEqual(await page.locator('.story-page').getAttribute('data-id'),id);assert((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))<3);await neutral(page,'mixed journey final');await page.close();
}

"""
s=s.replace(oldtail,newtail,1)
write(p,s)

# --- untouched regression: replace old SAVE+UNDO segment ---
p='tests/untouched-regression.mjs'; s=read(p)
old="""const id=await page.locator('.story-page').getAttribute('data-id');const sy=await page.locator('#articleScroll').evaluate(e=>e.scrollTop);await touchDrag('#articleScroll',120,0,190,[150,250]);await page.waitForTimeout(340);assert((await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]'))).includes(id));assert.equal(await page.locator('.story-page').getAttribute('data-id'),id);assert(Math.abs((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))-sy)<5);await page.click('#undoBtn');await page.waitForTimeout(180);assert(!(await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]'))).includes(id));
"""
new="""const id=await page.locator('.story-page').getAttribute('data-id');await touchDrag('#articleScroll',135,0,210,[150,250]);await page.waitForTimeout(520);assert((await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]'))).includes(id));assert.notEqual(await page.locator('.story-page').getAttribute('data-id'),id);assert((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))<3);assert.equal(await page.locator('#undoToast,#undoBtn').count(),0);
"""
s=once(s,old,new,'untouched SAVE/UNDO')
write(p,s)

print('Issue #25 production/test patch applied')
