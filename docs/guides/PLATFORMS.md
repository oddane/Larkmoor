# Platforms: web, React Native, iOS and Android

Larkmoor has one source of truth: the DTCG token files in `tokens/`. `npm run build` turns them into:

| Platform | Output | What you get |
|---|---|---|
| Web | `dist/larkmoor.css`, `dist/themes/*.css`, `dist/larkmoor.js` | CSS custom properties, layout primitives, components, behaviours |
| React Native (Expo or bare) | `dist/react-native/` (`@larkmoor/design-system/react-native`) | `LarkmoorProvider`, hooks and accessible components, typed |
| iOS (SwiftUI) | `dist/ios/Larkmoor.swift` | Spacing, layout, radius, motion, colours, text styles, theme environment, `LarkmoorButtonStyle` |
| Android (Kotlin / Jetpack Compose) | `dist/android/LarkmoorTokens.kt`, `dist/android/LarkmoorTheme.kt` | Plain Kotlin tokens and a `LarkmoorTheme { }` that wraps Material 3 |
| Anything else | `dist/native/tokens.json` | The resolved, platform-neutral model the generators use |

## How web values become native values

| Web | Native | Why |
|---|---|---|
| `16px` | `16` (pt on iOS, dp on Android, layout units in React Native) | Density-independent units match CSS px |
| Fluid `clamp(30px, …, 60px)` | `{ compact: 30, medium: 45, expanded: 60 }` | Apps switch at window size classes, not continuously |
| Breakpoints 520 / 760 / 900 / 1100 | Window classes: medium ≥ 600, expanded ≥ 840, large ≥ 1200, xlarge ≥ 1600 | Android's window size classes; the web breakpoints stay content-driven |
| `letter-spacing: -0.045em` | Ratio × font size (React Native, Swift); `em` in Compose | Native APIs take absolute tracking, except Compose |
| `font-stretch`, `%`, `ch` | Dropped | No native equivalent; the semi-condensed font files carry the stretch |
| Font family stacks | Bundled font file per weight (`fonts/native/*.ttf`), or the system family (`Georgia`/`serif`, `System`/`sans-serif`) | Native apps can't fall back through a list |
| 24px web target floor, 44px preferred | 44pt iOS, 48dp Android | Apple's default control size and Android's touch target |

## React Native

Requires React 18+, React Native 0.76+ and `react-native-safe-area-context`. Type-checked in CI against React Native 0.88.1, the version Tauawo uses.

```tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { LarkmoorProvider, larkmoorFonts, Screen, Container, Stack, Text, Button, Field } from '@larkmoor/design-system/react-native';

export default function App() {
  const [fontsLoaded] = useFonts(larkmoorFonts);       // optional: system fonts are used until loaded
  return (
    <SafeAreaProvider>
      <LarkmoorProvider theme="default" darkTheme="evergreen-dark" customFonts={fontsLoaded}>
        <Screen>
          <Container>
            <Stack gap="5">
              <Text variant="display">Only the people in the chat can read it.</Text>
              <Field label="Username" autoCapitalize="none" autoComplete="username" />
              <Button label="Create account" onPress={create} />
            </Stack>
          </Container>
        </Screen>
      </LarkmoorProvider>
    </SafeAreaProvider>
  );
}
```

**What each part handles:**
- **Provider:** follows the system dark setting (`colorScheme="auto"` by default), the window size class, the platform touch target (44 or 48) and Reduce Motion.
- **`Text`:**
  - roles mirror the web: `display`, `title`, `heading`, `subheading`, `lead`, `body`, `caption`, `label`, `code`;
  - text scales with the user's font size, mapped to iOS Dynamic Type ramps;
  - large roles cap their growth (display ×1.3, title ×1.4) so titles don't break layouts, while body text is never capped;
  - display, title and heading are announced as headers.
- **`Button`:**
  - at least the platform target, with the small size extending its touch area through `hitSlop`;
  - exposes `disabled` and `busy` states;
  - has a press animation that respects Reduce Motion.
