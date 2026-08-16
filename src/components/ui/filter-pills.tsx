import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { theme, useThemedStyles, type Scheme } from "@/theme";

import { Text } from "./text";

export interface FilterOption<T extends string> {
  id: T;
  label: string;
  /** Quantidade dentro do filtro; some quando a contagem não ajuda a decidir. */
  count?: number;
}

interface Props<T extends string> {
  options: readonly FilterOption<T>[];
  value: T;
  onChange: (id: T) => void;
}

/** Filtro da folha: indigo cheio marca a seleção, o resto fica de contorno. */
export function FilterPills<T extends string>({ options, value, onChange }: Props<T>) {
  const styles = useThemedStyles(makeStyles);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.bleed}
      contentContainerStyle={styles.row}
    >
      {options.map((option) => {
        const active = option.id === value;
        return (
          <Pressable
            key={option.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(option.id)}
            style={({ pressed }) => [
              styles.pill,
              active ? styles.pillActive : styles.pillIdle,
              pressed && !active && styles.pillPressed,
            ]}
          >
            <Text variant="labelMd" tone={active ? "onAccent" : "variant"} numberOfLines={1}>
              {option.label}
            </Text>
            {option.count !== undefined ? (
              <View style={[styles.count, active ? styles.countActive : styles.countIdle]}>
                <Text variant="labelSm" tone={active ? "onAccent" : "muted"} tabular>
                  {option.count}
                </Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const makeStyles = (colors: Scheme) =>
  StyleSheet.create({
    /* Sangra até a borda da folha: filtro cortado no meio avisa que a lista continua. */
    bleed: { marginHorizontal: -theme.space.lg, flexGrow: 0 },
    /*
     * `paddingLeft`/`paddingRight` separados, e a folga final maior: com
     * `paddingHorizontal` o Android come o recuo do fim, e a última pill encosta
     * na borda como se estivesse cortada mesmo depois de rolar até o fim.
     */
    row: {
      gap: theme.space.sm,
      paddingLeft: theme.space.lg,
      paddingRight: theme.space.xl,
    },
    pill: {
      minHeight: 40,
      /* Não encolhe: dentro do scroller horizontal, comprimir corta o rótulo. */
      flexShrink: 0,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.space.sm,
      borderRadius: theme.radius.pill,
      borderWidth: StyleSheet.hairlineWidth,
      paddingHorizontal: theme.space.md,
    },
    pillIdle: { borderColor: colors.outline, backgroundColor: colors.surface },
    pillActive: { borderColor: colors.accentSolid, backgroundColor: colors.accentSolid },
    pillPressed: { backgroundColor: colors.surfaceSunken },
    count: {
      minWidth: 20,
      alignItems: "center",
      borderRadius: theme.radius.pill,
      paddingHorizontal: 3,
    },
    countIdle: { backgroundColor: colors.surfaceSunken },
    countActive: { backgroundColor: `${colors.onAccentSolid}29` },
  });
