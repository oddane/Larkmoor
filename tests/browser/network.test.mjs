// Privacy evidence: records every request each page makes while loading, scrolling and being used.
// Writes reports/network-<page>.json. Fails if anything leaves the site's own origin.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { setup, open, scrollThrough, PAGES } from './helpers.mjs';

let env;
before(async () => { env = await setup(); });
after(async () => { await env.close(); });

for (const [name, path] of Object.entries({ tauawo: PAGES.tauawo, harbor: PAGES.harbor })) {
  test(`${name}: every request stays on the site's own origin (no fonts CDN, analytics, trackers or beacons)`, async () => {
    const browser = env.browser;
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();
    const requests = [];
    page.on('request', (r) => requests.push({ url: r.url(), type: r.resourceType(), method: r.method() }));
    await page.goto(env.base + path, { waitUntil: 'networkidle' });
    await scrollThrough(page);
    if (name === 'tauawo') { await page.locator('#tx-input').fill('hi'); await page.locator('#tx-send').click(); await page.waitForTimeout(3500); }
    await page.waitForTimeout(500);
    const origin = new URL(env.base).origin;
    const external = requests.filter((r) => !r.url.startsWith(origin) && !r.url.startsWith('data:'));
    const cookies = await context.cookies();
    const storage = await page.evaluate(() => { const o = {}; try { for (let i = 0; i < localStorage.length; i++) o[localStorage.key(i)] = localStorage.getItem(localStorage.key(i)); } catch {} return o; });
    mkdirSync('reports', { recursive: true });
    writeFileSync(`reports/network-${name}.json`, JSON.stringify({ page: path, recordedAt: new Date().toISOString(), totalRequests: requests.length, external, cookies, localStorage: storage, requests: requests.map((r) => ({ ...r, url: r.url.replace(origin, '') })) }, null, 2));
    await context.close();
    assert.deepEqual(external, []);
    assert.deepEqual(cookies, []);
  });
}
