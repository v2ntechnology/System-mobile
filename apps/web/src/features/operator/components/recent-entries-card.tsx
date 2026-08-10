import { LockSimpleIcon } from "@phosphor-icons/react";
import type { EntryKind, LaunchEntry } from "@rookhub/types";
import { DataTable, LightCard, StatusChip, type Column } from "@rookhub/ui";

import { brl, dateOnly, dateTime } from "@/lib/format";

import { ENTRY_META } from "../entry-spec";

const KIND_TONE: Record<EntryKind, "neutral" | "attention" | "info" | "critical"> = {
  ABASTECIMENTO: "info",
  MULTA: "critical",
  ORDEM_MANUTENCAO: "attention",
  DESPESA: "neutral",
};

export interface RecentEntriesCardProps {
  entries: LaunchEntry[];
  /** RF-007 — sem visibilidade financeira, o valor aparece bloqueado. */
  canSeeAmounts: boolean;
  className?: string;
}

/**
 * Últimos lançamentos do operador.
 *
 * A coluna de documento é o que torna o lançamento auditável — e o que permite
 * perceber a nota digitada duas vezes antes de ela inflar o custo do veículo.
 */
export function RecentEntriesCard({ entries, canSeeAmounts, className }: RecentEntriesCardProps) {
  const columns: Column<LaunchEntry>[] = [
    {
      key: "createdAt",
      header: "Lançado",
      sortValue: (row) => row.createdAt,
      cell: (row) => dateTime.format(new Date(row.createdAt)),
    },
    {
      key: "kind",
      header: "Tipo",
      sortValue: (row) => row.kind,
      cell: (row) => (
        <StatusChip tone={KIND_TONE[row.kind]} surface="light">
          {ENTRY_META[row.kind].label}
        </StatusChip>
      ),
    },
    {
      key: "plate",
      header: "Placa",
      sortValue: (row) => row.plate,
      cell: (row) => <span className="tabular font-semibold">{row.plate}</span>,
    },
    { key: "description", header: "Documento", sortValue: (row) => row.description },
    {
      key: "documentNumber",
      header: "Nº",
      hideOnMobile: true,
      sortValue: (row) => row.documentNumber ?? "",
      cell: (row) => <span className="tabular">{row.documentNumber ?? "—"}</span>,
    },
    {
      key: "at",
      header: "Data do doc.",
      hideOnMobile: true,
      sortValue: (row) => row.at,
      cell: (row) => dateOnly.format(new Date(row.at)),
    },
    {
      key: "amount",
      header: "Valor",
      align: "right",
      sortValue: (row) => row.amount,
      cell: (row) =>
        canSeeAmounts ? (
          <span className="font-semibold">{brl.format(row.amount)}</span>
        ) : (
          /*
           * RF-007 — bloqueado, não escondido. Sumir com a coluna faz o operador
           * achar que o lançamento não gravou o valor, e vira chamado.
           */
          <LockSimpleIcon
            size={16}
            weight="fill"
            className="text-on-light-muted inline"
            aria-label="Valor restrito ao seu perfil"
          />
        ),
    },
  ];

  return (
    <LightCard
      title="Últimos lançamentos"
      className={className}
      action={
        canSeeAmounts ? null : (
          <StatusChip
            tone="neutral"
            surface="light"
            icon={<LockSimpleIcon size={14} weight="fill" aria-hidden="true" />}
          >
            Valores restritos
          </StatusChip>
        )
      }
    >
      <DataTable
        columns={columns}
        rows={entries}
        rowKey={(row) => row.id}
        caption="Lançamentos recentes, com tipo, documento e valor"
        emptyMessage="Nenhum lançamento ainda."
      />
    </LightCard>
  );
}
