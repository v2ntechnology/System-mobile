import { ArrowRightIcon } from "@phosphor-icons/react";
import { SpectrumButton } from "@rookhub/ui";
import { Link } from "react-router-dom";

import rookLost from "@imgs/400_rook_sem_fundo.png";

/**
 * Atalhos oferecidos no lugar da página que não existe.
 *
 * Todos apontam para rotas reais do `router`. As de `/app` são protegidas: quem
 * chegar aqui deslogado cai no login pela guarda, que é o comportamento correto —
 * o erro aqui é de endereço, não de sessão.
 */
const SHORTCUTS = [
  { to: "/app/mapa", label: "Mapa ao vivo" },
  { to: "/app/viagens", label: "Viagens" },
  { to: "/app/caminhoes", label: "Caminhões" },
  { to: "/app/relatorios", label: "Relatórios" },
] as const;

export function NotFoundPage() {
  return (
    <main className="bg-background flex min-h-dvh items-center px-6 py-12">
      {/*
       * A coluna da arte é maior que a do texto porque o PNG tem muita área
       * transparente em volta: numa divisão meio a meio a torre sai pequena demais
       * para o papel de protagonista que ela tem aqui.
       */}
      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-12">
        {/*
         * No mobile o mascote vem primeiro: ele explica o erro antes de qualquer
         * texto. A partir de `lg` a ordem se inverte e ele vai para a direita, que
         * é a leitura natural de "problema à esquerda, ilustração à direita".
         */}
        <div className="order-2 min-w-0 text-center lg:order-1 lg:text-left">
          <p className="text-label-md text-secondary uppercase">Erro 404</p>

          <h1 className="font-display text-display-lg text-on-surface mt-3 text-balance">
            Opa! Esse endereço não existe.
          </h1>

          <p className="text-body-lg text-on-surface-variant mt-4 text-pretty">
            A página que você procura pode ter sido movida, renomeada ou nunca ter existido. Nada
            aconteceu com os seus dados.
          </p>

          <SpectrumButton asChild variant="primary" size="lg" className="mt-8">
            <Link to="/">
              Voltar ao início
              <ArrowRightIcon size={20} weight="bold" aria-hidden="true" />
            </Link>
          </SpectrumButton>

          <nav aria-label="Atalhos" className="mt-10">
            <p className="text-label-md text-on-surface-muted normal-case">
              Ou vá direto para uma destas telas:
            </p>

            <ul className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2 lg:justify-start">
              {SHORTCUTS.map((shortcut) => (
                <li key={shortcut.to}>
                  <Link
                    to={shortcut.to}
                    className="text-body-md text-on-surface hover:text-secondary focus-visible:ring-secondary focus-visible:ring-offset-background rounded-sm underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
                  >
                    {shortcut.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/*
         * `alt` vazio e `aria-hidden`: o mascote repete o que o título já diz, e um
         * texto alternativo aqui só faria o leitor de tela anunciar a mesma coisa duas
         * vezes. A informação do erro está no `h1`.
         */}
        <img
          src={rookLost}
          alt=""
          aria-hidden="true"
          draggable={false}
          /* O PNG tem bastante área transparente em volta: sem ocupar a coluna inteira, a torre sai pequena demais. */
          className="order-1 mx-auto w-full max-w-sm select-none lg:order-2 lg:max-w-none"
        />
      </div>
    </main>
  );
}
