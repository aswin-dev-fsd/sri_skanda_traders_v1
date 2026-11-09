# Decisions

Pre-build decisions for the Sri Skanda Traders website, agreed on 2026-11-02.
The design brief lives in [`Website prompts/Full website Prompt..txt`](Website%20prompts/Full%20website%20Prompt..txt).
When a decision changes, edit it here and note the change in that day's changelog.

## Stack

| Area | Decision | Why |
|---|---|---|
| Site type | Fully static. No backend. | Enquiry-only site: no prices, cart, checkout or login. ₹0 running cost. |
| Framework | Astro, TypeScript strict mode | SEO pages with clean URLs, minimal JavaScript for the showroom tablet. |
| Runtime / package manager | Node 24 LTS, npm | |
| Interactivity | Plain TypeScript in Astro components, plus `nanostores` for shared state | The site is mostly toggles and animations. Shared state is only My Selection (header count, drawer, cards, page). |
| Animation | No library. CSS, Web Animations API, IntersectionObserver | Every brief animation is opacity/transform. Start from the reference mockup's CSS (see below) and add the brief's extras. |
| Styling | Plain CSS with design tokens (CSS custom properties) | The brief already defines every colour, radius and spacing value. |
| Fonts | Poppins, self-hosted via `@fontsource/poppins` | Faster, no third-party request. |
| Search | Small JSON index of collections, categories and codes, searched with Fuse.js | Suggestions come from catalogue data, not page text. |
| Map | Static styled map image + "Get directions" link to Google Maps | On-brand, ₹0, no API key or third-party script. |
| Analytics | None | |
| Hosting | Vercel | Vercel's free Hobby plan is non-commercial only, so move to Pro before launch. Domain details are still unknown. |

## Content and data

