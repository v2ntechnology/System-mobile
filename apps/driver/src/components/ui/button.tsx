import { ActivityIndicator, Pressable, StyleSheet, View, type ViewStyle } from "react-native";

import { HIT_TARGET, theme } from "@/theme";

import { Text } from "./text";

type Variant = "primary" | "bright" | "ghost" | "danger";

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  /** Pill nas telas de autenticação e nas ações grandes de campo (regra 4). */
  shape?: "pill" | "rounded";
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

/**
 * `primary` usa `primaryStrong`, não `primary`: #6366F1 com branco dá 4,47:1 e
 * reprova AA. Mesma decisão do painel — aqui vale ainda mais, porque a tela é
 * lida sob sol direto.
 */
const SURFACE: Record<Variant, ViewStyle> = {
  primary: { backgroundColor: theme.colors.primaryStrong },
  bright: { backgroundColor: theme.colors.bright },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.outline,
  },
  danger: { backgroundColor: theme.colors.error },
};

const LABEL_TONE = {
  primary: "onPrimary",
  bright: "onLight",
  ghost: "default",
  danger: "onLight",
} as const;

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
        SURFACE[variant],
        { borderRadius: shape === "pill" ? theme.radius.pill : theme.radius.md },
        pressed && styles.pressed,
        inactive && styles.inactive,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "bright" ? theme.colors.onBright : "#FFFFFF"} />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text variant="labelMd" tone={LABEL_TONE[variant]} style={styles.label}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: HIT_TARGET,
    paddingHorizontal: theme.space.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { flexDirection: "row", alignItems: "center", gap: theme.space.sm },
  label: { fontSize: 16, letterSpacing: 0.2 },
  pressed: { opacity: 0.85 },
  inactive: { opacity: 0.5 },
});
