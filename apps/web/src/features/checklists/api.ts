import type { ChecklistSummary } from "@rookhub/types";

import { mockChecklistSummary } from "@/mocks/checklists";

/** Fronteira única de checklists. */
export function getChecklistSummary(): Promise<ChecklistSummary> {
  return mockChecklistSummary();
}
