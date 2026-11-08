// Shared setup for browser tests: a local static server and Chromium from Playwright.
import { createRequire } from 'node:module';
import { serve } from '../../scripts/serve.mjs';
const require = createRequire(import.meta.url);
export const { chromium } = require('playwright');

export const PAGES = {
  tauawo: '/examples/tauawo/',
  harbor: '/examples/harbor/',
  docs: '/docs/',
};
export const WIDTHS = [320, 375, 390, 430, 519, 521, 759, 761, 768, 899, 901, 1024, 1099, 1101, 1280, 1440, 1920];

export async function setup() {
  const port = 4300 + Math.floor(Math.random() * 600);
  const server = await serve(port);
  const browser = await chromium.launch();
  return { base: `http://127.0.0.1:${port}`, browser, close: async () => { await browser.close(); server.close(); } };
}

/** Opens a page and collects script errors. */
export async function open(browser, url, options = {}) {
  const { reducedMotion = 'reduce', forcedColors, colorScheme, contrast, javaScriptEnabled = true, ...ctxOptions } = options;
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, javaScriptEnabled, ...ctxOptions });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.emulateMedia({ reducedMotion, ...(forcedColors ? { forcedColors } : {}), ...(colorScheme ? { colorScheme } : {}), ...(contrast ? { contrast } : {}) });
  await page.goto(url, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  return { page, context, errors };
}

/** Scrolls through the page so lazy images load and scroll-driven states settle. */
export async function scrollThrough(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.7) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(300);
}
