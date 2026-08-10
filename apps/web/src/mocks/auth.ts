import type { Session } from "@rookhub/types";

import { ApiError, delay } from "./latency";
import { BLOCKED_EMAIL, MOCK_CREDENTIALS, MOCK_TENANTS } from "./users";

export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Substituto do `POST /v1/auth/login`.
 *
 * Quando o backend existir, apenas `features/auth/api.ts` muda — esta função
 * e a pasta `mocks/` inteira são deletadas.
 */
export async function mockLogin({ email, password }: LoginPayload): Promise<Session> {
  await delay(900);

  const normalized = email.trim().toLowerCase();

  if (normalized === BLOCKED_EMAIL) {
    throw new ApiError(
      403,
      "Conta bloqueada",
      "Esta conta está bloqueada. Procure o administrador da sua empresa.",
    );
  }

  const credential = MOCK_CREDENTIALS.find((entry) => entry.user.email === normalized);

  // Mensagem genérica e idêntica para e-mail inexistente e senha errada:
  // não revelamos quais e-mails existem na base.
  if (!credential || credential.password !== password) {
    throw new ApiError(401, "Credenciais inválidas", "E-mail ou senha incorretos.");
  }

  const tenant = MOCK_TENANTS[credential.user.tenantId];
  if (!tenant) {
    throw new ApiError(500, "Tenant não encontrado", "Falha ao carregar os dados da empresa.");
  }

  return {
    user: credential.user,
    tenant,
    accessToken: `mock.${btoa(credential.user.id)}.token`,
    // BE-11 — JWT de acesso com 15 minutos de validade.
    expiresAt: new Date(Date.now() + 15 * 60_000).toISOString(),
  };
}

/** Substituto do `POST /v1/auth/password-reset`. Sempre responde sucesso. */
export async function mockRequestPasswordReset(email: string): Promise<void> {
  await delay(800);
  // Resposta idêntica exista ou não o e-mail — evita enumeração de contas.
  void email;
}

/** Substituto do fluxo de SSO Google (Spring Security OAuth2 Client). */
export async function mockGoogleSignIn(): Promise<Session> {
  await delay(1200);
  const credential = MOCK_CREDENTIALS[0];
  const tenant = credential ? MOCK_TENANTS[credential.user.tenantId] : undefined;

  if (!credential || !tenant) {
    throw new ApiError(500, "Falha no SSO", "Não foi possível concluir o login com o Google.");
  }

  return {
    user: credential.user,
    tenant,
    accessToken: `mock.sso.${btoa(credential.user.id)}.token`,
    expiresAt: new Date(Date.now() + 15 * 60_000).toISOString(),
  };
}
