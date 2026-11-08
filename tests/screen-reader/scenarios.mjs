// Shared scenarios for VoiceOver and NVDA. Everything is done through the screen reader, the way a
// person would: its own Tab, arrow, Enter and Escape key presses and its "next item" command.
// Every spoken phrase is saved to reports/screen-reader/<reader>/<scenario>.json, pass or fail.
import { mkdirSync, writeFileSync } from 'node:fs';
import { expect } from '@playwright/test';

const settle = (page, ms = 1200) => page.waitForTimeout(ms);

// Combinations the automation could not verify, with the reason. They are reported as "fixme", not
// hidden, and are listed in docs/guides/ACCESSIBILITY.md for a person to check by hand.
const KNOWN_GAPS = {
  voiceover: {
    'toast message is announced from the live region':
      'VoiceOver with Playwright WebKit on the macOS 15 runner never spoke the polite status message (3 tries in each of 2 runs), with or without the region present from load. NVDA announces it. Check on a real iPhone or Mac with Safari.',
  },
  nvda: {
    'breadcrumbs read as a named navigation with the current page and no slashes':
      "NVDA browse-mode reading (Down arrow or next item) is not captured by Guidepup on the Windows runner; focus announcements are. VoiceOver verifies the current-page text and that no slashes are read.",
    'table region, caption, headers and cells are read':
      'Same browse-mode capture limit. VoiceOver verifies the caption, column headers and cells.',
  },
};

/**
 * wrap(name, fn) must call test(name, async ({ page, <reader fixture> }) => fn(page, reader, testInfo));
 * fixme(name, reason) reports a known gap.
 */
