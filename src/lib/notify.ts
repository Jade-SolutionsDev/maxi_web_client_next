import { toast } from 'sonner';

type NotifyOptions = {
  description?: string;
  id?: string;
};

const DURATION_MS = 3500;

const emit =
  (variant: 'success' | 'error' | 'warning' | 'info') =>
  (message: string, { description, id }: NotifyOptions = {}) =>
    toast[variant](message, { description, id, duration: DURATION_MS });

export const notify = {
  success: emit('success'),
  error: emit('error'),
  warning: emit('warning'),
  info: emit('info'),
};
