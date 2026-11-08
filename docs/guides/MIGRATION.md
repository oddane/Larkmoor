# Migration

## Moving an existing site onto the system (how Tauawo was migrated)

1. **Vendor or install the package.** Link `fonts.css`, `larkmoor.css` and any theme files.
2. **Replace hard-coded values with tokens.** Tauawo's old variables mapped one-to-one:

   | Old | New |
   |---|---|
   | `--ink` | `--lm-color-bg` |
   | `--ink-2` | `--lm-color-bg-subtle` |
   | `--ink-3` | `--lm-color-surface` |
   | `--paper` | `--lm-color-text` |
   | `--paper-2` | `--lm-color-text-secondary` |
   | `--muted` | `--lm-color-text-muted` |
   | `--line` / `--line-2` | `--lm-color-border` / `-strong` |
   | `--mint` | `--lm-color-accent` |
   | `--champagne` | `--lm-color-text-label` |
   | `--signal` | `--lm-color-brand` |
   | `--s-N` | `--lm-space-N` |
   | `--fs-h2` | `--lm-font-size-title` |
   | `.forest` | `data-lm-theme="evergreen-inverse"` |

3. **Swap shared components for system classes.**

   | Old class | New class |
   |---|---|
   | `.btn--paper` | `.lm-btn--primary` |
   | `.btn--line` | `.lm-btn--secondary` |
   | `.text-link` | `.lm-link` |
   | `.label` | `.lm-label` |
   | `.headline` | `.lm-title` |
   | `.segmented` | `.lm-segmented` |
   | `.faq details` | `.lm-accordion` |
   | `.composer` | `.lm-input-group` |
   | `.tag--*` | `.lm-badge--*` |
   | footer and header classes | `.lm-footer*`, `.lm-header*` |

4. **Replace page scripts with the behaviours.** Use `initMotionToggle`, `initDisclosureMenu`, `initHeader` and `initReveal`. The motion event became `lm:motionchange`.
5. **Keep what is product-specific in the product's own stylesheet.** For Tauawo that is `examples/tauawo/tauawo.css`: the cipher hero, phone frame, story, demos and roadmap.
6. **Compare before and after at several widths, then lock visual baselines.**

Result for Tauawo: the page's own CSS went from 547 inline lines to 284 product-specific lines (and the HTML file from 85 KB to 45 KB). Shared rules now live in the package.

## Upgrading between versions

Read CHANGELOG.md. Deprecated tokens keep working for one minor version and are marked `$deprecated` in the token files.
