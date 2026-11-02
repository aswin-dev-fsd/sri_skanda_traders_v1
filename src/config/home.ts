/**
 * Home page content that is not catalogue data. Copy is the brief's (Prompt 01).
 * Image names refer to src/assets/_temp/ (see docs/IMAGE-PROMPTS.md).
 */

/** Hero "Try a floor": the same living room with three floors. Chips use catalogue collections. */
export const heroFloors = [
  {
    name: 'Ivory Marble',
    image: 'home/hero-floor-1',
    chip: 'linear-gradient(135deg, #F4F0E8 0%, #DCD2C0 100%)',
    placeholder: 'linear-gradient(180deg, #EFEAE0 0 62%, #ECE6D9 62% 100%)',
  },
  {
    name: 'Oak Plank',
    image: 'home/hero-floor-2',
    chip: 'repeating-linear-gradient(90deg, #BF956A 0 12px, #A57C55 12px 14px)',
    placeholder: 'linear-gradient(180deg, #EFEAE0 0 62%, #B98F66 62% 100%)',
  },
  {
    name: 'Concrete Grey',
    image: 'home/hero-floor-3',
    chip: 'linear-gradient(135deg, #BEBCB6 0%, #93918B 100%)',
    placeholder: 'linear-gradient(180deg, #EFEAE0 0 62%, #A9A7A1 62% 100%)',
  },
] as const;

/** Visualizer band before / after slider. */
export const beforeAfter = {
  before: { image: 'home/before', label: 'Before', placeholder: 'linear-gradient(180deg, #EFEAE0 0 62%, #C9BEAA 62% 100%)' },
  after: { image: 'home/after', label: 'After', placeholder: 'linear-gradient(180deg, #EFEAE0 0 62%, #A9A7A1 62% 100%)' },
} as const;

/** Section 06 — Why Sri Skanda. */
export const reasons = [
  { title: 'Every size, every brand', body: 'Compare collections from many brands side by side, under one roof.' },
  { title: 'Honest advice', body: 'We help you choose what suits your home and your budget.' },
  { title: 'Free delivery', body: 'Your tiles reach your site safely and on time.' },
  { title: 'Measurement & laying support', body: 'We measure your site and support the laying, start to finish.' },
] as const;

/** Section 08 — reviews. Only real reviews: placeholders until the client supplies them. */
export const reviews = [
  { text: '[REVIEW TEXT — client to provide]', name: '[NAME]', area: '[AREA]', source: 'google' },
  { text: '[REVIEW TEXT — client to provide]', name: '[NAME]', area: '[AREA]', source: 'google' },
  { text: '[REVIEW TEXT — client to provide]', name: '[NAME]', area: '[AREA]', source: 'google' },
] as const;

/** Section 08 — featured project. */
export const featuredProject = {
  title: '[Project name]',
  area: '[Area]',
  collection: '[Collection name]',
  /** Collection id for "Shop this look". */
  collectionId: '',
} as const;
