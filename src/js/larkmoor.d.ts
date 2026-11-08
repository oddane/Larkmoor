export type Cleanup = () => void;
export declare function prefersReducedMotion(): boolean;
export declare function isMotionPaused(): boolean;
export declare function motionOff(): boolean;
export declare function markScripted(): void;
export declare function initMotionToggle(button: HTMLButtonElement | null, options?: { storageKey?: string }): Cleanup;
export declare function initDisclosureMenu(button: HTMLButtonElement | null, options?: { openLabel?: string; closeLabel?: string }): Cleanup;
export declare function initHeader(header: HTMLElement | null, options?: { progress?: HTMLElement | null; hideAfter?: number; isLocked?: () => boolean }): Cleanup;
export declare function initReveal(targets: string | Iterable<Element>, options?: { stagger?: number; maxSteps?: number }): Cleanup;
export declare function initForm(form: HTMLFormElement | null, options: {
  messages?: Record<string, Partial<Record<keyof ValidityState, string>>>;
  summary?: HTMLElement | null;
  onValid: (data: FormData) => Promise<void>;
}): Cleanup;
declare global {
  interface DocumentEventMap { 'lm:motionchange': CustomEvent<{ paused: boolean }>; }
}
