/**
 * Embla measures slide widths, so the gutter cannot be a `gap` on the track.
 * The track pulls left by the gutter and every slide pads it back, which keeps
 * the first card flush with the container edge.
 */
export const departmentTrackClass = '-ml-4';

/** One card on phones, two from md, three from lg. */
export const departmentSlideClass = 'basis-full pl-4 md:basis-1/2 lg:basis-1/3';

/** Shared by the card media and its skeleton so the two never drift. */
export const departmentSlideMediaClass = 'aspect-2184/1146 w-full rounded-2xl';
