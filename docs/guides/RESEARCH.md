# Larkmoor: Research Notes

Access date for every source below: **2026-11-08**.

## Scope and honesty statement

These notes back the first version of the Larkmoor design system. It is a small, reusable CSS design system. Its first consumer is a single-page marketing site for a privacy messenger, built with plain HTML, CSS and vanilla JS and no framework.

This is not a literature review. Nobody can search the entire internet, and we did not try. We opened a fixed list of primary sources, plus one or two linked pages per site where needed. This file records only what those pages actually said when we fetched them. Pages that failed to load, or that loaded without readable content, are listed under "Could not access" and are not used as evidence. We took no number or rule from memory. When a page did not state something, these notes say so.

Pages were read through an automated fetch that converts HTML to text. Content rendered only by JavaScript, or tables that did not render, could not be seen. Where that limited what we learned, the entry says so.

### Could not access (not cited as evidence)

| URL | Result |
|---|---|
| https://m3.material.io/foundations/ | Loaded, but the body was only "This website requires JavaScript". There was no usable content, only metadata. |
| https://m3.material.io/foundations/layout/applying-layout | Same: JS-only shell, no content. |
| https://m3.material.io/foundations/layout/applying-layout/window-size-classes | Fetch failed: `client_error` from the site. |
| https://m3.material.io/foundations/layout/understanding-layout/spacing | JS-only shell, no content. |
| https://spectrum.adobe.com/page/layout-spacing/ | Fetch failed: `client_error` from the site. |

**Consequence:** we cite **no Material 3 numbers** in this file. The Material window size classes and dp breakpoints are a known gap. They must be read in a JS-capable browser before anyone quotes them.

---

## 1. Accessibility conformance requirements

This section covers WCAG only. These requirements are **normative**: they are what a conformance claim is tested against. The target is **WCAG 2.2 Level AA**.

### 1.1 W3C, Web Content Accessibility Guidelines (WCAG) 2.2

- **URLs opened:**
  - https://www.w3.org/TR/WCAG22/ (read in two parts)
  - https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html (for the full 2.5.8 text and exceptions)
- **Accessed:** 2026-11-08
- **Status:** W3C Recommendation, 12 December 2024. The dated version is `https://www.w3.org/TR/2024/REC-WCAG22-20241212/`. The page lists errata but no later edited date.

| SC | Level | What the page requires (paraphrase) | Larkmoor decision |
|---|---|---|---|
| 1.4.3 Contrast (Minimum) | AA | Text contrast of at least 4.5:1. Large text (18pt, or 14pt bold) needs 3:1. Exempt: inactive components, decoration, logotypes, incidental text. | Every `text`/`bg` and `muted`/`bg` token pair must reach 4.5:1 in each theme. The token build checks contrast ratios. |
| 1.4.10 Reflow | AA | No two-dimensional scrolling at 320 CSS px width (or 256 px height for horizontal content), with no loss of content. Exempt: content that needs 2D layout. | The single-column base layout is tested at 320 px. Fluid gutters must never force sideways scrolling. |
| 1.4.11 Non-text Contrast | AA | UI component boundaries, states and meaningful graphics need 3:1 against adjacent colours. | `border` (on interactive controls) and `focus` tokens must reach 3:1 against `bg`. |
| 1.4.12 Text Spacing | AA | No loss of content when the user sets line height to 1.5×, paragraph spacing to 2×, letter spacing to 0.12× and word spacing to 0.16× the font size. | No fixed heights on text containers. Use `min-height` and padding, not `height`. |
| 2.2.2 Pause, Stop, Hide | A | Moving, blinking or scrolling content that starts automatically, lasts more than 5 s and runs alongside other content needs a way to pause, stop or hide it. | Any looping hero animation gets a visible pause control, in addition to honouring `prefers-reduced-motion`. |
| 2.4.7 Focus Visible | AA | Keyboard-operable UI has a mode where the focus indicator is visible. No numeric size is given. | Use `:focus-visible` with the `focus` token outline. Never set `outline: none` without a replacement. |
| 2.4.11 Focus Not Obscured (Minimum) | AA (new in 2.2) | A focused component is not *entirely* hidden by author-created content. | Sticky header plus `scroll-padding-top` on `html`, so anchored and tabbed targets are not hidden. |
| 2.5.8 Target Size (Minimum) | AA (new in 2.2) | Pointer targets are at least 24×24 CSS px. Exceptions: spacing (a 24 px circle does not intersect neighbours), an equivalent control, inline text, user-agent default, essential. | Interactive elements have a minimum size of 24 px (see §3). |

