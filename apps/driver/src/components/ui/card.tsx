import type { ReactNode } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";

import { theme } from "@/theme";

interface CardProps {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
}

/**
 * Equivalente nativo do `.glass`.
 *
 * Sem `backdrop-filter` em React Native: um `BlurView` por card custa GPU e,
 * em lista longa, derruba o FPS — que é exatamente o que a regra 6 do painel
 * proíbe. Aqui o vidro é simulado com superfície translúcida sobre o grafite
 * mais borda clara, que é o que o olho lê como vidro nesse fundo.
 */
export function GlassCard({ children, style }: CardProps) {
  return <View style={[styles.glass, style]}>{children}</View>;
}

/** Painel claro sobre o grafite — mesma inversão do dashboard (regra 2b). */
export function LightCard({ children, style }: CardProps) {
  return <View style={[styles.light, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  glass: {
    backgroundColor: theme.colors.surfaceLow,
    borderRadius: theme.radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.outlineVariant,
    padding: theme.space.lg,
  },
  light: {
    backgroundColor: theme.colors.light,
    borderRadius: theme.radius.lg,
    padding: theme.space.lg,
  },
});
