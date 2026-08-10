import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert, StyleSheet, View } from "react-native";

import { Button, Chip, GlassCard, LightCard, Screen, StateView, Text } from "@/components/ui";
import { useAuthStore, useSession } from "@/features/auth/store";
import { getHome } from "@/features/journey/api";
import { getProfile } from "@/features/profile/api";
import { daysUntil, formatDate } from "@/lib/format";
import { theme } from "@/theme";

export default function ProfileScreen() {
  const router = useRouter();
  const session = useSession();
  const clearSession = useAuthStore((state) => state.clearSession);

  const profile = useQuery({ queryKey: ["driver-profile"], queryFn: getProfile });
  const home = useQuery({ queryKey: ["driver-home"], queryFn: getHome });

  function confirmLogout() {
    Alert.alert("Sair da conta", "Você vai precisar entrar de novo para registrar a jornada.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => {
          clearSession();
          router.replace("/login");
        },
      },
    ]);
  }

  if (profile.isPending || profile.isError) {
    return (
      <Screen scroll={false}>
        <StateView
          loading={profile.isPending}
          error={profile.error}
          onRetry={() => void profile.refetch()}
        />
      </Screen>
    );
  }

  const data = profile.data;
  const driver = home.data?.driver;
  const cnhDays = daysUntil(data.cnhExpiresAt);

  return (
    <Screen refreshing={profile.isFetching} onRefresh={() => void profile.refetch()}>
      <View style={styles.header}>
        <Text variant="headlineMd">{session?.user.name}</Text>
        <Text tone="variant">
          {data.role} · {session?.tenant.name}
        </Text>
      </View>

      {/* Score é o número que o motorista mais procura — painel claro, como no dashboard. */}
      <LightCard style={styles.score}>
        <Text variant="labelMd" tone="onLightMuted">
          SCORE DE SEGURANÇA
        </Text>
        <View style={styles.scoreRow}>
          <Text variant="displayLg" tone="onLight" tabular>
            {driver?.score ?? "—"}
          </Text>
          {driver ? (
            <Chip
              label={`${driver.scoreDelta >= 0 ? "+" : ""}${driver.scoreDelta} no mês`}
              tone={driver.scoreDelta >= 0 ? "positive" : "critical"}
              onLight
            />
          ) : null}
        </View>
        <Text variant="labelMd" tone="onLightVariant" tabular>
          {data.onTimeDeliveryRate}% no prazo · {data.avgFuelEfficiency.toLocaleString("pt-BR")}{" "}
          km/l médio · {data.hoursDriven} h dirigidas
        </Text>
      </LightCard>

      <GlassCard style={styles.block}>
        <Text variant="labelMd" tone="muted">
          HABILITAÇÃO
        </Text>
        <Row label="Categoria" value={`${data.cnhCategory}${data.cnhEar ? " · EAR" : ""}`} />
        <Row label="Número" value={data.cnhNumber} />
        <Row
          label="Validade"
          value={`${formatDate(data.cnhExpiresAt)} (${cnhDays} dias)`}
          tone={cnhDays <= 60 ? "warning" : undefined}
        />
        <Row label="Pontos" value={`${data.cnhPoints} de 40`} />
      </GlassCard>

      <GlassCard style={styles.block}>
        <Text variant="labelMd" tone="muted">
          CONTRATO
        </Text>
        <Row label="Admissão" value={formatDate(data.hiredAt)} />
        <Row label="Vínculo" value={data.contractType} />
        <Row label="Telefone" value={data.phone} />
        <Row label="Cidade" value={`${data.city}/${data.state}`} />
      </GlassCard>

      <GlassCard style={styles.block}>
        <Text variant="labelMd" tone="muted">
          EVENTOS DO PERÍODO
        </Text>
        {data.roadEvents.length > 0 ? (
          data.roadEvents.map((event) => (
            <Row
              key={event.type}
              label={event.label}
              value={`${event.count} (${event.delta > 0 ? "+" : ""}${event.delta})`}
            />
          ))
        ) : (
          <Text tone="variant">Nenhum evento registrado. Continue assim.</Text>
        )}
      </GlassCard>

      <Button label="Sair da conta" variant="ghost" onPress={confirmLogout} />
    </Screen>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "warning" }) {
  return (
    <View style={styles.row}>
      <Text variant="labelMd" tone="muted">
        {label}
      </Text>
      <Text variant="labelMd" tone={tone ?? "default"} tabular>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { gap: theme.space.xs },
  score: { gap: theme.space.sm },
  scoreRow: { flexDirection: "row", alignItems: "center", gap: theme.space.md },
  block: { gap: theme.space.md },
  row: { flexDirection: "row", justifyContent: "space-between", gap: theme.space.lg },
});
