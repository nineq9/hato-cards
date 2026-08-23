import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

fs.mkdirSync('test-output',{recursive:true});
const browser=await chromium.launch({headless:true});

const PROFILES={
  A_RESPONSIVE:{neutralDistance:14,verticalActivation:14,verticalDominance:1.04,horizontalActivation:18,horizontalDominance:1.60,readBiasDistance:28,readBiasFloor:.72,commitRatio:.22,commitMin:82,commitMax:106,flickMinDistance:38,flickVelocity:.60,flickDominance:1.25,followRecovery:24,manualReadMinDistance:36},
  B_BALANCED:{neutralDistance:16,verticalActivation:16,verticalDominance:1.06,horizontalActivation:22,horizontalDominance:1.70,readBiasDistance:30,readBiasFloor:.78,commitRatio:.24,commitMin:88,commitMax:112,flickMinDistance:46,flickVelocity:.68,flickDominance:1.35,followRecovery:28,manualReadMinDistance:40},
  C_CONSERVATIVE:{neutralDistance:18,verticalActivation:18,verticalDominance:1.08,horizontalActivation:26,horizontalDominance:1.85,readBiasDistance:32,readBiasFloor:.84,commitRatio:.25,commitMin:92,commitMax:118,flickMinDistance:50,flickVelocity:.75,flickDominance:1.45,followRecovery:32,manualReadMinDistance:44}
};

const straight=(dx,dy,steps=10)=>Array.from({length:steps},(_,i)=>[dx*(i+1)/steps,dy*(i+1)/steps]);
const panelX=page=>page.locator('#readerPanel').evaluate(e=>{const t=getComputedStyle(e).transform;if(t==='none')return 0;return new DOMMatrixReadOnly(t).e;});

async function touchPath(page,selector,points,{duration=260,pos=null,sample=false}={}){
  const box=await page.locator(selector).boundingBox();assert(box,`missing ${selector}`);
  const sx=box.x+(pos?pos[0]:box.width/2),sy=box.y+(pos?pos[1]:box.height/2);
  const cdp=await page.context().newCDPSession(page);let maxPanelX=0;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:sx,y:sy,radiusX:4,radiusY:4,force:1}]});
  for(const [dx,dy] of points){
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:sx+dx,y:sy+dy,radiusX:4,radiusY:4,force:1}]});
    await page.waitForTimeout(duration/Math.max(1,points.length));
    if(sample)maxPanelX=Math.max(maxPanelX,Math.abs(await panelX(page)));
  }
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();
  return {maxPanelX};
}

async function splash(page){
  await page.waitForSelector('#splash:not(.hidden)');
  const bird=await page.locator('#splashBird').boundingBox();assert(bird);
  await page.mouse.move(bird.x+bird.width/2,bird.y+bird.height/2);await page.mouse.down();
  await page.mouse.move(bird.x+bird.width/2,bird.y+bird.height/2-155,{steps:12});await page.mouse.up();
  await page.waitForFunction(()=>document.querySelector('#splash')?.classList.contains('hidden'),null,{timeout:7000});
}

async function fresh(profile,{w=390,h=844}={}){
  const page=await browser.newPage({viewport:{width:w,height:h},isMobile:true,hasTouch:true});
  await page.addInitScript(p=>{window.__KAWASEMI_GESTURE_TUNING=p;},profile);
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>{localStorage.clear();localStorage.setItem('kingfisherIntroVersion','kingfisher-intro-v8');localStorage.setItem('kingfisherTutorialDone','1')});
  await page.reload({waitUntil:'domcontentloaded'});await splash(page);await page.waitForSelector('.story-page');return page;
}

async function setPos(page,p){
  await page.locator('#articleScroll').evaluate((e,p)=>{const max=Math.max(0,e.scrollHeight-e.clientHeight);e.scrollTop=p==='top'?0:p==='middle'?max*.48:max;},p);await page.waitForTimeout(70);
}
async function neutral(page,label){
  const x=Math.abs(await panelX(page));assert(x<.5,`${label}: stale reader transform ${x}px`);
}

const READ_CASES=[
  {name:'near-vertical-up',pos:'top',points:[[1,-20],[2,-62],[0,-125],[3,-215]],expect:'up',duration:260},
  {name:'slow-vertical-up',pos:'top',points:[[2,-18],[1,-45],[3,-82],[1,-128],[4,-190]],expect:'up',duration:520},
  {name:'fast-vertical-up',pos:'top',points:[[0,-38],[3,-105],[2,-205]],expect:'up',duration:145},
  {name:'vertical-down',pos:'middle',points:[[1,22],[2,65],[-1,120],[2,180]],expect:'down',duration:280},
  {name:'initial-right-wobble',pos:'top',points:[[12,-6],[15,-28],[13,-72],[16,-145],[13,-220]],expect:'up',duration:330},
  {name:'initial-left-wobble',pos:'top',points:[[-11,-7],[-15,-30],[-12,-78],[-16,-150],[-14,-225]],expect:'up',duration:330},
  {name:'owner-repro-early-horizontal',pos:'top',points:[[14,-10],[18,-30],[20,-62],[18,-105],[22,-155],[19,-215]],expect:'up',duration:330},
  {name:'20deg-vertical-diagonal',pos:'top',points:[[12,-42],[25,-82],[42,-128],[64,-190]],expect:'up',duration:300},
  {name:'35deg-vertical-diagonal',pos:'top',points:[[18,-32],[42,-68],[72,-112],[110,-170]],expect:'up',duration:320},
  {name:'mid-read-horizontal-wobble',pos:'top',points:[[1,-35],[3,-78],[18,-108],[8,-158],[15,-225]],expect:'up',duration:330}
];

