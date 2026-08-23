import { Bitcoin, CreditCard, HandCoins, Wallet } from 'lucide-react';
import type { ComponentType } from 'react';

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  CreditCard,
  Bitcoin,
  HandCoins,
  Wallet,
};

interface PaymentMethodIconProps {
  icon: string | null;
  className?: string;
}

export const PaymentMethodIcon = ({
  icon,
  className,
}: PaymentMethodIconProps) => {
  const Icon = (icon && ICONS[icon]) || Wallet;

  return <Icon className={className} />;
};