We also saw that **2.5.5 Target Size (Enhanced)** is AAA, at 44×44 CSS px. We use it as our *preferred* size, not as a conformance claim.

- **Single quote (2.5.8):** "at least 24 by 24 CSS pixels".
- **Not read:** the Understanding documents for SCs other than 2.5.8, and 2.4.13 Focus Appearance (AAA).

---

## 2. Recommendations and conventions from specific design systems

None of these sources is normative for conformance. They are conventions and evidence of practice. The ARIA Authoring Practices Guide (APG) is **guidance**: it describes itself as a guide, and none of the pages we read made a normative claim.

### 2.1 W3C WAI, ARIA Authoring Practices Guide (APG)

- **URLs opened:**
  - https://www.w3.org/WAI/ARIA/apg/
  - https://www.w3.org/WAI/ARIA/apg/patterns/radio/
  - https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
- **Accessed:** 2026-11-08
- **Status:** The landing page calls the APG a guide maintained by the APG Task Force. No page we read states that it is normative. We treat it as non-normative.
- **Radio group:**
  - Tab and Shift+Tab move into and out of the group. Focus lands on the checked radio, or on the first one if none is checked.
  - Arrow keys move focus *and* change the checked radio, wrapping at the ends. Space checks the focused radio.
  - Roles: `radiogroup` containing `radio` elements, with `aria-checked`. The group has a label.
  - The page notes that native HTML radio groups can behave differently with Shift+Tab when nothing is checked.
- **Disclosure:**
  - The control is a `button` that sets `aria-expanded` to true or false. `aria-controls` is optional.
  - Enter and Space toggle the content.
  - This page did not link to the Accordion pattern. We did not open the Accordion pattern.
- **Single quote (landing page):** "This guide describes how to apply accessibility semantics".
- **Larkmoor decisions:**
  - The theme or plan switcher uses native `<input type="radio">` inside `<fieldset>`/`<legend>`. This gives the APG keyboard model for free, with no custom ARIA.
  - FAQ items use native `<details>`/`<summary>`, or a `<button aria-expanded>` when the animation needs JS.
  - Accordion-specific behaviour is a hypothesis until the Accordion pattern page is read.

### 2.2 IBM Carbon Design System

- **URLs opened:**
  - https://carbondesignsystem.com/elements/spacing/overview/
  - https://carbondesignsystem.com/elements/2x-grid/overview/
  - https://carbondesignsystem.com/elements/typography/type-sets/
- **Accessed:** 2026-11-08
- **Spacing:**
  - 13 tokens: 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96 and 160 px, expressed in rem (16 px = 1 rem is implied but not stated).
  - The page describes the scale as built from multiples of 2, 4 and 8.
- **2x Grid:**
  - The 8 px "mini unit" is the base geometry.
  - Breakpoints and columns: sm 320 (4 columns), md 672 (8), lg 1056 (16), xlg 1312 (16), max 1584 (16).
  - Padding is 16 px. The optional gutter totals 32 px.
- **Type sets:**
  - *Productive* has a 14 px base, uses fixed sizes only, and suits dense product UI.
  - *Expressive* has a 16 px base and suits web and marketing pages. Its headings and display styles are fluid across breakpoints. Example: `body-02` is 16/24, and `fluid-display-04` is 92/102.
  - The page says fluid styles should not go inside containers.
- **Single quote:** none used.
- **Larkmoor decisions:**
  - Our spacing steps are a subset of Carbon's values: 4, 8, 12, 16, 24, 32, 48, 64, 96.
  - The marketing site follows the *expressive* model: 16 px body with fluid display type.
  - We do not adopt Carbon's 16-column grid or its device-width breakpoints (see §3).

### 2.3 Google Material Design 3

