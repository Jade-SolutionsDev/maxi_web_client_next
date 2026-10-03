export const ORDERS_LIST_PATH = '/pedidos';

export const ORDERS_PAGE_SIZE = 10;

export const FIRST_ORDERS_PAGE = 1;

export const parseOrdersPage = (value: string | string[] | undefined) => {
  const page = Number(Array.isArray(value) ? value[0] : value);

  return Number.isInteger(page) && page >= FIRST_ORDERS_PAGE
    ? page
    : FIRST_ORDERS_PAGE;
};

export const buildOrdersPageHref = (page: number) =>
  page <= FIRST_ORDERS_PAGE
    ? ORDERS_LIST_PATH
    : `${ORDERS_LIST_PATH}?page=${page}`;
