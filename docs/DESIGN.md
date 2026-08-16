# Design

Sistema visual do app do motorista RookHub, como ele está construído hoje.
Fonte da verdade dos valores: [`src/theme/tokens.ts`](../src/theme/tokens.ts). Nenhum valor de cor
mora em tela, e nenhum componente sabe em que modo está rodando.

## A ideia

A tela tem **duas superfícies**. O cabeçalho diz quem é o motorista e o que a operação exige dele;
a folha sobe por cima e carrega o trabalho e os números. A costura entre as duas é o que dá
profundidade — não sombra sobre card.

A estrutura vem de [`design-reference/`](design-reference/), o protótipo web pinado
pelo usuário — material de leitura, não código mantido aqui.

## Cockpit do motorista

A home combina duas referências de logística escolhidas pelo usuário: tarefa atual e score bem
hierarquizados, mais o mapa como contexto operacional. A RookHub preserva a própria paleta e usa
esta ordem:

1. bloqueio crítico, quando existir;
2. premiação estimada e o próximo objetivo de score;
3. rota atual, posição, velocidade, previsão e ação da viagem;
4. acessos rápidos e resumo do mês;
5. próximas viagens e avisos de documento.

A premiação não é calculada na tela. `DriverReward` traz nome do programa, fechamento e faixas
parametrizadas pela empresa; o componente apenas explica em qual faixa o motorista está e quantos
pontos faltam para a próxima.

A rota tem uma implementação só,
[`route-map-canvas.tsx`](../src/features/journey/components/route-map-canvas.tsx): malha de tiles
raster com o percurso desenhado por cima em SVG, na mesma projeção Web Mercator dos tiles. Vale para
Android, iOS e preview — o computador mostra o mesmo mapa que sai no aparelho, inclusive o basemap
que troca de claro para escuro junto com o tema.

O Perfil começa pelo desempenho e responde três perguntas, nesta ordem: qual é a nota, como ela é
calculada e o que fazer para melhorar. Evento mostra quantidade, impacto em pontos e orientação —
cor nunca é a única explicação.

## Dois esquemas, os mesmos papéis

Claro e escuro definem **exatamente as mesmas chaves**; é isso que deixa um componente escrever
`colors.surface` sem condicional. Papel primeiro, cor depois.

| Papel            | Escuro    | Claro     | Onde                               |
| ---------------- | --------- | --------- | ---------------------------------- |
| `background`     | `#0A0A0A` | `#FFFFFF` | tela, cabeçalho, barra de abas     |
| `heroSurface`    | `#1C1C1C` | `#EFF3F9` | pill e avatar dentro do cabeçalho  |
| `sheet`          | `#121212` | `#EFF3F9` | folha de conteúdo, raio 24 no topo |
| `surface`        | `#1C1C1C` | `#FFFFFF` | card sobre a folha                 |
| `surfaceSunken`  | `#050505` | `#F5F8FC` | campo, trilho de progresso         |
| `onSurface`      | `#FAFAFA` | `#0F172A` | texto principal                    |
| `onSurfaceFaint` | `#6E6E6E` | `#9AA6B8` | placeholder de campo (login)       |
| `outline`        | `#2E2E2E` | `#E1E7F0` | borda de card, divisor de linha    |
| `accent`         | `#93C5FD` | `#1D4ED8` | texto e ícone de acento            |
| `accentSolid`    | `#2563EB` | `#1D4ED8` | botão, FAB, pill ativa, progresso  |
| `secondary`      | `#22D3EE` | `#0E7490` | estado ativo e foco                |

No escuro a folha é mais clara que o cabeçalho; no claro é mais escura. Nos dois casos ela lê como
uma peça sobre a outra. Card e folha se separam pela borda de 1px, não pelo fundo: dois tons
vizinhos brigam sob sol, uma linha não.

**A família neutra do escuro é preta, sem matiz.** O azul-marinho `#0B1220`, herdado do painel de
gestão, pintava de azul a tela inteira mesmo onde não havia acento; agora o chassi é acromático e
cor só aparece como sinal. O acento continua azul e o ciano continua reservado para estado ativo —
sobre cinza puro o indigo leria como violeta, e é essa a razão de o acento nunca ser indigo aqui. O
login usa o trecho azul do Spectrum (paradas 3 a 5), nunca as violetas.

O fundo é preto, mas não absoluto: `#0A0A0A` mantém folha (`#121212`) e card (`#1C1C1C`)
distinguíveis por luminância, sem o halo que o preto puro cria em volta do texto claro. O que a
luminância não resolve, a borda de 1px resolve. Sobre o card, texto principal fica em 16:1, o
apagado em 6,8:1 e cada par de estado — sucesso, alerta, erro, informação — passa de 5,8:1 sobre o
próprio fundo suave.

