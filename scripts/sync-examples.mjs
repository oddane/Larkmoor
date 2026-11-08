#!/usr/bin/env node
// Copies the built package into each example's vendor/larkmoor folder, the way a plain-HTML site
// without a bundler would consume it. Examples never import each other.
import { cpSync, rmSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
if (!existsSync(join(root, 'dist/larkmoor.css'))) { console.error('Run `npm run build` first.'); process.exit(1); }
for (const name of readdirSync(join(root, 'examples'))) {
  const target = join(root, 'examples', name, 'vendor/larkmoor');
  rmSync(target, { recursive: true, force: true });
  cpSync(join(root, 'dist'), target, { recursive: true });
  console.log(`examples/${name}/vendor/larkmoor <- dist/`);
}
const docs = join(root, 'docs/vendor/larkmoor');
rmSync(docs, { recursive: true, force: true });
cpSync(join(root, 'dist'), docs, { recursive: true });
console.log('docs/vendor/larkmoor <- dist/');
