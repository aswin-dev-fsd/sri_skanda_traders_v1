/**
 * Site-wide settings: business details, navigation and feature flags.
 *
 * Values written as `[LIKE THIS]` are placeholders the client still has to supply.
 * `npm run build:launch` fails while any placeholder remains (see scripts/check-launch.mjs).
 */

export const business = {
  name: 'Sri Skanda Traders',
  tagline: "People's Trust",
  categories: 'Tiles | Granite | Bathware',
  location: 'Sulur, Coimbatore',
  /** Display format, e.g. "+91 98765 43210". */
  phone: '[PHONE]',
  /** Digits only with country code, e.g. "919876543210" (used in wa.me links). */
  whatsapp: '[WHATSAPP NUMBER]',
  email: '[EMAIL]',
  address: '[ADDRESS]',
  hours: '[OPENING HOURS]',
  /** Opening hours for the Contact page table. */
  hoursTable: [{ days: '[DAYS]', times: '[TIMES]' }],
  landmark: '[NEARBY LANDMARK]',
  /** Parking note for the Contact page. Set to '' if there is none, and the line is hidden. */
  parking: '[PARKING NOTE]',
  /** "Areas we serve" chips on the Contact page. */
  areasServed: ['Sulur', 'Trichy Road', 'Karanampettai', 'Neelambur', 'Palladam', 'Coimbatore city'],
  mapsUrl: '[GOOGLE MAPS LINK]',
  social: {
    instagram: '[INSTAGRAM URL]',
    facebook: '[FACEBOOK URL]',
    youtube: '[YOUTUBE URL]',
  },
  authorisedDealers: [
    { brand: 'Johnson', range: 'Sanitary ware & CP fittings' },
    { brand: 'JSW', range: 'Adhesives' },
  ],
} as const;

/** True for a value the client has not supplied yet, e.g. `[PHONE]`. */
export function isPlaceholder(value: string): boolean {
  return /^\[.+\]$/.test(value);
}

/** Every page route. Listing URLs follow the brief: `/tiles/living-room`, `/collection/[name]`. */
export const routes = {
  home: '/',
  products: '/products',
  tiles: '/tiles',
  floorTiles: '/tiles/floor',
  wallTiles: '/tiles/wall',
  vitrifiedTiles: '/tiles/vitrified',
  bathware: '/bathware',
  sanitaryWare: '/bathware/sanitary-ware',
  faucets: '/bathware/faucets',
  accessories: '/bathware/accessories',
  granite: '/granite',
  adhesives: '/adhesives',
  visualizer: '/visualizer',
  mySelection: '/my-selection',
  gallery: '/gallery',
  about: '/about',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
} as const;

/** Spaces, in the brief's order. Each has a tiles listing at `/tiles/<slug>`. */
export const spaces = [
  { label: 'Living', name: 'Living room', slug: 'living-room' },
  { label: 'Bedroom', name: 'Bedroom', slug: 'bedroom' },
  { label: 'Kitchen', name: 'Kitchen', slug: 'kitchen' },
  { label: 'Bathroom', name: 'Bathroom', slug: 'bathroom' },
  { label: 'Parking', name: 'Parking', slug: 'parking' },
  { label: 'Elevation', name: 'Elevation', slug: 'elevation' },
  { label: 'Outdoor', name: 'Outdoor', slug: 'outdoor' },
] as const;

/** Main menu. The logo links to Home, so Home is not listed. */
export const nav = [
  { label: 'Products', href: routes.products },
  { label: '3D Visualizer', href: routes.visualizer },
  { label: 'Gallery', href: routes.gallery },
  { label: 'About', href: routes.about },
  { label: 'Contact', href: routes.contact },
] as const;

/** Products mega menu (brief Prompt 00, Header). */
export const productMenu = [
  {
    title: 'Tiles',
    links: [
      { label: 'Floor tiles', href: routes.floorTiles },
      { label: 'Wall tiles', href: routes.wallTiles },
      { label: 'Vitrified tiles', href: routes.vitrifiedTiles },
    ],
  },
  {
    title: 'Shop by space',
    links: spaces.map((s) => ({ label: s.label, href: `${routes.tiles}/${s.slug}` })),
  },
  {
    title: 'Bathware',
    links: [
      { label: 'Sanitary ware', href: routes.sanitaryWare },
      { label: 'Faucets', href: routes.faucets },
      { label: 'Accessories', href: routes.accessories },
    ],
  },
  {
    title: 'More',
    links: [
      { label: 'Granite', href: routes.granite },
      { label: 'Adhesives', href: routes.adhesives },
    ],
  },
];

/** Footer link columns. */
export const footerMenu = {
  products: [
    { label: 'Floor tiles', href: routes.floorTiles },
    { label: 'Wall tiles', href: routes.wallTiles },
    { label: 'Vitrified tiles', href: routes.vitrifiedTiles },
    { label: 'Bathware', href: routes.bathware },
    { label: 'Granite', href: routes.granite },
    { label: 'Adhesives', href: routes.adhesives },
  ],
  explore: [
    { label: '3D Visualizer', href: routes.visualizer },
    { label: 'My Selection', href: routes.mySelection },
    { label: 'Gallery', href: routes.gallery },
    { label: 'About', href: routes.about },
    { label: 'Contact', href: routes.contact },
  ],
};

/** Path prefixes that mark the Products menu item as active. */
export const productPaths = ['/products', '/tiles', '/bathware', '/granite', '/adhesives', '/collection', '/product'];

export const features = {
  /** Visualizer page, Home visualizer band and every "Try in 3D" button. */
  visualizer: true,
  /** Showroom tablet mode, turned on per visit with `?mode=showroom`. */
  showroomMode: true,
  /** Header search with instant suggestions. */
  search: true,
} as const;

/** Pre-filled WhatsApp message. `{topic}` is replaced with the page or collection name. */
export const whatsappMessage = "Hi Sri Skanda Traders, I'd like to know more about {topic}.";
