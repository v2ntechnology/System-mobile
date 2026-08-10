/** Formatação pt-BR compartilhada. Texto de interface é sempre em português. */

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const decimal = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const time = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });
const dayMonth = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" });
const fullDate = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export const formatCurrency = (value: number) => currency.format(value);
export const formatKm = (value: number) => `${decimal.format(value)} km`;
export const formatTime = (iso: string) => time.format(new Date(iso));
export const formatDayMonth = (iso: string) => dayMonth.format(new Date(iso));
export const formatDate = (iso: string) => fullDate.format(new Date(iso));

/**
 * "em 2 h", "há 40 min" — o motorista raciocina em tempo restante, não em
 * horário absoluto. O horário cheio continua ao lado, para quem confere prazo.
 */
export function formatRelative(iso: string): string {
  const diffMinutes = Math.round((new Date(iso).getTime() - Date.now()) / 60_000);
  const abs = Math.abs(diffMinutes);
  const unit = abs >= 60 ? `${Math.round(abs / 60)} h` : `${abs} min`;

  if (abs < 2) return "agora";
  return diffMinutes > 0 ? `em ${unit}` : `há ${unit}`;
}

/** Dias até a data; negativo quando já passou. */
export function daysUntil(iso: string): number {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}
