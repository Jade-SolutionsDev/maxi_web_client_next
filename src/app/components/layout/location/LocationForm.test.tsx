import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { SelectedLocation } from '@/shared/location/type/location.interface';
import { LocationForm } from './LocationForm';

vi.stubGlobal(
  'ResizeObserver',
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
);

const habana = 'f3f09219-18cc-44ec-b297-41853727c21e';
const pinar = '8a2c1f44-2b6e-4a71-9c05-6d0b8e3f1a92';
const plaza = '5b41e0c7-9d38-4e26-8f1a-2c63b70d94ae';
const vinales = 'e093b71d-6c25-4a03-b8f7-41d59e2860ca';

const provinces = [
  { value: habana, label: 'La Habana' },
  { value: pinar, label: 'Pinar del Río' },
];

const municipalitiesByProvince = {
  [habana]: [
    { value: plaza, label: 'Plaza de la Revolución' },
    { value: 'habana-vieja', label: 'Habana Vieja' },
  ],
  [pinar]: [{ value: vinales, label: 'Viñales' }],
};

const onSubmit = vi.fn(async () => ({}));

const renderForm = (selected?: SelectedLocation) =>
  render(
    <LocationForm
      provinces={provinces}
      municipalitiesByProvince={municipalitiesByProvince}
      selected={selected}
      onSubmit={onSubmit}
    />,
  );

const chooseOption = async (
  user: ReturnType<typeof userEvent.setup>,
  label: RegExp,
  option: RegExp,
) => {
  await user.click(screen.getByLabelText(label));
  await user.click(await screen.findByRole('option', { name: option }));
};

describe('LocationForm', () => {
  beforeEach(() => {
    onSubmit.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders both labelled selects and the submit button', () => {
    renderForm();

    expect(screen.getByLabelText(/Provincia/)).toBeTruthy();
    expect(screen.getByLabelText(/Municipio/)).toBeTruthy();
    expect(screen.getByRole('button', { name: /Confirmar/ })).toBeTruthy();
  });

  it('disables the municipality select until a province is chosen', () => {
    renderForm();

    expect(screen.getByLabelText(/Municipio/).hasAttribute('disabled')).toBe(
      true,
    );
  });

  it('populates the municipalities of the chosen province', async () => {
    const user = userEvent.setup();
    renderForm();

    await chooseOption(user, /Provincia/, /La Habana/);
    await user.click(screen.getByLabelText(/Municipio/));

    expect(
      await screen.findByRole('option', { name: /Plaza de la Revolución/ }),
    ).toBeTruthy();
    expect(screen.queryByRole('option', { name: /Viñales/ })).toBeNull();
  });

  it('clears the chosen municipality when the province changes', async () => {
    const user = userEvent.setup();
    renderForm();

    await chooseOption(user, /Provincia/, /La Habana/);
    await chooseOption(user, /Municipio/, /Plaza de la Revolución/);
    await chooseOption(user, /Provincia/, /Pinar del Río/);

    await user.click(screen.getByRole('button', { name: /Confirmar/ }));

    expect(await screen.findByText(/Elegí un municipio/)).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('clears the saved municipality when the province changes', async () => {
    const user = userEvent.setup();
    renderForm({
      provinceId: habana,
      provinceName: 'La Habana',
      municipalityId: plaza,
      municipalityName: 'Plaza de la Revolución',
    });

    await chooseOption(user, /Provincia/, /Pinar del Río/);

    const municipality = screen.getByLabelText(/Municipio/);
    expect(municipality.textContent).not.toContain(plaza);
    expect(municipality.textContent).toContain('Elegí tu municipio');
  });

  it('clears a pending municipality error when the province changes', async () => {
    const user = userEvent.setup();
    renderForm();

    await chooseOption(user, /Provincia/, /La Habana/);
    await user.click(screen.getByRole('button', { name: /Confirmar/ }));

    expect(await screen.findByText(/Elegí un municipio/)).toBeTruthy();

    await chooseOption(user, /Provincia/, /Pinar del Río/);

    await waitFor(() => {
      expect(screen.queryByText(/Elegí un municipio/)).toBeNull();
    });
  });

  it('submits the municipality of the province chosen last', async () => {
    const user = userEvent.setup();
    renderForm();

    await chooseOption(user, /Provincia/, /La Habana/);
    await chooseOption(user, /Municipio/, /Plaza de la Revolución/);
    await chooseOption(user, /Provincia/, /Pinar del Río/);
    await chooseOption(user, /Municipio/, /Viñales/);
    await user.click(screen.getByRole('button', { name: /Confirmar/ }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ municipalityId: vinales });
    });
  });

  it('submits the chosen municipality id', async () => {
    const user = userEvent.setup();
    renderForm();

    await chooseOption(user, /Provincia/, /La Habana/);
    await chooseOption(user, /Municipio/, /Plaza de la Revolución/);
    await user.click(screen.getByRole('button', { name: /Confirmar/ }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ municipalityId: plaza });
    });
  });

  it('does not submit when no municipality is chosen', async () => {
    const user = userEvent.setup();
    renderForm();

    await chooseOption(user, /Provincia/, /La Habana/);
    await user.click(screen.getByRole('button', { name: /Confirmar/ }));

    expect(await screen.findByText(/Elegí un municipio/)).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('surfaces the error returned by the submit handler', async () => {
    onSubmit.mockResolvedValueOnce({
      error: 'Esa ubicación no está disponible',
    });
    const user = userEvent.setup();
    renderForm();

    await chooseOption(user, /Provincia/, /La Habana/);
    await chooseOption(user, /Municipio/, /Plaza de la Revolución/);
    await user.click(screen.getByRole('button', { name: /Confirmar/ }));

    expect(await screen.findByText(/no está disponible/)).toBeTruthy();
  });
});
