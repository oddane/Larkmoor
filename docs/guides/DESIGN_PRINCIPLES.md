# Design principles

1. **Quiet confidence over decoration.** One accent colour, generous white space and type doing the work. Decoration only where it explains something (the cipher field shows what servers see).
2. **Honest by construction.** No invented testimonials, numbers or certifications. Status words ("Not independently audited yet") are first-class UI, styled with the same care as features.
3. **Semantic first.** Components use roles (`--lm-color-text-muted`), never raw palette values, so a brand can change without touching component code.
4. **The parent owns the space.** Components own their padding; layouts own the gaps between children; sections own page rhythm. No component sets an outer margin.
5. **Native before custom.** `<details>`, radio groups, `<button>` and `<dialog>` first. Custom widgets follow the ARIA Authoring Practices pattern and get a keyboard test.
6. **Content decides breakpoints.** 520 / 760 / 900 / 1100px came from where real content broke, not from device names.
7. **Motion explains, never blocks.** Short, single-easing transitions. Reduced motion removes them, and anything that loops has a pause control.
8. **Private by default.** Self-hosted fonts, no third-party requests, no cookies. A test enforces it.
9. **Prove it.** A rule that matters gets a test: contrast, overflow, focus, network, layout shift.
