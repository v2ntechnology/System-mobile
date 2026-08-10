import { buttonVariants } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/lib/site-config";

export interface CtaSectionProps {
  title?: string;
  description?: string;
}

export function CtaSection({
  title = "Veja o RookHub com os dados da sua frota",
  description = "Trinta minutos, sem instalação. A gente carrega uma amostra da sua planilha e mostra o custo por km que ela esconde.",
}: CtaSectionProps) {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        {/*
         * Superfície indigo com texto branco usa `primary-strong` (#5457EE): o
         * âncora `primary` dá 4,47:1 com branco e reprova AA por uma casa (regra 2).
         */}
        <div className="reveal bg-primary-strong relative overflow-hidden rounded-lg p-8 sm:p-12">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-60 [background-image:var(--spectrum-gradient)] [mask-image:radial-gradient(ellipse_60%_120%_at_100%_0%,#000,transparent)]"
          />

          <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex max-w-xl flex-col gap-3">
              <h2 className="font-display text-headline-lg text-on-primary sm:text-display-lg text-balance">
                {title}
              </h2>
              <p className="text-body-lg text-on-primary/90 text-pretty">{description}</p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contato" variant="bright" size="lg">
                Agendar demonstração
              </ButtonLink>
              <a
                href={siteConfig.panelUrl}
                className={buttonVariants({
                  variant: "ghost",
                  size: "lg",
                  className: "text-on-primary border-white/40 bg-white/10 hover:bg-white/20",
                })}
              >
                Entrar no painel
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
