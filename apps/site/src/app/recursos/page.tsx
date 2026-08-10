import { ArrowUpRight } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Image from "next/image";

import robotImage from "@imgs/robo_para_site.png";

import { Container } from "@/components/layout/container";
import { Section, SectionHeading } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button-link";
import { Chip } from "@/components/ui/chip";
import { GlassCard } from "@/components/ui/glass-card";
import { LightCard } from "@/components/ui/light-card";
import { CtaSection } from "@/features/marketing/components/cta-section";
import { FaqList } from "@/features/marketing/components/faq-list";
import { ModuleGrid } from "@/features/marketing/components/module-grid";

export const metadata: Metadata = {
  title: "Recursos",
  description:
    "Rastreamento, viagens, checklist, custos, manutenção, segurança e assistente — o que cada módulo do RookHub faz na prática.",
};

const roles = [
  {
    role: "Dono",
    focus: "Custo por km, margem por rota e o que está drenando caixa sem aparecer.",
  },
  {
    role: "Gestor",
    focus: "Programação de viagens, preventiva e desempenho de motorista e oficina.",
  },
  {
    role: "Operador",
    focus: "Mapa ao vivo, atrasos e ocorrências — sem enxergar valor financeiro (RF-007).",
  },
  {
    role: "Manutenção",
    focus: "Fila de ordens de serviço, planos por km ou data e tempo parado por veículo.",
  },
  {
    role: "Motorista",
    focus: "App próprio: checklist, viagem, abastecimento e o próprio score.",
  },
];

const guarantees = [
  {
    title: "O número mostra a fonte",
    description:
      "Todo indicador do painel abre a origem: qual registro, qual período, quem lançou. Sem isso, ninguém discute o dado — só discute quem tem razão.",
  },
  {
    title: "Mídia de evento não fica com a gente",
    description:
      "Guardamos o metadado do evento e pedimos ao fornecedor uma URL assinada de no máximo quinze minutos, no momento em que você abre o player.",
  },
  {
    title: "Valor bloqueado, nunca escondido",
    description:
      "Quem não tem visibilidade financeira vê o campo bloqueado — e no servidor o valor sequer é enviado. Campo que some vira chamado de suporte.",
  },
  {
    title: "Integra com o que você já tem",
    description:
      "Rastreador, câmera, ERP e TMS entram por integração, com a saúde de cada conexão visível no painel. Nada de trocar hardware para começar.",
  },
];

export default function RecursosPage() {
  return (
    <>
      <section className="pb-12 pt-12 sm:pb-16 sm:pt-20">
        <Container>
          <SectionHeading
            eyebrow="Recursos"
            title="O que o RookHub faz, módulo a módulo"
            description="Cada módulo é contratado separadamente e resolve um problema inteiro — não meia funcionalidade que depende do próximo plano."
          />
        </Container>
      </section>

      <Section className="pt-0">
        <ModuleGrid variant="full" />
      </Section>

      {/* --------------------------------------------------------- Por papel */}
      <Section>
        <SectionHeading
          eyebrow="Por papel"
          title="Cada pessoa abre o painel dela"
          description="O RookHub não entrega a mesma tela para todo mundo com metade dos botões desabilitados. O papel define a página inicial, os módulos e a visibilidade financeira."
        />

        <LightCard className="reveal bg-light-outline mt-10 gap-px p-px">
          {roles.map((item) => (
            /* Dentro do bloco claro, `on-light-*`: `on-surface-*` some aqui (regra 2b). */
            <div key={item.role} className="bg-light flex flex-col gap-1 p-5 sm:flex-row sm:gap-8">
              <p className="text-body-md text-on-light w-40 shrink-0 font-medium">{item.role}</p>
              <p className="text-body-md text-on-light-variant">{item.focus}</p>
            </div>
          ))}
        </LightCard>

        <p className="text-label-md text-on-surface-muted mt-4">
          A guarda de rota no navegador é conveniência. A autorização de verdade — papel e módulo
          contratado — é sempre verificada no servidor.
        </p>
      </Section>

      {/* ------------------------------------------------------- Assistente */}
      <Section id="assistente" className="scroll-mt-28">
        <GlassCard className="reveal grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex min-w-0 flex-col items-start gap-5">
            <Chip>Pergunte à sua frota</Chip>
            <h2 className="font-display text-headline-lg text-on-surface sm:text-display-lg text-balance">
              A pergunta em português, a resposta com a fonte junto
            </h2>
            <p className="text-body-lg text-on-surface-variant text-pretty">
              “Qual caminhão me custou mais no trimestre?” devolve o número, o gráfico, a tabela por
              trás dele e o botão para abrir a ordem de serviço. Fora do escopo da frota, o
              assistente recusa em vez de inventar — que é o único comportamento aceitável quando o
              número vai virar decisão de compra.
            </p>
            <ButtonLink href="/contato" variant="bright">
              Ver funcionando
              <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
            </ButtonLink>
          </div>

          <div className="order-first min-w-0 lg:order-last">
            <Image
              src={robotImage}
              alt="Assistente do RookHub"
              sizes="(min-width: 1024px) 35vw, 80vw"
              className="mx-auto h-auto w-full max-w-xs select-none"
            />
          </div>
        </GlassCard>
      </Section>

      {/* ------------------------------------------------------- Compromissos */}
      <Section>
        <SectionHeading
          eyebrow="Compromissos"
          title="Quatro decisões que não estão à venda"
          description="São restrições de projeto, não configurações. Valem em todos os planos."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {guarantees.map((item) => (
            <div
              key={item.title}
              className="reveal border-outline-variant bg-surface-low/60 flex min-w-0 flex-col gap-2 rounded-lg border p-6"
            >
              <h3 className="font-display text-headline-md text-on-surface">{item.title}</h3>
              <p className="text-body-md text-on-surface-variant">{item.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section narrow>
        <SectionHeading eyebrow="Dúvidas" title="Perguntas que sempre chegam" align="center" />
        <div className="mt-10">
          <FaqList />
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
