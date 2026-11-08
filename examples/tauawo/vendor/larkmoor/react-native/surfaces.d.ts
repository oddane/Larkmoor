import { type ReactNode } from 'react';
import { type ViewProps } from 'react-native';
/** A self-contained item. Pass onPress to make the whole card one button with one accessible name. */
export declare function Card({ children, onPress, accessibilityLabel, style, ...rest }: ViewProps & {
    onPress?: () => void;
    children?: ReactNode;
}): import("react").JSX.Element;
/** Groups a demo or summary on the quiet background. */
export declare function Panel({ style, ...rest }: ViewProps): import("react").JSX.Element;
/** A short status. The text carries the meaning; the dot is a second cue. */
export declare function Badge({ label, tone }: {
    label: string;
    tone?: 'muted' | 'success' | 'accent' | 'warning' | 'danger';
}): import("react").JSX.Element;
/**
 * A message. Danger alerts are announced immediately; success and other alerts are announced politely.
 */
export declare function Alert({ title, children, tone }: {
    title: string;
    children?: ReactNode;
    tone?: 'success' | 'warning' | 'danger';
}): import("react").JSX.Element;
/** A term and detail per row, with hairlines. Stacks on compact windows. */
export declare function Rows({ rows }: {
    rows: Array<{
        term: string;
        detail: string;
    }>;
}): import("react").JSX.Element;
