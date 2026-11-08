// Lab performance budgets on a throttled mid-range phone profile. Lab numbers, not field data:
// INP can only be measured on real visits; TBT and a click-to-paint timing stand in here.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { setup, PAGES } from './helpers.mjs';

const BUDGET = { lcp: 2500, cls: 0.1, tbt: 200, bytes: 600 * 1024 };
let env;
before(async () => { env = await setup(); });
after(async () => { await env.close(); });

for (const [name, path] of Object.entries({ tauawo: PAGES.tauawo, harbor: PAGES.harbor })) {
  test(`${name}: LCP <= 2.5s, CLS <= 0.1, TBT < 200ms, transfer < 600KB (390px, 4x CPU, ~1.6Mbps/150ms)`, async () => {
    const runs = [];
    for (let i = 0; i < 3; i++) {
      const ctx = await env.browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 });
      const page = await ctx.newPage();
      const cdp = await ctx.newCDPSession(page);
      await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
      await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 });
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      let bytes = 0; cdp.on('Network.loadingFinished', (e) => { bytes += e.encodedDataLength; });
      await page.addInitScript(() => { window.__m = { lcp: 0, cls: 0, tbt: 0 };
        new PerformanceObserver((l) => { for (const e of l.getEntries()) __m.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) __m.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
        new PerformanceObserver((l) => { for (const e of l.getEntries()) __m.tbt += Math.max(0, e.duration - 50); }).observe({ type: 'longtask', buffered: true }); });
      await page.goto(env.base + path, { waitUntil: 'load' });
      await page.waitForTimeout(2500);
      const tap = await page.evaluate(() => new Promise((res) => { const el = document.querySelector('.lm-segmented label:not(:has(+ *)), .lm-segmented label:last-of-type'); const t = performance.now(); el.click(); requestAnimationFrame(() => requestAnimationFrame(() => res(Math.round(performance.now() - t)))); }));
      const m = await page.evaluate(() => __m);
      runs.push({ lcp: Math.round(m.lcp), cls: +m.cls.toFixed(3), tbt: Math.round(m.tbt), bytes, tapToPaint: tap });
      await ctx.close();
    }
    const median = (k) => runs.map((r) => r[k]).sort((a, b) => a - b)[1];
    const result = { lcp: median('lcp'), cls: median('cls'), tbt: median('tbt'), bytes: median('bytes'), tapToPaint: median('tapToPaint') };
    mkdirSync('reports', { recursive: true });
    writeFileSync(`reports/perf-${name}.json`, JSON.stringify({ profile: '390x844 @3x, 4x CPU slowdown, 1.6Mbps down, 150ms latency, cache off', budget: BUDGET, median: result, runs }, null, 2));
    assert.ok(result.lcp <= BUDGET.lcp, `LCP ${result.lcp}`); assert.ok(result.cls <= BUDGET.cls, `CLS ${result.cls}`);
    assert.ok(result.tbt < BUDGET.tbt, `TBT ${result.tbt}`); assert.ok(result.bytes < BUDGET.bytes, `bytes ${result.bytes}`);
  });
}
