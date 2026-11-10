// Draws temporary tile faces and textures from each colour's hex, so swatches, colour panels and
// textures show a tile surface until the client's real scans arrive. Granite products and decor
// tiles get the same treatment. Output: src/assets/_temp/tiles/ and src/assets/_temp/products/.
// Then wires the files into the catalogue YAML (tileFace, texture, decor image, granite images).
// Safe to re-run: images are overwritten, YAML lines are only added once.
//
// Run: node scripts/temp-images/draw-tiles.mjs
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '../..');
const tilesDir = path.join(root, 'src/content/tiles');
const productsDir = path.join(root, 'src/content/products');
const outTiles = path.join(root, 'src/assets/_temp/tiles');
const outProducts = path.join(root, 'src/assets/_temp/products');
const SIZE = 1024;

// --- Colour helpers -------------------------------------------------------------------------------
const toRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const toHex = (rgb) => '#' + rgb.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
/** Mixes a colour toward black (amount < 0) or white (amount > 0). */
const shade = (hex, amount) => toHex(toRgb(hex).map((v) => (amount < 0 ? v * (1 + amount) : v + (255 - v) * amount)));
const lum = (hex) => {
  const [r, g, b] = toRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};
/** Darker accent on light tiles, lighter accent on dark ones. */
const accent = (hex, strength) => (lum(hex) > 0.45 ? shade(hex, -strength) : shade(hex, strength));

