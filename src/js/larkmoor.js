// Larkmoor behaviours: small, dependency-free progressive enhancements.
// Every function is safe to call when its markup is missing and returns a cleanup function.
// @ts-check

/** True when the visitor asked the OS for less motion. */
export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** True when motion is paused by the pause control. */
export const isMotionPaused = () => document.documentElement.classList.contains('is-paused');

/** True when motion of any kind should be skipped. */
export const motionOff = () => prefersReducedMotion() || isMotionPaused();

/**
 * Marks the document as scripted so `[data-lm-requires-js]` controls appear.
 * Call as early as possible (an inline `<script>` in <head> is best, to avoid a flash).
 */
export function markScripted() {
  document.documentElement.classList.add('js');
}

/**
 * Pause/play button for looping motion (WCAG 2.2.2). The choice persists when storage is available.
 * Dispatches `lm:motionchange` on document.
 * @param {HTMLButtonElement | null} button
 * @param {{ storageKey?: string }} [options]
 */
export function initMotionToggle(button, { storageKey = 'lm:motion-paused' } = {}) {
  if (!button) return () => {};
  const root = document.documentElement;
  const set = (/** @type {boolean} */ pause, persist = true) => {
    root.classList.toggle('is-paused', pause);
    button.setAttribute('aria-pressed', String(pause));
    if (persist) { try { localStorage.setItem(storageKey, pause ? '1' : '0'); } catch { /* storage blocked: still works for this visit */ } }
    document.dispatchEvent(new CustomEvent('lm:motionchange', { detail: { paused: pause } }));
  };
  let saved = false;
  try { saved = localStorage.getItem(storageKey) === '1'; } catch { /* ignore */ }
  set(saved, false);
  const onClick = () => set(!isMotionPaused());
  button.addEventListener('click', onClick);
  return () => button.removeEventListener('click', onClick);
}

/**
 * Disclosure menu (APG disclosure pattern): a button with aria-expanded/aria-controls toggles a region.
 * Escape closes and returns focus to the button; choosing a link closes it.
 * @param {HTMLButtonElement | null} button
 * @param {{ openLabel?: string, closeLabel?: string }} [options]
 */
export function initDisclosureMenu(button, { openLabel = 'Open menu', closeLabel = 'Close menu' } = {}) {
  const id = button?.getAttribute('aria-controls');
  const menu = id ? document.getElementById(id) : null;
  if (!button || !menu) return () => {};
  const set = (/** @type {boolean} */ open) => {
    menu.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? closeLabel : openLabel);
  };
  const onClick = () => set(Boolean(menu.hidden));
  const onMenuClick = (/** @type {MouseEvent} */ e) => { if (/** @type {Element} */ (e.target).closest('a')) set(false); };
  const onKey = (/** @type {KeyboardEvent} */ e) => { if (e.key === 'Escape' && !menu.hidden) { set(false); button.focus(); } };
  button.addEventListener('click', onClick);
  menu.addEventListener('click', onMenuClick);
  document.addEventListener('keydown', onKey);
  set(false);
  return () => { button.removeEventListener('click', onClick); menu.removeEventListener('click', onMenuClick); document.removeEventListener('keydown', onKey); };
}

/**
 * Header that gains a backdrop after scrolling, steps aside while reading down and returns on scroll up
 * or on focus. Optionally drives a `.lm-progress` bar.
 * @param {HTMLElement | null} header
 * @param {{ progress?: HTMLElement | null, hideAfter?: number, isLocked?: () => boolean }} [options]
 */
export function initHeader(header, { progress = null, hideAfter = 480, isLocked = () => false } = {}) {
  if (!header) return () => {};
  let lastY = scrollY;
  let ticking = false;
  const update = () => {
    const y = scrollY;
    header.classList.toggle('is-scrolled', y > 12);
    if (progress) {
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : '0');
    }
    if (!isLocked() && !prefersReducedMotion()) header.classList.toggle('is-hidden', y > lastY && y > hideAfter);
    lastY = y;
    ticking = false;
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  const onFocus = () => header.classList.remove('is-hidden');
  addEventListener('scroll', onScroll, { passive: true });
  header.addEventListener('focusin', onFocus);
  update();
  return () => { removeEventListener('scroll', onScroll); header.removeEventListener('focusin', onFocus); };
}

/**
 * Eases elements in as they scroll into view, staggered within each parent. Elements already on screen,
 * and everything when motion is off, are left untouched, so nothing can stay hidden.
 * @param {string | Iterable<Element>} targets selector or elements
 * @param {{ stagger?: number, maxSteps?: number }} [options]
 */
