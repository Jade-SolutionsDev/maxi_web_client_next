'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Form } from '@/app/components/form/Form';
import { FormPassword } from '@/app/components/form/FormPassword';
import { Button } from '@/app/components/ui/button';
import { CuentasNoDisponibles } from '@/feature/auth/components/CuentasNoDisponibles';
import { useAceptarInvitacion } from '@/feature/auth/hook/useAceptarInvitacion';
import { useClerkDisponible } from '@/feature/auth/hook/useClerkDisponible';
import {
  clerkErrorTarget,
  translateClerkError,
} from '@/feature/auth/lib/clerkErrors';
import {
  InvitacionSchema,
  type InvitacionSchemaType,
} from '@/feature/auth/schemas/invitacion.schema';

export const InvitacionForm = () => {
  'use no memo';

  const searchParams = useSearchParams();
  const ticket = searchParams.get('__clerk_ticket');
  const { aceptar, enviando, listo } = useAceptarInvitacion();
  const { caido } = useClerkDisponible();

  const form = useForm<InvitacionSchemaType>({
    resolver: zodResolver(InvitacionSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  if (!ticket) {
    return (
      <div className='flex flex-col gap-4 rounded-2xl border border-input bg-surface p-5 text-sm'>
        <p className='font-semibold text-heading'>
          Este enlace no sirve para activar una cuenta.
        </p>
        <p className='text-muted'>
          Abre el enlace tal como te llegó por correo: lleva una parte que lo
          identifica y no puede recortarse. Si lo copiaste a mano, vuelve al
          correo y pulsa el botón.
        </p>
        <Link
          href='/login'
          className='font-semibold text-primary hover:underline'
        >
          Ir a iniciar sesión
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: InvitacionSchemaType) => {
    form.clearErrors();

    const { error } = await aceptar(ticket, data.password);
    if (!error) return;

    form.setError(clerkErrorTarget(error, ['password']), {
      message: translateClerkError(error),
    });
  };

  return (
    <Form form={form} onSubmit={onSubmit} className='gap-5'>
      {caido && (
        <CuentasNoDisponibles>
          No podemos conectar con el servicio de cuentas, así que ahora mismo no
          se puede activar.
        </CuentasNoDisponibles>
      )}

      <FormPassword name='password' label='Tu contraseña' required />
      <FormPassword
        name='confirmPassword'
        label='Repite la contraseña'
        required
      />

      <div id='clerk-captcha'></div>

      <Button
        type='submit'
        size='lg'
        className='mt-2 w-full'
        loading={enviando}
        disabled={!listo || enviando}
      >
        {enviando ? 'Activando…' : 'Activar mi cuenta'}
      </Button>

      <p className='text-center text-xs text-muted'>
        Tu correo ya está decidido: es al que te llegó esta invitación.
      </p>
    </Form>
  );
};
