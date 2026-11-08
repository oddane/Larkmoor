import { type ComponentRef, type Ref } from 'react';
import { TextInput, type TextInputProps } from 'react-native';
export interface FieldProps extends TextInputProps {
    label: string;
    hint?: string;
    /** Error message. Shown under the input, announced once, and given an icon as well as colour. */
    error?: string;
    optional?: boolean;
    /** Ref to the underlying TextInput, e.g. to focus the next field. */
    inputRef?: Ref<ComponentRef<typeof TextInput>>;
}
/** A labelled text input with hint and error. The label is always visible; placeholders are only examples. */
export declare function Field({ label, hint, error, optional, inputRef, style, onFocus, onBlur, ...rest }: FieldProps): import("react").JSX.Element;
