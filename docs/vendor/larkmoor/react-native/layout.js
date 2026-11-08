import { jsx } from "react/jsx-runtime";
import { Children, useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLarkmoor } from "./theme";
function Screen({ children, scroll = true, edges = ["top", "bottom", "left", "right"], contentContainerStyle, ...rest }) {
  const lm = useLarkmoor();
  const insets = useSafeAreaInsets();
  const pad = {
    paddingTop: edges.includes("top") ? insets.top : 0,
    paddingBottom: edges.includes("bottom") ? insets.bottom : 0,
    paddingLeft: edges.includes("left") ? insets.left : 0,
    paddingRight: edges.includes("right") ? insets.right : 0
  };
  const bg = { flex: 1, backgroundColor: lm.colors.bg.rgba };
  if (!scroll) return /* @__PURE__ */ jsx(View, { style: [bg, pad], children });
  return /* @__PURE__ */ jsx(ScrollView, { style: bg, contentContainerStyle: [pad, contentContainerStyle], keyboardShouldPersistTaps: "handled", contentInsetAdjustmentBehavior: "never", ...rest, children });
}
function Container({ style, ...rest }) {
  const lm = useLarkmoor();
  return /* @__PURE__ */ jsx(View, { style: [{ width: "100%", maxWidth: lm.tokens.layout.container, alignSelf: "center", paddingHorizontal: lm.fluid(lm.tokens.layout.gutter) }, style], ...rest });
}
function Section({ style, ...rest }) {
  const lm = useLarkmoor();
  return /* @__PURE__ */ jsx(View, { style: [{ paddingVertical: lm.fluid(lm.tokens.layout.section) }, style], ...rest });
}
function Stack({ gap = "4", style, ...rest }) {
  const lm = useLarkmoor();
  return /* @__PURE__ */ jsx(View, { style: [{ gap: lm.tokens.space[gap] }, style], ...rest });
}
function Cluster({ gap = "3", align = "center", style, ...rest }) {
  const lm = useLarkmoor();
  return /* @__PURE__ */ jsx(View, { style: [{ flexDirection: "row", flexWrap: "wrap", alignItems: align, gap: lm.tokens.space[gap] }, style], ...rest });
}
function Grid({ children, minItemWidth = 240, gap = "5", style, ...rest }) {
  const lm = useLarkmoor();
  const [w, setW] = useState(0);
  const g = lm.tokens.space[gap];
  const cols = w ? Math.max(1, Math.floor((w + g) / (minItemWidth + g))) : 1;
  const itemWidth = w ? (w - g * (cols - 1)) / cols : void 0;
  return /* @__PURE__ */ jsx(View, { style: [{ flexDirection: "row", flexWrap: "wrap", gap: g }, style], onLayout: (e) => setW(e.nativeEvent.layout.width), ...rest, children: Children.map(children, (child) => /* @__PURE__ */ jsx(View, { style: { width: itemWidth ?? "100%" }, children: child })) });
}
export {
  Cluster,
  Container,
  Grid,
  Screen,
  Section,
  Stack
};
