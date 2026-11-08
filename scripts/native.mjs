// Native outputs: one resolved, platform-neutral token model, then React Native (TypeScript),
// SwiftUI and Kotlin/Jetpack Compose files generated from it. Called by scripts/build.mjs.
//
// Transforms (documented in docs/guides/PLATFORMS.md):
// - px dimensions become unit-less numbers (dp on Android, pt on iOS, layout units in React Native)
// - fluid web values (com.larkmoor.fluid) become { compact, medium, expanded } for native window classes
// - em letter-spacing becomes a ratio of the font size; CSS-only values (%, ch, font-stretch) are dropped
// - font families map to bundled font files per weight, or to the platform's system families

const num = (d) => (typeof d === 'object' && d && 'value' in d ? d.value : Number(d));

function fluid(token) {
  const f = token.extensions?.['com.larkmoor.fluid'];
  if (!f) { const v = num(token.value); return { compact: v, medium: v, expanded: v }; }
  const min = num(f.min); const max = num(f.max);
  return { compact: min, medium: Math.round((min + max) / 2), expanded: max };
}

function color(token) {
  const c = token.value;
  const [r, g, b] = c.components.map((v) => Math.round(v * 255));
  const hex = '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
  return c.alpha !== undefined && c.alpha < 1 ? { hex, alpha: c.alpha, rgba: `rgba(${r}, ${g}, ${b}, ${c.alpha})` } : { hex, alpha: 1, rgba: hex };
}

const emOf = (token) => {
  const css = token.extensions?.['com.larkmoor.css'];
  return css && css.endsWith('em') ? parseFloat(css) : 0;
};

/** Platform-neutral model for one theme's full token map. */
export function nativeModel(tokens, rawSemantic, resolveToken) {
  const get = (p) => resolveToken(tokens, p);
  const pick = (prefix) => [...tokens.keys()].filter((p) => p.startsWith(prefix + '.'));

  const colors = Object.fromEntries(pick('color').map((p) => [p.slice(6), color(get(p))]));

  const space = Object.fromEntries(pick('space').filter((p) => /^space\.\d$/.test(p)).map((p) => [p.split('.')[1], num(get(p).value)]));
  const layout = {
    section: fluid(get('space.section')), headGap: fluid(get('space.head-gap')), gutter: fluid(get('space.gutter')),
    container: num(get('size.container').value), containerNarrow: num(get('size.container-narrow').value), containerWide: num(get('size.container-wide').value),
  };
  const size = {
    target: num(get('size.target').value), targetAndroid: num(get('size.target-android').value), targetMin: num(get('size.target-min').value),
    control: num(get('size.control').value), controlSm: num(get('size.control-sm').value), header: num(get('size.header').value),
  };
  const radius = Object.fromEntries(pick('radius').map((p) => [p.split('.')[1], num(get(p).value)]));
  const border = { width: num(get('border.width').value), focus: num(get('border.focus').value) };
  const window = { medium: num(get('window.medium').value), expanded: num(get('window.expanded').value), large: num(get('window.large').value), xlarge: num(get('window.xlarge').value) };
  const motion = {
    duration: Object.fromEntries(pick('motion.duration').map((p) => [p.split('.')[2], num(get(p).value)])),
    easing: Object.fromEntries(pick('motion.easing').map((p) => [p.split('.')[2], get(p).value])),
  };
  const elevation = Object.fromEntries(pick('elevation').map((p) => {
    const s = get(p).value; const c = color({ value: s.color });
    return [p.split('.')[1], { color: c.hex, opacity: c.alpha, offsetY: num(s.offsetY), blur: num(s.blur), spread: num(s.spread), androidElevation: Math.round(num(s.blur) / 6) }];
  }));

  const families = {};
  const type = {};
  for (const role of ['display', 'title', 'heading', 'subheading', 'body', 'label', 'code']) {
    const famAlias = tokens.get(`text.${role}.family`).value.slice(1, -1); // e.g. font.family.display
    const famKey = famAlias.split('.').pop();
    const famToken = tokens.get(famAlias);
    const nat = famToken.extensions?.['com.larkmoor.native'] ?? {};
    families[famKey] = nat.weights ? { files: nat.weights } : { system: nat.system ?? { ios: 'System', android: 'sans-serif' } };
    const sizeToken = get(`text.${role}.size`);
    const weight = Number(get(`text.${role}.weight`).value);
    type[role] = {
      family: famKey,
      weight,
      size: fluid(sizeToken),
      lineHeight: Number(get(`text.${role}.line-height`).value),
      tracking: tokens.has(`text.${role}.tracking`) ? emOf(get(`text.${role}.tracking`)) : 0,
      maxFontScale: rawSemantic.text?.[role]?.$extensions?.['com.larkmoor.native']?.maxFontScale ?? null,
      uppercase: role === 'label',
    };
  }
  // lead and caption are sizes over the body family
  type.lead = { ...type.body, size: fluid(get('font.size.lead')) };
  type.caption = { ...type.body, size: fluid(get('font.size.caption')), lineHeight: 1.55 };

  return { colors, space, layout, size, radius, border, window, motion, elevation, families, type };
}

