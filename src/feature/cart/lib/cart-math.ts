import { roundMoney } from '@/helpers';
import type { Cart, CartLine } from '../type/cart.interface';

export const recalculate = (lines: CartLine[]): Cart => {
  const priced = lines.map((line) => ({
    ...line,
    lineTotal: roundMoney(line.unitPrice * line.quantity),
  }));

  return {
    lines: priced,
    totalItems: priced.reduce((total, line) => total + line.quantity, 0),
    subtotal: roundMoney(
      priced.reduce((total, line) => total + line.lineTotal, 0),
    ),
  };
};
