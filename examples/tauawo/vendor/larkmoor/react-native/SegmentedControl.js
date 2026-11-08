import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, View } from "react-native";
import { useLarkmoor } from "./theme";
import { Text } from "./Text";
function SegmentedControl({ label, options, value, onChange }) {
  const lm = useLarkmoor();
  const [w, setW] = useState(0);
  const index = Math.max(0, options.findIndex((o) => o.value === value));
  const x = useRef(new Animated.Value(index)).current;
  useEffect(() => {
    if (lm.reduceMotion) {
      x.setValue(index);
      return;
    }
    Animated.timing(x, { toValue: index, duration: lm.tokens.motion.duration.slow, easing: Easing.bezier(...lm.tokens.motion.easing.standard), useNativeDriver: true }).start();
  }, [index, lm.reduceMotion]);
  const pad = lm.tokens.space["1"];
  const segW = w ? (w - pad * 2) / options.length : 0;
  const c = lm.colors;
  return /* @__PURE__ */ jsxs(
    View,
    {
      accessibilityRole: "radiogroup",
      accessibilityLabel: label,
      onLayout: (e) => setW(e.nativeEvent.layout.width),
      style: { flexDirection: "row", padding: pad, borderRadius: lm.tokens.radius.pill, backgroundColor: c["control-track"].rgba, borderWidth: 1, borderColor: c.border.rgba },
      children: [
        segW > 0 && /* @__PURE__ */ jsx(Animated.View, { pointerEvents: "none", style: { position: "absolute", top: pad, bottom: pad, left: pad, width: segW, borderRadius: lm.tokens.radius.pill, backgroundColor: c.action.rgba, transform: [{ translateX: Animated.multiply(x, segW) }] } }),
        options.map((o) => {
          const checked = o.value === value;
          return /* @__PURE__ */ jsx(
            Pressable,
            {
              accessibilityRole: "radio",
              accessibilityState: { checked },
              accessibilityLabel: o.label,
              onPress: () => onChange(o.value),
              style: { flex: 1, minHeight: lm.target - pad * 2, justifyContent: "center", alignItems: "center", paddingHorizontal: 4 },
              children: /* @__PURE__ */ jsx(Text, { variant: "caption", tone: checked ? "onAction" : "muted", style: { fontWeight: "500", textAlign: "center" }, numberOfLines: 1, children: o.label })
            },
            o.value
          );
        })
      ]
    }
  );
}
export {
  SegmentedControl
};
