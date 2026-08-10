import { ArrowRightIcon, InfoIcon } from "@phosphor-icons/react";
import type { Role } from "@rookhub/types";

import { MOCK_CREDENTIALS } from "@/mocks/users";

/**
 * Atalho de desenvolvimento: lista as contas mockadas disponíveis.
 * Some automaticamente no build de produção.
 */
interface DevCredentialsProps {
  onSelect: (email: string, password: string) => void;
  disabled?: boolean;
}

/* DRIVER entra aqui porque o papel existe no domínio — mas nenhuma conta de
   motorista é mockada no painel: a casa dele é o app (`apps/driver`). */
const ROLE_LABELS: Record<Role, string> = {
  OWNER: "Proprietário",
  MANAGER: "Gestor",
  OPERATOR: "Operador",
  MAINTENANCE: "Manutenção",
  SUPER_ADMIN: "Super admin",
  DRIVER: "Motorista",
};

export function DevCredentials({ onSelect, disabled = false }: DevCredentialsProps) {
  if (import.meta.env.PROD) return null;

  return (
    <details className="glass-well text-label-md text-on-surface-muted group px-4 py-3 normal-case">
      <summary className="focus-visible:ring-secondary flex cursor-pointer select-none list-none items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2">
        <InfoIcon size={16} weight="duotone" />
        <span className="flex-1">Acessar com uma conta de demonstração</span>
        <ArrowRightIcon className="transition-transform group-open:rotate-90" size={16} />
      </summary>
      <ul className="border-outline-variant mt-3 grid gap-2 border-t pt-3 sm:grid-cols-2">
        {MOCK_CREDENTIALS.map(({ user, password }) => (
          <li key={user.id}>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onSelect(user.email, password)}
              className="border-outline-variant hover:border-outline focus-visible:ring-secondary w-full rounded-md border bg-white/[0.03] px-3 py-2 text-left transition-colors hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50"
            >
              <span className="text-on-surface block font-semibold">{ROLE_LABELS[user.role]}</span>
              <span className="tabular text-on-surface-muted mt-0.5 block truncate">
                {user.email}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="text-label-sm text-on-surface-muted mt-3 normal-case">
        Os dados são preenchidos automaticamente. Senha padrão:{" "}
        <span className="tabular">rookhub123</span>.
      </p>
    </details>
  );
}
