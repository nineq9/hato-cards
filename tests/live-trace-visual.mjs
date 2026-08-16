import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

fs.mkdirSync('test-output',{recursive:true});
const browser = await chromium.launch({headless:true});
const base = 'http://127.0.0.1:4173/demos/live-trace/';
const consoleErrors = [];

function slug(name){return `test-output/live-visual-${name}.png`;}

async function fresh({width,height,isMobile=true,theme='dark'}){
  const page = await browser.newPage({viewport:{width,height},isMobile,hasTouch:isMobile});
  page.on('console',m=>{if(m.type()==='error')consoleErrors.push(`${width}x${height}: ${m.text()}`)});
  page.on('pageerror',e=>consoleErrors.push(`${width}x${height}: ${e.message}`));
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.evaluate(t=>localStorage.setItem('liveTraceTheme',t),theme);
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForSelector('[data-cluster="power-grid"]');
  await page.click('#pauseBtn');
  return page;
}

async function capture(page,name){
  await page.screenshot({path:slug(name),animations:'disabled'});
}

async function assertTokens(page,theme){
  const v=await page.evaluate(()=>{
    const s=getComputedStyle(document.documentElement);
    return {
      font:getComputedStyle(document.body).fontFamily,
      bg:s.getPropertyValue('--bg').trim(),
      surface:s.getPropertyValue('--surface').trim(),
      teal:s.getPropertyValue('--teal').trim(),
      text:s.getPropertyValue('--text').trim()
    };
  });
  assert.match(v.font,/Noto Sans JP/,`font stack drift: ${v.font}`);
  assert.equal(v.teal,'#118995','teal must match production');
  if(theme==='dark'){
    assert.equal(v.bg,'#081113','dark background must match production');
    assert.equal(v.surface,'#111f22','dark surface must match production');
    assert.equal(v.text,'#f3f1ec','dark text must match production');
  }else{
    assert.equal(v.bg,'#f2efe8','light background must match production');
    assert.equal(v.surface,'#f8f6f1','light surface must match production');
    assert.equal(v.text,'#142022','light text must match production');
  }
}

async function layoutAudit(page,label){
  const report=await page.evaluate(()=>{
    const vw=document.documentElement.clientWidth, vh=window.innerHeight;
    const offenders=[];
    const root=document.querySelector('.shell');
    const nodes=[...(root?[root,...root.querySelectorAll('*')]:[])];
    const openSheet=document.querySelector('.sheet.open');if(openSheet)nodes.push(openSheet,...openSheet.querySelectorAll('*'));
    const card=document.querySelector('.card-preview:not(.hidden)');if(card)nodes.push(card,...card.querySelectorAll('*'));
    const newReturn=document.querySelector('.new-return:not(.hidden)');if(newReturn)nodes.push(newReturn);
    for(const el of new Set(nodes)){
      const cs=getComputedStyle(el);if(cs.display==='none'||cs.visibility==='hidden'||Number(cs.opacity)===0)continue;
      const r=el.getBoundingClientRect();if(!r.width||!r.height||r.bottom<0||r.top>vh)continue;
      if(r.left < -1 || r.right > vw+1){
        offenders.push({tag:el.tagName,cls:el.className||'',id:el.id||'',left:+r.left.toFixed(1),right:+r.right.toFixed(1),vw});
      }
    }
    const overlap=(a,b)=>{
      const A=document.querySelector(a),B=document.querySelector(b);if(!A||!B)return false;
      const ca=getComputedStyle(A),cb=getComputedStyle(B);if(ca.display==='none'||cb.display==='none')return false;
      const x=A.getBoundingClientRect(),y=B.getBoundingClientRect();
      return x.left<y.right-.5&&x.right>y.left+.5&&x.top<y.bottom-.5&&x.bottom>y.top+.5;
    };
    const collisions=[];
    for(const [a,b] of [['.mode-title','.clock'],['.clock','#themeBtn'],['.since>div','#newInfoBtn'],['#sheetBack','#sheetLabel'],['#sheetLabel','#closeSheet']])if(overlap(a,b))collisions.push(`${a} overlaps ${b}`);
    return {scrollWidth:document.documentElement.scrollWidth,clientWidth:vw,offenders:offenders.slice(0,12),collisions};
  });
  assert(report.scrollWidth<=report.clientWidth+1,`${label}: horizontal page overflow ${JSON.stringify(report)}`);
  assert.equal(report.offenders.length,0,`${label}: visible horizontal clipping/overflow ${JSON.stringify(report.offenders)}`);
  assert.equal(report.collisions.length,0,`${label}: text/control collision ${JSON.stringify(report.collisions)}`);
}

async function touchAudit(page,label){
  const ids=['#themeBtn','#pauseBtn','#groupedBtn','#allBtn','#newInfoBtn'];
  for(const sel of ids){
    const b=await page.locator(sel).boundingBox();assert(b,`${label}: missing ${sel}`);
    assert(b.height>=43.5,`${label}: ${sel} touch height ${b.height}`);
    assert(b.width>=43.5,`${label}: ${sel} touch width ${b.width}`);
  }
}

const matrix=[
  {width:320,height:568,name:'320x568',isMobile:true},
  {width:375,height:667,name:'375x667',isMobile:true},
  {width:390,height:844,name:'390x844',isMobile:true},
  {width:430,height:932,name:'430x932',isMobile:true},
  {width:844,height:390,name:'844x390',isMobile:true},
  {width:1180,height:820,name:'1180x820-tablet-landscape',isMobile:false}
];

