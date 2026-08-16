import { StyleSheet, View } from "react-native";

import { theme, useThemedStyles, type Scheme } from "@/theme";

import { Card } from "./card";
import { Text } from "./text";

export interface MetricItem {
  label: string;
  value: string;
  /** Leitura do número: "no prazo", "+3 no mês". Nunca repete o rótulo. */
  hint?: string;
  hintTone?: "positive" | "critical" | "muted";
}

interface Props {
  items: MetricItem[];
}

const HINT_TONE = {
  positive: "success",
  critical: "error",
  muted: "muted",
} as const;

/**
 * Faixa de números do período, montada na costura entre o cabeçalho e a folha.
 *
 * Uma peça dividida por fios, não três cartões: cartões iguais lado a lado dizem
 * que os três valores são coisas separadas, e aqui eles são a mesma leitura do
 * mesmo período.
 */
export function MetricStrip({ items }: Props) {
  const styles = useThemedStyles(makeStyles);

  return (
    <Card style={styles.card}>
      {items.map((item, index) => (
        <View key={item.label} style={styles.cell}>
          {index > 0 ? <View style={styles.divider} /> : null}
          <Text variant="overline" tone="muted" numberOfLines={1}>
            {item.label}
          </Text>
          <Text
            variant="metricMd"
            style={styles.value}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            {item.value}
          </Text>
          {item.hint ? (
            <Text variant="labelSm" tone={HINT_TONE[item.hintTone ?? "muted"]} numberOfLines={2}>
              {item.hint}
            </Text>
          ) : null}
        </View>
      ))}
    </Card>
  );
}

const makeStyles = (colors: Scheme) =>
  StyleSheet.create({
    card: { flexDirection: "row", paddingVertical: theme.space.md, paddingHorizontal: 0 },
    cell: { flex: 1, paddingHorizontal: theme.space.md, gap: 2 },
    divider: {
      position: "absolute",
      left: 0,
      top: 2,
      bottom: 2,
      width: StyleSheet.hairlineWidth,
      backgroundColor: colors.outlineStrong,
    },
    value: { marginTop: 2 },
  });
