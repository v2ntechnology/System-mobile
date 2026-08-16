import type { ReactNode } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  SHEET_OVERLAP,
  SHEET_RADIUS,
  theme,
  useColors,
  useThemedStyles,
  type Scheme,
} from "@/theme";

interface Props {
  /** Cabeçalho. Ausente nas telas que já têm header nativo do Stack. */
  hero?: ReactNode;
  children: ReactNode;
  scroll?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  /**
   * Respiro da barra de gestos. Fica em `false` nas telas de aba: lá quem já
   * reserva esse espaço é a barra inferior, e somar os dois abre um vão morto.
   */
  insetBottom?: boolean;
}

/**
 * Casca de duas superfícies: o cabeçalho carrega identidade e contexto, a folha
 * carrega o trabalho.
 *
 * A folha sobe `SHEET_OVERLAP` por cima do cabeçalho — é a costura que faz a
 * tela ler como uma peça sobre a outra, e não como duas faixas empilhadas. A
 * faixa acima do conteúdo cobre o repique do iOS, que senão mostraria a folha
 * esticada no topo.
 */
export function SheetScreen({
  hero,
  children,
  scroll = true,
  onRefresh,
  refreshing,
  insetBottom = true,
}: Props) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const styles = useThemedStyles(makeStyles);
  const bottom = (insetBottom ? insets.bottom : 0) + theme.space["2xl"];

  const body = (
    <>
      <View style={styles.bleed} />
      <View style={hero ? [styles.hero, { paddingTop: insets.top + theme.space.lg }] : styles.stub}>
        {hero}
      </View>
      <View style={[styles.sheet, { paddingBottom: bottom }]}>{children}</View>
    </>
  );

  if (!scroll) {
    return <View style={styles.root}>{body}</View>;
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing ?? false}
            onRefresh={onRefresh}
            tintColor={colors.onSurfaceVariant}
            colors={[colors.accentSolid]}
            progressBackgroundColor={colors.surface}
          />
        ) : undefined
      }
    >
      {body}
    </ScrollView>
  );
}

const makeStyles = (colors: Scheme) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    content: { flexGrow: 1 },
    bleed: {
      position: "absolute",
      top: -600,
      left: 0,
      right: 0,
      height: 600,
      backgroundColor: colors.background,
    },
    hero: {
      paddingHorizontal: theme.space.lg,
      paddingBottom: theme.space.xl + SHEET_OVERLAP,
      gap: theme.space.lg,
    },
    stub: { height: SHEET_OVERLAP + theme.space.sm },
    sheet: {
      flexGrow: 1,
      marginTop: -SHEET_OVERLAP,
      borderTopLeftRadius: SHEET_RADIUS,
      borderTopRightRadius: SHEET_RADIUS,
      backgroundColor: colors.sheet,
      paddingHorizontal: theme.space.lg,
      paddingTop: theme.space.xl,
      gap: theme.space.lg,
    },
  });
