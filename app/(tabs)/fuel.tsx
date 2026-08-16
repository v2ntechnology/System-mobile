import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { Card, HeroBar, SectionHeader, SheetScreen, StateView, Text } from "@/components/ui";
import { getFuelHistory } from "@/features/fuel/api";
import { getHome } from "@/features/journey/api";
import { formatCurrency, formatDayMonth } from "@/lib/format";
import { theme, useColors, useThemedStyles, type Scheme } from "@/theme";

export default function FuelScreen() {
  const router = useRouter();
  const colors = useColors();
  const styles = useThemedStyles(makeStyles);

  const home = useQuery({ queryKey: ["driver-home"], queryFn: getHome });
  const history = useQuery({ queryKey: ["driver-fuel"], queryFn: getFuelHistory });

  const plate = home.data?.driver.currentVehiclePlate ?? "—";
  const odometer = home.data ? `${home.data.lastOdometerKm.toLocaleString("pt-BR")} km` : "—";

  return (
    <View style={styles.root}>
      <SheetScreen
        insetBottom={false}
        refreshing={history.isFetching}
        onRefresh={() => void history.refetch()}
        hero={<HeroBar title="Abastecer" subtitle={`${plate} · odômetro ${odometer}`} />}
      >
        <SectionHeader
          title="Últimos abastecimentos"
          count={history.data?.length ? String(history.data.length) : undefined}
        />

        {history.data?.length ? (
          history.data.map((entry) => (
            <Card key={entry.id} style={styles.row}>
              <View style={styles.rowHead}>
                <Text variant="titleMd" numberOfLines={1} style={styles.station}>
                  {entry.station}
                </Text>
                <Text variant="labelSm" tone="muted" tabular>
                  {formatDayMonth(entry.at)}
                </Text>
              </View>

              <View style={styles.figures}>
                <Figure label="Litros" value={entry.liters.toLocaleString("pt-BR")} />
                <Figure label="Total" value={formatCurrency(entry.total)} />
                <Figure label="km/l" value={entry.efficiency.toLocaleString("pt-BR")} />
              </View>

              {entry.anomaly ? (
                <View style={styles.anomaly}>
                  <Ionicons name="alert-circle" size={16} color={colors.warning} />
                  <Text variant="labelSm" tone="variant" style={styles.anomalyText}>
                    {entry.anomaly}
                  </Text>
                </View>
              ) : null}
            </Card>
          ))
        ) : (
          <StateView
            loading={history.isPending}
            error={history.error}
            onRetry={() => void history.refetch()}
            empty={history.isSuccess ? "Nenhum abastecimento registrado" : undefined}
            emptyHint={
              history.isSuccess
                ? "Toque no + para registrar o primeiro e apurar o km/l do veículo."
                : undefined
            }
            skeleton
          />
        )}
      </SheetScreen>

      {/* Registrar é a ação da tela, não um card dentro dela: fica flutuando, ao
          alcance do polegar, com a lista rolando por baixo. */}
      <Pressable
        accessibilityLabel="Registrar abastecimento"
        accessibilityRole="button"
        onPress={() => router.push("/fuel-entry")}
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
      >
        <Ionicons name="add" size={30} color={colors.onAccentSolid} />
      </Pressable>
    </View>
  );
}

/** Litros, total e km/l lado a lado: é assim que o motorista confere a nota. */
function Figure({ label, value }: { label: string; value: string }) {
  return (
    <View style={figureStyles.root}>
      <Text variant="overline" tone="muted">
        {label}
      </Text>
      <Text variant="metricMd">{value}</Text>
    </View>
  );
}

const figureStyles = StyleSheet.create({ root: { gap: 2 } });

const makeStyles = (colors: Scheme) =>
  StyleSheet.create({
    root: { flex: 1 },
    row: { gap: theme.space.md },
    rowHead: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.space.sm,
    },
    station: { flex: 1 },
    figures: { flexDirection: "row", gap: theme.space.lg },
    anomaly: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: theme.space.sm,
      paddingTop: theme.space.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.outline,
    },
    anomalyText: { flex: 1 },
    fab: {
      position: "absolute",
      right: theme.space.lg,
      bottom: theme.space.lg,
      width: 60,
      height: 60,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: theme.radius.pill,
      backgroundColor: colors.accentSolid,
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.28,
      shadowRadius: 12,
      elevation: 6,
    },
    fabPressed: { opacity: 0.9, transform: [{ scale: 0.96 }] },
  });
