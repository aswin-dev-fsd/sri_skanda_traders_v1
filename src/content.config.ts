/**
 * Catalogue schema (from the brief's suggested data model). One YAML file per tile collection
 * (src/content/tiles/) and per product (src/content/products/); brands in src/content/brands.yaml. A missing or misspelt field fails the build.
 *
 * Entries with `placeholder: true` are fictional demo data; `npm run check:launch` lists them.
 */
import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { spaces } from '@/config/site';
import {
  adhesiveTypes,
  adhesiveUses,
  applications,
  bathwareFinishes,
  bathwareTypes,
  colourFamilies,
  graniteFinishes,
  graniteUses,
  looks,
  productCategories,
  tileCategories,
  tileFeatures,
  tileFinishes,
  values,
} from '@/config/catalogue';

/** Tile size in mm, written "600x1200" (width x height). */
const size = z.string().regex(/^\d{2,4}x\d{2,4}$/, 'Write sizes as 600x1200 (mm)');
/** CSS colour used for the colour dots and as a stand-in face until photos arrive. */
const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Use a 6-digit hex colour like #E3D8C4');
const space = z.enum(spaces.map((s) => s.slug) as [string, ...string[]]);

const brands = defineCollection({
  loader: file('src/content/brands.yaml'),
  schema: z.object({
    name: z.string(),
    /** Authorised dealership, shown as a tag and on the About page. */
    authorised: z.boolean().default(false),
    /** What the dealership covers, e.g. "Sanitary ware & CP fittings". */
    range: z.string().optional(),
    placeholder: z.boolean().default(false),
  }),
});

/** Tile collections. Each colour of a collection is a separate shortlist item. */
const tiles = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/tiles' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      brand: reference('brands'),
      /** One line under the collection name. */
      description: z.string(),
      categories: z.array(z.enum(values(tileCategories))).min(1),
      spaces: z.array(space).min(1),
      looks: z.array(z.enum(values(looks))).min(1),
      /** Only features the brand states for this collection. */
      features: z.array(z.enum(values(tileFeatures))).default([]),
      heroImage: image().optional(),
      roomImages: z.array(z.object({ image: image(), caption: z.string() })).default([]),
      colours: z
        .array(
          z.object({
            name: z.string(),
            code: z.string(),
            family: z.enum(values(colourFamilies)),
            hex,
            tileFace: image().optional(),
            texture: image().optional(),
            finishes: z.array(z.enum(values(tileFinishes))).min(1),
            sizes: z.array(size).min(1),
            application: z.enum(values(applications)),
            /** e.g. "9 mm". */
            thickness: z.string().optional(),
          }),
        )
        .min(1),
      decor: z
        .array(
          z.object({
            name: z.string(),
            code: z.string(),
            size,
            image: image().optional(),
          }),
        )
        .default([]),
      isNew: z.boolean().default(false),
      isTrending: z.boolean().default(false),
      placeholder: z.boolean().default(false),
    }),
});

const products = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/products' }),
  schema: ({ image }) =>
    z
      .object({
        name: z.string(),
        code: z.string(),
        brand: reference('brands'),
        category: z.enum(values(productCategories)),
        /** Bathware only. */
        bathwareType: z.enum(values(bathwareTypes)).optional(),
        /** Granite: polished/flamed/leather. Bathware: chrome/matt-black/white. */
        finishes: z.array(z.string()).default([]),
        /** Granite: kitchen-top/flooring/…; adhesives: floor/wall/…. */
        uses: z.array(z.string()).default([]),
        /** Granite colour family. */
        colourFamily: z.enum(values(colourFamilies)).optional(),
        /** Adhesives only. */
        adhesiveType: z.enum(values(adhesiveTypes)).optional(),
        /** The one spec on the card, e.g. "Wall-hung · 520 × 360 mm". */
        keySpec: z.string(),
        /** Full spec table: label → value, e.g. Dimensions: "520 × 360 × 340 mm". */
        specs: z.record(z.string(), z.string()).default({}),
        features: z.array(z.string()).default([]),
        images: z.array(image()).default([]),
        /** Stand-in colour until product photos arrive. */
        hex: hex.optional(),
        placeholder: z.boolean().default(false),
      })
      .superRefine((p, ctx) => {
        const issue = (message: string) => ctx.addIssue({ code: 'custom', message });
        const finishSet: readonly string[] =
          p.category === 'bathware' ? values(bathwareFinishes) : p.category === 'granite' ? values(graniteFinishes) : [];
        const useSet: readonly string[] =
          p.category === 'granite' ? values(graniteUses) : p.category === 'adhesives' ? values(adhesiveUses) : [];
        if (p.category === 'bathware' && !p.bathwareType) issue('Bathware needs a bathwareType');
        if (p.category === 'adhesives' && !p.adhesiveType) issue('Adhesives need an adhesiveType');
        if (p.category === 'granite' && !p.colourFamily) issue('Granite needs a colourFamily');
        p.finishes.filter((f) => !finishSet.includes(f)).forEach((f) => issue(`Unknown ${p.category} finish "${f}"`));
        p.uses.filter((u) => !useSet.includes(u)).forEach((u) => issue(`Unknown ${p.category} use "${u}"`));
      }),
});

/** Finished homes for the Gallery (one YAML per project). Every project leads back to its tiles. */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Locality, e.g. "Sulur". The lightbox label reads "<area>, Coimbatore". */
      area: z.string(),
      space,
      note: z.string().default(''),
      photos: z.array(z.object({ image: image(), caption: z.string().default('') })).default([]),
      tilesUsed: z.array(reference('tiles')).default([]),
      placeholder: z.boolean().default(false),
    }),
});

/** Customer reviews. Real reviews only: until the client supplies them, entries are placeholders. */
const reviews = defineCollection({
  loader: file('src/content/reviews.yaml'),
  schema: z.object({
    name: z.string(),
    area: z.string(),
    text: z.string(),
    source: z.enum(['google', 'showroom', 'whatsapp']).default('google'),
    /** e.g. "October 2026". */
    date: z.string().default(''),
    /** YouTube or MP4 link for a video testimonial. */
    videoUrl: z.string().url().optional(),
    placeholder: z.boolean().default(false),
  }),
});

export const collections = { brands, tiles, products, projects, reviews };
