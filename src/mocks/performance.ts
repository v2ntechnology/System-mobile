import type { DriverReward, DriverScoreFactor } from "@/types";

const now = new Date();
const period = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(now);
const closesAt = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

/**
 * Configuração fictícia da transportadora para o programa mensal.
 *
 * No backend essas faixas pertencem ao tenant e podem mudar sem publicar uma
 * nova versão do app. Mantê-las no dado deixa a tela honesta sobre a regra.
 */
export const DRIVER_REWARD = {
  programName: "Motorista Seguro",
  periodLabel: period.charAt(0).toUpperCase() + period.slice(1),
  estimatedAmount: 750,
  maxAmount: 900,
  closesAt,
  position: 1,
  participantCount: 7,
  tiers: [
    { minScore: 85, amount: 250 },
    { minScore: 90, amount: 500 },
    { minScore: 95, amount: 750 },
    { minScore: 98, amount: 900 },
  ],
} satisfies DriverReward;

export const DRIVER_SCORE_FACTORS = [
  {
    id: "safe-driving",
    label: "Direção segura",
    description: "Velocidade, frenagens e curvas",
    score: 96,
    weightPercent: 45,
  },
  {
    id: "on-time",
    label: "Pontualidade",
    description: "Coletas e entregas dentro da janela",
    score: 98,
    weightPercent: 25,
  },
  {
    id: "efficiency",
    label: "Condução econômica",
    description: "Consumo e marcha lenta",
    score: 94,
    weightPercent: 20,
  },
  {
    id: "routine",
    label: "Checklist e rotina",
    description: "Preenchimentos e jornada regular",
    score: 100,
    weightPercent: 10,
  },
] satisfies DriverScoreFactor[];
