/**
 * Listing filters, as pure functions (no DOM), so the browser script and the tests share them.
 * Matching: an item must match every group that has a selection (AND), and any selected value
 * within a group (OR).
 */

/** An item's filterable values, by group key: { look: ["marble"], size: ["600x1200"] }. */
export type Facets = Record<string, string[]>;
/** Selected values, by group key. */
export type Selection = Record<string, string[]>;
export type SortKey = 'latest' | 'popular' | 'az';

export interface FilterItem {
  id: string;
  name: string;
  facets: Facets;
  isNew?: boolean;
  isTrending?: boolean;
  /** Catalogue order, for stable sorting. */
  order: number;
}

export const SORTS: { key: SortKey; label: string }[] = [
  { key: 'latest', label: 'Latest' },
  { key: 'popular', label: 'Popular' },
  { key: 'az', label: 'A–Z' },
];

/**
 * Whether an item matches a selection.
 * @param facets The item's facets.
 * @param selection Selected values by group.
 * @returns True when every non-empty group matches.
 */
export function matches(facets: Facets, selection: Selection): boolean {
  return Object.entries(selection).every(
    ([key, values]) => values.length === 0 || values.some((v) => facets[key]?.includes(v)),
  );
}

/**
 * Items matching a selection.
 * @param items All items.
 * @param selection Selected values by group.
 * @returns The matching items, in their original order.
 */
export function filterItems<T extends FilterItem>(items: T[], selection: Selection): T[] {
  return items.filter((item) => matches(item.facets, selection));
}

/**
 * Sorts items. Latest puts new collections first, Popular puts trending first; ties keep catalogue order.
 * @param items Items to sort (not mutated).
 * @param sort Sort key.
 * @returns A new, sorted array.
 */
export function sortItems<T extends FilterItem>(items: T[], sort: SortKey): T[] {
  const byOrder = (a: T, b: T) => a.order - b.order;
  const flag = (key: 'isNew' | 'isTrending') => (a: T, b: T) => Number(!!b[key]) - Number(!!a[key]) || byOrder(a, b);
  const compare = sort === 'az' ? (a: T, b: T) => a.name.localeCompare(b.name) : sort === 'popular' ? flag('isTrending') : flag('isNew');
  return [...items].sort(compare);
}

/**
 * Number of selected values across all groups.
 * @param selection Selected values by group.
 * @returns The total.
 */
export function countSelected(selection: Selection): number {
  return Object.values(selection).reduce((n, values) => n + values.length, 0);
}

/**
 * Reads a selection from URL search params, keeping only known groups and values.
 * @param params The page's URLSearchParams.
 * @param allowed Group key → allowed values.
 * @returns The selection (every allowed group present, possibly empty).
 */
export function parseSelection(params: URLSearchParams, allowed: Record<string, string[]>): Selection {
  const selection: Selection = {};
  for (const [key, values] of Object.entries(allowed)) {
    const raw = params.get(key);
    selection[key] = raw ? raw.split(',').filter((v) => values.includes(v)) : [];
  }
  return selection;
}

/**
 * Parses a sort key, falling back to "latest".
 * @param raw Value of the `sort` URL param.
 * @returns A valid sort key.
 */
export function parseSort(raw: string | null): SortKey {
  return SORTS.some((s) => s.key === raw) ? (raw as SortKey) : 'latest';
}

/**
 * Builds the query string for a selection and sort, so a filtered view can be shared.
 * @param selection Selected values by group.
 * @param sort Sort key ("latest" is the default and left out).
 * @returns "?look=marble&sort=az", or "" when nothing is set.
 */
export function toQuery(selection: Selection, sort: SortKey): string {
  const params = new URLSearchParams();
  for (const [key, values] of Object.entries(selection)) {
    if (values.length) params.set(key, values.join(','));
  }
  if (sort !== 'latest') params.set('sort', sort);
  const query = params.toString().replace(/%2C/g, ',');
  return query ? `?${query}` : '';
}

export interface Suggestion {
  key: string;
  value: string;
  /** Results there would be with this one value removed. */
  count: number;
}

/**
 * For the empty state: which single selected value to remove to get the most results.
 * @param items All items.
 * @param selection The current (empty-result) selection.
 * @param limit How many suggestions to return.
 * @returns Up to `limit` suggestions with results, most results first.
 */
export function suggestRemovals(items: FilterItem[], selection: Selection, limit = 3): Suggestion[] {
  const suggestions: Suggestion[] = [];
  for (const [key, values] of Object.entries(selection)) {
    for (const value of values) {
      const without = { ...selection, [key]: values.filter((v) => v !== value) };
      const count = filterItems(items, without).length;
      if (count > 0) suggestions.push({ key, value, count });
    }
  }
  return suggestions.sort((a, b) => b.count - a.count).slice(0, limit);
}
