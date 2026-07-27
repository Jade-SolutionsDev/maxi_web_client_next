'use client';

import { LogOut, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/app/components/form/ConfirmDialog';
import { Button } from '@/app/components/ui/button';

export default function DevConfirmPreview() {
  const [open, setOpen] = useState<'default' | 'warning' | null>(null);

  return (
    <main className='flex min-h-screen flex-col items-center justify-center gap-4 p-6'>
      <Button onClick={() => setOpen('default')}>Abrir default</Button>
      <Button variant='destructive' onClick={() => setOpen('warning')}>
        Abrir warning
      </Button>

      <ConfirmDialog
        isOpen={open === 'default'}
        onClose={() => setOpen(null)}
        onConfirm={() => setOpen(null)}
        icon={Trash2}
        title='¿Vaciar el carrito?'
        description='Se van a quitar todos los productos que agregaste.'
      />

      <ConfirmDialog
        isOpen={open === 'warning'}
        onClose={() => setOpen(null)}
        onConfirm={() => setOpen(null)}
        variant='warning'
        icon={LogOut}
        title='¿Cerrar sesión?'
        description='Vas a salir de tu cuenta. Tenés que iniciar sesión de nuevo para ver tus pedidos.'
        submitText='Cerrar sesión'
      />
    </main>
  );
}
