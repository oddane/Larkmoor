import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { setup, open, PAGES, WIDTHS } from './helpers.mjs';

let env;
before(async () => { env = await setup(); });
after(async () => { await env.close(); });

for (const [name, path] of Object.entries(PAGES)) {
  test(`${name}: no sideways scrolling and the primary action is reachable at ${WIDTHS.length} widths (320-1920, both sides of each breakpoint)`, async () => {
    const { page, context } = await open(env.browser, env.base + path);
    const failures = [];
    for (const width of WIDTHS) {
      for (const height of [568, 900]) {
        await page.setViewportSize({ width, height });
        await page.waitForTimeout(80);
        const r = await page.evaluate(() => {
          const wide = [...document.querySelectorAll('body *')].filter((e) => { const b = e.getBoundingClientRect(); if (!b.width || b.right <= innerWidth + 1 || e.closest('.cipher, [aria-hidden="true"]') || getComputedStyle(e).position === 'fixed') return false; for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) if (/auto|scroll|hidden|clip/.test(getComputedStyle(a).overflowX)) return false; return true; }).map((e) => e.className || e.tagName).slice(0, 3);
          const cta = document.querySelector('.lm-header .lm-btn--primary, main .lm-btn--primary'); const cr = cta && cta.getBoundingClientRect();
          return { overflow: document.documentElement.scrollWidth > innerWidth, wide, ctaVisible: !!cr && cr.width > 0 && cr.top < innerHeight };
        });
        if (r.overflow) failures.push(`${width}x${height}: page scrolls sideways (${r.wide.join(', ')})`);
        if (name !== 'docs' && !r.ctaVisible) failures.push(`${width}x${height}: primary action not on first screen`);
      }
    }
    await context.close();
    assert.deepEqual(failures, []);
  });
}

test('tauawo: landscape phone (844x390) and 200% zoom equivalent (640px) keep everything', async () => {
  const { page, context } = await open(env.browser, env.base + PAGES.tauawo, { viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true });
  const a = await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
  await page.setViewportSize({ width: 640, height: 400 });
  const b = await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && !!document.querySelector('.lm-menu-button').offsetWidth);
  await context.close();
  assert.ok(a && b);
});
