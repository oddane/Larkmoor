import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { AccessibilityInfo, TextInput, View } from "react-native";
import { useLarkmoor } from "./theme";
import { Text } from "./Text";
function Field({ label, hint, error, optional, inputRef, style, onFocus, onBlur, ...rest }) {
  const lm = useLarkmoor();
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (error) AccessibilityInfo.announceForAccessibility(error);
  }, [error]);
  const c = lm.colors;
  const borderColor = error ? c.danger.rgba : focused ? c.focus.rgba : c["border-strong"].rgba;
  return /* @__PURE__ */ jsxs(View, { style: { gap: lm.tokens.space["2"] }, children: [
    /* @__PURE__ */ jsxs(Text, { variant: "caption", tone: "default", style: { fontWeight: "500" }, accessibilityElementsHidden: true, importantForAccessibility: "no", children: [
      label,
      optional ? /* @__PURE__ */ jsx(Text, { variant: "caption", tone: "muted", children: " (optional)" }) : null
    ] }),
    hint ? /* @__PURE__ */ jsx(Text, { variant: "caption", accessibilityElementsHidden: true, importantForAccessibility: "no", children: hint }) : null,
    /* @__PURE__ */ jsx(
      TextInput,
      {
        ref: inputRef,
        accessibilityLabel: optional ? `${label}, optional` : label,
        accessibilityHint: [error, hint].filter(Boolean).join(". ") || void 0,
        placeholderTextColor: c["text-muted"].rgba,
        onFocus: (e) => {
          setFocused(true);
          onFocus?.(e);
        },
        onBlur: (e) => {
          setFocused(false);
          onBlur?.(e);
        },
        style: [{
          minHeight: Math.max(lm.tokens.size.control, lm.target),
          paddingHorizontal: lm.tokens.space["4"],
          borderRadius: lm.tokens.radius.md,
          borderWidth: error || focused ? 2 : 1,
          borderColor,
          backgroundColor: c.surface.rgba,
          color: c.text.rgba,
          fontSize: 16
        }, style],
        ...rest
      }
    ),
    error ? /* @__PURE__ */ jsxs(View, { style: { flexDirection: "row", gap: 8, alignItems: "flex-start" }, accessibilityElementsHidden: true, importantForAccessibility: "no-hide-descendants", children: [
      /* @__PURE__ */ jsx(Text, { variant: "caption", style: { color: c.danger.rgba, fontWeight: "700" }, children: "!" }),
      /* @__PURE__ */ jsx(Text, { variant: "caption", style: { color: c.danger.rgba, flex: 1 }, children: error })
    ] }) : null
  ] });
}
export {
  Field
};
