// Automated accessibility checks. These catch regressions; they do not prove WCAG conformance.
// Manual checks (screen readers, real devices) are listed in ACCESSIBILITY.md.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { setup, open, scrollThrough, PAGES } from './helpers.mjs';

let env;
before(async () => { env = await setup(); });
after(async () => { await env.close(); });

const audit = ({ min = 4.5, minLarge = 3 } = {}) => {
  const out = { problems: [], contrast: [], targets: [] };
  const name = (el) => (el.getAttribute('aria-label') || el.textContent || el.getAttribute('title') || el.getAttribute('alt') || (el.labels && [...el.labels].map((l) => l.textContent).join(' ')) || (el.getAttribute('aria-labelledby') || '').split(' ').map((id) => document.getElementById(id)?.textContent || '').join(' ')).trim();
  if (!document.documentElement.lang) out.problems.push('html has no lang');
  if (!document.title.trim()) out.problems.push('empty title');
  if (document.querySelectorAll('main').length !== 1) out.problems.push('needs exactly one main');
  if (document.querySelectorAll('h1').length !== 1) out.problems.push(`h1 count ${document.querySelectorAll('h1').length}`);
  const skip = document.querySelector('a[href="#main"]');
  if (!skip || !document.getElementById('main')) out.problems.push('no working skip link');
  let last = 0;
  for (const h of document.querySelectorAll('h1,h2,h3,h4,h5,h6')) { const l = +h.tagName[1]; if (last && l > last + 1) out.problems.push(`heading jump h${last} -> h${l}: ${h.textContent.trim().slice(0, 40)}`); last = l; }
  for (const el of document.querySelectorAll('a[href], button, input, select, textarea, summary, [role="button"]')) {
    if (el.closest('[hidden], [aria-hidden="true"]') || el.type === 'hidden') continue;
    if (['radio', 'checkbox'].includes(el.type)) { if (!name(el)) out.problems.push(`unlabelled ${el.type}`); continue; }
    if (!name(el)) out.problems.push(`no accessible name: ${el.outerHTML.slice(0, 80)}`);
  }
  const ids = [...document.querySelectorAll('[id]')].map((e) => e.id); const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dup.length) out.problems.push(`duplicate ids: ${[...new Set(dup)].join(', ')}`);
  for (const img of document.querySelectorAll('img')) if (!img.hasAttribute('alt')) out.problems.push(`img without alt: ${img.src}`);
  for (const el of document.querySelectorAll('[aria-describedby],[aria-labelledby],[aria-controls]')) for (const a of ['aria-describedby', 'aria-labelledby', 'aria-controls']) for (const id of (el.getAttribute(a) || '').split(/\s+/).filter(Boolean)) if (!document.getElementById(id)) out.problems.push(`${a} points to missing #${id}`);

  // text contrast against the nearest opaque background (gradients and images are skipped and listed)
  const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 }; };
  const lum = ({ r, g, b }) => [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
  const blend = (top, bottom) => ({ r: top.r * top.a + bottom.r * (1 - top.a), g: top.g * top.a + bottom.g * (1 - top.a), b: top.b * top.a + bottom.b * (1 - top.a), a: 1 });
  const bgOf = (el) => { const layers = []; for (let e = el; e; e = e.parentElement) { const s = getComputedStyle(e); if (s.backgroundImage !== 'none' && !/gradient\(.*(transparent|rgba?\([^)]*\/ ?0\))/.test(s.backgroundImage) && e !== el) return null; const c = parse(s.backgroundColor); if (c && c.a > 0) { layers.push(c); if (c.a >= 1) break; } } let base = { r: 255, g: 255, b: 255, a: 1 }; for (const l of layers.reverse()) base = blend(l, base); return base; };
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  while (walker.nextNode()) {
    const el = walker.currentNode.parentElement; if (!el || seen.has(el) || !walker.currentNode.textContent.trim()) continue; seen.add(el);
    if (el.closest('[aria-hidden="true"], .lm-sr-only, [hidden], canvas, .iphone, .rail span')) continue;
    // the checked segment's text sits on a ::before thumb that this walker can't see; on-action vs action is checked in tests/unit
    if (el.matches('.lm-segmented input:checked + label')) continue;
    const s = getComputedStyle(el); if (s.visibility === 'hidden' || +s.opacity === 0) continue;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    let fg = parse(s.color); const bg = bgOf(el); if (!fg || !bg) continue;
    let op = 1; for (let e = el; e; e = e.parentElement) op *= +getComputedStyle(e).opacity; fg = blend({ ...fg, a: fg.a * op }, bg);
    const [L1, L2] = [lum(fg), lum(bg)].sort((a, b) => b - a); const ratio = (L1 + 0.05) / (L2 + 0.05);
    const size = parseFloat(s.fontSize); const bold = +s.fontWeight >= 700; const large = size >= 24 || (bold && size >= 18.66);
    if (ratio < (large ? minLarge : min)) out.contrast.push(`${ratio.toFixed(2)} "${el.textContent.trim().slice(0, 30)}" (${el.className || el.tagName})`);
  }
  // pointer targets: 24x24 minimum unless inline in text (WCAG 2.5.8 exception)
  for (const el of document.querySelectorAll('a[href], button, summary, input:not([type=radio]):not([type=checkbox]), select, .lm-segmented label, .lm-check')) {
    if (el.closest('[hidden], [aria-hidden="true"], .lm-sr-only')) continue;
    const r = el.getBoundingClientRect(); if (!r.width) continue;
    const inline = getComputedStyle(el).display === 'inline' && el.closest('p, li, dd, .lm-prose');
    if (!inline && (r.height < 24 || r.width < 24)) out.targets.push(`${Math.round(r.width)}x${Math.round(r.height)} ${el.textContent.trim().slice(0, 30) || el.outerHTML.slice(0, 50)}`);
  }
  return out;
};

