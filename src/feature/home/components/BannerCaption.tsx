type BannerCaptionProps = {
  title?: string;
  subtitle?: string;
};

function BannerCaption({ title, subtitle }: BannerCaptionProps) {
  if (!title && !subtitle) return null;

  return (
    <div className='pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 via-black/35 to-transparent px-4 pt-12 pb-10 text-white sm:px-8 lg:px-20 lg:pb-12'>
      <div className='flex max-w-3xl flex-col gap-1'>
        {title && (
          <p className='text-2xl font-extrabold leading-tight text-balance sm:text-3xl lg:text-4xl'>
            {title}
          </p>
        )}
        {subtitle && (
          <p className='text-sm font-medium text-white/90 text-pretty sm:text-base'>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export { BannerCaption };
