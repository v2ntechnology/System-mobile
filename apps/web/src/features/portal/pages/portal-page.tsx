import {
  ArrowRightIcon,
  ChartLineUpIcon,
  ChatCircleDotsIcon,
  CheckCircleIcon,
  LockSimpleIcon,
  ShieldCheckIcon,
  SparkleIcon,
  SquaresFourIcon,
  TargetIcon,
  type Icon,
} from "@phosphor-icons/react";
import { GlassCard, SpectrumButton, cn } from "@rookhub/ui";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import logoName from "@imgs/RookHubNome.svg";
import robotImage from "@imgs/robo_para_site.png";
import towerImage from "@imgs/torre_para_site.png";

import { RookhubLogo } from "@/components/brand/rookhub-logo";
import { useSession } from "@/features/auth/store";
import { PortalGlobe } from "@/features/portal/components/portal-globe";

type DestinationId = "assistant" | "management";

interface Destination {
  id: DestinationId;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  image: string;
  imageAlt: string;
  imageClassName: string;
  buttonLabel: string;
  buttonVariant: "primary" | "secondary";
  icon: Icon;
  features: { icon: Icon; title: string; text: string }[];
}

const DESTINATIONS: Destination[] = [
  {
    id: "assistant",
    eyebrow: "Inteligência que move",
    title: "Conversar com a",
    highlight: "IA da RookHub",
    description:
      "Converse com a IA da RookHub para analisar sua operação, obter insights, gerar relatórios e tomar decisões inteligentes.",
    image: robotImage,
    imageAlt: "Robô executivo da RookHub",
    imageClassName: "bottom-0 h-[88%] sm:h-[92%]",
    buttonLabel: "Iniciar conversa",
    buttonVariant: "primary",
    icon: SparkleIcon,
    features: [
      {
        icon: ChatCircleDotsIcon,
        title: "Pergunte naturalmente",
        text: "Converse sobre a operação sem procurar cada indicador.",
      },
      {
        icon: ChartLineUpIcon,
        title: "Entenda seus dados",
        text: "Transforme informações da frota em respostas objetivas.",
      },
      {
        icon: TargetIcon,
        title: "Decida com clareza",
        text: "Receba análises para orientar os próximos passos.",
      },
    ],
  },
  {
    id: "management",
    eyebrow: "Controle da operação",
    title: "Acessar o sistema de",
    highlight: "gestão",
    description:
      "Acesse dashboards, dados operacionais, relatórios e todas as ferramentas para gerenciar sua frota em um único lugar.",
    image: towerImage,
    imageAlt: "Torre Rook da RookHub",
    imageClassName: "bottom-[-7%] h-[91%] sm:h-[96%]",
    buttonLabel: "Entrar no sistema",
    buttonVariant: "secondary",
    icon: SquaresFourIcon,
    features: [
      {
        icon: ChartLineUpIcon,
        title: "Acompanhe resultados",
        text: "Visualize indicadores estratégicos e operacionais.",
      },
      {
        icon: CheckCircleIcon,
        title: "Gerencie a rotina",
        text: "Controle frota, viagens, manutenção e equipe.",
      },
      {
        icon: ShieldCheckIcon,
        title: "Trabalhe com segurança",
        text: "Acesse os recursos permitidos para o seu perfil.",
      },
    ],
  },
];