- **URLs attempted:** see "Could not access". Every page was JS-only or failed.
- **Finding:** none. **Larkmoor decision:** no Material values are used. Material window size classes are listed as an open item in §3.
- **Addendum, same day:** an official Google page that restates the Material breakpoints was readable. The source is Android Developers, "Use window size classes", https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes, accessed 2026-11-08.
  - **Width classes:**
    - compact: under 600dp;
    - medium: 600–839dp;
    - expanded: 840–1199dp;
    - large: 1200–1599dp;
    - extra-large: 1600dp and up.
  - **Origin:** the page says compact, medium and expanded map to Material's layout guidance. Large and extra-large are Android additions.
  - **This is a secondary source.** The m3.material.io page itself was still not read.
  - **Larkmoor decision:** our content breakpoints (520/760/900/1100) sit near Material's 600/840/1200 but are not aligned to them. They come from where this content breaks.

### 2.4 Adobe Spectrum

- **URLs opened:**
  - https://spectrum.adobe.com/page/color-system/
  - https://spectrum.adobe.com/page/spacing/
  - https://spectrum.adobe.com/page/typography/
- **Accessed:** 2026-11-08
- **Colour system:**
  - Each colour has light and dark variants. Background-layer colours carry hierarchy across both themes.
  - Palettes are generated in Leonardo against target contrast ratios. Tokens are meant to meet WCAG on background layers, but you still have to check every supported theme.
  - Use tokens directly. Do not adjust them with `lighten()`-style functions.
  - Do not rely on colour alone: feedback colours need a label or icon.
- **Spacing overview:**
  - Three principles: relational, proportional and perceptual.
  - Separate *layout* and *component* spacing tracks that scale at different rates.
  - No numeric values were on this page. The layout-spacing subpage failed to load.
- **Typography overview:** Adobe Clean Spectrum VF is the default typeface. This page had no scale or line-length values.
- **Single quote:** "do not use color alone as a method of communication".
- **Larkmoor decisions:**
  - Semantic colour tokens (`bg`, `text`, `muted`, `accent`, `border`, `focus`) are defined per theme and never adjusted at the point of use.
  - Contrast is verified per theme in the build.
  - Section-level spacing (fluid section padding) is kept separate from component spacing (fixed `--s-*` steps).

### 2.5 U.S. Web Design System (USWDS)

- **URLs opened:**
  - https://designsystem.digital.gov/design-tokens/spacing-units/
  - https://designsystem.digital.gov/components/typography/
  - https://designsystem.digital.gov/utilities/layout-grid/
- **Accessed:** 2026-11-08
- **Spacing units:**
  - The base unit is 8 px, with extra small steps: 1px, 2px, 4px (`05`), 12px (`105`), 20px (`205`).
  - Then 24, 32, 40, 48, 56, 64, 72, 80 and 120 px, plus named sizes: card 160, mobile 320, tablet 640, desktop 1024, desktop-lg 1200, widescreen 1400.
  - Values above 2 px are output as rem.
- **Typography:**
  - Most lines should be 45 to 90 characters. Measure 2 (66 characters) is a good target for long text.
  - Body line height is at least 1.5 for longer text. Headings use 1 to 1.35.
  - The page does not mention `ch` units.
- **Layout grid:**
  - 12-column flexbox grid. Default-on breakpoints are mobile-lg 480, tablet 640 and desktop 1024.
  - `grid-container` defaults to a desktop maximum of 1024 px. Its padding is 2 units, rising to 4 units at desktop.
  - Columns have no gutters by default. `grid-gap` adds them.
- **Single quote:** "Most lines of text should be 45–90 characters."
- **Larkmoor decisions:**
  - Prose measure is about 65ch, inside USWDS's 45–90 range and close to its 66-character target.
  - Body line height is 1.5 or more.
  - The container maximum (1200 px) matches USWDS's `desktop-lg` value.

### 2.6 MDN Web Docs

- **URLs opened:**
  - https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design
  - https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
  - https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors
  - https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries
  - https://developer.mozilla.org/en-US/docs/Web/CSS/@container
  - https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties
- **Accessed:** 2026-11-08
- **Responsive design:**
  - Work mobile-first.
  - Set breakpoints where the content starts to look bad, not at device sizes, and prefer relative units.
  - Media queries are optional when flexible layout is enough.
  - Always include the viewport meta tag.
  - Viewport-unit-only text cannot be zoomed. Combine `vw` with a rem value, as in `calc(1.5rem + 4vw)`. This page does not cover `clamp()`.
