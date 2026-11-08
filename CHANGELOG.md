# Changelog

## 0.2.0 · 2026-11-08
Larkmoor now works for apps as well as websites, and was benchmarked against ten university design systems plus Apple, Android and React Native guidance (docs/guides/BENCHMARK.md).

**Mobile apps (new)**
- React Native package (`@larkmoor/design-system/react-native`):
  - provider and hooks (system dark mode, window size class, platform touch target, Reduce Motion);
  - components: Text, Button, Field, SegmentedControl, Accordion, Screen, Container, Section, Stack, Cluster, Grid, Card, Panel, Badge, Alert, Rows;
  - type-checked against React Native 0.88.1.
- SwiftUI output (`dist/ios/Larkmoor.swift`): tokens, themes, Dynamic Type-aware text styles, theme environment and a button style. Compiled in CI.
- Kotlin and Jetpack Compose output (`dist/android`): tokens plus a `LarkmoorTheme` that wraps Material 3. Compiled in CI.
- Bundled native font files (`fonts/native`, OFL).
- Native tokens:
  - 44pt / 48dp touch targets;
  - window classes 600 / 840 / 1200 / 1600;
  - fluid web values resolved per class;
  - per-role font-scale caps.

**Themes**
- New `evergreen-dark`, a full dark theme for the default brand.
- `data-lm-color-scheme="auto"` follows the device setting (default → evergreen-dark, harbor → harbor-dark).

**Web**
- All CSS is now in cascade layers, so site CSS overrides it without specificity fights.
- Safe-area insets (with `viewport-fit=cover`), `100dvh`, and 44px targets on touch screens.
- Container queries: `.lm-cq`, plus responsive `.lm-columns`, `.lm-split`, `.lm-rows` and tables.
- New layout: `.lm-columns` (2/3/4 fixed columns), `.lm-container--narrow` (800) and `--wide` (1440).
- New components: tabs, dialog and bottom sheet, toast, breadcrumbs, pagination, table (scrolling or stacked), tab bar.
- New behaviours: `initTabs`, `initDialog`, `toast`.

**Fixes**
- Breadcrumb links are at least 24px tall (44px on touch).
- Buttons keep their label on one line; a long wordmark truncates instead of wrapping the header; the header spacing is tighter on phones.

**Breaking:** none. Every 0.1 class, token and export is unchanged.


## 0.1.0 · 2026-11-08
First release, named Larkmoor. CSS prefix `lm-`, theme attribute `data-lm-theme`, package `@larkmoor/design-system`.

**Tokens and themes**
- DTCG 2025.10 tokens: palette, spacing, sizes, radii, borders, breakpoints, type, motion, layers, elevation.
- Semantic colour and type roles.
- Themes: `evergreen` (default), `evergreen-inverse`, `harbor`, `harbor-dark`.

**CSS**
- base, typography roles, prose;
- layout primitives: container, stack, cluster, grid (+ fill), split, section, shell;
- components: button, link, header and navigation, segmented control, accordion, field, input group, error summary, check, badge, panel, card, alert, rows, footer, progress, motion toggle;
- forced-colours and reduced-motion support.

**Behaviours**
- `initMotionToggle`, `initDisclosureMenu`, `initHeader`, `initReveal`, `initForm`, with TypeScript types.

**Fonts, examples and docs**
- Self-hosted Geist and Martian Mono.
- Tauawo website migrated onto the system.
- Harbor second example.
- Interactive docs.
