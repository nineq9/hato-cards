import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
fs.mkdirSync('test-output',{recursive:true});
const browser=await chromium.launch({headless:true});

async function mouseDrag(page,selector,dx,dy,duration=180,pos=null){
  const box=await page.locator(selector).boundingBox();assert(box,`missing ${selector}`);
  const sx=box.x+(pos?pos[0]:box.width/2),sy=box.y+(pos?pos[1]:box.height/2);
  await page.mouse.move(sx,sy);await page.mouse.down();
  for(let i=1;i<=10;i++){await page.mouse.move(sx+dx*i/10,sy+dy*i/10);await page.waitForTimeout(duration/10)}
  await page.mouse.up();
}
async function touchDrag(page,selector,dx,dy,duration=180,pos=null){
  const box=await page.locator(selector).boundingBox();assert(box,`missing ${selector}`);
  const sx=box.x+(pos?pos[0]:box.width/2),sy=box.y+(pos?pos[1]:box.height/2);
  const cdp=await page.context().newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:sx,y:sy,radiusX:4,radiusY:4,force:1}]});
  for(let i=1;i<=10;i++){
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:sx+dx*i/10,y:sy+dy*i/10,radiusX:4,radiusY:4,force:1}]});
    await page.waitForTimeout(duration/10);
  }
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();
}
async function boot(page,{tutorial=false}={}){
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>localStorage.clear());
  if(!tutorial) await page.evaluate(()=>{localStorage.setItem('kingfisherIntroVersion','kingfisher-intro-v7');localStorage.setItem('kingfisherTutorialDone','1')});
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForSelector('#splash:not(.hidden)');
  const bird=await page.locator('#splashBird').boundingBox();assert(bird);
  await page.mouse.move(bird.x+bird.width/2,bird.y+bird.height/2);await page.mouse.down();
  await page.mouse.move(bird.x+bird.width/2,bird.y+bird.height/2-140,{steps:8});await page.mouse.up();
  await page.waitForFunction(()=>document.querySelector('#splash')?.classList.contains('hidden'),null,{timeout:5500});
  if(tutorial){
    await page.waitForSelector('#tutorial:not(.hidden)');
    await mouseDrag(page,'#tutorialCard',0,-100);await page.waitForTimeout(300);
    await mouseDrag(page,'#tutorialCard',-100,0);await page.waitForTimeout(520);
    await mouseDrag(page,'#tutorialCard',100,0);await page.waitForTimeout(330);
    await page.locator('#tutorialHeart').click();
    await page.waitForFunction(()=>document.querySelector('#tutorial')?.classList.contains('hidden'),null,{timeout:1700});
  }
}

const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
await boot(page,{tutorial:true});
assert.equal(await page.locator('#detail').count(),0,'legacy detail DOM must be absent');
assert.equal(await page.locator('.story-cover').count(),1);assert.equal(await page.locator('.story-body').count(),1);
const first=await page.locator('.story-page').getAttribute('data-id');assert(first);

await touchDrag(page,'#readerPanel',8,-180,240,[150,500]);await page.waitForTimeout(250);
assert((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))>80,'vertical touch did not scroll article');
await page.locator('#articleScroll').evaluate(e=>e.scrollTop=420);assert(await page.locator('.story-section').first().isVisible());

const savedBefore=await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]').length);
await touchDrag(page,'#readerPanel',18,-105,180,[150,250]);await page.waitForTimeout(150);
assert.equal(await page.locator('.story-page').getAttribute('data-id'),first);
assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]').length),savedBefore);

const saveY=await page.locator('#articleScroll').evaluate(e=>e.scrollTop);
await touchDrag(page,'#readerPanel',120,4,190,[150,250]);await page.waitForTimeout(380);
assert((await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]'))).includes(first));
assert.equal(await page.locator('.story-page').getAttribute('data-id'),first);
assert(Math.abs((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))-saveY)<5);
const savedCount=await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]').length);
await touchDrag(page,'#readerPanel',120,0,180,[150,250]);await page.waitForTimeout(320);
assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]').length),savedCount,'repeat save duplicated state');

await page.locator('#articleScroll').evaluate(e=>e.scrollTop=500);
await touchDrag(page,'#readerPanel',-125,3,190,[150,250]);await page.waitForTimeout(480);
const second=await page.locator('.story-page').getAttribute('data-id');assert.notEqual(second,first);
assert((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))<3,'next article did not start at top');

await page.locator('#articleScroll').evaluate(e=>e.scrollTop=360);const y2=await page.locator('#articleScroll').evaluate(e=>e.scrollTop);
await touchDrag(page,'#readerPanel',45,2,180,[150,250]);await page.waitForTimeout(260);
assert(Math.abs((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))-y2)<5);

await page.locator('#articleScroll').evaluate(e=>e.scrollTop=e.scrollHeight);const bottomId=await page.locator('.story-page').getAttribute('data-id');
await page.mouse.wheel(0,900);await page.waitForTimeout(220);assert.equal(await page.locator('.story-page').getAttribute('data-id'),bottomId);
await page.locator('.story-like').click();assert((await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherLiked')||'[]'))).includes(bottomId));

const sourceY=await page.locator('#articleScroll').evaluate(e=>e.scrollTop);
await page.locator('.story-source-card').click();await page.waitForSelector('#sourceSheet.open');
assert(await page.locator('#sourceMedia').innerText());assert(await page.locator('#sourceTitle').innerText());assert(await page.locator('#sourceExternal').getAttribute('href'));
await page.locator('#sourceClose').click();await page.waitForTimeout(150);
assert(Math.abs((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))-sourceY)<5);

await touchDrag(page,'#readerStage',117,0,180,[2,238]);await page.waitForSelector('#drawer.open');
await page.locator('#drawerBackdrop').click({position:{x:370,y:200}});await page.waitForFunction(()=>!document.querySelector('#drawer')?.classList.contains('open'));

assert.equal(await page.locator('.story-dive-entry').count(),0);
await page.click('[data-tab="dive"]');await page.waitForSelector('#diveScreen.active');
await page.click('[data-tab="forYou"]');await page.waitForSelector('#cardsScreen.active');
await page.screenshot({path:'test-output/kf16-reader.png'});await page.close();

for(const [w,h] of [[375,667],[390,844],[430,932]]){
  const p=await browser.newPage({viewport:{width:w,height:h},isMobile:true,hasTouch:true});await boot(p);
  assert.equal(await p.locator('#detail').count(),0);
  const cover=await p.locator('.story-cover').boundingBox(),nav=await p.locator('.feed-nav').boundingBox();assert(cover&&nav);
  assert(cover.y+cover.height<=nav.y+3,`${w}: cover overlaps nav`);
  await p.screenshot({path:`test-output/kf16-${w}x${h}.png`});await p.close();
}
console.log('KINGFISHER v16 continuous-reader smoke: PASS');await browser.close();