- **Custom properties:** `var()` works only in property values. It cannot be used in a media query or container query.
- **Container queries:**
  - Covers `container-type` (`inline-size`/`size`), `container-name`, `@container`, and `cq*` units.
  - `@container` size queries are Baseline *Widely available*, across browsers since February 2023. Some sub-features vary.
- **`prefers-reduced-motion`:**
  - Values are `reduce` and `no-preference`. Baseline Widely available since January 2020.
  - Override motion inside the query rather than removing it, and swap in gentler effects such as opacity.
- **`forced-colors`:**
  - Values are `active` and `none`. Baseline Widely available since September 2022.
  - Colour properties are forced. `box-shadow` is forced to none.
  - Use system colours for small fixes only. Do not build a separate forced-colours design.
- **Single quote (Responsive Design):** "you should never set text using viewport units alone".
- **Larkmoor decisions:**
  - Fluid type uses `clamp(rem-min, rem + vw, rem-max)`. Every term has a rem part, so text zooms.
  - Breakpoints are fixed constants, not custom properties.
  - Components may use `@container` for internal layout.
  - Motion respects `reduce`.
  - Focus rings and borders use `outline`/`border`, never only `box-shadow`, so they survive forced colours. A `forced-colors: active` block is a small patch layer.

### 2.7 web.dev Core Web Vitals

- **URLs opened:**
  - https://web.dev/articles/vitals
  - https://web.dev/articles/inp
- **Accessed:** 2026-11-08
- **Thresholds:** "Good" means LCP ≤ 2.5 s, INP ≤ 200 ms and CLS ≤ 0.1. INP is "needs improvement" up to 500 ms and "poor" above 500 ms.
- **How to judge:** Assess at the 75th percentile of page loads, split by mobile and desktop. A page passes only if all three metrics pass.
- **INP and TBT:**
  - Lab tools like Lighthouse cannot measure INP, because no user interacts with the page.
  - TBT is the lab proxy. The INP article says TBT may be a reasonable proxy but is not a substitute.
  - Field data (CrUX, RUM, the `web-vitals` library) is the authority.
- **Single quote:** "Only field measurement can accurately capture the complete picture."
- **Larkmoor decisions:**
  - Performance budget: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 at p75 on mobile.
  - TBT is tracked in CI only as a proxy.
  - Self-hosted, preloaded fonts with `font-display` and size-matched fallbacks, to protect LCP and CLS.
  - Vanilla JS with minimal main-thread work, to protect INP.

### 2.8 Design Tokens Community Group (DTCG)

- **URLs opened:**
  - https://www.designtokens.org/technical-reports/
  - https://www.designtokens.org/TR/2025.10/
  - https://www.designtokens.org/tr/2025.10/format/
- **Accessed:** 2026-11-08
- **Stable versus draft:**

  | Report | Status | Date |
  |---|---|---|
  | **2025.10** | **Stable** | **2025-10-28** |
  | Third Editors' Draft | Draft | 2025-07-21 |
  | Second Editors' Draft | Draft | 2022-06-14 |
  | First Editors' Draft | Draft | 2021-09-23 |
  | Preview | Experimental | none listed |

  The 2025.10 header says "Final Community Group Report", 28 October 2025. Its status section says it was published as a Candidate Recommendation, is **not a W3C Standard**, and is considered stable. It has three modules: Format, Color and Resolver.
- **Format module:**
  - **File:** media type `application/design-tokens+json` (`application/json` allowed). Extension `.tokens` is preferred, or `.tokens.json`.
  - **Token properties:**
    - `$value` is required.
    - `$type` is optional. It is inherited from a referenced token or from the nearest parent group, and tools must not infer it from the value.
    - `$description` is a string.
    - `$extensions` uses reverse-DNS keys, and tools must preserve unknown data.
    - `$deprecated` is true, false, or a string.
  - **Groups:** can set `$type` for their children. They can also use `$extends` (a deep-merge inherit) and `$root` (a base token, referenced as `{color.accent.$root}`).
  - **References:**
    - `{group.token}` resolves to that token's `$value`.
    - JSON Pointer `$ref` can target any location.
    - Circular references are errors.
  - **Names:** case-sensitive. They must not start with `$` and must not contain `{`, `}` or `.`.
  - **Types:**
    - Simple types: `color`, `dimension`, `fontFamily`, `fontWeight`, `duration`, `cubicBezier`, `number`.
    - Composite types: `strokeStyle`, `border`, `transition`, `shadow`, `gradient`, `typography`. The gradient and typography sections were not fully seen.
  - **Value formats:**
    - `dimension` is `{ "value": 16, "unit": "px" }`, with unit `px` or `rem`. The unit is required even when the value is 0.
    - `duration` is `{ "value": 200, "unit": "ms" }`, with unit `ms` or `s`.
