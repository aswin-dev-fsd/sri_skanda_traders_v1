/**
 * Page-wide wiring for My Selection and enquiries (event delegation, so cards added later work too):
 *   [data-save]            star: toggle the item, pop, fly to the header star, toast (signature touch 7)
 *   [data-selection-open]  header star / menu row: open the My Selection drawer
 *   [data-selection-count] any element showing the saved count
 *   [data-enquire]         open the enquiry drawer, about `data-item` if given
 *   [data-enquire-selection] open the enquiry drawer with the saved items attached
 * Without JavaScript these are plain links to /my-selection and /contact.
 */
import type { SelectionItem } from '@/lib/types';
import { $selection, addItem, isSaved, removeItem, restoreItem } from '@/stores/selection';
import { openDrawer, closeDrawer } from '@/scripts/drawer';
import { showToast } from '@/scripts/toast';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

function parseItem(el: HTMLElement): SelectionItem | undefined {
  try {
    return el.dataset.item ? (JSON.parse(el.dataset.item) as SelectionItem) : undefined;
  } catch {
    return undefined;
  }
}

/** The header star that is on screen (desktop bar or small-screen bar). */
function headerStar(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-header] [data-selection-open]');
}

/** Thumbnail flies from the card to the header star (FLIP, 450ms), then the count bumps. */
function flyToHeader(from: HTMLElement, item: SelectionItem) {
  const target = headerStar();
  if (!target || reduceMotion.matches) return bump(target);
  const start = (from.closest('article')?.querySelector('.media') ?? from).getBoundingClientRect();
  const end = target.getBoundingClientRect();
  const size = 56;
  const ghost = document.createElement('div');
  Object.assign(ghost.style, {
    position: 'fixed',
    left: `${start.left + start.width / 2 - size / 2}px`,
    top: `${start.top + start.height / 2 - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '0 14px 0 0',
    border: '2px solid #D4AF37',
    background: item.thumb ? `center / cover url("${item.thumb}")` : (item.swatch ?? '#E7E2D6'),
    zIndex: '90',
    pointerEvents: 'none',
  });
  document.body.append(ghost);
  const dx = end.left + end.width / 2 - (start.left + start.width / 2);
  const dy = end.top + end.height / 2 - (start.top + start.height / 2);
  ghost
    .animate(
      [
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(0.35)`, opacity: 0.6 },
      ],
      { duration: 450, easing: EASE },
    )
    .finished.then(() => {
      ghost.remove();
      bump(target);
    });
}

function bump(target: HTMLElement | null) {
  target?.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }], {
    duration: reduceMotion.matches ? 0 : 300,
    easing: EASE,
  });
}

function pop(star: HTMLElement) {
  if (reduceMotion.matches) return;
  star.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], {
    duration: 300,
    easing: EASE,
  });
}

// Keep every star and count in step with the store, on this page and across tabs.
$selection.subscribe((items) => {
  const ids = new Set(items.map((i) => i.id));
  document.querySelectorAll<HTMLElement>('[data-save]').forEach((star) => {
    const id = parseItem(star)?.id;
    star.setAttribute('aria-pressed', String(!!id && ids.has(id)));
  });
  document.querySelectorAll('[data-selection-count]').forEach((el) => (el.textContent = String(items.length)));
  document.querySelectorAll('[data-selection-open]').forEach((el) =>
    el.setAttribute('aria-label', `My Selection, ${items.length} saved ${items.length === 1 ? 'item' : 'items'}`),
  );
});

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;

  const star = target.closest<HTMLElement>('[data-save]');
  if (star) {
    event.preventDefault();
    const item = parseItem(star);
    if (!item) return;
    if (isSaved(item.id)) {
      const removed = removeItem(item.id);
      if (removed) showToast(`Removed ${item.name}`, { label: 'Undo', onClick: () => restoreItem(removed) });
    } else {
      addItem(item);
      pop(star);
      flyToHeader(star, item);
      showToast('Saved to My Selection', { label: 'View', href: '/my-selection' });
    }
    return;
  }

  const selectionOpen = target.closest<HTMLElement>('[data-selection-open]');
  if (selectionOpen) {
    event.preventDefault();
    // From the full-screen menu: close it first so focus lands in the drawer.
    document.querySelector<HTMLElement>('[data-menu][data-open] [data-menu-close]')?.click();
    openDrawer('selection', headerStar());
    return;
  }

  const enquireSelection = target.closest<HTMLElement>('[data-enquire-selection]');
  if (enquireSelection) {
    event.preventDefault();
    closeDrawer({ restoreFocus: false });
    document.dispatchEvent(new CustomEvent('enquiry:open', { detail: { attach: true, opener: headerStar() } }));
    return;
  }

  const enquire = target.closest<HTMLElement>('[data-enquire]');
  if (enquire) {
    event.preventDefault();
    document.querySelector<HTMLElement>('[data-menu][data-open] [data-menu-close]')?.click();
    document.dispatchEvent(
      new CustomEvent('enquiry:open', {
        detail: { about: parseItem(enquire), interest: enquire.dataset.enquireInterest, opener: enquire },
      }),
    );
  }
});
