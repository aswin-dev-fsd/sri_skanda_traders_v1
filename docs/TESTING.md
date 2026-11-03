# Testing

```bash
npm test            # everything: unit + flows + accessibility, at desktop, tablet and phone sizes
npm run test:unit   # just the pure functions (fast, no browser)
npx playwright test --project=desktop tests/e2e/listing.spec.ts   # one file, one size
```

The first run needs the test browser: `npx playwright install chromium`.

Tests run against the production build (`astro build` + `astro preview` on port 4322), so they also catch build errors. If a run complains that another preview server is running, stop it with `npx astro preview stop`.

## What is covered

| File | Checks |
|---|---|
| `tests/unit/filters.spec.ts` | Filter matching (AND across groups, OR within), sorting, URL read/write, "Try removing…" suggestions |
| `tests/unit/enquiry.spec.ts` | Phone numbers, validation messages, item descriptions, enquiry and shortlist messages, WhatsApp link encoding |
| `tests/e2e/selection.spec.ts` | Save from a card → header count → My Selection → remove and Undo; list survives reload; Send as one enquiry |
| `tests/e2e/enquiry.spec.ts` | Enquire from a card (validation, message content, success); Contact trade fields |
| `tests/e2e/listing.spec.ts` | Filters update results and URL; shared URL restores them; empty state recovers; Load more; brand redirect |
| `tests/e2e/search-showroom.spec.ts` | Exact code search → colour page; showroom mode on/remembered/off, New customer clears the list |
| `tests/e2e/a11y.spec.ts` | axe WCAG 2.1 AA (serious and critical issues) and no script errors on 11 main pages, desktop and phone |

Projects: `unit`, `desktop` (1280 × 800), `tablet` (1024 × 768, touch; the showroom size), `phone` (Pixel 7).

WhatsApp is never actually opened: the tests capture `window.open` and read the message text.

## Not covered by the automated tests

- The temporary 3D visualizer inside its iframe (a stand-in is served during the accessibility check).
- The 3-minute "Still browsing?" timer (the dialog and its buttons are covered).
- Real devices: run the site once on the actual showroom tablet before launch.

## CI

`.github/workflows/test.yml` runs `npx playwright test` on every push to `main` and on pull requests. Failed runs upload traces (`npx playwright show-trace <file>` to replay).

## Lighthouse

Run by hand before launch on the live URL (Chrome DevTools → Lighthouse, mobile). Results on 2026-11-03, local production build, mobile:

| Page | Performance | Accessibility | Best practices | SEO | LCP |
|---|---|---|---|---|---|
| Home | 99 | 100 | 100 | 100 | 1.7 s |
| Tiles | 100 | 100 | 100 | 100 | 1.5 s |
| Collection | 99 | 100 | 100 | 100 | 1.8 s |
| Product | 100 | 100 | 100 | 100 | 1.4 s |
| Bathware | 100 | 100 | 100 | 100 | 1.4 s |
| My Selection | 100 | 100 | 100 | 63* | 1.5 s |
| Contact | 100 | 100 | 100 | 100 | 1.5 s |
| About | 100 | 100 | 100 | 100 | 1.5 s |
| Gallery | 100 | 100 | 100 | 100 | 1.5 s |
| 3D Visualizer | 58† | 100 | 0† | 100 | 2.0 s |

\* My Selection is deliberately `noindex` (personal list), which Lighthouse scores as "not crawlable".
† Caused by the temporary demo visualizer inside the iframe (three.js from a CDN, heavy main-thread work). The page around it is fine; recheck when the real visualizer replaces it.