// ---------------- React Native (TypeScript) ----------------

export function reactNativeTokens(version, themes) {
  return `// Generated by scripts/native.mjs from the DTCG tokens. Do not edit.
/* eslint-disable */
export const version = ${JSON.stringify(version)};
export const themes = ${JSON.stringify(themes, null, 2)} as const;
export type ThemeName = keyof typeof themes;
export type LarkmoorTokens = (typeof themes)[ThemeName];
`;
}

/** Type declarations for the generated tokens, written by the build so they never drift from the values. */
export function reactNativeTokensDts(version, themes) {
  return `// Generated by scripts/native.mjs. Do not edit.
export declare const version: ${JSON.stringify(version)};
export declare const themes: ${JSON.stringify(themes)};
export type ThemeName = keyof typeof themes;
export type LarkmoorTokens = (typeof themes)[ThemeName];
`;
}

// ---------------- SwiftUI ----------------

const swiftName = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase()).replace(/^(\d)/, 's$1');
const swiftColor = (c) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(c.hex.slice(i, i + 2), 16) / 255);
  return `Color(.sRGB, red: ${r.toFixed(4)}, green: ${g.toFixed(4)}, blue: ${b.toFixed(4)}, opacity: ${c.alpha})`;
};

export function swift(version, themes) {
  const names = Object.keys(themes);
  const first = themes[names[0]];
  const colorKeys = Object.keys(first.colors);
  const t = first;
  const roleFont = (theme, role) => {
    const r = theme.type[role]; const fam = theme.families[r.family];
    const file = fam.files ? (fam.files[r.weight] ?? Object.values(fam.files)[0]) : null;
    const rel = { display: '.largeTitle', title: '.title', heading: '.title3', subheading: '.headline', body: '.body', lead: '.body', caption: '.footnote', label: '.caption2', code: '.footnote' }[role];
    return file
      ? `.custom("${file}", size: ${r.size.compact}, relativeTo: ${rel})`
      : `.system(size: ${r.size.compact}, weight: ${swiftWeight(r.weight)}${fam.system?.ios === 'Georgia' ? ', design: .serif' : ''})`;
  };
  return `// Generated by scripts/native.mjs from the DTCG tokens. Do not edit.
// Larkmoor ${version} for SwiftUI (iOS 16+, macOS 13+).
// Fonts: add the files in fonts/native to your app target and list them under UIAppFonts in Info.plist.
import SwiftUI

public enum Larkmoor {
  public static let version = "${version}"

  public enum Space {
${Object.entries(t.space).map(([k, v]) => `    public static let s${k}: CGFloat = ${v}`).join('\n')}
  }

  /// Values that change with the window size class (compact < ${t.window.medium}pt ≤ medium < ${t.window.expanded}pt ≤ expanded).
  public struct Fluid { public let compact: CGFloat; public let medium: CGFloat; public let expanded: CGFloat
    public func value(for width: CGFloat) -> CGFloat { width >= ${t.window.expanded} ? expanded : width >= ${t.window.medium} ? medium : compact }
  }
  public enum Layout {
${['section', 'headGap', 'gutter'].map((k) => `    public static let ${k} = Fluid(compact: ${t.layout[k].compact}, medium: ${t.layout[k].medium}, expanded: ${t.layout[k].expanded})`).join('\n')}
    public static let container: CGFloat = ${t.layout.container}
  }

  public enum Size {
    /// Apple's minimum hit target is 44×44pt.
    public static let target: CGFloat = ${t.size.target}
    public static let control: CGFloat = ${t.size.control}
    public static let controlSmall: CGFloat = ${t.size.controlSm}
  }

  public enum Radius {
${Object.entries(t.radius).map(([k, v]) => `    public static let ${swiftName(k)}: CGFloat = ${v}`).join('\n')}
  }

  public enum Motion {
${Object.entries(t.motion.duration).map(([k, v]) => `    public static let ${k}: Double = ${v / 1000}`).join('\n')}
    public static let standard = Animation.timingCurve(${t.motion.easing.standard.join(', ')}, duration: ${t.motion.duration.base / 1000})
  }

  public struct Colors {
${colorKeys.map((k) => `    public let ${swiftName(k)}: Color`).join('\n')}
  }

  public struct TextStyle { public let font: Font; public let lineSpacing: CGFloat; public let tracking: CGFloat; public let uppercase: Bool }

  public struct Theme {
    public let name: String
    public let colorScheme: ColorScheme
    public let colors: Colors
    public let display, title, heading, subheading, lead, body, caption, label, code: TextStyle
  }

  public static let themes: [String: Theme] = [
${names.map((n) => {
  const th = themes[n];
  const style = (role) => { const r = th.type[role]; return `TextStyle(font: ${roleFont(th, role)}, lineSpacing: ${((r.lineHeight - 1) * r.size.compact).toFixed(1)}, tracking: ${(r.tracking * r.size.compact).toFixed(2)}, uppercase: ${r.uppercase})`; };
  return `    "${n}": Theme(
      name: "${n}", colorScheme: .${th.scheme},
      colors: Colors(${colorKeys.map((k) => `${swiftName(k)}: ${swiftColor(th.colors[k])}`).join(', ')}),
      display: ${style('display')},
      title: ${style('title')},
      heading: ${style('heading')},
      subheading: ${style('subheading')},
      lead: ${style('lead')},
      body: ${style('body')},
      caption: ${style('caption')},
      label: ${style('label')},
      code: ${style('code')})`;
}).join(',\n')}
  ]
}

private struct LarkmoorThemeKey: EnvironmentKey { static let defaultValue: Larkmoor.Theme = Larkmoor.themes["default"]! }
public extension EnvironmentValues {
  var larkmoor: Larkmoor.Theme { get { self[LarkmoorThemeKey.self] } set { self[LarkmoorThemeKey.self] = newValue } }
}

public extension View {
  /// Applies a Larkmoor text role: font (scales with Dynamic Type), line spacing, tracking and case.
  func larkmoorText(_ style: Larkmoor.TextStyle) -> some View {
    self.font(style.font).lineSpacing(style.lineSpacing).tracking(style.tracking).textCase(style.uppercase ? .uppercase : nil)
  }
}

/// Primary, secondary and danger buttons with a 44pt minimum hit target and a pressed state.
public struct LarkmoorButtonStyle: ButtonStyle {
  public enum Variant { case primary, secondary, danger }
  let variant: Variant
  @Environment(\\.larkmoor) private var theme
  @Environment(\\.isEnabled) private var isEnabled
  public init(_ variant: Variant = .primary) { self.variant = variant }
  public func makeBody(configuration: Configuration) -> some View {
    let c = theme.colors
    let fill: Color = variant == .primary ? c.action : variant == .danger ? c.danger : .clear
    let ink: Color = variant == .primary ? c.onAction : variant == .danger ? .white : c.text
    return configuration.label
      .font(theme.body.font.weight(.medium))
      .padding(.horizontal, Larkmoor.Space.s5)
      .frame(minHeight: Larkmoor.Size.target)
      .background(Capsule().fill(fill))
      .overlay(Capsule().strokeBorder(variant == .secondary ? c.borderStrong : .clear, lineWidth: 1))
      .foregroundStyle(ink)
      .opacity(isEnabled ? 1 : 0.55)
      .scaleEffect(configuration.isPressed ? 0.97 : 1)
      .animation(Larkmoor.Motion.standard, value: configuration.isPressed)
      .contentShape(Capsule())
  }
}
`;
}
function swiftWeight(w) { return { 300: '.light', 400: '.regular', 500: '.medium', 600: '.semibold', 700: '.bold' }[w] ?? '.regular'; }

