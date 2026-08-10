import type { ReactNode } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@/theme";

interface Props {
  children: ReactNode;
  /** Sem rolagem quando a tela é um formulário curto ou uma lista própria. */
  scroll?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
}

/**
 * Casca de toda tela: grafite de ponta a ponta (regra 1 — nenhuma tela define
 * fundo próprio) e respiro para a barra de gestos do aparelho.
 */
export function Screen({ children, scroll = true, onRefresh, refreshing = false }: Props) {
  const insets = useSafeAreaInsets();
  const padding = { paddingBottom: insets.bottom + theme.space["2xl"] };

  if (!scroll) {
    return <View style={[styles.root, styles.content, padding]}>{children}</View>;
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.content, padding]}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.onSurfaceVariant}
            colors={[theme.colors.primary]}
            progressBackgroundColor={theme.colors.surfaceContainer}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.space.lg, gap: theme.space.lg },
});
