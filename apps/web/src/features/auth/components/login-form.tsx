import { zodResolver } from "@hookform/resolvers/zod";
import { EnvelopeSimpleIcon, LockKeyIcon } from "@phosphor-icons/react";
import type { Session } from "@rookhub/types";
import { Alert, Checkbox, GlassInput, SpectrumButton, Spinner } from "@rookhub/ui";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { GoogleMark } from "@/components/brand/google-mark";
import { ApiError } from "@/mocks/latency";

import { login, signInWithGoogle } from "../api";
import { landingFor } from "../landing";
import { loginSchema, type LoginFormValues } from "../schema";
import { useAuthStore } from "../store";
import { PasswordField } from "./password-field";
import { DevCredentials } from "./dev-credentials";

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);

  const [formError, setFormError] = useState<string | null>(null);
  const [ssoPending, setSsoPending] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    control,
    setFocus,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  /** Rota que o usuário tentou acessar antes de ser barrado, quando houve uma. */
  const attempted = (location.state as { from?: string } | null)?.from;

  /**
   * Para onde ir depois de entrar.
   *
   * A rota barrada tem precedência: quem clicou num link de notificação espera
   * cair nele, não numa tela de escolha. Sem ela, vale o destino do papel.
   */
  function destinationFor(session: Session) {
    return attempted ?? landingFor(session.user.role);
  }

  async function onSubmit(values: LoginFormValues) {
    setFormError(null);
    try {
      const session = await login({ email: values.email, password: values.password });
      setSession(session);
      navigate(destinationFor(session), { replace: true });
    } catch (error) {
      setFormError(
        error instanceof ApiError
          ? (error.detail ?? error.title)
          : "Não foi possível entrar agora. Tente novamente em instantes.",
      );
    }
  }

  async function onGoogleSignIn() {
    setFormError(null);
    setSsoPending(true);
    try {
      const session = await signInWithGoogle();
      setSession(session);
      navigate(destinationFor(session), { replace: true });
    } catch (error) {
      setFormError(
        error instanceof ApiError ? (error.detail ?? error.title) : "Falha no login com o Google.",
      );
    } finally {
      setSsoPending(false);
    }
  }

  const busy = isSubmitting || ssoPending;

  useEffect(() => {
    if (formError) errorRef.current?.focus();
  }, [formError]);

  function fillDemoCredentials(email: string, password: string) {
    setFormError(null);
    setValue("email", email, { shouldDirty: true, shouldValidate: true });
    setValue("password", password, { shouldDirty: true, shouldValidate: true });
    setFocus("email");
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      autoComplete="on"
      className="flex flex-col gap-5"
    >
      {formError ? (
        <div
          ref={errorRef}
          tabIndex={-1}
          className="focus-visible:ring-error rounded-md focus-visible:outline-none focus-visible:ring-2"
        >
          <Alert severity="error">{formError}</Alert>
        </div>
      ) : null}

      <GlassInput
        label="E-mail"
        pill
        type="email"
        autoComplete="email"
        inputMode="email"
        placeholder="nome@empresa.com.br"
        leading={<EnvelopeSimpleIcon size={20} weight="duotone" aria-hidden="true" />}
        autoFocus
        disabled={busy}
        error={errors.email?.message}
        {...register("email")}
      />

      <PasswordField
        label="Senha"
        pill
        autoComplete="current-password"
        placeholder="Digite sua senha"
        leading={<LockKeyIcon size={20} weight="duotone" aria-hidden="true" />}
        disabled={busy}
        error={errors.password?.message}
        {...register("password")}
      />

      {/* Empilha no mobile: lado a lado, os dois rótulos quebram em duas linhas cada. */}
      <div className="flex flex-col items-start gap-3 px-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <Controller
          control={control}
          name="rememberMe"
          render={({ field }) => (
            <Checkbox
              label="Manter conectado"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
              disabled={busy}
            />
          )}
        />

        <Link
          to="/esqueci-minha-senha"
          className="text-body-md text-on-surface-variant hover:text-on-surface focus-visible:ring-secondary focus-visible:ring-offset-background rounded-sm underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
        >
          Esqueci minha senha
        </Link>
      </div>

      <SpectrumButton
        type="submit"
        variant="bright"
        shape="pill"
        size="xl"
        block
        disabled={busy}
        className="mt-2"
      >
        {isSubmitting ? (
          <>
            <Spinner label="Entrando" />
            Entrando…
          </>
        ) : (
          "Entrar"
        )}
      </SpectrumButton>

      <div className="my-3 flex items-center gap-4" aria-hidden="true">
        <span className="bg-outline-variant h-px flex-1" />
        <span className="text-label-sm text-on-surface-muted uppercase">ou</span>
        <span className="bg-outline-variant h-px flex-1" />
      </div>

      <SpectrumButton
        variant="ghost"
        shape="pill"
        size="xl"
        block
        onClick={onGoogleSignIn}
        disabled={busy}
      >
        {ssoPending ? <Spinner label="Conectando" /> : <GoogleMark className="h-5 w-5" />}
        Continuar com Google
      </SpectrumButton>

      <DevCredentials onSelect={fillDemoCredentials} disabled={busy} />
    </form>
  );
}
