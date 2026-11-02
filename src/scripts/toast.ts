/** A toast's optional action: a link ("View") or a button ("Undo"). */
export interface ToastAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

const HIDE_AFTER_MS = 3000;
let hideTimer: number | undefined;

/**
 * Shows the site toast (brief Prompt 00-J): bottom-centre, green, auto-hides after 3s.
 * @param message Text to announce.
 * @param action Optional link or button shown after the message.
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
    link.onclick = null;
    if (action) {
      link.textContent = action.label;
      link.href = action.href ?? '#';
      if (action.onClick) {
        link.onclick = (event) => {
          event.preventDefault();
          action.onClick?.();
          toast.removeAttribute('data-open');
        };
      }
    }
  }
  toast.setAttribute('data-open', '');
  window.clearTimeout(hideTimer);
  hideTimer = window.setTimeout(() => toast.removeAttribute('data-open'), HIDE_AFTER_MS);
}
