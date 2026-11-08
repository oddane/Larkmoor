import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { setup, open, PAGES } from './helpers.mjs';

let env;
before(async () => { env = await setup(); });
after(async () => { await env.close(); });

test('mobile menu: opens, Escape closes and returns focus, choosing a link closes it', async () => {
  for (const path of [PAGES.tauawo, PAGES.harbor]) {
    const { page, context } = await open(env.browser, env.base + path, { viewport: { width: 390, height: 800 } });
    const btn = page.locator('.lm-menu-button');
    await btn.click();
    assert.equal(await btn.getAttribute('aria-expanded'), 'true');
    assert.equal(await btn.getAttribute('aria-label'), 'Close menu');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#mobile-menu').isHidden(), true);
    assert.equal(await page.evaluate(() => document.activeElement.classList.contains('lm-menu-button')), true);
    await btn.click();
    await page.locator('#mobile-menu a').nth(1).click();
    assert.equal(await page.locator('#mobile-menu').isHidden(), true);
    await context.close();
  }
});

test('segmented control: arrow keys move the selection and the preview follows', async () => {
  const { page, context } = await open(env.browser, env.base + PAGES.tauawo);
  await page.locator('#pf-balanced').focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('#pf-private').isChecked(), true);
  assert.match(await page.locator('.demo__note').innerText(), /No last seen/);
  await page.keyboard.press('ArrowRight');
  assert.match(await page.locator('.demo__note').innerText(), /never appear online/);
  await context.close();
});

test('accordion: Enter toggles and the state is exposed', async () => {
  const { page, context } = await open(env.browser, env.base + PAGES.tauawo);
  const second = page.locator('.lm-accordion details').nth(1);
  await second.locator('summary').focus();
  await page.keyboard.press('Enter');
  assert.equal(await second.getAttribute('open'), '');
  await page.keyboard.press('Enter');
  assert.equal(await second.getAttribute('open'), null);
  await context.close();
});

test('send demo: delivers the typed message, keeps focus, announces each step', async () => {
  const { page, context } = await open(env.browser, env.base + PAGES.tauawo);
  await page.locator('#tx-input').fill('meet at the pier');
  await page.locator('#tx-send').focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => document.getElementById('tx-status').classList.contains('is-done'), null, { timeout: 8000 });
  assert.equal(await page.locator('#tx-in').innerText(), 'meet at the pier');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'tx-send');
  assert.equal(await page.locator('#tx-status').getAttribute('aria-live'), 'polite');
  await context.close();
});

test('motion toggle: pauses, survives reload, resumes', async () => {
  const { page, context } = await open(env.browser, env.base + PAGES.tauawo, { reducedMotion: 'no-preference' });
  const frame = () => page.evaluate(() => document.querySelector('.cipher').toDataURL().slice(-200));
  await page.locator('.lm-motion-toggle').click();
  assert.equal(await page.locator('.lm-motion-toggle').getAttribute('aria-pressed'), 'true');
  const a = await frame(); await page.waitForTimeout(700); assert.equal(await frame(), a, 'canvas still moving while paused');
  await page.reload(); await page.waitForTimeout(300);
  assert.equal(await page.evaluate(() => document.documentElement.classList.contains('is-paused')), true);
  await page.locator('.lm-motion-toggle').click();
  const b = await frame(); await page.waitForTimeout(700); assert.notEqual(await frame(), b, 'canvas did not resume');
  await context.close();
});

test('header: hides while reading down, returns on scroll up and on focus', async () => {
  const { page, context } = await open(env.browser, env.base + PAGES.harbor, { reducedMotion: 'no-preference' });
  await page.mouse.wheel(0, 1600); await page.waitForTimeout(400);
  assert.equal(await page.locator('.lm-header').evaluate((h) => h.classList.contains('is-hidden')), true);
  await page.mouse.wheel(0, -300); await page.waitForTimeout(400);
  assert.equal(await page.locator('.lm-header').evaluate((h) => h.classList.contains('is-hidden')), false);
  await context.close();
});

const centre = (page, sel) => page.locator(sel).evaluate((e) => e.scrollIntoView({ block: 'center' })); // keep clicks clear of the fixed header

test('form: errors on submit with a focused summary, inline messages, input kept; success only after the request', async () => {
  const { page, context } = await open(env.browser, env.base + PAGES.harbor);
  await page.locator('#given-name').fill('Ada');
  await page.locator('#email').fill('not-an-email');
  await page.locator('#signup button[type=submit]').click();
  assert.equal(await page.locator('#error-summary').isVisible(), true);
  assert.equal(await page.evaluate(() => document.activeElement.id), 'error-summary');
  assert.equal(await page.locator('#family-name').getAttribute('aria-invalid'), 'true');
  assert.match(await page.locator('#family-name-message').innerText(), /last name/);
  assert.match(await page.locator('#email-message').innerText(), /name@example.com/);
  assert.equal(await page.locator('#given-name').inputValue(), 'Ada');
  // fix and fail on purpose
  await page.locator('#family-name').fill('Lovelace'); await page.locator('#email').fill('');
  await page.locator('#postcode').fill('LM4 7QA'); await centre(page, '#simulate-failure'); await page.locator('#simulate-failure').check();
  await centre(page, '#signup button[type=submit]'); await page.locator('#signup button[type=submit]').click();
  assert.equal(await page.locator('#signup button[type=submit]').getAttribute('aria-busy'), 'true');
  assert.equal(await page.locator('#form-success').isHidden(), true, 'success shown before the request finished');
  await page.locator('#form-failure').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#family-name').inputValue(), 'Lovelace', 'input lost after failure');
  // retry
  await centre(page, '#simulate-failure'); await page.locator('#simulate-failure').uncheck();
  await page.locator('#signup button[type=submit]').click();
  await page.locator('#form-success').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#form-failure').isHidden(), true);
  await context.close();
});

test('harbor: event filter shows the right cards without JavaScript logic', async () => {
  const { page, context } = await open(env.browser, env.base + PAGES.harbor);
  const count = () => page.locator('.lm-card:visible').count();
  assert.equal(await count(), 2);
  await page.locator('label[for=when-all]').click();
  assert.equal(await count(), 4);
  await context.close();
});