async function readMatrix(profile){
  const page=await fresh(profile);let passed=0,maxJitter=0;const failures=[];
  for(const c of READ_CASES){
    await setPos(page,c.pos);const id=await page.locator('.story-page').getAttribute('data-id');const saved0=(await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]'))).length;const y0=await page.locator('#articleScroll').evaluate(e=>e.scrollTop);
    const {maxPanelX}=await touchPath(page,'#articleScroll',c.points,{duration:c.duration,pos:[190,520],sample:true});await page.waitForTimeout(160);
    const y1=await page.locator('#articleScroll').evaluate(e=>e.scrollTop),id1=await page.locator('.story-page').getAttribute('data-id');const saved1=(await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]'))).length;
    maxJitter=Math.max(maxJitter,maxPanelX);
    const moved=c.expect==='up'?y1>y0+20:y1<y0-20;const ok=moved&&id1===id&&saved1===saved0&&maxPanelX<1.5;
    if(ok)passed++;else failures.push({name:c.name,y0,y1,idChanged:id1!==id,savedChanged:saved1!==saved0,maxPanelX});
  }
  await page.close();return {passed,total:READ_CASES.length,maxJitter,failures};
}

async function activationProbe(profile){
  const page=await fresh(profile);const box=await page.locator('#articleScroll').boundingBox();assert(box);const sx=box.x+190,sy=box.y+310,steps=[8,12,16,20,24,28,32,36,44];const cdp=await page.context().newCDPSession(page);let activation=null,firstTransform=null;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:sx,y:sy,radiusX:4,radiusY:4,force:1}]});
  for(const dx of steps){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:sx+dx,y:sy+1,radiusX:4,radiusY:4,force:1}]});await page.waitForTimeout(38);const x=Math.abs(await panelX(page));if(activation===null&&x>.5){activation=dx;firstTransform=x;}}
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();await page.waitForTimeout(260);await page.close();return {activation,firstTransform};
}

async function saveAttempt(profile,distance,duration,dy=1){
  const page=await fresh(profile);const id=await page.locator('.story-page').getAttribute('data-id');await touchPath(page,'#articleScroll',duration<100?[[distance,dy]]:straight(distance,dy,8),{duration,pos:[190,320]});await page.waitForTimeout(360);const saved=(await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]'))).includes(id);await page.close();return saved;
}
async function nextAttempt(profile,distance,duration,dy=1){
  const page=await fresh(profile);const id=await page.locator('.story-page').getAttribute('data-id');await touchPath(page,'#articleScroll',duration<100?[[-distance,dy]]:straight(-distance,dy,8),{duration,pos:[190,320]});await page.waitForTimeout(480);const changed=(await page.locator('.story-page').getAttribute('data-id'))!==id;await page.close();return changed;
}

async function thresholdProbe(profile){
  const slowDistances=[84,88,94,100,108];let slowSave=null;
  for(const d of slowDistances){if(await saveAttempt(profile,d,430)){slowSave=d;break;}}
  const flickDistances=[40,46,52,58,64];let fastSave=null;
  for(const d of flickDistances){if(await saveAttempt(profile,d,0)){fastSave=d;break;}}
  return {slowSave,fastSave};
}

const results={};
for(const [name,profile] of Object.entries(PROFILES)){
  const read=await readMatrix(profile);const activation=await activationProbe(profile);const thresholds=await thresholdProbe(profile);
  results[name]={profile,read,...activation,...thresholds};
  console.log(name,JSON.stringify(results[name]));
}
// Persist comparison even if a selected-profile assertion below fails.
fs.writeFileSync('test-output/gesture-profile-comparison.json',JSON.stringify({selectedCandidate:'B_BALANCED',results},null,2));

