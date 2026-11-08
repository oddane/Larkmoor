// What a screen reader is given for the components added in 0.2.0: roles, names, states and focus,
// read from Chromium's accessibility tree (the same tree NVDA, JAWS and TalkBack consume in Chrome).
// Real VoiceOver and NVDA runs of the same fixture are in tests/screen-reader (CI only).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { setup, open } from './helpers.mjs';

const FIXTURE = '/tests/screen-reader/';
let env;
before(async () => { env = await setup(); });
after(async () => { await env.close(); });

const load = async () => {
  const o = await open(env.browser, env.base + FIXTURE, { viewport: { width: 700, height: 900 } });
  await o.page.waitForSelector('html[data-ready="true"]');
  return o;
};
const focused = (page) => page.evaluate(() => { const e = document.activeElement; return e && (e.id || e.textContent.trim()); });

test('tabs: tablist, tabs and panel are exposed with selection; arrows move selection and focus', async () => {
  const { page, context, errors } = await load();
  const tabs = page.locator('#demo-tabs');
  assert.match(await tabs.ariaSnapshot(), /- tablist "Plan details":\n\s+- tab "Overview" \[selected\]\n\s+- tab "Pricing"\n\s+- tab "Questions"\n- tabpanel "Overview":/);
  await page.locator('#t-overview').focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await focused(page), 't-pricing');
  assert.match(await tabs.ariaSnapshot(), /- tab "Pricing" \[selected\]/);
  assert.match(await tabs.ariaSnapshot(), /- tabpanel "Pricing"/);
  await page.keyboard.press('End');
  assert.equal(await focused(page), 't-faq');
  await page.keyboard.press('Home');
  assert.equal(await focused(page), 't-overview');
  // inactive tabs are skipped by Tab (roving tabindex); Tab goes to the panel next
  await page.keyboard.press('Tab');
  assert.equal(await focused(page), 'p-overview');
  await context.close();
  assert.deepEqual(errors, []);
});

test('dialog: opens as a named modal dialog, moves focus in, Escape closes and returns focus', async () => {
  const { page, context, errors } = await load();
  await page.locator('#open-dialog').focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Delete this card?' });
  await dialog.waitFor();
  assert.equal(await page.evaluate(() => document.getElementById('demo-dialog').matches(':modal')), true);
  assert.ok(await page.evaluate(() => document.getElementById('demo-dialog').contains(document.activeElement)), 'focus moved into the dialog');
  // content behind a modal dialog is inert, so Chromium's accessibility tree marks it ignored
  const cdp = await context.newCDPSession(page);
  const { root } = await cdp.send('DOM.getDocument');
  const ignored = async (selector) => { const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector }); const { nodes } = await cdp.send('Accessibility.getPartialAXTree', { nodeId, fetchRelatives: false }); return nodes[0].ignored; };
  assert.equal(await ignored('#h-crumbs'), true, 'page behind the dialog is still exposed');
  assert.equal(await ignored('#demo-dialog-title'), false);
  await page.keyboard.press('Escape');
  assert.equal(await focused(page), 'open-dialog');
  assert.equal(await dialog.count(), 0);
  await context.close();
  assert.deepEqual(errors, []);
});

test('toast: the live region exists from page load, and a region made on demand waits before the first message', async () => {
  const { page, context, errors } = await load();
  // initToasts() on load: the region is in the tree before anything is said
  assert.equal(await page.getByRole('status').count(), 1);
  await page.locator('#save-draft').click();
  const status = page.getByRole('status');
  await status.getByText('Draft saved').waitFor();
  assert.equal(await status.getAttribute('aria-live'), 'polite');
  assert.match(await status.ariaSnapshot(), /- status:\n\s+- text: Draft saved\n\s+- button "Dismiss"/);
  // without initToasts(): toast() creates the region, then writes the message at least 100ms later
  const gap = await page.evaluate(async () => {
    document.querySelector('.lm-toast-region').remove();
    const order = [];
    const mo = new MutationObserver((list) => { for (const m of list) for (const n of m.addedNodes) if (n.nodeType === 1) order.push([n.className, performance.now()]); });
    mo.observe(document.body, { childList: true, subtree: true });
    const { toast } = await import('/dist/larkmoor.js');
    toast('Second');
    await new Promise((r) => setTimeout(r, 400));
    mo.disconnect();
    const region = order.find(([c]) => c === 'lm-toast-region'); const item = order.find(([c]) => c === 'lm-toast');
    return region && item ? item[1] - region[1] : -1;
  });
  assert.ok(gap >= 100, `first message written ${Math.round(gap)}ms after its region was created`);
  await context.close();
  assert.deepEqual(errors, []);
});

test('breadcrumbs and pagination: named navigation landmarks with the current item marked', async () => {
  const { page, context } = await load();
  const crumbs = await page.getByRole('navigation', { name: 'Breadcrumb' }).ariaSnapshot();
  assert.match(crumbs, /- navigation "Breadcrumb":\n\s+- list:\n\s+- listitem:\n\s+- link "Home"/);
  assert.match(crumbs, /Replace a lost card/);
  assert.doesNotMatch(crumbs, /text: \//, 'the "/" separators are read aloud');
  assert.equal(await page.locator('.lm-breadcrumbs [aria-current="page"]').textContent(), 'Replace a lost card');
  const pages = await page.getByRole('navigation', { name: 'Pagination' }).ariaSnapshot();
  assert.match(pages, /- link "Previous page"/);
  assert.match(pages, /- link "Next page"/);
  assert.match(pages, /- link "2"/);
  assert.equal(await page.locator('#page-current').getAttribute('aria-current'), 'page');
  // the arrow glyphs are only visual: aria-label gives the links their names
  assert.equal(await page.getByRole('link', { name: '←' }).count(), 0);
  await context.close();
});

test('table: named scrollable region, caption, column and row headers', async () => {
  const { page, context } = await load();
  const region = page.getByRole('region', { name: 'Loans this month' });
  assert.equal(await region.getAttribute('tabindex'), '0');
  const snap = await region.ariaSnapshot();
  assert.match(snap, /- table "Loans this month":/);
  assert.match(snap, /- columnheader "Branch"/);
  assert.match(snap, /- columnheader "Books"/);
  assert.match(snap, /- rowheader "Quay Lane"/);
  assert.match(snap, /- cell "4,812"/);
  await context.close();
});

test('tab bar: named navigation, icons hidden, current page marked', async () => {
  const { page, context } = await load();
  const snap = await page.getByRole('navigation', { name: 'App' }).ariaSnapshot();
  assert.match(snap, /- link "Home"/);
  assert.match(snap, /- link "Search"/);
  assert.doesNotMatch(snap, /img/);
  assert.equal(await page.locator('#tab-home').getAttribute('aria-current'), 'page');
  await context.close();
});
