import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const BASE=process.env.BASE_URL||'http://127.0.0.1:4173';
fs.mkdirSync('test-output',{recursive:true});
const browser=await chromium.launch({headless:true});

async function capture(page,name){
  const cdp=await page.context().newCDPSession(page);
  const {data}=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true});
  await cdp.detach();
  fs.writeFileSync(`test-output/day2-baseline-${name}.png`,Buffer.from(data,'base64'));
}
async function touchDrag(page,selector,dx,dy,duration=220,pos=null){
  const box=await page.locator(selector).boundingBox();assert(box,`missing ${selector}`);
  const sx=box.x+(pos?pos[0]:box.width/2),sy=box.y+(pos?pos[1]:box.height/2);
  const cdp=await page.context().newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:sx,y:sy,radiusX:4,radiusY:4,force:1}]});
  for(let i=1;i<=12;i++){
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:sx+dx*i/12,y:sy+dy*i/12,radiusX:4,radiusY:4,force:1}]});
    await page.waitForTimeout(duration/12);
  }
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await cdp.detach();
}

// Read-only capture of the real production CARDS baseline.
{
  const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const p=await ctx.newPage();
  await p.goto(`${BASE}/`,{waitUntil:'domcontentloaded'});
  await p.evaluate(()=>{localStorage.setItem('kingfisherIntroVersion','kingfisher-intro-v8');localStorage.setItem('kingfisherTutorialDone','1');localStorage.setItem('kingfisherTheme','dark')});
  await p.reload({waitUntil:'domcontentloaded'});
  const bird=await p.locator('#splashBird').boundingBox();assert(bird,'production splash bird missing');
  await p.mouse.move(bird.x+bird.width/2,bird.y+bird.height/2);await p.mouse.down();
  await p.mouse.move(bird.x+bird.width/2,bird.y+bird.height/2-160,{steps:12});await p.mouse.up();
  await p.waitForFunction(()=>document.querySelector('#splash')?.classList.contains('hidden'),null,{timeout:7000});
  await p.waitForSelector('.story-page');
  assert.equal(await p.locator('.feed-tab').allTextContents().then(x=>x.join('|')),'FOR YOU|HOT|DIVE');
  await capture(p,'production-current');
  await ctx.close();
}

const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
const page=await context.newPage();

// First launch = Full Opening, then Tutorial on the CARDS-shaped reader.
await page.goto(`${BASE}/demos/day2-baseline/?reset=1`,{waitUntil:'domcontentloaded'});
await page.waitForSelector('#opening.show');
assert.equal(await page.locator('#opening.micro').count(),0,'fresh launch used Micro Opening');
await capture(page,'full-opening');
await page.waitForSelector('#tutorial.active',{timeout:3500});
assert.match(await page.locator('#tutorialStep').innerText(),/READ/);
assert.equal(await page.locator('.feed-tab').allTextContents().then(x=>x.join('|')),'CARDS|LIVE|DIVE');
assert.equal(await page.locator('.feed-tab[aria-current="page"]').innerText(),'CARDS');
assert.equal(await page.locator('.story-page').count(),1);
await capture(page,'tutorial-read-dark');

// READ -> SOURCE.
await page.locator('#articleScroll').evaluate(e=>{e.scrollTop=e.scrollHeight});
await page.waitForFunction(()=>document.querySelector('#tutorialStep')?.textContent.includes('SOURCE'));
const sourceY=await page.locator('#articleScroll').evaluate(e=>e.scrollTop);
await capture(page,'tutorial-source');

// Source sheet keeps exact reading context.
await page.locator('.story-source-card').click();
await page.waitForSelector('#sourceSheet.open');
await page.waitForTimeout(320);
assert(await page.locator('#sourceTitle').innerText());
await capture(page,'source-sheet');
await page.locator('#sourceClose').click();
await page.waitForFunction(()=>!document.querySelector('#sourceSheet')?.classList.contains('open'));
await page.waitForTimeout(320);
assert(Math.abs((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))-sourceY)<3,'Source changed reading position');
assert.match(await page.locator('#tutorialStep').innerText(),/LIKE/);

// LIKE -> NEXT.
await page.locator('.story-like').click();
assert(await page.locator('.story-like').evaluate(e=>e.classList.contains('active')));
assert.match(await page.locator('#tutorialStep').innerText(),/NEXT/);
await capture(page,'tutorial-like');

// NEXT: real left drag, changes article, resets scroll.
const firstId=await page.locator('.story-page').getAttribute('data-id');
await touchDrag(page,'#readerPanel',-150,2,220,[190,280]);
await page.waitForTimeout(360);
assert.notEqual(await page.locator('.story-page').getAttribute('data-id'),firstId,'NEXT did not advance');
assert((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))<3,'NEXT did not reset scroll');
assert.match(await page.locator('#tutorialStep').innerText(),/SAVE/);
await capture(page,'tutorial-next');

