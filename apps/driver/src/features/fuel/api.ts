import type { DriverFuelEntryInput, DriverFuelEntryReceipt, FuelingRecord } from "@rookhub/types";

import { mockCreateFueling, mockFuelHistory } from "@/mocks/fuel";

export function getFuelHistory(): Promise<FuelingRecord[]> {
  return mockFuelHistory();
}

export function createFueling(input: DriverFuelEntryInput): Promise<DriverFuelEntryReceipt> {
  return mockCreateFueling(input);
}
