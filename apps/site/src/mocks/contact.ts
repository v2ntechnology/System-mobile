import { ApiError, delay } from "./latency";

export interface ContactPayload {
  name: string;
  email: string;
  company: string;
  phone?: string;
  fleetSize: string;
  interest: string;
  message: string;
}

export interface ContactReceipt {
  /** Protocolo que a pessoa cita se ligar depois. */
  protocol: string;
  /** Prazo prometido na tela — precisa bater com o que vendas consegue cumprir. */
  replyWithinHours: number;
}

/**
 * Substituto do `POST /v1/leads`.
 *
 * O e-mail `erro@` existe para exercitar o caminho de falha sem depender de sorte:
 * formulário só com caminho feliz esconde o estado de erro até a produção.
 */
export async function mockSubmitContact(payload: ContactPayload): Promise<ContactReceipt> {
  await delay(1_100);

  if (payload.email.startsWith("erro@")) {
    throw new ApiError(
      502,
      "Não foi possível registrar seu contato",
      "O serviço de atendimento está indisponível no momento. Tente de novo em alguns minutos.",
    );
  }

  return {
    protocol: `RH-${new Date().getFullYear()}-${Math.floor(Math.random() * 90_000 + 10_000)}`,
    replyWithinHours: 24,
  };
}
