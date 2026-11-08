import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { useLarkmoor } from './theme';
import { Text } from './Text';

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'default' | 'small';
  /** Shows a spinner, keeps the label, announces busy and ignores presses until done. */
  loading?: boolean;
  icon?: ReactNode;
  block?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * An action. Always at least the platform touch target (44pt iOS, 48dp Android): the small size
 * keeps its compact look and extends the touchable area with hitSlop instead.
 */
export function Button({ label, variant = 'primary', size = 'default', loading = false, disabled, icon, block, style, onPress, ...rest }: ButtonProps) {
  const lm = useLarkmoor();
  const c = lm.colors;
  const visualHeight = size === 'small' ? lm.tokens.size.controlSm : Math.max(lm.tokens.size.control, lm.target);
  const slop = Math.max(0, Math.ceil((lm.target - visualHeight) / 2));
  const fill = variant === 'primary' ? c.action.rgba : variant === 'danger' ? c.danger.rgba : 'transparent';
  const ink = variant === 'primary' ? 'onAction' : variant === 'danger' ? 'onAction' : variant === 'secondary' ? 'default' : 'accent';
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled, busy: loading }}
      hitSlop={slop}
      disabled={inactive}
      onPress={onPress}
      android_ripple={{ color: c.border.rgba, borderless: false }}
      style={({ pressed }) => [
        styles.base,
        {
          minHeight: visualHeight,
          paddingHorizontal: size === 'small' ? lm.tokens.space['4'] : lm.tokens.space['5'],
          borderRadius: lm.tokens.radius.pill,
          backgroundColor: fill,
          borderColor: variant === 'secondary' ? c['border-strong'].rgba : 'transparent',
          opacity: disabled ? 0.55 : 1,
          transform: [{ scale: pressed && !lm.reduceMotion ? 0.97 : 1 }],
          alignSelf: block ? 'stretch' : 'flex-start',
        },
        style,
      ]}
      {...rest}
    >
      <View style={styles.row}>
        {loading ? <ActivityIndicator size="small" color={variant === 'primary' || variant === 'danger' ? c['on-action'].rgba : c.text.rgba} /> : icon}
        <Text variant="body" tone={ink} style={styles.label} numberOfLines={2}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderWidth: 1, justifyContent: 'center', overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  label: { fontWeight: '500', textAlign: 'center' },
});
