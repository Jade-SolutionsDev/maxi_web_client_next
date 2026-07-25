/**
 * Shared tracks for the department banners — same recipe as the product grid.
 *
 * The API returns only the featured departments, so the count is small and
 * variable: a fixed three-column grid left an orphan slot whenever fewer than
 * three came back. `auto-fit` drops the empty tracks, and the max track width
 * stops the survivors from absorbing that space and blowing the banners up.
 * Whatever is left over is absorbed by `justify-center`, so two banners read as
 * a centered pair instead of a stretched row.
 */
export const departmentGridClass =
  'grid grid-cols-1 justify-center gap-4 md:grid-cols-[repeat(auto-fit,minmax(18rem,26rem))]';
