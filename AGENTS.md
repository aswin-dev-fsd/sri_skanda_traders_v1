# AGENTS.md

Website for Sri Skanda Traders, a tiles, granite and bathware showroom in Sulur, Coimbatore. Static Astro site, enquiry-only (no prices, cart or login), deployed on Vercel.

## Sources of truth

- **Decisions** (stack, data, features, task order): [`docs/DECISIONS.md`](docs/DECISIONS.md). Read it before starting any task.
- **Design brief** (design system, shared components, every page): [`docs/Website prompts/Full website Prompt..txt`](docs/Website%20prompts/Full%20website%20Prompt..txt). Read Prompt 00 plus the prompt for the page you are building.
- **Reference Home mockup**: [`docs/Website prompts/Sri Skanda Home Mockup – Home page ( reference ).html`](docs/Website%20prompts/Sri%20Skanda%20Home%20Mockup%20–%20Home%20page%20(%20reference%20).html). Visual reference only; its code is a design-tool bundle.
- **Temporary 3D visualizer**: [`docs/tessera_360_3d_home_interior_tile_visualizer_temporary.html`](docs/tessera_360_3d_home_interior_tile_visualizer_temporary.html).

When the brief and `DECISIONS.md` disagree, `DECISIONS.md` wins.

## Working scope

Read and write only inside this project folder.

## Task workflow

Work one task at a time, in the order listed in `DECISIONS.md`.

1. **Read** the decisions and the brief sections the task touches.
2. **Build** the task. Match the brief's copy, labels, colours and sizes exactly; keep `[SQUARE BRACKET]` placeholders as visible placeholders.
3. **Check** it: `npm run build` passes, and the page works at mobile (360), tablet (1024 landscape) and desktop widths.
4. **Log** it: add an entry to today's changelog (see below).
5. **Stop** and hand the task to the user for review. Start the next task only after the user approves.

## Rules

- Ask before adding any npm package not named in `DECISIONS.md`.
- Every temporary image goes in `src/assets/_temp/`; every business detail (phone, WhatsApp, email, address, hours) comes from `src/config/site.ts`. The production build guard depends on both.
- Animate only `opacity` and `transform`, with the easing `cubic-bezier(.22,1,.36,1)`, and give every animation a `prefers-reduced-motion` fallback.
- Gold `#D4AF37` text appears only on green backgrounds.
- Write UI copy from the brief's voice rules (Prompt 00, "Voice & Copy").
- Record a changed decision in `DECISIONS.md` in the same task, and mention it in the changelog.

## Changelog

One file per day in [`docs/changelogs/`](docs/changelogs/), named `YYYY-MM-DD.md`. Append to the day's file if it exists. Each entry has:

```md
## <task number and name>

- **Added / Changed / Fixed / Removed:** what, with file paths
- **Decisions:** any decision made or changed (or "None")
- **Open:** anything left for the user to supply or check
```

## Commits

Format: `<type>(<scope>): <short description>`, with types `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `config`. Commit and push only when the user asks.
