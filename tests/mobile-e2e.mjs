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
  const matrix=await page.locator('#readerPanel').evaluate(e=>{
    const transform=getComputedStyle(e).transform;
    if(transform==='none')return {a:1,b:0,c:0,d:1,e:0,f:0,transform};
    const m=new DOMMatrixReadOnly(transform);
    return {a:m.a,b:m.b,c:m.c,d:m.d,e:m.e,f:m.f,transform};
  });
  const settled=Math.abs(matrix.a-1)<.005&&Math.abs(matrix.d-1)<.005&&Math.abs(matrix.b)<.005&&Math.abs(matrix.c)<.005&&Math.abs(matrix.e)<.5&&Math.abs(matrix.f)<.5;
  assert(settled,`${label}: stale reader transform ${matrix.transform}`);
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

// NEXT and SAVE + ADVANCE at top/middle/end, including natural thumb arcs.
const ARC_LEFT=[[-14,-8],[-34,-17],[-58,-25],[-86,-31],[-118,-36],[-150,-39]];
const ARC_RIGHT=ARC_LEFT.map(([x,y])=>[-x,y]);
for(const p of ['top','middle','end']){
  const savePage=await fresh();await pos(savePage,p);const saveId=await savePage.locator('.story-page').getAttribute('data-id');
  await touchPath(savePage,'#articleScroll',ARC_RIGHT,{duration:250,pos:[190,300]});await savePage.waitForTimeout(520);
  assert((await savePage.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]'))).includes(saveId),`arc SAVE failed at ${p}`);
  assert.notEqual(await savePage.locator('.story-page').getAttribute('data-id'),saveId,`arc SAVE did not advance at ${p}`);
  assert((await savePage.locator('#articleScroll').evaluate(e=>e.scrollTop))<3,`arc SAVE leaked scroll at ${p}`);await neutral(savePage,`arc SAVE ${p}`);await savePage.close();
  const nextPage=await fresh();await pos(nextPage,p);const nextId=await nextPage.locator('.story-page').getAttribute('data-id');
  await touchPath(nextPage,'#articleScroll',ARC_LEFT,{duration:250,pos:[190,300]});await nextPage.waitForTimeout(520);
  assert.notEqual(await nextPage.locator('.story-page').getAttribute('data-id'),nextId,`arc NEXT failed at ${p}`);
  assert((await nextPage.locator('#articleScroll').evaluate(e=>e.scrollTop))<3,`arc NEXT leaked scroll at ${p}`);await neutral(nextPage,`arc NEXT ${p}`);await nextPage.close();
}

// Ambiguous diagonal must cancel rather than commit.
{
  const page=await fresh();const id=await page.locator('.story-page').getAttribute('data-id');const saved0=(await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]'))).length;
  await touchPath(page,'#articleScroll',[[16,-12],[32,-25],[48,-37],[65,-50],[78,-61]],{duration:320,pos:[190,320]});await page.waitForTimeout(300);
  assert.equal(await page.locator('.story-page').getAttribute('data-id'),id,'ambiguous diagonal incorrectly advanced');
  assert.equal((await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]'))).length,saved0,'ambiguous diagonal incorrectly saved');await neutral(page,'ambiguous diagonal cancel');await page.close();
}

// Mixed imperfect gestures must not leave stale state.// Mixed imperfect gestures must not leave stale state.
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

// Finite CARDS session must remain stable through repeated NEXT and reach caught-up state.
{
  const page=await fresh();
  const seen=new Set();let advances=0;
  while(await page.locator('.story-page').count()){
    const id=await page.locator('.story-page').getAttribute('data-id');
    assert(id&&!seen.has(id),`finite queue looped on ${id}`);seen.add(id);
    await touchPath(page,'#articleScroll',straight(-150,2),{duration:190,pos:[180,300]});await page.waitForTimeout(460);
    advances++;
    assert(advances<30,'finite queue did not reach caught-up state');
    if(await page.locator('.story-page').count()){
      assert((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))<3,`repeated NEXT ${advances} leaked scroll position`);
      await neutral(page,`repeated NEXT ${advances}`);
    }
  }
  assert(advances>1,'caught-up journey did not exercise multiple cards');
  assert.equal(await page.locator('.clear-card').count(),1,'finite queue did not render caught-up/CLEAR state');assert.equal((await page.locator('.clear-card').innerText()).trim(),'CLEAR!','caught-up text must be CLEAR!');
  await capture(page,'caught-up');await page.close();
}

// Menu fixed regions + anywhere RIGHT→LEFT close; underlying article must not NEXT.
{
  const page=await fresh();const id=await page.locator('.story-page').getAttribute('data-id');await page.click('#menuButton');await page.waitForSelector('#drawer.open');
  assert.equal(await page.locator('.drawer-fixed-top [data-view="liked"]').count(),1);assert.equal(await page.locator('.drawer-fixed-top [data-view="saved"]').count(),1);assert.equal(await page.locator('.drawer-fixed-bottom [data-view="settings"]').count(),1);
  const h=page.locator('.drawer-history');await h.evaluate(e=>{const row=e.querySelector('.drawer-article');if(row){for(let i=0;i<80;i++)e.append(row.cloneNode(true));}e.scrollTop=e.scrollHeight;});
  const topBox=await page.locator('.drawer-fixed-top').boundingBox(),bottomBox=await page.locator('.drawer-fixed-bottom').boundingBox();assert(topBox&&bottomBox&&bottomBox.y+bottomBox.height<=845,'fixed menu regions escaped viewport');
  await touchPath(page,'#drawer',[[-18,1],[-48,2],[-90,3],[-140,3]],{duration:220,pos:[220,390]});await page.waitForTimeout(360);
  assert.equal(await page.locator('#drawer.open').count(),0,'menu anywhere-left close failed');assert.equal(await page.locator('.story-page').getAttribute('data-id'),id,'menu close leaked article NEXT');
  await page.close();
}

// Tutorial journey uses real reader// Tutorial journey uses real reader, real end LIKE, NEXT and SAVE. Capture key visual states.
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
  const saveId=await page.locator('.story-page').getAttribute('data-id');
  await touchPath(page,'#articleScroll',ARC_RIGHT,{duration:250,pos:[180,300]});await page.waitForTimeout(520);
  assert((await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]'))).includes(saveId),'tutorial SAVE did not persist');
  assert.notEqual(await page.locator('.story-page').getAttribute('data-id'),saveId,'tutorial SAVE did not advance');
  assert((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))<3,'tutorial SAVE next card not at top');
  await page.waitForFunction(()=>document.querySelector('#tutorial')?.classList.contains('hidden'),null,{timeout:1600});
  await capture(page,'tutorial-complete');await page.close();
}

console.log('Issue #4 human-like mobile E2E: PASS');
await browser.close();
