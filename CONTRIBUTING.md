# Contributing

**Before you add anything, look for what exists:** tokens in `tokens/`, components in `src/css/`, live examples in `docs/`.

## Adding a token
- **Raw value:** goes in `tokens/foundation/`.
- **Purpose:** goes in `tokens/semantic/` as an alias.
- **Naming:** `category.role[.variant]`, lowercase, hyphenated. The CSS name is generated as `--lm-<path-with-dashes>`.
- **Components** only use semantic tokens (a test checks this).
- **Fluid values or CSS-only units** (em, %, ch) go in `$extensions` (`com.larkmoor.fluid`, `com.larkmoor.css`) with a plain DTCG fallback in `$value`.
- **Never** edit `dist/` by hand.

## Adding a component
1. A real page needs it. Otherwise, document it under "Not built yet" in the docs.
2. Use native HTML first. For custom widgets, follow the ARIA Authoring Practices pattern.
3. Add `src/css/<name>.css` and list it in `src/css/index.txt`.
4. Add a docs section with:
   - purpose;
   - live examples of every state;
   - keyboard and screen-reader behaviour;
   - do/don't rules.
5. Add tests: an interaction test for behaviour, and make sure it appears on a page covered by the a11y and visual tests.
6. Add a CHANGELOG entry and choose the version step (README → Versioning).

## Before a pull request
`npm test` must pass. Review any `reports/visual/diff-*.png` before running `npm run test:update-baselines` (local baselines live in `tests/baselines/local`; CI keeps its own set in `tests/baselines/ci`, because fonts render differently on GitHub's machines).
