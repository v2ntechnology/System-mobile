/** Simula latência de rede — em campo a conexão é pior, por isso o piso é maior que o do painel. */
export function delay(ms = 900): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Erro no padrão RFC 9457 (Problem Details) — mesma forma que o backend usará (BE-04).
 * Idêntico ao do painel de propósito: os dois apps falam com o mesmo servidor.
 */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly title: string,
    readonly detail?: string,
  ) {
    super(detail ?? title);
    this.name = "ApiError";
  }
}
