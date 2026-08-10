import type { SettingsSummary } from "@rookhub/types";

import { mockSettings } from "@/mocks/settings";

/** Fronteira única de configurações. */
export function getSettings(): Promise<SettingsSummary> {
  return mockSettings();
}
