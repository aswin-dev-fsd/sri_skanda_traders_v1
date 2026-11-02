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
  landmark: '[NEARBY LANDMARK]',
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

/** Main menu. The logo links to Home, so Home is not listed. */
export const nav = [
  { label: 'Products', href: '/products' },
  { label: '3D Visualizer', href: '/visualizer' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

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
