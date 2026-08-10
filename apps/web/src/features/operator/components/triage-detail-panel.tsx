import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowUpRightIcon,
  CameraIcon,
  CheckIcon,
  LockKeyIcon,
  WarningIcon,
  WrenchIcon,
} from "@phosphor-icons/react";
import type { TriageFill, TriageStatus } from "@rookhub/types";
import { LightCard, SpectrumButton, Spinner, StatusChip, cn, type StatusTone } from "@rookhub/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { dateTime } from "@/lib/format";
import { ApiError } from "@/mocks/latency";

import { decideTriage } from "../api";
import { triageSchema, type TriageValues } from "../schema";

const SEVERITY_LABEL = { LEVE: "Leve", MEDIA: "Média", GRAVE: "Grave" } as const;
const SEVERITY_TONE = { LEVE: "neutral", MEDIA: "attention", GRAVE: "critical" } as const;

const STATUS_META: Record<TriageStatus, { label: string; tone: StatusTone }> = {
  PENDENTE: { label: "Aguardando triagem", tone: "attention" },
  APROVADO: { label: "Resolvido no pátio", tone: "positive" },
  ENVIADO_MANUTENCAO: { label: "Enviado à manutenção", tone: "info" },
  ESCALADO: { label: "Com o gestor", tone: "info" },
};

export interface TriageDetailPanelProps {
  fill: TriageFill;
}

/**
 * Checklist recebido do motorista, com a tratativa inicial do operador.
 *
 * A regra que manda na tela: reprovação que **impede a saída** (RF-016) não se
 * resolve no pátio. O operador verifica, descreve e escala — quem autoriza a
 * saída é o gestor. Por isso o botão "Resolvido no pátio" simplesmente não
 * existe num checklist bloqueante.
 */
