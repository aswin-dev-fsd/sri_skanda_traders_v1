import { expect, test } from '@playwright/test';
import {
  countSelected,
  filterItems,
  matches,
  parseSelection,
  parseSort,
  sortItems,
  suggestRemovals,
  toQuery,
  type FilterItem,
} from '../../src/lib/filters';

const items: FilterItem[] = [
  { id: 'a', name: 'Oak Plank', order: 0, isTrending: true, facets: { look: ['wood'], colour: ['brown'], space: ['bedroom'] } },
  { id: 'b', name: 'Calacatta Gold', order: 1, isNew: true, facets: { look: ['marble'], colour: ['white'], space: ['living-room'] } },
  { id: 'c', name: 'Nero Stone', order: 2, isNew: true, facets: { look: ['stone'], colour: ['black'], space: ['living-room', 'bedroom'] } },
];

test.describe('matches', () => {
  test('ANDs across groups and ORs within a group', () => {
    expect(matches(items[2].facets, { look: ['stone', 'marble'], space: ['bedroom'] })).toBe(true);
    expect(matches(items[1].facets, { look: ['stone', 'marble'], space: ['bedroom'] })).toBe(false);
  });

  test('ignores empty groups', () => {
    expect(matches(items[0].facets, { look: [], colour: [] })).toBe(true);
  });
});

test('filterItems keeps catalogue order', () => {
  expect(filterItems(items, { space: ['living-room'] }).map((i) => i.id)).toEqual(['b', 'c']);
});

test.describe('sortItems', () => {
  test('latest puts new first, then catalogue order', () => {
    expect(sortItems(items, 'latest').map((i) => i.id)).toEqual(['b', 'c', 'a']);
  });

  test('popular puts trending first', () => {
    expect(sortItems(items, 'popular')[0].id).toBe('a');
  });

  test('a–z sorts by name and does not mutate', () => {
    const before = items.map((i) => i.id);
    expect(sortItems(items, 'az').map((i) => i.name)).toEqual(['Calacatta Gold', 'Nero Stone', 'Oak Plank']);
    expect(items.map((i) => i.id)).toEqual(before);
  });
});

test.describe('URL round trip', () => {
  const allowed = { look: ['wood', 'marble', 'stone'], colour: ['white', 'black'] };

  test('toQuery writes only set groups and a non-default sort', () => {
    expect(toQuery({ look: ['marble', 'stone'], colour: [] }, 'az')).toBe('?look=marble,stone&sort=az');
    expect(toQuery({ look: [], colour: [] }, 'latest')).toBe('');
  });

  test('parseSelection keeps known values only', () => {
    const params = new URLSearchParams('look=marble,lava&colour=black&size=600x600');
    expect(parseSelection(params, allowed)).toEqual({ look: ['marble'], colour: ['black'] });
  });

  test('parseSort falls back to latest', () => {
    expect(parseSort('popular')).toBe('popular');
    expect(parseSort('cheapest')).toBe('latest');
    expect(parseSort(null)).toBe('latest');
  });
});

test('countSelected adds up every group', () => {
  expect(countSelected({ look: ['a', 'b'], colour: ['c'], size: [] })).toBe(3);
});

test('suggestRemovals offers the removal that gives the most results', () => {
  const suggestions = suggestRemovals(items, { look: ['marble'], colour: ['black'] });
  expect(suggestions.map((s) => s.value)).toEqual(['marble', 'black']);
  expect(suggestions.every((s) => s.count > 0)).toBe(true);
});
