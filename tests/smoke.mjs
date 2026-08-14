import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
fs.mkdirSync('test-output',{recursive:true});
const browser=await chromium.launch({headless:true});

async function drag(page,selector,dx,dy,duration=180,pos=null){
  const box=await page.locator(selector).boundingBox();
  assert(box,`missing ${selector}`);
  const sx=box.x+(pos?pos[0]:box.width/2),sy=box.y+(pos?pos[1]:box.height/2);
  await page.mouse.move(sx,sy);await page.mouse.down();
  for(let i=1;i<=10;i++){await page.mouse.move(sx+dx*i/10,sy+dy*i/10);await page.waitForTimeout(duration/10)}
  await page.mouse.up();
}
async function boot(page,{tutorial=false}={}){
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>localStorage.clear());
  if(!tutorial) await page.evaluate(()=>{localStorage.setItem('kingfisherIntroVersion','kingfisher-intro-v6');localStorage.setItem('kingfisherTutorialDone','1')});
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForSelector('#splash:not(.hidden)');
  assert.equal(await page.locator('#waterVeil').evaluate(e=>getComputedStyle(e).display),'none');
  const bird=await page.locator('#splashBird').boundingBox();assert(bird);
  await page.mouse.move(bird.x+bird.width/2,bird.y+bird.height/2);await page.mouse.down();
  await page.mouse.move(bird.x+bird.width/2,bird.y+bird.height/2-140,{steps:8});
  assert(Number(await page.locator('#splashBird').evaluate(e=>getComputedStyle(e).opacity))>.9);
  await page.mouse.up();
  await page.waitForFunction(()=>document.querySelector('#splash')?.classList.contains('hidden'),null,{timeout:5500});
  if(tutorial){
    await page.waitForSelector('#tutorial:not(.hidden)');
    await drag(page,'#tutorialCard',-100,0);await page.waitForTimeout(340);
    await drag(page,'#tutorialCard',100,0);await page.waitForTimeout(340);
    assert((await page.locator('#tutorialHint').innerText()).includes('下'));
    await drag(page,'#tutorialCard',0,110);
    await page.waitForFunction(()=>document.querySelector('#tutorial')?.classList.contains('hidden'),null,{timeout:1700});
  }
}

const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
await boot(page,{tutorial:true});
assert.equal(await page.locator('#actionDock').count(),0);
assert.equal(await page.locator('.action-button').count(),0);
assert.equal(await page.locator('.news-card[data-pos="0"] .card-gesture-strip').count(),1);
assert.equal(await page.locator('.news-card[data-pos="0"]').evaluate(e=>getComputedStyle(e).transform),'matrix(1, 0, 0, 1, 0, 0)');
if(await page.locator('.news-card').count()>=3){
  const transforms=await page.locator('.news-card').evaluateAll(ns=>ns.map(n=>getComputedStyle(n).transform));
  assert.equal(new Set(transforms).size,3);
}
assert(Number(await page.locator('.card-copy p').first().evaluate(e=>parseFloat(getComputedStyle(e).fontSize)))>=14);
assert(Number(await page.locator('.card-count span').first().evaluate(e=>parseFloat(getComputedStyle(e).fontSize)))>=15);

const upId=await page.locator('.news-card[data-pos="0"]').getAttribute('data-id');
await drag(page,'.news-card[data-pos="0"]',0,-115);await page.waitForTimeout(280);
assert.equal(await page.locator('.news-card[data-pos="0"]').getAttribute('data-id'),upId);
assert(!(await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]'))).includes(upId),'up swipe must not save');
await drag(page,'.news-card[data-pos="0"]',0,115);await page.waitForTimeout(380);
assert((await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]'))).includes(upId),'down swipe must save');

await drag(page,'.news-card[data-pos="0"]',110,0);await page.waitForSelector('#detail.open');
const pads=await page.locator('.detail-body').evaluate(e=>[parseFloat(getComputedStyle(e).paddingLeft),parseFloat(getComputedStyle(e).paddingRight),parseFloat(getComputedStyle(e).paddingTop)]);
assert(Math.abs(pads[0]-pads[1])<.1&&pads[2]>=24);
await page.locator('#detailScroll').evaluate(e=>e.scrollTop=320);await page.waitForTimeout(250);
assert((await page.locator('#detailScroll').evaluate(e=>e.scrollTop))>240,'detail scroll reset');
await drag(page,'#detailScroll',115,0,190,[180,360]);
await page.waitForFunction(()=>!document.querySelector('#detail')?.classList.contains('open'),null,{timeout:1600});
await drag(page,'.news-card[data-pos="0"]',110,0);await page.waitForSelector('#detail.open');
assert.equal(await page.locator('#detailReturnHandle').count(),1);
await drag(page,'#detailReturnHandle',110,0);
await page.waitForFunction(()=>!document.querySelector('#detail')?.classList.contains('open'),null,{timeout:1600});

await page.mouse.move(3,300);await page.mouse.down();await page.mouse.move(120,300,{steps:9});await page.mouse.up();await page.waitForSelector('#drawer.open');
const settings=await page.locator('[data-view="settings"]').boundingBox();assert(settings&&settings.width>250);
await page.mouse.click(settings.x+settings.width-12,settings.y+settings.height/2);assert((await page.locator('.settings-group').count())>=3);
await page.click('#drawerBackdrop',{position:{x:380,y:200}});await page.waitForFunction(()=>!document.querySelector('#drawer')?.classList.contains('open'));
await page.click('#menuButton');await page.waitForSelector('#drawer.open');assert.equal(await page.locator('.settings-group').count(),0);assert.equal(await page.locator('[data-view="saved"] .drawer-save-icon svg').count(),1);
await page.click('#drawerBackdrop',{position:{x:380,y:200}});await page.waitForFunction(()=>!document.querySelector('#drawer')?.classList.contains('open'));

await page.click('[data-tab="dive"]');await page.waitForSelector('#diveScreen.active');await drag(page,'#diveScreen',0,130);await page.waitForTimeout(260);assert(await page.locator('#cardsScreen').evaluate(e=>e.classList.contains('active')));
await page.close();

for(const [w,h] of [[375,667],[390,844],[430,932]]){
  const p=await browser.newPage({viewport:{width:w,height:h},isMobile:true,hasTouch:true});await boot(p);
  const c=await p.locator('.news-card[data-pos="0"]').boundingBox(),n=await p.locator('.feed-nav').boundingBox();assert(c&&n);
  assert(c.y+c.height<=n.y+1,`${w} card/nav overlap`);assert(n.y-(c.y+c.height)<40,`${w} excessive card bottom gap`);
  assert.equal(await p.locator('#actionDock').count(),0);
  await p.screenshot({path:`test-output/v15-${w}x${h}.png`});await p.close();
}
console.log('KINGFISHER v15 smoke: PASS');await browser.close();
