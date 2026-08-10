import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useIsAuthenticated } from "@/features/auth/store";

/**
 * Guarda de rota do painel.
 *
 * ⚠️ Isto é conveniência de navegação, NÃO controle de acesso. A autorização
 * real (papel + entitlement) é sempre verificada no backend (BE-14 / RN-119).
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
