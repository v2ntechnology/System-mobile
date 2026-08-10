const longDate = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  // Fuso fixo: sem isto a data renderizada no servidor pode cair um dia antes da
  // renderizada no cliente e o React acusa divergência de hidratação.
  timeZone: "America/Sao_Paulo",
});

/** "28 de julho de 2026" — a partir de uma data ISO 8601. */
export function formatLongDate(iso: string): string {
  return longDate.format(new Date(iso));
}
