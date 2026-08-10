"use client";

import { useId, type ComponentPropsWithRef, type ReactNode } from "react";

import { cn } from "@/lib/cn";

interface FieldShellProps {
  label: string;
  /** Mantém o label no `sr-only` — nunca remove (regra 9). */
  hideLabel?: boolean;
  hint?: string;
  error?: string;
  children: (props: { id: string; describedBy: string | undefined; invalid: boolean }) => ReactNode;
}

function FieldShell({ label, hideLabel, hint, error, children }: FieldShellProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ");

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className={cn("text-label-md text-on-surface-variant", hideLabel && "sr-only")}
      >
        {label}
      </label>

      {children({ id, describedBy: describedBy || undefined, invalid: Boolean(error) })}

      {hint && !error ? (
        <p id={hintId} className="text-label-sm text-on-surface-muted">
          {hint}
        </p>
      ) : null}

      {error ? (
        /* Regra 9 — o erro precisa ser anunciado, não só pintado de vermelho. */
        <p id={errorId} role="alert" className="text-label-sm text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const controlClass = [
  "glass-well w-full px-4 text-body-md text-on-surface placeholder:text-on-surface-muted",
  "transition-colors duration-200",
  "focus:border-secondary focus:outline-none",
  "aria-[invalid=true]:border-error",
].join(" ");

export interface TextFieldProps
  // `ComponentPropsWithRef`: o `register()` do react-hook-form devolve um `ref`
  // junto com os handlers, e no React 19 ele viaja como prop comum.
  extends Omit<ComponentPropsWithRef<"input">, "id" | "aria-invalid"> {
  label: string;
  hideLabel?: boolean;
  hint?: string;
  error?: string;
}

export function TextField({ label, hideLabel, hint, error, className, ...props }: TextFieldProps) {
  return (
    <FieldShell label={label} hideLabel={hideLabel} hint={hint} error={error}>
      {({ id, describedBy, invalid }) => (
        <input
          id={id}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={cn(controlClass, "h-12", className)}
          {...props}
        />
      )}
    </FieldShell>
  );
}

export interface TextAreaFieldProps extends Omit<
  ComponentPropsWithRef<"textarea">,
  "id" | "aria-invalid"
> {
  label: string;
  hideLabel?: boolean;
  hint?: string;
  error?: string;
}

export function TextAreaField({
  label,
  hideLabel,
  hint,
  error,
  className,
  ...props
}: TextAreaFieldProps) {
  return (
    <FieldShell label={label} hideLabel={hideLabel} hint={hint} error={error}>
      {({ id, describedBy, invalid }) => (
        <textarea
          id={id}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={cn(controlClass, "min-h-32 py-3", className)}
          {...props}
        />
      )}
    </FieldShell>
  );
}

export interface SelectFieldProps extends Omit<
  ComponentPropsWithRef<"select">,
  "id" | "aria-invalid"
> {
  label: string;
  hideLabel?: boolean;
  hint?: string;
  error?: string;
}

export function SelectField({
  label,
  hideLabel,
  hint,
  error,
  className,
  children,
  ...props
}: SelectFieldProps) {
  return (
    <FieldShell label={label} hideLabel={hideLabel} hint={hint} error={error}>
      {({ id, describedBy, invalid }) => (
        <select
          id={id}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={cn(controlClass, "h-12", className)}
          {...props}
        >
          {children}
        </select>
      )}
    </FieldShell>
  );
}
