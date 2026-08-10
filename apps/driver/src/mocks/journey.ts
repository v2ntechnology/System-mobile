import type { DriverHome, Driver, Trip, TripStatus } from "@rookhub/types";

import { ApiError, delay } from "./latency";

/**
 * Estado da jornada do motorista logado.
 *
 * ⚠️ Fictício. Mantido em módulo mutável porque o app *escreve*: avançar o
 * status da viagem e enviar o checklist mudam o que a tela de início mostra
 * depois. Um mock só de leitura esconderia justamente os bugs de sequência.
 */

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
const hoursAhead = (h: number) => new Date(Date.now() + h * 3_600_000).toISOString();

const DRIVER: Driver = {
  id: "drv-001",
  name: "Vinícius Vila Nova",
  status: "EM_VIAGEM",
  score: 97,
  scoreDelta: 2,
  tripsCount: 38,
  kmDriven: 14_820,
  criticalEvents: 0,
  cnhCategory: "E",
  cnhExpiresAt: "2028-04-17",
  currentVehiclePlate: "RKH7E45",
};

/* Mesma viagem VG-8841 que o painel mostra em `apps/web/src/mocks/trips.ts`. */
const state = {
  checklistSentToday: false,
  blocked: false,
  lastOdometerKm: 412_880,
  trips: [
    {
      id: "trip-8841",
      code: "VG-8841",
      status: "EM_TRANSITO" as TripStatus,
      origin: "Duque de Caxias/RJ",
      destination: "Juiz de Fora/MG",
      distanceKm: 184,
      driverName: DRIVER.name,
      plate: "RKH7E45",
      cargo: "Bebidas — 26 t",
      startedAt: hoursAgo(3),
      dueAt: hoursAhead(2),
      progressPercent: 62,
      timeline: [
        { status: "PLANEJADA" as TripStatus, at: hoursAgo(7) },
        {
          status: "EM_CARREGAMENTO" as TripStatus,
          at: hoursAgo(4),
          note: "Carregado no CD da Zona A",
        },
        { status: "EM_TRANSITO" as TripStatus, at: hoursAgo(3) },
      ],
    },
    {
      id: "trip-8852",
      code: "VG-8852",
      status: "PLANEJADA" as TripStatus,
      origin: "Juiz de Fora/MG",
      destination: "Belo Horizonte/MG",
      distanceKm: 262,
      driverName: DRIVER.name,
      plate: "RKH7E45",
      cargo: "Bebidas — 24 t",
      startedAt: hoursAhead(6),
      dueAt: hoursAhead(12),
      progressPercent: 0,
      timeline: [{ status: "PLANEJADA" as TripStatus, at: hoursAgo(1) }],
    },
    {
      id: "trip-8858",
      code: "VG-8858",
      status: "PLANEJADA" as TripStatus,
      origin: "Belo Horizonte/MG",
      destination: "Duque de Caxias/RJ",
      distanceKm: 441,
      driverName: DRIVER.name,
      plate: "RKH7E45",
      cargo: "Retorno vazio",
      startedAt: hoursAhead(26),
      dueAt: hoursAhead(36),
      progressPercent: 0,
      timeline: [{ status: "PLANEJADA" as TripStatus, at: hoursAgo(1) }],
    },
  ] satisfies Trip[],
};

/** Ordem do fluxo (RF-011) — o app só permite avançar um degrau por vez. */
const FLOW: TripStatus[] = [
  "PLANEJADA",
  "EM_CARREGAMENTO",
  "EM_TRANSITO",
  "EM_DESCARGA",
  "CONCLUIDA",
];

export function nextStatus(status: TripStatus): TripStatus | undefined {
  const index = FLOW.indexOf(status);
  if (index < 0) return undefined;
  return FLOW[index + 1];
}

/** Substituto do `GET /v1/driver/home`. */
export async function mockDriverHome(): Promise<DriverHome> {
  await delay();

  const currentTrip = state.trips.find(
    (trip) => trip.status !== "PLANEJADA" && trip.status !== "CONCLUIDA",
  );

  return {
    driver: DRIVER,
    currentTrip,
    nextTrips: state.trips.filter((trip) => trip.status === "PLANEJADA"),
    checklistPending: !state.checklistSentToday,
    blockedByChecklist: state.blocked,
    lastOdometerKm: state.lastOdometerKm,
    cnhExpiresAt: DRIVER.cnhExpiresAt,
  };
}

/** Substituto do `GET /v1/driver/trips`. */
export async function mockDriverTrips(): Promise<Trip[]> {
  await delay(700);
  return state.trips;
}

/** Substituto do `GET /v1/driver/trips/{id}`. */
export async function mockDriverTrip(id: string): Promise<Trip> {
  await delay(600);
  const trip = state.trips.find((entry) => entry.id === id);
  if (!trip) {
    throw new ApiError(404, "Viagem não encontrada", "Esta viagem não está mais atribuída a você.");
  }
  return trip;
}

/**
 * Substituto do `POST /v1/driver/trips/{id}/status`.
 *
 * RF-016 — sair com checklist reprovado é bloqueio de verdade, não aviso: o
 * servidor recusa a transição. Repetir a regra na tela é conveniência; a
 * decisão é daqui (e, no mundo real, do backend).
 */
export async function mockAdvanceTrip(id: string, note?: string): Promise<Trip> {
  await delay(800);

  const trip = state.trips.find((entry) => entry.id === id);
  if (!trip) {
    throw new ApiError(404, "Viagem não encontrada", "Esta viagem não está mais atribuída a você.");
  }

  const target = nextStatus(trip.status);
  if (!target) {
    throw new ApiError(409, "Viagem encerrada", "Esta viagem já foi concluída.");
  }

  if (state.blocked && target === "EM_TRANSITO") {
    throw new ApiError(
      409,
      "Veículo bloqueado",
      "O checklist reprovou um item crítico. Procure a manutenção antes de sair.",
    );
  }

  if (!state.checklistSentToday && target === "EM_CARREGAMENTO") {
    throw new ApiError(
      409,
      "Checklist pendente",
      "Faça o checklist pré-viagem antes de iniciar o carregamento.",
    );
  }

  trip.status = target;
  trip.timeline = [...trip.timeline, { status: target, at: new Date().toISOString(), note }];
  trip.progressPercent =
    target === "CONCLUIDA" || target === "EM_DESCARGA" ? 100 : trip.progressPercent;

  return trip;
}

/* Compartilhado com os mocks de checklist e abastecimento — o estado é um só. */
export const journeyState = state;
