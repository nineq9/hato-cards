import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
fs.mkdirSync('test-output',{recursive:true});

const browser = await chromium.launch({headless:true});

const drag = async (page, selector, dx, dy, duration=180) => {
  const box = await page.locator(selector).boundingBox();
  assert(box, `missing ${selector}`);
  const sx=box.x+box.width/2, sy=box.y+box.height/2;
  await page.mouse.move(sx,sy); await page.mouse.down();
  const steps=8;
  for(let i=1;i<=steps;i++){await page.mouse.move(sx+dx*i/steps,sy+dy*i/steps);await page.waitForTimeout(duration/steps);}
  await page.mouse.up();
};

async function enterApp(page,{tutorial=true}={}){
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>localStorage.clear());
  if(!tutorial) await page.evaluate(()=>{
    localStorage.setItem('kingfisherIntroVersion','kingfisher-intro-v4');
    localStorage.setItem('kingfisherTutorialDone','1');
  });
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForSelector('#splash:not(.hidden)');
  assert.equal(await page.locator('#splashBird').evaluate(el=>getComputedStyle(el).opacity),'1');
  const b=await page.locator('#splashBird').boundingBox();assert(b);
  await page.mouse.move(b.x+b.width/2,b.y+b.height/2);await page.mouse.down();
  await page.mouse.move(b.x+b.width/2,b.y+b.height/2-130,{steps:7});
  assert.equal(await page.locator('#splashBird').evaluate(el=>getComputedStyle(el).opacity),'1');
  await page.mouse.up();
  await page.waitForFunction(()=>document.querySelector('#splash')?.classList.contains('hidden'),null,{timeout:5500});
  if(tutorial){
    await page.waitForSelector('#tutorial:not(.hidden)');
    await drag(page,'#tutorialCard',-100,0); await page.waitForTimeout(360);
    await drag(page,'#tutorialCard',100,0); await page.waitForTimeout(360);
    await drag(page,'#tutorialCard',0,-110);
    await page.waitForFunction(()=>document.querySelector('#tutorial')?.classList.contains('hidden'),null,{timeout:1600});
  }else{
    assert(await page.locator('#tutorial').evaluate(el=>el.classList.contains('hidden')),'tutorial unexpectedly visible in skipped state');
  }
}

