import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.BASE_URL || 'http://127.0.0.1:4173';
const OUT = 'test-output/demo-visual-audit';
fs.mkdirSync(OUT, { recursive: true });

const viewports = [
  { name: '320x568', width: 320, height: 568, mobile: true },
  { name: '375x667', width: 375, height: 667, mobile: true },
  { name: '390x844', width: 390, height: 844, mobile: true },
  { name: '430x932', width: 430, height: 932, mobile: true },
  { name: '844x390', width: 844, height: 390, mobile: false },
  { name: '1024x768', width: 1024, height: 768, mobile: false },
];

const report = {
  generatedAt: new Date().toISOString(),
  baseline: 'production KAWASEMI',
  viewports: viewports.map(v => v.name),
  targets: {},
};

const browser = await chromium.launch({ headless: true });

function safeName(s) { return s.replace(/[^a-zA-Z0-9_-]/g, '-'); }

async function lowLevelScreenshot(page, filename) {
  const cdp = await page.context().newCDPSession(page);
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  await cdp.detach();
  fs.writeFileSync(`${OUT}/${filename}`, Buffer.from(data, 'base64'));
}

async function inspectLayout(page) {
  return await page.evaluate(() => {
    const visible = el => {
      const s = getComputedStyle(el), r = el.getBoundingClientRect();
      return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity || 1) > 0.02 && r.width > 1 && r.height > 1;
    };
    const rect = el => {
      const r = el.getBoundingClientRect();
      return { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) };
    };
    const text = el => (el.innerText || el.textContent || '').trim().replace(/\s+/g,' ').slice(0,100);
    const clipped = [];
    for (const el of document.querySelectorAll('button,a,h1,h2,h3,p,strong,small,span')) {
      if (!visible(el) || !text(el)) continue;
      const s = getComputedStyle(el);
      const xClip = el.scrollWidth > el.clientWidth + 2;
      const yClip = el.scrollHeight > el.clientHeight + 2;
      if ((xClip || yClip) && (s.overflow === 'hidden' || s.overflowX === 'hidden' || s.overflowY === 'hidden')) {
        clipped.push({ tag: el.tagName, cls: el.className || '', text: text(el), xClip, yClip, rect: rect(el), overflow: `${s.overflow}/${s.overflowX}/${s.overflowY}` });
      }
    }
    const controls = [...document.querySelectorAll('button,a,[role="button"]')].filter(visible);
    const texts = [...document.querySelectorAll('h1,h2,h3,p,strong,small,span')].filter(el => visible(el) && text(el));
    const collisions = [];
    const intersects = (a,b) => {
      const ar=a.getBoundingClientRect(), br=b.getBoundingClientRect();
      const w=Math.min(ar.right,br.right)-Math.max(ar.left,br.left);
      const h=Math.min(ar.bottom,br.bottom)-Math.max(ar.top,br.top);
      return w > 4 && h > 4 && w*h > 60;
    };
    for (const c of controls) {
      for (const t of texts) {
        if (c === t || c.contains(t) || t.contains(c)) continue;
        if (intersects(c,t)) collisions.push({ control: text(c) || c.getAttribute('aria-label') || c.tagName, text: text(t), cRect: rect(c), tRect: rect(t) });
        if (collisions.length >= 40) break;
      }
      if (collisions.length >= 40) break;
    }
    return {
      viewport: { width: innerWidth, height: innerHeight },
      document: { scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, scrollHeight: document.documentElement.scrollHeight },
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
      clipped,
      collisions,
    };
  });
}

async function computed(page, selectors) {
  return await page.evaluate((selectors) => {
    const out = {};
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (!el) { out[sel] = null; continue; }
      const s = getComputedStyle(el), r = el.getBoundingClientRect();
      out[sel] = {
        fontFamily: s.fontFamily,
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        lineHeight: s.lineHeight,
        color: s.color,
        backgroundColor: s.backgroundColor,
        borderRadius: s.borderRadius,
        padding: s.padding,
        margin: s.margin,
        width: +r.width.toFixed(1),
        height: +r.height.toFixed(1),
      };
    }
    return out;
  }, selectors);
}

async function makePage(v) {
  const context = await browser.newContext({ viewport: { width: v.width, height: v.height }, deviceScaleFactor: 1, isMobile: v.mobile, hasTouch: v.mobile });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  return { context, page };
}