for (const [name, path] of Object.entries(PAGES)) {
  for (const width of [390, 1280]) {
    test(`${name} @${width}: semantics, names, contrast, targets`, async () => {
      const { page, context, errors } = await open(env.browser, env.base + path, { viewport: { width, height: 900 } });
      await scrollThrough(page);
      const r = await page.evaluate(audit);
      await context.close();
      assert.deepEqual(errors, [], 'script errors');
      assert.deepEqual(r.problems, []);
      assert.deepEqual(r.contrast, []);
      assert.deepEqual(r.targets, []);
    });
  }
}

for (const [name, path] of Object.entries(PAGES)) {
  test(`${name}: keyboard reaches every control with a visible focus indicator that is not hidden by the header`, async () => {
    const { page, context } = await open(env.browser, env.base + path, { viewport: { width: 1280, height: 800 } });
    await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
    const issues = []; let stops = 0;
    for (let i = 0; i < 160; i++) {
      await page.keyboard.press('Tab');
      const info = await page.evaluate(() => {
        const el = document.activeElement; if (!el || el === document.body) return { done: true };
        const s = getComputedStyle(el); const wrap = el.closest('.lm-input-group'); const ws = wrap && getComputedStyle(wrap);
        const radio = el.type === 'radio' && document.querySelector(`label[for="${el.id}"]`); const ls = radio && getComputedStyle(radio);
        const ring = (x) => x && ((x.outlineStyle !== 'none' && parseFloat(x.outlineWidth) >= 2) || x.boxShadow !== 'none');
        const r = (radio || el).getBoundingClientRect(); const header = document.querySelector('.lm-header'); const hr = header ? header.getBoundingClientRect() : { bottom: 0 };
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2; const top = document.elementFromPoint(Math.max(0, cx), Math.max(0, cy));
        const covered = header && !header.contains(el) && !!top && header.contains(top) && r.bottom <= hr.bottom;
        return { id: el.id || el.textContent.trim().slice(0, 30) || el.tagName, ring: ring(s) || ring(ws) || ring(ls), covered, key: el.outerHTML.slice(0, 60) + r.top };
      });
      if (info.done) break;
      stops++;
      if (!info.ring) issues.push(`no focus ring: ${info.id}`);
      if (info.covered) issues.push(`focus fully covered by header: ${info.id}`);
    }
    await context.close();
    assert.ok(stops > 5, `only ${stops} focus stops`);
    assert.deepEqual(issues, []);
  });
}

