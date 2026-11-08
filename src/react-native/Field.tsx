import { useEffect, useState, type ComponentRef, type Ref } from 'react';
import { AccessibilityInfo, TextInput, View, type TextInputProps } from 'react-native';
import { useLarkmoor } from './theme';
import { Text } from './Text';

export interface FieldProps extends TextInputProps {
  label: string;
  hint?: string;
  /** Error message. Shown under the input, announced once, and given an icon as well as colour. */
  error?: string;
  optional?: boolean;
  /** Ref to the underlying TextInput, e.g. to focus the next field. */
  inputRef?: Ref<ComponentRef<typeof TextInput>>;
}

/** A labelled text input with hint and error. The label is always visible; placeholders are only examples. */
export function Field({ label, hint, error, optional, inputRef, style, onFocus, onBlur, ...rest }: FieldProps) {
  const lm = useLarkmoor();
  const [focused, setFocused] = useState(false);
  useEffect(() => { if (error) AccessibilityInfo.announceForAccessibility(error); }, [error]);
  const c = lm.colors;
  const borderColor = error ? c.danger.rgba : focused ? c.focus.rgba : c['border-strong'].rgba;
  return (
    <View style={{ gap: lm.tokens.space['2'] }}>
      <Text variant="caption" tone="default" style={{ fontWeight: '500' }} accessibilityElementsHidden importantForAccessibility="no">
        {label}{optional ? <Text variant="caption" tone="muted"> (optional)</Text> : null}
      </Text>
      {hint ? <Text variant="caption" accessibilityElementsHidden importantForAccessibility="no">{hint}</Text> : null}
      <TextInput
        ref={inputRef}
        accessibilityLabel={optional ? `${label}, optional` : label}
        accessibilityHint={[error, hint].filter(Boolean).join('. ') || undefined}
        placeholderTextColor={c['text-muted'].rgba}
        onFocus={(e) => { setFocused(true); onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); onBlur?.(e); }}
        style={[{
          minHeight: Math.max(lm.tokens.size.control, lm.target), paddingHorizontal: lm.tokens.space['4'], borderRadius: lm.tokens.radius.md,
          borderWidth: error || focused ? 2 : 1, borderColor, backgroundColor: c.surface.rgba, color: c.text.rgba, fontSize: 16,
        }, style]}
        {...rest}
      />
      {error ? (
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <Text variant="caption" style={{ color: c.danger.rgba, fontWeight: '700' }}>!</Text>
          <Text variant="caption" style={{ color: c.danger.rgba, flex: 1 }}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}
