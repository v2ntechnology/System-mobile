import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, InfoIcon } from "@phosphor-icons/react";
import type { EntryKind } from "@rookhub/types";
import { GlassInput, GlassSelect, LightCard, SpectrumButton, Spinner, cn } from "@rookhub/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { brl } from "@/lib/format";
import { ApiError } from "@/mocks/latency";

import { createEntry } from "../api";
import {
  ENTRY_FIELDS,
  ENTRY_META,
  entrySchemaFor,
  parseDecimal,
  toEntryDraft,
  type EntryFormValues,
} from "../entry-spec";

/** Data de hoje em `yyyy-mm-dd`, que é o que o `<input type="date">` espera. */
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function emptyValues(): EntryFormValues {
  return {
    plate: "",
    at: todayISO(),
    driverName: "",
    documentNumber: "",
    station: "",
    liters: "",
    pricePerLiter: "",
    odometer: "",
    infraction: "",
    amount: "",
    dueDate: "",
    serviceType: "PREVENTIVA",
    service: "",
    workshop: "",
    estimatedCost: "",
    category: "PEDAGIO",
    description: "",
  };
}

export interface EntryFormProps {
  kind: EntryKind;
}

/**
 * Formulário de lançamento, desenhado a partir da especificação do tipo.
 *
 * Mantém o foco no campo depois de gravar e limpa só o que é do documento — a
 * rotina do operador é lançar uma nota atrás da outra, e recomeçar do zero a
 * cada uma dobra o número de teclas.
 */
export function EntryForm({ kind }: EntryFormProps) {
  const queryClient = useQueryClient();
  const meta = ENTRY_META[kind];
  const fields = ENTRY_FIELDS[kind];

  const resolver = useMemo(() => zodResolver(entrySchemaFor(kind)), [kind]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<EntryFormValues>({ resolver, defaultValues: emptyValues() });

  /* Trocar de tipo é trocar de documento: nada do anterior aproveita. */
  useEffect(() => {
    reset(emptyValues());
  }, [kind, reset]);

  const liters = watch("liters");
  const pricePerLiter = watch("pricePerLiter");

  /* Prévia do total — a conta que o operador não deveria refazer na mão. */
  const fuelTotal =
    kind === "ABASTECIMENTO" && liters && pricePerLiter
      ? parseDecimal(liters) * parseDecimal(pricePerLiter)
      : null;

  const mutation = useMutation({
    mutationFn: createEntry,
    onSuccess: (entry) => {
      queryClient.invalidateQueries({ queryKey: ["operator", "entries"] });
      queryClient.invalidateQueries({ queryKey: ["operator", "overview"] });
      toast.success("Lançamento registrado", {
        description: `${meta.label} de ${entry.plate} — ${brl.format(entry.amount)}.`,
      });
      reset(emptyValues());
      setFocus("plate");
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.title : "Não foi possível lançar", {
        description:
          error instanceof ApiError
            ? error.detail
            : "Tente de novo em instantes. Nada foi gravado.",
      });
    },
  });

  const busy = isSubmitting || mutation.isPending;

  const onSubmit = handleSubmit((values) =>
    mutation.mutateAsync({ kind, ...toEntryDraft(kind, values) }).catch(() => {
      /* Já comunicado no toast; o formulário permanece preenchido. */
    }),
  );

  return (
    <LightCard
      title={meta.title}
      action={
        fuelTotal !== null && Number.isFinite(fuelTotal) && fuelTotal > 0 ? (
          <div className="text-right">
            <p className="text-on-light-muted text-label-md normal-case">Total do abastecimento</p>
            <p className="tabular text-on-light text-headline-md font-semibold">
              {brl.format(fuelTotal)}
            </p>
          </div>
        ) : null
      }
    >
      <form onSubmit={onSubmit} noValidate className="flex min-w-0 flex-1 flex-col">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {fields.map((field) => {
            const error = errors[field.name as keyof EntryFormValues]?.message;

            if (field.type === "select") {
              return (
                <GlassSelect
                  key={field.name}
                  surface="light"
                  label={field.label}
                  hint={field.hint}
                  error={error}
                  options={field.options ?? []}
                  className={field.wide ? "sm:col-span-2" : undefined}
                  {...register(field.name as keyof EntryFormValues)}
                />
              );
            }

            return (
              <div key={field.name} className={cn("min-w-0", field.wide && "sm:col-span-2")}>
                <GlassInput
                  surface="light"
                  label={field.label}
                  placeholder={field.placeholder}
                  hint={field.hint}
                  error={error}
                  /*
                   * `inputMode` e não `type="number"`: o campo numérico do
                   * navegador rejeita vírgula em pt-BR e rola o valor com a roda
                   * do mouse — os dois viram erro de digitação em lançamento.
                   */
                  type={field.type === "date" ? "date" : "text"}
                  inputMode={
                    field.type === "number" || field.type === "money" ? "decimal" : undefined
                  }
                  autoComplete="off"
                  disabled={busy}
                  {...register(field.name as keyof EntryFormValues)}
                />
              </div>
            );
          })}
        </div>

        <p className="text-on-light-muted text-label-md mt-5 flex items-start gap-1.5 normal-case">
          <InfoIcon size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
          {meta.hint}
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <SpectrumButton type="submit" variant="primary" disabled={busy}>
            {busy ? (
              <Spinner label="Lançando" />
            ) : (
              <CheckIcon size={18} weight="bold" aria-hidden="true" />
            )}
            Lançar
          </SpectrumButton>

          <SpectrumButton
            type="button"
            variant="ghost"
            disabled={busy}
            onClick={() => reset(emptyValues())}
            /* Ghost é desenhado para o grafite: sobre o painel claro precisa da
               borda e do texto escuros para não sumir. */
            className="border-light-outline text-on-light bg-light-container hover:bg-light hover:border-on-light-muted"
          >
            Limpar
          </SpectrumButton>
        </div>
      </form>
    </LightCard>
  );
}