// SAVE: real right drag, stays on same article, completes Tutorial.
const savedId=await page.locator('.story-page').getAttribute('data-id');
await touchDrag(page,'#readerPanel',150,2,220,[190,280]);
await page.waitForTimeout(320);
assert.equal(await page.locator('.story-page').getAttribute('data-id'),savedId,'SAVE navigated away');
assert.equal(await page.locator('#tutorial.active').count(),0,'Tutorial did not complete');
await capture(page,'tutorial-complete');

// Menu remains an overlay utility and preserves article position.
await page.locator('#articleScroll').evaluate(e=>e.scrollTop=Math.min(280,e.scrollHeight-e.clientHeight));
const menuY=await page.locator('#articleScroll').evaluate(e=>e.scrollTop);
await page.locator('#menuButton').click();await page.waitForSelector('#drawer.open');await page.waitForTimeout(360);
assert.deepEqual(await page.locator('.drawer-row b').allTextContents(),['SAVED','LIKES','HISTORY','SETTINGS']);
await capture(page,'menu-dark');
await page.locator('[data-view="settings"]').click();assert.equal(await page.locator('[data-back]').count(),1);
await page.locator('[data-back]').click();assert.equal(await page.locator('.drawer-row').count(),4);
await page.locator('#drawerClose').click();await page.waitForFunction(()=>!document.querySelector('#drawer')?.classList.contains('open'));await page.waitForTimeout(360);
assert(Math.abs((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))-menuY)<3,'Menu changed reading position');

// Navigation keeps the CARDS state and does not replay Opening.
const navId=await page.locator('.story-page').getAttribute('data-id');
const navY=await page.locator('#articleScroll').evaluate(e=>e.scrollTop);
await page.locator('[data-mode="live"]').click();assert.equal(await page.locator('#liveScreen.active').count(),1);
assert.equal(await page.locator('#opening.show').count(),0,'mode switch replayed Opening');
await page.locator('[data-mode="dive"]').click();assert.equal(await page.locator('#diveScreen.active').count(),1);
await page.locator('[data-mode="cards"]').click();assert.equal(await page.locator('#cardsScreen.active').count(),1);
assert.equal(await page.locator('.story-page').getAttribute('data-id'),navId);
assert(Math.abs((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))-navY)<3,'mode switch lost CARDS position');

// Quiet non-gesture alternatives exist for keyboard / assistive use.
await page.locator('#a11yNext').focus();
const alt=await page.locator('#a11yNext').boundingBox();assert(alt&&alt.width>=44&&alt.height>=40,'NEXT alternative is not keyboard-visible');
await page.locator('#articleScroll').focus();

// Light uses the same structure and current palette family.
await page.locator('#menuButton').click();await page.waitForSelector('#drawer.open');await page.waitForTimeout(320);
await page.locator('[data-view="settings"]').click();await page.locator('[data-theme="light"]').click();
assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),'light');
await page.locator('#drawerClose').click();await page.waitForFunction(()=>!document.querySelector('#drawer')?.classList.contains('open'));
await page.waitForTimeout(1300); // let drawer and prior navigation toast fully settle before visual evidence
await page.locator('#articleScroll').evaluate(e=>e.scrollTop=0);
await capture(page,'cards-light');

// Ordinary launch = Micro Opening (~0.55 s candidate), no Tutorial restart.
await page.goto(`${BASE}/demos/day2-baseline/`,{waitUntil:'domcontentloaded'});
await page.waitForSelector('#opening.show.micro');
await capture(page,'micro-opening');
await page.waitForFunction(()=>!document.querySelector('#opening')?.classList.contains('show'),null,{timeout:2000});
assert.equal(await page.locator('#tutorial.active').count(),0,'ordinary launch restarted Tutorial');

// Landscape shell remains usable; DIVE internals are intentionally out of scope.
await page.setViewportSize({width:844,height:390});await page.waitForTimeout(180);
assert((await page.evaluate(()=>document.documentElement.scrollWidth))<=844,'landscape horizontal overflow');
assert(await page.locator('#menuButton').isVisible());assert(await page.locator('.feed-nav').isVisible());assert(await page.locator('.story-page').isVisible());
await capture(page,'landscape');
await context.close();

// Reduced Motion still reaches usable CARDS / Tutorial state.
{
  const rm=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
  const p=await rm.newPage();
  await p.goto(`${BASE}/demos/day2-baseline/?reset=1`,{waitUntil:'domcontentloaded'});
  assert(await p.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches));
  await p.waitForSelector('#tutorial.active',{timeout:1800});
  assert(await p.locator('.story-page').isVisible());
  await rm.close();
}

console.log('Day 2 baseline-preserving UI prototype QA: PASS');
await browser.close();
