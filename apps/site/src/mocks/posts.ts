import { ApiError, delay } from "./latency";

/**
 * Bloco de conteúdo de um post.
 *
 * Deliberadamente estruturado em vez de Markdown/MDX: o conteúdo real vai vir de
 * um CMS pela API, e um union tipado obriga a página a tratar cada caso. Trocar
 * isto por `dangerouslySetInnerHTML` depois seria abrir injeção por conteúdo.
 */
export type PostBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "heading"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "quote"; text: string; attribution?: string };

export interface PostSummary {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** ISO 8601 — a formatação é da camada de apresentação. */
  publishedAt: string;
  readingMinutes: number;
  author: { name: string; role: string };
}

export interface Post extends PostSummary {
  body: PostBlock[];
}

const posts: Post[] = [
  {
    slug: "custo-por-km-o-que-quase-toda-transportadora-esquece",
    title: "Custo por km: o que quase toda transportadora esquece de somar",
    excerpt:
      "Combustível é o número que todo mundo olha — e é justamente por isso que ele esconde os outros quatro.",
    category: "Custos",
    publishedAt: "2026-07-28T09:00:00-03:00",
    readingMinutes: 7,
    author: { name: "Rafael Queiroz", role: "Especialista em operações" },
    body: [
      {
        kind: "paragraph",
        text: "Pergunte a qualquer gestor quanto custa o quilômetro rodado da frota dele e a resposta vem rápido. Pergunte como ele chegou nesse número e o silêncio começa. Na prática, quase sempre é diesel dividido por quilometragem — uma conta que descreve bem o tanque e mal a operação.",
      },
      { kind: "heading", text: "As cinco camadas" },
      {
        kind: "paragraph",
        text: "Um custo por km que sustenta decisão precisa de cinco camadas, e elas raramente vivem no mesmo lugar:",
      },
      {
        kind: "list",
        items: [
          "Combustível — a única que costuma estar medida.",
          "Manutenção — preventiva e corretiva, incluindo o tempo parado, que ninguém lança.",
          "Pneu — vida útil por posição no eixo, não por nota fiscal.",
          "Pedágio e taxas — variam por rota, e a rota muda.",
          "Pessoa — salário, diária, hora extra e o custo do motorista esperando carga.",
        ],
      },
      {
        kind: "paragraph",
        text: "A camada que mais dói é a segunda, e não pelo valor da peça. Um caminhão parado três dias numa oficina não aparece em lugar nenhum da planilha: ele simplesmente não roda, e o custo fixo continua correndo. Quando esse tempo entra na conta, o ranking dos veículos mais caros muda — e costuma mudar bastante.",
      },
      {
        kind: "quote",
        text: "O veículo mais caro da frota raramente é o que mais consome. É o que menos roda.",
      },
      { kind: "heading", text: "Por onde começar" },
      {
        kind: "paragraph",
        text: "Não tente medir as cinco de uma vez. Comece por combustível e manutenção com tempo parado, que já cobrem a maior parte da variação entre veículos. Pneu e pedágio entram no segundo trimestre, quando a base de rotas estiver estável. Pessoa vem por último, porque é a que mais depende de acordo interno sobre o que entra e o que não entra.",
      },
    ],
  },
  {
    slug: "checklist-que-o-motorista-preenche-de-verdade",
    title: "O checklist que o motorista preenche de verdade",
    excerpt:
      "Formulário de 60 itens com o caminhão esperando para sair vira 60 toques em “ok”. O problema não é o motorista.",
    category: "Operação",
    publishedAt: "2026-06-15T09:00:00-03:00",
    readingMinutes: 6,
    author: { name: "Marina Alencar", role: "Consultora de frotas" },
    body: [
      {
        kind: "paragraph",
        text: "Todo checklist digital começa igual: a empresa transporta para o app exatamente a folha de papel que usava antes. Sessenta itens, todos com o mesmo peso, todos obrigatórios. Duas semanas depois, a taxa de aprovação é de 100% — o que deveria assustar, e normalmente é comemorado.",
      },
      { kind: "heading", text: "Peso desigual é a correção" },
      {
        kind: "paragraph",
        text: "Nem todo item vale a mesma coisa. Freio, pneu e iluminação impedem a saída do veículo; um limpador de para-brisa gasto abre um chamado e libera a viagem. Quando o app deixa essa diferença explícita, o motorista para de tratar a inspeção como formalidade — porque agora ela tem consequência visível.",
      },
      {
        kind: "list",
        items: [
          "Item crítico reprovado bloqueia o veículo e abre a ordem de serviço.",
          "Item não crítico registra a pendência e libera a saída.",
          "Reprovação exige foto — é o que transforma opinião em prova.",
          "Alvo de toque grande: o preenchimento acontece em pé, no pátio, muitas vezes de luva.",
        ],
      },
      {
        kind: "paragraph",
        text: "O último ponto parece detalhe de design e é o que mais muda o número. Botão pequeno em tela de celular ao sol, com a mão suja, produz erro de toque — e erro de toque sistematicamente favorece o “aprovado”, que costuma ser o botão maior ou o primeiro da lista.",
      },
      { kind: "heading", text: "O que medir depois" },
      {
        kind: "paragraph",
        text: "Taxa de aprovação de 100% não é meta, é sintoma. Acompanhe a distribuição de reprovações por item: se um item nunca reprova em seis meses, ou o componente é imortal, ou ninguém está olhando para ele.",
      },
    ],
  },
  {
    slug: "manutencao-preventiva-por-km-ou-por-data",
    title: "Manutenção preventiva: por km ou por data?",
    excerpt:
      "A resposta certa é “os dois”, e o motivo é o caminhão que ficou três meses parado esperando carga.",
    category: "Manutenção",
    publishedAt: "2026-05-04T09:00:00-03:00",
    readingMinutes: 5,
    author: { name: "Rogério Bastos", role: "Gestor de manutenção" },
    body: [
      {
        kind: "paragraph",
        text: "Plano por quilometragem é o padrão do setor, e faz sentido: desgaste acompanha uso. O problema aparece no veículo que roda pouco. Óleo envelhece no cárter mesmo com o motor desligado, borracha resseca, bateria sulfata. Um plano só por km deixa esse caminhão sem revisão por tempo indeterminado.",
      },
      {
        kind: "paragraph",
        text: "Plano só por data tem o defeito espelhado: o veículo que roda 20 mil km por mês chega na revisão semestral com o dobro do desgaste previsto.",
      },
      { kind: "heading", text: "O que dispara primeiro" },
      {
        kind: "paragraph",
        text: "A regra prática é simples: cada plano tem os dois gatilhos, e vence o que chegar antes. Troca de óleo a cada 40 mil km ou 12 meses. Revisão de freio a cada 60 mil km ou 18 meses. O sistema abre a ordem de serviço sozinho, e o gestor decide a data com a operação na mão.",
      },
      {
        kind: "quote",
        text: "Preventiva boa é a que abre a OS antes de você lembrar dela.",
      },
      {
        kind: "paragraph",
        text: "O ganho não está na peça trocada no prazo — está em escolher quando o caminhão para. Parada planejada acontece na terça de manhã, com peça em estoque. Parada não planejada acontece na estrada, com guincho.",
      },
    ],
  },
  {
    slug: "lgpd-e-video-de-telemetria-o-que-guardar",
    title: "LGPD e vídeo de telemetria: o que guardar e o que não guardar",
    excerpt:
      "A pergunta não é se você pode filmar o motorista. É por quanto tempo você precisa daquele arquivo.",
    category: "Segurança",
    publishedAt: "2026-03-19T09:00:00-03:00",
    readingMinutes: 8,
    author: { name: "Cláudia Ferrer", role: "Encarregada de dados" },
    body: [
      {
        kind: "paragraph",
        text: "Câmera na cabine é assunto sensível, e com razão: o vídeo é dado pessoal do motorista. A discussão costuma travar na legitimidade da captura, quando o risco real mora na etapa seguinte — o armazenamento.",
      },
      { kind: "heading", text: "Minimização é a decisão de arquitetura" },
      {
        kind: "paragraph",
        text: "O RookHub não guarda mídia de evento. Armazenamos o metadado — quando, onde, qual veículo, qual severidade — e, no momento em que alguém abre o player, pedimos ao fornecedor da câmera uma URL assinada válida por no máximo quinze minutos.",
      },
      {
        kind: "list",
        items: [
          "Menos superfície: um vazamento no RookHub não expõe vídeo de cabine.",
          "A URL é pedida na abertura do player, nunca na listagem — link assinado em lista vaza acesso e expira antes do uso.",
          "A retenção do vídeo continua sendo do fornecedor, com o prazo que você contratou com ele.",
        ],
      },
      { kind: "heading", text: "O que o motorista precisa saber" },
      {
        kind: "paragraph",
        text: "Transparência não é item jurídico, é item de operação. O motorista vê o próprio evento, vê o vídeo e pode contestar. A decisão sobre a contestação fica registrada com autor e data. Isso resolve o problema de compliance e, na prática, resolve também o problema de confiança — que é o que faz a câmera funcionar ou virar sabotagem.",
      },
    ],
  },
];

export async function fetchPosts(): Promise<PostSummary[]> {
  await delay(260);
  // O corpo não vai na listagem: payload de post inteiro em lista é desperdício
  // que a API real também não vai fazer.
  return posts
    .map(({ body: _body, ...summary }) => summary)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function fetchPost(slug: string): Promise<Post> {
  await delay(260);
  const post = posts.find((item) => item.slug === slug);
  if (!post)
    throw new ApiError(404, "Publicação não encontrada", `Nenhum post com slug "${slug}".`);
  return post;
}

/** Usado pelo `generateStaticParams` — não faz sentido latência aqui. */
export function listPostSlugs(): string[] {
  return posts.map((post) => post.slug);
}