export function TriageDetailPanel({ fill }: TriageDetailPanelProps) {
  const queryClient = useQueryClient();
  const status = STATUS_META[fill.status];
  const pending = fill.status === "PENDENTE";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TriageValues>({ resolver: zodResolver(triageSchema), defaultValues: { note: "" } });

  /* Trocar de checklist não deve carregar o texto escrito para o anterior. */
  useEffect(() => {
    reset({ note: "" });
  }, [fill.id, reset]);

  const mutation = useMutation({
    mutationFn: decideTriage,
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["operator", "triage"] });
      queryClient.invalidateQueries({ queryKey: ["operator", "overview"] });
      queryClient.invalidateQueries({ queryKey: ["operator", "yard"] });
      /* Escalar abre pedido na fila do gestor — ela muda agora. */
      queryClient.invalidateQueries({ queryKey: ["manager", "releases"] });
      queryClient.invalidateQueries({ queryKey: ["manager", "overview"] });
      reset({ note: "" });

      if (updated.status === "ESCALADO") {
        toast.info("Enviado ao gestor", {
          description: `${updated.plate} entrou na fila de liberações.`,
        });
      } else if (updated.status === "ENVIADO_MANUTENCAO") {
        toast.success("Ordem encaminhada", {
          description: `${updated.plate} foi para a manutenção.`,
        });
      } else {
        toast.success("Resolvido no pátio", { description: `${updated.plate} está liberado.` });
      }
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.title : "Não foi possível registrar", {
        description:
          error instanceof ApiError
            ? error.detail
            : "Tente de novo em instantes. A tratativa não foi gravada.",
      });
    },
  });

  const busy = isSubmitting || mutation.isPending;

  const decide = (action: "APROVAR" | "MANUTENCAO" | "ESCALAR") =>
    handleSubmit((values) =>
      mutation.mutateAsync({ fillId: fill.id, action, note: values.note }).catch(() => {
        /* Já comunicado no toast; o formulário permanece preenchido. */
      }),
    );

  return (
    <LightCard
      title={fill.plate}
      action={
        <StatusChip tone={status.tone} surface="light">
          {status.label}
        </StatusChip>
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <StatusChip tone="info" surface="light">
          {fill.templateName}
        </StatusChip>
        <StatusChip tone="neutral" surface="light">
          {fill.driverName}
        </StatusChip>
        {fill.blocking ? (
          <StatusChip tone="critical" surface="light">
            Impede a saída
          </StatusChip>
        ) : null}
      </div>

      {fill.blocking ? (
        <p className="bg-error-on-light/10 text-error-on-light text-body-md mt-4 flex items-start gap-2 rounded-lg p-3">
          <LockKeyIcon size={16} weight="fill" className="mt-0.5 shrink-0" aria-hidden="true" />
          Reprovação bloqueante: o veículo só sai com autorização do gestor. Faça a verificação e
          escale.
        </p>
      ) : null}

      <p className="text-on-light-muted text-label-md mt-3 normal-case">
        Preenchido em {dateTime.format(new Date(fill.filledAt))} · recebido em{" "}
        {dateTime.format(new Date(fill.receivedAt))}
      </p>

      {/* RN-054 — divergência de relógio acima de 6h vira flag de auditoria. */}
      {fill.clockSkewHours >= 6 ? (
        <p className="bg-warning-on-light/10 text-warning-on-light text-body-md mt-3 flex items-start gap-2 rounded-lg p-3">
          <WarningIcon size={16} weight="fill" className="mt-0.5 shrink-0" aria-hidden="true" />
          {fill.clockSkewHours}h entre o relógio do aparelho e o do servidor. O preenchimento pode
          não ter sido feito no momento informado — confira antes de aprovar.
        </p>
      ) : null}

      <h3 className="text-on-light-variant text-body-md mt-5 font-semibold">Itens reprovados</h3>
      <ul className="mt-2 flex flex-col gap-2">
        {fill.failures.map((failure) => (
          <li key={failure.id} className="bg-light-container rounded-md p-3">
            <p className="flex flex-wrap items-center gap-2">
              <span className="text-on-light min-w-0 flex-1 font-medium">{failure.label}</span>
              <StatusChip tone={SEVERITY_TONE[failure.severity]} surface="light">
                {SEVERITY_LABEL[failure.severity]}
              </StatusChip>
              {/* RN-040 — foto anexada pelo motorista. */}
              {failure.hasPhoto ? (
                <CameraIcon
                  size={16}
                  weight="fill"
                  className="text-on-light-muted shrink-0"
                  aria-label="Com foto"
                />
              ) : null}
            </p>
            {failure.note ? (
              <p className="text-on-light-variant text-body-md mt-1">{failure.note}</p>
            ) : null}
          </li>
        ))}
      </ul>

      {fill.decision ? (
        <div className="border-light-outline mt-6 rounded-lg border p-4">
          <h3 className="text-on-light-variant text-body-md font-semibold">Tratativa registrada</h3>
          <p className="text-on-light text-body-md mt-2">{fill.decision.note}</p>
          <p className="text-on-light-muted text-label-md mt-2 normal-case">
            {fill.decision.by} · {dateTime.format(new Date(fill.decision.at))}
          </p>

          {fill.releaseRequestId ? (
            <p className="text-primary-on-light text-label-md mt-2 flex items-center gap-1.5 normal-case">
              <ArrowUpRightIcon size={14} weight="bold" aria-hidden="true" />
              Na fila do gestor como {fill.releaseRequestId}
            </p>
          ) : null}
        </div>
      ) : (
        <form className="border-light-outline mt-6 rounded-lg border p-4" noValidate>
          <label htmlFor="triage-note" className="text-on-light-variant text-body-md font-semibold">
            O que foi verificado no pátio
          </label>
          <p className="text-on-light-muted text-label-md mt-1 normal-case">
            É o que o gestor lê antes de decidir a liberação.
          </p>

          <textarea
            id="triage-note"
            rows={3}
            disabled={busy}
            aria-invalid={errors.note ? true : undefined}
            aria-describedby={errors.note ? "triage-note-error" : undefined}
            placeholder="Ex.: cinto conferido, trava não retém mesmo após ajuste. Peça solicitada à oficina."
            className={cn(
              "text-body-md text-on-light placeholder:text-on-light-muted bg-light-container mt-3 w-full rounded-md border p-3",
              "focus-visible:ring-primary-on-light focus:outline-none focus-visible:ring-2",
              "disabled:opacity-60",
              errors.note ? "border-error-on-light" : "border-light-outline",
            )}
            {...register("note")}
          />

          {errors.note ? (
            <p
              id="triage-note-error"
              role="alert"
              className="text-error-on-light text-label-md mt-2 normal-case"
            >
              {errors.note.message}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-3">
            {fill.blocking ? (
              <SpectrumButton
                type="button"
                variant="primary"
                disabled={busy || !pending}
                onClick={decide("ESCALAR")}
              >
                {busy ? (
                  <Spinner label="Enviando" />
                ) : (
                  <ArrowUpRightIcon size={18} weight="bold" aria-hidden="true" />
                )}
                Escalar ao gestor
              </SpectrumButton>
            ) : (
              <SpectrumButton
                type="button"
                variant="primary"
                disabled={busy || !pending}
                onClick={decide("APROVAR")}
              >
                {busy ? (
                  <Spinner label="Registrando" />
                ) : (
                  <CheckIcon size={18} weight="bold" aria-hidden="true" />
                )}
                Resolvido no pátio
              </SpectrumButton>
            )}

            <SpectrumButton
              type="button"
              variant="ghost"
              disabled={busy || !pending}
              onClick={decide("MANUTENCAO")}
              /* Ghost é desenhado para o grafite: sobre o painel claro precisa
                 da borda e do texto escuros para não sumir. */
              className="border-light-outline text-on-light bg-light-container hover:bg-light hover:border-on-light-muted"
            >
              <WrenchIcon size={18} weight="bold" aria-hidden="true" />
              Enviar à manutenção
            </SpectrumButton>
          </div>
        </form>
      )}
    </LightCard>
  );
}
