export interface SegmentedControlProps<T extends string> {
    /** Accessible name for the group, e.g. "Privacy profile". */
    label: string;
    options: Array<{
        value: T;
        label: string;
    }>;
    value: T;
    onChange: (value: T) => void;
}
/** 2 to 5 options that switch a view immediately. A radio group to assistive technology. */
export declare function SegmentedControl<T extends string>({ label, options, value, onChange }: SegmentedControlProps<T>): import("react").JSX.Element;
