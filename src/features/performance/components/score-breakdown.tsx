import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { StyleSheet, View } from "react-native";

import { Card, Text } from "@/components/ui";
import { theme, useColors, useThemedStyles, type Scheme } from "@/theme";
import type { DriverScoreFactor } from "@/types";

type IconName = ComponentProps<typeof Ionicons>["name"];

const FACTOR_ICON: Record<string, IconName> = {
  "safe-driving": "shield-checkmark-outline",
  "on-time": "time-outline",
  efficiency: "leaf-outline",
  routine: "clipboard-outline",
};

interface Props {
  factors: DriverScoreFactor[];
}

export function ScoreBreakdown({ factors }: Props) {
  const colors = useColors();
  const styles = useThemedStyles(makeStyles);

  return (
    <Card style={styles.card}>
      {factors.map((factor, index) => (
        <View
          key={factor.id}
          accessibilityLabel={`${factor.label}, ${factor.score} pontos, peso ${factor.weightPercent}%`}
          style={[styles.row, index < factors.length - 1 && styles.divider]}
        >
          <View style={styles.icon}>
            <Ionicons
              color={colors.accent}
              name={FACTOR_ICON[factor.id] ?? "analytics-outline"}
              size={20}
            />
          </View>

          <View style={styles.content}>
            <View style={styles.head}>
              <View style={styles.copy}>
                <Text variant="labelMd">{factor.label}</Text>
                <Text variant="labelSm" tone="muted" numberOfLines={2}>
                  {factor.description}
                </Text>
              </View>
              <View style={styles.value}>
                <Text variant="metricMd" tabular>
                  {factor.score}
                </Text>
                <Text variant="labelSm" tone="muted" tabular>
                  peso {factor.weightPercent}%
                </Text>
              </View>
            </View>

            <View style={styles.track}>
              <View style={[styles.fill, { width: `${factor.score}%` }]} />
            </View>
          </View>
        </View>
      ))}
    </Card>
  );
}

const makeStyles = (colors: Scheme) =>
  StyleSheet.create({
    card: { paddingVertical: 0 },
    row: { minHeight: 88, flexDirection: "row", alignItems: "center", gap: theme.space.md },
    divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.outline },
    icon: {
      width: 42,
      height: 42,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: theme.radius.md,
      backgroundColor: colors.accentSoft,
    },
    content: { flex: 1, gap: theme.space.sm },
    head: { flexDirection: "row", alignItems: "center", gap: theme.space.sm },
    copy: { flex: 1, gap: 1 },
    value: { alignItems: "flex-end" },
    track: {
      height: 5,
      overflow: "hidden",
      borderRadius: theme.radius.pill,
      backgroundColor: colors.surfaceSunken,
    },
    fill: { height: "100%", borderRadius: theme.radius.pill, backgroundColor: colors.accentSolid },
  });
