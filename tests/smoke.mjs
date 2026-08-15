import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});

async function touchDrag(page,selector,dx,dy,duration=200,pos=null){
  const box=await page.locator(selector).boundingBox();assert(box,`missing ${selector}`);
  const sx=box.x+(pos?pos[0]:box.width/2),sy=box.y+(pos?pos[1]:box.height/2);
  const cdp=await page.context().newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:sx,y:sy,radiusX:4,radiusY:4,force:1}]});
  for(let i=1;i<=12;i++){
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:sx+dx*i/12,y:sy+dy*i/12,radiusX:4,radiusY:4,force:1}]});
    await page.waitForTimeout(duration/12);
  }
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();
}
async function splash(page){
  await page.waitForSelector('#splash:not(.hidden)');
  const bird=await page.locator('#splashBird').boundingBox();assert(bird);
  await page.mouse.move(bird.x+bird.width/2,bird.y+bird.height/2);await page.mouse.down();
  await page.mouse.move(bird.x+bird.width/2,bird.y+bird.height/2-150,{steps:10});await page.mouse.up();
  await page.waitForFunction(()=>document.querySelector('#splash')?.classList.contains('hidden'),null,{timeout:6000});
}
async function boot(page,{tutorial=false,auditListeners=false}={}){
  if(auditListeners) await page.addInitScript(()=>{
    const original=EventTarget.prototype.addEventListener;window.__listenerAudit={};
    EventTarget.prototype.addEventListener=function(type,listener,options){
      const key=`${this.id||this.nodeName||'unknown'}:${type}`;
      window.__listenerAudit[key]=(window.__listenerAudit[key]||0)+1;
      return original.call(this,type,listener,options);
    };
  });
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>localStorage.clear());
  if(!tutorial) await page.evaluate(()=>{localStorage.setItem('kingfisherIntroVersion','kingfisher-intro-v8');localStorage.setItem('kingfisherTutorialDone','1')});
  await page.reload({waitUntil:'domcontentloaded'});await splash(page);
  if(!tutorial) await page.waitForSelector('.story-page');
}
async function setPosition(page,pos){
  await page.locator('#articleScroll').evaluate((e,p)=>{
    if(p==='top')e.scrollTop=0;
    else if(p==='middle')e.scrollTop=Math.max(0,(e.scrollHeight-e.clientHeight)*.48);
    else e.scrollTop=e.scrollHeight-e.clientHeight;
  },pos);
  await page.waitForTimeout(80);
}
async function freshPage(){
  const p=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});await boot(p);return p;
}

// Tutorial must be the production ARTICLE CARD and production gesture/actions.
{
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  await boot(page,{tutorial:true,auditListeners:true});
  await page.waitForSelector('#tutorial:not(.hidden)');await page.waitForSelector('.story-page');
  assert.equal(await page.locator('.tutorial-card').count(),0,'fake tutorial card must not exist');
  assert.equal(await page.locator('#detail').count(),0,'legacy detail DOM must be absent');
  assert.equal(await page.locator('.story-page > .story-cover').count(),1);
  assert.equal(await page.locator('.story-page > .story-body').count(),1);
  for(let i=0;i<16;i++){
    const atEnd=await page.locator('#articleScroll').evaluate(e=>e.scrollHeight-e.scrollTop-e.clientHeight<36);if(atEnd)break;
    await touchDrag(page,'#articleScroll',2,-330,210,[180,560]);await page.waitForTimeout(90);
  }
  assert(await page.locator('#articleScroll').evaluate(e=>e.scrollHeight-e.scrollTop-e.clientHeight<40),'tutorial did not reach real article end');
  assert.equal(await page.locator('#tutorialCue').innerText(),'♡');
  await page.locator('.story-like').click();await page.waitForTimeout(60);
  assert(await page.locator('.story-like').evaluate(e=>e.classList.contains('active')));
  assert(await page.locator('.story-like').evaluate(e=>e.classList.contains('pulse')),'LIKE pulse did not run');
  assert.equal(await page.locator('#tutorialCue').innerText(),'←');
  const before=await page.locator('.story-page').getAttribute('data-id');
  await touchDrag(page,'#articleScroll',-135,2,210,[190,300]);await page.waitForTimeout(520);
  const after=await page.locator('.story-page').getAttribute('data-id');assert.notEqual(after,before,'tutorial NEXT did not use production NEXT');
  assert((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))<3,'tutorial NEXT leaked scroll position');
  assert.equal(await page.locator('#tutorialCue').innerText(),'→');
  const y=await page.locator('#articleScroll').evaluate(e=>e.scrollTop);
  await touchDrag(page,'#articleScroll',135,2,210,[180,300]);await page.waitForTimeout(420);
  assert.equal(await page.locator('.story-page').getAttribute('data-id'),after,'tutorial SAVE navigated away');
  assert(Math.abs((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))-y)<5,'tutorial SAVE changed scroll position');
  await page.waitForFunction(()=>document.querySelector('#tutorial')?.classList.contains('hidden'),null,{timeout:1400});
  const audit=await page.evaluate(()=>window.__listenerAudit);
  assert.equal(audit['articleScroll:pointerdown'],1,'reader pointerdown listener duplicated');
  assert.equal(audit['articleContent:click'],1,'article delegated click listener duplicated');
  assert.equal(audit['drawerBody:click'],1,'drawer delegated click listener duplicated');
  await page.close();
}