| Area | Decision |
|---|---|
| Catalogue owner | The developer loads and updates all catalogue data. No CMS. |
| Catalogue format | One YAML file per collection/product, in Astro content collections, validated by a schema (a missing field fails the build). Tiles in `src/content/tiles/`, products in `src/content/products/`, brands in `src/content/brands.yaml`; allowed filter values in `src/config/catalogue.ts`. How-to: [`CATALOGUE.md`](CATALOGUE.md). |
| Placeholder catalogue | 16 tile collections (4–6 colours each, spread across all spaces, looks and finishes), 8 bathware products (some Johnson, to show the "Authorised Dealer" tag), 4 granite, 2 JSW adhesives. All fictional names, marked `placeholder: true`; brands are `Brand A`–`Brand E` plus the real Johnson and JSW. The launch check lists every placeholder entry. |
| Images | Stored in the repo and optimised by Astro at build time. |
| Temporary images | Prompts and file names: [`IMAGE-PROMPTS.md`](IMAGE-PROMPTS.md); a missing file shows a placeholder. AI-generated stand-ins for the Home hero "Try a floor" (one living room, 3 floor variants), the Home before/after slider, and 2–3 demo collections. Everything else uses grey labelled boxes, e.g. `[PHOTO: living room, light floor]`. The developer writes the prompts, the user generates the images. All temporary images live in `src/assets/_temp/`. |
| Business details | Phone, WhatsApp number, email, address, hours and map link are placeholders in `src/config/site.ts`. |
| Launch guard | `scripts/check-launch.mjs` lists every `[PLACEHOLDER]` value in `src/config/site.ts` and every `_temp/` reference in `src/`. `npm run build` only warns. It fails with `npm run build:launch`, or when `LAUNCH_CHECK=strict` is set (add it to Vercel's Production environment at launch; see `DEPLOYMENT.md`). Changed 2026-11-02: it originally failed every Vercel production deploy, which blocked pre-launch deploys from `main`. |
| Feature flags | One place: `src/config/site.ts`. |

## Features

| Area | Decision |
|---|---|
| Enquiries | No backend. Forms build a pre-filled `wa.me` WhatsApp message (main button) or a `mailto:` link (secondary). Success text tells the customer to press send in WhatsApp. A real form backend may come later. |
| My Selection | Stored on the device in localStorage, as the brief says. |
| 3D Visualizer | Use the temporary file [`tessera_360_3d_home_interior_tile_visualizer_temporary.html`](tessera_360_3d_home_interior_tile_visualizer_temporary.html), copied to `public/visualizer/` and shown in an iframe. Minimal edits only: replace "TESSERA 360" branding with "Sri Skanda 3D Visualizer" and add a "Demo" chip. No logic changes. To be replaced later. |
| Visualizer limits | It has one bathroom scene and 8 made-up tiles drawn in code. It cannot open with a chosen tile or save to My Selection. |
| "Try in 3D" buttons | Keep the brief's exact labels. They open the Visualizer page without a tile selected. |
| Showroom mode | Built as the brief specifies (Prompt 00, section K). Off unless the URL has `?mode=showroom`. The tablet model is unknown, so test at 1024–1280 landscape in browser emulation. |
| Pages | All 8 pages are built before launch, Gallery included. Reviews and projects stay as labelled placeholders until the client supplies real ones (the brief forbids invented reviews). |

## URLs

All routes live in `routes` in `src/config/site.ts`.

| Page | URL |
|---|---|
| Products (all listings) | `/products` |
| Tiles | `/tiles`, `/tiles/floor`, `/tiles/wall`, `/tiles/vitrified` |
| Tiles by space | `/tiles/living-room`, `/tiles/bedroom`, `/tiles/kitchen`, `/tiles/bathroom`, `/tiles/parking`, `/tiles/elevation`, `/tiles/outdoor` |
| Bathware | `/bathware`, `/bathware/sanitary-ware`, `/bathware/faucets`, `/bathware/accessories` |
| Granite / Adhesives | `/granite`, `/adhesives` |
| Tile collection / product detail | `/collection/[slug]`, `/product/[slug]` |
| Other pages | `/visualizer`, `/my-selection`, `/gallery`, `/about`, `/contact`, `/privacy`, `/terms` |

## Home page

- The hero image sits inside the content width (as in the reference mockup) rather than bleeding to the right edge.
- The hero is side by side from 1024px so the showroom tablet in landscape sees the headline without scrolling.
- Brand links go to `/products?brand=<id>`; until logo files arrive, brands show as green wordmarks.
- The Visit section's "Request a call back" sends a WhatsApp message, like every other form.
- Shop by space: on desktop (1024px and wider, fine pointer, motion allowed) the section pins below the header and page scroll moves the cards sideways; prev/next scroll the page by one card. Phones, tablets and reduced motion keep a normal swipe scroller. Added 2026-11-09.
- Trending's "View all collections" sits beside the heading, on its last text baseline, rather than below the cards. Added 2026-11-09.

## Product listings

- One template (`src/components/listing/ListingPage.astro`) serves every listing in `src/config/listings.ts`. Filtering runs in the browser on cards built at build time; the logic is pure functions in `src/lib/filters.ts`.
- Filters are shared through the URL: `?look=marble,stone&colour=white&sort=az`. Values are AND across groups, OR within a group.
- A space page (`/tiles/bathroom`) or tile type page (`/tiles/floor`) fixes that filter; its group is not shown in the sidebar.
- `/products` shows all tiles, with a canonical link to `/tiles`. `/products?brand=<id>` sends a brand with no tiles (Johnson, JSW) to the listing where it has products.
- Sidebar filters apply instantly on desktop; below 1200px a bottom sheet applies them with "Show N results".
- Skipped from the brief: skeleton loading cards (the cards are already in the page, so nothing loads) and brand search (only needed above 8 brands).
- `vercel.json` turns on `cleanUrls`, so `/tiles` serves `tiles.html` on Vercel.

## Collection and product pages

- `/collection/<id>` follows the brief's section order. Saving from the colour panel saves that colour (`<collection>:<code>`); the hero, sticky bar and Actions panel save the whole collection.
- Links to `/collection/<id>#colour-<code>` open with that colour picked (My Selection uses this).
- Until photos arrive, colours, textures and room slides use flat stand-ins built from each colour's hex; the room gallery shows one placeholder slide per colour (up to 4).
- The colour panel sits beside the swatches on desktop but is not sticky: on a 1280 × 800 tablet it would be taller than the screen.
- `/product/<id>` serves bathware, granite and adhesives with the brief's bathware layout. Spec values still set to a `[PLACEHOLDER]` (e.g. warranty) are left out of the table, as the brief says "[if supplied]".
- Below a product: "Pairs well with" (same category) and tiles for the matching room (bathroom for bathware, kitchen for granite).

## 3D Visualizer page

- The embedded copy lives at `public/embed/visualizer.html` (served as `/embed/visualizer.html`), not under `/visualizer/`, so it cannot clash with the `/visualizer` page. Only its title, brand line, a gold "DEMO" chip and the screenshot file name were changed from the original in `docs/`.
- The visualizer page starts with the 3D view **Off** (no iframe) behind a "3D view" switch, and each browser remembers the visitor's choice (`localStorage` key `ss-viz-3d`). While the view is On, its render loop pauses when the frame is off-screen. The pause wraps the embed's `requestAnimationFrame` from the parent page; the embed file itself is not edited.
- The page shows "Setting up the room…" until the visualizer has drawn its 3D canvas, and the error state if that has not happened after 20 seconds or the device has no WebGL.
- Full screen uses the browser's Fullscreen API on the embed; where that is missing (iPhone Safari), the visualizer opens in a new tab instead.
- "How it works" steps are the brief's DRAFT wording, with `[SCREENSHOT: step N]` placeholders, until they are matched to the final visualizer's controls.

## My Selection page

- `/my-selection` renders entirely in the browser from the saved list, and is `noindex` (it is personal).
- "Send as one enquiry" opens WhatsApp with name, phone and every item (with its room and approximate area). "Share on WhatsApp" sends just the list, grouped by room, with no form. Both match the WhatsApp-first enquiry decision.
- The success text is "Sent to WhatsApp, [Name]. Press send in WhatsApp, and we'll call you soon." because the site cannot know whether the customer pressed send.
- Drag to reorder works with a mouse on desktop only, by the handle (as the brief says, not required on touch).
- The "New customer" button is built here but only shows when `<html data-mode="showroom">`; turning showroom mode on is task 14.
- Print view: A4, logo on a green tile (the logo is made for green), date, items grouped by room in a table, showroom details, lined space for staff notes.

## Contact page

- "Send enquiry" opens WhatsApp, like every form. The brief's secondary "Or chat on WhatsApp" would repeat it, so the secondary option is "Or send it by email", shown once the email address is filled in (as in the enquiry drawer).
- Choosing Architect or Designer, Builder or Contractor slides in Company / Firm name and Project size; both go into the message only for those roles.
- New business details in `site.ts`: `hoursTable` (days and times), `parking` (set to `''` if there is none), `areasServed`. The launch check covers them.
- Quick-action tiles link to `tel:`, `wa.me`, `mailto:` and Google Maps; while a detail is a placeholder its tile links to `#`.

## About page

- Copy lives in `src/config/about.ts`. The story is the brief's DRAFT, waiting for the founder's approval and name.
- "Book a consultation" opens the enquiry drawer with "You're asking about: Design consultation" (a `service` item), rather than adding a consultation chip to the product interests.
- "The people" stays hidden while `team` in `about.ts` is empty, as the brief says. Adding portraits there shows the section.
- Brands show as wordmarks linking to `/products?brand=<id>` until logo files arrive.

## Gallery page

- Projects and reviews are content collections: one YAML per project in `src/content/projects/` (title, area, space, note, photos, tiles used), and `src/content/reviews.yaml`. All current entries are `placeholder: true`; the launch check lists them.
- Tabs Projects · Showroom · Reviews; `/gallery#showroom` and `/gallery#reviews` open their tab.
- The space filter only shows spaces that have a project, so no chip leads to an empty grid.
- Each project opens its own dialog: photo slider in the Trust Frame ("<Area>, Coimbatore"), note, and "Tiles used" collection cards with Shop this look.
- The Google rating shows only when `googleRating` in `site.ts` is set (it starts empty, as the brief says to show it only if supplied). `googleReviewsUrl` is a placeholder.
- Until a Google logo file is supplied, the reviews bar and cards say "Google review" in text. The showroom video's play button is disabled until a video exists.

## Search and showroom mode

- Search suggestions come from `/search-index.json`, built at build time from the catalogue and listings: collections, each colour code, products and categories. It is only downloaded when someone focuses a search box. A typed code ("IM-103", "JSN-FT-105") is shown first as an exact match.
- Enter opens the highlighted suggestion (or the first one); there is no separate search results page.
- Showroom mode turns on with `?mode=showroom` and is remembered on that tablet in localStorage, so it survives browser restarts; `?mode=off` ends it. The brief only says "turned on with a URL parameter", so the persistence is my choice. Staff instructions: [`SHOWROOM.md`](SHOWROOM.md).
- "Start fresh" (from "Still browsing?") clears the list and goes to the home page; "New customer" clears the list and stays on the page.
- The header's New customer button is hidden below 768px: showroom mode is for the tablet, and a phone header has no room.

## Testing

- Unit tests also use the Playwright runner (no browser), so only the two packages named under Quality are added: `@playwright/test` and `@axe-core/playwright`.
- The accessibility check fails on axe "serious" or "critical" WCAG 2.1 AA issues, and on any script error. Lighthouse is run by hand; results are in [`TESTING.md`](TESTING.md).
- `[PHOTO: …]` placeholder labels are drawn with CSS generated content, so they never become part of a button's accessible name (axe `label-content-name-mismatch`).

## Internal pages

`/styleguide` shows every token and shared component for review. It is `noindex` and not linked from the menus.

## Logo

Until the client sends SVGs, the header and footer use the approved ivory/gold logo PNG taken from the reference mockup (`src/assets/brand/logo-on-green.png`).

## Reference Home mockup

[`Website prompts/Sri Skanda Home Mockup – Home page ( reference ).html`](Website%20prompts/Sri%20Skanda%20Home%20Mockup%20–%20Home%20page%20(%20reference%20).html) is a visual reference only. Its code is a bundled design-tool export and is not reused. What it establishes:

- Easing `cubic-bezier(.22,1,.36,1)` everywhere.
- `rise`: fade + 16px rise, 0.8s, 80ms stagger, on page load.
- Brand marquee: CSS, 40s loop, pauses on hover.
- Cards lift 4px with a soft shadow; images zoom to 1.04 over 0.6s; arrows nudge 4px.
- Text links: underline grows from the left over 0.2s.
- Focus: gold ring on green, green ring on inputs. Reduced motion turns off `rise` and the marquee.
- Trust Frame: gold rounded border with a label in the bottom gap.

The brief also asks for things the mockup lacks: tile reveal, Trust Frame drawing animation, scroll-triggered reveals, flip cards, star fly-to-header, finish sheen, mega menu and drawers.

## Design changes from the brief

- Eyebrows (the small uppercase labels above headings) have no gold hairline and no section numbers. Home shows "Shop by category", not "02 — Shop by category". Changed 2026-11-09 at the user's request; overrides the brief's Eyebrow typography note and signature touch 8 (Section numbering). The "·" separators, as in "Tiles · Granite · Bathware", stay.
- Where two plain ivory sections meet, the second gets a thin beige line across its top (`.section.divided` in `global.css`), so the 256px desktop gap reads as a break. Spacing is unchanged. Joins that already change colour or have a line are left alone. Home's Shop by category → Shop by space join has no line (the tile-grid background already marks it). Brands keeps its compact 96px padding, and Real homes below uses 96px on top to match, so that line sits evenly at every screen size. Added 2026-11-09.
- Every page has a back-to-top button, stacked above the floating WhatsApp button. It is smaller (44px), with an ivory surface, green border and green up arrow, so WhatsApp stays the main floating action. It appears only after 1.5 screens of scrolling, so short pages never show it, and it follows WhatsApp's hide rules (drawer or menu open, showroom mode). Added 2026-11-09 at the user's request; not in the brief.
- Breadcrumbs use a neutral grey `#6b6b6b` (5.1:1 on ivory) instead of the green-tinted muted colour; the one colour outside the brief's palette. Collection cards put Enquire (outlined) left and View (filled green) right; the colour panel's "Try in 3D" is a filled button. Where Enquire is a card's only button (product cards, decor tiles), it sits on the right. Added 2026-11-09 at the user's request.

## Quality

| Area | Decision |
|---|---|
| Tests | Playwright for key flows: save to My Selection, WhatsApp message content, filters updating the URL, Showroom mode reset. axe accessibility checks on every page. |
| Performance | Lighthouse run by hand before launch. Targets from the brief: Home under 2.5s on 4G, 60fps on a mid-range tablet. |
| CI | Run the tests on GitHub Actions once the repo is set up. |

## Workflow

| Area | Decision |
|---|---|
| Repo | https://github.com/aswin-dev-fsd/sri_skanda_traders_v1, branch `main` plus feature branches. |
| Commits | `<type>(<scope>): <short description>`, types `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `config`. |
| Process | One task at a time. The user reviews each task before the next one starts. |
| Changelog | One file per day in [`changelogs/`](changelogs/), named `YYYY-MM-DD.md`. |

## Task order

Status is updated in the same commit that finishes each task (the commit hash is added in the next one).

| # | Task | Status |
|---|---|---|
| 1 | Project setup: Astro, TypeScript, fonts, design tokens, `site.ts` | ✅ Done · `f98eb63` |
| 2 | Shared shell: header (with mega menu), footer, floating WhatsApp button | ✅ Done · `83f0927` |
| 3 | Shared components: buttons, chips, cards, toast, Trust Frame | ✅ Done · `c30673b` |
| 4 | Catalogue schema plus placeholder data | ✅ Done · `7ba9260` |
| 5 | My Selection store and drawer, enquiry drawer | ✅ Done · `13c56eb` |
| 6 | Home page, section by section | ✅ Done · `ac26f44` |
| 7 | Products listing with filters | ✅ Done · `0e7d8c6` |
| 8 | Collection page, plus the bathware variant | ✅ Done · `0874f77` |
| 9 | 3D Visualizer page | ✅ Done · `27075a8` |
| 10 | My Selection page, plus the print view | ✅ Done · `d7aabc9` |
| 11 | Contact page | ✅ Done · `656ae2f` |
| 12 | About page | ✅ Done · `7c3efa7` |
| 13 | Gallery page | ✅ Done · `d29f9ef` |
| 14 | Search, Showroom mode | ✅ Done · `d8d5089` |
| 15 | Tests, accessibility and Lighthouse pass | ✅ Done |

Unplanned: `5ded719` fix(deploy), launch check made opt-in for Vercel.
