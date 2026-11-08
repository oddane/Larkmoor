# Completion matrix

This maps every requirement in the original assignment ("Website UI Repair and Reusable Design System") and the follow-up request to where it lives and the evidence for it.

**Status key:**
- ✅ **done and verified**
- 🟡 **done, verification partly unavailable**
- ⛔ **blocked**
- ⚪ **not applicable** (reason given)
- ❔ **unverified**

## §1 Establish the project and preserve its behaviour

| Requirement | Where | Evidence | Status |
|---|---|---|---|
| Purpose, audience, brand, tasks, stack, constraints | UI_AUDIT §1 | Single-page marketing site, plain HTML/CSS/JS, published as an artifact | ✅ |
| Read instructions, inspect tree, keep uncommitted work | Backups `index-v1…v14` in the work folder; app repo only read, never written | — | ✅ |
| Run the site and establish a baseline | First-pass audit (Version 13) | First-pass QA numbers in the earlier report | ✅ |
| Inventory routes, components, journeys | UI_AUDIT §1 | One route; components listed | ✅ |
| Inspect rendered pages and code | UI_AUDIT §3 | `docs/screenshots/`; tests | ✅ |
| Record existing failures separately | UI_AUDIT §4 (first pass) vs §3 (this pass) | — | ✅ |
| Keep functionality, integrations, brand assets | `examples/tauawo/` | Interaction tests 14–21; same links, demos, copy | ✅ |

## §2 Research

| Requirement | Where | Evidence | Status |
|---|---|---|---|
| Read the 9 listed sources | RESEARCH.md | Exact URLs and access dates | 🟡 Material 3 pages render only with JavaScript. They were read through Google's own Android page instead, marked as a secondary source. |
| Separate conformance / design-system convention / project hypothesis | RESEARCH.md §1, §2, §3 | — | ✅ |
| DTCG stable version | RESEARCH.md §2.8 | 2025.10 Final CG Report | ✅ |

## §3 Audit

| Requirement | Where | Evidence | Status |
|---|---|---|---|
| UI_AUDIT.md with coverage matrix and prioritised findings | UI_AUDIT.md | F1–F20, each with location, impact, fix and verification | ✅ |
| Every category covered, or marked not applicable with a reason | UI_AUDIT §2 | Localization, dialogs and tables marked N/A with reasons | ✅ |

## §4 Responsive

| Requirement | Where | Evidence | Status |
|---|---|---|---|
| Content-driven breakpoints | `tokens/foundation/dimension.tokens.json` (`breakpoint.*`), GUIDELINES "Responsive behaviour" | — | ✅ |
| Test 320–1920 and around each breakpoint | `tests/browser/responsive.test.mjs` | 17 widths × 2 heights × 3 pages | ✅ |
| Short screens, landscape | same | 568-tall screens, 844×390 | ✅ |
| Touch, mouse, keyboard; nothing essential depends on hover | Rail labels on focus; lens works by drag; keyboard test | a11y test 8 | 🟡 Real touch devices untested |
| Safe areas, on-screen keyboard | `enterkeyhint`; 16px inputs | — | ❔ Needs a real phone |
| Overflow fixed at the source | F13 | responsive test | ✅ |
| Container queries considered | GUIDELINES (not needed yet, with reason) | — | ✅ |

## §5 Components and states

| Requirement | Where | Evidence | Status |
|---|---|---|---|
| Inventory and consolidate | UI_AUDIT §1 | 14 shared components moved into the package | ✅ |
| Each component documented: purpose, anatomy, variants, states, keyboard, misuse | `docs/index.html` | Live states; do/don't rules | ✅ |
| Forms: labels, optional, hints, types, autocomplete, keyboards, timing, summary, kept input, progress, success, retry | `src/css/field.css`, `initForm`, `examples/harbor` | interaction test 20 | ✅ |
| Overlays | — | — | ⚪ None exist. Listed under "Not built yet". |
| Success only after the operation succeeds | `initForm` | interaction test 20 | ✅ |
| Motion durations, easing, reduced motion | motion tokens, `motion.css` | tests 18, 7 | ✅ |

## §6 Accessibility

| Requirement | Where | Evidence | Status |
|---|---|---|---|
| WCAG 2.2 AA checks (contrast, non-text contrast, targets, reflow, focus, text spacing, errors, colour not alone) | ACCESSIBILITY.md | unit contrast; a11y tests 7–13 | ✅ automated |
| Forced colours, reduced motion | `forced-colors.css`, `motion.css` | tests 12, 7 | ✅ |
| Screen-reader output | ACCESSIBILITY.md manual plan | — | ⛔ Needs your devices |
| axe-core | — | — | ⛔ Registry unreachable |