## Como o esquema é escolhido

`ThemeProvider` resolve em um lugar só: preferência salva no Perfil ganha do aparelho, e
`ForceScheme` ganha dos dois. A preferência (`system` / `light` / `dark`) fica em
[`src/theme/store.ts`](../src/theme/store.ts), persistida no aparelho.

A tela de **login é sempre clara**, via `ForceScheme`. É a única tela que alguém de fora da
operação vê, e ela não muda de cara conforme o aparelho de quem abriu.

Componente com cor escreve `useThemedStyles(makeStyles)`, com a fábrica definida fora do
componente. `StyleSheet.create` no topo do arquivo só para o que não tem cor.

## Tipografia

Inter, quatro pesos carregados por subcaminho em [`app/_layout.tsx`](../app/_layout.tsx). Uma família
para toda a interface. Cada degrau nomeia o arquivo do seu peso e nenhum estilo declara
`fontWeight` — no Android o peso não é sintetizado sobre uma família já específica.

| Degrau        | Tamanho/linha | Uso                                      |
| ------------- | ------------- | ---------------------------------------- |
| `displayLg`   | 40/46 bold    | score de segurança                       |
| `headlineMd`  | 23/30 semi    | título do cabeçalho, destino em destaque |
| `titleMd`     | 17/23 semi    | título de card e de seção                |
| `metricLg/Md` | 26/32, 19/25  | valor operacional (R$, km, km/l, %)      |
| `bodyLg/Md`   | 17/26, 15/22  | texto corrido                            |
| `labelMd/Sm`  | 13/18, 12/16  | rótulo, meta, prazo                      |
| `overline`    | 11/14 semi    | rótulo de métrica e de campo, caixa alta |

`metric*` e `displayLg` saem tabulares sem ninguém pedir: número que muda de largura mente ao olho.

## Componentes

Todos em [`src/components/ui/`](../src/components/ui/). Nenhuma tela desenha sua própria casca.

- **`SheetScreen`** — casca de duas superfícies. `hero` desenha o cabeçalho; sem ele (telas do
  Stack) fica só a faixa que revela o raio da folha. `insetBottom={false}` nas abas, onde a barra
  inferior já reserva o safe area.
- **`HeroBar`** — título, contexto de uma linha e um elemento à direita.
- **`MetricStrip`** — três números do período em uma peça dividida por fios, não três cartões.
- **`SectionHeader`** — título, descrição opcional e contagem em pill. Sem rótulo acima do título.
- **`Card` / `HeroCard`** — card da folha e card do cabeçalho.
- **`FilterPills`** — filtro que sangra até a borda; azul cheio marca a seleção.
- **`Chip`** — estado semântico; cada tom tem texto e fundo suave próprios do esquema.
- **`Field`** — poço: o campo é a superfície recuada dentro do card.
- **`RewardCard`** (feature performance) — estimativa, ranking, próxima faixa e regras do período.
- **`ScoreRing` / `ScoreBreakdown` / `ScoreTrend`** — número, composição ponderada e evolução do
  score; todo gráfico também escreve o valor.
- **`Button`** — `primary` e `ghost`, altura mínima 48.
- **FAB** (tela Abastecer) — a ação principal de uma tela de lista flutua no canto, 60pt, e abre a
  tela de preenchimento. Formulário longo não mora dentro de aba de consulta.
- **`ThemePicker`** — Sistema / Claro / Escuro, no Perfil.
- **`StateView`** — carregando (esqueleto na altura do card que vem), erro com recuperação, vazio
  que ensina o que fazer.
- **`RouteLine`** (feature journey) — origem vazada, trecho, destino cheio. A viagem lida antes do
  texto.
- **`RouteMapCard`** (feature journey) — mapa, status, ETA, progresso e abertura da navegação.

## Regras que não se negociam

1. Alvo de toque 48pt em qualquer controle de campo.
2. Valor operacional é conteúdo: tem degrau próprio e sai tabular.
3. Cor vem de `useColors()` / `useThemedStyles`, nunca de um objeto estático de tema.
4. Estado nunca é só cor: atraso vem com a palavra, aba ativa vem com pill, item reprovado vem com
   borda e ícone.
5. Sem blur por item de lista: derruba FPS em lista longa.
6. Sem `fontWeight` junto de `fontFamily`.
7. Sem hex literal fora de `tokens.ts`; opacidade se escreve como sufixo do token
   (`` `${colors.accent}3D` ``).

## Movimento

Só estado: pulso do esqueleto de carregamento e o `pressed` dos controles. Não há sequência de
entrada — o motorista abre o app dentro de uma tarefa, não para assistir à tela montar.