export function initReveal(targets, { stagger = 70, maxSteps = 6 } = {}) {
  if (motionOff() || !('IntersectionObserver' in window)) return () => {};
  const items = typeof targets === 'string' ? document.querySelectorAll(targets) : targets;
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('lm-reveal-in');
      entry.target.classList.remove('lm-reveal-pending');
      io.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -10% 0px' });
  const counts = new Map();
  for (const el of items) {
    if (!(el instanceof HTMLElement) || el.getBoundingClientRect().top < innerHeight) continue;
    const n = counts.get(el.parentElement) || 0;
    counts.set(el.parentElement, n + 1);
    el.style.setProperty('--d', `${Math.min(n, maxSteps) * stagger}ms`);
    el.classList.add('lm-reveal-pending');
    io.observe(el);
  }
  // if motion gets paused mid-page, show everything at once
  const reveal = () => { if (!isMotionPaused()) return; document.querySelectorAll('.lm-reveal-pending').forEach((el) => el.classList.replace('lm-reveal-pending', 'lm-reveal-in')); io.disconnect(); };
  document.addEventListener('lm:motionchange', reveal);
  return () => { io.disconnect(); document.removeEventListener('lm:motionchange', reveal); };
}

/**
 * Form validation helper for native constraint validation with accessible messages.
 * Validates on submit. After that, a field already marked wrong is re-checked as the person types,
 * so its error clears the moment it's fixed. Nothing is re-validated on blur: a message appearing
 * or vanishing on blur shifts the layout under the pointer and can make the next click miss.
 * Writes messages into `#<input-id>-message`, sets aria-invalid, and moves focus to an error summary
 * when one exists. The caller's `onValid` must return a promise; success is only announced after it resolves.
 * @param {HTMLFormElement | null} form
 * @param {{ messages?: Record<string, Partial<Record<keyof ValidityState, string>>>, summary?: HTMLElement | null, onValid: (data: FormData) => Promise<void> }} options
 */
export function initForm(form, { messages = {}, summary = null, onValid }) {
  if (!form) return () => {};
  form.noValidate = true;
  const fields = () => /** @type {HTMLInputElement[]} */ ([...form.elements].filter((el) => (el instanceof HTMLInputElement && el.type !== 'checkbox' && el.type !== 'radio') || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement));
  const messageFor = (/** @type {HTMLInputElement} */ el) => {
    const custom = messages[el.name] || {};
    for (const key of /** @type {(keyof ValidityState)[]} */ (['valueMissing', 'typeMismatch', 'tooShort', 'patternMismatch', 'rangeUnderflow', 'rangeOverflow'])) {
      if (el.validity[key]) return custom[key] || el.validationMessage;
    }
    return el.validationMessage;
  };
  const check = (/** @type {HTMLInputElement} */ el) => {
    const slot = document.getElementById(`${el.id}-message`);
    const ok = el.checkValidity();
    if (ok) el.removeAttribute('aria-invalid'); else el.setAttribute('aria-invalid', 'true');
    if (slot) { slot.textContent = ok ? '' : messageFor(el); slot.className = ok ? 'lm-field__message' : 'lm-field__message lm-field__message--error'; }
    return ok;
  };
  const onInput = (/** @type {Event} */ e) => {
    const el = /** @type {HTMLInputElement} */ (e.target);
    if (el.getAttribute('aria-invalid') === 'true' && fields().includes(el)) check(el);
  };
  const onSubmit = async (/** @type {SubmitEvent} */ e) => {
    e.preventDefault();
    const invalid = fields().filter((el) => !check(el));
    if (summary) {
      summary.hidden = invalid.length === 0;
      const list = summary.querySelector('ul');
      if (list) list.replaceChildren(...invalid.map((el) => { const li = document.createElement('li'); const a = document.createElement('a'); a.href = `#${el.id}`; a.textContent = messageFor(el); li.append(a); return li; }));
    }
    if (invalid.length) { (summary && !summary.hidden ? summary : invalid[0]).focus(); return; }
    const submit = /** @type {HTMLButtonElement | null} */ (form.querySelector('[type="submit"]'));
    if (submit?.getAttribute('aria-busy') === 'true') return;
    submit?.setAttribute('aria-busy', 'true');
    submit?.setAttribute('aria-disabled', 'true');
    form.setAttribute('aria-busy', 'true');
    try { await onValid(new FormData(form)); }
    finally { submit?.removeAttribute('aria-busy'); submit?.removeAttribute('aria-disabled'); form.removeAttribute('aria-busy'); }
  };
  form.addEventListener('submit', onSubmit);
  form.addEventListener('input', onInput);
  return () => { form.removeEventListener('submit', onSubmit); form.removeEventListener('input', onInput); };
}
