# Updating the catalogue

All products live as YAML files in `src/content/`. The schema is in `src/content.config.ts`; every allowed filter value is in `src/config/catalogue.ts` (spaces in `src/config/site.ts`). A wrong value fails `npm run build` with a message naming the file and field.

| What | Where | One file per |
|---|---|---|
| Brands | `src/content/brands.yaml` | (one list) |
| Tile collections | `src/content/tiles/<slug>.yaml` | collection |
| Bathware, granite, adhesives | `src/content/products/<slug>.yaml` | product |

The file name becomes the URL: `tiles/ivory-marble.yaml` → `/collection/ivory-marble`, `products/arc-basin-mixer.yaml` → `/product/arc-basin-mixer`. Use lowercase words joined by hyphens.

## Add a brand

```yaml
- id: "kajaria"            # used by `brand:` in other files
  name: "Kajaria"
  authorised: false         # true shows the "Authorised Dealer" tag
  range: "Tiles"            # only needed for authorised dealers
```

## Add a tile collection

Copy an existing file in `src/content/tiles/` and edit it.

```yaml
name: "Ivory Marble"
brand: "brand-a"                         # an id from brands.yaml
description: "Soft veined marble that keeps large rooms calm and bright."
categories: ["floor", "vitrified"]       # floor | wall | vitrified
spaces: ["living-room", "bedroom"]       # living-room | bedroom | kitchen | bathroom | parking | elevation | outdoor
looks: ["marble"]                        # marble | stone | wood | concrete | plain | decor | metallic | rustic
features: ["stain-resistant"]            # only what the brand states
heroImage: "../../assets/tiles/ivory-marble/hero.jpg"     # optional
roomImages:                                                # optional
  - image: "../../assets/tiles/ivory-marble/room-1.jpg"
    caption: "Living room in Ivory"
colours:
  - name: "Ivory"
    code: "IM-101"
    family: "white"                      # white | cream | beige | grey | brown | black | special
    hex: "#F2EEE6"                       # colour dot, and stand-in until photos arrive
    tileFace: "../../assets/tiles/ivory-marble/im-101.jpg"  # optional, flat and straight-on
    texture: "../../assets/tiles/ivory-marble/im-101-texture.jpg"  # optional close-up
    finishes: ["glossy", "matt"]         # glossy | matt | satin | polished | rustic
    sizes: ["600x1200", "800x1600"]      # mm, width x height
    application: "floor"                 # floor | wall | both
    thickness: "9 mm"                    # optional
decor:                                   # optional matching decor / highlighters
  - name: "Ivory Marble Border"
    code: "IM-D1"
    size: "300x600"
isNew: true
isTrending: true
```

Image paths are relative to the YAML file. Keep each collection's photos in `src/assets/tiles/<slug>/`. Astro converts them to WebP/AVIF at build time, so JPG or PNG originals are fine.

## Add a product

```yaml
name: "Arc Basin Mixer"
code: "JSN-FT-105"
brand: "johnson"
category: "bathware"                     # bathware | granite | adhesives
bathwareType: "faucet"                   # bathware only: wall-hung-wc | floor-mounted-wc | wash-basin | counter-top-basin | faucet | shower | accessory
finishes: ["chrome", "matt-black"]       # bathware: chrome | matt-black | white · granite: polished | flamed | leather
uses: []                                 # granite: kitchen-top | flooring | staircase | elevation · adhesives: floor | wall | wet-area | exterior
keySpec: "Single-lever · 165 mm spout"   # the one line on the card
specs:                                   # the spec table on the product page
  Spout reach: "165 mm"
  Operation: "Single lever"
features: ["Ceramic disc cartridge"]
images:
  - "../../assets/products/arc-basin-mixer/front.jpg"
```

Granite also needs `colourFamily`; adhesives need `adhesiveType` (`tile-adhesive` | `stone-adhesive` | `grout`).

## Placeholder data

The current catalogue is fictional demo data. Every file has `placeholder: true`, and `Brand A`–`Brand E` are stand-ins. Delete or replace these files as the client's real catalogue arrives. `npm run check:launch` lists every file still marked `placeholder: true`.

## Adding a new filter value

To add, say, a new look or finish, add it to the matching list in `src/config/catalogue.ts`. The schema and the filters pick it up from there.
