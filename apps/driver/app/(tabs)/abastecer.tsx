import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type ComponentProps } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, View } from "react-native";

import { Button, Chip, Field, GlassCard, Screen, StateView, Text } from "@/components/ui";
import { createFueling, getFuelHistory } from "@/features/fuel/api";
import { fuelSchema, parseFuel, type FuelValues } from "@/features/fuel/schema";
import { getHome } from "@/features/journey/api";
import { formatCurrency, formatDayMonth } from "@/lib/format";
import { theme } from "@/theme";

export default function FuelScreen() {
  const queryClient = useQueryClient();
  const [receipt, setReceipt] = useState<string | null>(null);

  const home = useQuery({ queryKey: ["driver-home"], queryFn: getHome });
  const history = useQuery({ queryKey: ["driver-fuel"], queryFn: getFuelHistory });

  const { control, handleSubmit, formState, reset } = useForm<FuelValues>({
    resolver: zodResolver(fuelSchema),
    defaultValues: { station: "", liters: "", pricePerLiter: "", odometerKm: "" },
  });

  const create = useMutation({
    mutationFn: (values: FuelValues) =>
      createFueling({
        ...parseFuel(values),
        plate: home.data?.driver.currentVehiclePlate ?? "",
        tripId: home.data?.currentTrip?.id,
        at: new Date().toISOString(),
      }),
    onSuccess: (result) => {
      reset();
      setReceipt(
        `${formatCurrency(result.total)} · ${result.efficiency.toLocaleString("pt-BR")} km/l` +
          (result.anomaly ? `\n${result.anomaly}` : ""),
      );
      void queryClient.invalidateQueries({ queryKey: ["driver-fuel"] });
      void queryClient.invalidateQueries({ queryKey: ["driver-home"] });
    },
    onError: (error: Error) => Alert.alert("Não deu para registrar", error.message),
  });

  return (
    <Screen>
      <GlassCard style={styles.form}>
        <Text variant="headlineMd">Registrar abastecimento</Text>
        <Text tone="variant">
          Veículo {home.data?.driver.currentVehiclePlate ?? "—"} · último odômetro{" "}
          <Text tone="variant" tabular>
            {home.data ? home.data.lastOdometerKm.toLocaleString("pt-BR") : "—"} km
          </Text>
        </Text>

        <Controller
          control={control}
          name="station"
          render={({ field }) => (
            <FuelField
              label="Posto"
              placeholder="Posto Shell — BR-040 km 32"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={formState.errors.station?.message}
            />
          )}
        />

        <View style={styles.pair}>
          <Controller
            control={control}
            name="liters"
            render={({ field }) => (
              <FuelField
                label="Litros"
                placeholder="318"
                keyboardType="decimal-pad"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={formState.errors.liters?.message}
                grow
              />
            )}
          />
          <Controller
            control={control}
            name="pricePerLiter"
            render={({ field }) => (
              <FuelField
                label="R$/litro"
                placeholder="6,09"
                keyboardType="decimal-pad"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={formState.errors.pricePerLiter?.message}
                grow
              />
            )}
          />
        </View>

        <Controller
          control={control}
          name="odometerKm"
          render={({ field }) => (
            <FuelField
              label="Odômetro (km)"
              placeholder="413200"
              keyboardType="number-pad"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={formState.errors.odometerKm?.message}
            />
          )}
        />

        <Button
          label="Registrar"
          loading={create.isPending}
          onPress={handleSubmit((values) => create.mutate(values))}
        />

        {receipt ? (
          <View style={styles.receipt}>
            <Chip label="Registrado" tone="positive" />
            <Text tone="variant">{receipt}</Text>
          </View>
        ) : null}
      </GlassCard>

      <View style={styles.section}>
        <Text variant="labelMd" tone="muted">
          ÚLTIMOS ABASTECIMENTOS
        </Text>
        {history.data?.length ? (
          history.data.map((entry) => (
            <GlassCard key={entry.id} style={styles.row}>
              <View style={styles.rowHead}>
                <Text variant="bodyMd">{entry.station}</Text>
                <Text variant="labelMd" tone="variant" tabular>
                  {formatDayMonth(entry.at)}
                </Text>
              </View>
              <Text variant="labelMd" tone="variant" tabular>
                {entry.liters.toLocaleString("pt-BR")} L · {formatCurrency(entry.total)} ·{" "}
                {entry.efficiency.toLocaleString("pt-BR")} km/l
              </Text>
              {entry.anomaly ? (
                <Text variant="labelSm" tone="warning">
                  {entry.anomaly}
                </Text>
              ) : null}
            </GlassCard>
          ))
        ) : (
          <StateView
            loading={history.isPending}
            error={history.error}
            onRetry={() => void history.refetch()}
            empty={history.isSuccess ? "Nenhum abastecimento registrado." : undefined}
          />
        )}
      </View>
    </Screen>
  );
}

/* Só para não repetir o `flex: 1` do par litros/preço em cada campo. */
function FuelField({ grow, ...props }: ComponentProps<typeof Field> & { grow?: boolean }) {
  return <Field {...props} style={grow ? styles.grow : undefined} />;
}

const styles = StyleSheet.create({
  form: { gap: theme.space.lg },
  pair: { flexDirection: "row", gap: theme.space.md },
  grow: { flex: 1 },
  receipt: { gap: theme.space.sm },
  section: { gap: theme.space.md },
  row: { gap: theme.space.xs },
  rowHead: { flexDirection: "row", justifyContent: "space-between", gap: theme.space.sm },
});
