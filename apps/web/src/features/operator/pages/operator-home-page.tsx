import { ArrowRightIcon, InfoIcon, LockSimpleIcon } from "@phosphor-icons/react";
import type { AnalyticsPeriod } from "@rookhub/types";
import { GlassCard, SpectrumButton, cn } from "@rookhub/ui";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";

import heroImage from "@imgs/truck01.jpg";

import { PageBanner } from "@/components/layout/page-banner";
import { PageContent } from "@/components/layout/page-content";
import { QueryState } from "@/components/layout/query-state";
import { useSession } from "@/features/auth/store";
import { useFinancialVisibility } from "@/features/drivers/use-financial-visibility";
import { brl } from "@/lib/format";

import { getOperatorOverview, getYard } from "../api";
import { RecentEntriesCard } from "../components/recent-entries-card";
import { YardBoardCard } from "../components/yard-board-card";

function Tile({
  label,
  value,
  hint,
  tone = "neutral",
  locked = false,
}: {
  label: string;
  value: string;
  hint: string;
  tone?: "neutral" | "warning";
  locked?: boolean;
}) {
  return (
    <div className="bg-surface-lowest min-w-0 rounded-lg p-4">
      <p className="text-on-surface-variant text-label-md flex items-center gap-1.5 normal-case">
        {label}
        {locked ? (
          <LockSimpleIcon size={13} weight="fill" aria-label="Restrito ao seu perfil" />
        ) : null}
      </p>
      <p
        className={cn(
          "tabular font-display mt-2 text-[24px] font-bold leading-none",
          locked
            ? "text-on-surface-muted"
            : tone === "warning"
              ? "text-warning"
              : "text-on-surface",
        )}
      >
        {value}
      </p>
      <p className="text-on-surface-muted text-label-sm mt-1.5 normal-case">{hint}</p>
    </div>
  );
}

/**
 * Painel do operador — rotina de pátio.
 *
 * A pergunta da manhã dele não é estratégica nem analítica: é "o que chegou para
 * eu tratar e qual caminhão pode sair". Por isso a fila de triagem vem antes de
 * tudo e o quadro do pátio ocupa a maior parte da tela.
 */
export function OperatorHomePage() {
  const session = useSession();
  const canSeeFinancials = useFinancialVisibility();
  const [period] = useState<AnalyticsPeriod>("30D");

  const overview = useQuery({
    queryKey: ["operator", "overview", period, canSeeFinancials],
    queryFn: () => getOperatorOverview(period, canSeeFinancials),
  });

  const yard = useQuery({ queryKey: ["operator", "yard"], queryFn: getYard });

  const data = overview.data;

  return (
    <>
      <PageBanner
        size="hero"
        image={heroImage}
        eyebrow={data ? `Rotina de pátio · ${data.periodLabel}` : null}
        title={session?.tenant.name ?? "Painel do operador"}
      />

      <PageContent>
        <h2 className="sr-only">Situação do pátio</h2>

        <QueryState
          isPending={overview.isPending}
          isError={overview.isError}
          label="o painel do operador"
        >
          {data ? (
            <>
              <div className="grid gap-5 xl:grid-cols-[1fr_1.55fr]">
                <GlassCard className="flex min-w-0 flex-col p-5 sm:p-6">
                  <h3 className="text-on-surface-variant text-body-md">Checklists para triar</h3>

                  <p className="tabular font-display text-on-surface mt-2 text-[44px] font-bold leading-none">
                    {data.triagePending}
                  </p>

                  <p className="text-label-md mt-3 normal-case">
                    {data.triageBlocking > 0 ? (
                      <span className="text-warning">
                        {data.triageBlocking === 1
                          ? "1 impede a saída do veículo"
                          : `${data.triageBlocking} impedem a saída do veículo`}
                      </span>
                    ) : (
                      <span className="text-on-surface-variant">Nenhum bloqueio na fila</span>
                    )}
                  </p>

                  {/* RN-121 — o número vem com a procedência colada nele. */}
                  <p className="text-on-surface-muted text-label-md mt-auto flex items-start gap-1.5 pt-5 normal-case">
                    <InfoIcon size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                    {data.source}
                  </p>
                </GlassCard>

                <GlassCard className="grid min-w-0 gap-4 p-5 sm:grid-cols-3 sm:p-6">
                  <Tile
                    label="Veículos no pátio"
                    value={String(data.vehiclesInYard)}
                    hint="ocupando vaga agora"
                  />
                  <Tile
                    label="Com impedimento"
                    value={String(data.vehiclesBlocked)}
                    hint="não podem sair"
                    tone={data.vehiclesBlocked > 0 ? "warning" : "neutral"}
                  />
                  <Tile
                    label="Lançamentos hoje"
                    value={String(data.entriesToday)}
                    hint="notas, multas e ordens"
                  />

                  {/*
                   * RF-007 — o total do dia é dado financeiro consolidado. Quem
                   * não pode ver enxerga o campo bloqueado, não some com ele:
                   * sumir vira chamado de suporte. Digitar a nota continua sendo
                   * trabalho dele; ler o acumulado, não.
                   */}
                  <Tile
                    label="Valor lançado hoje"
                    value={
                      data.amountToday !== undefined ? brl.format(data.amountToday) : "Restrito"
                    }
                    hint={
                      data.amountToday !== undefined
                        ? "soma dos documentos do dia"
                        : "seu perfil não vê valores consolidados"
                    }
                    locked={data.amountToday === undefined}
                  />

                  <div className="bg-primary/10 border-primary/30 flex flex-wrap items-center gap-3 rounded-lg border px-4 py-3 sm:col-span-2">
                    <p className="text-on-surface text-body-md min-w-0 flex-1">
                      {data.triagePending === 0
                        ? "Fila de triagem vazia."
                        : data.triagePending === 1
                          ? "1 checklist esperando sua tratativa."
                          : `${data.triagePending} checklists esperando sua tratativa.`}
                    </p>
                    <SpectrumButton asChild size="sm">
                      <Link to="/app/triagem">
                        Abrir triagem
                        <ArrowRightIcon size={16} weight="bold" aria-hidden="true" />
                      </Link>
                    </SpectrumButton>
                  </div>
                </GlassCard>
              </div>

              <div className="mt-8">
                <QueryState isPending={yard.isPending} isError={yard.isError} label="o pátio">
                  {yard.data ? <YardBoardCard vehicles={yard.data} /> : null}
                </QueryState>
              </div>

              <div className="mt-5">
                <RecentEntriesCard entries={data.recentEntries} canSeeAmounts={canSeeFinancials} />
              </div>
            </>
          ) : null}
        </QueryState>
      </PageContent>
    </>
  );
}
