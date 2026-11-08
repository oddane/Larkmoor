#!/usr/bin/env node
// Snapshots the latest test evidence (JSON reports and logs) into docs/evidence/ for review and commits.
import { cpSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
mkdirSync('docs/evidence', { recursive: true });
for (const dir of ['reports', 'logs']) {
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir)) if (/\.(json|log)$/.test(f)) { cpSync(`${dir}/${f}`, `docs/evidence/${f}`); console.log(`docs/evidence/${f}`); }
}
