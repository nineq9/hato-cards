import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const BASE=process.env.BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});

for(const vp of [{w:320,h:568},{w:390,h:844},{w:844,h:390}]){
  const context=await browser.newContext({viewport:{width:vp.w,height:vp.h},isMobile:vp.w<500,hasTouch:vp.w<500});
  const page=await context.newPage();
  await page.goto(`${BASE}/demos/day2-baseline/`,{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>{
    localStorage.setItem('kawasemiDay2Seen','1');
    localStorage.setItem('kawasemiDay2Theme','dark');
    localStorage.removeItem('kawasemiDay2TutorialDone');
  });
  await page.goto(`${BASE}/demos/day2-baseline/?tutorial=1`,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('#tutorial.active');
  await page.waitForTimeout(700);
  const geometry=await page.evaluate(()=>{
    const guide=document.querySelector('.tutorial-guide').getBoundingClientRect();
    const source=document.querySelector('.story-source-button').getBoundingClientRect();
    const card=document.querySelector('.story-page').getBoundingClientRect();
    return {guideBottom:guide.bottom,sourceTop:source.top,cardTop:card.top,overflow:document.documentElement.scrollWidth>innerWidth+1};
  });
  assert.equal(geometry.overflow,false,`${vp.w}x${vp.h}: horizontal overflow`);
  assert.ok(geometry.cardTop>=geometry.guideBottom+4,`${vp.w}x${vp.h}: Tutorial guide covers article card (${geometry.cardTop} < ${geometry.guideBottom}+4)`);
  assert.ok(geometry.sourceTop>=geometry.guideBottom+4,`${vp.w}x${vp.h}: Tutorial guide covers Source control (${geometry.sourceTop} < ${geometry.guideBottom}+4)`);
  await page.locator('#tutorialSkip').click();
  await page.locator('#menuButton').click();
  await page.waitForSelector('#drawer.open');
  const mark=await page.locator('.drawer-mark').evaluate(el=>getComputedStyle(el).color);
  assert.equal(mark,'rgb(17, 137, 149)',`${vp.w}x${vp.h}: drawer kingfisher accent drifted from production teal`);
  await context.close();
}

console.log('Day 2 visual guard: PASS');
await browser.close();
