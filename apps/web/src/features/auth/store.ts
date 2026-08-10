import type { Session } from "@rookhub/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * FE-08 — Zustand para client state.
 *
 * ⚠️ Persistir a sessão em localStorage é aceitável enquanto o token é mockado.
 * Com o backend real (BE-11), o refresh token deve viver em cookie HttpOnly e
 * apenas o access token de 15 min fica em memória.
 */

interface AuthState {
  session: Session | null;
  setSession: (session: Session) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      clearSession: () => set({ session: null }),
    }),
    { name: "rookhub:session" },
  ),
);

export const useSession = () => useAuthStore((state) => state.session);
export const useIsAuthenticated = () => useAuthStore((state) => state.session !== null);
