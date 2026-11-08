import { type ReactNode } from 'react';
import { type ScrollViewProps, type ViewProps, type ViewStyle } from 'react-native';
import { type SpaceKey } from './theme';
/**
 * A full screen: theme background, safe-area padding (notch, home indicator, status bar) and an
 * optional scroll view. Requires <SafeAreaProvider> from react-native-safe-area-context at the app root.
 */
export declare function Screen({ children, scroll, edges, contentContainerStyle, ...rest }: ScrollViewProps & {
    scroll?: boolean;
    edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
}): import("react").JSX.Element;
/** Centres content at the container width with the window-class gutter (16 / 24 / 32). */
export declare function Container({ style, ...rest }: ViewProps): import("react").JSX.Element;
/** Vertical rhythm between page sections (48 / 80 / 112 at compact / medium / expanded). */
export declare function Section({ style, ...rest }: ViewProps): import("react").JSX.Element;
/** Vertical flow with one gap. The parent owns the space; children never add margins. */
export declare function Stack({ gap, style, ...rest }: ViewProps & {
    gap?: SpaceKey;
}): import("react").JSX.Element;
/** A wrapping row, for actions and tags. */
export declare function Cluster({ gap, align, style, ...rest }: ViewProps & {
    gap?: SpaceKey;
    align?: ViewStyle['alignItems'];
}): import("react").JSX.Element;
/**
 * Equal columns that never get narrower than minItemWidth, like CSS auto-fill. Measures its own
 * width, so it adapts to where it's placed (a container query, in effect).
 */
export declare function Grid({ children, minItemWidth, gap, style, ...rest }: ViewProps & {
    minItemWidth?: number;
    gap?: SpaceKey;
    children?: ReactNode;
}): import("react").JSX.Element;
