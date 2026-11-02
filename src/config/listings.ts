/**
 * Every listing page served by the one Products template (brief Prompt 02): its URL, heading,
 * intro, which tab is active, the filters fixed by the URL, and the short guide at the bottom.
 */
import { routes, spaces } from '@/config/site';

export type ListingKind = 'tiles' | 'bathware' | 'granite' | 'adhesives';
export type TileCategory = 'floor' | 'wall' | 'vitrified';

export interface Listing {
  path: string;
  kind: ListingKind;
  title: string;
  /** One-line intro under the heading. */
  intro: string;
  /** Meta description. */
  description: string;
  crumbs: { label: string; href?: string }[];
  /** Tiles sub-tab (All · Floor · Wall · Vitrified). */
  tileTab?: 'all' | TileCategory;
  /** Filters set by the URL itself; not shown in the sidebar. */
  fixed: { category?: TileCategory; space?: string; bathwareGroup?: 'sanitary-ware' | 'faucets' | 'accessories' };
  guide: { title: string; paragraphs: string[] };
  /** For /products: canonical URL of the same content. */
  canonical?: string;
}

const home = { label: 'Home', href: routes.home };
const titleCase = (text: string) => text.replace(/\b\w/g, (c) => c.toUpperCase());
const tilesCrumb = { label: 'Tiles', href: routes.tiles };
const bathCrumb = { label: 'Bathware', href: routes.bathware };

const tileGuide = {
  title: 'Choosing tiles',
  paragraphs: [
    'Start with the room. Busy floors such as the living room, kitchen and parking need hard-wearing vitrified or porcelain tiles; bathrooms and outdoor areas need a matt or anti-skid finish for grip.',
    'Big formats like 600 × 1200 mm and above suit large rooms and mean fewer joints. Smaller sizes suit compact rooms, bathrooms and walls.',
    'Glossy and polished finishes reflect light and make rooms feel brighter. Matt finishes hide marks and footprints. Light tones make small rooms feel bigger; darker tones add warmth and hide dust.',
    'Save the collections you like to My Selection and see the real samples at our showroom before you decide. Colours on screen always look a little different.',
  ],
};

const spaceIntros: Record<string, string> = {
  'living-room': 'Calm, easy-care floors and walls for the room your family uses most.',
  bedroom: 'Warm, quiet floors that feel good under bare feet.',
  kitchen: 'Stain-resistant floors and easy-clean wall tiles for busy kitchens.',
  bathroom: 'Anti-skid floors and easy-clean walls for safe, bright bathrooms.',
  parking: 'Heavy-duty, anti-skid tiles made for cars, bikes and rain.',
  elevation: 'Weather-proof cladding that gives your home a strong first impression.',
  outdoor: 'Tiles for verandas, terraces and courtyards that handle sun and rain.',
};

const tileCategoryPages: { slug: TileCategory; title: string; intro: string }[] = [
  { slug: 'floor', title: 'Floor Tiles', intro: 'Hard-wearing floors in every look, from marble to wood.' },
  { slug: 'wall', title: 'Wall Tiles', intro: 'Wall tiles for kitchens, bathrooms, feature walls and elevations.' },
  {
    slug: 'vitrified',
    title: 'Vitrified Tiles',
    intro: 'Strong, low-water-absorption tiles that suit busy floors.',
  },
];

const bathwareGroups = [
  { slug: 'sanitary-ware', title: 'Sanitary Ware', intro: 'WCs and basins from Johnson and other trusted brands.' },
  { slug: 'faucets', title: 'Faucets & Showers', intro: 'Mixers, taps and showers in chrome and matt black.' },
  { slug: 'accessories', title: 'Bathroom Accessories', intro: 'Towel rings, shelves and the finishing touches.' },
] as const;

const bathGuide = {
  title: 'Choosing bathware',
  paragraphs: [
    'Wall-hung WCs make bathrooms look bigger and are easy to clean under; floor-mounted WCs are simpler to fit in older homes.',
    'Match faucet finishes across the bathroom: chrome is easy to keep shiny, matt black hides water marks.',
    'We are authorised dealers for Johnson sanitary ware and CP fittings, so you get genuine products with full warranty.',
  ],
};

