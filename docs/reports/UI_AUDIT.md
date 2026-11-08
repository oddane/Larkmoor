# UI audit: Tauawo website and Larkmoor

**Dates:**
- 8 November 2026 (second pass).
- The first pass, the same morning, covered Version 13 of the site. Its fixes (F1–F11) were kept and are summarised in §4.

**Scope:** Tauawo website (single page, one route) plus its shared components, the Harbor example and the docs page.

**Method:**
- read every line of the HTML, CSS and JS;
- rendered in Chromium at 17 widths;
- automated checks in `tests/`;
- visual review of full-page screenshots;
- claims checked against the app source (PRIVACY_EVIDENCE.md).

**Standards:** WCAG 2.2 AA; web.dev Core Web Vitals. See RESEARCH.md for every source actually read.

**Severity:**
- **High:** blocks or misleads.
- **Medium:** fails an AA criterion or a budget, or hurts a main task.
- **Low:** polish.

## 1. Inventory

**Routes**
- The site is one page with in-page anchors: `#app`, `#privacy`, `#security`, `#roadmap`, `#faq`.
- There are no authenticated areas, forms that submit data, dialogs or other templates.
- The app is not a website and is out of scope, except for claim verification.

**Shared components found and consolidated**

| Component | Status |
|---|---|
| header + nav + mobile menu | `lm-header` |
| primary and secondary buttons | `lm-btn` |
| text link | `lm-link` |
| eyebrow label and type roles | `lm-label`, `lm-*` text roles |
| section head | `lm-section-head` + `lm-split` |
| segmented control | `lm-segmented` |
| FAQ disclosure | `lm-accordion` |
| message composer | `lm-input-group` |
| status tags | `lm-badge` |
| detail rows | `lm-rows` |
| demo panel | `lm-panel` |
| footer | `lm-footer` |
| reading progress | `lm-progress` |
| motion toggle | `lm-motion-toggle` |

**Product-specific (kept in `tauawo.css`):** cipher hero, iPhone frame, sticky chapter story and rail, "never" list, privacy preview phones, message route demo, ledger, spec, roadmap.

## 2. Coverage matrix

| Category | Covered | How | Result |
|---|---|---|---|
| Information architecture, hierarchy | Every section, header, footer | Read through as a visitor. Heading outline test. | One h1. Numbered sections in a logical order (problem → product → privacy → security → roadmap → FAQ → action). Footer legal link added (F15). |
| Layout, grids, alignment | All sections at 17 widths | Overflow test; screenshots | Fixed F12 (privacy demo cramped at 900–1099px) and F17 (footer rule, badge stretch) |
| Spacing and rhythm | All | Token audit; screenshots | All spacing from the scale. Two documented optical exceptions (GUIDELINES.md). |
| Typography | All roles | Screenshots; text-spacing test | Fixed F16 (one-word orphan in a chapter heading) |
| Colour, surfaces, contrast | 4 themes, rendered pages | Unit contrast test per theme; rendered-text contrast test | Pass |
| Icons, imagery, media | Logos, arrows, 6 screenshots | Code review | Explicit dimensions, WebP, alt text on unique images, `alt=""` on the decorative stage duplicates, first screen eager and the rest lazy |
| Responsive | 320–1920 plus both sides of 520/760/900/1100; 568px-tall screens; landscape 844×390 | Responsive test | Pass after F12 and F13 |
| Components and states | Every component on the docs page | Interaction tests; docs page | Fixed F14 (form layout shift on blur). F18 (`.01ms` transitions gave stale state). |
| Accessibility | See ACCESSIBILITY.md | Automated plus manual plan | Automated checks pass. Screen-reader checks need your devices. |
| Content | All copy | Read against app source | Claims supported (PRIVACY_EVIDENCE.md). Metadata disclosures suggested. |
| Performance | Tauawo, Harbor | Lab test, 3 runs, median | Budgets met after F19 (lab only) |
| Privacy of the site itself | All requests | Network log test | Fixed F20 (Google Fonts request) |
| Localization / RTL | — | — | Not applicable now: English only. Logical properties are used for container padding and inline margins. RTL is untested. |
| Dialogs, drawers, tables, uploads, pagination | — | — | Not applicable: none exist on these pages. Listed as "not built yet" in the docs. |

## 3. Findings from this pass

Each finding gives: **where**, **problem**, **impact**, **fix**, **verified**.

### F12. Privacy demo cramped between 900 and 1099px (Medium)
- **Where:** Tauawo, `#privacy`, 1024px.
- **Problem:** the two preview phones were about 110px wide. Bubbles and labels wrapped word by word.
- **Impact:** the main interactive explanation of privacy profiles became hard to read on tablets and small laptops.
- **Fix:** the copy and demo stack below the 1100px breakpoint, with the demo capped at 680px.
- **Verified:** the 1024px screenshot; the responsive test.

### F13. Docs page scrolled sideways at 320 and 375px (Medium)
- **Where:** docs, colour and spacing rows; input-group example.
- **Problem:**
  - unbreakable code strings;
  - a 96px bar inside a narrow column;
  - an `<input>` whose built-in width set the group's minimum width.
- **Impact:** small phones scrolled sideways.
- **Fix:**
  - `overflow-wrap: anywhere` on code (system-wide);
  - `min-width: 0` columns;
  - `.lm-input-group input { width: 0; flex: 1 }` (system-wide fix: the same bug would hit any consumer).
- **Verified:** the responsive test now passes at all 17 widths. It ignores intentional scroll areas such as `<pre>`.

