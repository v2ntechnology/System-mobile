import type { ReactNode } from "react";
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { theme, useThemedStyles, type Scheme } from "@/theme";

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Card do cabeçalho.
 *
 * Sem `backdrop-filter` em React Native: um `BlurView` por card custa GPU e, em
 * lista longa, derruba o FPS. Aqui a separação vem da superfície própria mais a
 * borda, que é o que o olho lê como camada nos dois esquemas.
 */
export function HeroCard({ children, style }: CardProps) {
  const styles = useThemedStyles(makeStyles);
  return <View style={[styles.hero, style]}>{children}</View>;
}

/**
 * Card sobre a folha — a superfície onde o trabalho acontece.
 *
 * A separação com a folha é feita pela borda, não pelo fundo: no claro os dois
 * cinzas são vizinhos e brigam sob sol; uma linha de 1px não briga.
 */
export function Card({ children, style }: CardProps) {
  const styles = useThemedStyles(makeStyles);
  return <View style={[styles.card, style]}>{children}</View>;
}

const makeStyles = (colors: Scheme) =>
  StyleSheet.create({
    hero: {
      backgroundColor: colors.heroSurface,
      borderRadius: theme.radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.outline,
      padding: theme.space.lg,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: theme.radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.outline,
      padding: theme.space.lg,
      ...Platform.select({
        ios: {
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
        },
        android: { elevation: 1 },
      }),
    },
  });
