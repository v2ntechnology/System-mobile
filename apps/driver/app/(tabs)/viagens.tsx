import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { StateView, Text } from "@/components/ui";
import { getTrips } from "@/features/journey/api";
import { TripCard } from "@/features/journey/components/trip-card";
import { theme } from "@/theme";

const FILTERS = [
  { id: "ATIVAS", label: "Ativas" },
  { id: "PROXIMAS", label: "Próximas" },
  { id: "CONCLUIDAS", label: "Concluídas" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

export default function TripsScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<FilterId>("ATIVAS");
  const trips = useQuery({ queryKey: ["driver-trips"], queryFn: getTrips });

  const visible = useMemo(() => {
    const all = trips.data ?? [];
    if (filter === "PROXIMAS") return all.filter((trip) => trip.status === "PLANEJADA");
    if (filter === "CONCLUIDAS") return all.filter((trip) => trip.status === "CONCLUIDA");
    return all.filter((trip) => trip.status !== "PLANEJADA" && trip.status !== "CONCLUIDA");
  }, [trips.data, filter]);

  return (
    <View style={styles.root}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        {FILTERS.map((entry) => {
          const active = entry.id === filter;
          return (
            <Pressable
              key={entry.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => setFilter(entry.id)}
              style={[styles.pill, active && styles.pillActive]}
            >
              <Text variant="labelMd" tone={active ? "onPrimary" : "variant"}>
                {entry.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Lista virtualizada: a viagem antiga do motorista acumula, e regra 6 proíbe blur por item. */}
      <FlatList
        data={visible}
        keyExtractor={(trip) => trip.id}
        renderItem={({ item }) => <TripCard trip={item} />}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + theme.space["2xl"] }]}
        refreshing={trips.isFetching}
        onRefresh={() => void trips.refetch()}
        ListEmptyComponent={
          <StateView
            loading={trips.isPending}
            error={trips.error}
            onRetry={() => void trips.refetch()}
            empty={trips.isSuccess ? "Nenhuma viagem neste filtro." : undefined}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  filters: {
    gap: theme.space.sm,
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.md,
  },
  pill: {
    borderRadius: theme.radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.outlineVariant,
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.sm,
  },
  /* Pill ativa carrega texto branco — por isso `primaryStrong` e não `primary`. */
  pillActive: {
    backgroundColor: theme.colors.primaryStrong,
    borderColor: theme.colors.primaryStrong,
  },
  list: { padding: theme.space.lg, gap: theme.space.md },
});
