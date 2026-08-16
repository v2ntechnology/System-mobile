import { StyleSheet, Text as RNText, type TextProps } from "react-native";

import { theme, useColors } from "@/theme";

type Variant = keyof typeof theme.text;

type Tone =
  | "default"
  | "variant"
  | "muted"
  | "accent"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "onAccent";

interface Props extends TextProps {
  variant?: Variant;
  tone?: Tone;
  /** Números de métrica e tabela — mesma regra do `.tabular` no painel (RNF-027). */
  tabular?: boolean;
}

/** Métrica sai tabular sem ninguém pedir: valor que salta de largura mente ao olho. */
const ALWAYS_TABULAR: Variant[] = ["metricLg", "metricMd", "displayLg"];

export function Text({ variant = "bodyMd", tone = "default", tabular, style, ...rest }: Props) {
  const colors = useColors();
  const numeric = tabular ?? ALWAYS_TABULAR.includes(variant);

  const TONES: Record<Tone, string> = {
    default: colors.onSurface,
    variant: colors.onSurfaceVariant,
    muted: colors.onSurfaceMuted,
    accent: colors.accent,
    secondary: colors.secondary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    onAccent: colors.onAccentSolid,
  };

  return (
    <RNText
      style={[
        theme.text[variant],
        { color: TONES[tone] },
        variant === "overline" && styles.overline,
        numeric && styles.tabular,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  tabular: { fontVariant: ["tabular-nums", "lining-nums"] },
  overline: { textTransform: "uppercase" },
});
