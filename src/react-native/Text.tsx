import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { useLarkmoor, type TextRole } from './theme';

export type TextTone = 'default' | 'secondary' | 'muted' | 'label' | 'accent' | 'success' | 'warning' | 'danger' | 'onAction';

export interface TextProps extends RNTextProps {
  /** Semantic text role (display, title, heading, subheading, lead, body, caption, label, code). Visual size is independent of document structure. Default "body". */
  variant?: TextRole;
  tone?: TextTone;
  /** Announce as a heading to screen readers. Defaults to true for display, title and heading. */
  heading?: boolean;
}

const toneKey = { default: 'text', secondary: 'text-secondary', muted: 'text-muted', label: 'text-label', accent: 'accent-text', success: 'success', warning: 'warning', danger: 'danger', onAction: 'on-action' } as const;

/** Text in a Larkmoor role. Scales with the user's font size, capped per role so large titles don't break layouts. */
export function Text({ variant = 'body', tone, heading, style, ...rest }: TextProps) {
  const lm = useLarkmoor();
  const { maxFontSizeMultiplier, ...s } = lm.text(variant);
  const defaultTone: TextTone = variant === 'lead' ? 'secondary' : variant === 'caption' || variant === 'label' ? 'muted' : 'default';
  const color = lm.colors[toneKey[tone ?? defaultTone]].rgba;
  const isHeading = heading ?? (variant === 'display' || variant === 'title' || variant === 'heading');
  return (
    <RNText
      accessibilityRole={isHeading ? 'header' : rest.accessibilityRole}
      maxFontSizeMultiplier={rest.maxFontSizeMultiplier ?? maxFontSizeMultiplier}
      style={[s, { color }, style]}
      {...rest}
    />
  );
}
