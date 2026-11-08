import type { ReactNode } from 'react';
import { type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
    label: string;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'default' | 'small';
    /** Shows a spinner, keeps the label, announces busy and ignores presses until done. */
    loading?: boolean;
    icon?: ReactNode;
    block?: boolean;
    style?: StyleProp<ViewStyle>;
}
/**
 * An action. Always at least the platform touch target (44pt iOS, 48dp Android): the small size
 * keeps its compact look and extends the touchable area with hitSlop instead.
 */
export declare function Button({ label, variant, size, loading, disabled, icon, block, style, onPress, ...rest }: ButtonProps): import("react").JSX.Element;
