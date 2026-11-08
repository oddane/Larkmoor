# Accessibility

**Target:** WCAG 2.2 Level AA (W3C Recommendation, 12 Dec 2024), including the Level A criteria.

**What this file is:** what is built in, what is tested automatically, and what still needs a person with real devices. Passing the automated checks does **not** certify conformance.

## Built in

| Requirement (WCAG 2.2) | How the system meets it |
|---|---|
| 1.3.1 Info and relationships | Landmarks (header, nav, main, footer), real headings, `fieldset`/`legend` for radio groups, `dl` for rows, labels tied to inputs |
| 1.4.3 / 1.4.11 Contrast | Every theme's text roles reach ≥ 4.5:1, and accent/focus/action ≥ 3:1, on both grounds (unit test). Rendered text is checked in the browser too. |
| 1.4.4 / 1.4.10 Resize and reflow | Fluid type mixes px and vw with px bounds. No sideways scroll from 320px. No `maximum-scale` or zoom lock. |
| 1.4.12 Text spacing | Tested with the WCAG override: nothing clips |
| 1.4.13 / 2.1.1 Keyboard | Everything is reachable by Tab. Radio groups use arrows. Menu closes on Escape and returns focus. Rail labels show on focus. |
| 2.2.2 Pause, stop, hide | `.lm-motion-toggle` pauses all CSS animation and the hero canvas. The choice is remembered. |
| 2.3.3 Animation from interactions | `prefers-reduced-motion` removes transitions, the hero canvas motion, scroll reveals, the header hide and the button lean |
| 2.4.1 Bypass blocks | Skip link (fixed position, so it is visible wherever focus lands) |
| 2.4.7 / 2.4.11 Focus visible, not obscured | 2px focus ring in `--lm-color-focus`. The header slides back when anything in it gets focus, and `scroll-padding-top` keeps anchors clear. Tested: no focus stop is fully covered. |
| 2.5.8 Target size (24×24) | Smallest controls: the Tauawo chapter rail buttons (28px tall) and the motion toggle (32px). Buttons are 36 or 44px, segmented options 36px. Inline links in text use the inline exception. |
| 3.3.1 / 3.3.3 Errors | Text errors with an icon (not colour alone), linked by `aria-describedby`, plus an error summary that gets focus and links to each field. Input is kept on failure. |
| 4.1.2 Name, role, value | Native controls. `aria-expanded`, `aria-pressed`, `aria-current` and `aria-invalid` reflect state. |
| 4.1.3 Status messages | `aria-live="polite"` for the send demo and privacy preview, `role="status"` for success, `role="alert"` only for failure |
| Forced colours | System colours for selected states, strike-throughs and dots. Decorative layers are hidden. Transparent borders keep button outlines. |
| No JavaScript | Content reads fully. Script-only controls are hidden with `data-lm-requires-js`. |

## Tested combinations (automated, Chromium 1.63)

| Pages | Widths | Modes | Checks |
|---|---|---|---|
| Tauawo, Harbor, docs | 390, 1280 | reduced motion | lang, title, one h1, one main, skip link, heading order, accessible names, duplicate ids, broken ARIA references, img alt, rendered text contrast, 24px targets |
| Tauawo, Harbor, docs | 1280 | keyboard | every Tab stop has a ≥2px ring and is not fully covered by the header |
| All three | 17 widths, 320 to 1920, two heights | — | no sideways scroll; primary action on the first screen |
| Tauawo | 1280 | WCAG text-spacing override | no clipping, no sideways scroll |
| Tauawo | 1280 | forced colours | selected option and strike-through distinguishable |
| Tauawo, Harbor | 1280 | JavaScript off | content visible; script-only controls hidden |
| Tauawo, Harbor (light and dark) | 1280 | `prefers-contrast: more` | the high-contrast partner is applied; all measurable text 7:1 (large text 4.5:1) |
| Screen-reader fixture | 700 | accessibility tree | tabs, dialog (modal, inert background, focus in and back), toast (live region order), breadcrumbs, pagination, table, tab bar: roles, names, states |

The contrast checker skips text over gradients and images and lists them for manual review. The checked segment's label sits on a pseudo-element thumb, so its pair (on-action on action) is checked in the unit test instead.

**Not available here:** axe-core, because the package registry was unreachable from the build environment. Run the axe DevTools extension once on each page.

## Screen readers in CI

