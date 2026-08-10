import type { TripStatus } from "@rookhub/types";

import type { Tone } from "@/components/ui";

/**
 * Vocabulário da viagem na ótica de quem dirige.
 *
 * O painel diz "Em trânsito"; o botão do motorista precisa dizer o que ele faz
 * agora — por isso o rótulo do estado e o rótulo da ação são campos separados.
 */
export const TRIP_STATUS: Record<TripStatus, { label: string; tone: Tone; action?: string }> = {
  PLANEJADA: { label: "Planejada", tone: "info", action: "Iniciar carregamento" },
  EM_CARREGAMENTO: { label: "Em carregamento", tone: "attention", action: "Sair para viagem" },
  EM_TRANSITO: { label: "Em trânsito", tone: "positive", action: "Cheguei para descarga" },
  EM_DESCARGA: { label: "Em descarga", tone: "attention", action: "Concluir viagem" },
  CONCLUIDA: { label: "Concluída", tone: "neutral" },
  CANCELADA: { label: "Cancelada", tone: "critical" },
};
