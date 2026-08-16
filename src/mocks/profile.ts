import type { DriverProfile } from "@/types";

import { delay } from "./latency";
import { DRIVER_REWARD, DRIVER_SCORE_FACTORS } from "./performance";

/**
 * Ficha do próprio motorista. ⚠️ Fictícia.
 *
 * `monthlySalary` fica de fora de propósito: o app do motorista não é tela de
 * folha, e RF-007 vale nos dois sentidos — o backend simplesmente não manda o
 * campo neste endpoint.
 */
const PROFILE: DriverProfile = {
  driverId: "drv-001",

  birthDate: "1991-06-14",
  cpfMasked: "***.412.887-**",
  phone: "(21) 99812-4477",
  city: "Duque de Caxias",
  state: "RJ",

  cnhNumber: "0428***9155",
  cnhCategory: "E",
  cnhExpiresAt: "2028-04-17",
  cnhEar: true,
  cnhPoints: 3,

  hiredAt: "2022-03-07",
  role: "Motorista carreteiro",
  contractType: "CLT",

  avgFuelEfficiency: 2.69,
  onTimeDeliveryRate: 96,
  hoursDriven: 168,

  scoreHistory: [
    { month: "Mar", score: 91 },
    { month: "Abr", score: 92 },
    { month: "Mai", score: 94 },
    { month: "Jun", score: 93 },
    { month: "Jul", score: 95 },
    { month: "Ago", score: 97 },
  ],
  scoreFactors: DRIVER_SCORE_FACTORS,
  reward: DRIVER_REWARD,
  roadEvents: [
    {
      type: "EXCESSO_VELOCIDADE",
      label: "Excesso de velocidade",
      count: 2,
      delta: -1,
      scoreImpact: -2,
      guidance: "Antecipe as reduções e mantenha o limite indicado no trecho.",
    },
    {
      type: "FRENAGEM_BRUSCA",
      label: "Frenagem brusca",
      count: 1,
      delta: 0,
      scoreImpact: -1,
      guidance: "Aumente a distância do veículo à frente para frear com suavidade.",
    },
  ],
  warnings: [],
};

/** Substituto do `GET /v1/driver/me`. */
export async function mockDriverProfile(): Promise<DriverProfile> {
  await delay(800);
  return PROFILE;
}
