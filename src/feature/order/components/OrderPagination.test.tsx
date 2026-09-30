import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { OrderPagination } from './OrderPagination';

describe('OrderPagination', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders nothing when every order fits on one page', () => {
    const { container } = render(<OrderPagination page={1} totalPages={1} />);

    expect(container.innerHTML).toBe('');
  });

  it('links each page to its listing URL', () => {
    render(<OrderPagination page={1} totalPages={3} />);

    expect(
      screen
        .getByRole('link', { name: 'Ir a la página 1' })
        .getAttribute('href'),
    ).toBe('/pedidos');
    expect(
      screen
        .getByRole('link', { name: 'Ir a la página 3' })
        .getAttribute('href'),
    ).toBe('/pedidos?page=3');
  });

  it('marks the current page', () => {
    render(<OrderPagination page={2} totalPages={3} />);

    expect(
      screen
        .getByRole('link', { name: 'Ir a la página 2' })
        .getAttribute('aria-current'),
    ).toBe('page');
  });

  it('offers no previous link on the first page', () => {
    render(<OrderPagination page={1} totalPages={3} />);

    expect(
      screen.queryByRole('link', { name: 'Ir a la página anterior' }),
    ).toBeNull();
    expect(
      screen
        .getByRole('link', { name: 'Ir a la página siguiente' })
        .getAttribute('href'),
    ).toBe('/pedidos?page=2');
  });

  it('offers no next link on the last page', () => {
    render(<OrderPagination page={3} totalPages={3} />);

    expect(
      screen.queryByRole('link', { name: 'Ir a la página siguiente' }),
    ).toBeNull();
    expect(
      screen
        .getByRole('link', { name: 'Ir a la página anterior' })
        .getAttribute('href'),
    ).toBe('/pedidos?page=2');
  });
});
