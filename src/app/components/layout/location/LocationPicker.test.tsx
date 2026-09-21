import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { SelectedLocation } from '@/shared/location/type/location.interface';

vi.stubGlobal(
  'ResizeObserver',
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
);

const cartHasLines = vi.fn(() => true);
const clearCartForNewMunicipality = vi.fn();

const usePathname = vi.fn(() => '/catalog');
vi.mock('next/navigation', () => ({ usePathname: () => usePathname() }));

vi.mock('@/feature/cart/lib/cart-zone-reset', () => ({
  cartHasLines: () => cartHasLines(),
  clearCartForNewMunicipality: () => clearCartForNewMunicipality(),
}));

const { LocationPicker } = await import('./LocationPicker');

const habana = 'f3f09219-18cc-44ec-b297-41853727c21e';
const pinar = '8a2c1f44-2b6e-4a71-9c05-6d0b8e3f1a92';
const plaza = '5b41e0c7-9d38-4e26-8f1a-2c63b70d94ae';
const habanaVieja = 'd856282a-b90d-46cd-9937-157cda0579e2';
const vinales = 'e093b71d-6c25-4a03-b8f7-41d59e2860ca';

const provinces = [
  { value: habana, label: 'La Habana' },
  { value: pinar, label: 'Pinar del Río' },
];

const municipalitiesByProvince = {
  [habana]: [
    { value: plaza, label: 'Plaza de la Revolución' },
    { value: habanaVieja, label: 'Habana Vieja' },
  ],
  [pinar]: [{ value: vinales, label: 'Viñales' }],
};

const selected: SelectedLocation = {
  provinceId: habana,
  provinceName: 'La Habana',
  municipalityId: plaza,
  municipalityName: 'Plaza de la Revolución',
};

const onSubmit = vi.fn(async () => ({ provinceChanged: true }));

const openPicker = async (user: ReturnType<typeof userEvent.setup>) => {
  render(
    <LocationPicker
      provinces={provinces}
      municipalitiesByProvince={municipalitiesByProvince}
      selected={selected}
      onSubmit={onSubmit}
    />,
  );

  await user.click(screen.getByRole('button', { name: /Ubicación actual/ }));
};

const chooseOption = async (
  user: ReturnType<typeof userEvent.setup>,
  label: RegExp,
  option: RegExp,
) => {
  await user.click(screen.getByLabelText(label));
  await user.click(await screen.findByRole('option', { name: option }));
};

// El cleanup vivía dentro del primer describe, así que los bloques de abajo
// heredaban el DOM del anterior y pasaban o fallaban según el orden. A nivel
// de fichero cada prueba arranca con la pantalla vacía.
afterEach(() => {
  cleanup();
});

