/**
 * My Selection: the customer's shortlist, kept on this device only (localStorage, no login).
 * Every open tab stays in sync through the `storage` event.
 */
import { atom } from 'nanostores';
import type { SavedItem, SelectionItem } from '@/lib/types';

const STORAGE_KEY = 'sst:selection:v1';

/** Reads the saved list, tolerating missing or corrupt storage (private mode, cleared data). */
function load(): SavedItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((i): i is SavedItem => typeof i?.id === 'string') : [];
  } catch {
    return [];
  }
}

function save(items: SavedItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or blocked: the list still works for this visit.
  }
}

/** The saved items, oldest first. */
export const $selection = atom<SavedItem[]>(typeof window === 'undefined' ? [] : load());

$selection.listen(save);

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) $selection.set(load());
  });
}

/**
 * Whether an item is saved.
 * @param id Item id.
 * @returns True when the item is in My Selection.
 */
export function isSaved(id: string): boolean {
  return $selection.get().some((i) => i.id === id);
}

/**
 * Adds an item (no-op when it is already saved).
 * @param item The item to save.
 * @returns Nothing.
 */
export function addItem(item: SelectionItem): void {
  if (isSaved(item.id)) return;
  $selection.set([...$selection.get(), { ...item, savedAt: Date.now() }]);
}

/**
 * Removes an item.
 * @param id Item id.
 * @returns The removed item, for undo.
 */
export function removeItem(id: string): SavedItem | undefined {
  const items = $selection.get();
  const removed = items.find((i) => i.id === id);
  $selection.set(items.filter((i) => i.id !== id));
  return removed;
}

/**
 * Puts a removed item back where it was (undo).
 * @param item The item returned by removeItem().
 * @returns Nothing.
 */
export function restoreItem(item: SavedItem): void {
  if (isSaved(item.id)) return;
  $selection.set([...$selection.get(), item].sort((a, b) => a.savedAt - b.savedAt));
}

/**
 * Saves or unsaves an item.
 * @param item The item.
 * @returns True when the item is now saved.
 */
export function toggleItem(item: SelectionItem): boolean {
  if (isSaved(item.id)) {
    removeItem(item.id);
    return false;
  }
  addItem(item);
  return true;
}

/**
 * Updates the room or area the customer set for an item.
 * @param id Item id.
 * @param changes Fields to change.
 * @returns Nothing.
 */
export function updateItem(id: string, changes: Pick<SavedItem, 'room' | 'approxArea'>): void {
  $selection.set($selection.get().map((i) => (i.id === id ? { ...i, ...changes } : i)));
}

/**
 * Empties the list (showroom "New customer").
 * @returns Nothing.
 */
export function clearSelection(): void {
  $selection.set([]);
}
