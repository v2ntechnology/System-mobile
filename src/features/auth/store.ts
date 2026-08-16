import type { Session } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { persistentStorage } from "@/lib/storage";

/**
 * Sessão do motorista.
 *
 * Diferente do painel, que guarda em `localStorage`: no aparelho o token vai
 * para o keychain/keystore via `expo-secure-store` (ver `@/lib/storage`).
 * Celular de motorista roda em pátio, é emprestado e é roubado — armazenamento
 * em claro não serve. Com o backend real (BE-11), só o access token de 15 min
 * fica aqui; o refresh continua sendo problema do servidor.
 */

interface AuthState {
  session: Session | null;
  /** A leitura do keychain é assíncrona: sem isto a tela pisca no login antes de hidratar. */
  hydrated: boolean;
  setSession: (session: Session) => void;
  clearSession: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      hydrated: false,
      setSession: (session) => set({ session }),
      clearSession: () => set({ session: null }),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "rookhub.driver-session",
      storage: createJSONStorage(() => persistentStorage),
      partialize: (state) => ({ session: state.session }),
      /*
       * Usa o estado entregue pelo middleware, não `useAuthStore`: no preview
       * web o localStorage hidrata durante a criação da própria constante.
       * Marca hidratado mesmo se a leitura falhar, para não travar no splash.
       */
      onRehydrateStorage: (state) => () => {
        state.setHydrated();
      },
    },
  ),
);

export const useSession = () => useAuthStore((state) => state.session);
export const useHydrated = () => useAuthStore((state) => state.hydrated);
