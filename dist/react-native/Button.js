import { jsx, jsxs } from "react/jsx-runtime";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { useLarkmoor } from "./theme";
import { Text } from "./Text";
function Button({ label, variant = "primary", size = "default", loading = false, disabled, icon, block, style, onPress, ...rest }) {
  const lm = useLarkmoor();
  const c = lm.colors;
  const visualHeight = size === "small" ? lm.tokens.size.controlSm : Math.max(lm.tokens.size.control, lm.target);
  const slop = Math.max(0, Math.ceil((lm.target - visualHeight) / 2));
  const fill = variant === "primary" ? c.action.rgba : variant === "danger" ? c.danger.rgba : "transparent";
  const ink = variant === "primary" ? "onAction" : variant === "danger" ? "onAction" : variant === "secondary" ? "default" : "accent";
  const inactive = disabled || loading;
  return /* @__PURE__ */ jsx(
    Pressable,
    {
      accessibilityRole: "button",
      accessibilityLabel: label,
      accessibilityState: { disabled: !!disabled, busy: loading },
      hitSlop: slop,
      disabled: inactive,
      onPress,
      android_ripple: { color: c.border.rgba, borderless: false },
      style: ({ pressed }) => [
        styles.base,
        {
          minHeight: visualHeight,
          paddingHorizontal: size === "small" ? lm.tokens.space["4"] : lm.tokens.space["5"],
          borderRadius: lm.tokens.radius.pill,
          backgroundColor: fill,
          borderColor: variant === "secondary" ? c["border-strong"].rgba : "transparent",
          opacity: disabled ? 0.55 : 1,
          transform: [{ scale: pressed && !lm.reduceMotion ? 0.97 : 1 }],
          alignSelf: block ? "stretch" : "flex-start"
        },
        style
      ],
      ...rest,
      children: /* @__PURE__ */ jsxs(View, { style: styles.row, children: [
        loading ? /* @__PURE__ */ jsx(ActivityIndicator, { size: "small", color: variant === "primary" || variant === "danger" ? c["on-action"].rgba : c.text.rgba }) : icon,
        /* @__PURE__ */ jsx(Text, { variant: "body", tone: ink, style: styles.label, numberOfLines: 2, children: label })
      ] })
    }
  );
}
const styles = StyleSheet.create({
  base: { borderWidth: 1, justifyContent: "center", overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  label: { fontWeight: "500", textAlign: "center" }
});
export {
  Button
};
