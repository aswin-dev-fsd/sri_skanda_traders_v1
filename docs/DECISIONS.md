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
| Catalogue format | One YAML file per collection/product, in Astro content collections, validated by a schema (a missing field fails the build). |
| Placeholder catalogue | 16 tile collections (4–6 colours each, spread across all spaces, looks and finishes), 8 bathware products (some Johnson, to show the "Authorised Dealer" tag), 4 granite, 2 JSW adhesives. All fictional names. |
| Images | Stored in the repo and optimised by Astro at build time. |
| Temporary images | AI-generated stand-ins for the Home hero "Try a floor" (one living room, 3 floor variants), the Home before/after slider, and 2–3 demo collections. Everything else uses grey labelled boxes, e.g. `[PHOTO: living room, light floor]`. The developer writes the prompts, the user generates the images. All temporary images live in `src/assets/_temp/`. |
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

| # | Task |
|---|---|
| 1 | Project setup: Astro, TypeScript, fonts, design tokens, `site.ts` |
| 2 | Shared shell: header (with mega menu), footer, floating WhatsApp button |
| 3 | Shared components: buttons, chips, cards, toast, Trust Frame |
| 4 | Catalogue schema plus placeholder data |
| 5 | My Selection store and drawer, enquiry drawer |
| 6 | Home page, section by section |
| 7 | Products listing with filters |
| 8 | Collection page, plus the bathware variant |
| 9 | 3D Visualizer page |
| 10 | My Selection page, plus the print view |
| 11 | Contact page |
| 12 | About page |
| 13 | Gallery page |
| 14 | Search, Showroom mode |
| 15 | Tests, accessibility and Lighthouse pass |
