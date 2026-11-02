/**
 * Catalogue taxonomy: every filter value the site knows, with its display label.
 * The content schema (src/content.config.ts) only accepts values listed here.
 * Spaces live in site.ts because the menus use them too.
 */

/** Builds a `{ value: label }` lookup from a list of options. */
const labels = <T extends readonly { value: string; label: string }[]>(options: T) =>
  Object.fromEntries(options.map((o) => [o.value, o.label])) as Record<T[number]['value'], string>;

export const tileCategories = [
  { value: 'floor', label: 'Floor tiles' },
  { value: 'wall', label: 'Wall tiles' },
  { value: 'vitrified', label: 'Vitrified tiles' },
] as const;

export const looks = [
  { value: 'marble', label: 'Marble' },
  { value: 'stone', label: 'Stone' },
  { value: 'wood', label: 'Wood' },
  { value: 'concrete', label: 'Concrete' },
  { value: 'plain', label: 'Plain' },
  { value: 'decor', label: 'Decor' },
  { value: 'metallic', label: 'Metallic' },
  { value: 'rustic', label: 'Rustic' },
] as const;

/** Colour families for the Colour filter (round dots). */
export const colourFamilies = [
  { value: 'white', label: 'White', hex: '#F4F2EC' },
  { value: 'cream', label: 'Cream', hex: '#EEE3CB' },
  { value: 'beige', label: 'Beige', hex: '#D9C7A7' },
  { value: 'grey', label: 'Grey', hex: '#A9A7A1' },
  { value: 'brown', label: 'Brown', hex: '#8A6446' },
  { value: 'black', label: 'Black', hex: '#2C302E' },
  { value: 'special', label: 'Special', hex: 'conic-gradient(#B98F66, #6F8F87, #C9B79C, #B98F66)' },
] as const;

/** `tip` is the one line on the Collection page about where each finish works best. */
export const tileFinishes = [
  { value: 'glossy', label: 'Glossy', sheen: true, tip: 'Reflects light and makes rooms feel brighter. Best on walls and low-traffic floors.' },
  { value: 'matt', label: 'Matt', sheen: false, tip: 'Hides marks and gives better grip. Best for busy floors, bathrooms and outdoors.' },
  { value: 'satin', label: 'Satin', sheen: false, tip: 'A soft glow that is easier to keep clean than glossy.' },
  { value: 'polished', label: 'Polished', sheen: true, tip: 'A deep, mirror-like shine for living rooms and feature walls.' },
  { value: 'rustic', label: 'Rustic / Carving', sheen: false, tip: 'Textured for grip and character. Best outdoors and on elevations.' },
] as const;

/** Features shown on the Collection page, with the one-line explanation from the brief's style. */
export const tileFeatures = [
  { value: 'anti-skid', label: 'Anti-skid', icon: 'grip', explain: 'Better grip, safer for bathrooms and outdoors.' },
  { value: 'stain-resistant', label: 'Stain resistant', icon: 'drop', explain: 'Spills wipe off without leaving marks.' },
  { value: 'scratch-resistant', label: 'Scratch resistant', icon: 'shield', explain: 'Stands up to furniture and daily footfall.' },
  { value: 'easy-to-clean', label: 'Easy to clean', icon: 'sparkle', explain: 'A quick mop keeps it looking new.' },
  { value: 'frost-resistant', label: 'Frost resistant', icon: 'snowflake', explain: 'Handles cold and wet without cracking.' },
  { value: 'heat-resistant', label: 'Heat resistant', icon: 'sun', explain: 'Suits sunny terraces and kitchen walls.' },
] as const;

export const applications = [
  { value: 'floor', label: 'Floor' },
  { value: 'wall', label: 'Wall' },
  { value: 'both', label: 'Floor & wall' },
] as const;

export const productCategories = [
  { value: 'bathware', label: 'Bathware' },
  { value: 'granite', label: 'Granite' },
  { value: 'adhesives', label: 'Adhesives' },
] as const;

/** Bathware groups match the mega menu: Sanitary ware · Faucets · Accessories. */
export const bathwareGroups = [
  { value: 'sanitary-ware', label: 'Sanitary ware' },
  { value: 'faucets', label: 'Faucets' },
  { value: 'accessories', label: 'Accessories' },
] as const;

export const bathwareTypes = [
  { value: 'wall-hung-wc', label: 'Wall-hung WC', group: 'sanitary-ware' },
  { value: 'floor-mounted-wc', label: 'Floor-mounted WC', group: 'sanitary-ware' },
  { value: 'wash-basin', label: 'Wash basin', group: 'sanitary-ware' },
  { value: 'counter-top-basin', label: 'Counter-top basin', group: 'sanitary-ware' },
  { value: 'faucet', label: 'Faucet', group: 'faucets' },
  { value: 'shower', label: 'Shower', group: 'faucets' },
  { value: 'accessory', label: 'Accessory', group: 'accessories' },
] as const;

export const bathwareFinishes = [
  { value: 'chrome', label: 'Chrome' },
  { value: 'matt-black', label: 'Matt black' },
  { value: 'white', label: 'White' },
] as const;

export const graniteFinishes = [
  { value: 'polished', label: 'Polished' },
  { value: 'flamed', label: 'Flamed' },
  { value: 'leather', label: 'Leather' },
] as const;

export const graniteUses = [
  { value: 'kitchen-top', label: 'Kitchen top' },
  { value: 'flooring', label: 'Flooring' },
  { value: 'staircase', label: 'Staircase' },
  { value: 'elevation', label: 'Elevation' },
] as const;

export const adhesiveTypes = [
  { value: 'tile-adhesive', label: 'Tile adhesive' },
  { value: 'stone-adhesive', label: 'Stone adhesive' },
  { value: 'grout', label: 'Grout' },
] as const;

export const adhesiveUses = [
  { value: 'floor', label: 'Floor' },
  { value: 'wall', label: 'Wall' },
  { value: 'wet-area', label: 'Wet areas' },
  { value: 'exterior', label: 'Exterior' },
] as const;

export const label = {
  tileCategory: labels(tileCategories),
  look: labels(looks),
  colourFamily: labels(colourFamilies),
  tileFinish: labels(tileFinishes),
  tileFeature: labels(tileFeatures),
  application: labels(applications),
  productCategory: labels(productCategories),
  bathwareGroup: labels(bathwareGroups),
  bathwareType: labels(bathwareTypes),
  bathwareFinish: labels(bathwareFinishes),
  graniteFinish: labels(graniteFinishes),
  graniteUse: labels(graniteUses),
  adhesiveType: labels(adhesiveTypes),
  adhesiveUse: labels(adhesiveUses),
};

/** Values as a non-empty tuple, for z.enum(). */
export const values = <T extends readonly { value: string }[]>(options: T) =>
  options.map((o) => o.value) as unknown as [T[number]['value'], ...T[number]['value'][]];
