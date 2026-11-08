import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { loadAll, flatten, resolve, themeTokens, toCss } from '../../scripts/build.mjs';

const root = new URL('../..', import.meta.url).pathname;
const { base, themes } = loadAll();
const tokens = flatten(base);

test('every source file is valid JSON with .tokens.json extension (DTCG 2025.10 Format)', () => {
  for (const d of ['tokens/foundation', 'tokens/semantic', 'tokens/themes']) {
    for (const f of readdirSync(join(root, d))) {
      assert.match(f, /\.tokens\.json$/);
      JSON.parse(readFileSync(join(root, d, f), 'utf8'));
    }
  }
});

test('every token resolves to a typed value and a CSS value', () => {
  for (const name of ['default', ...Object.keys(themes)]) {
    const map = name === 'default' ? tokens : themeTokens(base, themes, name);
    for (const path of map.keys()) {
      const t = resolve(map, path);
      assert.ok(t.type, `${name}:${path} has no $type`);
      assert.ok(toCss(t), `${name}:${path} has no CSS value`);
    }
  }
});

test('dimension and duration values use the object form {value, unit}', () => {
  for (const [path, t] of tokens) {
    if (typeof t.value === 'string') continue; // alias
    if (t.type === 'dimension') assert.ok(['px', 'rem'].includes(t.value.unit), `${path} unit ${t.value.unit}`);
    if (t.type === 'duration') assert.ok(['ms', 's'].includes(t.value.unit), `${path}`);
  }
});

test('components never reference the raw palette', () => {
  const css = readdirSync(join(root, 'src/css')).filter((f) => f.endsWith('.css')).map((f) => readFileSync(join(root, 'src/css', f), 'utf8')).join('\n');
  assert.doesNotMatch(css, /--lm-palette-/);
});

test('every theme defines the full semantic colour contract', () => {
  const contract = [...tokens.keys()].filter((p) => p.startsWith('color.'));
  for (const name of Object.keys(themes)) {
    const map = themeTokens(base, themes, name);
    for (const p of contract) assert.ok(map.has(p), `${name} misses ${p}`);
  }
});

// ---- contrast (WCAG 2.x relative luminance) ----
const hexOf = (map, p) => { const t = resolve(map, p); const c = t.value; if (c.alpha !== undefined && c.alpha < 1) return null; return c.hex; };
const lum = (hex) => { const n = parseInt(hex.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0); };
export const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const TEXT = ['text', 'text-secondary', 'text-muted', 'text-label', 'accent-text', 'danger', 'success', 'warning'];
for (const name of ['default', ...Object.keys(themes)]) {
  test(`contrast: ${name} text roles meet 4.5:1 on bg and bg-subtle; controls meet 3:1`, () => {
    const map = name === 'default' ? tokens : themeTokens(base, themes, name);
    const failures = [];
    for (const ground of ['color.bg', 'color.bg-subtle']) {
      const g = hexOf(map, ground);
      for (const role of TEXT) { const r = ratio(hexOf(map, `color.${role}`), g); if (r < 4.5) failures.push(`${role} on ${ground}: ${r.toFixed(2)}`); }
      for (const role of ['accent', 'focus', 'action']) { const r = ratio(hexOf(map, `color.${role}`), g); if (r < 3) failures.push(`${role} on ${ground}: ${r.toFixed(2)} (needs 3:1)`); }
    }
    const onAction = ratio(hexOf(map, 'color.on-action'), hexOf(map, 'color.action'));
    if (onAction < 4.5) failures.push(`on-action on action: ${onAction.toFixed(2)}`);
    const onAccent = ratio(hexOf(map, 'color.on-accent'), hexOf(map, 'color.accent'));
    if (onAccent < 4.5) failures.push(`on-accent on accent: ${onAccent.toFixed(2)}`);
    assert.deepEqual(failures, []);
  });
}

test('generated files are up to date with the sources', async () => {
  const before = readFileSync(join(root, 'dist/larkmoor.css'), 'utf8');
  const { execFileSync } = await import('node:child_process');
  execFileSync('node', [join(root, 'scripts/build.mjs')]);
  assert.equal(readFileSync(join(root, 'dist/larkmoor.css'), 'utf8'), before, 'dist/larkmoor.css changed after a rebuild: run npm run build and commit');
});
