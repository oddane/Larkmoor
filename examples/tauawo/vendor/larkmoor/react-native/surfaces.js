import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { AccessibilityInfo, Pressable, View } from "react-native";
import { useLarkmoor } from "./theme";
import { Text } from "./Text";
function Card({ children, onPress, accessibilityLabel, style, ...rest }) {
  const lm = useLarkmoor();
  const box = { gap: lm.tokens.space["3"], padding: lm.tokens.space["5"], borderRadius: lm.tokens.radius.lg, borderWidth: 1, borderColor: lm.colors.border.rgba, backgroundColor: lm.colors.surface.rgba };
  if (!onPress) return /* @__PURE__ */ jsx(View, { style: [box, style], ...rest, children });
  return /* @__PURE__ */ jsx(
    Pressable,
    {
      accessibilityRole: "button",
      accessibilityLabel,
      onPress,
      style: ({ pressed }) => [box, pressed && { borderColor: lm.colors.accent.rgba }, style],
      children
    }
  );
}
function Panel({ style, ...rest }) {
  const lm = useLarkmoor();
  return /* @__PURE__ */ jsx(View, { style: [{ padding: lm.tokens.space["5"], borderRadius: lm.tokens.radius.xl, borderWidth: 1, borderColor: lm.colors.border.rgba, backgroundColor: lm.colors["bg-subtle"].rgba }, style], ...rest });
}
function Badge({ label, tone = "muted" }) {
  const lm = useLarkmoor();
  const key = { muted: "text-muted", success: "success", accent: "accent-text", warning: "warning", danger: "danger" };
  const color = lm.colors[key[tone]].rgba;
  return /* @__PURE__ */ jsxs(View, { style: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start" }, children: [
    /* @__PURE__ */ jsx(View, { style: { width: 6, height: 6, borderRadius: 3, backgroundColor: color } }),
    /* @__PURE__ */ jsx(Text, { variant: "label", style: { color, textTransform: "none", letterSpacing: 0.2 }, children: label })
  ] });
}
function Alert({ title, children, tone = "success" }) {
  const lm = useLarkmoor();
  useEffect(() => {
    AccessibilityInfo.announceForAccessibility(title);
  }, [title]);
  return /* @__PURE__ */ jsxs(
    View,
    {
      accessibilityRole: tone === "danger" ? "alert" : "summary",
      accessibilityLiveRegion: tone === "danger" ? "assertive" : "polite",
      style: { gap: 4, padding: lm.tokens.space["4"], paddingLeft: lm.tokens.space["5"], borderRadius: lm.tokens.radius.md, borderWidth: 1, borderLeftWidth: 4, borderColor: lm.colors["border-strong"].rgba, borderLeftColor: lm.colors[tone].rgba, backgroundColor: lm.colors.surface.rgba },
      children: [
        /* @__PURE__ */ jsx(Text, { variant: "body", style: { fontWeight: "600" }, children: title }),
        typeof children === "string" ? /* @__PURE__ */ jsx(Text, { variant: "caption", tone: "secondary", children }) : children
      ]
    }
  );
}
function Rows({ rows }) {
  const lm = useLarkmoor();
  const stacked = lm.windowClass === "compact";
  return /* @__PURE__ */ jsx(View, { style: { borderTopWidth: 1, borderColor: lm.colors.border.rgba }, children: rows.map((r) => /* @__PURE__ */ jsxs(
    View,
    {
      accessible: true,
      accessibilityLabel: `${r.term}: ${r.detail}`,
      style: { flexDirection: stacked ? "column" : "row", gap: stacked ? 2 : lm.tokens.space["4"], paddingVertical: lm.tokens.space["3"], borderBottomWidth: 1, borderColor: lm.colors.border.rgba },
      children: [
        /* @__PURE__ */ jsx(Text, { variant: "caption", tone: "default", style: { fontWeight: "500", width: stacked ? void 0 : 148 }, children: r.term }),
        /* @__PURE__ */ jsx(Text, { variant: "caption", style: { flex: 1 }, children: r.detail })
      ]
    },
    r.term
  )) });
}
export {
  Alert,
  Badge,
  Card,
  Panel,
  Rows
};
