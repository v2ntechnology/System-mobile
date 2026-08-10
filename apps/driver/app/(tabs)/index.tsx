import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert, StyleSheet, View } from "react-native";

import { Button, Chip, GlassCard, Screen, StateView, Text } from "@/components/ui";
import { useSession } from "@/features/auth/store";
import { advanceTrip, getHome } from "@/features/journey/api";
import { TripCard } from "@/features/journey/components/trip-card";
import { daysUntil, formatDate, formatKm } from "@/lib/format";
import { TRIP_STATUS } from "@/lib/trip-status";
import { theme } from "@/theme";

export default function HomeScreen() {
  const router = useRouter();
  const session = useSession();
  const queryClient = useQueryClient();

  const home = useQuery({ queryKey: ["driver-home"], queryFn: getHome });

  const advance = useMutation({
    mutationFn: (tripId: string) => advanceTrip(tripId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["driver-home"] });
      void queryClient.invalidateQueries({ queryKey: ["driver-trips"] });
    },
    /* O erro do servidor já vem em linguagem de campo — repassar é melhor que traduzir. */
    onError: (error: Error) => Alert.alert("Não deu para avançar", error.message),
  });

  if (home.isPending || home.isError) {
    return (
      <Screen scroll={false}>
        <StateView
          loading={home.isPending}
          error={home.error}
          onRetry={() => void home.refetch()}
        />
      </Screen>
    );
  }

  const data = home.data;
  const firstName = (session?.user.name ?? data.driver.name).split(" ")[0];
  const cnhDays = daysUntil(data.cnhExpiresAt);
  const action = data.currentTrip ? TRIP_STATUS[data.currentTrip.status].action : undefined;

  return (
    <Screen refreshing={home.isFetching} onRefresh={() => void home.refetch()}>
      <View style={styles.header}>
        <Text variant="headlineMd">Olá, {firstName}</Text>
        <Text tone="variant">
          {data.driver.currentVehiclePlate} · {formatKm(data.driver.kmDriven)} no mês
        </Text>
      </View>

      {/* Bloqueio vem antes de tudo: é o que impede o caminhão de sair (RF-016). */}
      {data.blockedByChecklist ? (
        <GlassCard style={styles.alertCritical}>
          <View style={styles.alertHead}>
            <Ionicons name="warning" size={20} color={theme.colors.error} />
            <Text variant="bodyLg" tone="error">
              Veículo bloqueado
            </Text>
          </View>
          <Text tone="variant">
            O checklist reprovou um item crítico. A manutenção já foi avisada — não saia com o
            veículo até a liberação.
          </Text>
        </GlassCard>
      ) : data.checklistPending ? (
        <GlassCard style={styles.alertAttention}>
          <View style={styles.alertHead}>
            <Ionicons name="clipboard-outline" size={20} color={theme.colors.warning} />
            <Text variant="bodyLg" tone="warning">
              Checklist pendente
            </Text>
          </View>
          <Text tone="variant">Faça o checklist pré-viagem antes de iniciar o carregamento.</Text>
          <Button label="Fazer checklist" onPress={() => router.push("/checklist")} />
        </GlassCard>
      ) : null}

      <View style={styles.section}>
        <Text variant="labelMd" tone="muted">
          VIAGEM ATUAL
        </Text>
        {data.currentTrip ? (
          <>
            <TripCard trip={data.currentTrip} featured />
            {action ? (
              <Button
                label={action}
                loading={advance.isPending}
                onPress={() => advance.mutate(data.currentTrip!.id)}
              />
            ) : null}
          </>
        ) : (
          <GlassCard>
            <Text tone="variant">Nenhuma viagem em andamento.</Text>
          </GlassCard>
        )}
      </View>

      <View style={styles.section}>
        <Text variant="labelMd" tone="muted">
          PRÓXIMAS
        </Text>
        {data.nextTrips.length > 0 ? (
          data.nextTrips.map((trip) => <TripCard key={trip.id} trip={trip} />)
        ) : (
          <GlassCard>
            <Text tone="variant">Nada programado depois desta viagem.</Text>
          </GlassCard>
        )}
      </View>

      {/* 60 dias é a janela em que ainda dá para renovar sem parar de rodar. */}
      {cnhDays <= 60 ? (
        <GlassCard style={styles.alertAttention}>
          <Chip label="CNH" tone="attention" />
          <Text tone="variant">
            Sua CNH vence em {formatDate(data.cnhExpiresAt)} ({cnhDays} dias). Agende a renovação.
          </Text>
        </GlassCard>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: theme.space.xs },
  section: { gap: theme.space.md },
  alertHead: { flexDirection: "row", alignItems: "center", gap: theme.space.sm },
  alertCritical: { gap: theme.space.sm, borderColor: theme.colors.error },
  alertAttention: { gap: theme.space.md, borderColor: theme.colors.warning },
});
