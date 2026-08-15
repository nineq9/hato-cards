import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
fs.mkdirSync('test-output',{recursive:true});
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
await page.goto('http://127.0.0.1:4173/demos/day2-shell/',{waitUntil:'domcontentloaded'});

const shot=async name=>page.screenshot({path:`test-output/day2-${name}.png`,fullPage:true});
async function touchDrag(selector,dx,dy,duration=220,pos=null){
  const box=await page.locator(selector).boundingBox();assert(box,`missing ${selector}`);
  const sx=box.x+(pos?pos[0]:box.width/2),sy=box.y+(pos?pos[1]:box.height/2);
  const cdp=await page.context().newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:sx,y:sy,radiusX:4,radiusY:4,force:1}]});
  for(let i=1;i<=10;i++){
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:sx+dx*i/10,y:sy+dy*i/10,radiusX:4,radiusY:4,force:1}]});
    await page.waitForTimeout(duration/10);
  }
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await cdp.detach();
}

assert.equal(await page.locator('.nav-item span').allTextContents().then(x=>x.join('|')),'CARDS|LIVE|DIVE');
assert.equal(await page.locator('.nav-item.active span').innerText(),'CARDS');
assert.equal(await page.locator('.app-header').innerText().then(t=>t.includes('KAWASEMI')),false,'ordinary header must not carry large app wordmark');
await shot('cards-light');

await page.locator('[data-theme-choice="dark"]').evaluate(e=>e.click());
assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
await shot('cards-dark');

await page.locator('#startTutorial').evaluate(e=>e.click());
assert(await page.locator('#tutorial').evaluate(e=>e.classList.contains('active')));
assert((await page.locator('#tutorialTitle').innerText()).includes('最後まで'));
await shot('tutorial-read');
await page.locator('#articleScroll').evaluate(e=>{e.scrollTop=e.scrollHeight;e.dispatchEvent(new Event('scroll'));});
await page.waitForTimeout(80);
assert((await page.locator('#tutorialStep').innerText()).includes('LIKE'));
await page.locator('#likeButton').click();
assert((await page.locator('#tutorialStep').innerText()).includes('NEXT'));
const before=await page.locator('.story-cover h1').innerText();
await touchDrag('#articleScroll',-125,2,210,[190,400]);
await page.waitForTimeout(520);
assert.notEqual(await page.locator('.story-cover h1').innerText(),before,'tutorial NEXT should use the real CARDS surface');
assert((await page.locator('#tutorialStep').innerText()).includes('SAVE'));
await touchDrag('#articleScroll',125,2,210,[190,400]);
await page.waitForTimeout(380);
assert.equal(await page.locator('#tutorial').evaluate(e=>e.classList.contains('active')),false,'tutorial should finish after real SAVE');
await shot('tutorial-complete');

await page.locator('#articleScroll').evaluate(e=>e.scrollTop=220);
const menuY=await page.locator('#articleScroll').evaluate(e=>e.scrollTop);
await page.locator('#menuButton').click();await page.waitForTimeout(320);
assert(await page.locator('#drawer').evaluate(e=>e.classList.contains('open')));
assert.equal(await page.locator('.drawer-item b').allTextContents().then(x=>x.join('|')),'保存|いいね|履歴|設定');
await shot('menu-dark');
await page.locator('#menuClose').click();await page.waitForTimeout(80);
assert(Math.abs((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))-menuY)<2,'menu must preserve reading position');

const source=page.locator('.source-card');await source.scrollIntoViewIfNeeded();await page.waitForTimeout(50);
const sourceY=await page.locator('#articleScroll').evaluate(e=>e.scrollTop);
await source.click();assert(await page.locator('#sourceSheet').evaluate(e=>e.classList.contains('open')));
await page.locator('#sourceClose').click();await page.waitForTimeout(80);
assert(Math.abs((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))-sourceY)<2,'source sheet must preserve reading position');

await page.locator('.nav-item[data-target="live"]').click();
assert.equal(await page.locator('.nav-item.active span').innerText(),'LIVE');
assert((await page.locator('#context').innerText()).includes('LIVE'));
await page.locator('.nav-item[data-target="dive"]').click();
assert.equal(await page.locator('.nav-item.active span').innerText(),'DIVE');
assert((await page.locator('#context').innerText()).includes('DIVE'));
await page.locator('.nav-item[data-target="cards"]').click();

await page.locator('#fullOpening').evaluate(e=>e.click());assert(await page.locator('#opening').evaluate(e=>e.classList.contains('show')));await page.waitForTimeout(1150);assert.equal(await page.locator('#opening').evaluate(e=>e.classList.contains('show')),false);
await page.locator('#microOpening').evaluate(e=>e.click());assert(await page.locator('#opening').evaluate(e=>e.classList.contains('show')&&e.classList.contains('micro')));await page.waitForTimeout(500);assert.equal(await page.locator('#opening').evaluate(e=>e.classList.contains('show')),false);

console.log('KAWASEMI Day 2 concrete UI prototype: PASS');
await browser.close();
