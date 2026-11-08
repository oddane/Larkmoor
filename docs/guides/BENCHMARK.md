# Benchmark: university design systems and mobile platform guidance

## 1. Scope, date and honesty note

- **Purpose:** compare Larkmoor's current choices with documented, public university design systems and with first-party mobile platform guidance. Larkmoor is adding React Native, SwiftUI and Jetpack Compose outputs, and this benchmark is meant to inform that work.
- **Access date:** 2026-11-08. Every URL below was opened on that date through a fetch tool that returns a text extraction of the page.
- **Honesty rules:**
  - A fact appears here only if it was on a page that loaded. Pages that failed are listed in section 2 and are never cited as sources.
  - "Not stated" means the pages I read did not give the value. It does not mean the system lacks it.
  - Some extractions were summaries made by the fetch tool rather than verbatim text. Check exact numbers on the source before using them as a hard requirement.
  - Recommendations in section 6 are tagged: **[conformance requirement]** (WCAG or a stated legal or policy requirement), **[platform convention]** (Apple, Google or React Native first-party guidance), or **[our recommendation]** (a judgement drawn from the comparison).
- **Excluded sources:** third-party "design system summary" sites (open-design.ai, skills registries and similar) appeared in search results. I did not use them.

## 2. Could not access

| URL | Result | Effect on this report |
|---|---|---|
| https://unity.web.asu.edu/ and /uikit | Blocked by the fetch tool's provenance rule | No ASU Unity UI kit values (grid, breakpoints, type sizes) |
| https://asu.github.io/asu-unity-stack/ | Blocked (provenance) | ASU facts come from the GitHub README and the ASU brand guide |
| https://brandguide.asu.edu/execution-guidelines/web/building-sites/unity | Blocked (provenance) | Same as above |
| https://decanter.stanford.edu/ (root) | Blocked (provenance) | Decanter subpages did load |
| https://github.com/SU-SWS/decanter | Blocked (provenance) | Used the npm README on jsDelivr instead |
| https://digital.arizona.edu/arizona-bootstrap (root) | Blocked (provenance) | The /v5 page loaded |
| digital.arizona.edu/arizona-bootstrap/v5/docs/5.2/layout/breakpoints/, …/getting-started/color-contrast/, …/customize/color-modes/ | Site client error | No v5 breakpoint, contrast or color-mode values. v2.0 grid values are used, labelled as v2 |
| review.digital.arizona.edu/…/5.0/layout/breakpoints and …/layout/containers | Site client error | Same as above |
| https://github.com/cambridgeuniversity/Project-Light | Blocked (provenance) | No Cambridge grid or breakpoint values |
| https://developer.apple.com/design/human-interface-guidelines/accessibility.md | Blocked (provenance) | Read the same page through Apple's JSON endpoint (developer.apple.com/tutorials/data/…/accessibility.json) |
| https://developer.android.com/reference/kotlin/androidx/compose/material3/Typography | Loaded, but the extract held no style values | M3 type scale taken from the "Material Design 3 in Compose" page |
| Penn State web design system | No public design system documentation found in two searches. brand.psu.edu "Design Essentials" was not opened | Penn State is excluded |
| University of Michigan (central) | Only the U-M **Library** design system was found and read | U-M Library is used as a proxy and labelled as such |
| m3.material.io | Not attempted; developer.android.com was preferred, as the brief asked | None |

## 3. University design systems

### 3.1 University of Maryland (UMD) Design System. Best documented in this set.

- **Pages read:**
  - https://designsystem.umd.edu/foundation/layout
  - https://designsystem.umd.edu/foundation/vertical-spacing
  - https://designsystem.umd.edu/foundation
  - https://designsystem.umd.edu/foundation/typography
  - https://designsystem.umd.edu/foundation/color
  - https://designsystem.umd.edu/getting-started/for-developers
  - https://umd-digital.github.io/design-system/tokens
  - https://umd-digital.github.io/design-system/architecture.html
- **Technology:**
  - TypeScript web components with Shadow DOM.
  - Pre-compiled static CSS (styles library) and optional Tailwind integration.
  - Distributed through a CDN or npm under the `@universityofmaryland` scope (tokens, icons, utilities, styles, model, builder, elements, feeds, components).
  - Monorepo, MIT licence.
- **Tokens:** `@universityofmaryland/web-token-library` v2.0.0 (JS/TS). The styles library exposes tokens as CSS custom properties. Tokens are maintained by hand; a Figma-to-code pipeline is planned for "Phase 2".
- **Spacing:**
  - The layout page says layouts use "multiples of four".
  - Token scale: 8, 12, 16, 24, 32, 40, 48, 56, 64, 120 px.
  - Section spacing by device (desktop / tablet / mobile):
    - Landing sections: 120 / 80 / 56 px.
    - Items inside sections: 48 / 40 / 32 px.
    - Interior page content: 80 / 56 / 56 px.
- **Grid:** not a 12-column grid. There are three classes:
  - Two-column grid: at most 2 columns above 650px.
  - Three-column grid: at most 3 columns above 1024px.
  - Four-column grid: at most 4 columns above 1200px.
  - Gaps are 32–40px (desktop) and 32px (tablet and mobile). A gutterless variant uses 8px on mobile.
  - The mobile outer margin is 24px, and many components run edge to edge.
- **Container max widths (tokens):** 800, 992, 1280, 1400 and 1600 px.
- **Breakpoints:**
  - Layout page: XS 320–479, S 480–767, M 768–1023, L 1024–1439, XL 1440 and up. "Major layout changes" happen at 768 and 1024.
  - Tokens: 320, 768 and 1024 px.
- **Type:**
  - Fonts: Interstate, Barlow Condensed and Overpass.
  - Token sizes: 12, 14, 16 (base), 18, 32 and 120 px. The page lists nothing between 18 and 32.
  - Sizes change at tablet portrait.