// READ: vertical and diagonal vertical-dominant gestures must not NEXT/SAVE.
{
  const page=await freshPage();const id=await page.locator('.story-page').getAttribute('data-id');
  const savedBefore=await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]').length);
  await touchDrag(page,'#articleScroll',8,-180,230,[160,500]);await page.waitForTimeout(180);
  assert((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))>60,'vertical READ did not scroll');
  assert.equal(await page.locator('.story-page').getAttribute('data-id'),id);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]').length),savedBefore);
  const y=await page.locator('#articleScroll').evaluate(e=>e.scrollTop);
  await touchDrag(page,'#articleScroll',42,-155,220,[160,480]);await page.waitForTimeout(160);
  assert((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))>y,'diagonal up-right failed to remain READ');
  assert.equal(await page.locator('.story-page').getAttribute('data-id'),id);
  await page.close();
}

// NEXT at top / middle / end.
for(const pos of ['top','middle','end']){
  const page=await freshPage();await setPosition(page,pos);const before=await page.locator('.story-page').getAttribute('data-id');
  await touchDrag(page,'#articleScroll',-135,2,210,[190,260]);await page.waitForTimeout(520);
  assert.notEqual(await page.locator('.story-page').getAttribute('data-id'),before,`NEXT failed at ${pos}`);
  assert((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))<3,`NEXT scroll leak at ${pos}`);
  await page.close();
}

// SAVE at top / middle / end and position preservation.
for(const pos of ['top','middle','end']){
  const page=await freshPage();await setPosition(page,pos);const id=await page.locator('.story-page').getAttribute('data-id');const y=await page.locator('#articleScroll').evaluate(e=>e.scrollTop);
  await touchDrag(page,'#articleScroll',135,2,210,[180,260]);await page.waitForTimeout(420);
  assert((await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]'))).includes(id),`SAVE failed at ${pos}`);
  assert.equal(await page.locator('.story-page').getAttribute('data-id'),id,`SAVE navigated at ${pos}`);
  assert(Math.abs((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))-y)<5,`SAVE changed scroll at ${pos}`);
  await page.close();
}

// Gestures beginning on interactive source controls still honor the article gesture contract.
{
  const page=await freshPage();const first=await page.locator('.story-page').getAttribute('data-id');
  const sourceBox=await page.locator('.story-source-button').boundingBox();assert(sourceBox);
  await touchDrag(page,'.story-source-button',-135,2,210,[Math.min(40,sourceBox.width/2),sourceBox.height/2]);await page.waitForTimeout(520);
  assert.notEqual(await page.locator('.story-page').getAttribute('data-id'),first,'NEXT from interactive source button failed');
  assert.equal(await page.locator('#sourceSheet.open').count(),0,'source click leaked after horizontal NEXT');
  await page.locator('.story-source-card').evaluate(e=>e.scrollIntoView({block:'center'}));await page.waitForTimeout(100);
  const id=await page.locator('.story-page').getAttribute('data-id');const y=await page.locator('#articleScroll').evaluate(e=>e.scrollTop);
  await touchDrag(page,'.story-source-card',135,1,210);await page.waitForTimeout(420);
  assert((await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]'))).includes(id),'SAVE from interactive source card failed');
  assert.equal(await page.locator('#sourceSheet.open').count(),0,'source click leaked after horizontal SAVE');
  assert(Math.abs((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))-y)<5);
  await page.close();
}

// Menu subview edge return and edge-vs-SAVE separation.
{
  const page=await freshPage();
  await touchDrag(page,'#readerStage',115,0,190,[2,230]);await page.waitForSelector('#drawer.open');
  for(const view of ['settings','saved','liked']){
    if(view!=='settings'){await page.locator(`[data-view="${view}"]`).click();}else await page.locator('[data-view="settings"]').click();
    assert.equal(await page.locator('.drawer-back').count(),1,`${view} did not open`);
    await touchDrag(page,'#drawerBody',105,0,190,[2,220]);await page.waitForTimeout(260);
    assert.equal(await page.locator('.drawer-back').count(),0,`${view} edge return failed`);
  }
  await page.locator('#drawerBackdrop').click({position:{x:380,y:180}});await page.waitForFunction(()=>!document.querySelector('#drawer')?.classList.contains('open'));
  const id=await page.locator('.story-page').getAttribute('data-id');
  await touchDrag(page,'#articleScroll',130,0,200,[150,250]);await page.waitForTimeout(400);
  assert.equal(await page.locator('#drawer.open').count(),0,'non-edge SAVE opened menu');
  assert((await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]'))).includes(id),'non-edge SAVE failed');
  await page.close();
}

// Mobile proportions / ARTICLE CARD containment.
for(const [w,h] of [[375,667],[390,844],[430,932]]){
  const page=await browser.newPage({viewport:{width:w,height:h},isMobile:true,hasTouch:true});await boot(page);
  assert.equal(await page.locator('#detail').count(),0);
  assert.equal(await page.locator('.story-page > .story-cover').count(),1);
  assert.equal(await page.locator('.story-page > .story-body').count(),1);
  const radius=await page.locator('.story-page').evaluate(e=>getComputedStyle(e).borderTopLeftRadius);assert.notEqual(radius,'0px');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true,`${w}: horizontal overflow`);
  await page.close();
}

console.log('KINGFISHER Phase 0 refactor smoke: PASS');await browser.close();
