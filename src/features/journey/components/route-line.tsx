import { StyleSheet, View } from "react-native";

import { Text } from "@/components/ui";
import { theme, useThemedStyles, type Scheme } from "@/theme";

interface Props {
  origin: string;
  destination: string;
  /** Nota da origem: horário de saída, doca, quem carrega. */
  originNote?: string;
  /** Nota do destino: prazo, distância, quem recebe. */
  destinationNote?: string;
  /** Peso maior no destino quando a viagem é a que está rodando agora. */
  emphasis?: boolean;
}

/**
 * A viagem desenhada como ela é: dois pontos e o trecho entre eles.
 *
 * O ponto de origem é vazado (já passou) e o de destino é cheio (é para onde se
 * vai) — a leitura funciona antes de qualquer texto ser lido, que é o que se
 * pede de uma tela conferida de relance no pátio.
 */
export function RouteLine({
  origin,
  destination,
  originNote,
  destinationNote,
  emphasis = false,
}: Props) {
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.root}>
      <View style={styles.rail}>
        <View style={styles.dotOrigin} />
        <View style={styles.track} />
        <View style={styles.dotDestination} />
      </View>

      <View style={styles.stops}>
        <View style={styles.stop}>
          <Text variant="labelMd" tone="variant" numberOfLines={1}>
            {origin}
          </Text>
          {originNote ? (
            <Text variant="labelSm" tone="muted" numberOfLines={1} tabular>
              {originNote}
            </Text>
          ) : null}
        </View>

        <View style={styles.stop}>
          <Text variant={emphasis ? "headlineMd" : "titleMd"} numberOfLines={1}>
            {destination}
          </Text>
          {destinationNote ? (
            <Text variant="labelSm" tone="muted" numberOfLines={1} tabular>
              {destinationNote}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const makeStyles = (colors: Scheme) =>
  StyleSheet.create({
    root: { flexDirection: "row", gap: theme.space.md },
    rail: { alignItems: "center", paddingTop: 5 },
    dotOrigin: {
      width: 10,
      height: 10,
      borderRadius: 5,
      borderWidth: 2,
      borderColor: colors.onSurfaceMuted,
      backgroundColor: colors.surface,
    },
    track: {
      flex: 1,
      width: 2,
      minHeight: 22,
      marginVertical: 3,
      borderRadius: 1,
      backgroundColor: colors.outlineStrong,
    },
    dotDestination: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accent },
    stops: { flex: 1, gap: theme.space.md },
    stop: { gap: 1 },
  });
