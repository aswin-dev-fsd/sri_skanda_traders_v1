/**
 * Build-time data for a listing page: the cards to render (with their facets) and the filter
 * groups for the sidebar, showing only values that occur in this listing.
 */
import { getCollection } from 'astro:content';
import {
  adhesiveTypes,
  adhesiveUses,
  bathwareFinishes,
  bathwareTypes,
  colourFamilies,
  graniteFinishes,
  graniteUses,
  looks,
  tileFinishes,
} from '@/config/catalogue';
import type { Listing } from '@/config/listings';
import { spaces } from '@/config/site';
import { formatSize, getProducts, getTiles, type ProductSummary, type TileSummary } from '@/lib/catalogue';
import type { Facets, FilterItem } from '@/lib/filters';

export type GroupStyle = 'check' | 'look' | 'dot' | 'chip' | 'size';

export interface FilterOption {
  value: string;
  label: string;
  /** CSS background for look thumbnails and colour dots. */
  swatch?: string;
  /** Glossy/polished finishes get the sheen. */
  sheen?: boolean;
  /** Tile size in mm, for the to-scale icon. */
  mm?: { w: number; h: number };
}

export interface FilterGroup {
  key: string;
  label: string;
  style: GroupStyle;
  options: FilterOption[];
  /** First two groups start open. */
  open: boolean;
}

export type ListingItem = FilterItem &
  ({ type: 'tile'; tile: TileSummary } | { type: 'product'; product: ProductSummary });

/** Small sample-chip faces for the Look & feel filter. */
const lookFaces: Record<string, string> = {
  marble: 'linear-gradient(118deg, #F4EFE6 0%, #E2D8C6 40%, #F1ECE2 55%, #D7CBB5 100%)',
  stone: 'linear-gradient(135deg, #BEBCB6 0%, #93918B 100%)',
  wood: 'repeating-linear-gradient(90deg, #BF956A 0 10px, #A57C55 10px 12px)',
  concrete: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.08) 1px, transparent 1.5px) 0 0 / 6px 6px, #B4B2AC',
  plain: '#ECE9E2',
  decor: 'radial-gradient(circle at 4px 4px, #B9A687 2px, transparent 2.6px) 0 0 / 12px 12px, #E8DFD0',
  metallic: 'linear-gradient(135deg, #CDB894 0%, #8C6A4E 50%, #CDB894 100%)',
  rustic: 'linear-gradient(135deg, #B5694B 0%, #8A4B36 100%)',
};

const uniq = (values: string[]) => [...new Set(values)];

/** Keeps the options whose value occurs in the items, in the option list's order. */
function present(options: FilterOption[], items: FilterItem[], key: string): FilterOption[] {
  const used = new Set(items.flatMap((i) => i.facets[key] ?? []));
  return options.filter((o) => used.has(o.value));
}

function group(key: string, label: string, style: GroupStyle, options: FilterOption[], items: FilterItem[]): FilterGroup {
  return { key, label, style, options: present(options, items, key), open: false };
}

async function brandOptions(): Promise<FilterOption[]> {
  return (await getCollection('brands')).map((b) => ({ value: b.id, label: b.data.name }));
}

function sizeOptions(items: FilterItem[]): FilterOption[] {
  return uniq(items.flatMap((i) => i.facets.size ?? []))
    .map((value) => {
      const [w, h] = value.split('x').map(Number);
      return { value, label: formatSize(value).replace(' mm', ''), mm: { w, h } };
    })
    .sort((a, b) => a.mm.w * a.mm.h - b.mm.w * b.mm.h);
}

/**
 * Cards and filter groups for a listing page.
 * @param listing The listing definition.
 * @returns Items (with facets) and the sidebar filter groups.
 */
export async function buildListing(listing: Listing): Promise<{ items: ListingItem[]; groups: FilterGroup[] }> {
  const brands = await brandOptions();
  let items: ListingItem[];
  let groups: FilterGroup[];

  if (listing.kind === 'tiles') {
    const tiles = await getTiles({ category: listing.fixed.category, space: listing.fixed.space });
    items = tiles.map((tile, order) => {
      const { data } = tile.entry;
      const facets: Facets = {
        space: data.spaces,
        look: data.looks,
        colour: uniq(data.colours.map((c) => c.family)),
        finish: uniq(data.colours.flatMap((c) => c.finishes)),
        size: uniq(data.colours.flatMap((c) => c.sizes)),
        brand: [data.brand.id],
      };
      return { type: 'tile', tile, id: tile.entry.id, name: data.name, facets, isNew: data.isNew, isTrending: data.isTrending, order };
    });
    groups = [
      ...(listing.fixed.space
        ? []
        : [group('space', 'Space', 'check', spaces.map((s) => ({ value: s.slug, label: s.name })), items)]),
      group('look', 'Look & feel', 'look', looks.map((l) => ({ ...l, swatch: lookFaces[l.value] })), items),
      group('colour', 'Colour', 'dot', colourFamilies.map((c) => ({ value: c.value, label: c.label, swatch: c.hex })), items),
      group('finish', 'Finish', 'chip', tileFinishes.map((f) => ({ value: f.value, label: f.label, sheen: f.sheen })), items),
      { key: 'size', label: 'Size', style: 'size', options: sizeOptions(items), open: false },
      group('brand', 'Brand', 'check', brands, items),
    ];
  } else {
    const products = await getProducts(listing.kind, listing.fixed.bathwareGroup);
    items = products.map((product, order) => {
      const { data } = product.entry;
      const facets: Facets = {
        type: [data.bathwareType ?? data.adhesiveType].filter((v): v is string => !!v),
        brand: [data.brand.id],
        finish: data.finishes,
        use: data.uses,
        colour: data.colourFamily ? [data.colourFamily] : [],
      };
      return { type: 'product', product, id: product.entry.id, name: data.name, facets, order };
    });
    const colour = group('colour', 'Colour', 'dot', colourFamilies.map((c) => ({ value: c.value, label: c.label, swatch: c.hex })), items);
    groups =
      listing.kind === 'bathware'
        ? [
            group('type', 'Type', 'check', bathwareTypes.map((t) => ({ value: t.value, label: t.label })), items),
            group('brand', 'Brand', 'check', brands, items),
            group('finish', 'Finish', 'chip', [...bathwareFinishes], items),
          ]
        : listing.kind === 'granite'
          ? [colour, group('finish', 'Finish', 'chip', [...graniteFinishes], items), group('use', 'Use', 'check', [...graniteUses], items)]
          : [
              group('type', 'Type', 'check', [...adhesiveTypes], items),
              group('use', 'Use', 'check', [...adhesiveUses], items),
              group('brand', 'Brand', 'check', brands, items),
            ];
  }

  // Hide groups with nothing to choose between; open the first two.
  const visible = groups.filter((g) => g.options.length > 1);
  visible.forEach((g, i) => (g.open = i < 2));
  return { items, groups: visible };
}
