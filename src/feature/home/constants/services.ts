import { Lock, MessageSquareText, ShieldCheck } from 'lucide-react';
import type { Service } from '@/feature/home/type/service.interface';

export const services: Service[] = [
  {
    id: 'peace-of-mind',
    icon: ShieldCheck,
    title: 'Tranquilidad de espíritu',
    description: 'Garantía de devolución de 30 días',
    featured: true,
  },
  {
    id: 'secure-payment',
    icon: Lock,
    title: 'Pago 100% seguro',
    description: 'Tu pago está seguro con nosotros',
  },
  {
    id: 'support',
    icon: MessageSquareText,
    title: 'Soporte 24/7',
    description: 'Soporte en línea 24/7',
  },
];
