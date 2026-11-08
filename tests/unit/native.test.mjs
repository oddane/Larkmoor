import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../..', import.meta.url).pathname;
const model = JSON.parse(readFileSync(root + 'dist/native/tokens.json', 'utf8'));
const themes = Object.keys(model.themes);

test('native model has every theme, including the automatic dark partners', () => {
  for (const t of ['default', 'evergreen-dark', 'evergreen-inverse', 'harbor', 'harbor-dark']) assert.ok(themes.includes(t), t);
});

test('native sizes are plain numbers and touch targets meet platform minimums (44pt iOS, 48dp Android)', () => {
  for (const name of themes) {
    const t = model.themes[name];
    assert.equal(t.size.target, 44); assert.equal(t.size.targetAndroid, 48);
    for (const v of Object.values(t.space)) assert.equal(typeof v, 'number');
    assert.deepEqual(Object.keys(t.window), ['medium', 'expanded', 'large', 'xlarge']);
  }
});

test('every text role has compact ≤ medium ≤ expanded sizes and a resolvable family', () => {
  for (const name of themes) {
    const t = model.themes[name];
    for (const [role, r] of Object.entries(t.type)) {
      assert.ok(r.size.compact <= r.size.medium && r.size.medium <= r.size.expanded, `${name}.${role}`);
      const fam = t.families[r.family];
      assert.ok(fam && (fam.files || fam.system), `${name}.${role} family`);
      if (fam.files) assert.ok(fam.files[String(r.weight)] || Object.keys(fam.files).length, `${name}.${role} weight file`);
    }
  }
});

test('large text roles cap font scaling; body text is never capped (Dynamic Type / fontScale)', () => {
  const t = model.themes.default.type;
  assert.ok(t.display.maxFontScale >= 1.3);
  assert.equal(t.body.maxFontScale, null);
  assert.equal(t.caption.maxFontScale, null);
});

test('bundled native font files exist for every referenced file name', async () => {
  const { readdirSync } = await import('node:fs');
  const files = readdirSync(root + 'fonts/native').map((f) => f.replace(/\.ttf$/, ''));
  for (const fam of Object.values(model.themes.default.families)) for (const f of Object.values(fam.files ?? {})) assert.ok(files.includes(f), f);
});

test('Swift, Kotlin and React Native outputs contain every theme and the same version', () => {
  const swift = readFileSync(root + 'dist/ios/Larkmoor.swift', 'utf8');
  const kt = readFileSync(root + 'dist/android/LarkmoorTokens.kt', 'utf8');
  const rn = readFileSync(root + 'dist/react-native/tokens.generated.js', 'utf8');
  for (const name of themes) { assert.match(swift, new RegExp(`"${name}": Theme\\(`)); assert.match(kt, new RegExp(`"${name}" to LarkmoorThemeTokens\\(`)); assert.ok(rn.includes(`"${name}"`)); }
  for (const src of [swift, kt, rn]) assert.ok(src.includes(model.version));
});
