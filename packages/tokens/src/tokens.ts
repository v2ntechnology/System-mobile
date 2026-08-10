/**
 * Espelho em TypeScript dos tokens de cor, para uso em contextos que não são CSS
 * (gráficos visx/Recharts, canvas, mapas Mapbox).
 *
 * Mantido em sincronia manual com `theme.css` — este arquivo NÃO é a fonte de verdade.
 */

export const colors = {
  /** Âncora — fundo de toda a aplicação. */
  background: "#212121",
  surface: "#212121",
  surfaceLowest: "#171717",
  surfaceLow: "#262626",
  surfaceContainer: "#2E2E2E",
  surfaceHigh: "#383838",
  surfaceHighest: "#434343",

  onSurface: "#F0F0F2",
  onSurfaceVariant: "#B4B4BC",
  onSurfaceMuted: "#8A8A94",
  outline: "#6E6E76",
  outlineVariant: "#3A3A3E",

  primary: "#6366F1",
  /** Único indigo que carrega texto branco em AA (5,3:1) — botão, chip, pill ativa. */
  primaryStrong: "#5457EE",
  primaryContainer: "#3730A3",
  onPrimary: "#FFFFFF",
  secondary: "#06B6D4",
  secondaryContainer: "#0E7490",
  onSecondary: "#00212B",
  tertiary: "#212121",

  bright: "#F8FAFC",
  onBright: "#171717",

  success: "#34D399",
  warning: "#FBBF24",
  error: "#FB7185",
  info: "#38BDF8",

  /* Superfície clara — os semânticos acima dão ~2:1 aqui e não podem ser usados. */
  light: "#E8EAEC",
  lightContainer: "#F4F5F6",
  onLight: "#16161A",
  onLightVariant: "#4A4A54",
  onLightMuted: "#62626C",
  lightOutline: "#C7C9CE",
  primaryOnLight: "#4F46E5",
  successOnLight: "#065F46",
  warningOnLight: "#6B3F0A",
  errorOnLight: "#9F1239",
} as const;

/** Paradas do Spectrum Gradient, na ordem. */
export const spectrumStops = [
  "#E879F9",
  "#A855F7",
  "#6366F1",
  "#4F7DF3",
  "#3B9EF5",
  "#06B6D4",
  "#22D3EE",
] as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 9999,
} as const;

export type ColorToken = keyof typeof colors;
