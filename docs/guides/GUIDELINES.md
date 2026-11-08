# Guidelines

## Layout

- **Container:** `.lm-container`. Max 1200px including gutters, gutter `clamp(16px, 3.5vw, 32px)`.
- **Prose measure:** `.lm-prose`, about 65 characters (USWDS gives 45–90, with 66 as its target).
- **Primitives:**
  - `.lm-stack` for vertical flow;
  - `.lm-cluster` for wrapping rows of actions or tags;
  - `.lm-grid` for repeated items (`--lm-grid-min`; add `--fill` to stop few items from stretching);
  - `.lm-split` for the 4/8 aside-and-content pair;
  - `.lm-shell` for header, main and footer.
- **Grid vs Flexbox:** Grid for two-dimensional layouts (section heads, footers, cards); Flexbox for one direction (clusters, the header bar).
- **No 12-column grid.** No page needed one. `.lm-split` covers editorial pages.
- **Positioning:** absolute only for layered details (packet animation, phone keys). Sticky only for the phone stage and the docs table of contents.
- **Layers:** `--lm-layer-*` = base 0, raised 10, sticky 50, progress 60, overlay 80, skip link 100. Don't add new numbers; create a stacking context instead.

## Spacing

Scale (`--lm-space-N`): 0, 4, 8, 12, 16, 24, 32, 48, 64, 96px.
Fluid tokens:
- `--lm-space-section`: 64 to 112px;
- `--lm-space-head-gap`: 32 to 56px;
- `--lm-space-gutter`: 16 to 32px.

| Relationship | Token |
|---|---|
| Icon and its label | space-2 (8) |
| Label and input, hint and input | space-2 (8) |
| Related fields in a form | space-5 (24) |
| Items in a cluster | space-3 vertical × space-5 horizontal |
| Card padding | space-5 (24) |
| Section heading and its content | head-gap |
| Between sections | section (padding on each side of a 1px rule) |

Documented optical exceptions:
- the 6px vertical padding on links (keeps underline-to-text distance even);
- `.lm-section-head > .lm-label { padding-top: .7em }` (aligns the eyebrow with the first line of a large title).

## Typography

| Role | Class | Size | Line height | Weight | Use |
|---|---|---|---|---|---|
| Display | `.lm-display` | 30 to 60px fluid | 1.06 | 500 | One per page |
| Title | `.lm-title` | 26 to 38px | 1.14 | 500 | Section headings |
| Heading | `.lm-heading` | 20 to 26px | 1.2 | 500 | Item headings |
| Subheading | `.lm-subheading` | 18px | 1.3 | 500 | Card and list headings |
| Lead | `.lm-lead` | 16 to 18px | 1.6 | 400 | Section intros |
| Body | (default) | 16px | 1.6 | 400 | Everything else |
| Caption | `.lm-caption` | 14px | 1.55 | 400 | Help text, metadata |
| Label | `.lm-label` | 11px, uppercase | 1.45 | 400 | Eyebrows, a few words only |
| Code | `.lm-code` | 0.8125em | 1.6 | 400 | Inline code |

- **Fluid sizes:** `clamp(px, vw + px, px)` so zoom still scales them (MDN warns against vw alone).
- **Heading level:** semantic level never follows visual size.
- **Tabular figures:** use `.lm-tabular` for changing or aligned numbers.
- **Weights:** at most two per screen.

## Content

- **Headings:** say the point ("What we can see, and what we can't."), not the category ("Security").
- **Buttons:** name the result ("Request card"). Links say where they go.
- **Errors:** say what to do ("Enter your last name"), never "Invalid input".
- **No invented proof:** no fake numbers, logos or quotes. Status is stated plainly.
- **Dates and numbers:** use `Intl.DateTimeFormat` / `Intl.NumberFormat` when content is dynamic. The examples use fixed English strings.
- **Long content:** long titles wrap (`text-wrap: balance`). Codes and URLs break anywhere (`overflow-wrap: anywhere` on `code`).

## Motion

- **Durations:** 150 / 250 / 400 / 600ms.
- **Easing:** `cubic-bezier(.22, .8, .2, 1)`, plus `(.65, 0, .35, 1)` for travel.
- **Entrances:** only below the fold, and only when motion is allowed. Nothing is hidden without script.
- **Reduced motion:** transitions go to 0s and animations play one near-instant frame.
- **Pause:** loops longer than 5 seconds need `.lm-motion-toggle` (WCAG 2.2.2).

## Responsive behaviour

| Width | Navigation | Section heads, splits | Footer | Rows | Notes |
|---|---|---|---|---|---|
| < 520 | menu button | stacked | 2 columns | stacked | single-column forms |
| 520–759 | menu button | stacked | 3 columns | 2 columns | |
| 760–899 | menu button | stacked | 3 columns | 2 columns | editorial rows go two-column |
| 900–1099 | full nav | 4/8 split | 5 columns | 2 columns | Tauawo privacy demo stays stacked |
| ≥ 1100 | full nav | 4/8 split | 5 columns | 2 columns | side rails appear |

- Touch: no essential control depends on hover. Rail labels also show on focus, and the lens works by dragging.
- Container queries are not used yet: no component appears in differently sized regions. Revisit when one does.
