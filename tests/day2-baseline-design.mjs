import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const BASE=process.env.BASE_URL||'http://127.0.0.1:4173';
fs.mkdirSync('test-output',{recursive:true});
const browser=await chromium.launch({headless:true});

async function screenshot(page,name){await page.screenshot({path:`test-output/day2-baseline-${name}.png`,fullPage:false});}
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

// Capture current production CARDS as the visual baseline. This is read-only QA.
{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.goto(`${BASE}/`,{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>{localStorage.setItem('kingfisherIntroVersion','kingfisher-intro-v8');localStorage.setItem('kingfisherTutorialDone','1');localStorage.setItem('kingfisherTheme','dark')});
  await page.reload({waitUntil:'domcontentloaded'});
  const bird=await page.locator('#splashBird').boundingBox();assert(bird,'production splash bird missing');
  await page.mouse.move(bird.x+bird.width/2,bird.y+bird.height/2);await page.mouse.down();
  await page.mouse.move(bird.x+bird.width/2,bird.y+bird.height/2-160,{steps:12});await page.mouse.up();
  await page.waitForFunction(()=>document.querySelector('#splash')?.classList.contains('hidden'),null,{timeout:7000});
  await page.waitForSelector('.story-page');
  assert.equal(await page.locator('.feed-tab').allTextContents().then(x=>x.join('|')),'FOR YOU|HOT|DIVE');
  await screenshot(page,'production-current');
  await context.close();
}

// Fresh first launch: Full Opening -> real CARDS-shaped Tutorial.
const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
const page=await context.newPage();
await page.goto(`${BASE}/demos/day2-baseline/?reset=1`,{waitUntil:'domcontentloaded'});
await page.waitForSelector('#opening.show');
assert(!(await page.locator('#opening').evaluate(e=>e.classList.contains('micro'))),'fresh launch must use Full Opening');
await screenshot(page,'full-opening');
await page.waitForSelector('#tutorial.active',{timeout:3500});
assert.match(await page.locator('#tutorialStep').innerText(),/READ/);
assert.equal(await page.locator('.feed-tab').allTextContents().then(x=>x.join('|')),'CARDS|LIVE|DIVE');
assert.equal(await page.locator('.feed-tab[aria-current="page"]').innerText(),'CARDS');
assert.equal(await page.locator('.story-page').count(),1);
await screenshot(page,'tutorial-read-dark');

// READ to actual article end (state transition driven by real article scroll position).
await page.locator('#articleScroll').evaluate(e=>{e.scrollTop=e.scrollHeight});
await page.waitForFunction(()=>document.querySelector('#tutorialStep')?.textContent.includes('SOURCE'));
assert.match(await page.locator('#tutorialText').innerText(),/SOURCE/);
const sourceY=await page.locator('#articleScroll').evaluate(e=>e.scrollTop);
await screenshot(page,'tutorial-source');

// SOURCE opens a sheet and returns to exact reading position.
await page.locator('.story-source-card').click();
await page.waitForSelector('#sourceSheet.open');
assert(await page.locator('#sourceTitle').innerText());
await screenshot(page,'source-sheet');
await page.locator('#sourceClose').click();
await page.waitForFunction(()=>!document.querySelector('#sourceSheet')?.classList.contains('open'));
assert(Math.abs((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))-sourceY)<3,'Source close changed reading position');
assert.match(await page.locator('#tutorialStep').innerText(),/LIKE/);

// LIKE is the real article-end heart.
await page.locator('.story-like').click();
assert(await page.locator('.story-like').evaluate(e=>e.classList.contains('active')));
assert.match(await page.locator('#tutorialStep').innerText(),/NEXT/);
await screenshot(page,'tutorial-like');

// NEXT is a real left drag in the isolated CARDS-shaped reader.
const firstId=await page.locator('.story-page').getAttribute('data-id');
await touchDrag(page,'#readerPanel',-150,2,220,[190,280]);
await page.waitForTimeout(320);
assert.notEqual(await page.locator('.story-page').getAttribute('data-id'),firstId,'Tutorial NEXT did not advance');
assert((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))<3,'NEXT did not start next article at top');
assert.match(await page.locator('#tutorialStep').innerText(),/SAVE/);
await screenshot(page,'tutorial-next');

