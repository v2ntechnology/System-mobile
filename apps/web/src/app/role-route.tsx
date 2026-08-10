import type { Role } from "@rookhub/types";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useSession } from "@/features/auth/store";

/**
 * Guarda por papel.
 *
 * ⚠️ Conveniência de navegação, NÃO controle de acesso. A autorização real
 * (papel + entitlement) é sempre verificada no backend (BE-14 / RN-119) — quem
 * digitar a URL na mão vai bater no 403 de lá, não aqui.
 *
 * Guardamos apenas as telas **específicas de um papel**, e de propósito não o
 * contrário: as telas operacionais seguem alcançáveis pelo dono por link direto
 * (ação de notificação, resposta do assistente). Bloquear tudo o que não está na
 * árvore transformaria cada link desses num beco sem saída.
 */
export function RoleRoute({ allow, children }: { allow: Role[]; children: ReactNode }) {
  const session = useSession();

  if (session && !allow.includes(session.user.role)) {
    return <Navigate to="/app" replace />;
  }

  return children;
}
