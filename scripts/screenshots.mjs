#!/usr/bin/env node
// Captures full-page screenshots of every page at representative widths into screenshots/.
// Usage: node scripts/screenshots.mjs   (needs Playwright's Chromium)
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { serve } from './serve.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const SETS = { tauawo: [['/examples/tauawo/', [320, 390, 768, 1024, 1440, 1920]]], harbor: [['/examples/harbor/', [390, 768, 1440]]], docs: [['/docs/', [390, 1440]]] };
const server = await serve(4999);
const browser = await chromium.launch();
mkdirSync('docs/screenshots', { recursive: true });
for (const [name, list] of Object.entries(SETS)) for (const [path, widths] of list) for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  await page.emulateMedia({ reducedMotion: 'reduce' }); // settled states, no mid-animation frames
  await page.goto(`http://127.0.0.1:4999${path}`, { waitUntil: 'networkidle' });
  await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } scrollTo(0, 0); });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `docs/screenshots/${name}-${width}.jpg`, fullPage: true, type: 'jpeg', quality: 82 });
  await page.screenshot({ path: `docs/screenshots/${name}-${width}-first-screen.png` });
  await page.close();
  console.log(`docs/screenshots/${name}-${width}.jpg`);
}
await browser.close(); server.close();
