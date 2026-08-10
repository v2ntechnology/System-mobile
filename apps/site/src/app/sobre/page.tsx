import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Section, SectionHeading } from "@/components/layout/section";
import { GlassCard } from "@/components/ui/glass-card";
import { Icon } from "@/components/ui/icon";
import { LightCard } from "@/components/ui/light-card";
import { fetchMilestones, fetchTeam, fetchValues } from "@/features/company/api";
import { CtaSection } from "@/features/marketing/components/cta-section";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "O RookHub nasceu de uma pergunta que ninguém conseguia responder: qual caminhão está custando mais, e por quê.",
};

export default async function SobrePage() {
  const [values, milestones, team] = await Promise.all([
    fetchValues(),
    fetchMilestones(),
    fetchTeam(),
  ]);

  return (
    <>
      <section className="pb-12 pt-12 sm:pb-16 sm:pt-20">
        <Container>
          <SectionHeading
            eyebrow="Sobre"
            title="Começou com uma pergunta que levava dois dias para responder"
            description="“Qual caminhão está me custando mais, e por quê.” A resposta existia — espalhada em três planilhas, um caderno e a memória do gerente de manutenção. O RookHub é a tentativa de juntar isso em um lugar onde o número tenha fonte."
          />
        </Container>
      </section>

      {/* -------------------------------------------------------- Princípios */}
      <Section className="pt-0">
        <div className="grid gap-4 sm:grid-cols-2">
          {values.map((value) => (
            <GlassCard key={value.title} className="reveal flex flex-col gap-4 p-6">
              <span className="bg-secondary/15 text-secondary inline-flex h-12 w-12 items-center justify-center rounded-md">
                <Icon name={value.icon} size={26} />
              </span>
              <h2 className="font-display text-headline-md text-on-surface">{value.title}</h2>
              <p className="text-body-md text-on-surface-variant">{value.description}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------- Trajetória */}
      <Section>
        <SectionHeading eyebrow="Trajetória" title="Como chegamos até aqui" />

        <ol className="mt-10 flex flex-col">
          {milestones.map((milestone) => (
            <li
              key={milestone.year}
              /* A linha vertical é borda do item, não um pseudo-elemento posicionado:
                 acompanha a altura real do texto sem cálculo. */
              className="reveal border-outline-variant flex gap-6 border-l pb-10 pl-6 last:border-l-transparent last:pb-0"
            >
              <div className="flex min-w-0 flex-col gap-2">
                <p className="tabular font-display text-headline-md text-secondary">
                  {milestone.year}
                </p>
                <h3 className="text-body-lg text-on-surface font-medium">{milestone.title}</h3>
                <p className="text-body-md text-on-surface-variant max-w-2xl">
                  {milestone.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* ---------------------------------------------------------------- Time */}
      <Section>
        <SectionHeading
          eyebrow="Time"
          title="Gente de frota e gente de software, na mesma sala"
          description="Metade do time veio da operação. É por isso que o app do motorista tem botão grande: alguém aqui já preencheu checklist de luva, na chuva."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {team.map((member) => (
            <LightCard key={member.name} className="reveal gap-2">
              <p className="text-body-lg text-on-light font-medium">{member.name}</p>
              <p className="text-label-md text-primary-on-light uppercase">{member.role}</p>
              <p className="text-body-md text-on-light-variant">{member.bio}</p>
            </LightCard>
          ))}
        </div>
      </Section>

      <CtaSection
        title="Quer conhecer a gente de perto?"
        description="A demonstração é conduzida por quem constrói o produto — não por um roteiro de vendas."
      />
    </>
  );
}