// ---------------- Kotlin (plain) + Jetpack Compose ----------------

const ktName = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const argb = (c) => '0x' + Math.round(c.alpha * 255).toString(16).padStart(2, '0').toUpperCase() + c.hex.slice(1).toUpperCase();

export function kotlinCore(version, themes) {
  const names = Object.keys(themes); const t = themes[names[0]];
  const colorKeys = Object.keys(t.colors);
  const constName = (n) => n.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  return `// Generated by scripts/native.mjs from the DTCG tokens. Do not edit.
// Larkmoor ${version}: plain Kotlin values with no Android dependency. Units: dp for sizes, sp for type, ms for motion.
package design.larkmoor

data class Fluid(val compact: Float, val medium: Float, val expanded: Float) {
    /** Picks the value for a window width in dp (Material window size classes). */
    fun forWidth(widthDp: Float): Float = when {
        widthDp >= LarkmoorTokens.WINDOW_EXPANDED -> expanded
        widthDp >= LarkmoorTokens.WINDOW_MEDIUM -> medium
        else -> compact
    }
}

data class TextRole(val family: String, val weight: Int, val size: Fluid, val lineHeight: Float, val trackingEm: Float, val uppercase: Boolean, val maxFontScale: Float?)

data class LarkmoorColors(
${colorKeys.map((k) => `    val ${ktName(k)}: Long`).join(',\n')}
)

data class LarkmoorThemeTokens(val name: String, val isDark: Boolean, val colors: LarkmoorColors, val type: Map<String, TextRole>)

object LarkmoorTokens {
    const val VERSION = "${version}"
    const val WINDOW_MEDIUM = ${t.window.medium}f
    const val WINDOW_EXPANDED = ${t.window.expanded}f
${Object.entries(t.space).map(([k, v]) => `    const val SPACE_${k} = ${v}f`).join('\n')}
${Object.entries(t.radius).map(([k, v]) => `    const val RADIUS_${k.toUpperCase()} = ${v}f`).join('\n')}
    /** Android's minimum touch target is 48dp. */
    const val TARGET = ${t.size.targetAndroid}f
    const val CONTROL = ${t.size.control}f
    const val CONTAINER = ${t.layout.container}f
${Object.entries(t.motion.duration).map(([k, v]) => `    const val DURATION_${k.toUpperCase()} = ${v}`).join('\n')}
    val EASING_STANDARD = floatArrayOf(${t.motion.easing.standard.map((v) => v + 'f').join(', ')})
${['section', 'headGap', 'gutter'].map((k) => `    val ${k.toUpperCase().replace('HEADGAP', 'HEAD_GAP')} = Fluid(${t.layout[k].compact}f, ${t.layout[k].medium}f, ${t.layout[k].expanded}f)`).join('\n')}
    /** Font file names (without extension) for res/font, keyed by family and weight. */
    val FONT_FILES: Map<String, Map<Int, String>> = mapOf(
${Object.entries(t.families).filter(([, f]) => f.files).map(([k, f]) => `        "${k}" to mapOf(${Object.entries(f.files).map(([w, n]) => `${w} to "${n.toLowerCase().replace(/-/g, '_')}"`).join(', ')})`).join(',\n')}
    )

    val themes: Map<String, LarkmoorThemeTokens> = mapOf(
${names.map((n) => { const th = themes[n]; return `        "${n}" to LarkmoorThemeTokens(
            name = "${n}", isDark = ${th.scheme === 'dark'},
            colors = LarkmoorColors(${colorKeys.map((k) => `${ktName(k)} = ${argb(th.colors[k])}`).join(', ')}),
            type = mapOf(${Object.entries(th.type).map(([role, r]) => `"${role}" to TextRole("${r.family}", ${r.weight}, Fluid(${r.size.compact}f, ${r.size.medium}f, ${r.size.expanded}f), ${r.lineHeight}f, ${r.tracking}f, ${r.uppercase}, ${r.maxFontScale == null ? 'null' : r.maxFontScale + 'f'})`).join(', ')}))`; }).join(',\n')}
    )
}
`;
}

