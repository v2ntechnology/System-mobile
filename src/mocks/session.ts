import type { Session, Tenant, User } from "@/types";

import { ApiError, delay } from "./latency";

/**
 * Contas de motorista para desenvolvimento.
 *
 * ⚠️ Fictícias. Vinícius dirige o
 * RKH7E45 nos dois lugares. Duplicar o dado é proposital: importar de outro app
 * acoplaria dois bundles que o backend vai separar de qualquer jeito; o que não
 * pode divergir é a *história*, e por isso os ids são os mesmos (`drv-001`).
 */

const TENANT: Tenant = {
  id: "tenant-transnorte",
  name: "Transportadora Norte",
  modules: ["FLEET", "TRIPS", "CHECKLIST", "COSTS", "MAINTENANCE", "SAFETY", "ASSISTANT"],
};

interface MockDriverCredential {
  password: string;
  user: User;
}

export const MOCK_DRIVER_CREDENTIALS: MockDriverCredential[] = [
  {
    password: "rookhub123",
    user: {
      id: "usr-drv-001",
      name: "Vinícius Vila Nova",
      email: "motorista@rookhub.com",
      role: "DRIVER",
      tenantId: TENANT.id,
      driverId: "drv-001",
      // RF-007 não se aplica a motorista: ele nunca vê custo de frota.
      operatorSeesFinancials: false,
      mfaEnabled: false,
    },
  },
  {
    password: "rookhub123",
    user: {
      id: "usr-drv-002",
      name: "Marina Cordeiro",
      email: "marina@rookhub.com",
      role: "DRIVER",
      tenantId: TENANT.id,
      driverId: "drv-002",
      operatorSeesFinancials: false,
      mfaEnabled: false,
    },
  },
];

/** Substituto do `POST /v1/auth/login` com papel DRIVER. */
export async function mockDriverLogin(email: string, password: string): Promise<Session> {
  await delay(1000);

  const normalized = email.trim().toLowerCase();
  const credential = MOCK_DRIVER_CREDENTIALS.find((entry) => entry.user.email === normalized);

  // Mensagem única para e-mail inexistente e senha errada — não enumeramos contas.
  if (!credential || credential.password !== password) {
    throw new ApiError(401, "Credenciais inválidas", "E-mail ou senha incorretos.");
  }

  return {
    user: credential.user,
    tenant: TENANT,
    /* Sem `btoa` aqui: o Hermes não garante o global, e isto é só um placeholder. */
    accessToken: `mock.${credential.user.id}.token`,
    expiresAt: new Date(Date.now() + 15 * 60_000).toISOString(),
  };
}