// SAVE is a real right drag and stays on current article.
const savedId=await page.locator('.story-page').getAttribute('data-id');
await touchDrag(page,'#readerPanel',150,2,220,[190,280]);
await page.waitForTimeout(260);
assert.equal(await page.locator('.story-page').getAttribute('data-id'),savedId,'SAVE navigated away');
assert.equal(await page.locator('#tutorial.active').count(),0,'Tutorial did not complete after SAVE');
await screenshot(page,'tutorial-complete');

// Menu is utility overlay. Subview has Back; closing preserves article and scroll position.
await page.locator('#articleScroll').evaluate(e=>e.scrollTop=Math.min(280,e.scrollHeight-e.clientHeight));
const menuY=await page.locator('#articleScroll').evaluate(e=>e.scrollTop);
await page.locator('#menuButton').click();await page.waitForSelector('#drawer.open');
assert.equal(await page.locator('.drawer-row').allTextContents().then(x=>x.map(s=>s.trim()).join('|')),'SAVED›|LIKES›|HISTORY›|SETTINGS›');
await screenshot(page,'menu-dark');
await page.locator('[data-view="settings"]').click();
assert.equal(await page.locator('[data-back]').count(),1,'menu subview has no explicit Back');
await page.locator('[data-back]').click();
assert.equal(await page.locator('.drawer-row').count(),4,'Back did not return to menu root');
await page.locator('#drawerClose').click();
await page.waitForFunction(()=>!document.querySelector('#drawer')?.classList.contains('open'));
assert(Math.abs((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))-menuY)<3,'Menu changed reading position');

// Navigation: no opening replay, CARDS state survives mode switch.
const navId=await page.locator('.story-page').getAttribute('data-id');
const navY=await page.locator('#articleScroll').evaluate(e=>e.scrollTop);
await page.locator('[data-mode="live"]').click();assert.equal(await page.locator('#liveScreen.active').count(),1);
assert.equal(await page.locator('#opening.show').count(),0,'in-app navigation replayed Opening');
await page.locator('[data-mode="dive"]').click();assert.equal(await page.locator('#diveScreen.active').count(),1);
await page.locator('[data-mode="cards"]').click();assert.equal(await page.locator('#cardsScreen.active').count(),1);
assert.equal(await page.locator('.story-page').getAttribute('data-id'),navId);
assert(Math.abs((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))-navY)<3,'CARDS scroll position lost across mode switch');

// Accessible non-gesture NEXT/SAVE controls exist and become visible on keyboard focus.
await page.locator('#a11yNext').focus();
const a11yBox=await page.locator('#a11yNext').boundingBox();assert(a11yBox&&a11yBox.height>=40&&a11yBox.width>=44,'keyboard NEXT alternative not visible/focusable');
await page.locator('#articleScroll').focus();

// LIGHT uses same structure; change via the real Settings utility.
await page.locator('#menuButton').click();await page.locator('[data-view="settings"]').click();await page.locator('[data-theme="light"]').click();
assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),'light');
await page.locator('#drawerClose').click();await page.waitForFunction(()=>!document.querySelector('#drawer')?.classList.contains('open'));
await page.locator('#articleScroll').evaluate(e=>e.scrollTop=0);
await screenshot(page,'cards-light');

// Ordinary reload after first launch shows Micro Opening and not Tutorial.
await page.reload({waitUntil:'domcontentloaded'});
await page.waitForSelector('#opening.show.micro');
await screenshot(page,'micro-opening');
await page.waitForFunction(()=>!document.querySelector('#opening')?.classList.contains('show'),null,{timeout:2000});
assert.equal(await page.locator('#tutorial.active').count(),0,'ordinary launch unexpectedly restarted Tutorial');

// Landscape shell: no horizontal page overflow and key shell controls remain reachable.
await page.setViewportSize({width:844,height:390});
await page.waitForTimeout(120);
assert((await page.evaluate(()=>document.documentElement.scrollWidth))<=844,'landscape page overflows horizontally');
assert(await page.locator('#menuButton').isVisible());
assert(await page.locator('.feed-nav').isVisible());
assert(await page.locator('.story-page').isVisible());
await screenshot(page,'landscape');
await context.close();

// Reduced Motion: prototype still settles into usable CARDS without depending on long travel.
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
