import { StyleSheet, View } from "react-native";
import Svg, { Circle, Line, Path } from "react-native-svg";

import { Card, Text } from "@/components/ui";
import { theme, useColors, useThemedStyles, type Scheme } from "@/theme";

interface Props {
  history: { month: string; score: number }[];
}

const WIDTH = 320;
const HEIGHT = 96;
const PADDING_X = 14;
const PADDING_Y = 12;

export function ScoreTrend({ history }: Props) {
  const colors = useColors();
  const styles = useThemedStyles(makeStyles);

  if (history.length === 0) return null;

  const values = history.map((entry) => entry.score);
  const min = Math.max(0, Math.min(...values) - 3);
  const max = Math.min(100, Math.max(...values) + 2);
  const range = Math.max(1, max - min);
  const points = history.map((entry, index) => ({
    x: PADDING_X + (index / Math.max(1, history.length - 1)) * (WIDTH - PADDING_X * 2),
    y: PADDING_Y + ((max - entry.score) / range) * (HEIGHT - PADDING_Y * 2),
  }));
  const line = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
    .join(" ");
  const area = `${line} L${points.at(-1)!.x},${HEIGHT} L${points[0]!.x},${HEIGHT} Z`;
  const first = history[0]!;
  const current = history.at(-1)!;
  const delta = current.score - first.score;

  return (
    <Card style={styles.card}>
      <View style={styles.summary}>
        <View>
          <Text variant="overline" tone="muted">
            Últimos {history.length} meses
          </Text>
          <Text variant="titleMd" tabular>
            {first.score} → {current.score} pontos
          </Text>
        </View>
        <Text variant="labelMd" tone={delta >= 0 ? "success" : "error"} tabular>
          {delta >= 0 ? "+" : ""}
          {delta} no período
        </Text>
      </View>

      <View
        accessibilityLabel={`Evolução do score: ${history.map((entry) => `${entry.month} ${entry.score}`).join(", ")}`}
      >
        <Svg height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width="100%">
          {[0.25, 0.5, 0.75].map((position) => (
            <Line
              key={position}
              stroke={colors.outline}
              strokeDasharray="4 6"
              strokeWidth="1"
              x1={PADDING_X}
              x2={WIDTH - PADDING_X}
              y1={HEIGHT * position}
              y2={HEIGHT * position}
            />
          ))}
          <Path d={area} fill={`${colors.accentSolid}18`} />
          <Path
            d={line}
            fill="none"
            stroke={colors.accentSolid}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
          />
          {points.map((point, index) => (
            <Circle
              key={history[index]!.month}
              cx={point.x}
              cy={point.y}
              fill={colors.surface}
              r={index === points.length - 1 ? 5 : 3.5}
              stroke={colors.accentSolid}
              strokeWidth={index === points.length - 1 ? 3 : 2}
            />
          ))}
        </Svg>

        <View style={styles.labels}>
          {history.map((entry) => (
            <Text key={entry.month} variant="labelSm" tone="muted" tabular>
              {entry.month}
            </Text>
          ))}
        </View>
      </View>
    </Card>
  );
}

const makeStyles = (colors: Scheme) =>
  StyleSheet.create({
    card: { gap: theme.space.lg },
    summary: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: theme.space.md,
      paddingBottom: theme.space.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.outline,
    },
    labels: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 7 },
  });
