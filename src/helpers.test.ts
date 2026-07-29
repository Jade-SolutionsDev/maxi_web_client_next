import { describe, expect, it } from 'vitest';
import { buildPaginationRange, range, truncate } from './helpers';

describe('truncate', () => {
  it('leaves text shorter than the limit untouched', () => {
    expect(truncate('Aceite de girasol', 50)).toBe('Aceite de girasol');
  });

  it('trims surrounding whitespace', () => {
    expect(truncate('  Aceite de girasol  ', 50)).toBe('Aceite de girasol');
  });

  it('cuts on a word boundary and appends an ellipsis', () => {
    expect(truncate('Aceite de girasol natura', 14)).toBe('Aceite de…');
  });

  it('never exceeds the limit', () => {
    const result = truncate('a'.repeat(200), 155);

    expect(result.length).toBeLessThanOrEqual(155);
  });

  it('cuts mid-word when there is no space to break on', () => {
    expect(truncate('supercalifragilistico', 10)).toBe('supercali…');
  });
});

describe('buildPaginationRange', () => {
  it('returns no slots when there are no pages', () => {
    expect(buildPaginationRange(1, 0)).toEqual([]);
  });

  it('lists every page while they all fit', () => {
    expect(buildPaginationRange(1, 3)).toEqual([1, 2, 3]);
    expect(buildPaginationRange(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('collapses the tail when the current page is near the start', () => {
    expect(buildPaginationRange(2, 10)).toEqual([
      1,
      2,
      3,
      4,
      5,
      'ellipsis',
      10,
    ]);
  });

  it('collapses the head when the current page is near the end', () => {
    expect(buildPaginationRange(9, 10)).toEqual([
      1,
      'ellipsis',
      6,
      7,
      8,
      9,
      10,
    ]);
  });

  it('collapses both sides when the current page sits in the middle', () => {
    expect(buildPaginationRange(5, 10)).toEqual([
      1,
      'ellipsis',
      4,
      5,
      6,
      'ellipsis',
      10,
    ]);
  });

  it('clamps a page outside the range instead of inventing slots', () => {
    expect(buildPaginationRange(99, 10)).toEqual([
      1,
      'ellipsis',
      6,
      7,
      8,
      9,
      10,
    ]);
    expect(buildPaginationRange(0, 10)).toEqual([
      1,
      2,
      3,
      4,
      5,
      'ellipsis',
      10,
    ]);
  });

  it('keeps one width across every page of the same list', () => {
    const widths = range(1, 20).map(
      (page) => buildPaginationRange(page, 20).length,
    );

    expect(new Set(widths)).toEqual(new Set([7]));
  });

  it('widens the window with more siblings', () => {
    expect(buildPaginationRange(6, 12, 2)).toEqual([
      1,
      'ellipsis',
      4,
      5,
      6,
      7,
      8,
      'ellipsis',
      12,
    ]);
  });
});