`.github/workflows/screen-readers.yml` runs on every push. It starts real screen readers on GitHub's machines with [Guidepup](https://github.com/guidepup/guidepup) and reads `tests/screen-reader/index.html`:
- **VoiceOver** on macOS with WebKit (Safari's engine);
- **NVDA** on Windows with Firefox.

For tabs, dialog, toast, breadcrumbs, pagination, table and tab bar it checks what the screen reader actually said: names, roles, selected and current states, the dialog name on opening, focus return on Escape, the toast announcement, and that breadcrumb separators and arrow glyphs are not read. Everything spoken is uploaded as a build artifact, pass or fail.

Everything is done through the screen reader, the way its users work:
- VoiceOver moves with its own next-item command and presses with VO-Space, because Safari's Tab key skips links and buttons by default;
- NVDA uses Tab, Enter and Escape, and reports the focused element after each step.

**What the real screen readers said (GitHub Actions, 8 November 2026; both jobs green, retries allowed: 2):**

| Component | VoiceOver (macOS 15, WebKit) | NVDA 2026.3 (Windows, Chromium) |
|---|---|---|
| Tabs | ✅ "Pricing selected tab, 2 of 3" (passed on retry: the first attempt caught VoiceOver's hint instead) | ✅ "Pricing, tab, selected, 2 of 3" |
| Dialog | ✅ name and "dialog" on opening; focus back on "Delete card button" after Escape (sometimes on retry: VoiceOver's walk to the button is slow) | ✅ |
| Toast | ❔ not announced in 6 attempts; see below | ✅ "Draft saved" |
| Breadcrumbs | ✅ "Breadcrumb navigation", "Replace a lost card current page 3 of 3", no "slash" | ❔ browse-mode reading not captured |
| Pagination | ✅ "link Previous page", "current page link 2" | ✅ "2, link, … current page" |
| Table | ✅ "Loans this month table 3 columns, 3 rows", "BOOKS 4,812 column 2 of 3" | ❔ browse-mode reading not captured |
| Tab bar | ✅ "App navigation", current page | ✅ "Home, link, … current page" |

**Known gaps** (reported as "fixme" in the workflow, with the reason):
- **VoiceOver and the toast:** VoiceOver, driving Playwright's WebKit build, never spoke the polite status message. The toast was on the page each time, and NVDA announces it. Two changes made the toast more robust anyway: `initToasts()` now creates the live region on page load, and a region made on demand waits 150ms before the first message. It still needs one check on a real iPhone or Mac with Safari.
- **NVDA browse mode:** on the Windows runner, Guidepup records NVDA's focus announcements but not its browse-mode reading (Down arrow, next item). So the breadcrumb current-page text and the table cells are verified by VoiceOver and the accessibility-tree tests, not NVDA.

## Manual checks that need your devices

| Check | How | Time |
|---|---|---|
| VoiceOver on iPhone (Safari) | Swipe through each page. Use the menu, privacy switch, send demo, FAQ and the Harbor form (submit empty, fix, submit). Listen for the status announcements, and for "Draft saved" after Save draft on the docs page (the one gap in the automated VoiceOver run). | 20 min |
| TalkBack on Android (Chrome) | Same as above | 20 min |
| NVDA + Firefox on Windows | Same, plus Tab order and the Escape key | 20 min |
| iPhone Increase Contrast | Settings → Accessibility → Display & Text Size → Increase Contrast, then open Harbor in Safari and an app using `.larkmoorTheme`. Colours should switch to the high-contrast theme. | 5 min |
| SwiftUI and Compose components with VoiceOver and TalkBack | Render `LarkmoorField`, `LarkmoorSegmentedControl` and `LarkmoorAccordion` in a test screen; swipe through them. | 15 min |
| Windows High Contrast (real) | Settings → Accessibility → Contrast themes. Check the privacy switch and the form errors. | 5 min |
| Browser zoom 200% and 400% on desktop Safari and Firefox | Ctrl/Cmd + until 400%. Nothing should be cut off. | 5 min |
| iOS text size (largest) | Settings → Display → Text Size | 5 min |
| On-screen keyboard | On a phone, type in the send demo and the Harbor form. The field should stay visible and the Send key should submit. | 5 min |

## Known limitations

- The hero cipher field is a decorative canvas (`aria-hidden`). Its message is also stated in text.
- The phone screenshots in the sticky stage are decorative duplicates (`alt=""`). The per-chapter copies carry the alt text.
- Harbor's event filter is a CSS-only radio group. Screen readers announce the radio state, but not how many cards are shown.
