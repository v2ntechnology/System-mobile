import { Check, Minus } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Section, SectionHeading } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button-link";
import { Chip } from "@/components/ui/chip";
import { GlassCard } from "@/components/ui/glass-card";
import { LightCard } from "@/components/ui/light-card";
import { fetchPlanComparison, fetchPlans } from "@/features/plans/api";
import { CtaSection } from "@/features/marketing/components/cta-section";
import { FaqList } from "@/features/marketing/components/faq-list";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Planos",
  description:
    "Essencial, Frota Pro e Corporativo — cobrança por veículo ativo, módulos contratados separadamente e sem fidelidade.",
};

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export default async function PlanosPage() {
  const [plans, comparison] = await Promise.all([fetchPlans(), fetchPlanComparison()]);

  return (
    <>
      <section className="pb-12 pt-12 sm:pb-16 sm:pt-20">
        <Container>
          <SectionHeading
            eyebrow="Planos"
            title="Você paga por veículo ativo — e só pelos módulos que ligou"
            description="Veículo parado no pátio por mais de 30 dias não entra na fatura. Sem fidelidade, sem taxa de implantação."
            align="center"
          />
        </Container>
      </section>

      <Section className="pt-0">
        <div className="grid items-start gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <GlassCard
              key={plan.id}
              className={cn(
                "reveal flex flex-col gap-6 p-6 sm:p-8",
                // Um destaque só. Dois destaques não destacam nada.
                plan.featured && "border-primary/60 ring-primary/40 ring-1 lg:-mt-4 lg:pb-12",
              )}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-display text-headline-md text-on-surface">{plan.name}</h2>
                  {plan.featured ? (
                    <span className="rounded-pill bg-primary-strong text-label-sm text-on-primary px-3 py-1 uppercase">
                      Mais contratado
                    </span>
                  ) : null}
                </div>
                <p className="text-body-md text-on-surface-variant">{plan.tagline}</p>
              </div>

              <div className="border-outline-variant flex flex-col gap-1 border-y py-5">
                {plan.pricePerVehicle === null ? (
                  <p className="font-display text-headline-lg text-on-surface">Sob consulta</p>
                ) : (
                  <p className="flex items-baseline gap-2">
                    <span className="tabular font-display text-display-lg text-on-surface">
                      {currency.format(plan.pricePerVehicle)}
                    </span>
                    <span className="text-body-md text-on-surface-muted">/veículo/mês</span>
                  </p>
                )}
                <p className="text-label-md text-on-surface-muted">{plan.fleetRange}</p>
              </div>

              <ul className="flex flex-1 flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="text-body-md text-on-surface-variant flex gap-3">
                    <Check
                      size={18}
                      weight="bold"
                      aria-hidden="true"
                      className="text-secondary mt-1 shrink-0"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <ButtonLink
                href="/contato"
                variant={plan.featured ? "bright" : "ghost"}
                size="lg"
                block
              >
                {plan.ctaLabel}
              </ButtonLink>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* -------------------------------------------------------- Comparação */}
      <Section>
        <SectionHeading
          eyebrow="Comparação"
          title="Linha a linha"
          description="A mesma informação dos cartões acima, para quem precisa levar a decisão a uma reunião."
        />

        <LightCard className="reveal mt-10 p-0">
          {/* Tabela larga rola dentro do próprio container — a página nunca rola na horizontal. */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[42rem] border-collapse text-left">
              <caption className="sr-only">
                Comparação de recursos entre os planos Essencial, Frota Pro e Corporativo
              </caption>
              <thead>
                <tr className="border-light-outline border-b">
                  <th scope="col" className="text-label-md text-on-light-muted p-4 uppercase">
                    Recurso
                  </th>
                  {plans.map((plan) => (
                    <th
                      key={plan.id}
                      scope="col"
                      className="text-body-md text-on-light p-4 font-medium"
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.label} className="border-light-outline border-b last:border-b-0">
                    <th scope="row" className="text-body-md text-on-light-variant p-4 font-normal">
                      {row.label}
                    </th>
                    {row.values.map((value, index) => (
                      <td key={`${row.label}-${plans[index]?.id ?? index}`} className="p-4">
                        {typeof value === "boolean" ? (
                          value ? (
                            <>
                              <Check
                                size={20}
                                weight="bold"
                                aria-hidden="true"
                                className="text-success-on-light"
                              />
                              <span className="sr-only">incluído</span>
                            </>
                          ) : (
                            <>
                              <Minus
                                size={20}
                                weight="bold"
                                aria-hidden="true"
                                className="text-on-light-muted"
                              />
                              <span className="sr-only">não incluído</span>
                            </>
                          )
                        ) : (
                          <span className="tabular text-body-md text-on-light">{value}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </LightCard>
      </Section>

      <Section narrow>
        <div className="flex flex-col items-center gap-4 text-center">
          <Chip>Extensões</Chip>
          <p className="text-body-lg text-on-surface-variant text-pretty">
            Módulos adicionais — retenção estendida, integração dedicada, usuários extras — são
            contratados a qualquer momento e entram na próxima fatura, com o valor visível no painel
            antes de você confirmar.
          </p>
        </div>
      </Section>

      <Section narrow className="pt-0">
        <SectionHeading eyebrow="Dúvidas" title="Antes de contratar" align="center" />
        <div className="mt-10">
          <FaqList />
        </div>
      </Section>

      <CtaSection
        title="Não sabe qual plano cabe na sua frota?"
        description="Conte o tamanho da operação e o que dói hoje. A gente diz por onde começar — inclusive se for pelo Essencial."
      />
    </>
  );
}
