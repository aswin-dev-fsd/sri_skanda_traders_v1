// Launch guard: lists placeholder business details in src/config/site.ts and
// references to temporary images (src/assets/_temp/) anywhere in src/.
//
// Strict (exits 1 when anything is found) with `--strict` or on a Vercel production
// deploy (VERCEL_ENV=production). Otherwise it only prints a warning.

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(root, 'src');
const tempDir = path.join(srcDir, 'assets', '_temp');
const strict = process.argv.includes('--strict') || process.env.VERCEL_ENV === 'production';

const PLACEHOLDER = /^\[.+\]$/;
const SCANNED = new Set(['.astro', '.ts', '.js', '.mjs', '.css', '.md', '.mdx', '.yaml', '.yml', '.json']);

/** Collects dotted key paths of every `[PLACEHOLDER]` string inside `value`. */
function findPlaceholders(value, keyPath, out) {
  if (typeof value === 'string') {
    if (PLACEHOLDER.test(value)) out.push(`${keyPath} = ${value}`);
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      findPlaceholders(child, keyPath ? `${keyPath}.${key}` : key, out);
    }
  }
  return out;
}

/** Lists `file:line` for every reference to the _temp folder outside the folder itself. */
async function findTempImageRefs() {
  const refs = [];
  const entries = await readdir(srcDir, { recursive: true, withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile() || !SCANNED.has(path.extname(entry.name))) continue;
    const file = path.join(entry.parentPath, entry.name);
    if (file.startsWith(tempDir + path.sep)) continue;
    const lines = (await readFile(file, 'utf8')).split('\n');
    lines.forEach((line, i) => {
      if (line.includes('_temp/')) refs.push(`${path.relative(root, file)}:${i + 1}`);
    });
  }
  return refs;
}

const site = await import(pathToFileURL(path.join(srcDir, 'config', 'site.ts')).href);
const placeholders = findPlaceholders(site.business, 'business', []);
const tempRefs = await findTempImageRefs();

if (placeholders.length === 0 && tempRefs.length === 0) {
  console.log('Launch check: no placeholders or temporary images.');
  process.exit(0);
}

const report = [
  ...(placeholders.length ? ['Placeholder business details (src/config/site.ts):', ...placeholders.map((p) => `  - ${p}`)] : []),
  ...(tempRefs.length ? ['Temporary image references:', ...tempRefs.map((r) => `  - ${r}`)] : []),
].join('\n');

if (strict) {
  console.error(`Launch check FAILED. Replace these before launch:\n${report}`);
  process.exit(1);
}
console.warn(`Launch check (warning only, not a production build):\n${report}`);
