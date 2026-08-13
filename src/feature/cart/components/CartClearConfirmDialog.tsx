'use client';

import { Trash2 } from 'lucide-react';
import { ConfirmDialog } from '@/app/components/form/ConfirmDialog';
import { useCartActions } from '../hook/useCart';

interface CartClearConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartClearConfirmDialog = ({
  isOpen,
  onClose,
}: CartClearConfirmDialogProps) => {
  const { clearCart } = useCartActions();

  const handleConfirm = () => {
    onClose();
    clearCart();
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      variant='warning'
      icon={Trash2}
      title='¿Vaciar el carrito?'
      description='Vas a quitar todos los productos de tu carrito. Esta acción no se puede deshacer.'
      submitText='Vaciar carrito'
      cancelText='Cancelar'
    />
  );
};
