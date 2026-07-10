const base = 'https://maxi-media-prod.s3.us-east-1.amazonaws.com/BANNER/';

type BannerAsset = {
  src: string;
  width: number;
  height: number;
};

type BannerSlide = {
  alt: string;
  desktop: BannerAsset;
  tablet: BannerAsset;
  mobile: BannerAsset;
};

const banners: BannerSlide[] = [
  {
    alt: 'Promociones Maxi',
    desktop: {
      src: `${base}ae14364c-4796-4f03-89fd-4edfe4dcf9c2.webp`,
      width: 1921,
      height: 393,
    },
    tablet: {
      src: `${base}82992c54-398d-4ca6-a2ba-e56d0073c8a8.webp`,
      width: 745,
      height: 1048,
    },
    mobile: {
      src: `${base}bc87ffbc-4ba6-4167-98ac-dd506d69a569.webp`,
      width: 361,
      height: 537,
    },
  },
  {
    alt: 'Ofertas Maxi',
    desktop: {
      src: `${base}d53bf5db-cbfd-4245-8ca9-2f7a6e6c9ac3.webp`,
      width: 5761,
      height: 1177,
    },
    tablet: {
      src: `${base}2d65782a-c84f-4b05-a5a8-4b30b068aa34.webp`,
      width: 4099,
      height: 1177,
    },
    mobile: {
      src: `${base}27302fce-9122-40b2-b5dc-c7c46c071b22.webp`,
      width: 1081,
      height: 1609,
    },
  },
  {
    alt: 'Descuentos Maxi',
    desktop: {
      src: `${base}b5822991-9348-4c35-94c2-b8e81f869939.webp`,
      width: 5761,
      height: 1177,
    },
    tablet: {
      src: `${base}002cb15c-86d3-410a-a6c8-e299c7e10c83.webp`,
      width: 2233,
      height: 3142,
    },
    mobile: {
      src: `${base}61e973dd-8347-4252-9df1-658e789fe724.webp`,
      width: 1081,
      height: 1609,
    },
  },
];

export { banners };
export type { BannerAsset, BannerSlide };
