import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const browser = await chromium.launch({headless:true});
const page = await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});

const drag = async (selector, dx, dy, duration=180) => {
  const box = await page.locator(selector).boundingBox();
  assert(box, `missing ${selector}`);
  const sx=box.x+box.width/2, sy=box.y+box.height/2;
  await page.mouse.move(sx,sy);
  await page.mouse.down();
  const steps=8;
  for(let i=1;i<=steps;i++){
    await page.mouse.move(sx+dx*i/steps,sy+dy*i/steps);
    await page.waitForTimeout(duration/steps);
  }
  await page.mouse.up();
};

await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
await page.evaluate(()=>localStorage.clear());
await page.reload({waitUntil:'domcontentloaded'});

await page.waitForSelector('#splash:not(.hidden)');
const opacityBefore = await page.locator('#splashBird').evaluate(el=>getComputedStyle(el).opacity);
assert.equal(opacityBefore,'1');
const splashBox = await page.locator('#splashBird').boundingBox();
assert(splashBox);
await page.mouse.move(splashBox.x+splashBox.width/2,splashBox.y+splashBox.height/2);
await page.mouse.down();
await page.mouse.move(splashBox.x+splashBox.width/2,splashBox.y+splashBox.height/2-35,{steps:3});
const opacityDuring = await page.locator('#splashBird').evaluate(el=>getComputedStyle(el).opacity);
assert.equal(opacityDuring,'1');
await page.mouse.move(splashBox.x+splashBox.width/2,splashBox.y+splashBox.height/2-135,{steps:5});
await page.mouse.up();
await page.waitForFunction(()=>document.querySelector('#splash')?.classList.contains('hidden'),null,{timeout:5000});

await page.waitForSelector('#tutorial:not(.hidden)');
await drag('#tutorialCard',-100,0);
await page.waitForTimeout(380);
await drag('#tutorialCard',100,0);
await page.waitForTimeout(380);
await drag('#tutorialCard',0,110);
await page.waitForFunction(()=>document.querySelector('#tutorial')?.classList.contains('hidden'),null,{timeout:1500});

const tabs = await page.locator('.feed-tab').allTextContents();
assert.deepEqual(tabs.map(x=>x.trim()),['FOR YOU','HOT','DIVE']);
assert.equal(await page.locator('[data-tab="must"]').count(),0);
assert.equal(await page.locator('#menuButton').count(),1);
assert.equal(await page.locator('.news-card .card-count').count(),1);

const nav = await page.locator('.feed-nav').boundingBox();
const hot = await page.locator('[data-tab="hot"]').boundingBox();
assert(nav&&hot);
assert(Math.abs((hot.x+hot.width/2)-(nav.x+nav.width/2))<2.5,'HOT is not centered');

await drag('.news-card[data-pos="0"]',100,0);
await page.waitForSelector('#detail.open');
assert((await page.locator('#detailScroll').evaluate(el=>el.scrollTop))<4);
await page.locator('#detailScroll').evaluate(el=>{el.scrollTop=360});
await page.waitForTimeout(350);
assert((await page.locator('#detailScroll').evaluate(el=>el.scrollTop))>250,'detail scroll reset');
assert((await page.locator('.news-section h2').first().evaluate(el=>parseFloat(getComputedStyle(el).fontSize)))>=18);
assert.equal(await page.locator('.quoted-news').count(),1);
assert.equal(await page.locator('#detailBackHint').count(),1);

await drag('#detailScroll',105,0);
await page.waitForFunction(()=>!document.querySelector('#detail')?.classList.contains('open'),null,{timeout:1500});

const savedId = await page.locator('.news-card[data-pos="0"]').getAttribute('data-id');
await drag('.news-card[data-pos="0"]',0,110);
await page.waitForTimeout(420);
const saved = await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]'));
assert(saved.includes(savedId),'down swipe did not save');

await page.click('#menuButton');
await page.waitForSelector('#drawer.open');
const drawerText=await page.locator('#drawerBody').innerText();
for(const label of ['LIKED','SAVED','INTERESTS','APPEARANCE']) assert(drawerText.includes(label));
assert((await page.locator('.drawer-article').count())>0,'history is empty after swipes');
await page.click('#drawerBackdrop',{position:{x:350,y:200}});
await page.waitForFunction(()=>!document.querySelector('#drawer')?.classList.contains('open'));

await page.click('[data-tab="dive"]');
await page.waitForSelector('#diveScreen.active');
assert.equal(await page.locator('.dive-choice').count(),3);
const firstTheme = await page.locator('#diveTheme').textContent();
await page.locator('.dive-choice').first().click();
await page.waitForTimeout(700);
const nextTheme = await page.locator('#diveTheme').textContent();
assert.notEqual(nextTheme,firstTheme);
await drag('#diveScreen',0,130);
await page.waitForTimeout(250);
assert(await page.locator('#cardsScreen').evaluate(el=>el.classList.contains('active')),'DIVE did not return to surface');

console.log('KINGFISHER v12 smoke: PASS');
await browser.close();