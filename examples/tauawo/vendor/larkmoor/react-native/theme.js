import { jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AccessibilityInfo, Platform, useColorScheme, useWindowDimensions } from "react-native";
import { themes } from "./tokens.generated";
import { themes as themes2, version } from "./tokens.generated";
function windowClassFor(width, t = themes.default) {
  return width >= t.window.expanded ? "expanded" : width >= t.window.medium ? "medium" : "compact";
}
const colorOf = (c) => c.rgba;
function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (alive) setReduce(v);
    });
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduce);
    return () => {
      alive = false;
      sub.remove();
    };
  }, []);
  return reduce;
}
const Ctx = createContext(null);
function LarkmoorProvider({ theme = "default", darkTheme = "evergreen-dark", colorScheme = "auto", customFonts = false, children }) {
  const system = useColorScheme();
  const { width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const dark = colorScheme === "dark" || colorScheme === "auto" && system === "dark";
  const name = dark ? darkTheme : theme;
  const value = useMemo(() => {
    const tokens = themes[name];
    const windowClass = windowClassFor(width, tokens);
    const fluid = (v) => v[windowClass];
    const text = (role) => textStyle(tokens, role, windowClass, customFonts);
    return {
      name,
      tokens,
      colors: tokens.colors,
      isDark: tokens.scheme === "dark",
      windowClass,
      width,
      target: Platform.OS === "android" ? tokens.size.targetAndroid : tokens.size.target,
      customFonts,
      reduceMotion,
      fluid,
      text
    };
  }, [name, width, customFonts, reduceMotion]);
  return /* @__PURE__ */ jsx(Ctx.Provider, { value, children });
}
function useLarkmoor() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLarkmoor() needs a <LarkmoorProvider> above it.");
  return v;
}
function textStyle(t, role, windowClass = "compact", customFonts = false) {
  const r = t.type[role];
  const size = r.size[windowClass];
  const fam = t.families[r.family];
  const file = customFonts && fam.files ? fam.files[String(r.weight)] ?? Object.values(fam.files)[0] : void 0;
  const base = {
    fontSize: size,
    lineHeight: Math.round(size * r.lineHeight),
    letterSpacing: +(r.tracking * size).toFixed(2),
    textTransform: r.uppercase ? "uppercase" : "none",
    ...r.maxFontScale != null ? { maxFontSizeMultiplier: r.maxFontScale } : {}
  };
  if (file) return { ...base, fontFamily: file };
  const sys = fam.system ?? { ios: "System", android: "sans-serif" };
  const familyName = Platform.OS === "ios" ? sys.ios : sys.android;
  return { ...base, ...familyName !== "System" ? { fontFamily: familyName } : {}, fontWeight: String(r.weight) };
}
export {
  LarkmoorProvider,
  colorOf,
  textStyle,
  themes2 as themes,
  useLarkmoor,
  useReducedMotion,
  version,
  windowClassFor
};
