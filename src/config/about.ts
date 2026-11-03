/**
 * About page content (brief Prompt 07). The story is DRAFT copy, to be approved by the founder.
 * The page also carries what used to be the Brands and Services pages.
 */

export const story = {
  quote: "We love meeting people, understanding what they need, and helping them build a home they'll be proud of.",
  paragraphs: [
    'Sri Skanda Traders began with a simple interest: the building trade, and the people in it. Every family who walks in has a different home in mind. Our job is to listen, suggest honestly, and make the choice easy. Many of our customers have become friends, and that is the part we value most.',
  ],
  founder: '[Founder name]',
};

export const values = [
  { title: 'Trust', body: 'Honest advice, even when it means a smaller bill.' },
  { title: 'Quality', body: 'Only brands and products we would use in our own homes.' },
  { title: 'Service', body: 'Like family: we stay with you until the last tile is laid.' },
  { title: 'Timeless', body: 'Choices that will still look right years from now.' },
] as const;

/** "How we help" timeline (former Services page). */
export const services = [
  { title: 'Design consultation', body: 'Talk through your rooms, style and budget.' },
  { title: 'Product selection help', body: 'Compare collections and see real samples.' },
  { title: 'Site measurement', body: 'We measure so you order the right quantity.' },
  { title: 'Free delivery', body: 'Delivered to your site, safely and on time.', note: '[Delivery area & usual timing — to confirm]' },
  { title: 'Laying & installation support', body: 'Guidance and support at the site.' },
] as const;

/**
 * Team portraits. The brief says to hide "The people" until photos arrive, so this stays empty
 * until the client supplies them: { name, role, image } with images in src/assets/team/.
 */
export const team: { name: string; role: string; image?: import('astro').ImageMetadata }[] = [];
