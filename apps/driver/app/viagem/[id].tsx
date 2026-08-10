import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Alert, StyleSheet, View } from "react-native";

import { Button, Chip, GlassCard, LightCard, Screen, StateView, Text } from "@/components/ui";
import { advanceTrip, getTrip } from "@/features/journey/api";
import { formatDayMonth, formatKm, formatRelative, formatTime } from "@/lib/format";
import { TRIP_STATUS } from "@/lib/trip-status";
import { theme } from "@/theme";

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  const trip = useQuery({ queryKey: ["driver-trip", id], queryFn: () => getTrip(id) });

  const advance = useMutation({
    mutationFn: () => advanceTrip(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["driver-trip", id] });
      void queryClient.invalidateQueries({ queryKey: ["driver-home"] });
      void queryClient.invalidateQueries({ queryKey: ["driver-trips"] });
    },
    onError: (error: Error) => Alert.alert("Não deu para avançar", error.message),
  });

  if (trip.isPending || trip.isError) {
    return (
      <Screen scroll={false}>
        <StateView
          loading={trip.isPending}
          error={trip.error}
          onRetry={() => void trip.refetch()}
        />
      </Screen>
    );
  }

  const data = trip.data;
  const status = TRIP_STATUS[data.status];

  return (
    <Screen refreshing={trip.isFetching} onRefresh={() => void trip.refetch()}>
      <LightCard style={styles.head}>
        <View style={styles.headTop}>
          <Text variant="labelMd" tone="onLightMuted" tabular>
            {data.code}
          </Text>
          <Chip label={status.label} tone={status.tone} onLight />
        </View>
        <Text variant="headlineMd" tone="onLight">
          {data.origin} → {data.destination}
        </Text>
        <Text variant="labelMd" tone="onLightVariant" tabular>
          {formatKm(data.distanceKm)} · {data.plate} · {data.cargo}
        </Text>
        <Text variant="labelMd" tone="onLightVariant" tabular>
          Prazo {formatDayMonth(data.dueAt)} {formatTime(data.dueAt)} ({formatRelative(data.dueAt)})
        </Text>
      </LightCard>

      {status.action ? (
        <Button
          label={status.action}
          loading={advance.isPending}
          onPress={() => advance.mutate()}
        />
      ) : null}

      <View style={styles.section}>
        <Text variant="labelMd" tone="muted">
          HISTÓRICO
        </Text>
        {/* Ordem invertida: o que acabou de acontecer é o que interessa primeiro. */}
        {[...data.timeline].reverse().map((event, index) => (
          <GlassCard key={`${event.status}-${event.at}`} style={styles.event}>
            <View style={styles.eventHead}>
              <Text variant="bodyMd" tone={index === 0 ? "default" : "variant"}>
                {TRIP_STATUS[event.status].label}
              </Text>
              <Text variant="labelSm" tone="muted" tabular>
                {formatDayMonth(event.at)} {formatTime(event.at)}
              </Text>
            </View>
            {event.note ? (
              <Text variant="labelMd" tone="variant">
                {event.note}
              </Text>
            ) : null}
          </GlassCard>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { gap: theme.space.sm },
  headTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  section: { gap: theme.space.md },
  event: { gap: theme.space.xs },
  eventHead: { flexDirection: "row", justifyContent: "space-between", gap: theme.space.md },
});
