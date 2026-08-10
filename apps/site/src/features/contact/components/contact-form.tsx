"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, CircleNotch, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/field";
import { submitContact, type ContactReceipt } from "@/features/contact/api";
import {
  contactSchema,
  fleetSizeOptions,
  interestOptions,
  type ContactFormValues,
} from "@/features/contact/schema";

export function ContactForm() {
  const [receipt, setReceipt] = useState<ContactReceipt | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    // Valida ao sair do campo, não a cada tecla: erro que aparece enquanto a pessoa
    // ainda está digitando o e-mail é ruído, não ajuda.
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phone: "",
      fleetSize: "",
      interest: "",
      message: "",
    },
  });

  async function onSubmit(values: ContactFormValues) {
    setFailure(null);
    try {
      setReceipt(await submitContact(values));
    } catch (error) {
      setFailure(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar agora. Tente de novo em alguns minutos.",
      );
    }
  }

  if (receipt) {
    return (
      <div
        role="status"
        className="glass text-body-md text-on-surface flex flex-col items-start gap-3 p-8"
      >
        <CheckCircle size={32} weight="duotone" className="text-success" aria-hidden="true" />
        <h2 className="font-display text-headline-md">Recebemos seu contato</h2>
        <p className="text-on-surface-variant">
          Guardamos o protocolo <span className="tabular text-on-surface">{receipt.protocol}</span>.
          Respondemos em até <span className="tabular">{receipt.replyWithinHours}</span> horas
          úteis, no e-mail que você informou.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {failure ? (
        /* `role="alert"` — a falha precisa ser anunciada, não só pintada (regra 9). */
        <p
          role="alert"
          className="border-error/40 bg-error/10 text-body-md text-error flex items-start gap-3 rounded-md border p-4"
        >
          <WarningCircle size={20} weight="bold" aria-hidden="true" className="mt-0.5 shrink-0" />
          {failure}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Nome"
          autoComplete="name"
          placeholder="Como podemos te chamar"
          error={errors.name?.message}
          {...register("name")}
        />
        <TextField
          label="E-mail corporativo"
          type="email"
          autoComplete="email"
          placeholder="voce@empresa.com.br"
          error={errors.email?.message}
          {...register("email")}
        />
        <TextField
          label="Empresa"
          autoComplete="organization"
          placeholder="Razão social ou nome fantasia"
          error={errors.company?.message}
          {...register("company")}
        />
        <TextField
          label="Telefone"
          type="tel"
          autoComplete="tel"
          placeholder="(11) 90000-0000"
          hint="Opcional — só usamos se você preferir falar por telefone."
          error={errors.phone?.message}
          {...register("phone")}
        />
        <SelectField
          label="Tamanho da frota"
          error={errors.fleetSize?.message}
          {...register("fleetSize")}
        >
          <option value="">Selecione…</option>
          {fleetSizeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>
        <SelectField label="Assunto" error={errors.interest?.message} {...register("interest")}>
          <option value="">Selecione…</option>
          {interestOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>
      </div>

      <TextAreaField
        label="O que está doendo hoje na operação?"
        placeholder="Ex.: não sei o custo real por veículo e a manutenção corretiva só aparece na fatura."
        error={errors.message?.message}
        {...register("message")}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" variant="bright" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <CircleNotch size={18} weight="bold" className="animate-spin" aria-hidden="true" />
              Enviando…
            </>
          ) : (
            "Enviar contato"
          )}
        </Button>
        <p className="text-label-md text-on-surface-muted">
          Seus dados são usados só para este contato. Nada de lista de disparo.
        </p>
      </div>
    </form>
  );
}
