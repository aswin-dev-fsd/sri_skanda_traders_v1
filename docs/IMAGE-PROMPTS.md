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
