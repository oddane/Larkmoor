# QA report

**Date:** 8 November 2026.

**What was tested:** Larkmoor 0.1.0, the Tauawo website on top of it, the Harbor example and the docs.

**Environment:**
- Linux container;
- Node 22.23;
- Chromium via Playwright 1.63;
- TypeScript 7.0.

Everything below was measured in **Chromium only**.

**Full log:** `docs/evidence/test-run.log` (exit 0). Install check: `docs/evidence/pack-check.log`.

## 1. Summary

| Result | Count |
|---|---|
| ✅ Passed | 10 unit tests + 41 browser tests + type check + install check |
| ❌ Failed | 0 (the last run; failures found during the work are in UI_AUDIT §3) |
| ⛔ Blocked | axe-core (registry unreachable here); app network capture (needs your phone) |
| ⚪ Untested | Real screen readers, Safari, Firefox, real phones, field Core Web Vitals, RTL |

## 2. How to reproduce

```bash
npm install && npx playwright install chromium
npm test                       # build, typecheck, 10 unit + 41 browser tests
npm run pack:check             # install into a fresh project
npm run screenshots           # docs/screenshots/
```

## 3. Verification matrix

| # | Component / page | Theme | Viewport | State | Method | Outcome |
|---|---|---|---|---|---|---|
| 1 | Token sources (DTCG 2025.10) | all 4 | — | build | unit: valid JSON, types, aliases, `{value, unit}` objects | ✅ |
| 2 | Theme contract | all 4 | — | — | unit: every semantic colour defined | ✅ |
| 3 | Contrast | evergreen, evergreen-inverse, harbor, harbor-dark | — | text, status, accent, focus, buttons | unit: computed ratios on bg and bg-subtle | ✅ |
| 4 | Components use semantic tokens only | — | — | — | unit: no `--lm-palette-` in `src/css` | ✅ |
| 5 | dist/ up to date | — | — | — | unit: rebuild produces identical CSS | ✅ |
| 6 | Behaviours (JS) | — | — | — | `tsc --checkJs --strict` | ✅ |
| 7 | Tauawo, Harbor, docs | default / harbor | 390, 1280 | after full scroll | lang, title, h1, main, skip link, heading order, names, duplicate ids, ARIA references, alt, rendered contrast, 24px targets | ✅ |
| 8 | Tauawo, Harbor, docs | — | 1280 | keyboard | every Tab stop: ≥2px ring, not covered by header | ✅ |
| 9 | Tauawo, Harbor, docs | — | 17 widths (320, 375, 390, 430, 519, 521, 759, 761, 768, 899, 901, 1024, 1099, 1101, 1280, 1440, 1920) × 568 and 900 tall | load | no sideways scroll; primary action on the first screen | ✅ |
| 10 | Tauawo | — | 844×390 landscape; 640 (200% zoom) | — | overflow; menu available | ✅ |
| 11 | Tauawo | — | 1280 | WCAG text-spacing override | no clipping or overflow | ✅ |
| 12 | Tauawo | forced colours | 1280 | segmented, strike-through | computed styles | ✅ |
| 13 | Tauawo, Harbor | — | 1280 | JavaScript off | content visible; script-only controls hidden | ✅ |
| 14 | Mobile menu | both | 390 | open / Escape / link | focus returns to button; labels update | ✅ |
| 15 | Segmented control | default | 1280 | arrow keys | selection and preview follow | ✅ |
| 16 | Accordion | default | 1280 | Enter | open state toggles | ✅ |
| 17 | Send demo | default | 1280 | type → send → delivered | message delivered; focus kept; live region | ✅ |
| 18 | Motion toggle | default | 1280 | pause / reload / play | canvas frozen; choice remembered; resumes | ✅ |
| 19 | Header | harbor | 1280 | scroll down and up | hides and returns | ✅ |
| 20 | Form (`initForm`) | harbor | 1280 | empty submit, invalid email, fix, simulated failure, retry, success | summary focus; inline errors; input kept; busy state; success only after resolve | ✅ (after fixing F14) |
| 21 | Event filter | harbor | 1280 | This week → All | 2 → 4 cards | ✅ |
| 22 | Network / privacy | — | 1280 | load, scroll, demo | all requests recorded | ✅ 0 off-site requests, 0 cookies |
| 23 | Performance | — | 390 @3x, 4× CPU, 1.6 Mbps / 150 ms, no cache | 3 runs, median | LCP, CLS, TBT, bytes | ✅ (§4) |
| 24 | Visual regression | default, harbor, harbor-dark | 390, 768, 1440 | full page | pixel diff vs baselines (0.2% tolerance) | ✅ 12/12 |
| 25 | Package install | — | — | — | `npm pack` → install into an empty project → resolve CSS, themes, JSON, JS | ✅ |
| 26 | Screen readers | — | — | — | — | ⚪ needs your devices |
| 27 | Safari, Firefox, real phones | — | — | — | — | ⚪ needs your devices |

