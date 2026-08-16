import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import type { StateStorage } from "zustand/middleware";

/**
 * Armazenamento persistente dos stores.
 *
 * No aparelho é o keychain/keystore via `expo-secure-store`: celular de motorista
 * roda em pátio, é emprestado e é roubado, então o token não fica em claro.
 *
 * No preview web esse módulo não existe, e chamá-lo derruba a hidratação —
 * `useHydrated()` nunca conclui e o app trava no splash. Lá vale o
 * `localStorage`, que é suficiente para a única coisa que a web faz aqui: olhar
 * a tela em uma janela grande durante o desenvolvimento. Nada sensível de
 * verdade passa por esse caminho; quando o backend existir, o token real
 * continua sendo problema do aparelho.
 */

const keychain: StateStorage = {
  getItem: (name) => SecureStore.getItemAsync(name),
  setItem: (name, value) => SecureStore.setItemAsync(name, value),
  removeItem: (name) => SecureStore.deleteItemAsync(name),
};

/** Sem `localStorage` (SSR, janela restrita) o preview roda sem persistir. */
const memory = new Map<string, string>();

const browser: StateStorage = {
  getItem: (name) => globalThis.localStorage?.getItem(name) ?? memory.get(name) ?? null,
  setItem: (name, value) => {
    memory.set(name, value);
    globalThis.localStorage?.setItem(name, value);
  },
  removeItem: (name) => {
    memory.delete(name);
    globalThis.localStorage?.removeItem(name);
  },
};

export const persistentStorage: StateStorage = Platform.OS === "web" ? browser : keychain;
