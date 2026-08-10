import { colors, radius, spectrumStops } from "@rookhub/tokens/tokens";

/**
 * Tema do app do motorista.
 *
 * As cores e os raios vêm de `@rookhub/tokens` — o mesmo espelho em TS que o
 * painel usa em gráficos e mapas. Nada de hex solto em componente, mesma regra
 * do web; o que muda aqui é só o transporte (StyleSheet em vez de Tailwind,
 * porque React Native não tem CSS).
 */
export const theme = {
  colors,
  radius,
  spectrumStops,

  /** Escala de espaçamento em múltiplos de 4, igual à do Tailwind. */
  space: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    "2xl": 32,
    "3xl": 48,
  },

  /**
   * Tipografia do `theme.css` traduzida para RN.
   *
   * Sem Sora/Inter: carregar fonte variável em app nativo exige `expo-font` e
   * arquivos versionados. Até lá o sistema resolve — o peso e a métrica é que
   * carregam a hierarquia, e esses estão preservados.
   */
  text: {
    displayLg: { fontSize: 40, lineHeight: 48, fontWeight: "700" },
    headlineLg: { fontSize: 32, lineHeight: 40, fontWeight: "600" },
    headlineMd: { fontSize: 24, lineHeight: 32, fontWeight: "600" },
    bodyLg: { fontSize: 18, lineHeight: 28, fontWeight: "400" },
    bodyMd: { fontSize: 16, lineHeight: 24, fontWeight: "400" },
    labelMd: { fontSize: 14, lineHeight: 20, fontWeight: "500" },
    labelSm: { fontSize: 12, lineHeight: 16, fontWeight: "500" },
  },
} as const;

/**
 * Alvo mínimo de toque. Caminhoneiro usa o app em pé, no pátio, muitas vezes de
 * luva — 44pt é o piso da Apple/WCAG e aqui é regra, não sugestão.
 */
export const HIT_TARGET = 48;