## §7 Content, localization, performance

| Requirement | Where | Evidence | Status |
|---|---|---|---|
| Clear headings, labels, errors | GUIDELINES "Content"; Harbor messages | — | ✅ |
| Long content and long names | Docs long-label examples; Harbor long event title | screenshots | ✅ |
| Locale formatting, RTL | GUIDELINES | — | ⚪ English-only fixed strings; RTL untested |
| No layout shift; fonts | F3, F19 | CLS 0 (lab) | ✅ |
| Performance budgets, lab vs field | QA §4 | `docs/evidence/perf-*.json` | ✅ lab · ⚪ field after launch |

## §8 Reusable system

| Requirement | Where | Evidence | Status |
|---|---|---|---|
| Foundation → semantic → component tokens; layout primitives; themes | `tokens/`, `src/css/layout.css`, `tokens/themes/` | unit tests | ✅ (no component-tier tokens were needed; CONTRIBUTING says when to add them) |
| Framework-independent core; typed package | CSS has no framework; `dist/larkmoor.js` + `.d.ts` | typecheck | ✅ |
| DTCG format, single source, documented transforms and exceptions | `scripts/build.mjs`; CONTRIBUTING (`com.larkmoor.fluid`, `com.larkmoor.css`) | unit tests 1–3 | ✅ |
| Colour, type, spacing, size, container, border, radius, elevation, motion and layer tokens | `tokens/foundation/*` | — | ✅ |
| Responsive constants separate | `dist/breakpoints.{mjs,d.ts,json}`, `_breakpoints.scss` | pack-check resolves them | ✅ |
| Second consumer with a different brand, no Tauawo imports | `examples/harbor/` | Uses only `vendor/larkmoor`; tests 13, 19–21; visual | ✅ |
| README, RESEARCH, DESIGN_PRINCIPLES, GUIDELINES, ACCESSIBILITY, THEMING, MIGRATION, UI_AUDIT, QA_REPORT, CONTRIBUTING, CHANGELOG, licence decision, attribution, CLAUDE.md | repo root | — | ✅ (licence intentionally left as your decision) |
| Interactive component docs (Storybook or equivalent) | `docs/index.html` (equivalent: live HTML with theme switcher) | visual + a11y tests | ✅ |
| Tested adoption instructions | README "Use it in your next website" | `docs/evidence/pack-check.log` | ✅ (bundler CSS imports untested) |

## §9 Implement and verify

| Requirement | Where | Evidence | Status |
|---|---|---|---|
| Tests, type check, build | `npm test` | `docs/evidence/test-run.log`, exit 0 | ✅ |
| Visual regression with reviewed baselines | `tests/browser/visual.test.mjs`, `tests/baselines/` | 12/12; one intentional change reviewed | ✅ |
| Verification matrix | QA_REPORT §3 | — | ✅ |

## §10 GitHub

| Requirement | Where | Evidence | Status |
|---|---|---|---|
| Private repository created | github.com/oddane/Larkmoor (you created it) | — | ✅ by you |
| Source pushed and remote commit verified | Local git repository with commits | `git log` | ⛔ The Claude GitHub app has no access to the repository yet |
| CI | `.github/workflows/ci.yml` | Runs only once pushed | ❔ |
| Website PR | — | — | ⚪ The website has no repository of its own; it lives in `examples/tauawo/` |

## Follow-up request (items 1–7)

| # | Item | Status |
|---|---|---|
| 1 | Spacing, type, grids, containers, responsive rules, semantic colours, states, primitives | ✅ tokens, GUIDELINES, docs |
| 2 | Package with installation instructions, docs, theming, versioning | ✅ README, docs, THEMING, README → Versioning, pack-check |
| 3 | Second example with a different brand | ✅ Harbor (preview published) |
| 4 | GitHub repository, uploaded source, verified commit | ⛔ waiting on access; left for later as you asked |
| 5 | Remaining browser and accessibility checks; device-only checks listed | ✅ what this environment supports · checks needing your devices in ACCESSIBILITY.md |
| 6 | Reproducible commands, logs, screenshots | ✅ README commands, `logs/`, `reports/`, `docs/screenshots/` |
| 7 | Privacy evidence from implementation and network | ✅ PRIVACY_EVIDENCE.md · app network capture needs your phone |
