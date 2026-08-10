import type { DashboardSummary } from "@rookhub/types";

import { mockDashboardSummary } from "@/mocks/dashboard";

/**
 * Fronteira única entre as telas do dashboard e o transporte de dados.
 * Ver `features/auth/api.ts` para a nota sobre a troca pelo cliente do OpenAPI.
 */
export function getDashboardSummary(): Promise<DashboardSummary> {
  return mockDashboardSummary();
}
