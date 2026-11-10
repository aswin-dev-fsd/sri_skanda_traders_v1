// Downloads the temporary stock photos listed in photos.json (Unsplash License) into
// src/assets/_temp/<name>.jpg at 1600px wide, re-encoded at JPEG quality 72. Files that already exist are skipped.
//
// Run: node scripts/temp-images/download-photos.mjs
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '../..');
const { photos } = JSON.parse(await readFile(path.join(import.meta.dirname, 'photos.json'), 'utf8'));

let fetched = 0;
for (const p of photos) {
  const file = path.join(root, 'src/assets/_temp', `${p.name}.jpg`);
  try {
    await access(file);
    continue;
  } catch {}
  const res = await fetch(`https://images.unsplash.com/photo-${p.id}?w=1600&q=75&fm=jpg&fit=max`);
  if (!res.ok) throw new Error(`${p.name}: HTTP ${res.status}`);
  await mkdir(path.dirname(file), { recursive: true });
  // Re-encode smaller; Astro still makes its own responsive sizes at build time.
  await writeFile(file, await sharp(Buffer.from(await res.arrayBuffer())).jpeg({ quality: 72, mozjpeg: true }).toBuffer());
  fetched++;
}
console.log(`Downloaded ${fetched} photos (${photos.length - fetched} already present).`);
