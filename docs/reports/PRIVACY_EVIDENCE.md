# Privacy claims: implementation evidence

**Checked:** 8 November 2026.

**Evidence base:** the Tauawo app source at commit `754d5a985ca40614b10781443cad21d2cc226a31` (24 Oct 2026), read on the owner's computer, plus recorded network traffic from the website.

**What isn't here:** policy text doesn't count as evidence. Every row points to code, configuration, a permission list or recorded traffic.

> This file is for the private repository. It names files in the private app repository but contains no secrets. The Supabase project reference already appears in the app's client code by design (publishable key only), and is not repeated here.

## 1. Claims on the website and their evidence

| Claim on the site | Evidence | Where | Status |
|---|---|---|---|
| **No phone number:** sign up with a username and password | The app has no phone-number permission and no telephony or SMS-verification SDK in its dependencies. The account migration `0041_username_accounts.sql` exists. Earlier in this project the help articles were checked for username + password sign-up. | `package.json`, `supabase/migrations/0041_username_accounts.sql` | ✅ Supported by code. Not exercised on a device. |
| **Never asks for your contacts** | `READ_CONTACTS` is in Android's `blockedPermissions`, which strips it from the merged manifest even if a library requests it. There is no `expo-contacts` dependency (direct or transitive), and no use of the Contacts API in `src/`, `App.tsx` or `plugins/`. iOS `infoPlist` has no `NSContactsUsageDescription`. | `app.json` → `android.blockedPermissions`; lockfile search; source search | ✅ Strong |
| **No ads, trackers or analytics** | The lockfile was searched (including transitive packages) for analytics, ads and crash-reporting SDKs: analytics, sentry, firebase, amplitude, segment, mixpanel, posthog, bugsnag, crashlytics, datadog, appsflyer, adjust, branch, facebook, admob / google-mobile-ads, tracking-transparency, onesignal, braze, newrelic, logrocket. **Zero matches.** No `process.env` keys for such services are read in `src/`. | `package-lock.json` | ✅ Strong for bundled SDKs. Device network capture is not done yet (see §3). |
| **Messages are end-to-end encrypted.** Server sees ciphertext. | Crypto dependencies: `@noble/ciphers`, `@noble/curves`, `@noble/hashes`, `@noble/post-quantum`. The protocol code is `src/crypto/pqxdh.ts` (X25519 + ML-KEM-768) and `src/crypto/ratchet.ts` (Double Ratchet). | `package.json`, `src/crypto/` | ✅ Code present. ⚠️ Not independently audited; the site says so. |
| **Calls are encrypted** | WebRTC DTLS-SRTP, with signalling inside the chat's encrypted channel. TURN relay credentials come from Cloudflare Realtime through a server function. | `src/calls/manager.ts`, `supabase/functions/turn-credentials/index.ts` | ✅ See the metadata note in §2. |
| **Link previews don't leak to our servers** | Previews are fetched on the sender's phone and sent inside the encrypted message. Only https links are fetched. Raw IPs, local names and wildcard-DNS hosts are refused, and at most 512 KB is read. | `src/lib/linkPreview.ts` | ✅ |
| **Location only when you choose to share it** | iOS and Android background location are both disabled, and `ACCESS_BACKGROUND_LOCATION` is blocked. The permission text says the location is shared only in a chat. | `app.json` → `expo-location` plugin, `blockedPermissions` | ✅ |
| **Channels are public, not end-to-end encrypted** | Channel pushes include the channel name, which is consistent with channels not being E2EE. The site discloses this in three places. | `supabase/migrations/0042_communities_phase2.sql` (push for channel posts) | ✅ Disclosed |

## 2. Things the website doesn't claim, but you should know (metadata)

The site's "We do handle" list is honest. These details go slightly beyond it and are worth adding to the privacy policy:

- **Push notifications go through Expo's push service, then Apple or Google.**
  - Message pushes say only "New message", with no message text.
  - They do carry the chat ID and recipient ID in `data`. See `public.push_tone(... jsonb_build_object('chat', ..., 'to', ...))` in `0024_tones_and_privacy.sql` and `0042_communities_phase2.sql`.
  - So Expo, Apple and Google see that a notification was sent, when, and an opaque chat ID.
- **Calls that can't connect directly are relayed by Cloudflare TURN.** Cloudflare sees the IP addresses of both callers, but the media is still DTLS-SRTP encrypted.
- **"Directions" buttons open Google Maps or Apple Maps with the address.** This only happens when the person taps the button.
- **The in-app privacy and terms link (`LEGAL_URL`) points to a claude.ai artifact page.** Visiting it is subject to that host's own logging. Before launch, move it to your own domain.
- **App permissions in `app.json`:**
  - camera, microphone, photos and media;
  - fine and coarse location, while in use only;
  - Bluetooth (call audio);
  - `SYSTEM_ALERT_WINDOW` (call UI);
  - `READ_EXTERNAL_STORAGE` and `WRITE_EXTERNAL_STORAGE`.

  Before store review, check whether the legacy storage permissions are still needed on current Android versions. The media-specific permissions are already listed.

## 3. Observed network activity: the website

**How it was recorded:** `tests/browser/network.test.mjs` loads each page in Chromium, scrolls through it and uses its demos. It records every request, the cookies and localStorage. The reports are in `docs/evidence/network-*.json`.

| Page | Requests | Off-site requests | Cookies | localStorage |
|---|---|---|---|---|
| Tauawo site | 16 | **0** | none | empty (only `tauawo:motion-paused` after someone presses Pause) |
| Harbor example | 5 | **0** | none | empty |

**Change made for this:** the earlier version of the site loaded fonts from Google Fonts. That sends every visitor's IP address to Google, which contradicts a "no trackers" message. The fonts are now self-hosted from the design-system package (SIL OFL 1.1), and the test fails if any request leaves the site's own origin.

## 4. Observed network activity: the app (needs your device)

This could not be recorded here. Running the app needs a phone or simulator with your Expo dev build.

How to do it in about 20 minutes:
1. Install a proxy you control, such as mitmproxy, on your computer. Point your test phone's Wi-Fi proxy at it and install its certificate (test phone only).
2. Open Tauawo. Sign up, send a message, make a call, share a link and open a channel.
3. Export the host list.

**Expected hosts:**
- your Supabase project and its `.storage.supabase.co` endpoint;
- `exp.host` / Apple APNs / Google FCM (push);
- Cloudflare TURN (calls);
- websites only when you send a link (previews, from the sender's phone).

**Anything else is a finding.** Save the export as `reports/app-network.har` in the private app repository.