- **Single quote:** "This specification is considered stable."
- **Larkmoor decisions:**
  - Tokens are authored to **DTCG Format 2025.10**, using object-form dimensions and durations.
  - Semantic tokens alias primitives with `{…}`.
  - Larkmoor-specific data (fluid `clamp()` formulas, CSS variable names) lives in `$extensions` under `com.larkmoor.fluid` and `com.larkmoor.css`.
  - Retired tokens get `$deprecated` with a message instead of being deleted.
  - The Color and Resolver modules were not read, so Larkmoor does not depend on them.

---

## 3. Project-specific decisions and hypotheses that need validation

These are Larkmoor's own decisions. The sources in §1 and §2 *informed* them but do not prove them. "Validate" names what must be checked with real users, real content or field data before we call a decision settled.

| # | Decision | Informed by | Needs validation |
|---|---|---|---|
| D1 | **Spacing:** 4 px-based scale 4/8/12/16/24/32/48/64/96, named `--s-1` … `--s-9`, in rem. | Carbon spacing (same values, multiples of 2/4/8). Carbon and USWDS use 8 px as the base, with 4 and 12 as half-steps. | Whether 9 steps are enough, and whether designers reach for missing 40/80 values. Audit the first two pages built. |
| D2 | **Section padding:** `clamp(64px, 4.5vw + 40px, 112px)` (authored in rem), separate from component spacing. | Spectrum's layout versus component spacing tracks. MDN's vw + fixed-unit advice. | Rhythm on very short and very tall viewports, and at 200% zoom. |
| D3 | **Fluid type:** `clamp()` with a rem minimum, a `rem + vw` preferred value and a rem maximum. Body 16 px. Display up to 60 px. | MDN (never vw alone, add rem). Carbon expressive set (16 px body, fluid display). | Zoom to 200% and the 1.4.12 text-spacing override in Chrome, Safari and Firefox. Check that display type actually grows under zoom and does not wrap badly at 320 px (1.4.10). |
| D4 | **Breakpoints:** content-driven constants, compact 520 / narrow 760 / medium 900 / wide 1100 px. Exported as JS, SCSS and JSON constants, not CSS custom properties. | MDN: change layout where content looks bad; `var()` cannot be used in media or container queries. Carbon, USWDS and Material all use device-oriented sets (§3.1). | The values come from the marketing page's content. Re-check them when content changes. Consider whether to author them in `em` (MDN prefers relative units). Use `@container` for component-internal layout (Baseline widely available). |
| D5 | **Container:** maximum 1200 px. Fluid gutter `clamp(16px, 3.5vw, 32px)`. | USWDS `desktop-lg` = 1200. Carbon 16 px padding at small sizes. USWDS padding of 2 units, rising to 4 units (16 → 32 px). | Line lengths on 1440+ px screens, and gutter comfort on 360 px phones. |
| D6 | **Prose measure:** `max-inline-size: 65ch`. Body line height ≥ 1.5. | USWDS: 45–90 characters, 66 as the target, ≥ 1.5 line height. | `ch` depends on the font. Measure real characters per line with the chosen self-hosted face. Test with users who read in non-Latin scripts if we localise. |
| D7 | **Colour:** semantic tokens `bg`, `text`, `muted`, `accent`, `border`, `focus`, per theme (light and dark, with forced colours respected). | WCAG 1.4.3 / 1.4.11. Spectrum (per-theme variants, verify each theme, no colour alone). MDN forced-colors. | Automated contrast checks in the build. Manual check under Windows contrast themes. Accent hue perception with users who have colour-vision deficiencies. |
| D8 | **Tokens pipeline:** DTCG 2025.10 JSON is the single source of truth. A dependency-free Node script builds it into CSS custom properties, plus JS, SCSS and JSON constants for the breakpoints. | DTCG 2025.10 (stable). MDN (custom-property limits). | The script handles `$type` inheritance, alias resolution, cycle detection and `$deprecated` warnings. Interoperability with one third-party DTCG tool, to confirm we are spec-conformant. |
| D9 | **Target size:** 24×24 CSS px minimum for all pointer targets. 44×44 px preferred for primary touch controls (CTA, menu toggle, theme switch). | WCAG 2.5.8 (24 px, AA). 2.5.5 (44 px, AAA). | Inline text links rely on the 2.5.8 inline exception. Check that this holds. Run a tap-accuracy test on phones with the real navigation. |
| D10 | **Motion:** durations 150/250/400/600 ms. One standard easing, `cubic-bezier(.22,.8,.2,1)`. Under `prefers-reduced-motion: reduce`, movement becomes opacity changes or nothing. Any auto-playing animation longer than 5 s gets an explicit pause control. | WCAG 2.2.2. MDN prefers-reduced-motion (override in place, prefer gentler effects). DTCG `duration` and `cubicBezier` types. | The durations and easing are our own choice: none of the sources prescribes these values. Check perceived snappiness with users. Check that the pause control is discoverable and keyboard reachable (2.4.7, 2.4.11). |
| D11 | **Focus:** `:focus-visible` outline using the `focus` token, at 3:1 or better. `scroll-padding-top` set to match the sticky header height. | WCAG 2.4.7, 2.4.11, 1.4.11. MDN forced-colors (`box-shadow` is removed, so use `outline`). | Keyboard walkthrough of the whole page, in light and dark themes and in forced-colours mode. |
| D12 | **Fonts:** self-hosted, preloaded, with a size-matched fallback. No third-party font requests. | Privacy positioning of the product (our own requirement, not from a source). web.dev CLS and LCP thresholds. | Field LCP, CLS and INP at p75 on mobile after launch (lab TBT is only a proxy). Confirm with network logs that there are no third-party requests. |
| D13 | **Widgets:** native radio groups and `<details>`/disclosure buttons. | APG radio and disclosure patterns (guidance). | Screen-reader check with NVDA + Firefox and VoiceOver + Safari. Read the APG Accordion pattern before building an accordion. |

