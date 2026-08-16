import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { FlatList, StyleSheet } from "react-native";

import { FilterPills, HeroBar, SheetScreen, StateView } from "@/components/ui";
import { getTrips } from "@/features/journey/api";
import { TripCard } from "@/features/journey/components/trip-card";
import { theme } from "@/theme";
import type { Trip } from "@/types";

const FILTERS = [
  { id: "ATIVAS", label: "Ativas" },
  { id: "PROXIMAS", label: "Próximas" },
  { id: "CONCLUIDAS", label: "Concluídas" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

const MATCHES: Record<FilterId, (trip: Trip) => boolean> = {
  ATIVAS: (trip) => trip.status !== "PLANEJADA" && trip.status !== "CONCLUIDA",
  PROXIMAS: (trip) => trip.status === "PLANEJADA",
  CONCLUIDAS: (trip) => trip.status === "CONCLUIDA",
};

const EMPTY: Record<FilterId, { title: string; hint: string }> = {
  ATIVAS: {
    title: "Nenhuma viagem rodando",
    hint: "O que a operação liberar para você aparece em Próximas.",
  },
  PROXIMAS: {
    title: "Nada programado",
    hint: "Viagens novas chegam aqui antes da data de carregamento.",
  },
  CONCLUIDAS: {
    title: "Nenhuma viagem concluída",
    hint: "O histórico começa quando você fechar a primeira descarga.",
  },
};

export default function TripsScreen() {
  const [filter, setFilter] = useState<FilterId>("ATIVAS");
  const trips = useQuery({ queryKey: ["driver-trips"], queryFn: getTrips });

  const all = useMemo(() => trips.data ?? [], [trips.data]);
  const visible = useMemo(() => all.filter(MATCHES[filter]), [all, filter]);
  const options = useMemo(
    () => FILTERS.map((entry) => ({ ...entry, count: all.filter(MATCHES[entry.id]).length })),
    [all],
  );

  return (
    <SheetScreen
      scroll={false}
      insetBottom={false}
      hero={
        <HeroBar
          title="Viagens"
          subtitle={all.length > 0 ? `${all.length} no período` : undefined}
        />
      }
    >
      <FilterPills options={options} value={filter} onChange={setFilter} />

      {/* Lista virtualizada: a viagem antiga do motorista acumula, e blur por item derruba o FPS. */}
      <FlatList
        data={visible}
        keyExtractor={(trip) => trip.id}
        renderItem={({ item }) => <TripCard trip={item} />}
        style={styles.flex}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshing={trips.isFetching}
        onRefresh={() => void trips.refetch()}
        ListEmptyComponent={
          <StateView
            loading={trips.isPending}
            error={trips.error}
            onRetry={() => void trips.refetch()}
            empty={trips.isSuccess ? EMPTY[filter].title : undefined}
            emptyHint={trips.isSuccess ? EMPTY[filter].hint : undefined}
            skeleton
          />
        }
      />
    </SheetScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { gap: theme.space.md, paddingBottom: theme.space.lg },
});
