/**
 * Page scroll lock for drawers, sheets and the mobile menu. Hiding the page scrollbar would widen
 * the page and shift everything right, so the scrollbar's width is put back as padding on <html>
 * (and on the fixed header, via `--lock-pad`) for as long as the lock holds.
 */
const root = document.documentElement;

/**
 * Stops the page behind an overlay from scrolling, without a sideways shift.
 * @returns Nothing.
 */
export function lockScroll(): void {
  if (root.style.overflow === 'hidden') return;
  const scrollbar = window.innerWidth - root.clientWidth;
  if (scrollbar > 0) {
    root.style.setProperty('--lock-pad', `${scrollbar}px`);
    root.style.paddingRight = `${scrollbar}px`;
  }
  root.style.overflow = 'hidden';
}

/**
 * Lets the page scroll again.
 * @returns Nothing.
 */
export function unlockScroll(): void {
  root.style.overflow = '';
  root.style.paddingRight = '';
  root.style.removeProperty('--lock-pad');
}