- **Colour and accessibility:**
  - States: "committed to meeting WCAG 2.0 Level AA."
  - Publishes passing and failing colour pairs. For example, white on Maryland Red is 4.75:1 (pass) and black on red is 4.4:1 (fail).
  - Includes a separate "mediumAA" grey (#757575).
- **Components:** accordion, alerts, banner promo, CTA, cards (standard, overlay, icon, video), carousels, events, footers, nine hero types, lists, navigation (site header, side nav, breadcrumbs, global header), pathways, people, quote, section intro, scroll-to-top, social sharing, stats, sticky columns, **tabs**. The component index lists no dialog, sheet, toast, pagination or table.
- **Mobile apps / dark mode:**
  - Nothing for native apps.
  - Light and dark *backgrounds* are defined (dark backgrounds are Darker Gray and Black), and there is an `isThemeDark` option on one element. There is no system dark mode.
- **Versioning:** tokens v2.0.0, with GitHub release notes. No policy page.

### 3.2 Indiana University "Rivet" (added: public and well documented)

- **Pages read:**
  - https://rivet.iu.edu/
  - https://rivet.iu.edu/design-tokens/
  - https://rivet.iu.edu/components/
  - https://rivet.iu.edu/layouts/
  - https://rivet.iu.edu/components/grid/
- **Technology:** plain HTML, CSS and JavaScript, with a Figma design kit.
- **Tokens:** CSS custom properties with the `--rvt-` prefix, the same pattern as Larkmoor's `--lm-`.
- **Spacing:** 4, 8, 16, 24, 32, 40, 64, 128, 192 px (xxs to 4-xl).
- **Widths:** 64 to 768 px in 9 steps.
- **Grid:**
  - **12 columns** ("column widths must not exceed 12"), using `.rvt-row` and `.rvt-cols-N-md|lg`.
  - Rows come in loose and tight variants.
  - Nesting is limited to two levels.
  - Required containers `.rvt-container-sm|md|lg|xl`. The pages I read gave no pixel widths for them.
- **Breakpoints:** 30em, 46.25em, 67.5em, 78.75em, 87.5em, which is 480, 740, 1080, 1260 and 1400 px at 16px.
- **Type:**
  - Base is 1rem (16px).
  - Scale: 12, 14, 16, 18, 20, 23, 26, 29, 32, 36, 41, 46, 52 px.
  - Fonts: BentonSans and GeorgiaPro.
- **Colour:**
  - Seven palettes (black, blue, crimson, gold, green, orange, purple), each with shades 000–700.
  - The token page has no contrast notes.
- **Components (39):** accordion, alert, avatar, badge, billboard, **breadcrumbs**, button, calendar tile, CTA, card, checkbox, **dialog**, disclosure, dropdown, empty state, file input, footer, grid, header, hero, input group, link hub, list, loading indicator, **pagination**, quote, radio, select, series nav, sidenav, stat, step indicator, subnav, switch, **table**, **tabs**, text input, textarea, timeline. There is no toast or sheet.
- **Mobile apps / dark mode:** nothing for native apps. The token page does not mention dark mode.
- **Versioning:**
  - Current release 2.9.0 (8 Apr 2025). Version 2.8.1 was an accessibility patch.
  - Releases are announced in blog posts and recorded in a changelog, with a contribution wiki on GitHub.
  - 12 starter layouts for applications and sites.

### 3.3 Stanford "Decanter" v7

- **Pages read:**
  - https://decanter.stanford.edu/for-developers/installation
  - https://decanter.stanford.edu/decanter-faq
  - https://decanter.stanford.edu/for-developers/strategies-and-conventions
  - https://cdn.jsdelivr.net/npm/decanter@7.5.3/README.md
  - https://app.unpkg.com/decanter@7.4.0/files/docs/components/grid-gap.md
- **Technology:**
  - A Tailwind CSS preset (`presets: [require('decanter')]`). The Tailwind version is not stated.
  - Replaces the earlier Sass/BEM approach.
  - Ships a Figma "Decanter v7.0" library.
  - Used on WordPress and Drupal since 2019.
  - Heroicons are recommended; FontAwesome has been removed.
- **Tokens:** expressed as Tailwind theme and utility classes. There is no separate token format.
- **Spacing:**
  - The HTML root is set to **10px** (1rem = 10px), and the scale runs in 0.1rem steps.
  - Responsive spacing `rs-0…10` changes per breakpoint. For example, step 0 is 1.5rem (XS), 1.8rem (MD) and 1.9rem (2XL).
- **Grid:**
  - Gap utilities only: `.grid-gap` is 20px (XS–MD), 36px (LG), 40px (XL) and 48px (2XL).
  - The grid-gap doc has a mismatch: it says 30px for LG in its text but 36px in its CSS example.
  - I found no column-count grid in the pages read.
- **Container:**
  - `cc` is fluid up to **1500px**, which it reaches at a 1700px viewport.
  - Screen-edge margins: 20px (XS), 30px (SM), 50px (MD), 80px (LG) and 100px (XL and up).
- **Breakpoints:** XS 0–575, SM 576–767, MD 768–991, LG 992–1199, XL 1200–1499, 2XL 1500 and up.
- **Type:**
  - Classes `basefont-19…23` set the base per breakpoint. For example, `basefont-23` is 18px (XS–SM), 21px (MD–XL) and 23px (2XL).
  - A modular scale `type-0…9` uses ratios of 1.15 (XS–SM), 1.2 (MD) and 1.25 (LG and up). This is breakpoint-stepped, not viewport-interpolated.
  - Fonts: Source Sans 3 and Source Serif 4. Roboto Slab and Roboto Mono are deprecated, and v8 removes `font-slab`.
- **Accessibility:** the README states "WCAG 2.0 Level AA". The FAQ calls AA "a primary driver", and the Office of Digital Accessibility is on the team.
- **Components:** intentionally small "lego blocks", such as buttons (sizes, solid and outline, icons) and a few hero types.
- **Mobile apps / dark mode:** none. "Dark" appears only as a colour-variant suffix.
- **Versioning and governance:**
  - Versions V1 (2017) through V7. The npm latest is 7.5.3, and a changelog exists.
  - A core Web Services team runs it with an open forum and Slack. The FAQ notes that staffing varies from year to year.

### 3.4 University of Arizona "Arizona Bootstrap"

- **Pages read:**
  - https://digital.arizona.edu/arizona-bootstrap/v5
  - https://digital.arizona.edu/arizona-bootstrap/v5/docs/5.2/getting-started/introduction/
  - https://digital.arizona.edu/arizona-bootstrap/docs/2.0/layout/grid (v2, legacy)
- **Technology:**
  - Bootstrap 5 customised with Sass. Current release is **v5.2.2**.
  - CSS variables use the `--bs-` prefix, with the Utility API.
  - JavaScript plugins use the `data-bs-*` attribute API; no jQuery.
  - Developed "mobile first".
  - Code under MIT, docs under CC BY 3.0.
- **Tokens:** Sass variables and maps generate CSS custom properties. There is no DTCG format.
- **Grid (v2.0 page; v5 values could not be loaded):**
  - 12 columns with a 30px gutter (15px per side).
  - Breakpoints 576, 768, 992, 1200.
  - Container max widths 540, 720, 960, 1140.
- **Type and colour:** values not loaded. The v5 docs have pages named "Color contrast", "Accessibility" and "Color modes", but they returned errors. The theme colour shown is #8b0015.
- **Components (v5 sidebar):** accordion, alerts, Arizona header, background wrappers, badge, **breadcrumb**, buttons, button group, callouts, card, carousel, close button, collapse, dropdowns, list group, **modal**, navbar, **navs & tabs**, **offcanvas** (a sheet-like panel), **pagination**, photo gallery, placeholders, popovers, progress, search, scrollspy, spinners, **toasts**, tooltips. **Tables** are listed under Content.
- **Mobile apps / dark mode:** nothing for native apps. A "Color modes" docs page exists, but its content is unverified.
- **Versioning:** v2.x and v5.x lines (the version number jumped to match Bootstrap's major), a versions index, migration and backwards-compatibility pages, and GitHub issues and discussions.

### 3.5 Arizona State University "Unity" (UDS). Partial: the UI kit could not be read.

- **Pages read:**
  - https://github.com/asu/asu-unity-stack
  - https://brandguide.asu.edu/execution-guidelines/web/ux-design
  - https://brandguide.asu.edu/execution-guidelines/web/getting-started
- **Technology:**
  - Lerna and Nx monorepo built with Vite.
  - `unity-bootstrap-theme` is an "ASU-customized **Bootstrap 5**" library.
  - React packages ship UMD, ES and CJS builds: `unity-react-core`, header, footer, news, events, cookie consent, and apps for degrees, RFI and web directory.
  - Storybook for the code, Zeroheight and Figma for design.
  - Webspark 2, ASU's Drupal CMS, uses it.
  - **Discrepancy:** the brand-guide getting-started page still says UDS is "built with Bootstrap 4 and React.js". The GitHub README lists bootstrap4-theme as deprecated.
- **Tokens:** a `design-tokens` package is listed as **deprecated**, and no active token package was named.
- **Grid, spacing, type, breakpoints:** not on the pages read. They are in the blocked UI kit. The brand guide mentions a "spacing grid" and a Figma template preset with the UDS grid.
- **Accessibility:** "based on … accessibility best practices". No WCAG level is stated on the pages read.
- **Components:** header, footer, carousel (deprecated as a separate package), cookie consent, events and news feeds, plus page templates (degrees, events, news, directory).
- **Mobile apps / dark mode:** none mentioned.
- **Versioning and governance:**
  - semantic-release with Conventional Commits (commitlint and commitizen). Merging to `dev` or `master` auto-releases.
  - A site inventory in Little Forest, a contribution page and a Slack channel.

### 3.6 University of Leeds Design System (added: public, values documented)

- **Pages read:**
  - https://designsystem.leeds.ac.uk/
  - …/docs/breakpoints.html
  - …/docs/spacing.html
  - …/docs/columns.html
  - …/docs/typography.html
  - …/docs/colours.html
- **Technology:** custom Sass with the `uol-` prefix and the include-media library, plus a Nunjucks base template and an assets zip. The current release is v1.0.22.
- **Spacing:** rem-based. `$spacing-1…9` is 4, 8, 12, 16, 24, 32, 48, 64, 80 px. This is almost identical to Larkmoor's scale.
- **Grid:**
  - **12 columns** (`uol-col-*`, `uol-col-container`).
  - Gutters: 16px (xs), 24px (l), 32px (xl).
  - The docs recommend extending column classes inside component BEM classes rather than putting them in markup.
- **Breakpoints:** written in **em** so they scale with the user's root font size. Values are 414, 600, 768, 1024, 1440, 1660 px. The system is mobile first.
- **Type:**
  - Fonts: Freight Sans and Freight Text. A system stack is used on small screens.
  - Responsive size tokens (epic, h1–h6, paragraph, intro, caption and others). No numbers were on the page.
- **Colour:** each colour is tested and labelled against WCAG AA or AAA for normal and large text. Links use `$color-link` on white only, and black or white on any other background.
- **Components:** accordion, banner, **breadcrumbs**, button, cards, chips, cookie control, forms (including datepicker), gallery, header, footer, **pagination**, status message, tiles and others. Tables are covered under Typography.
- **Mobile apps / dark mode:** none.
- **Versioning:** a changelog plus element status labels (Prototype, Testing, Ready, Deprecated) and documentation status labels (Draft, Ready).

### 3.7 HarvardSites Design System (Harvard Web Publishing)

- **Pages read:**
  - https://designsystem.harvardsites.harvard.edu/about
  - https://designsystem.harvardsites.harvard.edu/design-system-components
- **Technology:** Drupal 10 (from the generator meta tag). No token, grid or breakpoint values are published.
- **Approach:** the site says it is "intentionally constrained", with controlled site styles, typography options and colour roles.
- **Components (12):** 50/50 card, accordion, button-style cards, CTA links, columns, hero, list, media gallery, quote card, stats cards, **tabs**, vertical cards.
- **Accessibility:** "built into components". No WCAG level was on the pages read.
- **Governance:** maintained by Harvard Web Publishing, with feedback through ServiceNow. No version numbers are published.
- **Mobile apps / dark mode:** none.

### 3.8 UCLA Design System (web components)

- **Page read:** https://designsystem.brand.ucla.edu/build/v2.6.0/docs/developers/overview.html
- **Technology:** W3C web components. Documentation is versioned by URL (v2.6.0).
- **Components:** accordion, alerts, **breadcrumbs**, buttons, carousel, checkbox, chips, link, **pagination**, progress bar, radio group, select, table of contents, **tables**, **tabs**, text field, textarea, tiles, banners, callouts, cards (seven types), mega menu, side navigation, search, footers.
- **Versioning:** web component v1.0.0 is end of life ("no longer receives updates"). This is an explicit end-of-life policy.
- **Not on this page:** grid, spacing, type and colour values (those pages were not opened).

### 3.9 University of Michigan Library Design System (proxy for U-M)

- **Pages read:**
  - https://design-system.lib.umich.edu/
  - https://design-system.lib.umich.edu/about/web-components-and-design-tokens
  - https://design-system.lib.umich.edu/design-and-development/design-tokens-and-web-components/
- **Technology:** framework-agnostic web components, delivered through a CDN (`@umich-lib/web@latest`) or npm.
- **Tokens:** CSS custom properties in two layers, **primitive → semantic**. For example, `--link` maps to `--color-teal-400` (#1d7491) "in the light theme".
- **Components (20):** badges, banners, **breadcrumbs**, buttons, chat, checkbox, file upload, inputs, link, **pagination**, radio, range, search, select, skip link, **tables**, tags, universal header, website header and footer. The site also covers motion guidance and content and voice guidelines.
- **Versioning:** a "What's new" page. The CDN examples use `@latest`, which leaves sites without version pinning.

### 3.10 University of Cambridge "Project Light". Partial and legacy.

- **Pages read:**
  - https://help.uis.cam.ac.uk/node/15042 (dated 8 Apr 2024)
  - https://www.cl.cam.ac.uk/~mgk25/project-light/ (a copy of the style guide hosted on the Computer Laboratory site)
- **Technology:** templates from 2013, used on **Drupal 7** sites and cam.ac.uk. They are distributed to staff on GitHub (the repository was blocked for me). The typeface is Myriad Pro through Adobe Typekit.
- **Layout:** a responsive grid. Neither page gave column counts or breakpoint values.
- **Components:**
  - Page components: carousels, banner, tooltips, calendar, notifications, **stacking tabs**, teasers, listings, contextual search, login form, **tables**.
  - Structural components: header, footer, mega-dropdown global navigation, local navigation, vertical side navigation, **breadcrumbs**, forms.
  - Nine colour schemes.
- **Mobile apps / dark mode:** none.

### 3.11 University of Edinburgh. Not usable as a benchmark source.

- **Pages read:**
  - https://blogs.ed.ac.uk/website-communications/bringing-to-life-the-university-of-edinburgh-design-system/ (Dec 2021)
  - https://www.ed.ac.uk/website-programme/edweb/edgel
  - https://information-services.ed.ac.uk/design-system (Beta, 15 Apr 2025)
- **Facts:**
  - The EdGEL pattern library moved from Bootstrap 3 to Bootstrap 5 (blog, 2021).
  - The new Design System is labelled **Beta**, runs on Drupal 11 and has nine design principles.
  - None of these pages gave token, grid, type or component values, so Edinburgh is left out of the comparison table.

## 4. Comparison table

Values are as documented on the pages read. "n/s" means not stated on those pages.

| Attribute | UMD | IU Rivet | Stanford Decanter 7 | Arizona Bootstrap | ASU Unity | Leeds | Harvard | UCLA | **Larkmoor (current)** |
|---|---|---|---|---|---|---|---|---|---|
| Base unit | 4 ("multiples of four") | 4 (first step) | 0.1rem of a 10px root | Bootstrap rem scale (n/s) | n/s | 4 (0.25rem) | n/s | n/s | **4px** |
| Spacing scale | 8,12,16,24,32,40,48,56,64,120 | 4,8,16,24,32,40,64,128,192 | 0.1rem steps + responsive `rs-0…10` | n/s | n/s | 4,8,12,16,24,32,48,64,80 | n/s | n/s | **0,4,8,12,16,24,32,48,64,96** + fluid section padding |
| Grid | 2/3/4-column classes by breakpoint | 12-col rows/cols | gap utilities only | 12-col, 30px gutter (v2) | Bootstrap 5 grid (implied) | 12-col, 16/24/32 gutters | "Columns" component (2-up) | n/s | **No 12-col: stack, cluster, auto-fit, 4/8 split** |
| Container max | 800/992/1280/1400/1600 | sm–xl containers (px n/s) | 1500 (fluid) | 540/720/960/1140 (v2) | n/s | n/s | n/s | n/s | **1200, prose 65ch** |
| Breakpoints (px) | 320/480/768/1024/1440 | 480/740/1080/1260/1400 (em) | 576/768/992/1200/1500 | 576/768/992/1200 (v2) | n/s | 414/600/768/1024/1440/1660 (em) | n/s | n/s | **520/760/900/1100 (content-driven)** |
| Body size | 16 base token | 16 | 18–23 by breakpoint (`basefont-*`) | n/s | n/s | n/s | n/s | n/s | **16 / 1.6** |
| Type scale | 12–120 token set | 13 steps, 12–52 | modular 1.15/1.2/1.25 by breakpoint | n/s | n/s | named responsive tokens | n/s | n/s | **fluid clamp roles, 11–60** |
| Contrast target | WCAG 2.0 AA | n/s (accessibility focus) | WCAG 2.0 AA | page exists, unread | n/s | WCAG AA (AA/AAA labels) | n/s | n/s | **WCAG 2.2 (2.5.8 targets cited)** |
| Token format | JS/TS package + CSS custom props | CSS custom props `--rvt-` | Tailwind preset | Sass → `--bs-` CSS vars | design-tokens package deprecated | Sass vars | n/s | n/s | **DTCG 2025.10 JSON → `--lm-`** |
| Token tiers | n/s | single tier | n/s | Sass maps | n/s | n/s | n/s | n/s | **foundation → semantic → themes** |
| Dark mode | dark backgrounds, `isThemeDark` | n/s | none | "Color modes" page (unverified) | n/s | none | n/s | n/s | **dark inverse band; brand 2 dark** |
| Native/mobile app output | none | none | none | none | React (web) only | none | none | none | **planned RN / SwiftUI / Compose** |
| Tabs / dialog / sheet / toast | tabs only | tabs, dialog | — | tabs, modal, offcanvas, toast | n/s | — | tabs | tabs | **none** |
| Breadcrumbs / pagination / table | breadcrumbs | all three | — | all three | n/s | breadcrumbs, pagination | — | all three | **none** |
| Versioning | tokens v2.0.0, GitHub releases | 2.9.0 + changelog + blog | v7 (npm 7.5.3), changelog | v5.2.2, migration docs | semantic-release, conventional commits | v1.0.22 + status labels | none published | versioned docs URLs + EOL policy | n/s in brief |

**Takeaways:**

- **4px base is the norm.** UMD, Rivet and Leeds all use a 4px base, and Leeds's scale is almost identical to Larkmoor's.
- **12-column grids are common but not universal.** Rivet, Leeds and Arizona use one. UMD uses fixed 2/3/4-column grids and Decanter offers gap utilities only.
- **Most systems offer more than one container width.** Larkmoor has one.
- **No university system read ships native app output.** Larkmoor's planned output has no peer here, so mobile guidance must come from the platforms (section 5).
- **Larkmoor's DTCG tiered tokens are the most structured token setup in the set.**
- **Tabs, breadcrumbs, pagination and tables are the most common components Larkmoor lacks.**

## 5. Mobile platform findings (primary sources)

### 5.1 Apple Human Interface Guidelines

- **Pages read:**
  - https://developer.apple.com/design/human-interface-guidelines.md (index)
  - https://developer.apple.com/design/human-interface-guidelines/typography.md
  - https://developer.apple.com/design/human-interface-guidelines/layout.md (change log latest 9 Sep 2026)
  - https://developer.apple.com/design/human-interface-guidelines/dark-mode.md
  - https://developer.apple.com/tutorials/data/design/human-interface-guidelines/accessibility.json (change log latest 9 Jun 2025)
  - https://developer-rno.apple.com/design/human-interface-guidelines/foundations/layout (an older layout page hosted by Apple, used only for the iPhone sizes table)
- **Hit targets (Accessibility):**

  | Platform | Default control size | Minimum control size |
  |---|---|---|
  | iOS, iPadOS | 44×44 pt | 28×28 pt |
  | macOS | 28×28 pt | 20×20 pt |
  | tvOS | 66×66 pt | 56×56 pt |
  | visionOS | 60×60 pt | 28×28 pt |
  | watchOS | 44×44 pt | 28×28 pt |

  - Spacing around controls: about **12 pt** for bezeled elements and about **24 pt** around the visible edges of unbezeled ones.
- **Contrast (Accessibility, based on WCAG AA):**
  - Text up to 17 pt: 4.5:1.
  - Text at 18 pt and larger: 3:1.
  - Bold text at any size: 3:1.
  - Apps should provide a higher-contrast scheme for when Increase Contrast is on, and check both appearances.
  - Dark Mode page: "no lower than 4.5:1 … for custom foreground and background colors, strive for … 7:1, especially in small text."
- **Typography:**
  - Default and minimum sizes: iOS/iPadOS **17 pt / 11 pt**; macOS 13/10; visionOS 17/12; watchOS 16/12; tvOS 29/23.
  - Dynamic Type at the default size ("Large"):

    | Style | Size / leading (pt) |
    |---|---|
    | Large Title | 34/41 |
    | Title 1 | 28/34 |
    | Title 2 | 22/28 |
    | Title 3 | 20/25 |
    | Headline (semibold) | 17/22 |
    | Body | **17/22** |
    | Callout | 16/21 |
    | Subhead | 15/20 |
    | Footnote | 13/18 |
    | Caption 1 | 12/16 |
    | Caption 2 | 11/13 |

  - Body across the size settings: 14 (xSmall), 17 (Large, the default), 23 (xxxLarge) and **53 (AX5)**. Caption 2 is 40 at AX5.
  - Guidance:
    - Layouts must adapt to all font sizes.
    - Keep truncation to a minimum.
    - Switch to stacked layouts and fewer columns at large sizes.
    - Scale meaningful icons with text.
    - Avoid light weights.
- **Layout:**
  - Respect system safe areas, margins and layout guides. A safe area excludes bars and hardware features such as the Dynamic Island.
  - Make layout decisions from **size classes** (compact or regular, horizontal and vertical), not device type or orientation.
  - Larger spaces can switch a tab bar to a sidebar.
  - Keep functionality the same across size classes.
  - Be prepared for text-size changes: stack side-by-side views and let rows grow.
  - tvOS safe area insets: 60 pt top and bottom, 80 pt on the sides.
  - The older Apple-hosted layout page lists iPhone portrait widths from 320 to 430 pt, which is all below Android's 600dp "compact" limit.
  - The current layout page mentions Liquid Glass and scroll edge effects (since Jun 2025).
- **Dark Mode:**
  - People "generally expect all apps … to respect their preference."
  - **Avoid an app-specific appearance setting.**
  - Use semantic, adaptive colours with Color Sets that have bright and dim variants, and no hard-coded values.
  - iOS has *base* and *elevated* background sets: modals and popovers use elevated.
  - Soften white image backgrounds.
- **Motion (Accessibility):**
  - With Reduce Motion on, reduce automatic and repetitive animation.
  - Replace x-, y- and z-axis transitions with fades.
  - Avoid animating blurs and depth.
  - Tighten springs to reduce bounce.

### 5.2 Android / Material 3 (developer.android.com)

- **Pages read:**
  - https://developer.android.com/develop/adaptive-apps/guides/use-window-size-classes
  - https://developer.android.com/develop/ui/compose/accessibility/api-defaults
  - https://developer.android.com/guide/topics/ui/accessibility/apps (last updated 2026-10-23)
  - https://developer.android.com/jetpack/compose/themes/material3
- **Window size classes (width):**

  | Class | Range | Typical device |
  |---|---|---|
  | Compact | < 600dp | 99.96% of phones in portrait |
  | Medium | 600–839dp | Tablets in portrait, unfolded foldables |
  | Expanded | 840–1199dp | Tablets in landscape |
  | Large | 1200–1599dp | Large tablets |
  | Extra-large | ≥ 1600dp | Desktop displays |

  - Height classes: compact < 480dp, medium 480–899dp, expanded ≥ 900dp.
  - "Width is usually more important" than height.
  - Size classes are "explicitly not" tied to the device screen and are "not intended for isTablet-type logic".
  - Test at compact, medium and expanded widths.
- **Touch target:**
  - "Make sure to set the minimum size to **48dp**." The general accessibility page says "at least 48dp x 48dp", "larger is even better".
  - Material `Checkbox`, `RadioButton`, `Switch`, `Slider` and `Surface` enforce it when they are interactive.
  - `Modifier.minimumInteractiveComponentSize()` reserves 48dp of layout space. If a clickable element is smaller, Compose expands the touch area outside its bounds, and those areas can overlap.
  - The page recommends setting `sizeIn(minWidth = 48.dp, minHeight = 48.dp)` explicitly.
- **Contrast:** text below 18sp, or bold text below 14sp, needs **4.5:1**. All other text needs **3:1**.
- **Typography (M3 default type scale, size/line height in sp):**

  | Role | Large | Medium | Small |
  |---|---|---|---|
  | Display | 57/64 | 45/52 | 36/44 |
  | Headline | 32/40 | 28/36 | 24/32 |
  | Title | 22/28 | 16/24 | 14/20 |
  | Body | **16/24** | 14/20 | 12/16 |
  | Label | 14/20 | 12/16 | 11/16 |

  - The default font is Roboto. There is no `defaultFontFamily`, so the font is set on each `TextStyle`.
- **Theme:**
  - `lightColorScheme` / `darkColorScheme` are selected with `isSystemInDarkTheme()`.
  - Dynamic colour is available on Android 12 and later, with a fallback to the custom scheme.
  - Use the `on-` colour on its matching role colour (for example `onPrimary` on `primary`) to keep contrast accessible.
  - Shape scale: extraSmall–extraLarge. The example values are 4, 8, 12, 16 and 24 dp.
  - **Tonal elevation** is the primary M3 method, with shadow elevation added on top. In dark themes, the elevation overlay is tonal and derived from the primary colour.
  - The page has no spacing guidance.

### 5.3 React Native (reactnative.dev, docs version 0.88)

- **Pages read:**
  - https://reactnative.dev/docs/pixelratio
  - https://reactnative.dev/docs/accessibility
  - https://reactnative.dev/docs/0.81/text (0.81 docs)
  - https://reactnative.dev/docs/platform-specific-code
  - https://reactnative.dev/docs/usecolorscheme
  - https://reactnative.dev/docs/usewindowdimensions
- **Pixel ratio and font scale:**
  - `PixelRatio.get()` returns density: 1 (mdpi), 1.5, 2, 3, 3.5.
  - `getFontScale()` reflects Android Settings > Display > Font size and iOS Text Size or Larger Text.
  - `roundToNearestPixel` and `getPixelSizeForLayoutSize` convert between layout units and pixels.
- **`useWindowDimensions()`:** returns `width`, `height`, `scale` and `fontScale`, and updates automatically. The docs suggest using `fontScale` to adjust padding, margins and heights.
- **Text:**
  - `allowFontScaling` defaults to **true**.
  - `maxFontSizeMultiplier`: undefined inherits, 0 means no cap, and a value of 1 or more caps scaling.
  - iOS `dynamicTypeRamp` defaults to `'body'` and accepts caption2 … largeTitle.
  - `numberOfLines` defaults to 0 (unlimited).
- **Accessibility:**
  - `role` "has precedence over" `accessibilityRole`. Role values include button, link, heading, tab, tablist, switch, checkbox, radio, radiogroup, alert, progressbar, slider, menu, toolbar and others.
  - `accessibilityState` covers disabled, selected, checked (true, false or mixed), busy and expanded.
  - `aria-*` equivalents exist. `aria-modal` is iOS only, and `aria-live` and `importantForAccessibility` are Android only.
  - Custom `accessibilityActions` are supported, including escape, activate, increment, decrement, expand and collapse.
  - The accessibility page does **not** cover hitSlop or minimum target size.
- **Platform:**
  - `Platform.OS` is `'ios'` or `'android'`.
  - `Platform.select` resolves keys in the order ios/android → native → default.
  - `Platform.Version` is the API level on Android and a version string on iOS.
  - File extensions `.ios.js`, `.android.js` and `.native.js` are resolved automatically.
- **`useColorScheme()`:** returns `'light'`, `'dark'` or `null`, subscribes to changes, and reads from the `Appearance` API (`setColorScheme` sets an app-level override).

## 6. Gaps in Larkmoor and recommended changes (prioritised)

**P1: needed before native outputs ship**

1. **Native touch targets.** **[platform convention]**
   - Add platform-resolved target tokens:
     - `target.min`: iOS 44pt (the HIG's default control size; 28pt is the absolute minimum) and Android 48dp.
     - `target.spacing`: about 12pt around bezeled controls and about 24pt around unbezeled ones (Apple).
   - Keep 24px (WCAG 2.5.8) as the **web** floor and 44px as the preferred web size. **[conformance requirement]** for web only.
   - In Compose, apply `minimumInteractiveComponentSize()` or `sizeIn(48.dp)` in every interactive component.
   - In React Native, enforce the minimum through component layout rather than relying on the docs, because the accessibility page gives no target guidance.
   - Evidence: §5.1 Apple control size table; §5.2 developer.android.com accessibility pages.
2. **Dynamic Type and fontScale.** **[platform convention]**
   - Map each Larkmoor type role to a platform text style:
     - SwiftUI: body → `.body` (17pt default, not a fixed 16), heading → `.title3` or `.headline`, caption → `.footnote` or `.caption`, label → `.caption2` (11pt, iOS minimum).
     - Compose: body → `bodyLarge` 16sp, label → `labelSmall` 11sp, with all sizes in `sp`.
     - React Native: keep `allowFontScaling` on, set `dynamicTypeRamp` per role, and allow a `maxFontSizeMultiplier` only on chrome (tabs and bars). Apple notes that tab titles need not grow.
   - Components (rows, cluster, 4/8 split, segmented control) must stack at accessibility sizes: Apple says to stack and reduce columns at large sizes, and AX5 body is 53pt.
   - Evidence: §5.1 typography; §5.3 Text and useWindowDimensions.
3. **Safe areas.** **[platform convention]**
   - Header/nav, footer, any future sheet or toast, and fixed bottom actions must respect safe areas on iOS and Android.
   - Document a rule that fixed bars pad by the safe-area inset and add the gutter on top. Do not put this in a token.
   - On the web, the equivalent is CSS `env(safe-area-inset-*)`. **[our recommendation]**: this benchmark did not read a source for the CSS side.
   - Evidence: §5.1 layout ("respecting the safe area is essential").
4. **System dark mode for the default theme.**
   - Larkmoor has only a dark *inverse band* plus brand-2 dark. Apple says users "expect all apps … to respect their preference" and advises against an app-specific appearance toggle. Compose (`isSystemInDarkTheme`) and React Native (`useColorScheme`) both follow the system.
   - Add `theme.default.dark` as a full semantic theme, with *base* and *elevated* surface tokens (Apple) or tonal elevation (M3) for future dialogs and sheets.
   - On native: **[platform convention]**. On web, follow `prefers-color-scheme`: **[our recommendation]**.
   - Among the university systems, only UMD defines dark backgrounds and only Arizona has a colour-modes page. Shipping a full dark theme would put Larkmoor ahead of them.
5. **Contrast stance in the token pipeline.**
   - Validate every semantic foreground and background pair in every theme. The floor is 4.5:1 for normal text and 3:1 for large or bold text, which is WCAG AA as restated by Apple and Android. **[conformance requirement]**
   - Add a high-contrast variant for iOS Increase Contrast. **[platform convention]**
   - Aim for 7:1 on small text in dark themes. **[our recommendation]**, citing Apple's "strive for 7:1".
   - Publish passing and failing pairs as UMD and Leeds do. **[our recommendation]**

**P2: layout model**

6. **12-column grid vs Larkmoor primitives.** **[our recommendation]**
   - Do **not** add a general 12-column grid.
   - Evidence for that call:
     - UMD, a well-documented peer, uses fixed 2/3/4-column grids instead.
     - Decanter ships only gap utilities.
     - Neither Apple nor Android frames phone layout as a 12-column grid. Apple works from size classes; Android works from window classes.
     - Leeds itself advises keeping column classes out of markup.
   - **Do** add one fixed-count grid primitive (`columns: 2|3|4`, collapsing by container width) next to auto-fit. Cards, stats and people lists need it in UMD, Rivet and UCLA.
   - Keep the 4/8 split and consider adding a 3/9 sidebar ratio.
7. **Container widths.** **[our recommendation]**
   - One 1200px container is narrower than every peer's widest option: Arizona v2 1140, UMD 1280–1600, Decanter 1500.
   - Add `container.narrow` (about 800px, as UMD has, for forms and articles) and `container.wide` (about 1440px, for media and data tables).
   - Keep 1200 as the default and 65ch for prose.
8. **Breakpoints vs Material window classes.**
   - Keep the content-driven web breakpoints (520/760/900/1100). Peers vary widely, so there is no web standard to conform to.
   - For native, do **not** port the px breakpoints. Expose semantic window-class tokens (compact < 600, medium 600–839, expanded 840–1199, large 1200–1599, xl ≥ 1600 dp). Read them in Compose with `currentWindowAdaptiveInfo()`, in SwiftUI from horizontal size classes, and in React Native from `useWindowDimensions().width`.
   - Primitives such as split and columns should switch on class, not on device type. **[platform convention]**
   - Consider writing web breakpoints in **em**, as Leeds and Rivet do, so they follow the user's root font size. **[our recommendation]**
9. **Container queries.** **[our recommendation]**
   - None of the university pages read mention container queries, and the evidence here is only by analogy.
   - Larkmoor's primitives (cluster, auto-fit, split, card) are reused at different widths. Container queries would let a component collapse based on its own width, the same idea as Apple's "space available, not device".
   - Adopt them for component-level collapse and keep media queries for page chrome.
10. **Cascade layers.** **[our recommendation]**
    - Not mentioned by any source read, so this has no external evidence.
    - It is still worth doing because Larkmoor will sit beside CMS themes, as every peer does (Drupal at ASU, Harvard, Cambridge and Edinburgh; WordPress and Drupal for Decanter).
    - Ship CSS in `@layer lm.reset, lm.tokens, lm.base, lm.layout, lm.components, lm.utilities` so host overrides are predictable.

**P3: components (frequency among the systems that list components)**

11. **Tabs.** Arizona, Rivet, UMD, Harvard, UCLA and Cambridge have tabs. This is the most common gap. **[our recommendation]**
    - On the web, follow the ARIA tablist pattern.
    - On native, map to React Native `role="tablist"`/`"tab"`. Do not confuse it with a native *tab bar*: Apple treats the tab bar as app navigation, which can become a sidebar at regular width (§5.1).
    - Larkmoor's segmented control should not stand in for tabs.
12. **Dialog/modal.** Arizona and Rivet have one. **[our recommendation]**
    - Needs an elevated surface token in dark mode (Apple *elevated* background, M3 tonal elevation).
    - Native modal semantics in React Native use `aria-modal` (iOS) and `importantForAccessibility` (Android) (§5.3).
13. **Breadcrumbs.** Arizona, Rivet, UMD, UCLA, U-M Library, Leeds and Cambridge have them, which makes it the most common item overall. This is a web-only component. **[our recommendation]**
14. **Pagination.** Arizona, Rivet, UCLA, U-M Library and Leeds. On the web it is a numbered link list. On native, prefer lists that load more as you scroll. **[our recommendation]**
15. **Table.** Rivet, UCLA, U-M Library, Cambridge, Arizona (content) and Leeds (typography). **[our recommendation]**
    - Needs a responsive strategy: scroll container or stacked rows at narrow widths.
    - Pair it with `container.wide` from item 7.
16. **Sheet (offcanvas / bottom sheet).** Only Arizona has one (offcanvas). Lower priority for web. On native it is the conventional surface for secondary tasks, and Apple notes that modal sheets use the elevated background. Build it after the dialog. **[our recommendation]**
17. **Toast.** Only Arizona has one. Lowest priority. **[our recommendation]**
    - If built, announce it through a live region (`aria-live`, Android only in React Native) and do not auto-dismiss actionable messages.
    - This also fits Larkmoor's existing pause control.

**P4: tokens, motion and governance**

18. **Native token output.** **[our recommendation]**
    - Larkmoor's DTCG foundation → semantic → themes structure is ahead of every peer read. UMD uses JS/TS, Rivet a flat `--rvt-` set, U-M Library a two-tier primitive → semantic set, and the ASU token package is deprecated.
    - Generate Swift, Kotlin and TS outputs from the same source.
    - Emit unitless numbers that resolve to pt, dp or px per platform, and `sp` for type on Android.
    - Keep the px spacing scale. It already matches the 4-based scales of UMD, Rivet and Leeds.
19. **Motion.** **[platform convention]**
    - The four durations and the reduced-motion support fit Apple's guidance.
    - Add a rule that, under reduced motion, translate, scale and depth transitions become fades. Do not just shorten them.
    - Never animate blur.
20. **Versioning and status.** **[our recommendation]**
    - Adopt per-component status labels (Prototype, Testing, Ready, Deprecated), as Leeds does.
    - Run semantic-release with Conventional Commits per package (web, rn, swift, compose), as ASU does.
    - Publish an explicit end-of-life policy, as UCLA did for v1.0.0.
    - Avoid `@latest` CDN snippets of the kind U-M Library publishes.

## 7. What Larkmoor 0.2.0 did with these findings

| # | Recommendation | Status in 0.2.0 | Where |
|---|---|---|---|
| 1 | Native touch targets | ✅ 44pt iOS / 48dp Android: tokens, React Native components (with `hitSlop` for compact sizes), SwiftUI button style, Compose via Material 3 | `size.target`, `size.target-android`, `src/react-native/Button.tsx` |
| 2 | Dynamic Type and fontScale | ✅ React Native: scaling stays on, roles map to iOS `dynamicTypeRamp`, and large roles are capped (display ×1.3, title ×1.4); body is never capped. SwiftUI: `Font.custom(relativeTo:)`. Compose: `sp`. ⚪ Stacking at accessibility sizes is handled per component (Rows stacks on compact) but not tested at AX5 on a device | `src/react-native/Text.tsx`, `dist/ios/Larkmoor.swift` |
| 3 | Safe areas | ✅ React Native `Screen` (safe-area-context); web `env(safe-area-inset-*)` on container, skip link, footer, dialog footer, toast, tab bar | `layout.tsx`, `src/css/*` |
| 4 | System dark mode for the default theme | ✅ `evergreen-dark`; the web follows the device with `data-lm-color-scheme="auto"`, and the native providers follow the system by default | `tokens/themes/evergreen-dark.tokens.json` |
| 5 | Contrast checks in the pipeline | ✅ Every theme, both grounds, text 4.5:1, UI 3:1 (unit tests). ⚪ No Increase Contrast theme or 7:1 dark target yet | `tests/unit/tokens.test.mjs` |
| 6 | Fixed-count columns, no 12-column grid | ✅ `.lm-columns` (2/3/4) next to auto-fit grid and split | `src/css/layout.css` |
| 7 | Narrow and wide containers | ✅ 800 / 1200 / 1440 | `size.container-*` |
| 8 | Window classes on native | ✅ 600 / 840 / 1200 / 1600; fluid values resolve to compact / medium / expanded | `window.*`, `scripts/native.mjs` |
| 9 | Container queries | ✅ `.lm-cq` with columns, split, rows; tables always | `src/css/layout.css`, `table.css` |
| 10 | Cascade layers | ✅ `lm.base < lm.layout < lm.components < lm.utilities` | `scripts/build.mjs` |
| 11–17 | Tabs, dialog, breadcrumbs, pagination, table, sheet, toast | ✅ All seven on the web, each with docs, states and tests; plus a mobile tab bar. ⚪ Not yet ported to React Native, SwiftUI or Compose | `src/css`, `src/js/larkmoor.js` |
