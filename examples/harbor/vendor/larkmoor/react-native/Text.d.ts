import { type TextProps as RNTextProps } from 'react-native';
import { type TextRole } from './theme';
export type TextTone = 'default' | 'secondary' | 'muted' | 'label' | 'accent' | 'success' | 'warning' | 'danger' | 'onAction';
export interface TextProps extends RNTextProps {
    /** Semantic text role (display, title, heading, subheading, lead, body, caption, label, code). Visual size is independent of document structure. Default "body". */
    variant?: TextRole;
    tone?: TextTone;
    /** Announce as a heading to screen readers. Defaults to true for display, title and heading. */
    heading?: boolean;
}
/** Text in a Larkmoor role. Scales with the user's font size, capped per role so large titles don't break layouts. */
export declare function Text({ variant, tone, heading, style, ...rest }: TextProps): import("react").JSX.Element;
