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
}