/** Small deterministic random generator, seeded from a string. */
function rng(seedText) {
  let h = 2166136261;
  for (const ch of seedText) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

// --- Pattern layers (SVG) -------------------------------------------------------------------------
/** A noise layer tinted to one colour, with its strength as opacity. */
function noise({ id, color, freq, octaves = 4, type = 'fractalNoise', seed, opacity, contrast = 1.6 }) {
  return {
    defs: `<filter id="${id}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="${type}" baseFrequency="${freq}" numOctaves="${octaves}" seed="${seed}" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${contrast} 0 0 0 ${(1 - contrast) / 2}" result="mask"/>
      <feFlood flood-color="${color}"/>
      <feComposite in2="mask" operator="in"/>
    </filter>`,
    body: `<rect width="${SIZE}" height="${SIZE}" filter="url(#${id})" opacity="${opacity}"/>`,
  };
}

const svg = (base, layers, extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <defs>${layers.map((l) => l.defs).join('')}</defs>
  <rect width="${SIZE}" height="${SIZE}" fill="${base}"/>
  ${layers.map((l) => l.body).join('')}
  ${extra}
</svg>`;

// --- One drawing per look -------------------------------------------------------------------------
/**
 * Marble veins as drawn lines: a few long diagonal veins with hairline branches, wobbled by noise
 * so they look organic rather than ruled.
 */
function marbleVeins(seed, main, hair) {
  const rand = rng('veins' + seed);
  const path = (len, wiggle) => {
    let x = -50 + rand() * 300;
    let y = -50 + rand() * SIZE * 0.6;
    const ang = 0.35 + rand() * 0.6;
    const pts = [[x, y]];
    for (let i = 0; i < 6; i++) {
      x += (len / 6) * Math.cos(ang) + (rand() - 0.5) * wiggle;
      y += (len / 6) * Math.sin(ang) + (rand() - 0.5) * wiggle;
      pts.push([x, y]);
    }
    return 'M' + pts.map(([px, py]) => `${px.toFixed(0)} ${py.toFixed(0)}`).join(' L');
  };
  const lines = [];
  for (let i = 0; i < 3 + Math.floor(rand() * 2); i++)
    lines.push(`<path d="${path(SIZE * 1.6, 160)}" stroke="${main}" stroke-width="${(2 + rand() * 4).toFixed(1)}" opacity="${(0.45 + rand() * 0.35).toFixed(2)}"/>`);
  for (let i = 0; i < 12; i++)
    lines.push(`<path d="${path(SIZE * (0.3 + rand() * 0.6), 120)}" stroke="${hair}" stroke-width="${(0.6 + rand() * 1.2).toFixed(1)}" opacity="${(0.35 + rand() * 0.4).toFixed(2)}"/>`);
  return `<defs><filter id="wobble" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="${seed}"/>
      <feDisplacementMap in="SourceGraphic" scale="70"/>
      <feGaussianBlur stdDeviation="0.7"/>
    </filter></defs>
    <g fill="none" stroke-linecap="round" stroke-linejoin="round" filter="url(#wobble)">${lines.join('')}</g>`;
}

const draw = {
  marble(hex, seed) {
    return svg(
      hex,
      [noise({ id: 'cloud', color: shade(hex, lum(hex) > 0.5 ? -0.07 : 0.08), freq: 0.004, seed, opacity: 0.7 })],
      marbleVeins(seed, accent(hex, 0.38), accent(hex, 0.22)),
    );
  },
  gold(hex, seed) {
    // Calacatta: white body with warm gold-grey veins.
    return svg(hex, [noise({ id: 'cloud', color: shade(hex, -0.05), freq: 0.004, seed, opacity: 0.6 })], marbleVeins(seed, '#B08A4A', '#8E8A84'));
  },
  stone(hex, seed) {
    return svg(hex, [
      noise({ id: 'mottle', color: shade(hex, -0.18), freq: 0.012, octaves: 5, seed, opacity: 0.55 }),
      noise({ id: 'light', color: shade(hex, 0.14), freq: 0.03, octaves: 4, seed: seed + 3, opacity: 0.35 }),
      noise({ id: 'grain', color: shade(hex, -0.3), freq: 0.5, octaves: 2, seed: seed + 5, opacity: 0.25, contrast: 3 }),
    ]);
  },
  travertine(hex, seed) {
    const rand = rng(String(seed));
    const pores = Array.from({ length: 60 }, () => {
      const y = rand() * SIZE;
      const x = rand() * SIZE;
      return `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${(8 + rand() * 40).toFixed(0)}" ry="${(1.5 + rand() * 3).toFixed(1)}" fill="${shade(hex, -0.28)}" opacity="${(0.25 + rand() * 0.35).toFixed(2)}"/>`;
    }).join('');
    return svg(
      hex,
      [
        noise({ id: 'band', color: shade(hex, -0.12), freq: '0.001 0.03', octaves: 4, seed, opacity: 0.6 }),
        noise({ id: 'grain', color: shade(hex, -0.25), freq: 0.4, octaves: 2, seed: seed + 5, opacity: 0.18, contrast: 3 }),
      ],
      pores,
    );
  },
  slate(hex, seed) {
    return svg(hex, [
      noise({ id: 'cleft', color: shade(hex, -0.25), freq: '0.004 0.02', octaves: 5, seed, opacity: 0.6 }),
      noise({ id: 'sheen', color: shade(hex, 0.18), freq: '0.01 0.05', octaves: 3, seed: seed + 2, opacity: 0.35 }),
      noise({ id: 'grain', color: shade(hex, -0.35), freq: 0.6, octaves: 2, seed: seed + 5, opacity: 0.2, contrast: 3 }),
    ]);
  },
  concrete(hex, seed) {
    const rand = rng(String(seed));
    const pits = Array.from({ length: 140 }, () =>
      `<circle cx="${(rand() * SIZE).toFixed(0)}" cy="${(rand() * SIZE).toFixed(0)}" r="${(0.8 + rand() * 2.2).toFixed(1)}" fill="${shade(hex, -0.35)}" opacity="0.45"/>`,
    ).join('');
    return svg(
      hex,
      [
        noise({ id: 'cloud', color: shade(hex, -0.12), freq: 0.006, octaves: 4, seed, opacity: 0.55 }),
        noise({ id: 'fine', color: shade(hex, 0.12), freq: 0.7, octaves: 2, seed: seed + 4, opacity: 0.3, contrast: 3 }),
      ],
      pits,
    );
  },
  studs(hex, seed) {
    // Parking tile: concrete body with a raised stud grid for grip.
    const step = 128;
    const dots = [];
    for (let y = step / 2; y < SIZE; y += step)
      for (let x = step / 2; x < SIZE; x += step)
        dots.push(
          `<circle cx="${x}" cy="${y + 3}" r="22" fill="${shade(hex, -0.3)}" opacity="0.5"/><circle cx="${x}" cy="${y}" r="22" fill="${shade(hex, 0.06)}"/><circle cx="${x - 6}" cy="${y - 6}" r="8" fill="${shade(hex, 0.18)}" opacity="0.6"/>`,
        );
    return draw.concrete(hex, seed).replace('</svg>', dots.join('') + '</svg>');
  },
  wood(hex, seed) {
    return svg(
      hex,
      [
        noise({ id: 'grain', color: shade(hex, -0.3), freq: '0.0015 0.09', octaves: 4, seed, opacity: 0.75 }),
        noise({ id: 'figure', color: shade(hex, 0.12), freq: '0.002 0.02', octaves: 3, seed: seed + 2, opacity: 0.4 }),
        noise({ id: 'pores', color: shade(hex, -0.45), freq: '0.02 0.6', octaves: 1, seed: seed + 4, opacity: 0.18, contrast: 4 }),
      ],
      `<rect x="0" y="0" width="${SIZE}" height="${SIZE}" fill="none" stroke="${shade(hex, -0.35)}" stroke-width="6" opacity="0.5"/>`,
    );
  },
  terracotta(hex, seed) {
    return svg(
      hex,
      [
        noise({ id: 'fire', color: shade(hex, -0.22), freq: 0.008, octaves: 5, seed, opacity: 0.6 }),
        noise({ id: 'light', color: shade(hex, 0.16), freq: 0.02, octaves: 4, seed: seed + 3, opacity: 0.4 }),
        noise({ id: 'grain', color: shade(hex, -0.35), freq: 0.5, octaves: 2, seed: seed + 5, opacity: 0.22, contrast: 3 }),
      ],
      `<rect width="${SIZE}" height="${SIZE}" fill="none" stroke="${shade(hex, -0.3)}" stroke-width="40" opacity="0.25"/>`,
    );
  },
  terrazzo(hex, seed) {
    const rand = rng(String(seed));
    const tints = [shade(hex, -0.35), shade(hex, -0.18), shade(hex, 0.25), '#8C8476', '#B9A58A'];
    const chips = Array.from({ length: 420 }, () => {
      const cx = rand() * SIZE;
      const cy = rand() * SIZE;
      const r = 3 + rand() * (rand() > 0.9 ? 22 : 9);
      const sides = 5 + Math.floor(rand() * 3);
      const pts = Array.from({ length: sides }, (_, i) => {
        const ang = (i / sides) * Math.PI * 2 + rand() * 0.6;
        const rr = r * (0.6 + rand() * 0.5);
        return `${(cx + Math.cos(ang) * rr).toFixed(1)},${(cy + Math.sin(ang) * rr).toFixed(1)}`;
      }).join(' ');
      return `<polygon points="${pts}" fill="${tints[Math.floor(rand() * tints.length)]}"/>`;
    }).join('');
    return svg(hex, [noise({ id: 'cloud', color: shade(hex, -0.06), freq: 0.01, seed, opacity: 0.5 })], chips);
  },
  mosaic(hex, seed) {
    const rand = rng(String(seed));
    const n = 8;
    const cell = SIZE / n;
    const grout = 10;
    const cells = [];
    for (let y = 0; y < n; y++)
      for (let x = 0; x < n; x++) {
        const c = shade(hex, (rand() - 0.5) * 0.24);
        cells.push(
          `<rect x="${x * cell + grout / 2}" y="${y * cell + grout / 2}" width="${cell - grout}" height="${cell - grout}" rx="6" fill="${c}"/><rect x="${x * cell + grout / 2 + 8}" y="${y * cell + grout / 2 + 8}" width="${(cell - grout) * 0.5}" height="10" rx="5" fill="#fff" opacity="0.18"/>`,
        );
      }
    return svg('#D9D4C8', [], cells.join(''));
  },
  ribbed(hex, seed) {
    // Linea: plain glaze with fine vertical ribs.
    const ribs = [];
    for (let x = 0; x < SIZE; x += 32)
      ribs.push(`<rect x="${x}" y="0" width="16" height="${SIZE}" fill="${shade(hex, 0.1)}" opacity="0.55"/><rect x="${x + 16}" y="0" width="3" height="${SIZE}" fill="${shade(hex, -0.18)}" opacity="0.5"/>`);
    return svg(hex, [noise({ id: 'glaze', color: shade(hex, -0.06), freq: 0.01, seed, opacity: 0.4 })], ribs.join(''));
  },
  glaze(hex, seed) {
    // Subway: plain glossy glaze, slightly uneven like a handmade tile.
    return svg(
      hex,
      [noise({ id: 'glaze', color: shade(hex, -0.08), freq: 0.008, octaves: 3, seed, opacity: 0.5 })],
      `<defs><radialGradient id="pool" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#fff" stop-opacity="0.22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="${SIZE}" height="${SIZE}" fill="url(#pool)"/>`,
    );
  },
  metallic(hex, seed) {
    return svg(
      hex,
      [
        noise({ id: 'brush', color: shade(hex, -0.25), freq: '0.002 0.8', octaves: 2, seed, opacity: 0.5, contrast: 2.5 }),
        noise({ id: 'oxide', color: shade(hex, 0.2), freq: 0.006, octaves: 4, seed: seed + 2, opacity: 0.35 }),
      ],
      `<defs><linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.28"/><stop offset="0.45" stop-color="#fff" stop-opacity="0"/><stop offset="0.7" stop-color="#000" stop-opacity="0.15"/><stop offset="1" stop-color="#fff" stop-opacity="0.12"/></linearGradient></defs><rect width="${SIZE}" height="${SIZE}" fill="url(#sheen)"/>`,
    );
  },
  stack(hex, seed) {
    // Elevation stack: stacked split-stone strips of mixed shades.
    const rand = rng(String(seed));
    const strips = [];
    for (let y = 0; y < SIZE; ) {
      const h = 40 + rand() * 50;
      for (let x = -rand() * 200; x < SIZE; ) {
        const w = 120 + rand() * 220;
        strips.push(`<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${(w - 6).toFixed(0)}" height="${(h - 6).toFixed(0)}" rx="3" fill="${shade(hex, (rand() - 0.5) * 0.4)}"/>`);
        x += w;
      }
      y += h;
    }
    return svg(shade(hex, -0.45), [], strips.join('')).replace(
      '</svg>',
      `<rect width="${SIZE}" height="${SIZE}" fill="${hex}" filter="url(#grain)" opacity="0.35"/><defs><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="4" seed="${seed}"/><feColorMatrix type="saturate" values="0"/></filter></defs></svg>`,
    );
  },
  granite(hex, seed) {
    // Speckled granite: mineral flecks over a mottled body.
    const rand = rng(String(seed));
    const light = lum(hex) > 0.5;
    const flecks = light ? ['#2A2A2C', '#6E6A66', '#B79C7A', '#9C9A98'] : ['#E9E5DE', '#8A8783', '#C8A27A', '#111214', '#5A5550'];
    const dots = Array.from({ length: 2600 }, () => {
      const r = 1 + rand() * (rand() > 0.92 ? 7 : 3);
      return `<circle cx="${(rand() * SIZE).toFixed(0)}" cy="${(rand() * SIZE).toFixed(0)}" r="${r.toFixed(1)}" fill="${flecks[Math.floor(rand() * flecks.length)]}" opacity="${(0.45 + rand() * 0.5).toFixed(2)}"/>`;
    }).join('');
    return svg(hex, [noise({ id: 'mottle', color: shade(hex, light ? -0.12 : 0.12), freq: 0.01, octaves: 4, seed, opacity: 0.6 })], dots);
  },
};

