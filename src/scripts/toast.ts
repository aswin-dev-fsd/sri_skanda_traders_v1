/** Options for a toast's optional action link, e.g. "Saved to My Selection · View". */
export interface ToastAction {
  label: string;
  href: string;
}

const HIDE_AFTER_MS = 3000;
let hideTimer: number | undefined;

/**
 * Shows the site toast (brief Prompt 00-J): bottom-centre, green, auto-hides after 3s.
 * @param message Text to announce.
 * @param action Optional link shown after the message.
 * @returns Nothing.
 */
export function showToast(message: string, action?: ToastAction): void {
  const toast = document.querySelector<HTMLElement>('[data-toast]');
  if (!toast) return;
  const text = toast.querySelector<HTMLElement>('[data-toast-text]');
  const link = toast.querySelector<HTMLAnchorElement>('[data-toast-action]');
  if (text) text.textContent = message;
  if (link) {
    link.hidden = !action;
    if (action) {
      link.textContent = action.label;
      link.href = action.href;
    }
  }
  toast.setAttribute('data-open', '');
  window.clearTimeout(hideTimer);
  hideTimer = window.setTimeout(() => toast.removeAttribute('data-open'), HIDE_AFTER_MS);
}
