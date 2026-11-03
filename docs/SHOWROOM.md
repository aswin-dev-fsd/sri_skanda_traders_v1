# Showroom tablet setup

The same website runs on the tablet in the showroom. Showroom mode adapts it for walk-in customers.

## Turn it on (once per tablet)

1. Open the website on the tablet's browser.
2. Add `?mode=showroom` to the address, e.g. `https://<domain>/?mode=showroom`, and open it.
3. Bookmark the home page (or add it to the home screen). The tablet now remembers showroom mode, even after the browser restarts.

To turn it off on that tablet, open `https://<domain>/?mode=off`.

## What changes in showroom mode

| Change | Why |
|---|---|
| A **New customer** button in the header (and on My Selection) | Staff tap it between customers. It asks "Start fresh for a new customer?" before clearing the saved list. |
| After **3 minutes** without a touch, "Still browsing?" appears | "Yes, continue" keeps the list. "Start fresh" clears it and goes to the home page. Nothing is cleared without a tap. |
| No floating WhatsApp button | Staff are right there. |

## Tips

- Use the tablet in landscape; the site is designed for 1024–1280 px wide in the showroom.
- A customer's list can be printed from My Selection → **Print list** to bring out the real samples.
