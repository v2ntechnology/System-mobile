import { StyleSheet, View } from "react-native";

import { theme, useThemedStyles, type Scheme } from "@/theme";

import { Text } from "./text";

interface Props {
  title: string;
  /** Uma linha explicando o que a seção lista. Some quando o título já basta. */
  description?: string;
  /** Contagem à direita: "3". Fica na pill, alinhada ao título. */
  count?: string;
}

/** Cabeçalho de seção da folha. Título carrega o peso; nada de rótulo acima dele. */
export function SectionHeader({ title, description, count }: Props) {
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.root}>
      <View style={styles.copy}>
        <Text variant="titleMd">{title}</Text>
        {description ? (
          <Text variant="labelMd" tone="muted">
            {description}
          </Text>
        ) : null}
      </View>

      {count ? (
        <View style={styles.count}>
          <Text variant="labelSm" tone="accent" tabular>
            {count}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const makeStyles = (colors: Scheme) =>
  StyleSheet.create({
    root: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.space.md,
    },
    copy: { flex: 1, gap: 2 },
    count: {
      borderRadius: theme.radius.pill,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.outline,
      backgroundColor: colors.accentSoft,
      paddingHorizontal: theme.space.md,
      paddingVertical: theme.space.xs,
    },
  });
