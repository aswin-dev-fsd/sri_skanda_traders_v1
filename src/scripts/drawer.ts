/**
 * Drawer behaviour shared by the enquiry and My Selection drawers: one open at a time,
 * focus moves in and is kept inside, Esc / backdrop / close button close it, the page
 * behind stops scrolling, and `data-overlay` on <html> hides the floating WhatsApp button.
 */
const root = document.documentElement;
let active: HTMLElement | null = null;
let returnFocus: HTMLElement | null = null;

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])';

function focusables(drawer: HTMLElement): HTMLElement[] {
  return [...drawer.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
}

/**
 * Opens a drawer by id, closing any other.
 * @param id The drawer's `data-drawer` value.
 * @param opener Element to return focus to on close.
 * @returns The drawer element, or null if not found.
 */
export function openDrawer(id: string, opener?: HTMLElement | null): HTMLElement | null {
  const drawer = document.querySelector<HTMLElement>(`[data-drawer="${id}"]`);
  if (!drawer) return null;
  if (active && active !== drawer) closeDrawer({ restoreFocus: false });
  returnFocus = opener ?? (document.activeElement as HTMLElement | null);
  active = drawer;
  drawer.inert = false;
  drawer.setAttribute('data-open', '');
  root.dataset.overlay = 'drawer';
  root.style.overflow = 'hidden';
  drawer.dispatchEvent(new CustomEvent('drawer:open'));
  requestAnimationFrame(() => (drawer.querySelector<HTMLElement>('[data-autofocus]') ?? focusables(drawer)[0])?.focus());
  return drawer;
}

/**
 * Closes the open drawer.
 * @param options `restoreFocus: false` when another drawer opens straight after.
 * @returns Nothing.
 */
export function closeDrawer({ restoreFocus = true } = {}): void {
  if (!active) return;
  const drawer = active;
  active = null;
  drawer.removeAttribute('data-open');
  drawer.inert = true;
  delete root.dataset.overlay;
  root.style.overflow = '';
  drawer.dispatchEvent(new CustomEvent('drawer:close'));
  if (restoreFocus) returnFocus?.focus();
}

document.addEventListener('keydown', (event) => {
  if (!active) return;
  if (event.key === 'Escape') {
    closeDrawer();
    return;
  }
  if (event.key !== 'Tab') return;
  const items = focusables(active);
  const first = items[0];
  const last = items[items.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
});

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  if (target.closest('[data-drawer-close]') || target.matches('[data-drawer-backdrop]')) closeDrawer();
});
