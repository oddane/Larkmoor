import { type ReactNode } from 'react';
import { type TextStyle } from 'react-native';
import { type ThemeName, type LarkmoorTokens } from './tokens.generated';
export { themes, version } from './tokens.generated';
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
    /** Picks the compact / medium / expanded value of a fluid token for the current window. */
    fluid: (value: {
        compact: number;
        medium: number;
        expanded: number;
    }) => number;
    /** Full text style for a role: family, size, line height, tracking and case. */
    text: (role: TextRole) => TextStyle & {
        maxFontSizeMultiplier?: number;
    };
}
export declare function windowClassFor(width: number, t?: LarkmoorTokens): WindowClass;
/** Turns a token colour into a React Native colour string (hex, or rgba() when translucent). */
export declare const colorOf: (c: {
    rgba: string;
}) => string;
export declare function useReducedMotion(): boolean;
export interface LarkmoorProviderProps {
    /** Light theme. Default: "default" (Evergreen). */
    theme?: ThemeName;
    /** Theme used when the device is in dark mode and colorScheme is "auto". Default: "evergreen-dark". */
    darkTheme?: ThemeName;
    /** "auto" follows the device setting. */
    colorScheme?: 'auto' | 'light' | 'dark';
    /** Set to true once the fonts in larkmoorFonts are loaded (e.g. with expo-font). Otherwise system fonts are used. */
    customFonts?: boolean;
    children: ReactNode;
}
export declare function LarkmoorProvider({ theme, darkTheme, colorScheme, customFonts, children }: LarkmoorProviderProps): import("react").JSX.Element;
export declare function useLarkmoor(): Larkmoor;
/** Builds a React Native text style for a role. Exported for use outside components. */
export declare function textStyle(t: LarkmoorTokens, role: TextRole, windowClass?: WindowClass, customFonts?: boolean): TextStyle & {
    maxFontSizeMultiplier?: number;
};
