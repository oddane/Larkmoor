# Security policy

## Supported versions

| Version | Supported |
|---|---|
| 0.1.x | ✅ |

## Reporting a problem

Please don't open a public issue.
Use **Security → Report a vulnerability** on this repository (a private advisory), or message the maintainer, @oddane.
Expect a reply within 7 days.

## Scope

Larkmoor ships CSS, a small amount of browser JavaScript and self-hosted fonts. It has no runtime dependencies and makes no network requests.
Relevant reports include:
- script injection through `initForm` messages;
- anything that would make a page load third-party resources;
- supply-chain issues in dev dependencies.