export function scenarios(wrap, reader, fixme) {
  const run = (name, body) => KNOWN_GAPS[reader]?.[name] ? fixme(name, KNOWN_GAPS[reader][name]) : wrap(name, async (page, s, info) => {
    const said = [];
    const take = async () => { said.push(...(await s.spokenPhraseLog()).filter((p) => p && p.trim())); await s.clearSpokenPhraseLog(); };
    const heard = async () => { await take(); return said.join(' | ').toLowerCase(); };
    // NVDA's log keeps only the first part of an utterance that starts with context ("Dialog, region"),
    // so after each step NVDA is asked to report the focused element (NVDA+Tab), as a user would.
    const cmds = s.keyboardCommands ?? {};
    const focusCmd = reader === 'nvda' ? cmds.reportCurrentFocus : undefined;
    if (reader === 'nvda' && !focusCmd) console.log('[nvda] no reportCurrentFocus; commands with "focus":', Object.keys(cmds).filter((k) => /focus/i.test(k)));
    const reportFocus = async () => { if (focusCmd) { await s.perform(focusCmd); await settle(page, 900); } };
    const press = async (key, ms) => { await s.press(key); await settle(page, ms); await reportFocus(); };
    /** Presses Tab until the screen reader says `text` (or gives up after `max` presses). */
    const tabTo = async (text, max = 30) => {
      for (let i = 0; i < max; i++) {
        await press('Tab', 700);
        await take();
        if (said.slice(-3).join(' ').toLowerCase().includes(text)) return;
      }
      throw new Error(`Tab never reached "${text}"`);
    };
    /** Moves with the reader's own "next item" command until it says `text`. Safari's Tab skips links
     *  by default, so VoiceOver users reach links this way; NVDA users usually Tab. */
    const linkTo = async (text, max = 90) => {
      if (reader !== 'voiceover') return tabTo(text, max);
      for (let i = 0; i < max; i++) {
        await s.next(); await settle(page, 500);
        await take();
        if (said.slice(-2).join(' ').toLowerCase().includes(text)) return;
      }
      throw new Error(`Next never reached "${text}"`);
    };
    /** Reaches a control the way each reader's users do: VoiceOver's next-item (Safari's Tab skips
     *  buttons and links by default), Tab for NVDA. */
    const reach = (text) => (reader === 'voiceover' ? linkTo(text) : tabTo(text));
    /** Presses the control under the reader's cursor: VO-Space, or Enter with NVDA. */
    const activate = async (ms) => { if (reader === 'voiceover') { await s.act(); await settle(page, ms); } else await press('Enter', ms); };
    /** Reads the next item: VoiceOver's next-item command, NVDA's Down arrow in browse mode. */
    const nextItem = async () => { if (reader === 'voiceover') await s.next(); else await s.press('ArrowDown'); await settle(page, 700); };
    await page.goto('/tests/screen-reader/', { waitUntil: 'load' });
    await page.locator('html[data-ready="true"]').waitFor();
    await s.navigateToWebContent();
    await take();
    console.log(`[${reader}] ${name}: after navigateToWebContent:`, JSON.stringify(said), 'last:', JSON.stringify(await s.lastSpokenPhrase().catch((e) => String(e))));
    said.length = 0;
    try {
      await body({ page, s, take, heard, said, press, tabTo, linkTo, reach, activate, nextItem });
    } finally {
      await take().catch(() => {});
      console.log(`[${reader}] ${name} (attempt ${info.retry}) heard:`, JSON.stringify(said));
      const dir = new URL(`../../reports/screen-reader/${reader}/`, import.meta.url);
      mkdirSync(dir, { recursive: true });
      writeFileSync(new URL(`${name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.json`, dir), JSON.stringify({ reader, scenario: name, attempt: info.retry, spoken: said }, null, 2));
    }
  });

  run('tabs announce role, name, selection and position', async ({ heard, said, press, tabTo }) => {
    await tabTo('overview');
    said.length = 0;
    await press('ArrowRight', 2500);
    const t = await heard();
    expect(t).toContain('pricing');
    expect(t).toMatch(/tab/);
    expect(t).toMatch(/selected/);
  });

  run('dialog is announced with its name on open and focus returns on Escape', async ({ heard, said, press, reach, activate }) => {
    await reach('delete card');
    said.length = 0;
    await activate(2000);
    const opened = await heard();
    expect(opened).toContain('delete this card');
    expect(opened).toMatch(/dialog/);
    said.length = 0;
    await press('Escape', 2000);
    expect(await heard()).toContain('delete card');
  });

  run('toast message is announced from the live region', async ({ page, heard, said, reach, activate }) => {
    await reach('save draft');
    said.length = 0;
    await activate(3500);
    console.log(`[${reader}] toast elements on the page:`, await page.locator('.lm-toast').count());
    expect(await heard()).toContain('draft saved');
  });

  run('breadcrumbs read as a named navigation with the current page and no slashes', async ({ heard, linkTo, nextItem }) => {
    await linkTo('home');
    for (let i = 0; i < 6; i++) await nextItem();
    const t = await heard();
    expect(t).toContain('breadcrumb');
    expect(t).toContain('replace a lost card');
    expect(t).toMatch(/current/);
    expect(t).not.toMatch(/slash/);
  });

  run('pagination links are named and the current page is announced', async ({ heard, linkTo }) => {
    await linkTo('previous page');
    await linkTo('current');
    const t = await heard();
    expect(t).toContain('previous page');
    expect(t).toMatch(/current/);
    expect(t).not.toMatch(/left arrow|leftwards/);
  });

  run('table region, caption, headers and cells are read', async ({ heard, tabTo, nextItem }) => {
    await tabTo('loans this month');
    for (let i = 0; i < 10; i++) await nextItem();
    const t = await heard();
    expect(t).toContain('loans this month');
    expect(t).toContain('branch');
    expect(t).toContain('quay lane');
    expect(t).toMatch(/4,?812/);
  });

  run('tab bar is a named navigation with the current page marked', async ({ heard, linkTo }) => {
    await linkTo('loans this month');
    await linkTo('home');
    const t = await heard();
    expect(t).toMatch(/current/);
  });
}
