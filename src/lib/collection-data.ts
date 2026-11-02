/**
 * Build-time view model for a Collection page: labels resolved, sizes formatted, a shortlist item
 * per colour, image URLs ready for the browser, and similar collections.
 */
import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';
import { label, tileFeatures, tileFinishes } from '@/config/catalogue';
import { formatSize, getTiles, summarise, type TileEntry, type TileSummary } from '@/lib/catalogue';
import type { SelectionItem } from '@/lib/types';

export interface ColourView {
  name: string;
  code: string;
  hex: string;
  /** CSS background: the tile-face photo when there is one, else a flat stand-in. */
  face: string;
  /** Image URL for the lightbox, when there is a photo. */
  faceSrc?: string;
  texture: string;
  textureSrc?: string;
  finishes: { value: string; label: string; sheen: boolean; tip: string }[];
  sizes: string[];
  rawSizes: string[];
  application: string;
  thickness?: string;
  item: SelectionItem;
}

export interface CollectionView {
  summary: TileSummary;
  colours: ColourView[];
  features: { value: string; label: string; icon: string; explain: string }[];
  allSizes: string[];
  similar: TileSummary[];
}

/** A soft stand-in face built from the colour, so swatches look like tiles until photos arrive. */
const standIn = (hex: string) => `linear-gradient(135deg, ${hex} 0%, color-mix(in srgb, ${hex}, #000 12%) 100%)`;

async function url(image: ImageMetadata | undefined, width: number): Promise<string | undefined> {
  return image ? (await getImage({ src: image, width, format: 'webp' })).src : undefined;
}

/**
 * Everything the Collection page renders.
 * @param entry The tile collection.
 * @returns The view model.
 */
export async function buildCollection(entry: TileEntry): Promise<CollectionView> {
  const summary = await summarise(entry);
  const { data } = entry;

  const colours = await Promise.all(
    data.colours.map(async (c): Promise<ColourView> => {
      const faceSrc = await url(c.tileFace, 1000);
      const textureSrc = await url(c.texture, 1000);
      return {
        name: c.name,
        code: c.code,
        hex: c.hex,
        face: faceSrc ? `center / cover url("${faceSrc}")` : standIn(c.hex),
        faceSrc,
        texture: textureSrc ? `center / cover url("${textureSrc}")` : standIn(c.hex),
        textureSrc,
        finishes: c.finishes.map((f) => {
          const finish = tileFinishes.find((t) => t.value === f)!;
          return { value: f, label: finish.label, sheen: finish.sheen, tip: finish.tip };
        }),
        sizes: c.sizes.map(formatSize),
        rawSizes: c.sizes,
        application: label.application[c.application],
        thickness: c.thickness,
        item: {
          id: `${entry.id}:${c.code}`,
          kind: 'collection',
          name: data.name,
          colour: c.name,
          code: c.code,
          size: c.sizes.map(formatSize).join(', '),
          brand: summary.brand.name,
          href: `${summary.href}#colour-${c.code}`,
          swatch: c.hex,
          thumb: faceSrc,
        },
      };
    }),
  );

  // Similar: most shared looks and spaces, then trending.
  const score = (t: TileSummary) =>
    t.entry.data.looks.filter((l) => data.looks.includes(l)).length * 2 +
    t.entry.data.spaces.filter((s) => data.spaces.includes(s)).length +
    Number(t.entry.data.isTrending) * 0.5;
  const similar = (await getTiles())
    .filter((t) => t.entry.id !== entry.id)
    .sort((a, b) => score(b) - score(a))
    .slice(0, 4);

  const allSizes = [...new Set(data.colours.flatMap((c) => c.sizes))].sort((a, b) => {
    const area = (s: string) => s.split('x').map(Number).reduce((x, y) => x * y, 1);
    return area(a) - area(b);
  });

  return {
    summary,
    colours,
    features: data.features.map((f) => tileFeatures.find((t) => t.value === f)!),
    allSizes,
    similar,
  };
}
