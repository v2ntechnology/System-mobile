import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

import { theme } from "@/theme";

/**
 * Versão nativa do `<AuroraBackdrop />` do painel: grafite com a aurora indigo
 * subindo do rodapé. Sem o grão do web — o banding que ele corrige aparece em
 * radial grande de tela larga, e aqui o gradiente é vertical e curto.
 */
export function AuroraBackdrop() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[StyleSheet.absoluteFill, styles.base]} />
      <LinearGradient
        colors={["transparent", "rgba(99,102,241,0.28)", "rgba(6,182,212,0.16)"]}
        locations={[0.45, 0.85, 1]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: theme.colors.background },
});
