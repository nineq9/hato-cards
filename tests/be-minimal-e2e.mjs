import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1'
});
const page = await context.newPage();

async function drag(locator, dx, dy) {
  const box = await locator.boundingBox();
  assert(box, 'drag target should be visible');
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx * .45, y + dy * .45, { steps: 4 });
  await page.mouse.move(x + dx, y + dy, { steps: 5 });
  await page.mouse.up();
}

function overlaps(a, b) {
  return !(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y);
}

async function waitCounter(text) {
  await page.waitForFunction(expected => document.querySelector('#counter')?.textContent === expected, text);
}

try {
  await page.goto('http://127.0.0.1:4173/demos/be-minimal/', { waitUntil: 'networkidle' });

  const opening = page.locator('#openingArt');
  await opening.waitFor({ state: 'visible' });
  assert((await opening.getAttribute('src'))?.startsWith('data:image/webp;base64,'), 'opening uses embedded approved artwork');
  assert((await opening.evaluate(img => img.naturalWidth)) > 0, 'opening artwork decodes');
  await page.locator('#openingScreen').click({ position: { x: 20, y: 20 } });
  await page.locator('#openingScreen').waitFor({ state: 'hidden' });

  assert.equal(await page.locator('#counter').textContent(), '1 / 30');
  assert.equal(await page.locator('.photo-card').count(), 30, 'demo presents 30 review items');

  const card = page.locator('.photo-card[data-depth="0"]');
  const cardBox = await card.boundingBox();
  assert(cardBox, 'front photo card visible');
  for (const selector of ['.review-target-trash','.review-target-keep','.review-target-later']) {
    const targetBox = await page.locator(selector).boundingBox();
    assert(targetBox, `${selector} visible`);
    assert(!overlaps(cardBox, targetBox), `${selector} must not overlap resting photo card`);
  }

  await card.click();
  await page.locator('#viewer.show').waitFor({ state: 'visible' });
  await page.locator('#viewerImg').click();
  await page.locator('#viewer').waitFor({ state: 'hidden' });
  assert.equal(await page.locator('#counter').textContent(), '1 / 30', 'preview does not classify photo');
  assert.equal(await page.locator('.photo-card').count(), 30, 'preview does not remove photo');

  await drag(page.locator('.photo-card[data-depth="0"]'), -105, 0);
  await waitCounter('2 / 30');
  await drag(page.locator('.photo-card[data-depth="0"]'), 0, -105);
  await waitCounter('3 / 30');
  await drag(page.locator('.photo-card[data-depth="0"]'), 105, 0);
  await waitCounter('3 / 30');
  assert.equal(await page.locator('.photo-card').count(), 27, 'deferred photo leaves the fresh pass but does not count as resolved');

  for (let i = 0; i < 27; i++) {
    await drag(page.locator('.photo-card[data-depth="0"]'), 0, -105);
    await waitCounter(`${Math.min(4 + i, 30)} / 30`);
  }
  assert.equal(await page.locator('.photo-card').count(), 1, 'deferred photo returns after the fresh pass');

  await drag(page.locator('.photo-card[data-depth="0"]'), 105, 0);
  await waitCounter('30 / 30');
  assert.equal(await page.locator('.photo-card').count(), 1, 'choosing later again loops the same unresolved photo');

  await drag(page.locator('.photo-card[data-depth="0"]'), 0, -105);
  await page.locator('#finalScreen.active').waitFor({ state: 'visible' });
  assert((await page.locator('#finalScreen').textContent()).includes('写真・動画 1枚'));
  assert(!(await page.locator('#finalScreen').textContent()).includes('CapCut'), 'photo confirmation does not mix in apps');

  await page.locator('#deleteBtn').click();
  await page.locator('#appsScreen.active').waitFor({ state: 'visible' });
  assert.equal((await page.locator('.section-title').textContent())?.trim(), '今日の削除アプリ');

  const appBox = await page.locator('#appCard').boundingBox();
  const trashBox = await page.locator('#appTrash').boundingBox();
  assert(appBox && trashBox, 'app card and trash visible');
  assert(!overlaps(appBox, trashBox), 'app trash target does not overlap the app card');
  assert(appBox.y > 170, 'app card is placed lower for comfortable reach');

  await drag(page.locator('#appCard'), 0, -95);
  await page.locator('#deleteSheet.show').waitFor({ state: 'visible' });
  assert((await page.locator('#deleteSheet').textContent()).includes('ホーム画面を下にスワイプして検索を開く'));
  assert((await page.locator('#deleteSheet').textContent()).includes('be minimalからApp本体を直接削除することはありません'));

  await page.locator('#copyAppName').click();
  await page.waitForFunction(() => document.querySelector('#copyAppName span')?.textContent === 'コピーしました');

  await page.locator('#appDeletedBtn').click();
  assert((await page.locator('#appDeletedBtn').textContent()).includes('削除完了'));
  assert(await page.locator('#appDeletedBtn').isDisabled(), 'delete-complete state is acknowledgement only');
  assert(!(await page.locator('#completionScreen').evaluate(el => el.classList.contains('active'))), 'delete acknowledgement does not jump to completion');
  assert.equal((await page.locator('#appLaterBtn').textContent())?.trim(), '完了を見る');

  await page.locator('#appLaterBtn').click();
  await page.locator('#completionScreen.active').waitFor({ state: 'visible' });
  assert.equal((await page.locator('.completion-copy').textContent())?.trim(), '大切なものを大切に。');
  assert.equal((await page.locator('#completionPhotos').textContent())?.trim(), '1枚');
  assert.equal((await page.locator('#completionApps').textContent())?.trim(), '1個');
  assert((await page.locator('#completionStorage').textContent())?.includes('GB'));
  assert((await page.locator('#completionArt').evaluate(img => img.naturalWidth)) > 0, 'completion gecko artwork decodes');
  assert(await page.locator('#mainNav').evaluate(el => el.classList.contains('is-hidden')), 'main nav hidden on completion');

  await fs.mkdir('test-output', { recursive: true });
  await page.screenshot({ path: 'test-output/be-minimal-mobile.png', fullPage: true });

  await page.locator('#againBtn').click();
  await page.waitForFunction(() => document.querySelector('#photosScreen')?.classList.contains('active'));
  assert.equal(await page.locator('#counter').textContent(), '1 / 30', 'another session resets progress');
  assert.equal(await page.locator('.photo-card').count(), 30, 'another session restores all demo cards');

  console.log('be minimal mobile E2E: PASS');
} finally {
  await browser.close();
}
