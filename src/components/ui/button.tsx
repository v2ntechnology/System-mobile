import { ActivityIndicator, Pressable, StyleSheet, View, type ViewStyle } from "react-native";

import { HIT_TARGET, theme, useColors, useThemedStyles, type Scheme } from "@/theme";

import { Text } from "./text";

type Variant = "primary" | "ghost";

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  /** Pill nas telas de autenticação e nas ações grandes de campo. */
  shape?: "pill" | "rounded";
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

/**
 * `accentSolid` é o indigo que carrega texto branco em AA nos dois esquemas —
 * o indigo puro da marca reprova, e aqui vale ainda mais, porque a tela é lida
 * sob sol direto.
 */
export function Button({
  label,
  onPress,
  variant = "primary",
  shape = "rounded",
  loading = false,
  disabled = false,
  icon,
  style,
}: Props) {
  const colors = useColors();
  const styles = useThemedStyles(makeStyles);
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      accessibilityLabel={label}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        { borderRadius: shape === "pill" ? theme.radius.pill : theme.radius.md },
        pressed && styles.pressed,
        inactive && styles.inactive,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "ghost" ? colors.onSurface : colors.onAccentSolid} />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text
            variant="labelMd"
            tone={variant === "ghost" ? "default" : "onAccent"}
            style={styles.label}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const makeStyles = (colors: Scheme) =>
  StyleSheet.create({
    base: {
      minHeight: HIT_TARGET,
      paddingHorizontal: theme.space.xl,
      alignItems: "center",
      justifyContent: "center",
    },
    primary: { backgroundColor: colors.accentSolid },
    ghost: {
      backgroundColor: colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.outlineStrong,
    },
    content: { flexDirection: "row", alignItems: "center", gap: theme.space.sm },
    label: { fontSize: 15, fontFamily: theme.fonts.semibold, letterSpacing: 0.1 },
    pressed: { opacity: 0.85 },
    inactive: { opacity: 0.5 },
  });
