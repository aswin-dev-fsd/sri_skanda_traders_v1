import type { ImageMetadata } from 'astro';

// Temporary AI images (see docs/IMAGE-PROMPTS.md). Files are optional: a page shows a labelled
// placeholder until the matching file is saved. The launch check flags this folder by design.
const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/_temp/**/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
});

/**
 * Finds a temporary image by name, whatever its extension.
 * @param name Path inside src/assets/_temp/ without extension, e.g. "home/hero-floor-1".
 * @returns The image, or undefined if it has not been added yet.
 */
export function tempImage(name: string): ImageMetadata | undefined {
  const match = Object.entries(files).find(([path]) => path.replace(/\.[a-z]+$/, '').endsWith(`/_temp/${name}`));
  return match?.[1].default;
}
