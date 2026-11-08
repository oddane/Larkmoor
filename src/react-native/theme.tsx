// Larkmoor for React Native: theme provider, hooks and font helpers.
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Platform, useColorScheme, useWindowDimensions, type TextStyle } from 'react-native';
import { themes, highContrast as contrastPartners, type ThemeName, type LarkmoorTokens } from './tokens.generated';

export { themes, version, highContrast } from './tokens.generated';
export type { ThemeName, LarkmoorTokens } from './tokens.generated';

export type WindowClass = 'compact' | 'medium' | 'expanded';
export type TextRole = keyof LarkmoorTokens['type'];
export type SpaceKey = keyof LarkmoorTokens['space'];

export interface Larkmoor {
  /** Name of the active theme, after automatic dark mode. */
  name: ThemeName;
  tokens: LarkmoorTokens;
  colors: LarkmoorTokens['colors'];
  isDark: boolean;
  /** Material window size class for the current window width. */
  windowClass: WindowClass;
  width: number;
  /** Minimum touch target for this platform: 44pt on iOS, 48dp on Android. */
  target: number;
  /** Whether the bundled Larkmoor font files are loaded (see larkmoorFonts). */
  customFonts: boolean;
  reduceMotion: boolean;
  /** Whether the high-contrast partner theme is active (iOS Increase Contrast, Android high-contrast text, or contrast="more"). */
  highContrast: boolean;
  /** Picks the compact / medium / expanded value of a fluid token for the current window. */
  fluid: (value: { compact: number; medium: number; expanded: number }) => number;
  /** Full text style for a role: family, size, line height, tracking and case. */
  text: (role: TextRole) => TextStyle & { maxFontSizeMultiplier?: number };
}

export function windowClassFor(width: number, t: LarkmoorTokens = themes.default): WindowClass {
  return width >= t.window.expanded ? 'expanded' : width >= t.window.medium ? 'medium' : 'compact';
}

/** Turns a token colour into a React Native colour string (hex, or rgba() when translucent). */
export const colorOf = (c: { rgba: string }) => c.rgba;

export function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => { if (alive) setReduce(v); });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduce);
    return () => { alive = false; sub.remove(); };
  }, []);
  return reduce;
}

type ContrastApi = {
  isHighTextContrastEnabled?: () => Promise<boolean>;
  addEventListener: (event: string, handler: (value: boolean) => void) => { remove: () => void };
};

/**
 * True when the device asks for more contrast: iOS Settings → Accessibility → Display & Text Size → Increase Contrast,
 * or Android's High contrast text (where React Native reports it).
 */
export function useHighContrast(): boolean {
  const [more, setMore] = useState(false);
  useEffect(() => {
    let alive = true;
    const api = AccessibilityInfo as unknown as ContrastApi;
    const set = (v: boolean) => { if (alive) setMore(v); };
    let sub: { remove: () => void } | undefined;
    if (Platform.OS === 'ios') {
      AccessibilityInfo.isDarkerSystemColorsEnabled().then(set).catch(() => {});
      sub = api.addEventListener('darkerSystemColorsChanged', set);
    } else if (Platform.OS === 'android' && api.isHighTextContrastEnabled) {
      api.isHighTextContrastEnabled().then(set).catch(() => {});
      try { sub = api.addEventListener('highTextContrastChanged', set); } catch { /* older React Native: read once */ }
    }
    return () => { alive = false; sub?.remove(); };
  }, []);
  return more;
}

const Ctx = createContext<Larkmoor | null>(null);

export interface LarkmoorProviderProps {
  /** Light theme. Default: "default" (Evergreen). */
  theme?: ThemeName;
  /** Theme used when the device is in dark mode and colorScheme is "auto". Default: "evergreen-dark". */
  darkTheme?: ThemeName;
  /** "auto" follows the device setting. */
  colorScheme?: 'auto' | 'light' | 'dark';
  /** "auto" switches to the theme's high-contrast partner when the device asks for more contrast. Default: "auto". */
  contrast?: 'auto' | 'standard' | 'more';
  /** Set to true once the fonts in larkmoorFonts are loaded (e.g. with expo-font). Otherwise system fonts are used. */
  customFonts?: boolean;
  children: ReactNode;
}

export function LarkmoorProvider({ theme = 'default', darkTheme = 'evergreen-dark', colorScheme = 'auto', contrast = 'auto', customFonts = false, children }: LarkmoorProviderProps) {
  const system = useColorScheme();
  const { width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const deviceMore = useHighContrast();
  const dark = colorScheme === 'dark' || (colorScheme === 'auto' && system === 'dark');
  const base = (dark ? darkTheme : theme) as ThemeName;
  const more = contrast === 'more' || (contrast === 'auto' && deviceMore);
  const name = (more ? contrastPartners[base] ?? base : base) as ThemeName;
  const highContrast = name !== base;
  const value = useMemo<Larkmoor>(() => {
    const tokens = themes[name] as LarkmoorTokens;
    const windowClass = windowClassFor(width, tokens);
    const fluid = (v: { compact: number; medium: number; expanded: number }) => v[windowClass];
    const text = (role: TextRole) => textStyle(tokens, role, windowClass, customFonts);
    return {
      name, tokens, colors: tokens.colors, isDark: tokens.scheme === 'dark', windowClass, width,
      target: Platform.OS === 'android' ? tokens.size.targetAndroid : tokens.size.target,
      customFonts, reduceMotion, highContrast, fluid, text,
    };
  }, [name, width, customFonts, reduceMotion, highContrast]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLarkmoor(): Larkmoor {
  const v = useContext(Ctx);
  if (!v) throw new Error('useLarkmoor() needs a <LarkmoorProvider> above it.');
  return v;
}

/** Builds a React Native text style for a role. Exported for use outside components. */
export function textStyle(t: LarkmoorTokens, role: TextRole, windowClass: WindowClass = 'compact', customFonts = false): TextStyle & { maxFontSizeMultiplier?: number } {
  const r = t.type[role];
  const size = r.size[windowClass];
  const fam = t.families[r.family as keyof typeof t.families] as { files?: Record<string, string>; system?: { ios: string; android: string } };
  const file = customFonts && fam.files ? fam.files[String(r.weight)] ?? Object.values(fam.files)[0] : undefined;
  const base = {
    fontSize: size,
    lineHeight: Math.round(size * r.lineHeight),
    letterSpacing: +(r.tracking * size).toFixed(2),
    textTransform: (r.uppercase ? 'uppercase' : 'none') as TextStyle['textTransform'],
    ...(r.maxFontScale != null ? { maxFontSizeMultiplier: r.maxFontScale } : {}),
  };
  // A bundled file carries its own weight; setting fontWeight as well makes Android fall back to the system font.
  if (file) return { ...base, fontFamily: file };
  const sys = fam.system ?? { ios: 'System', android: 'sans-serif' };
  const familyName = Platform.OS === 'ios' ? sys.ios : sys.android;
  return { ...base, ...(familyName !== 'System' ? { fontFamily: familyName } : {}), fontWeight: String(r.weight) as TextStyle['fontWeight'] };
}
