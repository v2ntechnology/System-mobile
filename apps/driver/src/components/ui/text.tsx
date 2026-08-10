import { StyleSheet, Text as RNText, type TextProps } from "react-native";

import { theme } from "@/theme";

type Variant = keyof typeof theme.text;

type Tone =
  | "default"
  | "variant"
  | "muted"
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "onLight"
  | "onLightVariant"
  | "onLightMuted"
  | "onPrimary";

interface Props extends TextProps {
  variant?: Variant;
  tone?: Tone;
  /** Números de métrica e tabela — mesma regra do `.tabular` no painel (RNF-027). */
  tabular?: boolean;
}

const TONES: Record<Tone, string> = {
  default: theme.colors.onSurface,
  variant: theme.colors.onSurfaceVariant,
  muted: theme.colors.onSurfaceMuted,
  primary: theme.colors.primary,
  success: theme.colors.success,
  warning: theme.colors.warning,
  error: theme.colors.error,
  /* Dentro de card claro os tons acima somem — a família on-light é obrigatória. */
  onLight: theme.colors.onLight,
  onLightVariant: theme.colors.onLightVariant,
  onLightMuted: theme.colors.onLightMuted,
  onPrimary: theme.colors.onPrimary,
};

export function Text({ variant = "bodyMd", tone = "default", tabular, style, ...rest }: Props) {
  return (
    <RNText
      style={[theme.text[variant], { color: TONES[tone] }, tabular && styles.tabular, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  tabular: { fontVariant: ["tabular-nums", "lining-nums"] },
});
