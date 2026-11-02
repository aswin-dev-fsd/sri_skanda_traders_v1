// @ts-check
import { defineConfig } from 'astro/config';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // TODO: set `site` once the domain is known (needed for canonical URLs and the sitemap).
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
});
