import type { Session } from "@rookhub/types";

import { mockGoogleSignIn, mockLogin, mockRequestPasswordReset } from "@/mocks/auth";

/**
 * Fronteira única entre as telas e o transporte de dados.
 *
 * Hoje encaminha para `src/mocks`. Quando o backend estiver disponível,
 * troque o corpo destas funções por chamadas ao cliente gerado do OpenAPI
 * (`packages/api-client`) — nenhum componente precisa mudar.
 */

export interface LoginInput {
  email: string;
  password: string;
}

export function login(input: LoginInput): Promise<Session> {
  return mockLogin(input);
}

export function requestPasswordReset(email: string): Promise<void> {
  return mockRequestPasswordReset(email);
}

export function signInWithGoogle(): Promise<Session> {
  return mockGoogleSignIn();
}
