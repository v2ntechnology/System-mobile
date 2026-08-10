import { delay } from "./latency";

export interface Value {
  title: string;
  description: string;
  icon: string;
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
}

const values: Value[] = [
  {
    title: "O número tem que ter fonte",
    description:
      "Toda métrica do painel mostra de onde veio. Indicador sem rastro é opinião com casa decimal.",
    icon: "MagnifyingGlass",
  },
  {
    title: "O motorista é usuário, não sensor",
    description:
      "O app é feito para quem está em pé no pátio, de luva, com o caminhão esperando. Se atrapalha a saída, está errado.",
    icon: "SteeringWheel",
  },
  {
    title: "Bloquear, não esconder",
    description:
      "Quem não pode ver um valor enxerga o campo bloqueado. Campo que some vira chamado de suporte e desconfiança.",
    icon: "Lock",
  },
  {
    title: "Guardar o mínimo",
    description:
      "Vídeo de cabine não é copiado para cá. Pedimos ao fornecedor uma URL assinada de quinze minutos quando você abre o player.",
    icon: "ShieldCheck",
  },
];

const milestones: Milestone[] = [
  {
    year: "2023",
    title: "A pergunta que ninguém respondia",
    description:
      "Nasceu de uma consultoria em uma transportadora do interior de São Paulo: qual caminhão está custando mais, e por quê. A resposta levava três planilhas e dois dias.",
  },
  {
    year: "2024",
    title: "Primeiro checklist que bloqueou um veículo",
    description:
      "A versão inicial rodou com quatro frotas parceiras. O checklist com bloqueio foi o recurso que mudou o comportamento no pátio já no primeiro mês.",
  },
  {
    year: "2025",
    title: "Custos e manutenção em produção",
    description:
      "Custo por km em camadas e preventiva com gatilho duplo (km ou data) entraram para todos os clientes do plano Frota Pro.",
  },
  {
    year: "2026",
    title: "Pergunte à sua frota",
    description:
      "O assistente passou a responder em português com gráfico, tabela e a fonte do número — e a recusar o que está fora do escopo da frota.",
  },
];

const team: TeamMember[] = [
  {
    name: "Vinícius Vilanova",
    role: "Produto e engenharia",
    bio: "Puxa a arquitetura do produto e a régua de acessibilidade e contraste que todo componente precisa passar.",
  },
  {
    name: "Marina Alencar",
    role: "Operações",
    bio: "Doze anos em gestão de frota. Traduz o que acontece no pátio para o que a tela precisa fazer.",
  },
  {
    name: "Rafael Queiroz",
    role: "Dados e custos",
    bio: "Responsável pelo modelo de custo por km em camadas e pela detecção de anomalia em abastecimento.",
  },
  {
    name: "Cláudia Ferrer",
    role: "Segurança e privacidade",
    bio: "Encarregada de dados. Definiu a política de mídia sob demanda que mantém vídeo de cabine fora dos nossos servidores.",
  },
];

export async function fetchValues(): Promise<Value[]> {
  await delay(200);
  return values;
}

export async function fetchMilestones(): Promise<Milestone[]> {
  await delay(200);
  return milestones;
}

export async function fetchTeam(): Promise<TeamMember[]> {
  await delay(200);
  return team;
}