## 4. Continuous integration (GitHub Actions)

Every push to `main` and every pull request runs these on GitHub's Ubuntu runners:
- the build;
- a check that generated files are committed;
- the type check;
- 10 unit tests and 41 browser tests;
- the install check.

The run on commit `94c39b7` passed every step.

Two adjustments for CI, both documented in the test files:

- **Its own visual baselines.** Fonts render differently on GitHub's machines. CI recorded `tests/baselines/ci/` once (commit `a0866db`), and I reviewed it; later runs compare against those.
- **Blocking time on GitHub is a ceiling (1000ms), not the 200ms budget.** Shared runners measured anywhere from under 200ms to 463ms for identical code, so a tight limit there fails at random. The 200ms budget is enforced on the reference machine (median 144–173ms). LCP, CLS and page weight keep their normal limits in CI.

## 5. Measured performance (lab)

**Profile:** phone 390×844 @3x, CPU slowed 4×, about 1.6 Mbps down with 150 ms latency, cache off. Median of 3 runs.

| Page | LCP | CLS | TBT | Transfer | Tap → next paint |
|---|---|---|---|---|---|
| Tauawo | 1.80 s | 0 | 144 ms | 313 KB | 31 ms |
| Harbor | 0.74 s | 0 | 58 ms | 67 KB | 15 ms |
| Budget | ≤ 2.5 s | ≤ 0.1 | < 200 ms | < 600 KB | ≤ 200 ms (INP threshold) |

**Why LCP went up:**
- Earlier reports showed Tauawo LCP at about 0.45 s. That test silently failed to load the web fonts.
- This run loads the real self-hosted fonts over the slow network, so it is the honest number.
- Transfer fell from 471 KB to 313 KB.

**What these numbers aren't:**
- They are lab numbers. INP and the 75th-percentile field values can only come from real visits.
- Plan: after launch, check PageSpeed Insights or Search Console's Core Web Vitals report monthly.

## 6. Screenshots

In `docs/screenshots/`, both full page and first screen:
- Tauawo at 320, 390, 768, 1024, 1440 and 1920;
- Harbor at 390, 768 and 1440;
- docs at 390 and 1440.

The visual baselines (`tests/baselines/`) add the docs page in Harbor dark. Captures use reduced motion, so states are settled; the hero cipher field is random by design, so it is hidden in baselines only.

## 7. Problems found by testing and fixed

These are F12–F20 in UI_AUDIT.md:
- privacy demo cramped at tablet widths;
- docs sideways scroll and an input-group width bug;
- form layout shift on blur that made clicks miss;
- reduced-motion stale state;
- start-up blocking time;
- the Google Fonts request.

Each one has a test that would catch it again.

## 8. Blocked and untested

| Item | Status | What unblocks it |
|---|---|---|
| axe-core | ⛔ registry unreachable here | Run the axe DevTools extension, or run CI on GitHub (it installs dependencies) |
| App network capture | ⛔ needs your phone | PRIVACY_EVIDENCE.md §4 |
| Screen readers, Safari, Firefox, real devices | ⚪ | ACCESSIBILITY.md manual checklist (about 1.5 hours total) |
| Field Core Web Vitals | ⚪ no visitors yet | After launch |
| Lockfile | ⚪ `package-lock.json` can't be generated here without the registry | Run `npm install` once on your computer and commit the lockfile. Dependabot will keep it current. |
| Hosted previews | ⚪ | Published to claude.ai artifact pages. Module scripts and fonts load from relative paths there, but that hosting wasn't automatically tested here. Open each preview once. |
