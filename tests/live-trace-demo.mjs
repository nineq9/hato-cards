import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
const page = await context.newPage();
const consoleErrors = [];
const pageErrors = [];
page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
page.on('pageerror', err => pageErrors.push(String(err)));
await page.emulateMedia({ reducedMotion: 'reduce' });

try {
  await page.goto('http://127.0.0.1:4173/demos/live-trace/', { waitUntil: 'networkidle' });

  assert.equal(await page.locator('#groupedBtn').getAttribute('aria-pressed'), 'true');
  assert.ok(await page.locator('[data-cluster="power-grid"]').isVisible(), 'power-grid cluster should be visible in GROUPED');
  assert.ok(await page.locator('[data-row-key="signal-u1"]').isVisible(), 'UNGROUPED signal should remain visible');

  await page.locator('[data-cluster="power-grid"]').click();
  await page.locator('#detailSheet.open').waitFor();
  const detailText = await page.locator('#sheetBody').innerText();
  assert.match(detailText, /CONFIRMED/);
  assert.match(detailText, /CLAIM/);
  assert.match(detailText, /UNKNOWN/);
  assert.match(detailText, /WHO SAYS WHAT/);
  assert.match(detailText, /AI grouped 4 signals as a likely same event/);

  await page.locator('[data-open-source="s4"]').click();
  assert.equal(await page.locator('#sheetLabel').innerText(), 'SOURCE');
  assert.match(await page.locator('#sheetBody').innerText(), /ORIGINAL TITLE/);
  await page.locator('#sheetBack').click();
  assert.equal(await page.locator('#sheetLabel').innerText(), 'EVENT CLUSTER');

  await page.locator('[data-open-card="power-grid"]').click();
  await page.locator('#cardPreview:not(.hidden)').waitFor();
  assert.match(await page.locator('#cardPreviewBody').innerText(), /STRUCTURED PREVIEW/);
  assert.match(await page.locator('#cardPreviewBody').innerText(), /CONFIRMED/);
  await page.locator('#cardBack').click();
  assert.ok(await page.locator('#cardPreview').evaluate(el => el.classList.contains('hidden')));

  await page.locator('#allBtn').click();
  assert.equal(await page.locator('#allBtn').getAttribute('aria-pressed'), 'true');
  assert.ok(await page.locator('[data-source="s1"]').isVisible(), 'raw Signal should be visible in ALL SIGNALS');
  assert.ok(await page.locator('[data-source="u1"]').isVisible(), 'ungrouped raw Signal should be visible in ALL SIGNALS');
  await page.locator('#groupedBtn').click();

  await page.evaluate(() => window.scrollTo(0, Math.max(500, document.documentElement.scrollHeight * 0.55)));
  const beforeY = await page.evaluate(() => window.scrollY);
  assert.ok(beforeY > 200, `expected past-view scroll, got ${beforeY}`);
  await page.evaluate(() => injectSignal());
  await page.waitForTimeout(120);
  const afterY = await page.evaluate(() => window.scrollY);
  assert.ok(afterY > 200, `new Signal must not auto-jump to NOW, got ${afterY}`);
  assert.ok(await page.locator('#newReturn:not(.hidden)').isVisible(), 'quiet new-signal return control should appear');
  assert.match(await page.locator('#newReturn').innerText(), /1 new signal/);

  await page.locator('#newReturn').click();
  await page.waitForTimeout(120);
  assert.ok((await page.evaluate(() => window.scrollY)) < 80, 'return control should bring user back to NOW');

  await page.locator('[data-cluster="power-grid"]').click();
  assert.match(await page.locator('#sheetBody').innerText(), /AI grouped 5 signals as a likely same event/);
  await page.locator('#closeSheet').click();

  await page.locator('[data-cluster="border-claim"]').click();
  assert.match(await page.locator('#sheetBody').innerText(), /Not queued/);
  await page.locator('[data-show-why]').click();
  assert.ok(await page.locator('[data-queue-reason]:not(.hidden)').isVisible(), 'Not queued reason should expand on demand');
  await page.locator('#closeSheet').click();

  await page.locator('#newInfoBtn').click();
  assert.match(await page.locator('#sheetBody').innerText(), /前回見た時から増えた情報/);
  assert.match(await page.locator('#sheetBody').innerText(), /arrival order/);
  await page.locator('#closeSheet').click();

  await page.locator('#themeBtn').click();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');

  fs.mkdirSync('test-output', { recursive: true });
  await page.screenshot({ path: 'test-output/live-trace-demo.png', fullPage: true });

  assert.deepEqual(pageErrors, [], `page errors: ${pageErrors.join('\n')}`);
  assert.deepEqual(consoleErrors, [], `console errors: ${consoleErrors.join('\n')}`);
  console.log('LIVE TRACE demo E2E: PASS');
} finally {
  await browser.close();
}
