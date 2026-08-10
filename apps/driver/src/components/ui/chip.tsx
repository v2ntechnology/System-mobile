import { StyleSheet, View } from "react-native";

import { theme } from "@/theme";

import { Text } from "./text";

export type Tone = "neutral" | "positive" | "attention" | "critical" | "info";

interface Props {
  label: string;
  tone?: Tone;
  /** Sobre card claro os semânticos do grafite dão ~2:1 e precisam do par escuro. */
  onLight?: boolean;
}

const DARK: Record<Tone, string> = {
  neutral: theme.colors.onSurfaceVariant,
  positive: theme.colors.success,
  attention: theme.colors.warning,
  critical: theme.colors.error,
  info: theme.colors.info,
};

const LIGHT: Record<Tone, string> = {
  neutral: theme.colors.onLightVariant,
  positive: theme.colors.successOnLight,
  attention: theme.colors.warningOnLight,
  critical: theme.colors.errorOnLight,
  info: theme.colors.primaryOnLight,
};

export function Chip({ label, tone = "neutral", onLight = false }: Props) {
  const color = onLight ? LIGHT[tone] : DARK[tone];

  return (
    <View style={[styles.chip, { borderColor: color, backgroundColor: `${color}1F` }]}>
      <Text variant="labelSm" style={{ color }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: "flex-start",
    borderRadius: theme.radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.xs,
  },
});
