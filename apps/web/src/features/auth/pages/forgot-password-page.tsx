import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, EnvelopeSimpleIcon } from "@phosphor-icons/react";
import { Alert, AuroraBackdrop, GlassInput, SpectrumButton, Spinner } from "@rookhub/ui";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { RookhubLogo } from "@/components/brand/rookhub-logo";

import { requestPasswordReset } from "../api";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "../schema";

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    await requestPasswordReset(values.email);
    setSent(true);
  }

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-6 py-12">
      <AuroraBackdrop />

      <div className="max-w-105 w-full">
        {sent ? (
          <div className="flex flex-col items-center text-center">
            <span className="rounded-pill bg-success/15 text-success flex h-14 w-14 items-center justify-center">
              <EnvelopeSimpleIcon size={26} weight="duotone" />
            </span>
            <h1 className="font-display text-on-surface mt-7 text-[32px] font-bold leading-10">
              Verifique seu e-mail
            </h1>
            <p className="text-body-lg text-on-surface-variant mt-3">
              Se houver uma conta associada a esse endereço, enviamos um link para redefinir a
              senha. O link expira em 30 minutos.
            </p>
          </div>
        ) : (
          <>
            <header className="flex flex-col items-center text-center">
              <RookhubLogo variant="mark" />
              <h1 className="font-display text-on-surface mt-7 text-[32px] font-bold leading-10">
                Recuperar acesso
              </h1>
              <p className="text-body-lg text-on-surface-variant mt-3">
                Informe seu e-mail e enviaremos um link para criar uma nova senha.
              </p>
            </header>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="mt-10 flex flex-col gap-4"
            >
              <Alert severity="info">
                Nesta versão o envio é simulado — nenhum e-mail sai de fato.
              </Alert>

              <GlassInput
                label="E-mail"
                hideLabel
                pill
                type="email"
                autoComplete="email"
                placeholder="Seu e-mail"
                autoFocus
                disabled={isSubmitting}
                error={errors.email?.message}
                {...register("email")}
              />

              <SpectrumButton
                type="submit"
                variant="bright"
                shape="pill"
                size="xl"
                block
                disabled={isSubmitting}
                className="mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Spinner label="Enviando" />
                    Enviando…
                  </>
                ) : (
                  "Enviar link de recuperação"
                )}
              </SpectrumButton>
            </form>
          </>
        )}

        <div className="mt-8 flex justify-center">
          <Link
            to="/login"
            className="text-body-md text-on-surface-variant hover:text-on-surface focus-visible:ring-secondary focus-visible:ring-offset-background inline-flex items-center gap-2 rounded-sm underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
          >
            <ArrowLeftIcon size={16} weight="bold" />
            Voltar para o login
          </Link>
        </div>
      </div>
    </main>
  );
}