export const listings: Listing[] = [
  {
    path: routes.products,
    kind: 'tiles',
    title: 'Products',
    intro: 'Tiles, bathware, granite and adhesives from brands you trust.',
    description: 'Browse floor and wall tiles, bathware, granite and adhesives at Sri Skanda Traders, Sulur, Coimbatore.',
    crumbs: [home, { label: 'Products' }],
    tileTab: 'all',
    fixed: {},
    guide: tileGuide,
    canonical: routes.tiles,
  },
  {
    path: routes.tiles,
    kind: 'tiles',
    title: 'All Tiles',
    intro: 'Floor and wall tiles from many brands, side by side.',
    description: 'Floor, wall and vitrified tiles from many brands at our showroom in Sulur, Coimbatore.',
    crumbs: [home, { label: 'Tiles' }],
    tileTab: 'all',
    fixed: {},
    guide: tileGuide,
  },
  ...tileCategoryPages.map(
    (c): Listing => ({
      path: `${routes.tiles}/${c.slug}`,
      kind: 'tiles',
      title: c.title,
      intro: c.intro,
      description: `${c.title} at Sri Skanda Traders, Sulur, Coimbatore. ${c.intro}`,
      crumbs: [home, tilesCrumb, { label: c.title }],
      tileTab: c.slug,
      fixed: { category: c.slug },
      guide: tileGuide,
    }),
  ),
  ...spaces.map(
    (s): Listing => ({
      path: `${routes.tiles}/${s.slug}`,
      kind: 'tiles',
      title: `${titleCase(s.name)} Tiles`,
      intro: spaceIntros[s.slug] ?? '',
      description: `${s.name} tiles at Sri Skanda Traders, Sulur, Coimbatore. ${spaceIntros[s.slug] ?? ''}`,
      crumbs: [home, tilesCrumb, { label: `${titleCase(s.name)} Tiles` }],
      tileTab: 'all',
      fixed: { space: s.slug },
      guide: { ...tileGuide, title: `Choosing ${s.name.toLowerCase()} tiles` },
    }),
  ),
  {
    path: routes.bathware,
    kind: 'bathware',
    title: 'Bathware',
    intro: 'Sanitary ware, faucets and accessories from brands you trust.',
    description: 'Johnson sanitary ware, faucets and bathroom accessories at Sri Skanda Traders, Coimbatore.',
    crumbs: [home, { label: 'Bathware' }],
    fixed: {},
    guide: bathGuide,
  },
  ...bathwareGroups.map(
    (g): Listing => ({
      path: `${routes.bathware}/${g.slug}`,
      kind: 'bathware',
      title: g.title,
      intro: g.intro,
      description: `${g.title} at Sri Skanda Traders, Sulur, Coimbatore. ${g.intro}`,
      crumbs: [home, bathCrumb, { label: g.title }],
      fixed: { bathwareGroup: g.slug },
      guide: bathGuide,
    }),
  ),
  {
    path: routes.granite,
    kind: 'granite',
    title: 'Granite',
    intro: 'Granite for kitchen tops, floors, staircases and elevations.',
    description: 'Granite slabs for kitchen tops, flooring, staircases and elevations at Sri Skanda Traders, Coimbatore.',
    crumbs: [home, { label: 'Granite' }],
    fixed: {},
    guide: {
      title: 'Choosing granite',
      paragraphs: [
        'Polished granite is the classic choice for kitchen tops: it resists stains and wipes clean. Leather and flamed finishes give more grip, so they suit staircases and outdoor steps.',
        'Darker granites hide stains best; lighter granites brighten small kitchens. See the full slab at our showroom, as natural stone varies from slab to slab.',
      ],
    },
  },
  {
    path: routes.adhesives,
    kind: 'adhesives',
    title: 'Adhesives',
    intro: 'Tile and stone adhesives from JSW, our authorised brand.',
    description: 'JSW tile and stone adhesives at Sri Skanda Traders, authorised dealer in Sulur, Coimbatore.',
    crumbs: [home, { label: 'Adhesives' }],
    fixed: {},
    guide: {
      title: 'Choosing an adhesive',
      paragraphs: [
        'Large-format tiles, granite and stone need a stronger adhesive than ordinary cement mortar, so they stay level and do not crack or come loose.',
        'Ask us which JSW adhesive suits your tile size and where it is going: floor, wall, wet areas or outside.',
      ],
    },
  },
];

/**
 * Finds a listing by its URL.
 * @param path Page URL, e.g. "/tiles/floor".
 * @returns The listing definition.
 */
export function listingFor(path: string): Listing {
  const listing = listings.find((l) => l.path === path);
  if (!listing) throw new Error(`No listing for ${path}`);
  return listing;
}

/** Top-level category tabs on every listing. */
export const categoryTabs: { kind: ListingKind; label: string; href: string }[] = [
  { kind: 'tiles', label: 'Tiles', href: routes.tiles },
  { kind: 'bathware', label: 'Bathware', href: routes.bathware },
  { kind: 'granite', label: 'Granite', href: routes.granite },
  { kind: 'adhesives', label: 'Adhesives', href: routes.adhesives },
];

/** Tiles sub-tabs. */
export const tileTabs = [
  { id: 'all', label: 'All', href: routes.tiles },
  { id: 'floor', label: 'Floor', href: routes.floorTiles },
  { id: 'wall', label: 'Wall', href: routes.wallTiles },
  { id: 'vitrified', label: 'Vitrified', href: routes.vitrifiedTiles },
] as const;
