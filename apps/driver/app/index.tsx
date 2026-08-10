import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useHydrated, useSession } from "@/features/auth/store";
import { theme } from "@/theme";

/**
 * Porta de entrada.
 *
 * Espera o keychain responder antes de decidir — mandar para o login e voltar
 * meio segundo depois é a diferença entre "abriu logado" e "me deslogou de novo".
 * Guarda de rota aqui é conveniência: a autorização real é do backend (regra 10).
 */
export default function Index() {
  const hydrated = useHydrated();
  const session = useSession();

  if (!hydrated) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  return <Redirect href={session ? "/(tabs)" : "/login"} />;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },
});
