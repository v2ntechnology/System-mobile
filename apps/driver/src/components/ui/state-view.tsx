import { ActivityIndicator, StyleSheet, View } from "react-native";

import { theme } from "@/theme";

import { Button } from "./button";
import { Text } from "./text";

interface Props {
  loading?: boolean;
  error?: unknown;
  onRetry?: () => void;
  /** Vazio legítimo — sem viagem, sem abastecimento. Não é erro. */
  empty?: string;
}

/**
 * Carregando / erro / vazio numa peça só.
 *
 * O erro do mock já chega no formato RFC 9457 (`ApiError`), então o texto vem
 * do `detail` do servidor quando existe — mensagem genérica é a exceção, não a
 * regra, e em campo o motorista precisa saber se tenta de novo ou liga.
 */
export function StateView({ loading, error, onRetry, empty }: Props) {
  if (loading) {
    return (
      <View style={styles.box}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    const detail = error instanceof Error ? error.message : "Não foi possível carregar os dados.";
    return (
      <View style={styles.box}>
        <Text tone="error" style={styles.center}>
          {detail}
        </Text>
        {onRetry ? <Button label="Tentar de novo" variant="ghost" onPress={onRetry} /> : null}
      </View>
    );
  }

  if (empty) {
    return (
      <View style={styles.box}>
        <Text tone="muted" style={styles.center}>
          {empty}
        </Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  box: {
    alignItems: "center",
    justifyContent: "center",
    gap: theme.space.lg,
    paddingVertical: theme.space["2xl"],
  },
  center: { textAlign: "center" },
});
