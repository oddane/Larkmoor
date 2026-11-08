import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { LayoutAnimation, Pressable, View } from "react-native";
import { useLarkmoor } from "./theme";
import { Text } from "./Text";
function Accordion({ items, initiallyOpen = [] }) {
  const lm = useLarkmoor();
  const [open, setOpen] = useState(initiallyOpen);
  const toggle = (id) => {
    if (!lm.reduceMotion) LayoutAnimation.configureNext(LayoutAnimation.create(lm.tokens.motion.duration.base, "easeInEaseOut", "opacity"));
    setOpen((o) => o.includes(id) ? o.filter((x) => x !== id) : [...o, id]);
  };
  const line = { borderColor: lm.colors["border-strong"].rgba };
  return /* @__PURE__ */ jsx(View, { style: [{ borderTopWidth: 1 }, line], children: items.map((it) => {
    const expanded = open.includes(it.id);
    return /* @__PURE__ */ jsxs(View, { style: [{ borderBottomWidth: 1 }, line], children: [
      /* @__PURE__ */ jsxs(
        Pressable,
        {
          accessibilityRole: "button",
          accessibilityState: { expanded },
          onPress: () => toggle(it.id),
          style: { flexDirection: "row", alignItems: "flex-start", gap: lm.tokens.space["5"], minHeight: lm.target, paddingVertical: lm.tokens.space["4"] },
          children: [
            /* @__PURE__ */ jsx(Text, { variant: "body", style: { flex: 1, fontWeight: "500" }, children: it.title }),
            /* @__PURE__ */ jsx(Text, { variant: "body", tone: "muted", accessibilityElementsHidden: true, importantForAccessibility: "no", style: { transform: [{ rotate: expanded ? "45deg" : "0deg" }] }, children: "+" })
          ]
        }
      ),
      expanded ? /* @__PURE__ */ jsx(View, { style: { paddingBottom: lm.tokens.space["5"] }, children: typeof it.content === "string" ? /* @__PURE__ */ jsx(Text, { variant: "body", tone: "secondary", children: it.content }) : it.content }) : null
    ] }, it.id);
  }) });
}
export {
  Accordion
};
