import { Plus } from "lucide-react";
import Link from "next/link";
import { SafeImage } from "@/app/components/ui/safe-image";
import type { Cart } from "@/feature/cart/type/cart.interface";
import { formatPrice } from "@/helpers";

interface CheckoutSummaryProps {
  cart: Cart;
  deliveryFee?: number;
}

export const CheckoutSummary = ({
  cart,
  deliveryFee = 0,
}: CheckoutSummaryProps) => (
  <section
    aria-labelledby="checkout-summary-title"
    className="rounded-2xl border border-input bg-background p-5 sm:p-6"
  >
    <h2
      id="checkout-summary-title"
      className="mb-4 text-lg font-bold text-heading"
    >
      Tu pedido
    </h2>

    <ul className="flex flex-col divide-y divide-input">
      {cart.lines.map((line) => (
        <li key={line.productId} className="flex items-center gap-3 py-3">
          <SafeImage
            src={line.image}
            alt={line.name}
            width={48}
            height={48}
            className="size-12 shrink-0 rounded-lg bg-surface object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-heading">
              {line.name}
            </p>
            <p className="text-xs text-muted">
              {line.quantity} × {formatPrice(line.unitPrice)}
              {line.basePrice != null && line.basePrice > line.unitPrice && (
                <span className="ml-1 line-through">
                  {formatPrice(line.basePrice)}
                </span>
              )}
            </p>
          </div>
          <p className="shrink-0 text-sm font-bold text-heading tabular-nums">
            {formatPrice(line.lineTotal)}
          </p>
        </li>
      ))}
    </ul>

    {/*
      Volver al catalogo sin abandonar la compra (MxH-0099). Va aqui, debajo
      de lo que ya se lleva y antes de los totales, que es donde uno se da
      cuenta de que le falta algo. Es un enlace normal: el carrito vive en el
      servidor para quien tiene sesion y en el navegador para quien no, asi
      que navegar no se lleva nada por delante.
    */}
    <Link
      href="/catalog"
      className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-input px-4 py-2.5 text-sm font-semibold text-heading transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <Plus className="size-4 shrink-0" aria-hidden="true" />
      Seguir comprando
    </Link>

    <dl className="mt-4 flex flex-col gap-2 border-t border-input pt-4">
      <div className="flex items-baseline justify-between">
        <dt className="text-sm text-muted">Subtotal</dt>
        <dd className="text-sm font-bold text-heading tabular-nums">
          {formatPrice(cart.subtotal)}
        </dd>
      </div>
      <div className="flex items-baseline justify-between">
        <dt className="text-sm text-muted">Envío</dt>
        <dd className="text-sm font-bold text-heading tabular-nums">
          {deliveryFee > 0 ? formatPrice(deliveryFee) : "Gratis"}
        </dd>
      </div>
      <div className="flex items-baseline justify-between">
        <dt className="text-base font-bold text-heading">Total</dt>
        <dd className="text-xl font-bold text-total tabular-nums">
          {formatPrice(cart.subtotal + deliveryFee)}
        </dd>
      </div>
    </dl>
  </section>
);