### F14. Form messages shifted the layout on blur, so the next click missed (High)
- **Where:** `initForm`, Harbor sign-up.
- **Problem:** after a failed submit, fixing a field and clicking the next control re-validated on blur. The error line disappeared and the content below moved up about 24px between mouse-down and mouse-up, so the click landed on empty space. The browser test caught it: a checkbox would not tick.
- **Impact:** people had to click twice and might not notice.
- **Fix:** validate on submit. After that, a field already marked wrong re-checks as you type, so the error clears once fixed. Nothing changes on blur.
- **Verified:** the form interaction test (error summary focus, messages, kept input, busy state, failure, retry, success only after resolve).

### F15. No privacy policy link on the site (Medium)
- **Where:** Tauawo footer.
- **Problem:** the app links its privacy and terms page; the site did not.
- **Fix:** added "Privacy policy and terms" to the Help column. It uses the app's own `LEGAL_URL`.
- **Verified:** link present; a11y test (name).
- **Still to do:** move that page to your own domain before launch (PRIVACY_EVIDENCE.md §2).

### F16. Orphaned word in a chapter heading (Low)
- **Where:** "See everything. Be seen by no one." at 1440px.
- **Problem:** "one." wrapped alone.
- **Fix:** `text-wrap: balance` on chapter headings.
- **Verified:** screenshot.

### F17. Footer details (Low)
- **Problem:**
  - the "In private testing" pill stretched across the brand column;
  - the bottom rule ran into the gutters.
- **Fix:**
  - badges are `fit-content` (system-wide);
  - the footer rule is inset to the gutters.
- **Verified:** screenshots.

### F18. Reduced-motion rule left a tiny transition running (Low, test-found)
- **Problem:** `transition-duration: .01ms` still starts a transition, so script reading state in the same frame saw old values. In tests the skip link looked off-screen when focused.
- **Fix:** transitions are `0s` under reduced motion. The skip link is also `position: fixed`, so it shows wherever focus is.
- **Verified:** keyboard focus test.

### F19. Start-up work on slow phones (Medium, performance)
- **Problem:** with the real fonts loading, total blocking time at 4× CPU was 215–258ms (lab budget < 200).
- **Causes:**
  - the hero canvas was set up twice (before and after fonts);
  - reveal set-up ran in the first task.
- **Fix:**
  - the canvas is set up once, after the mono font loads (1.2s fallback);
  - reveal set-up waits for idle time.
- **Tried and dropped:** `content-visibility: auto` on sections. The gain was within noise, and full-page captures rendered blank sections.
- **Verified:** perf test, median TBT 167–173ms.

### F20. Google Fonts request contradicted "no trackers" (High, for the claim)
- **Problem:** every visit sent the visitor's IP address to Google.
- **Fix:** fonts self-hosted from the package; only the faces used are loaded and preloaded.
- **Verified:** network test, 0 off-site requests and 0 cookies (`docs/evidence/network-*.json`).

## 4. First-pass findings (kept)

| ID | Problem | Fix | Status |
|---|---|---|---|
| F1 | Inactive chapters at 1.5:1 contrast | Recede by colour | ✅ still passing |
| F2 | No pause for looping motion (2.2.2) | Pause control, remembered | ✅ now `lm-motion-toggle` |
| F3 | Mobile CLS 0.103 | Reserved heights | ✅ CLS 0 in the lab |
| F4 | Forced-colours loss of state | System colours | ✅ |
| F5 | Dead controls without JS | Hidden | ✅ now `data-lm-requires-js` |
| F6 | Focus lost on busy button | `aria-disabled` | ✅ |
| F7 | "Split view" overclaim | "Tablet layout" | ✅ |
| F8 | Terse title | Descriptive title | ✅ |
| F9 | Missing touch icon and share tags | Added | ✅ (`og:image` and canonical still need the domain) |
| F10 | Heavy JPEGs | WebP | ✅ |
| F11 | Rail labels on hover only; no Send key | Focus labels; `enterkeyhint` | ✅ |
| — | Gradient accents | Solid green #1f7a4f, as you asked | ✅ |

## 5. Still open

| Item | Why open | Owner |
|---|---|---|
| Canonical URL, `og:image` | Need the final domain | You choose the domain; then a 10-minute change |
| Screen readers, Safari, Firefox, real phones | Not available here | You, using ACCESSIBILITY.md |
| Field Core Web Vitals | No real visitors yet | After launch |
| axe-core scan | Package registry unreachable here | One run of the axe browser extension |
| Privacy page on your own domain; push metadata disclosure | Content decision | You |

## 6. Version 0.2.0 findings

| ID | Where | Problem | Impact | Fix | Verified |
|---|---|---|---|---|---|
| F21 | Breadcrumb links | 22px tall | Under the WCAG 2.5.8 24px minimum | `min-height` 24px, 44px on touch | a11y target test |
| F22 | React Native `Text` | Prop `role` clashed with React Native's accessibility `role` | Wrong prop type; could break screen-reader roles | Renamed to `variant` | Strict `tsc` against React Native 0.88.1 |
| F23 | React Native `Field` | Ref typed for an older TextInput | Type error in apps on React Native 0.88 | `inputRef` prop with `ComponentRef<typeof TextInput>` | same |
| F24 | React Native text styles | Mutated read-only styles | Type error on 0.88 | Built immutably | same |
| F25 | Default theme | No dark mode | Phones in dark mode got a bright page and app | `evergreen-dark` plus automatic switching | Contrast unit test; dark-mode browser test |
| F26 | Benchmark gaps | Missing tabs, dialog, sheet, toast, breadcrumbs, pagination, table; no safe areas; no touch sizing | Common patterns had to be hand-built | Added, each with docs and tests | Interaction tests |
