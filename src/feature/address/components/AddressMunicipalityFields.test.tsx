import { cleanup, render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { afterEach, describe, expect, it } from 'vitest';
import type { LocationCatalog } from '@/shared/location/type/location.interface';
import { AddressMunicipalityFields } from './AddressMunicipalityFields';

afterEach(cleanup);

const Wrapper = ({ catalog }: { catalog: LocationCatalog }) => {
  const form = useForm({
    defaultValues: { provinceId: '', municipalityId: '' },
  });

  return (
    <FormProvider {...form}>
      <AddressMunicipalityFields catalog={catalog} />
    </FormProvider>
  );
};

const VACIO: LocationCatalog = { provinces: [], municipalitiesByProvince: {} };

const CON_ZONAS: LocationCatalog = {
  provinces: [{ id: 'p1', name: 'La Habana', code: 'CU-03' }],
  municipalitiesByProvince: {
    p1: [{ id: 'm1', provinceId: 'p1', name: 'Plaza', code: 'CU-03-01' }],
  },
};

describe('AddressMunicipalityFields', () => {
  it('avisa cuando no hay ninguna zona con entrega, en vez de mostrar desplegables vacíos', () => {
    render(<Wrapper catalog={VACIO} />);

    expect(screen.getByText(/no hay zonas con entrega/i)).toBeTruthy();
    expect(screen.queryByText('Provincia')).toBeNull();
  });

  it('muestra los desplegables cuando sí hay zonas', () => {
    render(<Wrapper catalog={CON_ZONAS} />);

    expect(screen.queryByText(/no hay zonas con entrega/i)).toBeNull();
    expect(screen.getByText('Provincia')).toBeTruthy();
    expect(screen.getByText('Municipio')).toBeTruthy();
  });
});
