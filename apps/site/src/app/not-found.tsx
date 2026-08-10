import Image from "next/image";

import rookLost from "@imgs/400_rook_sem_fundo.png";

import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  return (
    <Container narrow className="flex flex-col items-center gap-6 py-24 text-center">
      <Image
        src={rookLost}
        alt=""
        aria-hidden="true"
        sizes="(min-width: 640px) 20rem, 60vw"
        className="h-auto w-full max-w-xs select-none"
      />

      <h1 className="font-display text-headline-lg text-on-surface sm:text-display-lg">
        Essa rota não existe
      </h1>

      <p className="text-body-lg text-on-surface-variant text-pretty">
        O endereço mudou ou o link veio quebrado. Volte para o início ou fale com a gente — a gente
        arruma.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/" variant="bright" size="lg">
          Voltar para o início
        </ButtonLink>
        <ButtonLink href="/contato" variant="ghost" size="lg">
          Falar com a gente
        </ButtonLink>
      </div>
    </Container>
  );
}