/** Hub pós-login exclusivo do proprietário (RF-003). */
export function PortalPage() {
  const navigate = useNavigate();
  const session = useSession();
  const [activeId, setActiveId] = useState<DestinationId | null>(null);
  const assistantContracted = session?.tenant.modules.includes("ASSISTANT") ?? false;
  const activeDestination = DESTINATIONS.find((item) => item.id === activeId) ?? null;

  function navigateTo(destination: Destination) {
    if (destination.id === "assistant") {
      if (assistantContracted) navigate("/ia");
      return;
    }
    navigate("/app");
  }

  return (
    <main className="bg-background flex min-h-dvh flex-col overflow-x-clip px-4 py-6 sm:px-6 sm:py-8">
      <header className="mx-auto flex flex-col items-center text-center">
        <RookhubLogo variant="mark" className="h-14 sm:h-16" />
        <img src={logoName} alt="RookHub" className="mt-3 h-auto w-40 sm:w-48" />
        <p className="text-on-surface text-label-md mt-2 uppercase">
          Bem-vindo ao <span className="text-primary">RookHub</span>
        </p>
      </header>

      <div className="my-auto grid w-full min-w-0 gap-6 py-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)] lg:items-stretch lg:gap-10 lg:py-12">
        <section
          aria-label="Escolha um destino"
          className="mx-auto flex min-h-[520px] min-w-0 w-full max-w-3xl gap-3 px-4 sm:min-h-[600px] sm:gap-4 lg:mr-0 lg:px-0"
        >
          {DESTINATIONS.map((destination) => {
            const isActive = activeId === destination.id;
            const anotherIsActive = activeId !== null && !isActive;
            const assistantLocked = destination.id === "assistant" && !assistantContracted;

            return (
              <GlassCard
                key={destination.id}
                elevated
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                aria-label={`Selecionar: ${destination.title} ${destination.highlight}`}
                onMouseEnter={() => setActiveId(destination.id)}
                onFocus={() => setActiveId(destination.id)}
                onClick={() => setActiveId(destination.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveId(destination.id);
                  }
                  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                    event.preventDefault();
                    setActiveId(destination.id === "assistant" ? "management" : "assistant");
                  }
                }}
                className={cn(
                  "border-outline-variant bg-surface-low group relative min-w-0 cursor-pointer overflow-hidden border p-0 outline-none",
                  "transition-[flex-grow,filter,border-color,box-shadow] duration-500 ease-out",
                  "focus-visible:ring-secondary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive ? "flex-[3.1_1_0%]" : "flex-[1_1_0%]",
                  anotherIsActive && "grayscale-[0.65]",
                  isActive &&
                    (destination.id === "assistant"
                      ? "border-primary/60 shadow-[0_22px_70px_-34px_rgba(99,102,241,0.9)]"
                      : "border-secondary/60 shadow-[0_22px_70px_-34px_rgba(6,182,212,0.8)]"),
                )}
              >
                <img
                  src={destination.image}
                  alt={destination.imageAlt}
                  draggable={false}
                  className={cn(
                    "pointer-events-none absolute w-auto max-w-none select-none object-contain",
                    "transition-[transform,filter,opacity] duration-500 ease-out",
                    destination.imageClassName,
                    destination.id === "assistant"
                      ? "right-0"
                      : "left-1/2 -translate-x-1/2",
                    isActive ? "scale-100 opacity-100" : "scale-105 opacity-90",
                  )}
                />

                <div
                  aria-hidden="true"
                  className={cn(
                    "from-surface-low/0 via-surface-low/25 to-surface-low pointer-events-none absolute inset-x-0 bottom-0 z-10 h-44 bg-gradient-to-b transition-opacity duration-300",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                />

                <div
                  className={cn(
                    "absolute inset-x-4 bottom-4 z-10 transition-[opacity,transform] duration-300 sm:inset-x-5 sm:bottom-5",
                    isActive ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-5 opacity-0",
                  )}
                >
                  <SpectrumButton
                    variant={destination.buttonVariant}
                    size="lg"
                    block
                    disabled={assistantLocked}
                    onClick={(event) => {
                      event.stopPropagation();
                      navigateTo(destination);
                    }}
                  >
                    {assistantLocked ? (
                      <>
                        <LockSimpleIcon size={18} weight="fill" aria-hidden="true" />
                        <span className="hidden sm:inline">Não incluído no plano</span>
                        <span className="sm:hidden">Bloqueado</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">{destination.buttonLabel}</span>
                        <ArrowRightIcon size={18} weight="bold" aria-hidden="true" />
                      </>
                    )}
                  </SpectrumButton>
                </div>
              </GlassCard>
            );
          })}
        </section>

        <aside
          aria-live="polite"
          className="relative flex min-h-[390px] min-w-0 items-center overflow-visible lg:min-h-0"
        >
          <PortalGlobe tone={activeDestination?.id === "management" ? "secondary" : "primary"} />
          {activeDestination ? (
            <div key={activeDestination.id} className="relative z-10 w-full">
              <p
                className={cn(
                  "text-label-md uppercase",
                  activeDestination.id === "assistant" ? "text-primary" : "text-secondary",
                )}
              >
                {activeDestination.eyebrow}
              </p>
              <h1 className="font-display text-on-surface mt-4 text-[36px] font-bold leading-[1.08] sm:text-[48px] lg:text-[54px]">
                {activeDestination.title}{" "}
                <span
                  className={
                    activeDestination.id === "assistant" ? "text-primary" : "text-secondary"
                  }
                >
                  {activeDestination.highlight}
                </span>
              </h1>
              <p className="text-on-surface-variant text-body-lg mt-6 max-w-xl">
                {activeDestination.description}
              </p>

              <ul className="mt-9 grid gap-5">
                {activeDestination.features.map((feature) => (
                  <li key={feature.title} className="flex items-start gap-4">
                    <span
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-md",
                        activeDestination.id === "assistant"
                          ? "bg-primary/15 text-primary"
                          : "bg-secondary/15 text-secondary",
                      )}
                    >
                      <feature.icon size={20} weight="duotone" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="text-on-surface block font-semibold">{feature.title}</span>
                      <span className="text-on-surface-variant text-body-md mt-0.5 block">
                        {feature.text}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="border-outline-variant relative z-10 flex w-full flex-col items-center justify-center rounded-lg border border-dashed px-8 py-16 text-center lg:min-h-[460px]">
              <span className="bg-primary/15 text-primary flex size-12 items-center justify-center rounded-md">
                <SparkleIcon size={24} weight="duotone" aria-hidden="true" />
              </span>
              <h1 className="font-display text-on-surface mt-5 text-2xl font-semibold">
                Escolha como começar
              </h1>
              <p className="text-on-surface-variant text-body-md mt-2 max-w-sm">
                Passe o mouse, use o teclado ou toque em uma das imagens para conhecer cada
                ambiente.
              </p>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
