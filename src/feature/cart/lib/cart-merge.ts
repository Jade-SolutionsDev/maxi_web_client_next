import type {
  Cart,
  GuestLine,
  MergeReport,
  MergeResult,
} from '../type/cart.interface';
import { toCartFailure } from './cart-error';

/**
 * All the merge reads off a stored line. Prices and stock are deliberately not
 * here: they came from the browser, and the server recalculates both anyway.
 */
export type MergeableLine = Pick<GuestLine, 'productId' | 'quantity' | 'name'>;

/**
 * The cart writes the merge needs. Injected rather than imported so the loop
 * stays a pure decision tree that tests can drive without a server.
 */
export interface MergeOperations {
  add: (productId: string, quantity: number) => Promise<Cart>;
  setQuantity: (productId: string, quantity: number) => Promise<Cart>;
  getCart: () => Promise<Cart>;
}

/**
 * Folds the guest cart into the account cart, one POST per stored line.
 *
 * POST increments, so merging into a cart that already holds the product is
 * additive — which is also why the combined quantity can exceed stock. A 409
 * is not a failure to report and stop on: it is the server saying "this much
 * fits", so the line is retried clamped and only dropped if even that fails.
 *
 * Nothing is silently lost: whatever the merge had to shrink or discard comes
 * back in the report so the customer can be told.
 */
export const mergeGuestLines = async (
  lines: MergeableLine[],
  { add, setQuantity, getCart }: MergeOperations,
): Promise<MergeResult> => {
  const report: MergeReport = { clamped: [], dropped: [] };
  let cart: Cart | null = null;

  for (const line of lines) {
    try {
      cart = await add(line.productId, line.quantity);
    } catch (error) {
      const failure = toCartFailure(error);

      if (failure.kind === 'unauthenticated') return { failure };

      if (failure.kind !== 'insufficient-stock' || failure.available < 1) {
        report.dropped.push({ name: line.name });
        continue;
      }

      try {
        cart = await setQuantity(line.productId, failure.available);
        report.clamped.push({
          name: line.name,
          requested: line.quantity,
          granted: failure.available,
        });
      } catch (retryError) {
        const retryFailure = toCartFailure(retryError);

        if (retryFailure.kind === 'unauthenticated')
          return { failure: retryFailure };

        report.dropped.push({ name: line.name });
      }
    }
  }

  return { cart: cart ?? (await getCart()), report };
};
