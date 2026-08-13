/**
 * Error types shared by the API layer.
 *
 * Deliberately free of `server-only` and of any environment lookup: these are
 * plain shapes that both the request layer and its tests need to construct.
 */

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * El request necesita un cliente autenticado y no hay ninguno. Se lanza antes
 * de cualquier fetch, así que no es una falla del API: no lleva status HTTP.
 */
export class SessionRequiredError extends Error {
  constructor() {
    super('No authenticated session');
    this.name = 'SessionRequiredError';
  }
}
