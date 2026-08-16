import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { theme } from "@/theme";

import { Text } from "./text";

interface Props {
  title: string;
  /** Contexto de uma linha: placa, data, veículo. Não repete o título. */
  subtitle?: string;
  /** Pill de estado, contador ou botão do canto direito. */
  trailing?: ReactNode;
}

/** Primeira linha do cabeçalho: quem está falando e com quem. */
export function HeroBar({ title, subtitle, trailing }: Props) {
  return (
    <View style={styles.root}>
      <View style={styles.copy}>
        <Text variant="headlineMd" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="labelMd" tone="variant" numberOfLines={1} tabular>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.space.md,
  },
  copy: { flex: 1, gap: 2 },
});
