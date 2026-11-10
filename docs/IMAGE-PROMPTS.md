# Temporary image prompts

Prompts for the temporary AI images agreed in `DECISIONS.md`. Generate them in ChatGPT (GPT Image), save each file under the exact name below, and the site picks it up automatically on the next build; no code change is needed. Until a file exists, the page shows a labelled `[PHOTO: …]` placeholder.

These are stand-ins only. The launch check fails the production build while anything in `src/assets/_temp/` is in use, so every image here must be replaced by a real photo or visualizer render before launch.

| Save as | Used on | Size |
|---|---|---|
| `src/assets/_temp/home/hero-floor-1.png` | Home hero, "Try a floor": Ivory Marble (shown first) | 1536 × 1024 |
| `src/assets/_temp/home/hero-floor-2.png` | Home hero, "Try a floor": Oak Plank | 1536 × 1024 |
| `src/assets/_temp/home/hero-floor-3.png` | Home hero, "Try a floor": Concrete Grey | 1536 × 1024 |
| `src/assets/_temp/home/before.png` | Home Visualizer band, slider "Before" | 1536 × 1024 |
| `src/assets/_temp/home/after.png` | Home Visualizer band, slider "After" | 1536 × 1024 |

Any of `.png`, `.jpg` or `.webp` works. Landscape 3:2 crops well to the 7:5 desktop frame and the 4:5 phone frame. Keep important things away from the far left and right edges.

## Temporary images in use now (added 2026-11-10)

Every `[PHOTO: …]` slot keeps its hint: as the image's alt text, as the placeholder label wherever no image exists yet, and in the tables below. A real photo for a slot must show what its hint says.

**Stock photos** (Unsplash License: free to use, no attribution required). Listed in `scripts/temp-images/photos.json`; `node scripts/temp-images/download-photos.mjs` re-downloads any that are missing. They stand in for the client's photos only: none of them shows the client's homes, showroom or products.

