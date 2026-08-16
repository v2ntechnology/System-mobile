import type { DriverFuelEntryInput } from "@/types";
import { z } from "zod";

/**
 * O motorista digita com uma mão, em pé, no posto. Aceitamos vírgula decimal —
 * é o que o teclado pt-BR oferece — e a conversão fica em `parseFuel`, depois
 * da validação: o formulário guarda texto, o contrato recebe número.
 */
function toNumber(value: string): number {
  return Number(value.replace(/\./g, "").replace(",", "."));
}

const numeric = (label: string, max: number) =>
  z
    .string()
    .min(1, `Informe ${label}`)
    .refine((value) => Number.isFinite(toNumber(value)) && toNumber(value) > 0, `${label} inválido`)
    .refine((value) => toNumber(value) <= max, `${label} fora da faixa esperada`);

export const fuelSchema = z.object({
  station: z.string().min(3, "Informe o posto"),
  liters: numeric("os litros", 1_000),
  pricePerLiter: numeric("o preço por litro", 30),
  odometerKm: numeric("o odômetro", 2_000_000),
});

export type FuelValues = z.infer<typeof fuelSchema>;

/** Texto validado → payload do contrato. */
export function parseFuel(
  values: FuelValues,
): Pick<DriverFuelEntryInput, "station" | "liters" | "pricePerLiter" | "odometerKm"> {
  return {
    station: values.station.trim(),
    liters: toNumber(values.liters),
    pricePerLiter: toNumber(values.pricePerLiter),
    odometerKm: toNumber(values.odometerKm),
  };
}