export function compose(version) {
  return `// Generated by scripts/native.mjs. Do not edit.
// Larkmoor ${version} for Jetpack Compose. Wraps MaterialTheme so Material 3 components pick up Larkmoor colours,
// and exposes the full token set through LocalLarkmoor. Requires androidx.compose.material3.
package design.larkmoor.compose

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import design.larkmoor.LarkmoorThemeTokens
import design.larkmoor.LarkmoorTokens

val LocalLarkmoor = staticCompositionLocalOf { LarkmoorTokens.themes.getValue("default") }

/** A Larkmoor text role as a Compose TextStyle. Sizes are sp, so they follow the user's font size setting. */
fun LarkmoorThemeTokens.textStyle(role: String, widthDp: Float = 0f): TextStyle {
    val r = type.getValue(role)
    val size = r.size.forWidth(widthDp)
    return TextStyle(fontSize = size.sp, lineHeight = (size * r.lineHeight).sp, letterSpacing = r.trackingEm.em, fontWeight = FontWeight(r.weight))
}

/**
 * Applies a Larkmoor theme. Pass lightTheme/darkTheme names; by default follows the system dark setting
 * (default ↔ evergreen-dark). Example: LarkmoorTheme(lightTheme = "harbor", darkTheme = "harbor-dark") { App() }
 */
@Composable
fun LarkmoorTheme(lightTheme: String = "default", darkTheme: String = "evergreen-dark", dark: Boolean = isSystemInDarkTheme(), content: @Composable () -> Unit) {
    val tokens = LarkmoorTokens.themes.getValue(if (dark) darkTheme else lightTheme)
    val c = tokens.colors
    val scheme = if (tokens.isDark) darkColorScheme(
        primary = Color(c.action), onPrimary = Color(c.onAction), secondary = Color(c.accent), onSecondary = Color(c.onAccent),
        background = Color(c.bg), onBackground = Color(c.text), surface = Color(c.surface), onSurface = Color(c.text),
        surfaceVariant = Color(c.bgSubtle), onSurfaceVariant = Color(c.textSecondary), outline = Color(c.borderStrong), error = Color(c.danger),
    ) else lightColorScheme(
        primary = Color(c.action), onPrimary = Color(c.onAction), secondary = Color(c.accent), onSecondary = Color(c.onAccent),
        background = Color(c.bg), onBackground = Color(c.text), surface = Color(c.surface), onSurface = Color(c.text),
        surfaceVariant = Color(c.bgSubtle), onSurfaceVariant = Color(c.textSecondary), outline = Color(c.borderStrong), error = Color(c.danger),
    )
    CompositionLocalProvider(LocalLarkmoor provides tokens) {
        MaterialTheme(colorScheme = scheme, content = content)
    }
}
`;
}
