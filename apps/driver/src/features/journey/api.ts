import type { DriverHome, Trip } from "@rookhub/types";

import { mockAdvanceTrip, mockDriverHome, mockDriverTrip, mockDriverTrips } from "@/mocks/journey";

/** Fronteira única — na integração só o corpo destas funções muda. */

export function getHome(): Promise<DriverHome> {
  return mockDriverHome();
}

export function getTrips(): Promise<Trip[]> {
  return mockDriverTrips();
}

export function getTrip(id: string): Promise<Trip> {
  return mockDriverTrip(id);
}

export function advanceTrip(id: string, note?: string): Promise<Trip> {
  return mockAdvanceTrip(id, note);
}
