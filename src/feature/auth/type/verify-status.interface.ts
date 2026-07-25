import type { LucideIcon } from 'lucide-react';

export type VerifyTone = 'progress' | 'success' | 'warning' | 'danger';

export interface VerifyStatusAction {
  href: string;
  label: string;
}

export interface VerifyStatusView {
  tone: VerifyTone;
  /** `null` renders the pending spinner instead of a glyph. */
  icon: LucideIcon | null;
  title: string;
  description: string;
  action?: VerifyStatusAction;
  hint?: string;
}
