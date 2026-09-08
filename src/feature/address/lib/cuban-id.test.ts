import { describe, expect, it } from 'vitest';
import { isCubanIdCard } from './cuban-id';

describe('isCubanIdCard', () => {
  it.each(['91031512345', '04053067890', '00010112345'])(
    'acepta %s',
    (ci) => expect(isCubanIdCard(ci)).toBe(true),
  );

  it.each([
    ['9103151234', 'diez dígitos'],
    ['910315123456', 'doce dígitos'],
    ['9103151234a', 'con una letra'],
    ['', 'vacío'],
    ['99023012345', '30 de febrero'],
    ['99043112345', '31 de abril'],
    ['99133012345', 'mes 13'],
    ['99010012345', 'día 0'],
  ])('rechaza %s — %s', (ci) => expect(isCubanIdCard(ci)).toBe(false));

  it('tolera espacios alrededor, que es lo que llega de un formulario', () => {
    expect(isCubanIdCard('  91031512345  ')).toBe(true);
  });
});
