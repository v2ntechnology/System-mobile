import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { type ComponentProps } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, View } from "react-native";

import { Button, Card, Field, SheetScreen, Text } from "@/components/ui";
import { createFueling } from "@/features/fuel/api";
import { fuelSchema, parseFuel, type FuelValues } from "@/features/fuel/schema";
import { getHome } from "@/features/journey/api";
import { formatCurrency } from "@/lib/format";
import { theme } from "@/theme";

/**
 * Registro do abastecimento, em tela própria.
 *
 * Sai da aba porque preencher é tarefa, não painel: o motorista chega aqui com o
 * bico na mão e sai assim que termina. A aba fica com o histórico, que é o que
 * ele consulta.
 */
export default function FuelEntryScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const home = useQuery({ queryKey: ["driver-home"], queryFn: getHome });

  const { control, handleSubmit, formState } = useForm<FuelValues>({
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
      void queryClient.invalidateQueries({ queryKey: ["driver-fuel"] });
      void queryClient.invalidateQueries({ queryKey: ["driver-home"] });
      Alert.alert(
        "Abastecimento registrado",
        `${formatCurrency(result.total)} · ${result.efficiency.toLocaleString("pt-BR")} km/l` +
          (result.anomaly ? `\n\n${result.anomaly}` : ""),
        [{ text: "Entendi", onPress: () => router.back() }],
      );
    },
    onError: (error: Error) => Alert.alert("Não deu para registrar", error.message),
  });

  const plate = home.data?.driver.currentVehiclePlate ?? "—";
  const odometer = home.data ? `${home.data.lastOdometerKm.toLocaleString("pt-BR")} km` : "—";

  return (
    <SheetScreen>
      <Card style={styles.form}>
        <View style={styles.intro}>
          <Text variant="titleMd">Veículo {plate}</Text>
          <Text variant="labelMd" tone="muted" tabular>
            Último odômetro registrado: {odometer}
          </Text>
        </View>

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

        <Text variant="labelSm" tone="muted">
          Os litros e o odômetro definem o km/l apurado deste tanque.
        </Text>
      </Card>

      <Button
        label="Registrar abastecimento"
        loading={create.isPending}
        onPress={handleSubmit((values) => create.mutate(values))}
      />
    </SheetScreen>
  );
}

/* Só para não repetir o `flex: 1` do par litros/preço em cada campo. */
function FuelField({ grow, ...props }: ComponentProps<typeof Field> & { grow?: boolean }) {
  return <Field {...props} style={grow ? styles.grow : undefined} />;
}

const styles = StyleSheet.create({
  form: { gap: theme.space.lg },
  intro: { gap: 2 },
  pair: { flexDirection: "row", gap: theme.space.md },
  grow: { flex: 1 },
});
