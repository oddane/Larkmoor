<div align="center">

# Larkmoor

**A small, accessible design system for building websites that look intentional and stay honest.**

One token source for web, React Native, iOS and Android · layout primitives · 24 accessible web components · native components for React Native, SwiftUI and Compose · light, dark, high-contrast and brand themes · zero runtime dependencies

[![CI](https://github.com/oddane/Larkmoor/actions/workflows/ci.yml/badge.svg)](https://github.com/oddane/Larkmoor/actions/workflows/ci.yml)
[![Screen readers](https://github.com/oddane/Larkmoor/actions/workflows/screen-readers.yml/badge.svg)](https://github.com/oddane/Larkmoor/actions/workflows/screen-readers.yml)
![version](https://img.shields.io/badge/version-0.3.0-1f7a4f)
![platforms](https://img.shields.io/badge/platforms-web%20%C2%B7%20React%20Native%20%C2%B7%20SwiftUI%20%C2%B7%20Compose-14241c)
![tokens](https://img.shields.io/badge/tokens-DTCG%202025.10-14241c)
![a11y](https://img.shields.io/badge/target-WCAG%202.2%20AA-14241c)
![dependencies](https://img.shields.io/badge/runtime%20deps-0-14241c)
[![licence](https://img.shields.io/badge/licence-Apache%202.0-14241c)](LICENSE)

<img src="docs/screenshots/tauawo-1440-first-screen.png" width="49%" alt="The Tauawo website built with Larkmoor's default Evergreen theme">
<img src="docs/screenshots/harbor-1440-first-screen.png" width="49%" alt="A fictional library website built with Larkmoor's Harbor theme">

<sub>Same components, two brands. Left: the Tauawo website (Evergreen theme). Right: a fictional example site (Harbor theme).</sub>

</div>

---

## Why Larkmoor

- **One source of truth.** Every colour, size, space, duration and layer is a [DTCG 2025.10](https://www.designtokens.org/TR/2025.10/) token. One dependency-free script builds CSS custom properties, themes, JSON and breakpoint constants from them.
- **Websites and apps from one source.** The same tokens build CSS, React Native components, SwiftUI and Jetpack Compose. Each native output uses its platform's touch targets, text-size setting, dark mode and safe areas, and is compiled or type-checked in CI.
- **Brands without forks.** A theme overrides semantic roles only. Components never change. Each theme is contrast-tested on its own, including dark themes.
- **High contrast everywhere.** Every theme has a partner for Increase Contrast and `prefers-contrast: more`, held to WCAG AAA (7:1 text). Websites, SwiftUI, React Native and Compose switch automatically.
- **Accessible by construction.** Native elements first, ARIA Authoring Practices patterns, visible focus, 24px+ targets, reduced motion, a pause control, forced-colours support and no-JavaScript fallbacks. Real VoiceOver and NVDA runs in CI check what the new components actually say.
- **Private by default.** Self-hosted fonts, no cookies, no third-party requests. A test fails if a page ever calls another origin.
- **Proven, not promised.** 30 unit tests and 57 browser tests cover contrast in every theme, high contrast, 17 screen widths, keyboard focus, the accessibility tree, interactions, network traffic, lab performance and visual regression. CI also compiles the SwiftUI (macOS and iOS SDKs) and Compose outputs, type-checks React Native, and runs VoiceOver and NVDA.

## Quick start

### Plain HTML (no build tools)

Copy `dist/` into your site as `vendor/larkmoor/`:

```html
<html lang="en" data-lm-theme="harbor">          <!-- omit for the default Evergreen theme -->
<head>
  <script>document.documentElement.classList.add('js');</script>
  <link rel="stylesheet" href="vendor/larkmoor/larkmoor.css">
  <link rel="stylesheet" href="vendor/larkmoor/themes/harbor.css">
</head>
<body>
  <a class="lm-skip-link" href="#main">Skip to content</a>
  <main id="main">
    <section class="lm-section">
      <div class="lm-container lm-stack">
        <h1 class="lm-display">Hello, <em>Larkmoor.</em></h1>
        <p class="lm-lead">Tokens, primitives and components, themed in one attribute.</p>
        <div class="lm-cluster"><a class="lm-btn lm-btn--primary" href="#start">Get started</a></div>
      </div>
    </section>
  </main>
</body>
</html>
```

[`examples/harbor/index.html`](examples/harbor/index.html) is a complete page built exactly this way.

### In a mobile app

```tsx
import { LarkmoorProvider, Screen, Container, Stack, Text, Button } from '@larkmoor/design-system/react-native';

<LarkmoorProvider theme="harbor" darkTheme="harbor-dark">
  <Screen><Container><Stack gap="5">
    <Text variant="display">Borrow a book</Text>
    <Button label="Get a library card" onPress={join} />
  </Stack></Container></Screen>
</LarkmoorProvider>
```

SwiftUI and Jetpack Compose files are in `dist/ios` and `dist/android`:

```swift
LarkmoorField("Email", text: $email, error: error)
LarkmoorSegmentedControl("Plan", options: [.init("free", "Free"), .init("plus", "Plus")], selection: $plan)
  .larkmoorTheme(light: "harbor", dark: "harbor-dark")   // Dark Mode + Increase Contrast
```

See [Platforms](docs/guides/PLATFORMS.md).

### With npm

The package isn't on the npm registry. Install it straight from this repository:

```bash
npm install github:oddane/Larkmoor#v0.3.0
```

```js
import '@larkmoor/design-system/fonts.css';        // only if you use Geist / Martian Mono
import '@larkmoor/design-system/larkmoor.css';
import '@larkmoor/design-system/themes/harbor.css';
import { initHeader, initForm } from '@larkmoor/design-system';
import { below } from '@larkmoor/design-system/breakpoints';  // '(max-width: 899.98px)'
```

`npm run pack:check` proves this route: it installs the packed tarball into an empty project and resolves every entry point.

## What's included

| | |
|---|---|
| **Tokens** | palette, semantic colour roles, spacing (4px base), sizes, radii, borders, breakpoints (520 / 760 / 900 / 1100), type roles, motion, layers, elevation |
| **Themes** | `evergreen` (default), `evergreen-dark`, `evergreen-inverse`, `harbor`, `harbor-dark`, and a `-contrast` partner for each; `data-lm-color-scheme="auto"` and `data-lm-contrast="auto"` follow the device |
| **Layout primitives** | container (+ narrow 800, wide 1440), stack, cluster, grid (+ fill), columns (2/3/4), split, section, shell, query container (`.lm-cq`) |
| **Web components** | button, link, header and navigation, segmented control, accordion, field, input group, error summary, check, badge, panel, card, alert, rows, footer, progress, motion toggle, tabs, dialog and bottom sheet, toast, breadcrumbs, pagination, table, tab bar |
| **React Native** | Text, Button, Field, SegmentedControl, Accordion, Screen, Container, Section, Stack, Cluster, Grid, Card, Panel, Badge, Alert, Rows |
| **SwiftUI / Compose** | tokens, themes (with Increase Contrast / high contrast), text styles, theme environment / `LarkmoorTheme`, button style, field, segmented control, accordion |
| **Behaviours** | `initMotionToggle`, `initDisclosureMenu`, `initHeader`, `initReveal`, `initForm`, `initTabs`, `initDialog`, `toast` (ES modules, TypeScript types) |
| **Fonts** | Geist and Martian Mono, self-hosted, SIL OFL 1.1 |

Browse every component with its states, keyboard behaviour and do/don't rules in the **component docs** ([`docs/index.html`](docs/index.html); run `npm run serve`).

## Development

Prerequisites: Node.js 20+ (`.nvmrc` pins 22).

```bash
npm install && npx playwright install chromium

npm run build          # tokens + CSS + JS -> dist/
npm run examples       # copy dist/ into the examples and docs
npm run serve          # http://127.0.0.1:4173/docs/ · /examples/tauawo/ · /examples/harbor/
npm test               # build, typecheck, unit + browser tests
npm run screenshots    # docs/screenshots/ at representative widths
npm run evidence       # snapshot the latest reports and logs into docs/evidence/
```

Edit `tokens/*.tokens.json` and `src/`. Never edit `dist/`, which is generated and committed so git installs work without a build.

## Repository layout

```
tokens/              DTCG sources: foundation/ → semantic/ → themes/
src/css/             base, typography, layout, components (order in index.txt)
src/js/              behaviours + type definitions
src/react-native/    React Native components
src/ios/ src/android/ SwiftUI and Compose components
fonts/               woff2 files and their licences
dist/                generated package output
docs/                component docs (index.html), guides/, reports/, screenshots/, evidence/
examples/tauawo/     first consumer: the Tauawo website
examples/harbor/     second consumer: fictional library, different brand, no shared code
tests/               unit/, browser/, baselines/, screen-reader/ (VoiceOver + NVDA), compose/
scripts/             build, serve, sync, screenshots, pack check, GitHub setup
```

## Documentation

| Guides | Reports |
|---|---|
| [Design principles](docs/guides/DESIGN_PRINCIPLES.md) | [UI audit](docs/reports/UI_AUDIT.md) |
| [Platforms: web, React Native, iOS, Android](docs/guides/PLATFORMS.md) | [Benchmark: universities and platforms](docs/guides/BENCHMARK.md) |
| [Guidelines: layout, spacing, type, content, motion, responsive](docs/guides/GUIDELINES.md) | [QA report](docs/reports/QA_REPORT.md) |
| [Theming](docs/guides/THEMING.md) | [Privacy evidence](docs/reports/PRIVACY_EVIDENCE.md) |
| [Accessibility](docs/guides/ACCESSIBILITY.md) | [Completion matrix](docs/reports/COMPLETION_MATRIX.md) |
| [Migration](docs/guides/MIGRATION.md) | [Changelog](CHANGELOG.md) |
| [Research and sources](docs/guides/RESEARCH.md) | [Security policy](SECURITY.md) |

Working with an AI assistant? Point it at [CLAUDE.md](CLAUDE.md) first.

## Versioning and releases

[Semantic versioning](https://semver.org/) on the public contract: class names, custom properties, token paths, theme names and JS exports.

- **Major:** something renamed or removed.
- **Minor:** something added.
- **Patch:** fixes that keep the contrast and size guarantees.

Tokens are deprecated with `$deprecated` for one minor release before removal.

To release:
1. Bump `version` in package.json.
2. Update CHANGELOG.md.
3. Push a `vX.Y.Z` tag.

The release workflow runs the full test suite and publishes a GitHub release with the package tarball.

## Repository settings

These are configured:
- the description and topics;
- squash-only merging, with branch updates suggested and merged branches deleted;
- the `v0.1.0`, `v0.2.0` releases;
- labels;
- issue and PR templates;
- Dependabot.

CI checks every push and pull request. Branch protection for `main` can be turned on now that the repository is public (GitHub enforces it free on public repositories).

To re-attach the package to a release, open **Actions → Release → Run workflow** and enter the tag.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Issues and pull requests use templates, and every change needs `npm test` to pass.

## Licence

[Apache License 2.0](LICENSE). You can use, change and ship Larkmoor in any project, including commercial ones, as long as you keep the copyright and licence notices ([NOTICE](NOTICE)).

The licence covers the code and documentation, not brands: the Tauawo name, logo and website copy in `examples/tauawo/` stay Tauawo's. The Geist and Martian Mono fonts keep their own SIL Open Font License ([ATTRIBUTION.md](ATTRIBUTION.md)).
