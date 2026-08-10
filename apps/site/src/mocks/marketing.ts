import type { Module } from "@rookhub/types";

import { delay } from "./latency";

export interface ProductModule {
  /** Mesmo identificador de entitlement usado pelo painel (RF-002). */
  id: Module;
  name: string;
  summary: string;
  /** Nome do ícone Phosphor — resolvido na camada de componente, não aqui. */
  icon: string;
  highlights: string[];
  /** Rota do painel onde o módulo vive — dá concretude à página de recursos. */
  panelRoute: string;
}

export interface Metric {
  label: string;
  value: string;
  detail: string;
}

export interface Step {
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface Faq {
  question: string;
  answer: string;
}

const modules: ProductModule[] = [
  {
    id: "FLEET",
    name: "Frota e rastreamento",
    summary:
      "Onde está cada caminhão agora, com histórico de posição e alerta de dado desatualizado.",
    icon: "Truck",
    highlights: [
      "Mapa ao vivo com a frota inteira em uma instância só",
      "Ficha completa do veículo: documentos, pneus, consumo e ocorrências",
      "Aviso explícito quando a última posição envelhece",
    ],
    panelRoute: "/app/mapa",
  },
  {
    id: "TRIPS",
    name: "Viagens",
    summary: "Da programação à entrega, com a máquina de estados visível para todo mundo.",
    icon: "Path",
    highlights: [
      "Em curso, atrasadas e concluídas em uma só tela",
      "Linha do tempo de cada mudança de status, com autor e horário",
      "Motorista avança a viagem pelo celular, sem ligar para o operador",
    ],
    panelRoute: "/app/viagens",
  },
  {
    id: "CHECKLIST",
    name: "Checklist do motorista",
    summary: "Inspeção pré-viagem que realmente bloqueia a saída quando um item crítico reprova.",
    icon: "ClipboardText",
    highlights: [
      "Templates versionados — a inspeção antiga continua auditável",
      "Foto obrigatória no item reprovado",
      "Bloqueio automático do veículo e abertura de ordem de serviço",
    ],
    panelRoute: "/app/checklists",
  },
  {
    id: "COSTS",
    name: "Custos",
    summary: "Custo por km em camadas: combustível, manutenção, pedágio, pneu e pessoa.",
    icon: "ChartLineUp",
    highlights: [
      "Abastecimento com km/l apurado e detecção de anomalia",
      "Comparação entre veículos, rotas e períodos",
      "Valores sensíveis respeitam a visibilidade financeira do papel (RF-007)",
    ],
    panelRoute: "/app/custos",
  },
  {
    id: "MAINTENANCE",
    name: "Manutenção",
    summary: "Preventiva por km ou por data, com desempenho de cada oficina medido.",
    icon: "Wrench",
    highlights: [
      "Planos preventivos que abrem a OS sozinhos",
      "Ordens de serviço com peça, mão de obra e tempo parado",
      "Ranking de oficinas por custo e por prazo",
    ],
    panelRoute: "/app/manutencao",
  },
  {
    id: "SAFETY",
    name: "Segurança",
    summary: "Evento de direção com vídeo, contestação do motorista e score que evolui.",
    icon: "ShieldCheck",
    highlights: [
      "Eventos de telemetria com mídia do fornecedor sob demanda",
      "Fila de contestações com decisão registrada",
      "Score do motorista por período, não por opinião",
    ],
    panelRoute: "/app/seguranca",
  },
  {
    id: "ASSISTANT",
    name: "Pergunte à sua frota",
    summary: "A pergunta em português vira número, gráfico e a fonte do dado.",
    icon: "Sparkle",
    highlights: [
      "Responde com texto, gráfico e tabela — e mostra de onde veio o número",
      "Ações contextuais: abrir a OS, avisar o motorista, exportar",
      "Recusa o que está fora do escopo da frota, em vez de inventar",
    ],
    panelRoute: "/app",
  },
];

const metrics: Metric[] = [
  { label: "Custo por km", value: "-12%", detail: "média dos clientes no primeiro semestre" },
  { label: "Viagens no prazo", value: "94%", detail: "com programação e alerta de atraso ativos" },
  { label: "Parada não planejada", value: "-31%", detail: "após seis meses de preventiva por km" },
  { label: "Checklist preenchido", value: "98%", detail: "quando a inspeção bloqueia a saída" },
];

const steps: Step[] = [
  {
    title: "Cadastre a frota",
    description:
      "Importe veículos, motoristas e documentos por planilha. Em uma tarde a base está no ar.",
  },
  {
    title: "Coloque o motorista no app",
    description:
      "Ele entra pelo celular, faz o checklist, registra abastecimento e avança a viagem. Sem treinamento longo.",
  },
  {
    title: "Ligue os módulos que fazem sentido",
    description:
      "Custos, manutenção e segurança são contratados por módulo. Você paga pelo que usa e liga o resto quando precisar.",
  },
  {
    title: "Decida com o número na mão",
    description:
      "Painel do dono, relatórios recorrentes por e-mail e o assistente para a pergunta que não estava no relatório.",
  },
];

const testimonials: Testimonial[] = [
  {
    quote:
      "O checklist parou de ser papel esquecido no painel do caminhão. Hoje o veículo não sai do pátio com pneu reprovado — e isso apareceu na conta de manutenção no terceiro mês.",
    author: "Marina Alencar",
    role: "Diretora de operações",
    company: "Transportes Vale Norte",
  },
  {
    quote:
      "Eu perguntava 'qual caminhão está me custando mais?' e a resposta levava dois dias e três planilhas. Agora levo o tempo de digitar a frase.",
    author: "Rogério Bastos",
    role: "Sócio-proprietário",
    company: "RB Logística",
  },
  {
    quote:
      "A contestação de evento mudou o clima com os motoristas. Eles veem o vídeo, respondem, e a decisão fica registrada. Deixou de ser palavra contra palavra.",
    author: "Cláudia Ferrer",
    role: "Gestora de frota",
    company: "Cargas Meridiano",
  },
];

const faqs: Faq[] = [
  {
    question: "Preciso trocar meu rastreador?",
    answer:
      "Não. O RookHub integra com os rastreadores e as câmeras que você já tem — a posição e os eventos entram pela integração do fornecedor. A saúde de cada integração fica visível no painel de configurações.",
  },
  {
    question: "Quanto tempo leva para implantar?",
    answer:
      "A carga inicial de veículos e motoristas é feita por planilha e costuma ficar pronta no primeiro dia. O que leva tempo é o hábito: recomendamos começar por checklist e viagens, e ligar custos no segundo mês.",
  },
  {
    question: "O motorista precisa de celular corporativo?",
    answer:
      "Não. O app roda em Android e iOS no aparelho dele, funciona com conexão instável e guarda o preenchimento até conseguir enviar.",
  },
  {
    question: "Quem enxerga salário e valores?",
    answer:
      "A visibilidade financeira é por papel (RF-007). Quem não pode ver enxerga o campo bloqueado, não escondido — e no servidor o valor sequer é enviado para esse usuário.",
  },
  {
    question: "Meus dados ficam onde?",
    answer:
      "Em datacenter no Brasil, com backup diário e retenção configurável. A mídia de evento não é copiada para o RookHub: pedimos ao fornecedor uma URL assinada válida por no máximo 15 minutos, no momento em que você abre o vídeo.",
  },
];

export async function fetchModules(): Promise<ProductModule[]> {
  await delay(300);
  return modules;
}

export async function fetchMetrics(): Promise<Metric[]> {
  await delay(200);
  return metrics;
}

export async function fetchSteps(): Promise<Step[]> {
  await delay(200);
  return steps;
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  await delay(250);
  return testimonials;
}

export async function fetchFaqs(): Promise<Faq[]> {
  await delay(200);
  return faqs;
}
