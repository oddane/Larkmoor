import { jsx } from "react/jsx-runtime";
import { Text as RNText } from "react-native";
import { useLarkmoor } from "./theme";
const ramp = { display: "largeTitle", title: "title1", heading: "title3", subheading: "headline", lead: "body", body: "body", caption: "footnote", label: "caption2", code: "footnote" };
const toneKey = { default: "text", secondary: "text-secondary", muted: "text-muted", label: "text-label", accent: "accent-text", success: "success", warning: "warning", danger: "danger", onAction: "on-action" };
function Text({ variant = "body", tone, heading, style, ...rest }) {
  const lm = useLarkmoor();
  const { maxFontSizeMultiplier, ...s } = lm.text(variant);
  const defaultTone = variant === "lead" ? "secondary" : variant === "caption" || variant === "label" ? "muted" : "default";
  const color = lm.colors[toneKey[tone ?? defaultTone]].rgba;
  const isHeading = heading ?? (variant === "display" || variant === "title" || variant === "heading");
  return /* @__PURE__ */ jsx(
    RNText,
    {
      accessibilityRole: isHeading ? "header" : rest.accessibilityRole,
      maxFontSizeMultiplier: rest.maxFontSizeMultiplier ?? maxFontSizeMultiplier,
      dynamicTypeRamp: rest.dynamicTypeRamp ?? ramp[variant],
      style: [s, { color }, style],
      ...rest
    }
  );
}
export {
  Text
};
