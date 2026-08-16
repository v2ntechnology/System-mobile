import { ActivityIndicator, StyleSheet, View } from "react-native";

import { RookhubMark } from "@/components/brand/rookhub-mark";
import { theme, useColors } from "@/theme";

/**
 * O que fica na tela enquanto o app termina de subir.
 *
 * O splash do sistema é uma imagem parada: no recarregar do Expo, ou numa rede
 * de pátio, ela fica encarando o motorista sem dizer se ainda está viva. Aqui a
 * marca continua, mas com um indicador girando — a mesma tela no Android, no iOS
 * e no preview.
 *
 * Sem texto de propósito: esta tela aparece antes de a Inter estar em memória, e
 * qualquer palavra aqui refluiria assim que a fonte trocasse.
 */
export function BootScreen() {
  const colors = useColors();

  return (
    <View
      accessibilityLabel="Carregando o RookHub"
      accessibilityRole="progressbar"
      style={[styles.root, { backgroundColor: colors.background }]}
    >
      <RookhubMark height={72} color={colors.onSurface} />
      <ActivityIndicator color={colors.accent} size="small" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.space["2xl"],
  },
});