### 3.1 Where systems disagree and what we chose

| Topic | Carbon | USWDS | Material 3 | Others | Larkmoor synthesis |
|---|---|---|---|---|---|
| Base unit | 8 px mini unit. Spacing includes 2/4/12. | 8 px unit, with 4/12/20 half-steps. | Not read (JS-only). | Spectrum: separate layout and component tracks, no numbers read. | 4 px step granularity with 8 px rhythm. Nine named steps that are a subset of Carbon's values. |
| Breakpoints | 320 / 672 / 1056 / 1312 / 1584 | 480 / 640 / 1024 enabled by default, more optional | Not read (window size classes unverified) | MDN: break where the content breaks, use relative units. | Content-driven 520 / 760 / 900 / 1100, plus container queries inside components. |
| Columns | 4 → 8 → 16 | 12 at all sizes | Not read | none | No global column system. Flex and grid with `fr`, intrinsic layouts. A single-page site does not need 16 columns. |
| Container maximum | Grid continues to 1584 | 1024 by default, 1200 available | Not read | none | 1200 px, with a fluid `clamp()` gutter. |
| Gutter or padding | 16 px padding, 32 px optional gutter | 2 units (16) → 4 units (32) at desktop | Not read | none | `clamp(16px, 3.5vw, 32px)`: the same endpoints as USWDS, interpolated smoothly instead of stepped. |
| Body and display type | Productive 14 px body (fixed), expressive 16 px body (fluid display) | Measure 45–90 characters, line height ≥ 1.5 | Not read | MDN: never vw alone | 16 px body, `clamp()` display up to 60 px, 65ch measure. |
| Token format | Sass tokens | Sass tokens and settings | Not read | DTCG 2025.10 (stable, vendor-neutral) | DTCG 2025.10 JSON as the source, built to CSS custom properties. |

### 3.2 Open items

1. Read the Material 3 window size classes and spacing pages in a JS-capable browser, and record the values.
2. Read Spectrum's layout-spacing and typography-system pages (the layout-spacing fetch failed).
3. Read the APG Accordion pattern and the WCAG 2.4.13 Focus Appearance Understanding document.
4. Read the DTCG Color and Resolver modules if we add wide-gamut colour or theme resolution through the spec rather than our own script.
