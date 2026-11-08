import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, View } from 'react-native';
import { useLarkmoor } from './theme';
import { Text } from './Text';

export interface SegmentedControlProps<T extends string> {
  /** Accessible name for the group, e.g. "Privacy profile". */
  label: string;
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
}

/** 2 to 5 options that switch a view immediately. A radio group to assistive technology. */
export function SegmentedControl<T extends string>({ label, options, value, onChange }: SegmentedControlProps<T>) {
  const lm = useLarkmoor();
  const [w, setW] = useState(0);
  const index = Math.max(0, options.findIndex((o) => o.value === value));
  const x = useRef(new Animated.Value(index)).current;
  useEffect(() => {
    if (lm.reduceMotion) { x.setValue(index); return; }
    Animated.timing(x, { toValue: index, duration: lm.tokens.motion.duration.slow, easing: Easing.bezier(...(lm.tokens.motion.easing.standard as unknown as [number, number, number, number])), useNativeDriver: true }).start();
  }, [index, lm.reduceMotion]);
  const pad = lm.tokens.space['1'];
  const segW = w ? (w - pad * 2) / options.length : 0;
  const c = lm.colors;
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} onLayout={(e) => setW(e.nativeEvent.layout.width)}
      style={{ flexDirection: 'row', padding: pad, borderRadius: lm.tokens.radius.pill, backgroundColor: c['control-track'].rgba, borderWidth: 1, borderColor: c.border.rgba }}>
      {segW > 0 && (
        <Animated.View pointerEvents="none" style={{ position: 'absolute', top: pad, bottom: pad, left: pad, width: segW, borderRadius: lm.tokens.radius.pill, backgroundColor: c.action.rgba, transform: [{ translateX: Animated.multiply(x, segW) }] }} />
      )}
      {options.map((o) => {
        const checked = o.value === value;
        return (
          <Pressable key={o.value} accessibilityRole="radio" accessibilityState={{ checked }} accessibilityLabel={o.label}
            onPress={() => onChange(o.value)} style={{ flex: 1, minHeight: lm.target - pad * 2, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 }}>
            <Text variant="caption" tone={checked ? 'onAction' : 'muted'} style={{ fontWeight: '500', textAlign: 'center' }} numberOfLines={1}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
