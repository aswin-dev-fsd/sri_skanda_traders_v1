import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { bathwareTypes, label } from '@/config/catalogue';

export type TileEntry = CollectionEntry<'tiles'>;
export type ProductEntry = CollectionEntry<'products'>;
export type BrandEntry = CollectionEntry<'brands'>;

/** A tile collection with its brand resolved and the counts every card shows. */
export interface TileSummary {
  entry: TileEntry;
  brand: BrandEntry['data'];
  href: string;
  colours: number;
  finishes: number;
  sizes: number;
  /** Colour dot values, in catalogue order. */
  dots: string[];
}

/**
 * Formats a stored size for display.
 * @param size A size like "600x1200".
 * @returns "600 × 1200 mm".
 */
export function formatSize(size: string): string {
  const [w, h] = size.split('x');
  return `${w} × ${h} mm`;
}

/**
 * Link to a tile collection page.
 * @param id Collection id (its YAML file name).
 * @returns The page URL.
 */
export const collectionHref = (id: string): string => `/collection/${id}`;

/**
 * Link to a product page.
 * @param id Product id (its YAML file name).
 * @returns The page URL.
 */
export const productHref = (id: string): string => `/product/${id}`;

/**
 * Loads one brand by id.
 * @param id Brand id from brands.yaml.
 * @returns The brand data.
 */
async function brandOf(id: string): Promise<BrandEntry['data']> {
  const brand = await getEntry('brands', id);
  if (!brand) throw new Error(`Unknown brand "${id}"`);
  return brand.data;
}

/**
 * Summarises a tile collection for cards and listings.
 * @param entry A tile collection entry.
 * @returns Brand, link and counts across all colours.
 */
export async function summarise(entry: TileEntry): Promise<TileSummary> {
  const { colours } = entry.data;
  return {
    entry,
    brand: await brandOf(entry.data.brand.id),
    href: collectionHref(entry.id),
    colours: colours.length,
    finishes: new Set(colours.flatMap((c) => c.finishes)).size,
    sizes: new Set(colours.flatMap((c) => c.sizes)).size,
    dots: colours.map((c) => c.hex),
  };
}

/** Filters for tile listings. Every field is optional; all given fields must match. */
export interface TileFilter {
  category?: TileEntry['data']['categories'][number];
  space?: string;
  brand?: string;
  isNew?: boolean;
  isTrending?: boolean;
}

/**
 * All tile collections matching a filter, A–Z.
 * @param filter Optional category, space, brand, new or trending filter.
 * @returns Summaries ready for collection cards.
 */
export async function getTiles(filter: TileFilter = {}): Promise<TileSummary[]> {
  const entries = await getCollection('tiles', ({ data }) => {
    if (filter.category && !data.categories.includes(filter.category)) return false;
    if (filter.space && !data.spaces.includes(filter.space)) return false;
    if (filter.brand && data.brand.id !== filter.brand) return false;
    if (filter.isNew !== undefined && data.isNew !== filter.isNew) return false;
    if (filter.isTrending !== undefined && data.isTrending !== filter.isTrending) return false;
    return true;
  });
  const sorted = entries.sort((a, b) => a.data.name.localeCompare(b.data.name));
  return Promise.all(sorted.map(summarise));
}

/** A product with its brand resolved. */
export interface ProductSummary {
  entry: ProductEntry;
  brand: BrandEntry['data'];
  href: string;
}

/**
 * Products in a category (and optional bathware group), A–Z.
 * @param category bathware, granite or adhesives; omit for all.
 * @param group Bathware group: sanitary-ware, faucets or accessories.
 * @returns Products with brands resolved.
 */
export async function getProducts(
  category?: ProductEntry['data']['category'],
  group?: 'sanitary-ware' | 'faucets' | 'accessories',
): Promise<ProductSummary[]> {
  const typesInGroup = group ? bathwareTypes.filter((t) => t.group === group).map((t) => t.value as string) : null;
  const entries = await getCollection('products', ({ data }) => {
    if (category && data.category !== category) return false;
    if (typesInGroup && !(data.bathwareType && typesInGroup.includes(data.bathwareType))) return false;
    return true;
  });
  const sorted = entries.sort((a, b) => a.data.name.localeCompare(b.data.name));
  return Promise.all(sorted.map(async (entry) => ({ entry, brand: await brandOf(entry.data.brand.id), href: productHref(entry.id) })));
}

/**
 * Number of tile collections per space, for "Shop by space" cards.
 * @returns A map of space slug → collection count.
 */
export async function countBySpace(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const { data } of await getCollection('tiles')) {
    for (const space of data.spaces) counts[space] = (counts[space] ?? 0) + 1;
  }
  return counts;
}

export { label };
