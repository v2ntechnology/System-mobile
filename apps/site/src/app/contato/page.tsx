import { Buildings, EnvelopeSimple, Phone } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Section, SectionHeading } from "@/components/layout/section";
import { GlassCard } from "@/components/ui/glass-card";
import { ContactForm } from "@/features/contact/components/contact-form";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Agende uma demonstração do RookHub ou fale com o time de vendas. Resposta em até 24 horas úteis.",
};

const policies = [
  {
    id: "privacidade",
    title: "Privacidade",
    body: "Os dados enviados neste formulário são usados apenas para responder ao seu contato e não alimentam lista de disparo. Você pode pedir a exclusão a qualquer momento pelo mesmo e-mail.",
  },
  {
    id: "lgpd",
    title: "LGPD",
    body: "Operamos como controlador dos dados de contato e como operador dos dados da sua frota. O contrato traz o rol de tratamentos, o prazo de retenção e o canal do encarregado.",
  },
  {
    id: "seguranca",
    title: "Segurança",
    body: "Dados hospedados no Brasil, criptografia em trânsito e em repouso, backup diário e trilha de auditoria por usuário. Mídia de evento não é armazenada por nós (RN-092): pedimos ao fornecedor uma URL assinada válida por no máximo quinze minutos.",
  },
];

export default function ContatoPage() {
  return (
    <>
      <section className="pb-12 pt-12 sm:pb-16 sm:pt-20">
        <Container>
          <SectionHeading
            eyebrow="Contato"
            title="Conte o que está doendo — a gente responde em até 24 horas"
            description="A demonstração é conduzida por quem constrói o produto, dura trinta minutos e não exige instalar nada."
          />
        </Container>
      </section>

      <Section className="pt-0">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <GlassCard className="p-6 sm:p-8">
            <ContactForm />
          </GlassCard>

          <div className="flex min-w-0 flex-col gap-4">
            <GlassCard className="flex flex-col gap-4 p-6">
              <h2 className="font-display text-headline-md text-on-surface">Canais diretos</h2>

              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="text-body-md text-on-surface-variant hover:text-on-surface flex items-start gap-3"
              >
                <EnvelopeSimple
                  size={22}
                  weight="duotone"
                  aria-hidden="true"
                  className="text-secondary mt-0.5"
                />
                {siteConfig.contactEmail}
              </a>

              <p className="text-body-md text-on-surface-variant flex items-start gap-3">
                <Phone
                  size={22}
                  weight="duotone"
                  aria-hidden="true"
                  className="text-secondary mt-0.5"
                />
                <span className="tabular">{siteConfig.phone}</span>
              </p>

              <p className="text-body-md text-on-surface-variant flex items-start gap-3">
                <Buildings
                  size={22}
                  weight="duotone"
                  aria-hidden="true"
                  className="text-secondary mt-0.5"
                />
                Segunda a sexta, das 8h às 18h (horário de Brasília)
              </p>
            </GlassCard>

            <GlassCard className="flex flex-col gap-4 p-6">
              <h2 className="font-display text-headline-md text-on-surface">Já é cliente?</h2>
              <p className="text-body-md text-on-surface-variant">
                Suporte e abertura de chamado ficam dentro do painel, com o contexto da sua conta
                junto — é mais rápido do que por aqui.
              </p>
              <a
                href={siteConfig.panelUrl}
                className="text-body-md text-secondary underline-offset-4 hover:underline"
              >
                Entrar no painel
              </a>
            </GlassCard>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------- Políticas */}
      <Section>
        <SectionHeading eyebrow="Transparência" title="O que fazemos com os seus dados" />

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {policies.map((policy) => (
            <section
              key={policy.id}
              id={policy.id}
              className="reveal border-outline-variant bg-surface-low/60 flex min-w-0 scroll-mt-28 flex-col gap-2 rounded-lg border p-6"
            >
              <h3 className="font-display text-headline-md text-on-surface">{policy.title}</h3>
              <p className="text-body-md text-on-surface-variant">{policy.body}</p>
            </section>
          ))}
        </div>
      </Section>
    </>
  );
}
