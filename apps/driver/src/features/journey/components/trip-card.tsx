import type { Trip } from "@rookhub/types";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { Chip, LightCard, Text } from "@/components/ui";
import { formatDayMonth, formatKm, formatRelative, formatTime } from "@/lib/format";
import { TRIP_STATUS } from "@/lib/trip-status";
import { theme } from "@/theme";

interface Props {
  trip: Trip;
  /** Destaque da viagem corrente: barra de progresso e prazo em evidência. */
  featured?: boolean;
}

export function TripCard({ trip, featured = false }: Props) {
  const status = TRIP_STATUS[trip.status];
  const late = new Date(trip.dueAt).getTime() < Date.now() && trip.status !== "CONCLUIDA";

  return (
    <Link href={{ pathname: "/viagem/[id]", params: { id: trip.id } }} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Viagem ${trip.code}, ${trip.origin} para ${trip.destination}, ${status.label}`}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <LightCard style={styles.card}>
          <View style={styles.head}>
            <Text variant="labelMd" tone="onLightMuted" tabular>
              {trip.code}
            </Text>
            <Chip label={status.label} tone={status.tone} onLight />
          </View>

          <View style={styles.route}>
            <Text variant={featured ? "headlineMd" : "bodyLg"} tone="onLight">
              {trip.destination}
            </Text>
            <View style={styles.row}>
              <Ionicons name="navigate-outline" size={14} color={theme.colors.onLightMuted} />
              <Text variant="labelMd" tone="onLightVariant">
                de {trip.origin}
              </Text>
            </View>
          </View>

          {featured ? (
            <View
              style={styles.progressTrack}
              accessibilityLabel={`${trip.progressPercent}% do percurso`}
            >
              <View style={[styles.progressFill, { width: `${trip.progressPercent}%` }]} />
            </View>
          ) : null}

          <View style={styles.foot}>
            <Text variant="labelMd" tone="onLightVariant" tabular>
              {formatKm(trip.distanceKm)} · {trip.plate}
            </Text>
            <Text
              variant="labelMd"
              tone={late ? "onLight" : "onLightVariant"}
              style={late ? styles.late : undefined}
              tabular
            >
              {late ? "atrasada · " : ""}
              {trip.status === "PLANEJADA"
                ? `${formatDayMonth(trip.startedAt)} ${formatTime(trip.startedAt)}`
                : `prazo ${formatRelative(trip.dueAt)}`}
            </Text>
          </View>
        </LightCard>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: { gap: theme.space.md },
  pressed: { opacity: 0.9 },
  head: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  route: { gap: theme.space.xs },
  row: { flexDirection: "row", alignItems: "center", gap: theme.space.xs },
  progressTrack: {
    height: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.lightOutline,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: theme.colors.primaryOnLight },
  foot: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.space.sm,
  },
  /* Atraso não pode ser só cor — vem com a palavra, para daltônico e para sol forte. */
  late: { color: theme.colors.errorOnLight },
});
