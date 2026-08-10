import type { Trip } from "@rookhub/types";

import { mockTrips } from "@/mocks/trips";

/** Fronteira única de viagens. Vira `GET /v1/trips` com paginação por cursor. */
export function getTrips(): Promise<Trip[]> {
  return mockTrips();
}
