import { z } from "zod";

export const fleetSizeOptions = [
  { value: "1-15", label: "Até 15 veículos" },
  { value: "16-60", label: "De 16 a 60 veículos" },
  { value: "61-120", label: "De 61 a 120 veículos" },
  { value: "120+", label: "Mais de 120 veículos" },
] as const;

export const interestOptions = [
  { value: "demonstracao", label: "Agendar uma demonstração" },
  { value: "planos", label: "Entender os planos e preços" },
  { value: "integracao", label: "Integrar com meu rastreador ou ERP" },
  { value: "suporte", label: "Já sou cliente e preciso de suporte" },
] as const;

const fleetSizeValues: string[] = fleetSizeOptions.map((option) => option.value);
const interestValues: string[] = interestOptions.map((option) => option.value);

/**
 * Mensagens em português e específicas: "campo inválido" obriga a pessoa a
 * adivinhar o que o formulário quer, e é o principal motivo de abandono.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(3, "Informe seu nome completo."),
  email: z.string().trim().min(1, "Informe um e-mail para retorno.").email("E-mail inválido."),
  company: z.string().trim().min(2, "Informe o nome da empresa."),
  // Opcional de verdade: telefone obrigatório em formulário de site derruba conversão.
  phone: z.string().trim().optional(),
  /*
   * `string` + `refine` em vez de `z.enum`: o campo nasce vazio (`""`) para que o
   * `<select>` mostre "Selecione…", e um enum rejeitaria isso com a mensagem
   * genérica de valor inválido em vez da instrução que a pessoa precisa ler.
   */
  fleetSize: z
    .string()
    .refine((value) => fleetSizeValues.includes(value), "Selecione o tamanho da frota."),
  interest: z.string().refine((value) => interestValues.includes(value), "Selecione o assunto."),
  message: z
    .string()
    .trim()
    .min(20, "Conte um pouco mais — pelo menos 20 caracteres.")
    .max(1_000, "Máximo de 1000 caracteres."),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
