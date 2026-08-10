import type { Tenant, User } from "@rookhub/types";

/**
 * Base mockada de usuários e tenants.
 *
 * ⚠️ Dados fictícios, exclusivos de desenvolvimento. Serão descartados quando
 * o backend estiver plugado (BE-11 / RF-003).
 */

export const MOCK_TENANTS: Record<string, Tenant> = {
  "tenant-transnorte": {
    id: "tenant-transnorte",
    name: "Transportadora Norte",
    modules: ["FLEET", "TRIPS", "CHECKLIST", "COSTS", "MAINTENANCE", "SAFETY", "ASSISTANT"],
  },
  "tenant-rodoserra": {
    id: "tenant-rodoserra",
    // Plano reduzido — útil para exercitar o estado bloqueado da navegação (RN-004).
    name: "RodoSerra Logística",
    modules: ["FLEET", "TRIPS", "CHECKLIST"],
  },
};

export interface MockCredential {
  user: User;
  password: string;
}

export const MOCK_CREDENTIALS: MockCredential[] = [
  {
    password: "rookhub123",
    user: {
      id: "usr-001",
      name: "Helena Marques",
      email: "dono@rookhub.com",
      role: "OWNER",
      tenantId: "tenant-transnorte",
      operatorSeesFinancials: true,
      mfaEnabled: false,
    },
  },
  {
    password: "rookhub123",
    user: {
      id: "usr-002",
      name: "Rafael Antunes",
      email: "gestor@rookhub.com",
      role: "MANAGER",
      tenantId: "tenant-transnorte",
      operatorSeesFinancials: true,
      mfaEnabled: false,
    },
  },
  {
    password: "rookhub123",
    user: {
      id: "usr-003",
      name: "Camila Prado",
      email: "operador@rookhub.com",
      role: "OPERATOR",
      tenantId: "tenant-transnorte",
      // RF-007 — operador sem visibilidade financeira.
      operatorSeesFinancials: false,
      mfaEnabled: false,
    },
  },
  {
    password: "rookhub123",
    user: {
      id: "usr-004",
      name: "Jonas Ferreira",
      email: "manutencao@rookhub.com",
      role: "MAINTENANCE",
      tenantId: "tenant-rodoserra",
      operatorSeesFinancials: false,
      mfaEnabled: false,
    },
  },
];

/** Conta bloqueada — para exercitar o caminho de erro 403 na tela de login. */
export const BLOCKED_EMAIL = "bloqueado@rookhub.com";
