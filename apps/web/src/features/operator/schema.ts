import { z } from "zod";

/**
 * Tratativa inicial do operador sobre um checklist reprovado.
 *
 * O texto é obrigatório porque é o que o gestor vai ler antes de decidir a
 * liberação: "escalado" sem o que foi verificado no pátio obriga a refazer a
 * inspeção do zero.
 */
export const triageSchema = z.object({
  note: z
    .string()
    .trim()
    .min(10, "Descreva o que foi verificado no pátio, em pelo menos 10 caracteres.")
    .max(500, "Use no máximo 500 caracteres."),
});

export type TriageValues = z.infer<typeof triageSchema>;
