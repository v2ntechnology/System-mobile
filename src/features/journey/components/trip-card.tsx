import type { Trip } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { Card, Chip, Text } from "@/components/ui";
import { formatDayMonth, formatKm, formatRelative, formatTime } from "@/lib/format";
import { TRIP_STATUS } from "@/lib/trip-status";
import { theme, useColors, useThemedStyles, type Scheme } from "@/theme";

import { RouteLine } from "./route-line";

interface Props {
  trip: Trip;
  /** Destaque da viagem corrente: barra de progresso e prazo em evidência. */
  featured?: boolean;
}

export function TripCard({ trip, featured = false }: Props) {
  const colors = useColors();
  const styles = useThemedStyles(makeStyles);
  const status = TRIP_STATUS[trip.status];
  const late = new Date(trip.dueAt).getTime() < Date.now() && trip.status !== "CONCLUIDA";
  const deadline =
    trip.status === "PLANEJADA"
      ? `${formatDayMonth(trip.startedAt)} ${formatTime(trip.startedAt)}`
      : `prazo ${formatRelative(trip.dueAt)}`;

  return (
    <Link href={{ pathname: "/trip/[id]", params: { id: trip.id } }} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Viagem ${trip.code}, ${trip.origin} para ${trip.destination}, ${status.label}`}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <Card style={styles.card}>
          <View style={styles.head}>
            <Text variant="labelSm" tone="muted" tabular>
              {trip.code} · {trip.plate}
            </Text>
            <Chip label={status.label} tone={status.tone} />
          </View>

          <RouteLine
            origin={trip.origin}
            destination={trip.destination}
            destinationNote={trip.cargo}
            emphasis={featured}
          />

          {featured ? (
            <View style={styles.progress}>
              <View
                style={styles.progressTrack}
                accessibilityLabel={`${trip.progressPercent}% do percurso`}
              >
                <View style={[styles.progressFill, { width: `${trip.progressPercent}%` }]} />
              </View>
              <Text variant="labelSm" tone="variant" tabular>
                {trip.progressPercent}%
              </Text>
            </View>
          ) : null}

          <View style={styles.foot}>
            <View style={styles.footItem}>
              <Ionicons name="navigate-outline" size={14} color={colors.onSurfaceMuted} />
              <Text variant="labelMd" tone="variant" tabular>
                {formatKm(trip.distanceKm)}
              </Text>
            </View>

            <View style={styles.footItem}>
              {/* Atraso não pode ser só cor — vem com a palavra, para daltônico e para sol forte. */}
              <Ionicons
                name={late ? "alert-circle" : "time-outline"}
                size={14}
                color={late ? colors.error : colors.onSurfaceMuted}
              />
              <Text variant="labelMd" tone={late ? "error" : "variant"} tabular>
                {late ? "atrasada · " : ""}
                {deadline}
              </Text>
            </View>
          </View>
        </Card>
      </Pressable>
    </Link>
  );
}

const makeStyles = (colors: Scheme) =>
  StyleSheet.create({
    card: { gap: theme.space.md },
    pressed: { opacity: 0.9 },
    head: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    progress: { flexDirection: "row", alignItems: "center", gap: theme.space.md },
    progressTrack: {
      flex: 1,
      height: 6,
      borderRadius: theme.radius.pill,
      backgroundColor: colors.surfaceSunken,
      overflow: "hidden",
    },
    progressFill: { height: "100%", backgroundColor: colors.accentSolid },
    foot: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.space.sm,
      paddingTop: theme.space.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.outline,
    },
    footItem: { flexDirection: "row", alignItems: "center", gap: theme.space.xs },
  });
