# Network evidence: the example sites

**Checked:** 8 November 2026.

Larkmoor promises that a page built with it makes no third-party requests and sets no cookies. This report records what the two example sites actually do.

## What the pages request

**How it was recorded:** `tests/browser/network.test.mjs` loads each page in Chromium, scrolls through it and uses its demos. It records every request, the cookies and localStorage. The reports are in `docs/evidence/network-*.json`.

| Page | Requests | Off-site requests | Cookies | localStorage |
|---|---|---|---|---|
| Tauawo site | 16 | **0** | none | empty (only `tauawo:motion-paused` after someone presses Pause) |
| Harbor example | 5 | **0** | none | empty |

**Change made for this:** the earlier version of the site loaded fonts from Google Fonts. That sends every visitor's IP address to Google, which contradicts a "no trackers" message. The fonts are now self-hosted from the design-system package (SIL OFL 1.1), and the test fails if any request leaves the site's own origin.

Evidence about the Tauawo app itself (its code, permissions and metadata) is kept in the app's private repository, not here.
