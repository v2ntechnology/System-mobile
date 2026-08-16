import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Alert, StyleSheet, View } from "react-native";

import { Button, Card, Chip, SectionHeader, SheetScreen, StateView, Text } from "@/components/ui";
import { advanceTrip, getTrip } from "@/features/journey/api";
import { RouteLine } from "@/features/journey/components/route-line";
import { formatDayMonth, formatKm, formatRelative, formatTime } from "@/lib/format";
import { TRIP_STATUS } from "@/lib/trip-status";
import { theme, useThemedStyles, type Scheme } from "@/theme";

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const styles = useThemedStyles(makeStyles);

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
      <SheetScreen scroll={false}>
        <StateView
          loading={trip.isPending}
          error={trip.error}
          onRetry={() => void trip.refetch()}
          skeleton
        />
      </SheetScreen>
    );
  }

  const data = trip.data;
  const status = TRIP_STATUS[data.status];
  const events = [...data.timeline].reverse();

  return (
    <SheetScreen refreshing={trip.isFetching} onRefresh={() => void trip.refetch()}>
      <Card style={styles.head}>
        <View style={styles.headTop}>
          <Text variant="labelSm" tone="muted" tabular>
            {data.code} · {data.plate}
          </Text>
          <Chip label={status.label} tone={status.tone} />
        </View>

        <RouteLine
          origin={data.origin}
          destination={data.destination}
          destinationNote={data.cargo}
          emphasis
        />

        <View style={styles.facts}>
          <Fact label="Distância" value={formatKm(data.distanceKm)} />
          <Fact label="Percorrido" value={`${data.progressPercent}%`} />
          <Fact label="Prazo" value={formatRelative(data.dueAt)} />
        </View>

        <Text variant="labelSm" tone="muted" tabular>
          Entrega até {formatDayMonth(data.dueAt)} às {formatTime(data.dueAt)}
        </Text>
      </Card>

      {status.action ? (
        <Button
          label={status.action}
          loading={advance.isPending}
          onPress={() => advance.mutate()}
        />
      ) : null}

      <View style={styles.section}>
        <SectionHeader title="Histórico" description="O evento mais recente vem primeiro." />
        <Card>
          {events.map((event, index) => (
            <View key={`${event.status}-${event.at}`} style={styles.event}>
              <View style={styles.rail}>
                <View style={[styles.dot, index === 0 && styles.dotCurrent]} />
                {index < events.length - 1 ? <View style={styles.track} /> : null}
              </View>

              <View style={[styles.eventBody, index === events.length - 1 && styles.eventLast]}>
                <View style={styles.eventHead}>
                  <Text
                    variant="labelMd"
                    tone={index === 0 ? "default" : "variant"}
                    style={index === 0 ? styles.current : undefined}
                  >
                    {TRIP_STATUS[event.status].label}
                  </Text>
                  <Text variant="labelSm" tone="muted" tabular>
                    {formatDayMonth(event.at)} {formatTime(event.at)}
                  </Text>
                </View>
                {event.note ? (
                  <Text variant="labelSm" tone="muted">
                    {event.note}
                  </Text>
                ) : null}
              </View>
            </View>
          ))}
        </Card>
      </View>
    </SheetScreen>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={factStyles.root}>
      <Text variant="overline" tone="muted">
        {label}
      </Text>
      <Text variant="metricMd">{value}</Text>
    </View>
  );
}

const factStyles = StyleSheet.create({ root: { gap: 2 } });

const makeStyles = (colors: Scheme) =>
  StyleSheet.create({
    head: { gap: theme.space.md },
    headTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    facts: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: theme.space.md,
      paddingTop: theme.space.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.outline,
    },
    section: { gap: theme.space.md },
    event: { flexDirection: "row", gap: theme.space.md },
    rail: { alignItems: "center", width: 10 },
    dot: {
      width: 10,
      height: 10,
      marginTop: 5,
      borderRadius: 5,
      borderWidth: 2,
      borderColor: colors.onSurfaceMuted,
      backgroundColor: colors.surface,
    },
    dotCurrent: { borderColor: colors.accent, backgroundColor: colors.accent },
    track: { flex: 1, width: 2, marginVertical: 3, backgroundColor: colors.outlineStrong },
    eventBody: { flex: 1, gap: 2, paddingBottom: theme.space.lg },
    eventLast: { paddingBottom: 0 },
    eventHead: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.space.md,
    },
    current: { fontFamily: theme.fonts.semibold },
  });