describe('LocationPicker', () => {
  beforeEach(() => {
    onSubmit.mockClear();
    cartHasLines.mockClear().mockReturnValue(true);
    clearCartForNewMunicipality.mockClear();
  });

  it('warns before leaving the province with a cart, and saves once accepted', async () => {
    const user = userEvent.setup();
    await openPicker(user);

    await chooseOption(user, /Provincia/, /Pinar del Río/);
    await chooseOption(user, /Municipio/, /Viñales/);
    await user.click(screen.getByRole('button', { name: /Confirmar/ }));

    expect(
      await screen.findByText(/¿Deseas cambiar tu ubicación\?/),
    ).toBeTruthy();
    expect(
      screen.getByText(/los productos de tu carrito actual serán eliminados/),
    ).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Cambiar ubicación' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ municipalityId: vinales });
    });
    expect(clearCartForNewMunicipality).toHaveBeenCalledTimes(1);
  });

  it('keeps the location and the cart untouched when the warning is dismissed', async () => {
    const user = userEvent.setup();
    await openPicker(user);

    await chooseOption(user, /Provincia/, /Pinar del Río/);
    await chooseOption(user, /Municipio/, /Viñales/);
    await user.click(screen.getByRole('button', { name: /Confirmar/ }));

    await user.click(await screen.findByRole('button', { name: /Cancelar/ }));

    await waitFor(() => {
      expect(screen.queryByText(/¿Deseas cambiar tu ubicación\?/)).toBeNull();
    });
    expect(onSubmit).not.toHaveBeenCalled();
    expect(clearCartForNewMunicipality).not.toHaveBeenCalled();
  });

  it('warns before changing municipality inside the same province and clears the cart once accepted', async () => {
    const user = userEvent.setup();
    await openPicker(user);

    await chooseOption(user, /Municipio/, /Habana Vieja/);
    await user.click(screen.getByRole('button', { name: /Confirmar/ }));

    expect(
      await screen.findByText(/¿Deseas cambiar tu ubicación\?/),
    ).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Cambiar ubicación' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ municipalityId: habanaVieja });
    });
    expect(clearCartForNewMunicipality).toHaveBeenCalledTimes(1);
  });

  it('does not warn when there is nothing in the cart to lose', async () => {
    cartHasLines.mockReturnValue(false);
    const user = userEvent.setup();
    await openPicker(user);

    await chooseOption(user, /Provincia/, /Pinar del Río/);
    await chooseOption(user, /Municipio/, /Viñales/);
    await user.click(screen.getByRole('button', { name: /Confirmar/ }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ municipalityId: vinales });
    });
    expect(screen.queryByText(/¿Deseas cambiar tu ubicación\?/)).toBeNull();
  });
});

describe.each([
  ['/login', 'entrar'],
  ['/register', 'registrarse'],
  ['/register/verify', 'confirmar el correo'],
  ['/reset-password', 'recuperar la clave'],
])('en %s', (ruta, loQueViene) => {
  // El diálogo se abría encima del formulario y tapaba el botón: tres
  // escenarios de navegador morían por timeout al pulsar «Enviar código».
  it(`no tapa el formulario de ${loQueViene}`, () => {
    usePathname.mockReturnValue(ruta);

    render(
      <LocationPicker
        provinces={provinces}
        municipalitiesByProvince={municipalitiesByProvince}
        selected={null}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.queryByText('¿Dónde estás?')).toBeNull();
  });
});

describe('en la página de seguimiento', () => {
  // El enlace de seguimiento se abre desde WhatsApp o un correo, y quien lo
  // abre no viene a comprar: el selector de zona tapaba la pantalla entera.
  it('no se abre solo, aunque no haya zona elegida', () => {
    usePathname.mockReturnValue('/seguimiento/abc123');

    render(
      <LocationPicker
        provinces={provinces}
        municipalitiesByProvince={municipalitiesByProvince}
        selected={null}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.queryByText('¿Dónde estás?')).toBeNull();
  });

  it('en el resto de la tienda sigue abriéndose', () => {
    usePathname.mockReturnValue('/catalog');

    render(
      <LocationPicker
        provinces={provinces}
        municipalitiesByProvince={municipalitiesByProvince}
        selected={null}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByText('¿Dónde estás?')).toBeTruthy();
  });
});

describe('el texto del diálogo', () => {
  // Una clienta eligió su municipio creyendo que pedía entrega a domicilio y
  // escribió preguntando si repartíamos allí. El diálogo tiene que decir para
  // qué sirve la zona. Cuando se active la entrega a domicilio, esta prueba
  // falla a propósito: la frase deja de ser cierta y hay que rehacerla.
  it('aclara que la zona no es una dirección de entrega', () => {
    usePathname.mockReturnValue('/catalog');

    render(
      <LocationPicker
        provinces={provinces}
        municipalitiesByProvince={municipalitiesByProvince}
        selected={null}
        onSubmit={vi.fn()}
      />,
    );

    expect(
      screen.getAllByText(/No es una dirección de entrega/).length,
    ).toBeGreaterThan(0);
  });
});
