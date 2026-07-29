import { describe, expect, it } from 'vitest';
import { truncate } from './helpers';

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
