/**
 * Header search with instant suggestions (brief Prompt 00-A): collections, colours, products and
 * categories from /search-index.json, matched with Fuse.js. Works on every `input[data-suggest]`
 * (desktop search bar and the full-screen menu). Arrow keys move, Enter opens, Esc clears.
 */
import Fuse from 'fuse.js';
import type { SearchEntry } from '@/pages/search-index.json';

const GROUPS: { type: SearchEntry['type']; label: string; max: number }[] = [
  { type: 'collection', label: 'Collections', max: 4 },
  { type: 'colour', label: 'Colours & codes', max: 3 },
  { type: 'product', label: 'Products', max: 3 },
  { type: 'category', label: 'Categories', max: 3 },
];

let fuse: Fuse<SearchEntry> | null = null;
let all: SearchEntry[] = [];
let loading: Promise<Fuse<SearchEntry>> | null = null;

/** Loads the index once, on first focus, so pages that never search never download it. */
function index(): Promise<Fuse<SearchEntry>> {
  if (fuse) return Promise.resolve(fuse);
  loading ??= fetch('/search-index.json')
    .then((r) => r.json() as Promise<SearchEntry[]>)
    .then((entries) => {
      all = entries;
      fuse = new Fuse(entries, {
        keys: [
          { name: 'title', weight: 3 },
          { name: 'sub', weight: 1 },
          { name: 'keywords', weight: 2 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
        minMatchCharLength: 2,
      });
      return fuse;
    });
  return loading;
}

function bind(input: HTMLInputElement) {
  const list = document.getElementById(input.getAttribute('aria-controls') ?? '') as HTMLUListElement | null;
  if (!list) return;
  let active = -1;
  const options = () => [...list.querySelectorAll<HTMLAnchorElement>('[role="option"]')];

  const close = () => {
    list.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    active = -1;
  };

  const highlight = (i: number) => {
    const all = options();
    active = all.length ? (i + all.length) % all.length : -1;
    all.forEach((o, n) => o.setAttribute('aria-selected', String(n === active)));
    if (all[active]) {
      input.setAttribute('aria-activedescendant', all[active].id);
      all[active].scrollIntoView({ block: 'nearest' });
    }
  };

  const render = async () => {
    const query = input.value.trim();
    if (query.length < 2) return close();
    const fuzzy = (await index()).search(query, { limit: 30 }).map((r) => r.item);
    if (input.value.trim() !== query) return; // a newer keystroke has taken over
    // A typed product or colour code ("IM-103") goes straight to the top.
    const code = query.toUpperCase();
    const exact = all.filter((e) => (e.type === 'colour' || e.type === 'product') && e.sub.toUpperCase().split(' · ').includes(code));
    const results = [...exact, ...fuzzy.filter((r) => !exact.includes(r))];
    list.replaceChildren();
    let n = 0;
    for (const group of [{ type: 'exact' as const, label: 'Exact code', max: 3 }, ...GROUPS]) {
      const items = group.type === 'exact' ? exact.slice(0, group.max) : results.filter((r) => r.type === group.type && !exact.includes(r)).slice(0, group.max);
      if (!items.length) continue;
      const heading = document.createElement('li');
      heading.className = 'sg-group';
      heading.setAttribute('role', 'presentation');
      heading.textContent = group.label;
      list.append(heading);
      for (const item of items) {
        const li = document.createElement('li');
        li.setAttribute('role', 'presentation');
        const a = document.createElement('a');
        a.className = 'sg-item';
        a.id = `${list.id}-opt-${n++}`;
        a.href = item.href;
        a.setAttribute('role', 'option');
        a.setAttribute('aria-selected', 'false');
        a.tabIndex = -1;
        const swatch = document.createElement('span');
        swatch.className = 'sg-swatch';
        swatch.setAttribute('aria-hidden', 'true');
        if (item.swatch) swatch.style.background = item.swatch;
        const text = document.createElement('span');
        text.className = 'sg-text';
        const title = document.createElement('span');
        title.className = 'sg-title';
        title.textContent = item.title;
        const sub = document.createElement('span');
        sub.className = 'sg-sub';
        sub.textContent = item.sub;
        text.append(title, sub);
        a.append(swatch, text);
        li.append(a);
        list.append(li);
      }
    }
    if (!n) {
      const empty = document.createElement('li');
      empty.className = 'sg-empty';
      empty.setAttribute('role', 'presentation');
      empty.textContent = 'No matches. Try a collection name, a colour or a product code.';
      list.append(empty);
    }
    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    active = -1;
  };

  input.addEventListener('focus', () => void index());
  input.addEventListener('input', () => void render());
  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (list.hidden) void render();
      highlight(active + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      highlight(active - 1);
    } else if (event.key === 'Escape' && !list.hidden) {
      event.stopPropagation();
      close();
    }
  });

  // Enter opens the highlighted suggestion, or the first one.
  input.form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const target = options()[Math.max(active, 0)];
    if (target) location.href = target.href;
    else void render();
  });

  document.addEventListener('click', (event) => {
    if (event.target !== input && !list.contains(event.target as Node)) close();
  });
}

document.querySelectorAll<HTMLInputElement>('input[data-suggest]').forEach(bind);
