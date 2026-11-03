/**
 * Search index for the header's instant suggestions, built at build time as /search-index.json.
 * Covers collections, their colour codes, products and every listing page (categories, spaces).
 */
import type { APIRoute } from 'astro';
import { listings } from '@/config/listings';
import { getProducts, getTiles } from '@/lib/catalogue';

export interface SearchEntry {
  type: 'collection' | 'colour' | 'product' | 'category';
  title: string;
  /** Second line: brand, code or what the page lists. */
  sub: string;
  href: string;
  /** Extra text to match on (codes, looks, spaces). */
  keywords: string;
  swatch?: string;
}

export const GET: APIRoute = async () => {
  const entries: SearchEntry[] = [];

  for (const t of await getTiles()) {
    const { data } = t.entry;
    entries.push({
      type: 'collection',
      title: data.name,
      sub: `${t.brand.name} · ${t.colours} colours`,
      href: t.href,
      keywords: [...data.looks, ...data.spaces, ...data.categories, ...data.colours.map((c) => c.code)].join(' '),
      swatch: data.colours[0].hex,
    });
    for (const c of data.colours) {
      entries.push({
        type: 'colour',
        title: `${data.name} · ${c.name}`,
        sub: c.code,
        href: `${t.href}#colour-${c.code}`,
        keywords: `${c.code} ${c.family}`,
        swatch: c.hex,
      });
    }
  }

  for (const p of await getProducts()) {
    const { data } = p.entry;
    entries.push({
      type: 'product',
      title: data.name,
      sub: `${p.brand.name} · ${data.code}`,
      href: p.href,
      keywords: [data.code, data.category, data.bathwareType ?? '', data.adhesiveType ?? '', p.brand.name].join(' '),
      swatch: data.hex,
    });
  }

  for (const l of listings.filter((l) => !l.canonical)) {
    entries.push({ type: 'category', title: l.title, sub: l.intro, href: l.path, keywords: l.kind });
  }

  return new Response(JSON.stringify(entries), { headers: { 'Content-Type': 'application/json' } });
};