- **`Field`:** keeps a visible label; the hint and error are read with the input, and errors are announced once.
- **`SegmentedControl` and `Accordion`:**
  - `SegmentedControl` is a radio group with a checked state.
  - `Accordion` uses buttons that expose their expanded state.
  - Their animations respect Reduce Motion.
- **Layout and surfaces:**
  - `Screen` adds safe areas and `Container` the gutter for the window class.
  - `Stack` and `Cluster` handle spacing, and `Grid` sizes columns by its own width, in effect a container query.
  - Surfaces: `Card`, `Panel`, `Badge`, `Alert` and `Rows`. `Rows` stacks on compact windows.

## iOS (SwiftUI)

1. Add `dist/ios/Larkmoor.swift` to your target.
2. Add the `.ttf` files from `fonts/native` to the target and list them under `UIAppFonts` in Info.plist.

```swift
@Environment(\.colorScheme) var scheme
var body: some View {
  let theme = Larkmoor.themes[scheme == .dark ? "evergreen-dark" : "default"]!
  VStack(alignment: .leading, spacing: Larkmoor.Space.s5) {
    Text("Decide what people see.").larkmoorText(theme.title).foregroundStyle(theme.colors.text)
    Button("Join the beta") { join() }.buttonStyle(LarkmoorButtonStyle(.primary))
  }
  .padding(.horizontal, Larkmoor.Layout.gutter.value(for: width))
  .environment(\.larkmoor, theme)
}
```

Fonts use `Font.custom(_:size:relativeTo:)`, so they scale with Dynamic Type. Buttons have a minimum height of 44pt. The file compiles in CI (`swiftc -typecheck`, macOS runner).

## Android (Jetpack Compose)

1. Copy `dist/android/*.kt` into your app module (package `design.larkmoor`).
2. Copy the fonts from `fonts/native` into `res/font`, renamed to lowercase with underscores, as `LarkmoorTokens.FONT_FILES` lists.

```kotlin
setContent {
    LarkmoorTheme(lightTheme = "default", darkTheme = "evergreen-dark") {   // follows the system dark setting
        val lm = LocalLarkmoor.current
        Text("Decide what people see.", style = lm.textStyle("title"))
        Button(onClick = ::join) { Text("Join the beta") }                  // Material 3, Larkmoor colours, 48dp target
    }
}
```

Type sizes are in `sp`, so they follow the user's font size. CI compiles both files: the tokens with `kotlinc`, and the Compose theme against Compose Multiplatform's `androidx.compose` APIs.

## Web: mobile behaviour

**Layout:**
- **Safe areas:**
  - Add `viewport-fit=cover` to the viewport meta tag.
  - Containers, the skip link, footer, dialog footers, toasts and the tab bar then keep clear of notches and the home indicator.
- **Viewport height:** `100dvh` is used where the visible viewport matters.
- **Container queries:**
  - Add `.lm-cq` to any wrapper.
  - `.lm-columns`, `.lm-split` and `.lm-rows` inside it then respond to that wrapper's width.
  - Tables always do (`.lm-table--stack`).

**Mobile patterns:**
- **Touch screens:** compact controls grow to 44px (`@media (pointer: coarse)`); mouse users keep the compact look.
- **App-style patterns:** a bottom sheet (`.lm-dialog--sheet`) and a bottom tab bar (`.lm-tabbar`) for phone-sized web apps.

**Theming:**
- **Dark mode:** add `data-lm-color-scheme="auto"` to `<html>` to follow the device setting. Default switches to `evergreen-dark` and Harbor to `harbor-dark`.
- **Overrides:** all CSS is in cascade layers (`lm.base < lm.layout < lm.components < lm.utilities`), so a site's own unlayered CSS always wins.

## Not done yet

- **Rendering on real devices:**
  - The native components type-check and compile, but haven't been run on a phone or simulator here.
  - Before relying on them, render `Screen`, `Button`, `Field` and `SegmentedControl` once in the Tauawo app on iOS and Android.
- **Not built:**
  - an Increase Contrast / high-contrast theme;
  - SwiftUI and Compose versions of the other components (Field, Segmented, Accordion);
  - em-based web breakpoints.
