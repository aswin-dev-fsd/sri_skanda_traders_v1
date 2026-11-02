/** An item a customer can save to My Selection or attach to an enquiry. */
export interface SelectionItem {
  /** Unique per saved thing: a collection, a colour of a collection, or a product. */
  id: string;
  kind: 'collection' | 'product';
  name: string;
  brand?: string;
  colour?: string;
  code?: string;
  size?: string;
  finish?: string;
  href: string;
  /** CSS colour for the thumbnail until photos arrive. */
  swatch?: string;
  /** Thumbnail image URL, once photos exist. */
  thumb?: string;
}

/** A saved item plus what the customer adds on the My Selection page. */
export interface SavedItem extends SelectionItem {
  /** Space slug the customer assigns, e.g. "living-room". */
  room?: string;
  /** Approximate area in sq ft. */
  approxArea?: number;
  savedAt: number;
}
