import { ArrowRight, DeviceMobile } from "@phosphor-icons/react/ssr";
import Image from "next/image";

import towerImage from "@imgs/torre_para_site.png";
import robotImage from "@imgs/robo_para_site.png";

import { Container } from "@/components/layout/container";
import { Section, SectionHeading } from "@/components/layout/section";
import { buttonVariants } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Chip } from "@/components/ui/chip";
import { GlassCard } from "@/components/ui/glass-card";
import { CtaSection } from "@/features/marketing/components/cta-section";
import { FaqList } from "@/features/marketing/components/faq-list";
import { MetricsStrip } from "@/features/marketing/components/metrics-strip";
import { ModuleGrid } from "@/features/marketing/components/module-grid";
import { StepsList } from "@/features/marketing/components/steps-list";
import { Testimonials } from "@/features/marketing/components/testimonials";
import { siteConfig } from "@/lib/site-config";

const driverHighlights = [
  "Checklist pré-viagem com foto no item reprovado e bloqueio do veículo",
  "Abastecimento com km/l apurado na hora, sem planilha depois",
  "Viagem avança pelo celular — o operador para de receber ligação",
  "Score, CNH e contrato do motorista no mesmo lugar que ele já usa",
];

export default function HomePage() {
  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="pb-16 pt-12 sm:pb-24 sm:pt-20">
        <Container className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex min-w-0 flex-col items-start gap-6">
            <Chip>Plataforma de gestão de frotas</Chip>

            <h1 className="font-display text-display-lg text-on-surface text-balance sm:text-[64px] sm:leading-[70px]">
              A frota inteira em <span className="spectrum-text">um número que você confia</span>
            </h1>

            <p className="text-body-lg text-on-surface-variant max-w-xl text-pretty">
              {siteConfig.description} Do checklist no pátio ao custo por km do fechamento — com a
              fonte de cada número à vista.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contato" variant="bright" size="lg">
                Agendar demonstração
                <ArrowRight size={18} weight="bold" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/recursos" variant="ghost" size="lg">
                Ver os recursos
              </ButtonLink>
            </div>

            <p className="text-label-md text-on-surface-muted">
              Sem trocar de rastreador · Implantação em dias · Dados hospedados no Brasil
            </p>
          </div>

          <div className="min-w-0">
            <Image
              src={towerImage}
              alt="Torre do RookHub — a marca da plataforma"
              priority
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="mx-auto h-auto w-full max-w-md select-none"
            />
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------------ Números */}
      <Container>
        <MetricsStrip />
      </Container>

      {/* ------------------------------------------------------------ Módulos */}
      <Section>
        <SectionHeading
          eyebrow="Módulos"
          title="Sete módulos, contratados um a um"
          description="Você liga o que a operação precisa hoje e adiciona o resto quando fizer sentido. Nada de pagar por tela que ninguém abre."
        />

        <div className="mt-10 flex flex-col gap-8">
          <ModuleGrid />
          <ButtonLink href="/recursos" variant="ghost" className="self-start">
            Ver o que cada módulo faz
            <ArrowRight size={18} weight="bold" aria-hidden="true" />
          </ButtonLink>
        </div>
      </Section>

      {/* ---------------------------------------------------------- Como funciona */}
      <Section>
        <SectionHeading
          eyebrow="Como funciona"
          title="Quatro passos até a primeira decisão com dado"
          description="A implantação não é um projeto de seis meses. O objetivo do primeiro mês é um único número confiável, não o painel inteiro."
        />
        <div className="mt-10">
          <StepsList />
        </div>
      </Section>

      {/* ------------------------------------------------------ App do motorista */}
      <Section id="app-motorista" className="scroll-mt-28">
        <GlassCard className="reveal grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="order-last min-w-0 lg:order-first">
            <Image
              src={robotImage}
              alt="Assistente do RookHub, mascote da plataforma"
              sizes="(min-width: 1024px) 35vw, 80vw"
              className="mx-auto h-auto w-full max-w-sm select-none"
            />
          </div>

          <div className="flex min-w-0 flex-col items-start gap-5">
            <Chip>
              <DeviceMobile size={14} weight="bold" aria-hidden="true" />
              App do motorista
            </Chip>

            <h2 className="font-display text-headline-lg text-on-surface sm:text-display-lg text-balance">
              O dado nasce onde o caminhão está
            </h2>

            <p className="text-body-lg text-on-surface-variant text-pretty">
              Nenhum painel se sustenta com dado digitado no escritório dois dias depois. O app do
              motorista é o que faz a informação chegar limpa — e ele foi desenhado para quem está
              em pé, no pátio, muitas vezes de luva.
            </p>

            <ul className="flex flex-col gap-3">
              {driverHighlights.map((item) => (
                <li key={item} className="text-body-md text-on-surface-variant flex gap-3">
                  <span
                    aria-hidden="true"
                    className="rounded-pill bg-secondary mt-2 h-1.5 w-1.5 shrink-0"
                  />
                  {item}
                </li>
              ))}
            </ul>

            <p className="text-label-md text-on-surface-muted">Android e iOS · funciona offline</p>
          </div>
        </GlassCard>
      </Section>

      {/* --------------------------------------------------------- Depoimentos */}
      <Section>
        <SectionHeading
          eyebrow="Quem usa"
          title="Frotas que pararam de decidir no achismo"
          align="center"
        />
        <div className="mt-10">
          <Testimonials />
        </div>
      </Section>

      {/* ---------------------------------------------------------------- FAQ */}
      <Section narrow>
        <SectionHeading eyebrow="Dúvidas" title="Perguntas que sempre chegam" align="center" />
        <div className="mt-10">
          <FaqList />
        </div>
        <p className="text-body-md text-on-surface-variant mt-8 text-center">
          Ficou outra?{" "}
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className={buttonVariants({ variant: "link" })}
          >
            {siteConfig.contactEmail}
          </a>
        </p>
      </Section>

      <CtaSection />
    </>
  );
}
