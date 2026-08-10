import type { Role } from "@rookhub/types";

/**
 * Para onde cada papel entra depois de autenticar.
 *
 * Vive sozinho porque **dois lugares** decidem isso e precisam concordar: o
 * formulário, que navega ao receber a sessão, e a própria tela de login, que
 * redireciona quem já está autenticado. Quando os dois discordavam, a guarda da
 * tela vencia a corrida e o proprietário ia parar no painel — o portal só
 * aparecia se ele digitasse a URL.
 *
 * O portal (escolha entre IA e gestão) é exclusivo do dono (RF-003).
 */
export function landingFor(role: Role | undefined) {
  return role === "OWNER" ? "/portal" : "/app";
}
