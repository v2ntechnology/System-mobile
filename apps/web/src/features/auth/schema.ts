import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Informe seu e-mail.")
    .email("E-mail inválido.")
    .transform((value) => value.trim().toLowerCase()),
  password: z.string().min(1, "Informe sua senha."),
  rememberMe: z.boolean().default(false),
});

export type LoginFormValues = z.input<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Informe seu e-mail.").email("E-mail inválido."),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