| File in `src/assets/_temp/` | Used on | Hint (what the real photo should show) | Source |
|---|---|---|---|
| `home/hero-floor-1.jpg` | Home hero, Try a floor: Ivory Marble | living room with a calm, light floor (Ivory Marble) | [Unsplash](https://unsplash.com/photos/Hu_6KP4m9xA) |
| `home/hero-floor-2.jpg` | Home hero, Try a floor: Oak Plank | living room with an Oak Plank floor | [Unsplash](https://unsplash.com/photos/tvnGJ7qFink) |
| `home/hero-floor-3.jpg` | Home hero, Try a floor: Concrete Grey | living room with a Concrete Grey floor | [Unsplash](https://unsplash.com/photos/ItaT_nUcBb8) |
| `photos/space-living-room.jpg` | Home Shop by space: Living room | living room with tiles | [Unsplash](https://unsplash.com/photos/7xO9KdlidDY) |
| `photos/space-bedroom.jpg` | Home Shop by space: Bedroom | bedroom with tiles | [Unsplash](https://unsplash.com/photos/OQWpRTq38QQ) |
| `photos/space-kitchen.jpg` | Home Shop by space: Kitchen | kitchen with tiles | [Unsplash](https://unsplash.com/photos/rjjAKAp0KSw) |
| `photos/space-bathroom.jpg` | Home Shop by space: Bathroom | bathroom with tiles | [Unsplash](https://unsplash.com/photos/Aac7IlKnYX8) |
| `photos/space-parking.jpg` | Home Shop by space: Parking; Parking Shield collection | parking with tiles | [Unsplash](https://unsplash.com/photos/f-DL8K5SYY0) |
| `photos/space-elevation.jpg` | Home Shop by space: Elevation | elevation with tiles | [Unsplash](https://unsplash.com/photos/Ai0KX-4jcHs) |
| `photos/space-outdoor.jpg` | Home Shop by space: Outdoor | outdoor with tiles | [Unsplash](https://unsplash.com/photos/9tQLVo_YIuc) |
| `photos/category-tiles.jpg` | Home Shop by category: Tiles | living room with large-format floor tiles | [Unsplash](https://unsplash.com/photos/Hu_6KP4m9xA) |
| `photos/category-bathware.jpg` | Home Shop by category: Bathware | bathroom with bathware | [Unsplash](https://unsplash.com/photos/1AF5hP6F4tI) |
| `photos/category-granite.jpg` | Home Shop by category: Granite | kitchen with a granite counter | [Unsplash](https://unsplash.com/photos/ds3h6pJye7Q) |
| `photos/category-adhesives.jpg` | Home Shop by category: Adhesives | tiles being laid with adhesive | [Unsplash](https://unsplash.com/photos/c2thq3SXJiA) |
| `photos/room-calacatta-gold.jpg` | Calacatta Gold collection hero and card | living room with Calacatta Gold tiles | [Unsplash](https://unsplash.com/photos/Hu_6KP4m9xA) |
| `photos/room-concrete-grey.jpg` | Concrete Grey collection hero and card | living room with Concrete Grey tiles | [Unsplash](https://unsplash.com/photos/hqGXP136_Qc) |
| `photos/room-cotto-terracotta.jpg` | Cotto Terracotta collection hero and card | outdoor with Cotto Terracotta tiles | [Unsplash](https://unsplash.com/photos/3bRxBh2yiVc) |
| `photos/room-elevation-stack.jpg` | Elevation Stack collection hero and card | elevation with Elevation Stack tiles | [Unsplash](https://unsplash.com/photos/T_Lefot03vc) |
| `photos/room-ivory-marble.jpg` | Ivory Marble collection hero and card | living room with Ivory Marble tiles | [Unsplash](https://unsplash.com/photos/dWH92v9E6j4) |
| `photos/room-kitchen-mosaic.jpg` | Kitchen Mosaic collection hero and card | kitchen with Kitchen Mosaic tiles | [Unsplash](https://unsplash.com/photos/rWhrQU45vLw) |
| `photos/room-linea-wall.jpg` | Linea Wall collection hero and card | living room with Linea Wall tiles | [Unsplash](https://unsplash.com/photos/Vn_FGgNfivA) |
| `photos/room-metallic-bronze.jpg` | Metallic Bronze collection hero and card | living room with Metallic Bronze tiles | [Unsplash](https://unsplash.com/photos/ItaT_nUcBb8) |
| `photos/room-nero-stone.jpg` | Nero Stone collection hero and card | living room with Nero Stone tiles | [Unsplash](https://unsplash.com/photos/C-FqIffctHI) |
| `photos/room-oak-plank.jpg` | Oak Plank collection hero and card | living room with Oak Plank tiles | [Unsplash](https://unsplash.com/photos/r8i3RwrVcRk) |
| `photos/room-parking-shield.jpg` | Parking Shield collection hero and card | parking with Parking Shield tiles | [Unsplash](https://unsplash.com/photos/f-DL8K5SYY0) |
| `photos/room-slate-matt.jpg` | Slate Matt collection hero and card | bathroom with Slate Matt tiles | [Unsplash](https://unsplash.com/photos/bbVVw9FgTRY) |
| `photos/room-statuario-white.jpg` | Statuario White collection hero and card | living room with Statuario White tiles | [Unsplash](https://unsplash.com/photos/7xO9KdlidDY) |
| `photos/room-subway-ivory.jpg` | Subway Ivory collection hero and card | kitchen with Subway Ivory tiles | [Unsplash](https://unsplash.com/photos/El8evy6XLmw) |
| `photos/room-terrazzo-sand.jpg` | Terrazzo Sand collection hero and card | bathroom with Terrazzo Sand tiles | [Unsplash](https://unsplash.com/photos/f61KO4nDeJA) |
| `photos/room-travertine-beige.jpg` | Travertine Beige collection hero and card | living room with Travertine Beige tiles | [Unsplash](https://unsplash.com/photos/5pM6fWttKSw) |
| `photos/project-1.jpg` | Gallery project 1 (living room); Home Real homes | living room in a finished home / finished living room in a customer's home | [Unsplash](https://unsplash.com/photos/p_9w69xML7o) |
| `photos/project-2.jpg` | Gallery project 2 (kitchen) | kitchen in a finished home | [Unsplash](https://unsplash.com/photos/cr9lw1G90As) |
| `photos/project-3.jpg` | Gallery project 3 (bathroom) | bathroom in a finished home | [Unsplash](https://unsplash.com/photos/8yVQvIeO4t8) |
| `photos/project-4.jpg` | Gallery project 4 (bedroom) | bedroom in a finished home | [Unsplash](https://unsplash.com/photos/nLTk9N2eg2U) |
| `photos/project-5.jpg` | Gallery project 5 (parking) | parking in a finished home | [Unsplash](https://unsplash.com/photos/1ot2ImBCZWM) |
| `photos/project-6.jpg` | Gallery project 6 (elevation) | elevation in a finished home | [Unsplash](https://unsplash.com/photos/KlIFFZT1-S0) |
| `products/arc-basin-mixer.jpg` | Arc Basin Mixer product | Arc Basin Mixer, product shot | [Unsplash](https://unsplash.com/photos/8jQC5RHWuSE) |
| `products/aurum-wall-hung-wc.jpg` | Aurum Wall-hung WC product | Aurum Wall-hung WC, product shot | [Unsplash](https://unsplash.com/photos/8mMUnl_exqY) |
| `products/terra-floor-mounted-wc.jpg` | Terra Floor-mounted WC product | Terra Floor-mounted WC, product shot | [Unsplash](https://unsplash.com/photos/48mTwDzizqE) |
| `products/nova-wash-basin.jpg` | Nova Wash Basin product | Nova Wash Basin, product shot | [Unsplash](https://unsplash.com/photos/a8ExcVRip2M) |
| `products/oval-counter-top-basin.jpg` | Oval Counter-top Basin product | Oval Counter-top Basin, product shot | [Unsplash](https://unsplash.com/photos/GSl3GJ1aNOU) |
| `products/rain-overhead-shower.jpg` | Rain Overhead Shower product | Rain Overhead Shower, product shot | [Unsplash](https://unsplash.com/photos/lJewNo29uf0) |
| `products/loop-towel-ring.jpg` | Loop Towel Ring product | Loop Towel Ring, product shot | [Unsplash](https://unsplash.com/photos/LYYxBKkVvxc) |
| `products/jsw-tile-adhesive-t1.jpg` | JSW Tile Adhesive T1 product | JSW Tile Adhesive T1, product shot (bag) | [Unsplash](https://unsplash.com/photos/LyQi9DS7AEg) |
| `products/jsw-stone-adhesive-s2.jpg` | JSW Stone Adhesive S2 product | JSW Stone Adhesive S2, product shot (bag) | [Unsplash](https://unsplash.com/photos/MlXFL3VBOhQ) |

**Drawn in code** by `node scripts/temp-images/draw-tiles.mjs`, from each colour's hex (re-run it after adding or changing colours):

| Files | Used on | Hint |
|---|---|---|
| `tiles/<collection>/<code>-face.webp` | Colour swatches, colour panel, collection card "Tile" side, room-gallery stand-ins | "<collection> tile face": a flat, straight-on scan of that colour |
| `tiles/<collection>/<code>-texture.webp` | Collection "Textures" close-ups | a close-up of that colour's surface |
| `tiles/<collection>/<code>-decor.webp` | Collection "Pair it with" decor tiles | "<decor name> decor tile" |
| `products/<granite>.webp` | Granite product cards and pages | "<granite name>, product shot" |

**Still placeholders** (no suitable stand-in; these must be the client's own or need the AI prompts below):

| Page and section | Hint |
|---|---|
| Home hero, "Try a floor" | The three stock living rooms differ; the brief wants the same room with three floors (prompts 1–3 below). To use AI images, save them as `home/hero-floor-N.png` and delete the matching `.jpg`. |
| Home 3D Visualizer band slider | living room, before floor / living room, after floor (prompts 4–5 below) |
| Home Why Sri Skanda | our team with a customer in the showroom |
| Home Visit our showroom, Contact | MAP: muted styled map of Sulur with a green pin |
| About hero | founder and team in the showroom |
| About The people | each team member's portrait |
| About Our showroom; Gallery Showroom tab | showroom front · bathroom displays · floor tile displays · each showroom area · VIDEO: showroom walkthrough |
| Gallery Reviews | video from each reviewer |
| Collection page "See it laid" | <room> in <colour> (one slide per colour until real room photos are added to `roomImages`) |
| Bathware: Square Glass Shelf | Square Glass Shelf, product shot |

## How to keep the room identical

The hero cross-fades between the three floors and the slider wipes between before and after, so the room, furniture, camera and light must not move between images.

1. Generate the **base image** with the first prompt.
2. For each variant, **upload the base image** in the same chat and use its edit prompt. The edit prompts only change the floor.
3. If anything else drifts (a cushion moves, the window light changes), regenerate the edit; don't accept it.

---

## 1. Hero base: Ivory Marble floor → `hero-floor-1.png`

```
A photorealistic interior photograph of a calm, light-filled living room in a modern South Indian home in Coimbatore, shot straight-on at eye level from the doorway with a 28mm lens, the floor occupying the lower 40 percent of the frame. The floor is large-format 600 x 1200 mm ivory marble-look vitrified tiles with soft grey-beige veining, a gentle satin sheen and fine, barely visible grout lines, laid in a straight grid running away from the camera. The walls are warm off-white plaster; on the right, a tall window with sheer white cotton curtains lets in soft late-morning daylight that falls across the floor in a broad, diffused patch. A low three-seater sofa in oatmeal linen sits centre-left against the back wall with two cushions in muted sage and terracotta, a simple teak coffee table in front of it holding a brass tumbler and a small potted money plant, a woven cane armchair at the right, and a jute rug that covers only a small part of the floor so most of the tiles stay visible. On the back wall hangs one framed Tanjore-style painting in a thin wooden frame, and a carved wooden side table stands in the left corner. Natural, unstaged, lived-in but tidy; no people, no pets, no text, no logos. Colour palette of warm ivory, oatmeal, teak brown and muted sage. Real-estate editorial photography, true-to-life colours, gentle contrast, no HDR look, no CGI gloss, no dramatic lighting.
```

## 2. Hero variant: Oak Plank floor → `hero-floor-2.png`

Upload `hero-floor-1.png` first.

```
Edit this photograph. Change only the floor: replace the ivory marble tiles with 200 x 1200 mm wood-look porcelain plank tiles in a natural honey oak tone, with realistic grain, slight plank-to-plank colour variation, a matt finish and fine grout lines, laid lengthwise running away from the camera. Keep everything else exactly the same: the same room, camera position, lens and framing, the same sofa, cushions, coffee table, brass tumbler, plant, cane armchair, jute rug, painting, side table, window, curtains and walls, in the original positions, with the same daylight direction, brightness and colour temperature. The rug stays on top of the new floor. Photorealistic, true-to-life colours, no text.
```

## 3. Hero variant: Concrete Grey floor → `hero-floor-3.png`

Upload `hero-floor-1.png` first.

```
Edit this photograph. Change only the floor: replace the ivory marble tiles with 600 x 1200 mm concrete-look porcelain tiles in a soft mid grey, with a subtle cement texture, gentle tonal clouding, a matt finish and fine grout lines, laid in the same straight grid running away from the camera. Keep everything else exactly the same: the same room, camera position, lens and framing, the same sofa, cushions, coffee table, brass tumbler, plant, cane armchair, jute rug, painting, side table, window, curtains and walls, in the original positions, with the same daylight direction, brightness and colour temperature. The rug stays on top of the new floor. Photorealistic, true-to-life colours, no text.
```

## 4. Slider base: old floor → `before.png`

```
A photorealistic interior photograph of a modest, slightly dated living room in a 20-year-old house in Coimbatore, Tamil Nadu, shot straight-on at eye level with a 28mm lens, the floor filling the lower 40 percent of the frame. The floor is old 300 x 300 mm beige ceramic tiles with a dull, worn glaze, a few faint stains, darkened grout lines and one or two hairline cracks, laid in a small square grid. Walls are cream emulsion paint; a wide window on the left with plain cotton curtains lets in soft afternoon daylight. Furniture is simple and sparse so the floor stays visible: a wooden sofa with blue-grey cushions against the back wall, a low wooden centre table, a steel almirah in the right corner and a small ceiling fan visible at the very top of the frame. Clean and tidy but tired-looking, an honest everyday Indian home before renovation; no people, no text, no logos. Natural, even light, true-to-life colours, real-estate photography, no HDR look, no CGI gloss.
```

## 5. Slider variant: new floor → `after.png`

Upload `before.png` first.

```
Edit this photograph. Change only the floor: replace the old beige 300 x 300 mm tiles with new large-format 800 x 1600 mm porcelain tiles in a light warm grey stone look, with a soft matt finish, minimal 2 mm grout lines in a matching grey, laid in a straight grid running away from the camera, clean and flawless. Keep everything else exactly the same: the same room, camera position, lens and framing, the same sofa, cushions, centre table, almirah, ceiling fan, window, curtains and walls, in the original positions, with the same daylight direction, brightness and colour temperature. Photorealistic, true-to-life colours, no text.
```
