import { Children, useState, type ReactNode } from 'react';
import { ScrollView, View, type ScrollViewProps, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLarkmoor, type SpaceKey } from './theme';

/**
 * A full screen: theme background, safe-area padding (notch, home indicator, status bar) and an
 * optional scroll view. Requires <SafeAreaProvider> from react-native-safe-area-context at the app root.
 */
export function Screen({ children, scroll = true, edges = ['top', 'bottom', 'left', 'right'], contentContainerStyle, ...rest }: ScrollViewProps & { scroll?: boolean; edges?: Array<'top' | 'bottom' | 'left' | 'right'> }) {
  const lm = useLarkmoor();
  const insets = useSafeAreaInsets();
  const pad: ViewStyle = {
    paddingTop: edges.includes('top') ? insets.top : 0, paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
    paddingLeft: edges.includes('left') ? insets.left : 0, paddingRight: edges.includes('right') ? insets.right : 0,
  };
  const bg = { flex: 1, backgroundColor: lm.colors.bg.rgba };
  if (!scroll) return <View style={[bg, pad]}>{children}</View>;
  return (
    <ScrollView style={bg} contentContainerStyle={[pad, contentContainerStyle]} keyboardShouldPersistTaps="handled" contentInsetAdjustmentBehavior="never" {...rest}>
      {children}
    </ScrollView>
  );
}

/** Centres content at the container width with the window-class gutter (16 / 24 / 32). */
export function Container({ style, ...rest }: ViewProps) {
  const lm = useLarkmoor();
  return <View style={[{ width: '100%', maxWidth: lm.tokens.layout.container, alignSelf: 'center', paddingHorizontal: lm.fluid(lm.tokens.layout.gutter) }, style]} {...rest} />;
}

/** Vertical rhythm between page sections (48 / 80 / 112 at compact / medium / expanded). */
export function Section({ style, ...rest }: ViewProps) {
  const lm = useLarkmoor();
  return <View style={[{ paddingVertical: lm.fluid(lm.tokens.layout.section) }, style]} {...rest} />;
}

/** Vertical flow with one gap. The parent owns the space; children never add margins. */
export function Stack({ gap = '4', style, ...rest }: ViewProps & { gap?: SpaceKey }) {
  const lm = useLarkmoor();
  return <View style={[{ gap: lm.tokens.space[gap] }, style]} {...rest} />;
}

/** A wrapping row, for actions and tags. */
export function Cluster({ gap = '3', align = 'center', style, ...rest }: ViewProps & { gap?: SpaceKey; align?: ViewStyle['alignItems'] }) {
  const lm = useLarkmoor();
  return <View style={[{ flexDirection: 'row', flexWrap: 'wrap', alignItems: align, gap: lm.tokens.space[gap] }, style]} {...rest} />;
}

/**
 * Equal columns that never get narrower than minItemWidth, like CSS auto-fill. Measures its own
 * width, so it adapts to where it's placed (a container query, in effect).
 */
export function Grid({ children, minItemWidth = 240, gap = '5', style, ...rest }: ViewProps & { minItemWidth?: number; gap?: SpaceKey; children?: ReactNode }) {
  const lm = useLarkmoor();
  const [w, setW] = useState(0);
  const g = lm.tokens.space[gap];
  const cols = w ? Math.max(1, Math.floor((w + g) / (minItemWidth + g))) : 1;
  const itemWidth = w ? (w - g * (cols - 1)) / cols : undefined;
  return (
    <View style={[{ flexDirection: 'row', flexWrap: 'wrap', gap: g }, style] as StyleProp<ViewStyle>} onLayout={(e) => setW(e.nativeEvent.layout.width)} {...rest}>
      {Children.map(children, (child) => <View style={{ width: itemWidth ?? '100%' }}>{child}</View>)}
    </View>
  );
}
