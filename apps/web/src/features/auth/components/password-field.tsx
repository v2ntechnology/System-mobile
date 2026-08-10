import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import { GlassInput, type GlassInputProps } from "@rookhub/ui";
import { forwardRef, useState } from "react";

export type PasswordFieldProps = Omit<GlassInputProps, "type" | "trailing">;

/** Campo de senha com alternância de visibilidade acessível. */
export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField(props, ref) {
    const [visible, setVisible] = useState(false);

    return (
      <GlassInput
        ref={ref}
        type={visible ? "text" : "password"}
        trailing={
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={visible}
            className="rounded-pill text-on-surface-muted hover:text-on-surface focus-visible:ring-secondary -mr-1 shrink-0 p-2 transition-colors hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2"
          >
            {visible ? (
              <EyeSlashIcon size={20} weight="duotone" />
            ) : (
              <EyeIcon size={20} weight="duotone" />
            )}
          </button>
        }
        {...props}
      />
    );
  },
);
