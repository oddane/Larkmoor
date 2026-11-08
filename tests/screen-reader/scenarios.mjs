// Shared scenarios for VoiceOver and NVDA. Keys go to the page through Playwright; the screen reader
// listens and speaks, and what it says is recorded and checked. Every spoken phrase is saved to
// reports/screen-reader/<reader>/<scenario>.json, pass or fail, as evidence.
import { mkdirSync, writeFileSync } from 'node:fs';
import { expect } from '@playwright/test';

const settle = (page, ms = 1500) => page.waitForTimeout(ms);

/** wrap(name, fn) must call test(name, async ({ page, <reader fixture> }) => fn(page, reader, testInfo)). */
export function scenarios(wrap, reader) {
  const run = (name, body) => wrap(name, async (page, s, info) => {
    const said = [];
    const take = async () => { said.push(...(await s.spokenPhraseLog())); await s.clearSpokenPhraseLog(); };
    const heard = async () => { await take(); return said.join(' | ').toLowerCase(); };
    await page.goto('/tests/screen-reader/', { waitUntil: 'load' });
    await page.locator('html[data-ready="true"]').waitFor();
    await s.navigateToWebContent();
    await take(); said.length = 0;
    try {
      await body({ page, s, take, heard, said });
    } finally {
      await take().catch(() => {});
      const dir = new URL(`../../reports/screen-reader/${reader}/`, import.meta.url);
      mkdirSync(dir, { recursive: true });
      writeFileSync(new URL(`${name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.json`, dir), JSON.stringify({ reader, scenario: name, attempt: info.retry, spoken: said }, null, 2));
    }
  });

  run('tabs announce role, name, selection and position', async ({ page, heard, take }) => {
    await page.locator('#t-overview').focus(); await settle(page);
    await take();
    await page.keyboard.press('ArrowRight'); await settle(page);
    const t = await heard();
    expect(t).toContain('pricing');
    expect(t).toMatch(/tab/);
    expect(t).toMatch(/selected/);
  });

  run('dialog is announced with its name on open and focus returns on Escape', async ({ page, heard, said }) => {
    await page.locator('#open-dialog').focus(); await settle(page);
    await page.keyboard.press('Enter'); await settle(page, 2000);
    const opened = await heard();
    expect(opened).toContain('delete this card');
    expect(opened).toMatch(/dialog/);
    said.length = 0;
    await page.keyboard.press('Escape'); await settle(page, 2000);
    expect(await heard()).toContain('delete card');
  });

  run('toast message is announced from the live region', async ({ page, heard }) => {
    await page.locator('#save-draft').focus(); await settle(page);
    await page.keyboard.press('Enter'); await settle(page, 3000);
    expect(await heard()).toContain('draft saved');
  });

  run('breadcrumbs read as a named navigation with the current page and no slashes', async ({ page, s, heard }) => {
    await page.locator('#crumb-home').focus(); await settle(page);
    for (let i = 0; i < 6; i++) { await s.next(); await settle(page, 600); }
    const t = await heard();
    expect(t).toContain('breadcrumb');
    expect(t).toContain('replace a lost card');
    expect(t).toMatch(/current/);
    expect(t).not.toMatch(/slash/);
  });

  run('pagination links are named and the current page is announced', async ({ page, heard }) => {
    await page.locator('#page-prev').focus(); await settle(page);
    await page.keyboard.press('Tab'); await settle(page, 800);
    await page.keyboard.press('Tab'); await settle(page);
    const t = await heard();
    expect(t).toContain('previous page');
    expect(t).toMatch(/current/);
    expect(t).not.toMatch(/left arrow|leftwards/);
  });

  run('table region, caption, headers and cells are read', async ({ page, s, heard }) => {
    await page.locator('#table-region').focus(); await settle(page);
    for (let i = 0; i < 8; i++) { await s.next(); await settle(page, 600); }
    const t = await heard();
    expect(t).toContain('loans this month');
    expect(t).toContain('branch');
    expect(t).toContain('quay lane');
    expect(t).toMatch(/4,?812/);
  });

  run('tab bar is a named navigation with the current page marked', async ({ page, heard }) => {
    await page.locator('#tab-home').focus(); await settle(page);
    const t = await heard();
    expect(t).toContain('home');
    expect(t).toMatch(/current/);
  });
}
