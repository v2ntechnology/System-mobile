import { StyleSheet, View } from "react-native";

import { theme, useColors } from "@/theme";

import { Text } from "./text";

export type Tone = "neutral" | "positive" | "attention" | "critical" | "info";

interface Props {
  label: string;
  tone?: Tone;
}

/** Estado em uma palavra. A cor vem do esquema em uso — nunca do fundo em que caiu. */
export function Chip({ label, tone = "neutral" }: Props) {
  const colors = useColors();

  const PALETTE: Record<Tone, { text: string; soft: string }> = {
    neutral: { text: colors.onSurfaceVariant, soft: colors.surfaceSunken },
    positive: { text: colors.success, soft: colors.successSoft },
    attention: { text: colors.warning, soft: colors.warningSoft },
    critical: { text: colors.error, soft: colors.errorSoft },
    info: { text: colors.info, soft: colors.infoSoft },
  };

  const { text, soft } = PALETTE[tone];

  return (
    <View style={[styles.chip, { borderColor: `${text}52`, backgroundColor: soft }]}>
      <Text variant="labelSm" style={[styles.label, { color: text }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: "flex-start",
    borderRadius: theme.radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: theme.space.sm,
    paddingVertical: 3,
  },
  label: { fontFamily: theme.fonts.semibold },
});
