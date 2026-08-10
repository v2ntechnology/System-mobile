import type { Session } from "@rookhub/types";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * Sessão do motorista.
 *
 * Diferente do painel, que guarda em `localStorage`: aqui o token vai para o
 * keychain/keystore do aparelho via `expo-secure-store`. Celular de motorista
 * roda em pátio, é emprestado e é roubado — armazenamento em claro não serve.
 * Com o backend real (BE-11), só o access token de 15 min fica aqui; o refresh
 * continua sendo problema do servidor.
 */

const secureStorage = {
  getItem: (name: string) => SecureStore.getItemAsync(name),
  setItem: (name: string, value: string) => SecureStore.setItemAsync(name, value),
  removeItem: (name: string) => SecureStore.deleteItemAsync(name),
};

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
      name: "rookhub:driver-session",
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({ session: state.session }),
      /* Marca hidratado mesmo se a leitura falhar — senão o app trava no splash. */
      onRehydrateStorage: () => () => {
        useAuthStore.getState().setHydrated();
      },
    },
  ),
);

export const useSession = () => useAuthStore((state) => state.session);
export const useHydrated = () => useAuthStore((state) => state.hydrated);
