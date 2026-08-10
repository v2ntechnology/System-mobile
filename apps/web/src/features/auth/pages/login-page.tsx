import { Grainient, useNoBlur } from "@rookhub/ui";
import { Navigate } from "react-router-dom";

import { RookhubLogo } from "@/components/brand/rookhub-logo";

import { LoginForm } from "../components/login-form";
import { landingFor } from "../landing";
import { useSession } from "../store";

export function LoginPage() {
  const session = useSession();
  const noBlur = useNoBlur();

  /*
   * Mesmo destino que o formulário usa (`landingFor`). Esta guarda dispara no
   * instante em que a sessão entra no store — se ela apontasse para outro lugar,
   * venceria a navegação do formulário e o dono nunca veria o portal.
   */
  if (session) return <Navigate to={landingFor(session.user.role)} replace />;

  return (
    /*
     * `h-dvh` + `overflow-hidden`: a tela ocupa exatamente o viewport e a página não
     * rola. A margem é a mesma nos quatro lados (`p-4`/`p-6`), e o `gap` acompanha o
     * mesmo valor para que o respiro entre os painéis case com o das bordas.
     */
    <main className="bg-background h-dvh overflow-hidden p-4 sm:p-6">
      {/*
       * Sem largura máxima: o grid ocupa o viewport inteiro, então a única folga nas
       * laterais é o padding do `main`. A coluna do formulário é fixa em 30rem e o
       * painel de marca fica com todo o resto — quanto maior a tela, maior a fatia
       * dele. Numa proporção (`3fr_2fr`) o formulário engordava junto com a janela
       * sem nenhum ganho de leitura.
       *
       * Abaixo de `lg` o painel some: é peça de marca, e num celular empurraria o
       * formulário para baixo da dobra — que é o motivo pelo qual a pessoa abriu a tela.
       */}
      <div className="grid h-full gap-4 sm:gap-6 lg:grid-cols-[1fr_34rem] lg:gap-12">
        {/*
         * Painel de marca. Superfície indigo com texto branco usa `primary-strong`
         * (#5457EE): o `primary` dá 4,47:1 com branco e reprova AA por uma casa.
         */}
        <aside className="bg-primary-strong relative hidden min-w-0 flex-col justify-between overflow-hidden rounded-lg p-10 lg:flex">
          {/*
           * O gradiente é decoração: fica atrás do conteúdo e o `primary-strong` do
           * painel continua embaixo como cor de base — é ele que aparece em
           * `:root.no-blur`, onde o canvas nem chega a montar (FE-07).
           */}
          {noBlur ? null : (
            <Grainient
              className="absolute inset-0"
              color1="#8385F4"
              color2="#6366F1"
              color3="#06B6D4"
              timeSpeed={0.25}
              colorBalance={0}
              warpStrength={1}
              warpFrequency={5}
              warpSpeed={2}
              warpAmplitude={50}
              blendAngle={0}
              blendSoftness={0.05}
              rotationAmount={500}
              noiseScale={2}
              grainAmount={0.1}
              grainScale={2}
              grainAnimated={false}
              contrast={1.5}
              gamma={1}
              saturation={1}
              centerX={0}
              centerY={0}
              zoom={0.9}
            />
          )}

          {/*
           * Scrim do rodapé do painel. O gradiente anima, então a cor atrás da copy
           * não é fixa: medido no canvas, o branco vai de 5,1:1 a 2,6:1 conforme a
           * faixa cyan (#06B6D4) passa pelo texto — reprova a regra 7. O scrim fixa
           * um piso escuro sob a copy e deixa o gradiente livre no resto do painel.
           */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[rgba(10,10,16,0.72)] via-[rgba(10,10,16,0.36)] to-transparent"
          />

          <RookhubLogo variant="mark" className="relative h-12 self-start" />

          <div className="relative">
            <p className="text-body-lg text-on-primary/80">Você pode facilmente</p>

            {/*
             * `ch` só vale a pena no elemento que carrega o tamanho da fonte: num
             * container em 16px ele mediria a linha do corpo, e o título quebrava
             * em cinco linhas dentro de um painel de 600px.
             */}
            <p className="font-display text-on-primary leading-11 mt-3 max-w-[18ch] text-balance text-[34px] font-bold">
              Acompanhar sua frota inteira com clareza e controle
            </p>
          </div>
        </aside>

        {/*
         * Coluna do formulário — centrada na própria coluna, não no viewport.
         *
         * O `min-h-full` no filho é o que permite centralizar e ainda assim rolar
         * dentro da coluna numa janela baixa: com `items-center` puro, o excesso
         * sairia pelo topo e o botão de entrar ficaria inalcançável.
         */}
        {/*
         * O `pr` entra na coluna, não no `main`: a barra de rolagem interna precisa
         * continuar colada na borda direita quando a janela é baixa. A coluna foi de
         * 30rem para 34rem junto com ele, senão o formulário perderia os 440px que
         * os campos precisam e começaria a encolher.
         */}
        <section className="min-w-0 overflow-y-auto lg:pr-10">
          <div className="flex min-h-full items-center justify-center py-2">
            <div className="max-w-110 w-full">
              <header>
                <RookhubLogo variant="mark" className="h-10" />

                <h1 className="font-display text-on-surface mt-6 text-balance text-[28px] font-bold leading-9 sm:text-[32px] sm:leading-10">
                  Bem-vindo de volta
                </h1>

                <p className="text-body-md text-on-surface-variant mt-2">
                  Acesse suas viagens, veículos e equipe a qualquer hora — tudo em um só lugar.
                </p>
              </header>

              {/*
               * Sem `GlassCard`: no layout de duas colunas o formulário é o conteúdo da
               * página, não um objeto flutuando sobre ela. O vidro volta a fazer sentido
               * se o painel voltar a ser fundo de tela cheia.
               */}
              <div className="mt-8">
                <LoginForm />

                <p className="border-outline-variant text-body-md text-on-surface-variant mt-7 border-t pt-6 text-center">
                  Ainda não usa o RookHub?{" "}
                  <a
                    href="https://rookhub.com.br"
                    className="text-on-surface hover:text-secondary focus-visible:ring-secondary focus-visible:ring-offset-background rounded-sm font-semibold underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
                  >
                    Fale com nosso time
                  </a>
                </p>
              </div>

              <footer className="text-label-md text-on-surface-variant mt-8 text-center normal-case">
                © {new Date().getFullYear()} RookHub · Gestão inteligente de frotas
              </footer>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
