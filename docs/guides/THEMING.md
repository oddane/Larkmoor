# Theming

A theme is a DTCG file in `tokens/themes/` that overrides **semantic** tokens only. Components never change.

## The theme contract

Every theme must define every `color.*` semantic token. `tests/unit/tokens.test.mjs` fails if one is missing.

| Token | Meaning | Required contrast (checked by test) |
|---|---|---|
| `color.bg`, `color.bg-subtle` | page and quiet panels | grounds for the checks below |
| `color.surface`, `color.control-track` | cards; segmented track | — |
| `color.text`, `text-secondary`, `text-muted`, `text-label`, `accent-text` | text roles | ≥ 4.5:1 on bg and bg-subtle |
| `color.success`, `warning`, `danger` | status text and icons | ≥ 4.5:1 on bg and bg-subtle |
| `color.accent`, `focus`, `action` | marks, focus ring, primary button fill | ≥ 3:1 on bg and bg-subtle (WCAG 1.4.11) |
| `color.on-action`, `on-accent` | text on those fills | ≥ 4.5:1 on its fill |
| `color.border`, `border-strong` | hairlines (decorative) | not required; never the only boundary of a control |
| `color.brand`, `header-scrim` | logo colour; translucent header | — |

Themes may also override `text.*` roles: family, weight, tracking, stretch and line height. Harbor uses this to switch to a system serif and system sans, so it downloads no fonts at all.

## Make a new theme

1. Copy `tokens/themes/harbor.tokens.json` to `tokens/themes/<name>.tokens.json`.
2. Set `$extensions["com.larkmoor.theme"]` to `{ "name": "<name>", "scheme": "light" | "dark", "description": "…" }`. Add `"extends": "<other>"` to inherit from another theme.
3. Add palette colours to `tokens/foundation/color.tokens.json` if needed, then point the semantic roles at them with aliases like `"{palette.navy.900}"`.
4. Run `npm run build && npm run test:unit`. The contrast test names any pairing that fails.
5. Use it in a page: `<link rel="stylesheet" href="…/themes/<name>.css">` plus `data-lm-theme="<name>"` on `<html>`, or on any section to theme just that region.

## Dark themes

Design dark themes on their own; don't invert a light one. `evergreen-inverse` and `harbor-dark`:
- lift muted text (#95aa9e, #a9b6d6);
- switch accents to lighter tints (#7ee2b8, #f0a58d);
- turn the primary button light-on-dark.

Each dark theme passes the same contrast test independently. The docs page renders every component under each theme. Visual baselines cover Harbor dark at three widths.

A theme does not switch on `prefers-color-scheme` by itself. A site can opt in:

```css
@media (prefers-color-scheme: dark) { :root:not([data-lm-theme]) { /* copy the dark theme's declarations here, or set the attribute from script */ } }
```

Neither example opts in. Tauawo's brand is a white page by the owner's choice.

## Fonts

`fonts.css` self-hosts Geist and Martian Mono. Leave it out for themes that use system fonts.
Only the faces a page renders are downloaded.
