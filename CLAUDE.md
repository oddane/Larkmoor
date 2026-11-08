# Instructions for future work in this repository

You are extending the Larkmoor design system. Read this before writing any CSS, tokens or components.

1. **Look first.** Search `tokens/`, `src/css/` and `docs/index.html` for an existing token, class or pattern. Reuse or extend it. Never hard-code a colour, size, duration or z-index that a token covers.
2. **Token layers:** foundation (raw) → semantic (purpose) → component (only when a component needs a stable contract). Components use semantic tokens only. Edit `tokens/*.tokens.json`, then run `npm run build`. Never edit `dist/`.
3. **Spacing ownership:** components own padding; layout primitives (`lm-stack`, `lm-cluster`, `lm-grid`, `lm-split`) own gaps. No outer margins on components.
4. **Platforms:** tokens are the source for web, React Native, SwiftUI and Compose (scripts/native.mjs). A new token must make sense natively too, or be marked web-only in its description. Native code uses 44pt/48dp targets, the system text size, the system dark setting and safe areas (docs/guides/PLATFORMS.md).
5. **Breakpoints:** 520 / 760 / 900 / 1100 (`dist/breakpoints.*`). Write media queries as `max-width: <bp - 0.02>px`. A new breakpoint needs a content reason, written next to it.
6. **Accessibility is part of done:** native elements first; APG patterns for custom widgets; visible focus; 24px minimum targets (44 for primary touch); 4.5:1 text and 3:1 UI contrast in **every** theme; reduced motion; a pause control for loops; no-JS fallbacks with `data-lm-requires-js`.
7. **Privacy:** no third-party requests (fonts, analytics, CDNs). `tests/browser/network.test.mjs` must stay green.
8. **Honesty:** never invent testimonials, metrics, certifications or capabilities. Product claims need evidence (see PRIVACY_EVIDENCE.md).
9. **Prove it:**
   - run `npm test`;
   - add tests for new behaviour;
   - review visual diffs before updating baselines;
   - report what you could not test.
10. **New component checklist** (CONTRIBUTING.md): real need → native HTML → CSS file + index.txt → docs section with all states → tests → CHANGELOG + version step.