async function enterProduction(page, theme='dark') {
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate((theme) => {
    localStorage.setItem('kingfisherIntroVersion','kingfisher-intro-v8');
    localStorage.setItem('kingfisherTutorialDone','1');
    localStorage.setItem('kingfisherTheme',theme);
  }, theme);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#splashBird');
  const bird = await page.locator('#splashBird').boundingBox();
  if (bird) {
    await page.mouse.move(bird.x + bird.width/2, bird.y + bird.height/2);
    await page.mouse.down();
    await page.mouse.move(bird.x + bird.width/2, Math.max(20, bird.y + bird.height/2 - 180), { steps: 12 });
    await page.mouse.up();
  }
  await page.waitForFunction(() => document.querySelector('#splash')?.classList.contains('hidden'), null, { timeout: 8000 });
  await page.waitForSelector('.story-page');
  await page.waitForTimeout(180);
}

async function enterDay2(page, theme='dark', tutorial=false) {
  await page.goto(`${BASE}/demos/day2-baseline/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(({theme,tutorial}) => {
    localStorage.setItem('kawasemiDay2Seen','1');
    localStorage.setItem('kawasemiDay2Theme',theme);
    if (tutorial) localStorage.removeItem('kawasemiDay2TutorialDone');
    else localStorage.setItem('kawasemiDay2TutorialDone','1');
  }, {theme,tutorial});
  await page.goto(`${BASE}/demos/day2-baseline/${tutorial?'?tutorial=1':''}`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.story-page');
  await page.waitForTimeout(tutorial ? 750 : 700);
}

async function enterLive(page, theme='dark') {
  await page.goto(`${BASE}/demos/live-trace/`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-cluster="power-grid"]');
  const current = await page.locator('html').getAttribute('data-theme');
  if (current !== theme) await page.locator('#themeBtn').click();
  await page.locator('#pauseBtn').click().catch(()=>{});
  await page.waitForTimeout(120);
}

async function enterDive(page) {
  await page.goto(`${BASE}/demos/dive-focus-map/`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#articleCard');
  await page.waitForTimeout(120);
}

async function captureTarget(name, enter, selectors) {
  report.targets[name] = { matrix: {}, styles: {} };
  for (const v of viewports) {
    const { context, page } = await makePage(v);
    try {
      await enter(page);
      await lowLevelScreenshot(page, `${safeName(name)}-${v.name}-default.png`);
      report.targets[name].matrix[v.name] = await inspectLayout(page);
      if (v.name === '390x844') report.targets[name].styles.dark390 = await computed(page, selectors);
    } catch (e) {
      report.targets[name].matrix[v.name] = { error: String(e) };
    } finally { await context.close(); }
  }
}

await captureTarget('production', p => enterProduction(p,'dark'), ['body','.app','.topbar','.story-page','.story-cover h1','.story-section p','.feed-nav','.feed-tab','.top-mark']);
await captureTarget('day2-baseline', p => enterDay2(p,'dark',false), ['body','.app','.topbar','.story-page','.story-cover h1','.story-section p','.feed-nav','.feed-tab','.top-mark']);
await captureTarget('live-trace', p => enterLive(p,'dark'), ['body','.shell','.topbar','.mode-title','.entry-title','.entry-summary','.sheet','.sheet-title','.segmented']);
await captureTarget('dive-focus-map', p => enterDive(p), ['body','.app','.topbar','h1','.section h2','.section p','.article-card','.dock','.dock button','.node.current','.node.current .node-label']);

for (const [name, enter, selectors] of [
  ['production', p => enterProduction(p,'light'), ['body','.app','.topbar','.story-page','.story-cover h1','.story-section p','.feed-nav']],
  ['day2-baseline', p => enterDay2(p,'light',false), ['body','.app','.topbar','.story-page','.story-cover h1','.story-section p','.feed-nav']],
  ['live-trace', p => enterLive(p,'light'), ['body','.shell','.topbar','.mode-title','.entry-title','.sheet']],
]) {
  for (const v of viewports.filter(v => v.name === '390x844' || v.name === '844x390')) {
    const { context, page } = await makePage(v);
    try {
      await enter(page);
      await lowLevelScreenshot(page, `${safeName(name)}-${v.name}-light.png`);
      report.targets[name].styles[`light-${v.name}`] = await computed(page, selectors);
      report.targets[name].matrix[`light-${v.name}`] = await inspectLayout(page);
    } finally { await context.close(); }
  }
}
report.targets['dive-focus-map'].lightMode = { supported: false, note: 'No data-theme/light-theme control or light palette found in the isolated FOCUS MAP demo.' };

for (const v of viewports.filter(v => ['320x568','390x844','844x390'].includes(v.name))) {
  { const {context,page}=await makePage(v); try { await enterDay2(page,'dark',true); await lowLevelScreenshot(page,`day2-baseline-${v.name}-tutorial-read.png`); report.targets['day2-baseline'].matrix[`tutorial-${v.name}`]=await inspectLayout(page); } finally { await context.close(); } }
  { const {context,page}=await makePage(v); try { await enterDay2(page,'dark',false); await page.locator('#menuButton').click(); await page.waitForSelector('#drawer.open'); await page.waitForTimeout(360); await lowLevelScreenshot(page,`day2-baseline-${v.name}-menu.png`); report.targets['day2-baseline'].matrix[`menu-${v.name}`]=await inspectLayout(page); } finally { await context.close(); } }
  { const {context,page}=await makePage(v); try { await enterDay2(page,'dark',false); await page.locator('#articleScroll').evaluate(e=>e.scrollTop=e.scrollHeight); await page.locator('.story-source-card').click(); await page.waitForSelector('#sourceSheet.open'); await page.waitForTimeout(320); await lowLevelScreenshot(page,`day2-baseline-${v.name}-source.png`); report.targets['day2-baseline'].matrix[`source-${v.name}`]=await inspectLayout(page); } finally { await context.close(); } }
}

for (const v of viewports.filter(v => ['320x568','390x844','844x390','1024x768'].includes(v.name))) {
  const {context,page}=await makePage(v);
  try {
    await enterLive(page,'dark');
    await page.locator('[data-cluster="power-grid"]').click();
    await page.waitForSelector('#detailSheet.open');
    await page.waitForTimeout(300);
    await lowLevelScreenshot(page,`live-trace-${v.name}-cluster-detail.png`);
    report.targets['live-trace'].matrix[`detail-${v.name}`]=await inspectLayout(page);
  } finally { await context.close(); }
}

for (const v of viewports.filter(v => ['320x568','390x844','844x390','1024x768'].includes(v.name))) {
  const {context,page}=await makePage(v);
  try {
    await enterDive(page);
    await page.locator('[data-nav="dive"]').click();
    await page.waitForSelector('#diveHomeView.active');
    await page.locator('[data-home-node="event"]').first().click();
    await page.waitForSelector('#focusView.active');
    await page.waitForTimeout(220);
    await lowLevelScreenshot(page,`dive-focus-map-${v.name}-focus.png`);
    report.targets['dive-focus-map'].matrix[`focus-${v.name}`]=await inspectLayout(page);
  } finally { await context.close(); }
}

for (const [name, prepare, focusSelector] of [
  ['day2-baseline', async p=>enterDay2(p,'dark',false),'#menuButton'],
  ['live-trace', async p=>enterLive(p,'dark'),'#themeBtn'],
  ['dive-focus-map', async p=>enterDive(p),'#infoButton'],
]) {
  const context = await browser.newContext({ viewport:{width:390,height:844}, reducedMotion:'reduce' });
  const page = await context.newPage();
  try {
    await prepare(page);
    await page.locator(focusSelector).focus();
    await lowLevelScreenshot(page,`${safeName(name)}-390x844-reduced-focus.png`);
  } finally { await context.close(); }
}

fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2));

const summary = [];
for (const [name,target] of Object.entries(report.targets)) {
  const issues=[];
  for (const [state,res] of Object.entries(target.matrix||{})) {
    if (res?.error) issues.push(`${state}: ERROR ${res.error}`);
    if (res?.horizontalOverflow) issues.push(`${state}: horizontal overflow ${res.document.scrollWidth}>${res.viewport.width}`);
    if ((res?.collisions||[]).length) issues.push(`${state}: ${res.collisions.length} possible control/text collision(s)`);
  }
  summary.push(`${name}: ${issues.length ? issues.join('; ') : 'no automatic overflow/collision flags'}`);
}
fs.writeFileSync(`${OUT}/summary.txt`, summary.join('\n')+'\n');
console.log(summary.join('\n'));
await browser.close();
