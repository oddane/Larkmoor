// Visual regression: full-page screenshots of each page and theme at three widths, compared with
// committed baselines. Font rendering differs between machines, so each environment has its own set:
// tests/baselines/local (development) and tests/baselines/ci (GitHub Actions, set by LARKMOOR_BASELINES).
// A missing baseline is recorded instead of compared; CI commits newly recorded ones on main. Review the diffs in reports/visual before accepting new
// baselines with `npm run test:update-baselines`.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { setup, open, scrollThrough, PAGES } from './helpers.mjs';
const sharp = createRequire(import.meta.url)('sharp');

const UPDATE = process.env.UPDATE_BASELINES === '1';
const DIR = process.env.LARKMOOR_BASELINES || 'tests/baselines/local';
const TOLERANCE = 0.002; // share of pixels allowed to differ (anti-aliasing noise)
let env;
before(async () => { env = await setup(); mkdirSync('reports/visual', { recursive: true }); mkdirSync(DIR, { recursive: true }); });
after(async () => { await env.close(); });

async function diff(a, b, out) {
  const [A, B] = await Promise.all([sharp(a).raw().ensureAlpha().toBuffer({ resolveWithObject: true }), sharp(b).raw().ensureAlpha().toBuffer({ resolveWithObject: true })]);
  if (A.info.width !== B.info.width || A.info.height !== B.info.height) return { ratio: 1, reason: `size ${A.info.width}x${A.info.height} vs ${B.info.width}x${B.info.height}` };
  const mask = Buffer.alloc(A.data.length); let changed = 0;
  for (let i = 0; i < A.data.length; i += 4) {
    const d = Math.abs(A.data[i] - B.data[i]) + Math.abs(A.data[i + 1] - B.data[i + 1]) + Math.abs(A.data[i + 2] - B.data[i + 2]);
    if (d > 24) { changed++; mask[i] = 255; mask[i + 3] = 255; } else { mask[i] = mask[i + 1] = mask[i + 2] = A.data[i] * 0.3; mask[i + 3] = 255; }
  }
  await sharp(mask, { raw: { width: A.info.width, height: A.info.height, channels: 4 } }).png().toFile(out);
  return { ratio: changed / (A.data.length / 4) };
}

const CASES = [
  ['tauawo', PAGES.tauawo, null], ['harbor', PAGES.harbor, null], ['docs', PAGES.docs, null], ['docs-harbor-dark', PAGES.docs, 'harbor-dark'],
];
for (const [name, path, theme] of CASES) {
  for (const width of [390, 768, 1440]) {
    test(`visual: ${name} @${width}`, async () => {
      const { page, context } = await open(env.browser, env.base + path, { viewport: { width, height: 900 } });
      if (theme) { await page.selectOption('#theme', theme); }
      await page.addStyleTag({ content: '.cipher { visibility: hidden !important; } *, *::before, *::after { caret-color: transparent !important; }' }); // the cipher field is random by design
      await scrollThrough(page);
      const file = `${name}-${width}.png`;
      await page.screenshot({ path: `reports/visual/${file}`, fullPage: true });
      await context.close();
      if (UPDATE || !existsSync(`${DIR}/${file}`)) { copyFileSync(`reports/visual/${file}`, `${DIR}/${file}`); return; }
      const r = await diff(`${DIR}/${file}`, `reports/visual/${file}`, `reports/visual/diff-${file}`);
      assert.ok(r.ratio <= TOLERANCE, `${file}: ${(r.ratio * 100).toFixed(2)}% of pixels changed ${r.reason || ''} (see reports/visual/diff-${file})`);
    });
  }
}
