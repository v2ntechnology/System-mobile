import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { Pressable, StyleSheet, View } from "react-native";

import { Button, Card, Chip, Text } from "@/components/ui";
import { formatKm, formatRelative } from "@/lib/format";
import { TRIP_STATUS } from "@/lib/trip-status";
import { HIT_TARGET, theme, useColors, useThemedStyles, type Scheme } from "@/theme";
import type { DriverRouteSnapshot, Trip } from "@/types";

import { RouteLine } from "./route-line";
import { RouteMapCanvas } from "./route-map-canvas";

interface Props {
  trip: Trip;
  route: DriverRouteSnapshot;
  onOpenTrip: () => void;
}

function formatEta(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder > 0 ? `${hours} h ${remainder} min` : `${hours} h`;
}

export function RouteMapCard({ trip, route, onOpenTrip }: Props) {
  const colors = useColors();
  const styles = useThemedStyles(makeStyles);
  const status = TRIP_STATUS[trip.status];

  function openNavigation() {
    const origin = `${route.currentPosition.latitude},${route.currentPosition.longitude}`;
    const destination = `${route.destination.latitude},${route.destination.longitude}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    void Linking.openURL(url);
  }

  return (
    <Card style={styles.card}>
      <Pressable
        accessibilityLabel={`Abrir detalhes da viagem ${trip.code}`}
        accessibilityRole="button"
        onPress={onOpenTrip}
        style={({ pressed }) => [styles.header, pressed && styles.pressed]}
      >
        <View style={styles.headerCopy}>
          <Text variant="overline" tone="muted" tabular>
            Em rota agora · {trip.code}
          </Text>
          <Text variant="labelMd" tone="variant" tabular>
            {trip.plate} · atualizado {formatRelative(route.updatedAt)}
          </Text>
        </View>
        <Chip label={status.label} tone={status.tone} />
        <Ionicons color={colors.onSurfaceMuted} name="chevron-forward" size={18} />
      </Pressable>

      <View style={styles.mapFrame}>
        <RouteMapCanvas route={route} height={198} />

        <View style={styles.speedPill}>
          <Ionicons color={colors.onSurface} name="speedometer-outline" size={15} />
          <Text variant="labelSm" tabular>
            {route.speedKph} km/h
          </Text>
        </View>

        <View style={styles.etaPill}>
          <Text variant="overline" tone="muted">
            Chegada
          </Text>
          <Text variant="labelMd" tabular>
            {formatEta(route.etaMinutes)}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <RouteLine
          destination={trip.destination}
          destinationNote={`${formatKm(trip.distanceKm)} · prazo ${formatRelative(trip.dueAt)}`}
          origin={trip.origin}
          originNote="origem concluída"
        />

        <View style={styles.progressRow}>
          <View
            accessibilityLabel={`${trip.progressPercent}% do percurso concluído`}
            style={styles.progressTrack}
          >
            <View style={[styles.progressFill, { width: `${trip.progressPercent}%` }]} />
          </View>
          <Text variant="labelMd" tone="variant" tabular>
            {trip.progressPercent}%
          </Text>
        </View>

        <Button
          icon={<Ionicons color={colors.onAccentSolid} name="navigate-outline" size={19} />}
          label="Abrir rota"
          onPress={openNavigation}
          shape="pill"
        />
      </View>
    </Card>
  );
}

const makeStyles = (colors: Scheme) =>
  StyleSheet.create({
    card: { overflow: "hidden", padding: 0 },
    header: {
      minHeight: HIT_TARGET + theme.space.sm,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.space.sm,
      paddingHorizontal: theme.space.lg,
      paddingVertical: theme.space.md,
    },
    headerCopy: { flex: 1, gap: 2 },
    pressed: { backgroundColor: colors.surfaceSunken },
    mapFrame: {
      position: "relative",
      borderTopWidth: StyleSheet.hairlineWidth,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: colors.outline,
    },
    speedPill: {
      position: "absolute",
      top: theme.space.md,
      left: theme.space.md,
      minHeight: 34,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.space.xs,
      paddingHorizontal: theme.space.sm,
      borderRadius: theme.radius.pill,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.outlineStrong,
      backgroundColor: colors.surface,
    },
    etaPill: {
      position: "absolute",
      right: theme.space.md,
      bottom: theme.space.md,
      alignItems: "flex-end",
      paddingHorizontal: theme.space.md,
      paddingVertical: theme.space.sm,
      borderRadius: theme.radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.outlineStrong,
      backgroundColor: colors.surface,
    },
    body: { gap: theme.space.lg, padding: theme.space.lg },
    progressRow: { flexDirection: "row", alignItems: "center", gap: theme.space.md },
    progressTrack: {
      flex: 1,
      height: 7,
      overflow: "hidden",
      borderRadius: theme.radius.pill,
      backgroundColor: colors.surfaceSunken,
    },
    progressFill: { height: "100%", backgroundColor: colors.secondary },
  });
