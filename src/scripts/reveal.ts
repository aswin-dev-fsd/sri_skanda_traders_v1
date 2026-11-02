/**
 * Scroll reveal (brief Motion rules): elements marked `data-reveal` fade up 16px once, when they
 * enter the viewport. Groups stagger 60ms by setting `--i` (0, 1, 2…) on each child.
 * Styles live in global.css and only apply once <html> has the `js` class.
 */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.setAttribute('data-revealed', '');
      observer.unobserve(entry.target);
    });
  },
  { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
);

document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
