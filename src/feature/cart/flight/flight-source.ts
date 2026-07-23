/**
 * Where a flight launches from.
 *
 * Usually the caller owns the origin element and hands over its ref. When the
 * image and the add-to-cart button sit on opposite sides of the server/client
 * boundary — as on the product detail page — a ref cannot reach across, so the
 * server-rendered image marks itself with a data attribute and the client
 * button looks it up. Turning the image into a client component just to share a
 * ref would cost more than this one documented escape hatch.
 */

export const FLIGHT_SOURCE_ATTR = 'data-flight-source';

/** Name used by the product detail page's main photo. */
export const PRODUCT_DETAIL_SOURCE = 'product-detail';

export const findFlightSource = (name: string) =>
  typeof document === 'undefined'
    ? null
    : document.querySelector<HTMLElement>(`[${FLIGHT_SOURCE_ATTR}="${name}"]`);

/**
 * The image variant the browser already painted. Reading it off the live
 * element — instead of the product's raw URL — means the ghost is served from
 * cache and picks up the rendered fallback when the product has no photo.
 */
export const resolveFlightImage = (element: HTMLElement) => {
  const image =
    element instanceof HTMLImageElement
      ? element
      : element.querySelector('img');

  return image?.currentSrc || undefined;
};
