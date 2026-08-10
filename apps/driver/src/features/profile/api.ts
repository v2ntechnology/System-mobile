import type { DriverProfile } from "@rookhub/types";

import { mockDriverProfile } from "@/mocks/profile";

export function getProfile(): Promise<DriverProfile> {
  return mockDriverProfile();
}
