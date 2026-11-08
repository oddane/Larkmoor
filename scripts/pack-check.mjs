#!/usr/bin/env node
// Proves the package installs into a brand-new project and its entry points resolve.
// Packs a tarball, installs it into a temp folder with npm (no registry needed), then imports it.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const npm = (args, cwd) => execFileSync('npm', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
const tarball = npm(['pack', '--silent', '--pack-destination', tmpdir()], root).trim().split('\n').pop();
const app = mkdtempSync(join(tmpdir(), 'lm-consumer-'));
writeFileSync(join(app, 'package.json'), JSON.stringify({ name: 'consumer', private: true, type: 'module' }));
npm(['install', '--offline', '--no-audit', '--no-fund', join(tmpdir(), tarball)], app);
const pkg = join(app, 'node_modules/@larkmoor/design-system');
const must = ['dist/larkmoor.css', 'dist/tokens.css', 'dist/fonts.css', 'dist/themes/harbor.css', 'dist/larkmoor.js', 'dist/larkmoor.d.ts', 'dist/breakpoints.mjs', 'dist/tokens.json', 'dist/fonts/geist-variable.woff2', 'tokens/semantic/semantic.tokens.json'];
const missing = must.filter((f) => !existsSync(join(pkg, f)));
writeFileSync(join(app, 'check.mjs'), `
import { breakpoints, below } from '@larkmoor/design-system/breakpoints';
import tokens from '@larkmoor/design-system/tokens.json' with { type: 'json' };
import { createRequire } from 'node:module';
const r = createRequire(import.meta.url);
console.log(JSON.stringify({ breakpoints, below: below('medium'), version: tokens.version, css: r.resolve('@larkmoor/design-system/larkmoor.css').endsWith('dist/larkmoor.css'), harbor: r.resolve('@larkmoor/design-system/themes/harbor.css').endsWith('harbor.css') }));
`);
const out = execFileSync('node', ['check.mjs'], { cwd: app, encoding: 'utf8' }).trim();
console.log(`tarball: ${tarball}\ninstalled into: ${app}\nresolved: ${out}\nmissing files: ${missing.length ? missing.join(', ') : 'none'}`);
rmSync(app, { recursive: true, force: true });
if (missing.length) process.exit(1);
