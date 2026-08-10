import type { DriverFuelEntryInput, DriverFuelEntryReceipt, FuelingRecord } from "@rookhub/types";

import { journeyState } from "./journey";
import { ApiError, delay } from "./latency";

/** ⚠️ Histórico fictício — os mesmos postos que aparecem em `mocks/costs.ts` do painel. */
const HISTORY: FuelingRecord[] = [
  {
    id: "fuel-2291",
    at: new Date(Date.now() - 22 * 3_600_000).toISOString(),
    plate: "RKH7E45",
    driverName: "Vinícius Vila Nova",
    station: "Posto Shell — Duque de Caxias",
    liters: 318,
    pricePerLiter: 6.09,
    total: 1936.62,
    efficiency: 2.71,
  },
  {
    id: "fuel-2264",
    at: new Date(Date.now() - 4 * 24 * 3_600_000).toISOString(),
    plate: "RKH7E45",
    driverName: "Vinícius Vila Nova",
    station: "Posto Ipiranga — BR-040 km 78",
    liters: 296,
    pricePerLiter: 6.14,
    total: 1817.44,
    efficiency: 2.68,
  },
  {
    id: "fuel-2230",
    at: new Date(Date.now() - 9 * 24 * 3_600_000).toISOString(),
    plate: "RKH7E45",
    driverName: "Vinícius Vila Nova",
    station: "Posto BR — Juiz de Fora",
    liters: 305,
    pricePerLiter: 5.98,
    total: 1823.9,
    efficiency: 2.44,
    anomaly: "0,27 km/l abaixo da média do veículo — trecho de serra com carga cheia.",
  },
];

/** Substituto do `GET /v1/driver/fuelings`. */
export async function mockFuelHistory(): Promise<FuelingRecord[]> {
  await delay(700);
  return HISTORY;
}

/**
 * Substituto do `POST /v1/driver/fuelings`.
 *
 * O km/l sai do odômetro, não do que o motorista digita: é o servidor que
 * conhece o abastecimento anterior. Por isso o input não carrega eficiência.
 */
export async function mockCreateFueling(
  input: DriverFuelEntryInput,
): Promise<DriverFuelEntryReceipt> {
  await delay(1100);

  if (input.odometerKm <= journeyState.lastOdometerKm) {
    throw new ApiError(
      422,
      "Odômetro inválido",
      `O último registro foi ${journeyState.lastOdometerKm.toLocaleString("pt-BR")} km. Confira o valor no painel do caminhão.`,
    );
  }

  const distance = input.odometerKm - journeyState.lastOdometerKm;
  const efficiency = Number((distance / input.liters).toFixed(2));
  const total = Number((input.liters * input.pricePerLiter).toFixed(2));

  const record: FuelingRecord = {
    id: `fuel-${Date.now()}`,
    at: input.at,
    plate: input.plate,
    driverName: "Vinícius Vila Nova",
    station: input.station,
    liters: input.liters,
    pricePerLiter: input.pricePerLiter,
    total,
    efficiency,
    /* Faixa histórica do veículo: 2,4–2,9 km/l. Fora disso, alguém precisa olhar. */
    anomaly:
      efficiency < 2.2
        ? "Consumo bem acima do padrão do veículo. A manutenção vai verificar."
        : undefined,
  };

  HISTORY.unshift(record);
  journeyState.lastOdometerKm = input.odometerKm;

  return { id: record.id, total, efficiency, anomaly: record.anomaly };
}
