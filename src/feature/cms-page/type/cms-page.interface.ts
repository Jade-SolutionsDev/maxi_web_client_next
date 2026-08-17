export type CmsPageParams = { slug: string };

export type CmsPageProps = {
  params: Promise<CmsPageParams>;
};
