# Sri Skanda Traders website

Website for Sri Skanda Traders, a tiles, granite and bathware showroom in Sulur, Coimbatore. Customers browse collections, try tiles in a 3D visualizer, save a shortlist ("My Selection") and send it as one enquiry over WhatsApp. The same site runs on a tablet inside the showroom.

Static site built with Astro, hosted on Vercel.

## Setup

Requires Node 24 LTS.

```bash
npm install
npm run dev           # http://localhost:4321
npm run build         # build to dist/ (warns about placeholders)
npm run build:launch  # launch build: fails while placeholders or temporary images remain
```

Business details (phone, WhatsApp, address, hours) and feature flags live in `src/config/site.ts`. Design tokens live in `src/styles/tokens.css`.

- Decisions and task order: [`docs/DECISIONS.md`](docs/DECISIONS.md)
- All documentation: [`docs/README.md`](docs/README.md)
- Changelogs: [`docs/changelogs/`](docs/changelogs/)
- Rules for AI coding agents: [`AGENTS.md`](AGENTS.md)
