import { NotePencilIcon } from "@phosphor-icons/react";
import type { EntryKind } from "@rookhub/types";
import { GlassCard } from "@rookhub/ui";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { PageBanner } from "@/components/layout/page-banner";
import { PageContent } from "@/components/layout/page-content";
import { PageTabs } from "@/components/layout/page-tabs";
import { QueryState } from "@/components/layout/query-state";
import { useFinancialVisibility } from "@/features/drivers/use-financial-visibility";

import { getEntries } from "../api";
import { EntryForm } from "../components/entry-form";
import { RecentEntriesCard } from "../components/recent-entries-card";
import { ENTRY_META } from "../entry-spec";

const TABS = [
  { id: "ABASTECIMENTO", label: ENTRY_META.ABASTECIMENTO.label },
  { id: "MULTA", label: ENTRY_META.MULTA.label },
  { id: "ORDEM_MANUTENCAO", label: ENTRY_META.ORDEM_MANUTENCAO.label },
  { id: "DESPESA", label: ENTRY_META.DESPESA.label },
] as const;

/**
 * Módulos de entrada de dados do operador.
 *
 * Os quatro documentos que alimentam a plataforma. Cada aba é o mesmo formulário
 * desenhado a partir de uma especificação diferente (ver `entry-spec.ts`) — o
 * que garante que placa, data e documento se comportem igual nos quatro.
 */
export function EntriesPage() {
  const [tab, setTab] = useState<EntryKind>("ABASTECIMENTO");
  const canSeeFinancials = useFinancialVisibility();

  const { data, isPending, isError } = useQuery({
    queryKey: ["operator", "entries"],
    queryFn: getEntries,
  });

  const todayCount =
    data?.filter((entry) => new Date(entry.createdAt).toDateString() === new Date().toDateString())
      .length ?? 0;

  return (
    <>
      <PageBanner
        size="inline"
        title="Lançamentos"
        description="Abastecimentos, multas, ordens de manutenção e despesas extraordinárias — o que alimenta o custo de cada veículo."
      />

      <section className="mx-auto w-full max-w-[1600px] px-4 pb-8 sm:px-6">
        <h2 className="sr-only">Situação dos lançamentos</h2>

        <GlassCard className="flex flex-wrap items-center gap-4 p-5 sm:p-6">
          <NotePencilIcon
            size={28}
            weight="duotone"
            className="text-primary shrink-0"
            aria-hidden="true"
          />

          <div className="min-w-0 flex-1">
            <p className="text-on-surface text-body-lg">
              {todayCount === 0
                ? "Nenhum lançamento hoje."
                : todayCount === 1
                  ? "1 lançamento hoje."
                  : `${todayCount} lançamentos hoje.`}
            </p>
            <p className="text-on-surface-variant text-body-md mt-1">
              O número do documento é o que torna o lançamento auditável — e o que impede a mesma
              nota de entrar duas vezes.
            </p>
          </div>
        </GlassCard>
      </section>

      <PageContent className="rounded-t-4xl bg-light mt-0 sm:mt-0 sm:rounded-t-[40px]">
        <PageTabs tabs={TABS} value={tab} onValueChange={setTab} label="Tipos de lançamento">
          <div className="flex flex-col gap-5 pb-4">
            <EntryForm kind={tab} />

            <QueryState isPending={isPending} isError={isError} label="os lançamentos">
              {data ? <RecentEntriesCard entries={data} canSeeAmounts={canSeeFinancials} /> : null}
            </QueryState>
          </div>
        </PageTabs>
      </PageContent>
    </>
  );
}