async function core(page,label){
  const tabs=await page.locator('.feed-tab').allTextContents();assert.deepEqual(tabs.map(x=>x.trim()),['FOR YOU','HOT','DIVE']);
  const nav=await page.locator('.feed-nav').boundingBox(),hot=await page.locator('[data-tab="hot"]').boundingBox();assert(nav&&hot);assert(Math.abs((hot.x+hot.width/2)-(nav.x+nav.width/2))<2.5,`${label}: HOT not centered`);
  assert.equal(await page.locator('.news-card .swipe-cue').count(),0,`${label}: old card cues remain`);
  assert.equal(await page.locator('.news-card .gesture-label').count(),0,`${label}: old gesture labels remain`);
  assert.equal(await page.locator('.card-count svg').count(),0,`${label}: card count still uses decorative SVG digits`);
  assert((await page.locator('.card-copy p').first().evaluate(el=>parseFloat(getComputedStyle(el).fontSize)))>=13.8,`${label}: summary text too small`);
  const card=await page.locator('.news-card[data-pos="0"]').boundingBox(),title=await page.locator('.news-card[data-pos="0"] h2').boundingBox();assert(card&&title);const lm=title.x-card.x,rm=(card.x+card.width)-(title.x+title.width);assert(Math.abs(lm-rm)<2.5,`${label}: title margins not balanced`);
  const transforms=await page.locator('.news-card').evaluateAll(nodes=>nodes.map(n=>getComputedStyle(n).transform));assert(new Set(transforms).size>1,`${label}: stacked cards have identical transforms`);
  assert((await page.locator('.card-source-row').first().innerText()).length>2,`${label}: source missing on card`);
  await page.screenshot({path:'test-output/390-card.png',fullPage:false});

  await drag(page,'.news-card[data-pos="0"]',105,0);await page.waitForSelector('#detail.open');
  assert((await page.locator('#detailScroll').evaluate(el=>el.scrollTop))<4,`${label}: detail did not open at top`);
  assert.equal(await page.locator('#detailDek').count(),0,`${label}: duplicate detail dek remains in DOM`);
  assert.equal(await page.locator('.news-brief').count(),0,`${label}: obsolete duplicate news brief remains`);
  assert.equal(await page.locator('.news-section.overview').count(),1,`${label}: overview count not 1`);
  assert.equal(await page.locator('.quoted-news').count(),1,`${label}: source quote count not 1`);
  assert.equal(await page.locator('.quoted-news a').count(),1,`${label}: original source link missing`);
  assert.equal(await page.locator('#detailSwipeBar').count(),1,`${label}: swipe bar missing`);
  assert.equal(await page.locator('#detailBackHint').count(),0,`${label}: old textual return hint remains`);
  await page.screenshot({path:'test-output/390-detail.png',fullPage:false});
  await page.locator('#detailScroll').evaluate(el=>{el.scrollTop=320});await page.waitForTimeout(300);assert((await page.locator('#detailScroll').evaluate(el=>el.scrollTop))>240,`${label}: detail scroll reset`);
  await drag(page,'#detailSwipeBar',105,0);await page.waitForFunction(()=>!document.querySelector('#detail')?.classList.contains('open'),null,{timeout:1500});

  const savedId=await page.locator('.news-card[data-pos="0"]').getAttribute('data-id');await drag(page,'.news-card[data-pos="0"]',0,-110);await page.waitForTimeout(380);const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]'));assert(saved.includes(savedId),`${label}: upward save swipe failed`);

  await page.click('#menuButton');await page.waitForSelector('#drawer.open');let text=await page.locator('#drawerBody').innerText();assert(text.includes('設定'),`${label}: settings entry missing`);assert(text.includes('履歴'),`${label}: history missing`);await page.locator('[data-view="settings"]').click();text=await page.locator('#drawerBody').innerText();for(const s of ['言語','興味・好み','デザイン'])assert(text.includes(s),`${label}: settings missing ${s}`);await page.screenshot({path:'test-output/390-settings.png',fullPage:false});await page.locator('[data-lang="ru"]').click();assert.equal(await page.evaluate(()=>localStorage.getItem('kingfisherLanguage')),'ru');await page.locator('.drawer-back').click();await page.click('#drawerBackdrop',{position:{x:380,y:200}});await page.waitForFunction(()=>!document.querySelector('#drawer')?.classList.contains('open'));

  await page.mouse.move(3,300);await page.mouse.down();await page.mouse.move(115,300,{steps:8});await page.mouse.up();await page.waitForSelector('#drawer.open');await page.click('#drawerBackdrop',{position:{x:380,y:200}});await page.waitForFunction(()=>!document.querySelector('#drawer')?.classList.contains('open'));

  // Existing DIVE is regression-checked only. This does not validate or redesign DIVE.
  await page.click('[data-tab="dive"]');await page.waitForSelector('#diveScreen.active');await drag(page,'#diveScreen',0,130);await page.waitForTimeout(260);assert(await page.locator('#cardsScreen').evaluate(el=>el.classList.contains('active')),`${label}: legacy DIVE surface return broke`);
}

{
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  await enterApp(page,{tutorial:true});await core(page,'390x844');await page.screenshot({path:'test-output/390-home.png',fullPage:false});await page.close();
}

for(const [w,h] of [[375,667],[430,932]]){
  const page=await browser.newPage({viewport:{width:w,height:h},isMobile:true,hasTouch:true});
  await enterApp(page,{tutorial:false});
  assert(await page.locator('.news-card[data-pos="0"]').isVisible(),`${w}x${h}: card not visible`);
  const card=await page.locator('.news-card[data-pos="0"]').boundingBox(),dock=await page.locator('#actionDock').boundingBox(),nav=await page.locator('.feed-nav').boundingBox();assert(card&&dock&&nav);assert(card.y+card.height<=dock.y+2,`${w}x${h}: card overlaps action dock`);assert(dock.y+dock.height<=nav.y+3,`${w}x${h}: action dock overlaps nav`);
  await page.screenshot({path:`test-output/${w}x${h}.png`,fullPage:false});await page.close();
}

console.log('KINGFISHER v14 smoke: PASS');
await browser.close();