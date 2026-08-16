import type { Session } from "@/types";

import { mockDriverLogin } from "@/mocks/session";

/**
 * Fronteira única entre as telas e o transporte de dados — mesma convenção do
 * painel. Na integração só o corpo destas funções muda; nenhuma tela é tocada.
 */
export function login(email: string, password: string): Promise<Session> {
  return mockDriverLogin(email, password);
}
