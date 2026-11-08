export type Breakpoint = 'compact' | 'narrow' | 'medium' | 'wide';
export declare const breakpoints: Readonly<Record<Breakpoint, number>>;
export declare function below(name: Breakpoint): string;
export declare function atLeast(name: Breakpoint): string;
