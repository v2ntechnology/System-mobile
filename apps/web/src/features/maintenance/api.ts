import type { MaintenanceSummary } from "@rookhub/types";

import { mockMaintenanceSummary } from "@/mocks/maintenance";

/** Fronteira única de manutenção. */
export function getMaintenanceSummary(): Promise<MaintenanceSummary> {
  return mockMaintenanceSummary();
}
