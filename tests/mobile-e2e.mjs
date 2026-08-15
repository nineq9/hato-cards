import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

fs.mkdirSync('test-output',{recursive:true});
const browser=await chromium.launch({headless:true});

async function touchPath(page,selector,points,{duration=260,pos=null}={}){
  const box=await page.locator(selector).boundingBox();assert(box,`missing ${selector}`);
  const sx=box.x+(pos?pos[0]:box.width/2),sy=box.y+(pos?pos[1]:box.height/2);
  const cdp=await page.context().newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:sx,y:sy,radiusX:4,radiusY:4,force:1}]});
  for(let i=0;i<points.length;i++){
    const [dx,dy]=points[i];
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:sx+dx,y:sy+dy,radiusX:4,radiusY:4,force:1}]});
    await page.waitForTimeout(duration/Math.max(1,points.length));
  }
  const [dx,dy]=points.at(-1)||[0,0];
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await cdp.detach();
  return {dx,dy};
}
const straight=(dx,dy,steps=10)=>Array.from({length:steps},(_,i)=>[dx*(i+1)/steps,dy*(i+1)/steps]);

async function capture(page,name){
  const cdp=await page.context().newCDPSession(page);
  const {data}=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true});
  await cdp.detach();
  fs.writeFileSync(`test-output/issue4-${name}.png`,Buffer.from(data,'base64'));
}

async function splash(page){
  await page.waitForSelector('#splash:not(.hidden)');
  const bird=await page.locator('#splashBird').boundingBox();assert(bird);
  await page.mouse.move(bird.x+bird.width/2,bird.y+bird.height/2);await page.mouse.down();
  await page.mouse.move(bird.x+bird.width/2,bird.y+bird.height/2-155,{steps:12});await page.mouse.up();
  await page.waitForFunction(()=>document.querySelector('#splash')?.classList.contains('hidden'),null,{timeout:7000});
}

async function boot(page,{tutorial=false}={}){
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>localStorage.clear());
  if(!tutorial) await page.evaluate(()=>{localStorage.setItem('kingfisherIntroVersion','kingfisher-intro-v8');localStorage.setItem('kingfisherTutorialDone','1')});
  await page.reload({waitUntil:'domcontentloaded'});await splash(page);await page.waitForSelector('.story-page');
}
async function fresh({w=390,h=844,tutorial=false}={}){const page=await browser.newPage({viewport:{width:w,height:h},isMobile:true,hasTouch:true});await boot(page,{tutorial});return page;}
async function pos(page,p){await page.locator('#articleScroll').evaluate((e,p)=>{e.scrollTop=p==='top'?0:p==='middle'?Math.max(0,(e.scrollHeight-e.clientHeight)*.48):e.scrollHeight-e.clientHeight;},p);await page.waitForTimeout(80);}
async function neutral(page,label){
  const transform=await page.locator('#readerPanel').evaluate(e=>getComputedStyle(e).transform);
  assert(transform==='none'||transform==='matrix(1, 0, 0, 1, 0, 0)',`${label}: stale reader transform ${transform}`);
}

// Reproduction: imperfect READ begins with slight horizontal drift, then becomes clearly vertical.
{
  const page=await fresh();
  const id=await page.locator('.story-page').getAttribute('data-id');
  const y0=await page.locator('#articleScroll').evaluate(e=>e.scrollTop);
  const imperfectRead=[[14,-10],[18,-30],[20,-62],[18,-105],[22,-155],[19,-215]];
  await touchPath(page,'#articleScroll',imperfectRead,{duration:330,pos:[190,560]});await page.waitForTimeout(220);
  const y1=await page.locator('#articleScroll').evaluate(e=>e.scrollTop);
  assert(y1>y0+70,'CRITICAL reproduction: imperfect vertical READ was captured as horizontal instead of scrolling');
  assert.equal(await page.locator('.story-page').getAttribute('data-id'),id,'imperfect READ accidentally advanced article');
  await neutral(page,'after imperfect READ');
  const before=await page.locator('.story-page').getAttribute('data-id');
  await touchPath(page,'#articleScroll',straight(-145,3),{duration:220,pos:[190,300]});await page.waitForTimeout(520);
  assert.notEqual(await page.locator('.story-page').getAttribute('data-id'),before,'NEXT unavailable immediately after imperfect READ');
  assert((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))<3,'NEXT after imperfect READ leaked old scroll');
  await capture(page,'diagonal-read-next');await page.close();
}

// READ top -> middle -> end using imperfect mostly-vertical paths.
{
  const page=await fresh();const id=await page.locator('.story-page').getAttribute('data-id');
  await capture(page,'article-top');
  for(let i=0;i<8;i++){
    const atEnd=await page.locator('#articleScroll').evaluate(e=>e.scrollHeight-e.scrollTop-e.clientHeight<40);if(atEnd)break;
    const drift=i%2===0?18:-16;
    await touchPath(page,'#articleScroll',[[drift*.45,-18],[drift,-55],[drift*.75,-105],[drift,-185],[drift*.8,-285]],{duration:260,pos:[190,560]});await page.waitForTimeout(80);
    assert.equal(await page.locator('.story-page').getAttribute('data-id'),id,'READ accidentally triggered NEXT');
  }
  assert(await page.locator('#articleScroll').evaluate(e=>e.scrollHeight-e.scrollTop-e.clientHeight<50),'READ could not reach article end');
  await capture(page,'article-end-like');await page.close();
}

