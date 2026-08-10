import type { Module } from "@rookhub/types";

import { delay } from "./latency";

export interface Plan {
  id: string;
  name: string;
  tagline: string;
  /** Preço mensal por veículo ativo, em reais. `null` = sob consulta. */
  pricePerVehicle: number | null;
  /** Faixa de frota a que o plano atende — evita a pergunta "qual é o meu?". */
  fleetRange: string;
  modules: Module[];
  features: string[];
  /** Único plano em destaque. Dois destaques não destacam nada. */
  featured?: boolean;
  ctaLabel: string;
}

export interface PlanComparisonRow {
  label: string;
  /** Valor por plano, na ordem de `fetchPlans`. `true`/`false` viram ícone. */
  values: Array<string | boolean>;
}

/**
 * ⚠️ Números fictícios, mas coerentes com o painel: o plano "Frota Pro" custa
 * R$ 89 por veículo aqui e em `apps/web/src/mocks/billing.ts`. Preço de site que
 * não bate com a fatura do painel é o tipo de incoerência que só aparece na demo.
 */
const plans: Plan[] = [
  {
    id: "essencial",
    name: "Essencial",
    tagline: "Para tirar a frota da planilha e do grupo de WhatsApp.",
    pricePerVehicle: 49,
    fleetRange: "até 15 veículos",
    modules: ["FLEET", "TRIPS", "CHECKLIST"],
    features: [
      "Rastreamento ao vivo e histórico de posição",
      "Viagens com máquina de estados e alerta de atraso",
      "Checklist pré-viagem com bloqueio de veículo",
      "App do motorista para Android e iOS",
      "Até 3 usuários no painel",
      "Suporte por e-mail em dia útil",
    ],
    ctaLabel: "Começar pelo Essencial",
  },
  {
    id: "frota-pro",
    name: "Frota Pro",
    tagline: "O plano completo — é onde o custo por km começa a cair.",
    pricePerVehicle: 89,
    fleetRange: "de 15 a 120 veículos",
    modules: ["FLEET", "TRIPS", "CHECKLIST", "COSTS", "MAINTENANCE", "SAFETY", "ASSISTANT"],
    features: [
      "Tudo do Essencial",
      "Custo por km em camadas e detecção de anomalia no abastecimento",
      "Manutenção preventiva por km ou data, com desempenho por oficina",
      "Segurança: eventos com vídeo, contestação e score do motorista",
      "Assistente “Pergunte à sua frota”",
      "Relatórios recorrentes por e-mail",
      "Até 15 usuários no painel",
    ],
    featured: true,
    ctaLabel: "Agendar demonstração",
  },
  {
    id: "corporativo",
    name: "Corporativo",
    tagline: "Múltiplas filiais, integração com o ERP e acordo de nível de serviço.",
    pricePerVehicle: null,
    fleetRange: "acima de 120 veículos",
    modules: ["FLEET", "TRIPS", "CHECKLIST", "COSTS", "MAINTENANCE", "SAFETY", "ASSISTANT"],
    features: [
      "Tudo do Frota Pro",
      "Múltiplos CNPJs e filiais em uma conta",
      "SSO corporativo e política de senha própria",
      "Integração com ERP e TMS via API",
      "SLA contratual e gerente de conta",
      "Usuários ilimitados no painel",
    ],
    ctaLabel: "Falar com vendas",
  },
];

const comparison: PlanComparisonRow[] = [
  { label: "Rastreamento e histórico", values: [true, true, true] },
  { label: "Viagens e checklist", values: [true, true, true] },
  { label: "Custo por km em camadas", values: [false, true, true] },
  { label: "Manutenção preventiva", values: [false, true, true] },
  { label: "Segurança com vídeo", values: [false, true, true] },
  { label: "Assistente de frota", values: [false, true, true] },
  { label: "Usuários do painel", values: ["3", "15", "ilimitados"] },
  { label: "Retenção de checklists", values: ["12 meses", "24 meses", "contratual"] },
  { label: "Múltiplas filiais", values: [false, false, true] },
  { label: "SSO corporativo", values: [false, false, true] },
  { label: "Integração via API", values: [false, "leitura", "leitura e escrita"] },
  { label: "Suporte", values: ["e-mail", "e-mail e telefone", "SLA e gerente de conta"] },
];

export async function fetchPlans(): Promise<Plan[]> {
  await delay(280);
  return plans;
}

export async function fetchPlanComparison(): Promise<PlanComparisonRow[]> {
  await delay(280);
  return comparison;
}
