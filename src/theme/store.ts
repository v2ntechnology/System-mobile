import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { persistentStorage } from "@/lib/storage";

/**
 * Preferência de tema do motorista.
 *
 * `system` é o padrão: o aparelho já sabe se é dia ou noite. Quem fixa `light`
 * ou `dark` tem motivo de campo — cabine escura com tela clara cega, pátio ao
 * sol com tela escura some — e a escolha precisa sobreviver ao fechamento do
 * app.
 *
 * Guarda no mesmo armazenamento da sessão por consistência de camada, não por
 * sigilo: é uma preferência de interface, não um segredo.
 */

export type ThemeMode = "system" | "light" | "dark";

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: "system",
      setMode: (mode) => set({ mode }),
    }),
    {
      name: "rookhub.driver-theme",
      storage: createJSONStorage(() => persistentStorage),
    },
  ),
);

export const useThemeMode = () => useThemeStore((state) => state.mode);
