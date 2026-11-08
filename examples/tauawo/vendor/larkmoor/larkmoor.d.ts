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
export declare function initTabs(root: HTMLElement | null, options?: { onChange?: (index: number) => void }): Cleanup;
export declare function initDialog(dialog: HTMLDialogElement | null): Cleanup;
export declare function toast(message: string, options?: { tone?: 'default' | 'danger'; timeout?: number }): () => void;

/** Adds the toast live region now so screen readers track it before the first message. */
export declare function initToasts(): HTMLElement;