test('tauawo: text spacing override (WCAG 1.4.12) clips nothing and adds no sideways scroll', async () => {
  const { page, context } = await open(env.browser, env.base + PAGES.tauawo, { viewport: { width: 1280, height: 900 } });
  await page.addStyleTag({ content: '* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }' });
  await page.waitForTimeout(200);
  const r = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, clipped: [...document.querySelectorAll('.lm-btn, .lm-link, .lm-badge, .lm-label, summary')].filter((e) => e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflow !== 'visible').map((e) => e.textContent.trim().slice(0, 20)) }));
  await context.close();
  assert.equal(r.overflow, false); assert.deepEqual(r.clipped, []);
});

test('forced colours: selected option, accent words and focus stay distinguishable', async () => {
  const { page, context } = await open(env.browser, env.base + PAGES.tauawo, { forcedColors: 'active' });
  const r = await page.evaluate(() => {
    const checked = document.querySelector('.lm-segmented input:checked + label'); const other = document.querySelector('.lm-segmented input:not(:checked) + label');
    return { selectedBg: getComputedStyle(checked).backgroundColor, otherBg: getComputedStyle(other).backgroundColor, strike: getComputedStyle(document.querySelector('.never__what span')).textDecorationLine };
  });
  await context.close();
  assert.notEqual(r.selectedBg, r.otherBg); assert.equal(r.strike, 'line-through');
});

for (const [name, path] of Object.entries({ tauawo: PAGES.tauawo, harbor: PAGES.harbor })) {
  test(`${name}: without JavaScript all content is readable and script-only controls are hidden`, async () => {
    const { page, context } = await open(env.browser, env.base + path, { javaScriptEnabled: false });
    await page.waitForTimeout(300); // let one-frame entrance animations finish
    const r = await page.evaluate(() => ({ visibleJsOnly: [...document.querySelectorAll('[data-lm-requires-js]')].filter((e) => e.getBoundingClientRect().height > 0).length, hidden: [...document.querySelectorAll('main h2, main p')].filter((e) => getComputedStyle(e).opacity === '0').length, h2: document.querySelectorAll('main h2').length }));
    await context.close();
    assert.equal(r.visibleJsOnly, 0); assert.equal(r.hidden, 0); assert.ok(r.h2 >= 3);
  });
}

// prefers-contrast: more (iOS/macOS Increase Contrast). Pages that opt in with data-lm-contrast="auto"
// switch to the high-contrast partner theme; every measurable text then meets AAA (7:1, large text 4.5:1).
const resolved = JSON.parse((await import('node:fs')).readFileSync(new URL('../../dist/tokens.json', import.meta.url), 'utf8')).themes;
for (const [name, path, colorScheme, expected] of [
  ['tauawo', PAGES.tauawo, 'light', 'evergreen-contrast'],
  ['harbor', PAGES.harbor, 'light', 'harbor-contrast'],
  ['harbor', PAGES.harbor, 'dark', 'harbor-dark-contrast'],
]) {
  test(`${name} (${colorScheme}, prefers-contrast: more): switches to ${expected} and text meets 7:1`, async () => {
    const { page, context, errors } = await open(env.browser, env.base + path, { viewport: { width: 1280, height: 900 }, colorScheme, contrast: 'more' });
    await scrollThrough(page);
    const text = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--lm-color-text').trim());
    const target = await page.evaluate((v) => { const d = document.createElement('div'); d.style.color = v; document.body.append(d); const c = getComputedStyle(d).color; d.remove(); return c; }, resolved[expected]['color.text']);
    const actual = await page.evaluate(() => getComputedStyle(document.body).color);
    const r = await page.evaluate(audit, { min: 7, minLarge: 4.5 });
    await context.close();
    assert.deepEqual(errors, [], 'script errors');
    assert.ok(text, 'no --lm-color-text');
    assert.equal(actual, target, `body text colour is not ${expected}'s`);
    assert.deepEqual(r.contrast, []);
  });
}

test('without prefers-contrast the standard theme stays in place', async () => {
  const { page, context } = await open(env.browser, env.base + PAGES.harbor, { colorScheme: 'light', contrast: 'no-preference' });
  const actual = await page.evaluate(() => getComputedStyle(document.body).color);
  const target = await page.evaluate((v) => { const d = document.createElement('div'); d.style.color = v; document.body.append(d); const c = getComputedStyle(d).color; d.remove(); return c; }, resolved.harbor['color.text']);
  await context.close();
  assert.equal(actual, target);
});
