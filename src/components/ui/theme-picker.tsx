import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import {
  HIT_TARGET,
  theme,
  useColors,
  useThemeMode,
  useThemedStyles,
  useThemeStore,
  type Scheme,
  type ThemeMode,
} from "@/theme";

import { Text } from "./text";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

const OPTIONS: { id: ThemeMode; label: string; icon: IconName }[] = [
  { id: "system", label: "Sistema", icon: "phone-portrait-outline" },
  { id: "light", label: "Claro", icon: "sunny-outline" },
  { id: "dark", label: "Escuro", icon: "moon-outline" },
];

/**
 * Escolha do tema, no Perfil.
 *
 * Três alvos grandes lado a lado em vez de um interruptor: "Sistema" precisa ser
 * uma opção visível, senão quem nunca abriu a tela fica preso no que o aparelho
 * decidir e não descobre que pode fixar.
 */
export function ThemePicker() {
  const mode = useThemeMode();
  const setMode = useThemeStore((state) => state.setMode);
  const colors = useColors();
  const styles = useThemedStyles(makeStyles);

  return (
    <View accessibilityRole="radiogroup" style={styles.row}>
      {OPTIONS.map((option) => {
        const active = option.id === mode;
        return (
          <Pressable
            key={option.id}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Tema ${option.label}`}
            onPress={() => setMode(option.id)}
            style={({ pressed }) => [
              styles.option,
              active && styles.optionActive,
              pressed && !active && styles.optionPressed,
            ]}
          >
            <Ionicons
              name={option.icon}
              size={20}
              color={active ? colors.accent : colors.onSurfaceMuted}
            />
            <Text variant="labelSm" tone={active ? "accent" : "muted"}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const makeStyles = (colors: Scheme) =>
  StyleSheet.create({
    row: { flexDirection: "row", gap: theme.space.sm },
    option: {
      flex: 1,
      minHeight: HIT_TARGET + 8,
      alignItems: "center",
      justifyContent: "center",
      gap: theme.space.xs,
      borderRadius: theme.radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.outline,
      backgroundColor: colors.surfaceSunken,
    },
    optionActive: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
    optionPressed: { backgroundColor: colors.surface },
  });