/** Which drawing each collection uses (by file name), falling back to its first look. */
const drawingFor = (slug, looks) =>
  ({
    'calacatta-gold': 'gold',
    'travertine-beige': 'travertine',
    'slate-matt': 'slate',
    'parking-shield': 'studs',
    'oak-plank': 'wood',
    'cotto-terracotta': 'terracotta',
    'terrazzo-sand': 'terrazzo',
    'kitchen-mosaic': 'mosaic',
    'linea-wall': 'ribbed',
    'subway-ivory': 'glaze',
    'metallic-bronze': 'metallic',
    'elevation-stack': 'stack',
  })[slug] ?? (draw[looks[0]] ? looks[0] : 'stone');

const seedOf = (text) => Math.floor(rng(text)() * 1000);

/** Face = the whole tile; texture = a 2.5× close-up of the same surface. */
async function writeFaceAndTexture(svgText, faceFile, textureFile) {
  const png = await sharp(Buffer.from(svgText)).png().toBuffer();
  await sharp(png).resize(1000, 1000).webp({ quality: 82 }).toFile(faceFile);
  if (textureFile) {
    const crop = Math.round(SIZE / 2.5);
    await sharp(png)
      .extract({ left: Math.round((SIZE - crop) / 2), top: Math.round((SIZE - crop) / 2), width: crop, height: crop })
      .resize(1000, 1000, { kernel: 'lanczos3' })
      .webp({ quality: 82 })
      .toFile(textureFile);
  }
}

