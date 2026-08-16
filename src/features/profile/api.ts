import type { DriverProfile } from "@/types";

import { mockDriverProfile } from "@/mocks/profile";

export function getProfile(): Promise<DriverProfile> {
  return mockDriverProfile();
}
