/**
 * Tokens de cor e raio da marca RookHub, em dois esquemas.
 *
 * React Native não tem CSS, então aqui o valor mora em TypeScript e é consumido
 * pelo `useTheme()` — nunca importando este arquivo direto na tela.
 *
 * Os dois esquemas têm **exatamente as mesmas chaves**: é isso que permite um
 * componente escrever `colors.surface` sem saber em que modo está rodando. Papel
 * primeiro, cor depois; nenhum token se chama pelo que ele parece.
 *
 * A família neutra do escuro é preta, sem matiz: o azul-marinho `#0B1220` que
 * veio do painel de gestão lia como "app azul" mesmo onde não havia acento, e a
 * cabine à noite pede fundo apagado, não colorido. Cinza puro deixaria o indigo
 * puxar para o violeta — por isso o acento continua azul (`#2563EB` / `#93C5FD`)
 * e o ciano fica para estado ativo.
 *
 * ⚠️ **Espelho manual.** A mesma paleta existe como custom properties CSS no
 * painel de gestão e no site institucional (`Website`). Nenhum dos três se
 * atualiza sozinho: mexeu na paleta aqui, espelhe lá.
 */

export interface Scheme {
  /** Fundo da tela e do cabeçalho. */
  background: string;
  /** Pill, avatar e campo dentro do cabeçalho. */
  heroSurface: string;
  /** Folha de conteúdo que sobe sobre o cabeçalho. */
  sheet: string;
  /** Card sobre a folha. */
  surface: string;
  /** Poço: campo de formulário, trilho de progresso. */
  surfaceSunken: string;

  onSurface: string;
  onSurfaceVariant: string;
  onSurfaceMuted: string;
  /**
   * Cinza mais leve que o `muted`, para o texto que é dica e não conteúdo:
   * placeholder de campo. Fica abaixo de AA de propósito — o rótulo do campo
   * continua acima dele, legível, e é ele que carrega a informação.
   */
  onSurfaceFaint: string;

  /** Borda de card e divisor de linha. */
  outline: string;
  /** Contorno que precisa ser visto: botão fantasma, item selecionável. */
  outlineStrong: string;

  /** Azul legível como texto e ícone neste esquema. */
  accent: string;
  /** Azul de preenchimento — botão, pill ativa, barra de progresso. */
  accentSolid: string;
  onAccentSolid: string;
  /** Fundo suave do acento: estado ativo que não pode gritar. */
  accentSoft: string;
  /** Ciano de estado ativo e foco — o `--accent` do painel. */
  secondary: string;

  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  error: string;
  errorSoft: string;
  info: string;
  infoSoft: string;

  /** Ícones da barra de status sobre o fundo deste esquema. */
  statusBar: "light" | "dark";
}

/**
 * Escuro de cabine noturna: preto neutro, com as camadas subindo em direção ao
 * conteúdo. O fundo não é preto absoluto — `#0A0A0A` mantém a folha e o card
 * distinguíveis do fundo sem halo em volta do texto claro, e a borda de 1px
 * termina de separar o que a luminância sozinha não separaria.
 *
 * Cor aqui é só sinal: chassi acromático, azul para ação, ciano para estado
 * ativo, e os pares de estado calibrados acima de AA sobre a superfície do card.
 */
export const darkScheme: Scheme = {
  background: "#0A0A0A",
  heroSurface: "#1C1C1C",
  sheet: "#121212",
  surface: "#1C1C1C",
  surfaceSunken: "#050505",

  onSurface: "#FAFAFA",
  onSurfaceVariant: "#D4D4D4",
  onSurfaceMuted: "#A3A3A3",
  onSurfaceFaint: "#6E6E6E",

  outline: "#2E2E2E",
  outlineStrong: "#4A4A4A",

  accent: "#93C5FD",
  accentSolid: "#2563EB",
  onAccentSolid: "#FFFFFF",
  accentSoft: "#16305A",
  secondary: "#22D3EE",

  success: "#4ADE80",
  successSoft: "#103524",
  warning: "#FBBF24",
  warningSoft: "#3A2A08",
  error: "#FB7185",
  errorSoft: "#451826",
  info: "#38BDF8",
  infoSoft: "#0C3450",

  statusBar: "light",
};

/**
 * Claro de pátio ao meio-dia: branco no cabeçalho, cinza azulado na folha e
 * texto quase preto. Contraste alto porque a tela é lida sob sol direto.
 */
export const lightScheme: Scheme = {
  background: "#FFFFFF",
  heroSurface: "#EFF3F9",
  sheet: "#EFF3F9",
  surface: "#FFFFFF",
  surfaceSunken: "#F5F8FC",

  onSurface: "#0F172A",
  onSurfaceVariant: "#475569",
  onSurfaceMuted: "#64748B",
  onSurfaceFaint: "#9AA6B8",

  outline: "#E1E7F0",
  outlineStrong: "#C3CDDB",

  accent: "#1D4ED8",
  accentSolid: "#1D4ED8",
  onAccentSolid: "#FFFFFF",
  accentSoft: "#E8EFFD",
  secondary: "#0E7490",

  success: "#065F46",
  successSoft: "#E6F4EF",
  warning: "#92400E",
  warningSoft: "#FBF0E2",
  error: "#9F1239",
  errorSoft: "#FBEBF0",
  info: "#0369A1",
  infoSoft: "#E4F2FB",

  statusBar: "dark",
};

/**
 * Paradas do Spectrum Gradient, na ordem. Iguais nos dois esquemas.
 *
 * O gradiente inteiro vai do magenta ao ciano; quem usa escolhe o trecho. O app
 * do motorista fica na metade azul (índices 3 a 6) — a metade violeta é da
 * marca, não deste produto.
 */
export const spectrumStops = [
  "#E879F9",
  "#A855F7",
  "#6366F1",
  "#4F7DF3",
  "#3B9EF5",
  "#06B6D4",
  "#22D3EE",
] as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 9999,
} as const;

export type ColorToken = keyof Scheme;
