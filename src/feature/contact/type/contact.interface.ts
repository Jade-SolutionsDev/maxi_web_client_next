export interface ContactMotiveResponse {
  id: string;
  category: string;
  code: string;
  label: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface ContactMotive {
  id: string;
  label: string;
}

export interface ContactFailure {
  kind: 'invalid' | 'rate-limited' | 'unknown';
}

export type ContactActionResult = { ok: true } | { failure: ContactFailure };