// NEXT and SAVE at top/middle/end.
for(const p of ['top','middle','end']){
  const page=await fresh();await pos(page,p);const id=await page.locator('.story-page').getAttribute('data-id');
  await touchPath(page,'#articleScroll',straight(145,2),{duration:220,pos:[190,300]});await page.waitForTimeout(420);
  assert.equal(await page.locator('.story-page').getAttribute('data-id'),id,`SAVE navigated at ${p}`);
  assert((await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]'))).includes(id),`SAVE failed at ${p}`);
  const savedY=await page.locator('#articleScroll').evaluate(e=>e.scrollTop);
  await neutral(page,`SAVE ${p}`);
  const before=await page.locator('.story-page').getAttribute('data-id');
  await touchPath(page,'#articleScroll',straight(-145,2),{duration:220,pos:[190,300]});await page.waitForTimeout(520);
  assert.notEqual(await page.locator('.story-page').getAttribute('data-id'),before,`NEXT failed at ${p}`);
  assert((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))<3,`NEXT did not reset scroll at ${p}`);
  assert(savedY>=0);
  await page.close();
}

// Mixed imperfect gestures must not leave stale state.
{
  const page=await fresh();
  for(let i=0;i<4;i++){
    const id=await page.locator('.story-page').getAttribute('data-id');
    await touchPath(page,'#articleScroll',[[10,-14],[17,-42],[12,-88],[18,-150]],{duration:190,pos:[180,520]});await page.waitForTimeout(70);
    assert.equal(await page.locator('.story-page').getAttribute('data-id'),id,`mixed READ ${i} advanced`);
    await touchPath(page,'#articleScroll',straight(38,1,6),{duration:150,pos:[170,320]});await page.waitForTimeout(240);
    assert.equal(await page.locator('.story-page').getAttribute('data-id'),id,`short SAVE ${i} committed/navigation changed unexpectedly`);
    await neutral(page,`mixed cancel ${i}`);
  }
  const before=await page.locator('.story-page').getAttribute('data-id');
  await touchPath(page,'#articleScroll',straight(-150,3),{duration:210,pos:[180,320]});await page.waitForTimeout(520);
  assert.notEqual(await page.locator('.story-page').getAttribute('data-id'),before,'NEXT broken after repeated mixed gestures');
  await neutral(page,'after mixed NEXT');await page.close();
}

// Menu subview edge recovery; non-edge right swipe remains SAVE.
{
  const page=await fresh();
  await touchPath(page,'#readerStage',straight(120,0),{duration:190,pos:[2,240]});await page.waitForSelector('#drawer.open');
  for(const view of ['settings','saved','liked']){
    await page.locator(`[data-view="${view}"]`).click();assert.equal(await page.locator('.drawer-back').count(),1,`${view} did not open`);
    if(view==='settings')await capture(page,'menu-settings');
    await touchPath(page,'#drawerBody',straight(110,0),{duration:190,pos:[2,230]});await page.waitForTimeout(260);
    assert.equal(await page.locator('.drawer-back').count(),0,`${view} edge recovery failed`);
  }
  await page.locator('#drawerMenuButton').click();await page.waitForTimeout(260);
  const id=await page.locator('.story-page').getAttribute('data-id');
  await touchPath(page,'#articleScroll',straight(145,1),{duration:210,pos:[150,300]});await page.waitForTimeout(420);
  assert.equal(await page.locator('#drawer.open').count(),0,'non-edge SAVE opened drawer');
  assert((await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]'))).includes(id),'non-edge SAVE failed after menu recovery');
  await page.close();
}

// Tutorial journey uses real reader, real end LIKE, NEXT and SAVE. Capture key visual states.
{
  const page=await fresh({tutorial:true});
  await page.waitForSelector('#tutorial:not(.hidden)');await capture(page,'tutorial-read');
  for(let i=0;i<14;i++){
    const atEnd=await page.locator('#articleScroll').evaluate(e=>e.scrollHeight-e.scrollTop-e.clientHeight<36);if(atEnd)break;
    await touchPath(page,'#articleScroll',[[8,-22],[12,-78],[10,-155],[14,-285]],{duration:240,pos:[180,560]});await page.waitForTimeout(80);
  }
  assert(await page.locator('#articleScroll').evaluate(e=>e.scrollHeight-e.scrollTop-e.clientHeight<45),'tutorial did not reach real article end');
  assert.equal(await page.locator('#tutorialCue').innerText(),'♡');await capture(page,'tutorial-like');
  await page.locator('.story-like').click();await page.waitForTimeout(80);assert.equal(await page.locator('#tutorialCue').innerText(),'←');
  const before=await page.locator('.story-page').getAttribute('data-id');
  await touchPath(page,'#articleScroll',straight(-145,2),{duration:220,pos:[180,300]});await page.waitForTimeout(520);
  assert.notEqual(await page.locator('.story-page').getAttribute('data-id'),before,'tutorial NEXT failed');
  assert.equal(await page.locator('#tutorialCue').innerText(),'→');
  await touchPath(page,'#articleScroll',straight(145,2),{duration:220,pos:[180,300]});await page.waitForTimeout(420);
  await page.waitForFunction(()=>document.querySelector('#tutorial')?.classList.contains('hidden'),null,{timeout:1600});
  await capture(page,'tutorial-complete');await page.close();
}

console.log('Issue #4 human-like mobile E2E: PASS');
await browser.close();