/** Adds `key: "value"` after the first line matching `afterPattern` at or after `from`, once. */
function insertAfter(lines, from, afterPattern, indent, key, value) {
  for (let i = from; i < lines.length; i++) {
    if (afterPattern.test(lines[i])) {
      const next = lines.slice(i + 1, i + 6).find((l) => l.trim().startsWith(`${key}:`));
      if (!next) lines.splice(i + 1, 0, `${indent}${key}: "${value}"`);
      return;
    }
  }
}

// --- Tiles ----------------------------------------------------------------------------------------
let count = 0;
for (const file of (await readdir(tilesDir)).filter((f) => f.endsWith('.yaml'))) {
  const slug = file.replace(/\.yaml$/, '');
  const text = await readFile(path.join(tilesDir, file), 'utf8');
  const looks = JSON.parse(text.match(/^looks:\s*(\[.*\])/m)[1]);
  const kind = drawingFor(slug, looks);
  await mkdir(path.join(outTiles, slug), { recursive: true });

  const lines = text.split(/\r?\n/);
  // Colours: every "- name:" under colours, until "decor:".
  const decorAt = lines.findIndex((l) => /^decor:/.test(l));
  const colourEnd = decorAt === -1 ? lines.length : decorAt;
  const colours = [];
  for (let i = 0; i < colourEnd; i++) {
    const code = lines[i].match(/^\s+code:\s*"([^"]+)"/)?.[1];
    if (!code) continue;
    const hex = lines.slice(i, i + 4).join('\n').match(/hex:\s*"(#[0-9A-Fa-f]{6})"/)?.[1];
    if (hex) colours.push({ code, hex, line: i });
  }
  for (const c of colours.reverse()) {
    const face = `${c.code}-face.webp`;
    const texture = `${c.code}-texture.webp`;
    await writeFaceAndTexture(draw[kind](c.hex, seedOf(c.code)), path.join(outTiles, slug, face), path.join(outTiles, slug, texture));
    insertAfter(lines, c.line, /^\s+hex:/, '    ', 'texture', `../../assets/_temp/tiles/${slug}/${texture}`);
    insertAfter(lines, c.line, /^\s+hex:/, '    ', 'tileFace', `../../assets/_temp/tiles/${slug}/${face}`);
    count++;
  }
  // Decor tiles: the collection's first colour, drawn as a band with a gold inlay line.
  const decorStart = lines.findIndex((l) => /^decor:/.test(l));
  if (decorStart !== -1 && colours.length) {
    const first = colours[colours.length - 1];
    for (let i = decorStart; i < lines.length && !/^\S/.test(lines[i + 1] ?? 'x') ; i++) {
      const code = lines[i].match(/^\s+code:\s*"([^"]+)"/)?.[1];
      if (!code) continue;
      const base = draw[kind](first.hex, seedOf(code));
      const inlay = `<rect x="0" y="${SIZE * 0.44}" width="${SIZE}" height="${SIZE * 0.12}" fill="${shade(first.hex, -0.2)}" opacity="0.55"/><rect x="0" y="${SIZE * 0.49}" width="${SIZE}" height="10" fill="#C29E2C"/>`;
      const decorFile = `${code}-decor.webp`;
      await writeFaceAndTexture(base.replace('</svg>', inlay + '</svg>'), path.join(outTiles, slug, decorFile));
      insertAfter(lines, i, /^\s+size:/, '    ', 'image', `../../assets/_temp/tiles/${slug}/${decorFile}`);
      count++;
    }
  }
  await writeFile(path.join(tilesDir, file), lines.join('\n'));
}

// --- Granite products -----------------------------------------------------------------------------
await mkdir(outProducts, { recursive: true });
for (const file of (await readdir(productsDir)).filter((f) => f.endsWith('-granite.yaml'))) {
  const slug = file.replace(/\.yaml$/, '');
  const text = await readFile(path.join(productsDir, file), 'utf8');
  const hex = text.match(/^hex:\s*"(#[0-9A-Fa-f]{6})"/m)[1];
  await writeFaceAndTexture(draw.granite(hex, seedOf(slug)), path.join(outProducts, `${slug}.webp`));
  if (!/^images:/m.test(text)) {
    await writeFile(path.join(productsDir, file), text.replace(/^hex:.*$/m, (m) => `${m}\nimages:\n  - "../../assets/_temp/products/${slug}.webp"`));
  }
  count++;
}

console.log(`Drew ${count} temporary tile and granite images.`);