const B=results.B_BALANCED;
assert.equal(B.read.passed,B.read.total,`B_BALANCED READ failures: ${JSON.stringify(B.read.failures)}`);
assert(B.read.maxJitter<1.5,`B_BALANCED horizontal jitter during READ: ${B.read.maxJitter}px`);
assert(B.activation!==null&&B.activation>=20&&B.activation<=28,`B_BALANCED activation outside intended band: ${B.activation}`);
assert(B.firstTransform!==null&&B.firstTransform<9,`B_BALANCED activation jumped ${B.firstTransform}px`);
assert.equal(await saveAttempt(PROFILES.B_BALANCED,55,360),false,'B_BALANCED short slow SAVE should cancel');
assert.equal(await nextAttempt(PROFILES.B_BALANCED,55,360),false,'B_BALANCED short slow NEXT should cancel');
assert.equal(await saveAttempt(PROFILES.B_BALANCED,108,390),true,'B_BALANCED deliberate SAVE failed');
assert.equal(await nextAttempt(PROFILES.B_BALANCED,108,390),true,'B_BALANCED deliberate NEXT failed');
assert.equal(await saveAttempt(PROFILES.B_BALANCED,58,0),true,'B_BALANCED fast SAVE flick failed');
assert.equal(await nextAttempt(PROFILES.B_BALANCED,58,0),true,'B_BALANCED fast NEXT flick failed');
// Ambiguous diagonal should not become horizontal; clearly horizontal diagonal may commit.
assert.equal(await saveAttempt(PROFILES.B_BALANCED,82,400,62),false,'B_BALANCED ambiguous diagonal SAVE should not commit');
assert.equal(await saveAttempt(PROFILES.B_BALANCED,108,330,42),true,'B_BALANCED clear diagonal SAVE failed');
assert.equal(await nextAttempt(PROFILES.B_BALANCED,108,330,42),true,'B_BALANCED clear diagonal NEXT failed');

// Top / middle / end: both horizontal commits advance and reset the newly revealed card to top.
for(const p of ['top','middle','end']){
  const page=await fresh(PROFILES.B_BALANCED);await setPos(page,p);
  const id=await page.locator('.story-page').getAttribute('data-id');
  await touchPath(page,'#articleScroll',straight(108,1,9),{duration:390,pos:[190,310]});await page.waitForTimeout(520);
  assert((await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]'))).includes(id),`SAVE failed at ${p}`);
  const afterSave=await page.locator('.story-page').getAttribute('data-id');
  assert.notEqual(afterSave,id,`SAVE did not advance at ${p}`);
  assert((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))<3,`SAVE leaked old scroll at ${p}`);
  await neutral(page,`SAVE ${p}`);
  await touchPath(page,'#articleScroll',straight(-108,1,9),{duration:390,pos:[190,310]});await page.waitForTimeout(520);
  assert.notEqual(await page.locator('.story-page').getAttribute('data-id'),afterSave,`NEXT failed after SAVE at ${p}`);
  assert((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))<3,`NEXT leaked scroll after SAVE at ${p}`);
  await page.close();
}

// Required mixed one-handed journey: READ → NEXT → READ → SAVE → READ → NEXT.
{
  const page=await fresh(PROFILES.B_BALANCED);let id=await page.locator('.story-page').getAttribute('data-id');
  await touchPath(page,'#articleScroll',[[12,-7],[15,-34],[13,-82],[16,-155]],{duration:290,pos:[190,530]});await page.waitForTimeout(120);
  assert((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))>50,'mixed journey first READ did not scroll');assert.equal(await page.locator('.story-page').getAttribute('data-id'),id);
  await touchPath(page,'#articleScroll',straight(-108,2,9),{duration:330,pos:[190,310]});await page.waitForTimeout(520);const second=await page.locator('.story-page').getAttribute('data-id');assert.notEqual(second,id,'mixed journey first NEXT failed');assert((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))<3);
  id=second;await touchPath(page,'#articleScroll',[[2,-25],[6,-70],[4,-145]],{duration:260,pos:[190,530]});await page.waitForTimeout(100);const saveY=await page.locator('#articleScroll').evaluate(e=>e.scrollTop);assert(saveY>40,'mixed journey second READ failed');
  await touchPath(page,'#articleScroll',straight(108,2,9),{duration:340,pos:[190,310]});await page.waitForTimeout(520);
  assert((await page.evaluate(()=>JSON.parse(localStorage.getItem('kingfisherSaved')||'[]'))).includes(id),'mixed journey SAVE did not persist saved article');
  const third=await page.locator('.story-page').getAttribute('data-id');assert.notEqual(third,id,'mixed journey SAVE did not advance');assert((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))<3,'mixed journey SAVE leaked old reading position');
  id=third;await touchPath(page,'#articleScroll',[[4,-24],[10,-65],[6,-125]],{duration:250,pos:[190,510]});await page.waitForTimeout(100);assert((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))>30,'mixed journey third READ failed');
  await touchPath(page,'#articleScroll',straight(-108,1,9),{duration:330,pos:[190,310]});await page.waitForTimeout(520);assert.notEqual(await page.locator('.story-page').getAttribute('data-id'),id,'mixed journey final NEXT failed');assert((await page.locator('#articleScroll').evaluate(e=>e.scrollTop))<3,'mixed journey final NEXT did not reset scroll');await neutral(page,'mixed journey final');await page.close();
}

fs.writeFileSync('test-output/gesture-profile-comparison.json',JSON.stringify({selected:'B_BALANCED',results},null,2));
console.log('CARDS gesture profile comparison: PASS; selected B_BALANCED');
await browser.close();
