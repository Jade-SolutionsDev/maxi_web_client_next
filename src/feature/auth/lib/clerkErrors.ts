/**
 * Traduce errores de Clerk al español mapeando por `code`
 */

type SingleClerkError = { code?: string | null; message?: string | null };

type ClerkErrorResponse =
  | { errors?: { code?: string | null; message?: string | null }[] }
  | SingleClerkError
  | null
  | undefined;

export type TranslatableClerkError = ClerkErrorResponse;

const CLERK_ERROR_MESSAGES: Record<string, string> = {
  // Login
  form_identifier_not_found: 'No encontramos ninguna cuenta con ese correo.',
  form_password_incorrect: 'La contraseña es incorrecta.',
  // Registro
  form_identifier_exists: 'Ya existe una cuenta con ese correo.',
  form_password_not_strong_enough:
    'La contraseña no es lo suficientemente segura. Agregá más palabras poco comunes.',
  form_password_pwned:
    'Esta contraseña apareció en una filtración de datos. Elegí otra.',
  form_password_length_too_short: 'La contraseña es demasiado corta.',
  // Recuperación de contraseña
  form_code_incorrect: 'El código es incorrecto.',
  verification_expired: 'El código expiró. Pedí uno nuevo.',
  verification_failed: 'No pudimos verificar el código. Intentá de nuevo.',
  // Comunes
  form_param_format_invalid: 'El formato ingresado no es válido.',
  form_param_nil: 'Este campo es obligatorio.',
  session_exists: 'Ya tenés una sesión activa.',
  too_many_requests:
    'Demasiados intentos. Esperá un momento e intentá de nuevo.',
};

const FALLBACK_MESSAGE = 'Ocurrió un error. Intentá de nuevo.';

const extractFirstError = (
  error: TranslatableClerkError,
): SingleClerkError | null => {
  if (!error) return null;

  if ('errors' in error && Array.isArray(error.errors) && error.errors.length) {
    return error.errors[0];
  }

  if ('code' in error) {
    return error as SingleClerkError;
  }

  return null;
};

export const translateClerkError = (error: TranslatableClerkError): string => {
  const firstError = extractFirstError(error);
  if (!firstError) return FALLBACK_MESSAGE;
  return CLERK_ERROR_MESSAGES[firstError.code ?? ''] ?? FALLBACK_MESSAGE;
};

type ClerkErrorField = 'email' | 'password' | 'code' | null;

const CODE_TO_FIELD: Record<string, ClerkErrorField> = {
  form_identifier_not_found: 'email',
  form_identifier_exists: 'email',
  form_password_incorrect: 'password',
  form_password_not_strong_enough: 'password',
  form_password_pwned: 'password',
  form_password_length_too_short: 'password',
  form_code_incorrect: 'code',
  verification_expired: 'code',
  verification_failed: 'code',
};

export const clerkErrorField = (
  error: TranslatableClerkError,
): ClerkErrorField => {
  const firstError = extractFirstError(error);
  if (!firstError) return null;
  return CODE_TO_FIELD[firstError.code ?? ''] ?? null;
};

export const clerkErrorTarget = <const T extends string>(
  error: TranslatableClerkError,
  fields: readonly T[],
): T | 'root' => {
  const field = clerkErrorField(error);
  return field && (fields as readonly string[]).includes(field)
    ? (field as T)
    : 'root';
};
