import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useColorScheme } from "react-native";

import { useThemeMode } from "./store";
import { darkScheme, lightScheme, type Scheme } from "./tokens";

/**
 * Esquema em uso, resolvido em um lugar só.
 *
 * Sem contexto cada tela leria o `useColorScheme` por conta própria e a
 * preferência salva no Perfil não valeria nada. Aqui a preferência ganha do
 * aparelho, e `ForceScheme` ganha dos dois — é como o login fica claro mesmo com
 * o app inteiro no escuro.
 */

export type SchemeName = "light" | "dark";

interface ThemeValue {
  colors: Scheme;
  scheme: SchemeName;
}

const ThemeContext = createContext<ThemeValue>({ colors: darkScheme, scheme: "dark" });

/**
 * Esquema que a tela está mostrando agora, para quem desenha **em volta** dela.
 *
 * Contexto só flui para baixo, e o `ForceScheme` do login vive lá no fundo da
 * árvore — a moldura do preview, que é a casca de tudo, nunca ficaria sabendo.
 * Este canal existe para esse caso: a tela avisa o que está exibindo, e a
 * moldura acompanha em vez de ficar escura sobre um login claro.
 */
const ScreenSchemeContext = createContext<SchemeName>("dark");
const ScreenSchemeReporter = createContext<(scheme: SchemeName | null) => void>(() => {});

const SCHEMES: Record<SchemeName, Scheme> = { light: lightScheme, dark: darkScheme };

export function ThemeProvider({ children }: { children: ReactNode }) {
  const mode = useThemeMode();
  const system = useColorScheme();
  const [forced, setForced] = useState<SchemeName | null>(null);

  const scheme: SchemeName = mode === "system" ? (system === "light" ? "light" : "dark") : mode;

  const value = useMemo<ThemeValue>(() => ({ colors: SCHEMES[scheme], scheme }), [scheme]);

  return (
    <ScreenSchemeReporter.Provider value={setForced}>
      <ScreenSchemeContext.Provider value={forced ?? scheme}>
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
      </ScreenSchemeContext.Provider>
    </ScreenSchemeReporter.Provider>
  );
}

/** Fixa um esquema para a subárvore. O login usa isto para ser sempre claro. */
export function ForceScheme({ scheme, children }: { scheme: SchemeName; children: ReactNode }) {
  const report = useContext(ScreenSchemeReporter);
  const value = useMemo<ThemeValue>(() => ({ colors: SCHEMES[scheme], scheme }), [scheme]);

  /* Some junto com a tela: ao desmontar, a moldura volta ao esquema do app. */
  useEffect(() => {
    report(scheme);
    return () => report(null);
  }, [report, scheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Esquema visível na tela, incluindo o que o `ForceScheme` impôs. */
export function useScreenScheme(): SchemeName {
  return useContext(ScreenSchemeContext);
}

export function useTheme(): ThemeValue {
  return useContext(ThemeContext);
}

export function useColors(): Scheme {
  return useContext(ThemeContext).colors;
}

/**
 * Folha de estilo que depende do esquema.
 *
 * A fábrica roda de novo só quando o esquema troca; passe uma função definida
 * fora do componente para o `useMemo` não recalcular a cada render.
 */
export function useThemedStyles<T>(factory: (colors: Scheme) => T): T {
  const colors = useColors();
  return useMemo(() => factory(colors), [factory, colors]);
}
