import { ClipboardTextIcon } from "@phosphor-icons/react";
import type { TriageFill } from "@rookhub/types";
import { GlassCard, cn } from "@rookhub/ui";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

import { PageBanner } from "@/components/layout/page-banner";
import { PageContent } from "@/components/layout/page-content";
import { PageTabs } from "@/components/layout/page-tabs";
import { QueryState } from "@/components/layout/query-state";
import { useMasterDetail } from "@/hooks/use-master-detail";
import { dateTime } from "@/lib/format";

import { getTriage } from "../api";
import { TriageDetailPanel } from "../components/triage-detail-panel";

const TABS = [
  { id: "PENDENTES", label: "Na fila" },
  { id: "TRATADOS", label: "Tratados" },
] as const;

type TabId = (typeof TABS)[number]["id"];

/**
 * Painel de triagem — fila de checklists recebidos dos motoristas.
 *
 * É a primeira parada do que o motorista reportou pelo app. O operador verifica
 * no pátio, descreve o que encontrou e encaminha: resolve, manda para a oficina
 * ou escala. Reprovação que impede a saída **sempre** escala — a autorização é
 * do gestor.
 *
 * Bloqueantes primeiro: um checklist leve na frente de um veículo travado é a
 * ordem errada de trabalho.
 */
export function TriagePage() {
  const [tab, setTab] = useState<TabId>("PENDENTES");

  const { data, isPending, isError } = useQuery({
    queryKey: ["operator", "triage"],
    queryFn: getTriage,
  });

  const all = useMemo(() => data ?? [], [data]);

  const visible = useMemo(
    () =>
      all
        .filter((item) =>
          tab === "PENDENTES" ? item.status === "PENDENTE" : item.status !== "PENDENTE",
        )
        .sort((a, b) => {
          if (a.blocking !== b.blocking) return a.blocking ? -1 : 1;
          return new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime();
        }),
    [all, tab],
  );

  const fillId = useCallback((item: TriageFill) => item.id, []);
  const { selectedId, setSelectedId, selected } = useMasterDetail(visible, fillId);

  const counts = useMemo(
    () => ({
      PENDENTES: all.filter((item) => item.status === "PENDENTE").length,
      TRATADOS: all.filter((item) => item.status !== "PENDENTE").length,
    }),
    [all],
  );

  const blocking = all.filter((item) => item.status === "PENDENTE" && item.blocking).length;

  return (
    <>
      <PageBanner
        size="inline"
        title="Triagem"
        description="Checklists recebidos dos motoristas pelo app — verificação de pátio e encaminhamento das divergências."
      />

      <section className="mx-auto w-full max-w-[1600px] px-4 pb-8 sm:px-6">
        <h2 className="sr-only">Situação da fila</h2>

        <GlassCard className="flex flex-wrap items-center gap-4 p-5 sm:p-6">
          <ClipboardTextIcon
            size={28}
            weight="duotone"
            className="text-primary shrink-0"
            aria-hidden="true"
          />

          <div className="min-w-0 flex-1">
            <p className="text-on-surface text-body-lg">
              {counts.PENDENTES === 0
                ? "Fila vazia."
                : counts.PENDENTES === 1
                  ? "1 checklist aguardando triagem."
                  : `${counts.PENDENTES} checklists aguardando triagem.`}
            </p>
            <p className="text-on-surface-variant text-body-md mt-1">
              {blocking > 0
                ? `${blocking === 1 ? "1 impede" : `${blocking} impedem`} a saída do veículo e ${blocking === 1 ? "precisa" : "precisam"} ser escalado${blocking === 1 ? "" : "s"} ao gestor.`
                : "Nada bloqueando saída no momento."}
            </p>
          </div>
        </GlassCard>
      </section>

      <PageContent className="rounded-t-4xl bg-light mt-0 sm:mt-0 sm:rounded-t-[40px]">
        <PageTabs
          tabs={TABS.map((entry) => ({ ...entry, count: counts[entry.id] }))}
          value={tab}
          onValueChange={setTab}
          label="Situação da triagem"
        >
          <QueryState isPending={isPending} isError={isError} label="a triagem">
            <div className="grid gap-6 pb-4 xl:grid-cols-[minmax(0,360px)_1fr]">
              <div className="min-w-0">
                {visible.length === 0 ? (
                  <p className="text-on-light-variant text-body-md py-10 text-center">
                    {tab === "PENDENTES"
                      ? "Nada aguardando triagem."
                      : "Nenhum checklist tratado ainda."}
                  </p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {visible.map((item) => {
                      const active = item.id === selectedId;

                      return (
                        <li key={item.id} className="min-w-0">
                          <button
                            type="button"
                            onClick={() => setSelectedId(item.id)}
                            aria-current={active ? "true" : undefined}
                            className={cn(
                              "focus-visible:ring-primary-on-light w-full rounded-lg p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2",
                              active ? "bg-primary-strong" : "hover:bg-light-container",
                            )}
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "tabular min-w-0 flex-1 font-semibold",
                                  active ? "text-on-primary" : "text-on-light",
                                )}
                              >
                                {item.plate}
                              </span>
                              {item.blocking ? (
                                <span
                                  className={cn(
                                    "rounded-pill text-label-md shrink-0 px-2 py-0.5 normal-case",
                                    active
                                      ? "text-on-primary bg-white/20"
                                      : "bg-error-on-light/12 text-error-on-light",
                                  )}
                                >
                                  Bloqueia
                                </span>
                              ) : null}
                            </span>

                            <span
                              className={cn(
                                "text-label-md mt-1 block normal-case",
                                active ? "text-on-primary" : "text-on-light-muted",
                              )}
                            >
                              {item.driverName} ·{" "}
                              {item.failures.length === 1
                                ? "1 reprovação"
                                : `${item.failures.length} reprovações`}
                            </span>

                            <span
                              className={cn(
                                "text-label-md mt-1 block normal-case",
                                active ? "text-on-primary" : "text-on-light-variant",
                              )}
                            >
                              {item.templateName} · {dateTime.format(new Date(item.receivedAt))}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="min-w-0">
                {selected ? (
                  <TriageDetailPanel fill={selected} />
                ) : (
                  <div className="bg-surface-lowest flex min-h-80 items-center justify-center rounded-xl p-6">
                    <p className="text-on-surface-muted text-body-md text-center">
                      Selecione um checklist para ver as reprovações e encaminhar.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </QueryState>
        </PageTabs>
      </PageContent>
    </>
  );
}