for(const vp of matrix){
  const page=await fresh({...vp,theme:'dark'});
  await assertTokens(page,'dark');await touchAudit(page,vp.name);await layoutAudit(page,`${vp.name} default dark`);
  await capture(page,`${vp.name}-dark-default`);
  await page.close();
}

// Light baseline at compact and standard portrait, plus landscape.
for(const vp of [matrix[0],matrix[2],matrix[4]]){
  const page=await fresh({...vp,theme:'light'});
  await assertTokens(page,'light');await layoutAudit(page,`${vp.name} default light`);
  await capture(page,`${vp.name}-light-default`);
  await page.close();
}

// Cluster truth-state hierarchy: CONFIRMED / CLAIM / UNKNOWN remain visibly separate.
{
  const page=await fresh({width:390,height:844,theme:'dark'});
  await page.click('[data-cluster="power-grid"]');
  await page.waitForSelector('.sheet.open');
  assert.equal(await page.locator('.state-heading').count(),3,'expected three truth-state groups');
  assert.deepEqual(await page.locator('.state-heading').allTextContents(),['CONFIRMED','CLAIM','UNKNOWN']);
  await layoutAudit(page,'390 cluster top');await capture(page,'390x844-dark-cluster-top');
  await page.locator('.state-group').last().scrollIntoViewIfNeeded();await page.waitForTimeout(80);
  await layoutAudit(page,'390 cluster truth states');await capture(page,'390x844-dark-confirmed-claim-unknown');
  await page.close();
}

// Long Japanese headline + long actor/source names at the smallest required viewport.
{
  const page=await fresh({width:320,height:568,theme:'dark'});
  await page.click('[data-cluster="power-grid"]');await page.waitForSelector('.sheet.open');
  await page.evaluate(()=>{
    const longTitle='キーウ周辺の重要インフラ設備について複数の情報源から非常に長い日本語の更新が入り続けているケース';
    const longActor='ウクライナ国家送電網運用・緊急復旧調整統合センター / UKRAINE NATIONAL GRID EMERGENCY RESTORATION COORDINATION CENTER';
    const longSource='Kyiv Regional Infrastructure Operations and Emergency Restoration Coordination Service — Extended Source Name';
    const title=document.querySelector('.sheet-title');if(title)title.textContent=longTitle;
    const actor=document.querySelector('.actor-row strong');if(actor)actor.textContent=longActor;
    const source=document.querySelector('.source-row strong');if(source)source.textContent=longSource;
    const sourceMeta=document.querySelector('.source-row span span');if(sourceMeta)sourceMeta.textContent='22:51 · CONFIRMED · 非常に長いSource metadataでも横方向にはみ出さず自然に折り返す必要があります';
  });
  await layoutAudit(page,'320 long cluster title');await capture(page,'320x568-dark-long-cluster-title');
  await page.locator('.actor-row').first().scrollIntoViewIfNeeded();await page.waitForTimeout(80);await layoutAudit(page,'320 long actor');await capture(page,'320x568-dark-long-actor');
  await page.locator('.source-row').first().scrollIntoViewIfNeeded();await page.waitForTimeout(80);await layoutAudit(page,'320 long source');await capture(page,'320x568-dark-long-source');
  await page.close();
}

// Source sheet stress: long source, actor, Japanese copy, original metadata.
{
  const page=await fresh({width:390,height:844,theme:'dark'});
  await page.click('[data-cluster="power-grid"]');await page.locator('.source-row').first().click();await page.waitForSelector('.sheet.open');
  await page.evaluate(()=>{
    const k=document.querySelector('.kicker');if(k)k.textContent='CONFIRMED · Kyiv Regional Infrastructure Operations and Emergency Restoration Coordination Service — Extended Source Name';
    const t=document.querySelector('.sheet-title');if(t)t.textContent='運用中の送電設備の一部停止について事業者が確認し、原因・影響範囲・復旧見込みを引き続き調査しているとの長い日本語見出し';
    const meta=document.querySelector('.sheet-meta span:last-child');if(meta)meta.textContent='UKRAINE NATIONAL GRID EMERGENCY RESTORATION AND OPERATIONS COORDINATION CENTER';
    const o=document.querySelector('.source-original');if(o)o.append(' 追加の長文確認用テキスト。日本語の句読点や英数字が混在しても、文字が切れたり横にはみ出したりしないことを確認します。');
  });
  await layoutAudit(page,'390 source stress');await capture(page,'390x844-dark-source-sheet-stress');
  await page.close();
}

// ALL SIGNALS remains raw and readable, not a card grid.
{
  const page=await fresh({width:390,height:844,theme:'dark'});
  await page.click('#allBtn');assert.equal(await page.locator('[data-source]').count()>=9,true,'ALL SIGNALS missing raw items');
  await layoutAudit(page,'390 all signals');await capture(page,'390x844-dark-all-signals');await page.close();
}

// SINCE LAST CHECK in both themes.
for(const theme of ['dark','light']){
  const page=await fresh({width:390,height:844,theme});
  await page.click('#newInfoBtn');await page.waitForSelector('.sheet.open');
  await layoutAudit(page,`390 since ${theme}`);await capture(page,`390x844-${theme}-since-last-check`);await page.close();
}

// Landscape sheet behavior and wrapping.
{
  const page=await fresh({width:844,height:390,theme:'dark'});
  await page.click('[data-cluster="power-grid"]');await page.waitForSelector('.sheet.open');
  await layoutAudit(page,'844 landscape cluster');await capture(page,'844x390-dark-cluster-sheet');await page.close();
}

assert.equal(consoleErrors.length,0,`console/page errors: ${consoleErrors.join('\n')}`);
await browser.close();
console.log('LIVE TRACE visual consistency matrix PASS');
