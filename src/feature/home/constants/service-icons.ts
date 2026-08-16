import type { LucideIcon } from 'lucide-react';
import {
  BadgeCheck,
  Clock,
  HandHeart,
  Headset,
  HeartHandshake,
  Leaf,
  Lock,
  MessageSquareText,
  PiggyBank,
  ShieldCheck,
  Truck,
} from 'lucide-react';

export const SERVICE_ICONS: Record<string, LucideIcon> = {
  ShieldCheck,
  Lock,
  MessageSquareText,
  Truck,
  Clock,
  HeartHandshake,
  BadgeCheck,
  Headset,
  PiggyBank,
  Leaf,
};

export const resolveServiceIcon = (name: string): LucideIcon =>
  SERVICE_ICONS[name] ?? HandHeart;
