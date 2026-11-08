import { useEffect, type ReactNode } from 'react';
import { AccessibilityInfo, Pressable, View, type ViewProps } from 'react-native';
import { useLarkmoor } from './theme';
import { Text } from './Text';

/** A self-contained item. Pass onPress to make the whole card one button with one accessible name. */
export function Card({ children, onPress, accessibilityLabel, style, ...rest }: ViewProps & { onPress?: () => void; children?: ReactNode }) {
  const lm = useLarkmoor();
  const box = { gap: lm.tokens.space['3'], padding: lm.tokens.space['5'], borderRadius: lm.tokens.radius.lg, borderWidth: 1, borderColor: lm.colors.border.rgba, backgroundColor: lm.colors.surface.rgba };
  if (!onPress) return <View style={[box, style]} {...rest}>{children}</View>;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress}
      style={({ pressed }) => [box, pressed && { borderColor: lm.colors.accent.rgba }, style as object]}>{children}</Pressable>
  );
}

/** Groups a demo or summary on the quiet background. */
export function Panel({ style, ...rest }: ViewProps) {
  const lm = useLarkmoor();
  return <View style={[{ padding: lm.tokens.space['5'], borderRadius: lm.tokens.radius.xl, borderWidth: 1, borderColor: lm.colors.border.rgba, backgroundColor: lm.colors['bg-subtle'].rgba }, style]} {...rest} />;
}

/** A short status. The text carries the meaning; the dot is a second cue. */
export function Badge({ label, tone = 'muted' }: { label: string; tone?: 'muted' | 'success' | 'accent' | 'warning' | 'danger' }) {
  const lm = useLarkmoor();
  const key = { muted: 'text-muted', success: 'success', accent: 'accent-text', warning: 'warning', danger: 'danger' } as const;
  const color = lm.colors[key[tone]].rgba;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' }}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }} />
      <Text variant="label" style={{ color, textTransform: 'none', letterSpacing: 0.2 }}>{label}</Text>
    </View>
  );
}

/**
 * A message. Danger alerts are announced immediately; success and other alerts are announced politely.
 */
export function Alert({ title, children, tone = 'success' }: { title: string; children?: ReactNode; tone?: 'success' | 'warning' | 'danger' }) {
  const lm = useLarkmoor();
  useEffect(() => { AccessibilityInfo.announceForAccessibility(title); }, [title]);
  return (
    <View accessibilityRole={tone === 'danger' ? 'alert' : 'summary'} accessibilityLiveRegion={tone === 'danger' ? 'assertive' : 'polite'}
      style={{ gap: 4, padding: lm.tokens.space['4'], paddingLeft: lm.tokens.space['5'], borderRadius: lm.tokens.radius.md, borderWidth: 1, borderLeftWidth: 4, borderColor: lm.colors['border-strong'].rgba, borderLeftColor: lm.colors[tone].rgba, backgroundColor: lm.colors.surface.rgba }}>
      <Text variant="body" style={{ fontWeight: '600' }}>{title}</Text>
      {typeof children === 'string' ? <Text variant="caption" tone="secondary">{children}</Text> : children}
    </View>
  );
}

/** A term and detail per row, with hairlines. Stacks on compact windows. */
export function Rows({ rows }: { rows: Array<{ term: string; detail: string }> }) {
  const lm = useLarkmoor();
  const stacked = lm.windowClass === 'compact';
  return (
    <View style={{ borderTopWidth: 1, borderColor: lm.colors.border.rgba }}>
      {rows.map((r) => (
        <View key={r.term} accessible accessibilityLabel={`${r.term}: ${r.detail}`}
          style={{ flexDirection: stacked ? 'column' : 'row', gap: stacked ? 2 : lm.tokens.space['4'], paddingVertical: lm.tokens.space['3'], borderBottomWidth: 1, borderColor: lm.colors.border.rgba }}>
          <Text variant="caption" tone="default" style={{ fontWeight: '500', width: stacked ? undefined : 148 }}>{r.term}</Text>
          <Text variant="caption" style={{ flex: 1 }}>{r.detail}</Text>
        </View>
      ))}
    </View>
  );
}
