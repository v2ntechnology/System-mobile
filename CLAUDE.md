# RookHub — Frontend (`apps/web` + `apps/driver` + `apps/site`)

Painel administrativo, app do motorista e site institucional do RookHub. **Somente frontend** —
não há backend neste repositório. Todo dado vem de mocks; o projeto será integrado a um backend
Java/Spring que vive em outro lugar.

## Comandos

```bash
pnpm install
pnpm dev                            # sobe todos os apps (painel 5173 · site 3000)
pnpm --filter @rookhub/web dev
pnpm --filter @rookhub/web build    # tsc --noEmit && vite build
pnpm --filter @rookhub/driver dev   # Expo — abre no Expo Go ou no emulador
pnpm --filter @rookhub/site dev     # Next.js — http://localhost:3000
pnpm --filter @rookhub/site build   # next build (typecheck incluído)
pnpm typecheck
pnpm format
```

## Estrutura

```
apps/web/                 Vite + React 19 SPA — painel (OWNER, MANAGER, OPERATOR, MAINTENANCE, SUPER_ADMIN)
apps/driver/              Expo + React Native — app do motorista (DRIVER)
apps/site/                Next.js 15 (App Router) — site institucional público
packages/tokens/          tokens do DESIGN.md → @theme do Tailwind v4 + camada .glass
packages/ui/              primitivos glassmorphism compartilhados — **web apenas** (DOM/Tailwind)
packages/types/           contratos de domínio (temporários, até o OpenAPI existir)
```

## Stack fixa (definida no documento de arquitetura)

React 19 · React Router v7 · Vite 6 · TypeScript · Tailwind CSS v4 · Radix UI (shadcn-style) ·
TanStack Query v5 · Zustand · react-hook-form + Zod · Phosphor Icons (Duotone) · sonner

Ainda **não instalados** — adicionar apenas quando a tela que os usa for construída:
visx (Painel do Dono), Recharts (gráficos dinâmicos), Mapbox GL JS (mapas), STOMP/SockJS (WebSocket).

## Regras de projeto que não se negociam

1. **Fundo: `#212121` (Graphite).** É o fundo de **toda** a aplicação — login, painel, modais,
   qualquer tela. Vem do token `--color-background` / classe `bg-background`. Substituiu o
   `#0B1220` (Midnight) do documento de arquitetura original; essa decisão é definitiva e a
   rampa neutra inteira foi rederivada a partir dele, de forma **acromática** (sem o matiz
   azulado antigo). Nenhuma tela define fundo próprio.

   | Token                    | Hex       | Uso                                      |
   | ------------------------ | --------- | ---------------------------------------- |
   | `background` / `surface` | `#212121` | fundo da aplicação — **âncora**          |
   | `surface-lowest`         | `#171717` | poços: campos de entrada, áreas recuadas |
   | `surface-low`            | `#262626` | vidro sobre o fundo                      |
   | `surface-container`      | `#2E2E2E` | card padrão                              |
   | `surface-high`           | `#383838` | card elevado                             |
   | `surface-highest`        | `#434343` | modais                                   |

2. **Cores de marca.** Âncoras `#6366F1` Indigo e `#06B6D4` Cyan — inalteradas. A rampa completa
   vive em `packages/tokens/src/theme.css`. **Nunca escrever hex solto num componente** — use os
   tokens (`bg-surface-container`, `text-on-surface-variant`, …).

   ⚠️ **`primary` não carrega texto branco.** `#6366F1` com branco dá 4,47:1 e reprova AA por uma
   casa decimal. Superfície indigo com texto branco usa **`primary-strong` (`#5457EE`)** — botão,
   chip, pill de navegação ativa. O `primary` fica para preenchimento, borda e ícone.

2b. **Superfície clara — painéis do dashboard.** O painel inverte a lógica do login: cards claros
sobre o grafite (decisão do Figma). Dentro de um `LightCard`, os tokens `on-surface-*` são
praticamente invisíveis — use a família `on-light-*`:

| Token                                                      | Hex       | Uso                                 |
| ---------------------------------------------------------- | --------- | ----------------------------------- |
| `light`                                                    | `#E8EAEC` | painel claro                        |
| `light-container`                                          | `#F4F5F6` | bloco interno claro                 |
| `on-light`                                                 | `#16161A` | texto principal — 15,2:1            |
| `on-light-variant`                                         | `#4A4A54` | texto secundário — 7,3:1            |
| `on-light-muted`                                           | `#62626C` | texto terciário — 5,0:1             |
| `light-outline`                                            | `#C7C9CE` | divisórias                          |
| `primary-on-light`                                         | `#4F46E5` | indigo em texto corrido sobre claro |
| `error-on-light` · `warning-on-light` · `success-on-light` |           | semânticos sobre claro              |

Os semânticos da marca (`error #FB7185` etc.) são claros por construção, para funcionar sobre o
grafite — sobre o painel claro dão ~2:1. **Nunca** use `text-error` dentro de um `LightCard`.

O `primary` (`#6366F1`) sobre claro dá 3,7:1: serve para título ≥24px bold (AA Large) e nada mais. 3. **Fundo das telas de autenticação.** `<AuroraBackdrop />` — grafite com aurora indigo subindo
do rodapé, vinheta e grão. O grão (`.grain`) existe para matar o banding dos radiais grandes;
não remova. Some junto com o resto em `:root.no-blur`.

4. **Raio.** Containers = `rounded-lg` (16px). Elementos internos = `rounded-md` (12px).
   **Exceção — telas de autenticação:** campos e botões usam `rounded-pill`, conforme o Figma
   (`shape="pill"` no `SpectrumButton`, `pill` no `GlassInput`).

5. **Botão primário.** No painel é `variant="primary"` (Indigo + spectrum no hover). Nas telas de
   autenticação é `variant="bright"` (pill branco, `--color-bright` / `--color-on-bright`).

6. **Vidro.** Todo container usa `.glass` (via `<GlassCard>`), nunca as propriedades soltas.
   Listas e tabelas com mais de 20 linhas **nunca** aplicam blur por item — só no container externo.

7. **Contraste.** Qualquer cor de texto nova precisa passar em **AA (4,5:1)** sobre `#212121`.
   Atenção redobrada sobre a aurora: o núcleo do glow chega a `#594E9D` e derruba tokens que
   passam tranquilamente no fundo liso — foi por isso que o rodapé do login usa `on-surface` e
   não `on-surface-variant`. Semânticos ficam na faixa clara do matiz (`#FB7185`, nunca `#DC2626`).

8. **Números em tabelas e métricas** recebem a classe `.tabular`.

8b. **Gráficos.** Recharts (`visx` fica reservado ao Painel do Dono). A paleta categórica é
`chart-1 / chart-2 / chart-3`, validada para daltonismo sobre a superfície clara
(deutan ΔE 15,5 · tritan 11,6). A **ordem é fixa**: a cor segue a série, nunca a posição no
ranking — um filtro que muda a contagem não pode repintar as sobreviventes. Nunca dois eixos Y.
Todo gráfico tem legenda (≥2 séries), tooltip e uma visão em tabela equivalente.

8c. **`min-w-0` em item de grid.** Item de CSS Grid tem `min-width: auto` e se recusa a encolher
abaixo do conteúdo — foi o que estourou o dashboard no mobile. `LightCard` e `GlassCard` já
trazem; qualquer container novo dentro de um grid precisa do mesmo.

8d. **Escala nova em `@theme` → registrar em `packages/ui/src/lib/cn.ts`.** O `tailwind-merge` não
conhece nossos tokens. Sem declarar a escala lá, ele confunde `text-body-md` (tamanho) com
`text-on-light` (cor), classifica no mesmo grupo e **descarta uma delas em silêncio**. O sintoma
é texto herdando a cor do body, sem erro nenhum no build. Vale para `text-*` e `rounded-*`.

8e. **Altura percentual precisa de pai com altura.** `items-end` num flex container tira o
stretch dos filhos, o `h-full` deles vira altura de conteúdo e qualquer barra com `height: %`
perde a referência — foi o que achatou as barras do "Top caminhões". Use `justify-end` dentro
de cada item e deixe o alinhamento cruzado em `stretch`.

8f. **Diálogo não usa `.glass`.** A camada de vidro a 9% deixa o conteúdo da página atravessar o
texto. `GlassModal` tem superfície opaca própria; o blur fica no overlay e na borda.

8g. **`PageTabs` e `useMasterDetail` são obrigatórios em tela nova.** O tablist flutuante e a
auto-seleção do painel de detalhe estavam copiados em três páginas; agora vivem em
`components/layout/page-tabs.tsx` e `hooks/use-master-detail.ts`. Não recopiar.

8h. **Escala de `z-index`.** Não inventar valor solto: um contexto de empilhamento baixo num
ancestral prende o filho, por mais alto que ele seja.

| Camada                                    | Valor                   |
| ----------------------------------------- | ----------------------- |
| fundos (`AuroraBackdrop`, foto do banner) | `-z-10`                 |
| conteúdo da página (`PageContent`)        | `z-10`                  |
| FAB do assistente                         | `z-30`                  |
| topbar e seus menus (nav, sino, avatar)   | `z-[1000]`              |
| diálogo — overlay / conteúdo              | `z-[1100]` / `z-[1101]` |

O diálogo fica **acima** da topbar de propósito: modal cobre a navegação, não o contrário.

8i. **Menu suspenso ancora no `NavigationMenu.Item`, não no `Root`.** O `Item` precisa de
`relative` e o `Content` de `absolute left-0`; sem isso o `left-0` mira o `Root` e o menu abre
~370px à esquerda do botão que o abriu. Também não usar `NavigationMenu.Viewport` — ele
reparenta o conteúdo e quebra esse ancoramento.

8j. **MapLibre precisa de `setWorkerUrl`.** O Vite não consegue analisar o `new URL(...)` que o
MapLibre usa para montar o worker — o arquivo não é emitido, o worker dá 404 e o mapa fica
**preto sem erro visível**. `features/live-map/components/fleet-map.tsx` aponta para a URL que
o próprio Vite empacota (`?worker&url`), e `vite.config.ts` tem `worker.format: "es"`.

8k. **Mapa: uma instância por sessão, atualização por `setData`.** `RT-02` — nunca remontar o
componente nem recriar fonte/camada a cada posição nova. O container expõe `data-map-state`
para verificação sem acessar a instância.

8l. **Mídia de evento não é armazenada.** RN-092 — o RookHub guarda metadados e pede ao
fornecedor uma URL assinada, válida por no máximo 15 min (RNF-022). Peça a URL **na abertura
do player**, nunca na listagem: URL assinada em lista vaza acesso e expira antes do uso.

8m. **Dado financeiro respeita o RF-007.** Salário e afins passam por `useFinancialVisibility()`.
Quem não pode ver enxerga o campo **bloqueado, não escondido** — some com o campo e vira
chamado de suporte. Lembrando que isso é cortesia visual: no backend o campo simplesmente
não vem no payload.

9. **Acessibilidade.** Label sempre associado ao input (`hideLabel` mantém o `sr-only`),
   `aria-invalid` + `role="alert"` em erro, foco visível preservado. Isso é gate de CI no projeto real.

10. **Guarda de rota é conveniência, não segurança.** A autorização real (papel + entitlement) é
    sempre do backend.

## App do motorista (`apps/driver`)

Expo SDK 54 · React Native 0.81 · expo-router 6 (rotas por arquivo em `app/`) · TanStack Query ·
Zustand · react-hook-form + Zod · `@expo/vector-icons`. Rodar: `pnpm --filter @rookhub/driver dev`.
Conta de demonstração: `motorista@rookhub.com` / `rookhub123`.

D1. **`@rookhub/ui` não roda aqui.** Os primitivos do painel são DOM + Tailwind. O app tem os seus
em `apps/driver/src/components/ui/` (`Screen`, `GlassCard`, `LightCard`, `Button`, `Field`,
`Chip`, `Text`, `StateView`) — mesma linguagem visual, transporte diferente. O que **é**
compartilhado: `@rookhub/types` (contratos) e `@rookhub/tokens/tokens` (cores e raios em TS).
Nada de hex solto em componente, igual ao painel.

D2. **Nada de `backdrop-filter`.** React Native não tem; simular com `BlurView` por card derruba
o FPS em lista, que é justamente o que a regra 6 proíbe. `GlassCard` usa superfície translúcida
sobre o grafite + borda clara.

D3. **Alvo de toque mínimo de 48pt** (`HIT_TARGET`). O app é usado em pé, no pátio, de luva.
Botão de aprovar/reprovar item do checklist é o caso crítico.

D4. **Token vai para o keychain**, via `expo-secure-store` no `persist` do Zustand — não é
`localStorage` como no painel. A leitura é assíncrona: `useHydrated()` antes de decidir rota,
senão o app pisca no login a cada abertura.

D4b. **O SDK é ditado pelo Expo Go do aparelho de teste.** Ele suporta um SDK por vez; projeto
mais novo que o app instalado dá "Project is incompatible with this version of Expo Go". Subir de
SDK aqui é decisão consciente — ou todo mundo atualiza o Expo Go, ou o time passa a usar
development build. Alinhar tudo de uma vez: `expo install expo@^<sdk> --fix`.

D5. **Alias `@/` resolve por `tsconfig.paths`** (o `babel-preset-expo` lê de lá). Sem `baseUrl`:
o TypeScript 6 do app já o marca como deprecado.

D6. **Metro em monorepo pnpm** precisa de `watchFolders` na raiz e `nodeModulesPaths` com os dois
níveis (`metro.config.js`). Não ligar `disableHierarchicalLookup` — o pnpm resolve dependência de
dependência dentro do `node_modules` do próprio pacote e a busca hierárquica é o que faz isso
funcionar. Dependência peer usada em runtime (`@expo/metro-runtime`) precisa estar **declarada**
no `package.json` do app: no pnpm nada é içado para a raiz.

## Site institucional (`apps/site`)

Next.js 15 (App Router, RSC) · React 19 · Tailwind v4 via `@tailwindcss/postcss` ·
react-hook-form + Zod · Phosphor Icons. Rodar: `pnpm --filter @rookhub/site dev` → porta 3000.
Páginas: `/` · `/recursos` · `/planos` · `/sobre` · `/blog` (+ `/blog/[slug]`) · `/contato`.

S1. **Primitivos próprios, em `apps/site/src/components/ui/`.** Não importa `@rookhub/ui`: aquele
pacote carrega Radix e WebGL (`ogl`) que uma landing não usa, e quase tudo aqui é server
component. O que **é** compartilhado: `@rookhub/tokens` (o mesmo `@theme`) e `@rookhub/types`.
Mesma linguagem visual, mesma regra de nunca escrever hex solto.

S2. **`src/lib/cn.ts` é cópia deliberada do `cn` de `@rookhub/ui`.** Toda escala nova em `@theme`
precisa ser registrada **nos dois** — vale a regra 8d na íntegra, com o mesmo sintoma silencioso.

S3. **O fundo do site é grafite chapado — nenhuma camada de efeito.** Sem `AuroraBackdrop`, sem
malha, sem halo, sem grão: o `#212121` vem do `body` em `styles/global.css` e é isso. A aurora é
assinatura das telas de autenticação, e em página longa e rolável qualquer glow cai sob um
parágrafo diferente a cada viewport, o que torna a regra 7 impossível de auditar. Decorar o fundo
de seção nova aqui é reabrir esse problema.

S4. **Página é server component; `"use client"` só onde há estado.** Hoje: `SiteHeader` (menu e
scroll), `ContactForm` e `Field`. Ícone dentro de server component vem de
`@phosphor-icons/react/ssr` — a entrada padrão depende de contexto do React no cliente. O tipo
`IconProps` só existe na entrada padrão, e `import type` não arrasta o pacote junto.

S5. **`react` e `react-dom` em versão exata e idêntica.** O React aborta a renderização do
servidor se os dois divergirem, e o lockfile do monorepo resolvia cada um para um patch
diferente. Subir um dos dois é subir os dois.

S6. **Aqui o SEO existe.** O painel é `noindex` (FE-03); o site é a única superfície pública.
`metadata` por página, `sitemap.ts` e `robots.ts` no `app/`. Ao criar rota nova, incluir no
`sitemap.ts` — ele não descobre sozinho.

S7. **Alias `@imgs/` é resolvido pelo `tsconfig.paths`**, que o Next lê no webpack e no Turbopack.
Não duplicar em `next.config.ts`; o que **precisa** estar lá é `outputFileTracingRoot` apontando
para a raiz do monorepo, senão o build não empacota o que vem de fora do app.

## Mocks

- `apps/web/src/mocks/`, `apps/driver/src/mocks/` e `apps/site/src/mocks/` — dados e funções
  falsas, com latência e erros no formato RFC 9457. São conjuntos separados (um app não importa o
  mock do outro), mas contam a **mesma história**: mesmos ids, mesmas placas, mesmos códigos de
  viagem. No site isso vale inclusive para preço — o plano "Frota Pro" custa R$ 89 por veículo
  aqui e na fatura de `apps/web/src/mocks/billing.ts`.
- `<app>/src/features/<feature>/api.ts` — **única fronteira** que os componentes enxergam.
  Na integração, só o corpo dessas funções muda; nenhuma tela é tocada.
- Contas de demonstração aparecem na própria tela de login em desenvolvimento
  (`DevCredentials`, some no build de produção). Senha de todas: `rookhub123`.

## Convenções de código

- Arquivos em `kebab-case.tsx`; componentes em `PascalCase`; exportação **nomeada** (sem `export default`).
- Organização por feature: `features/<nome>/{api,schema,store}.ts` + `components/` + `pages/`.
  No `apps/driver` as telas vivem em `app/` (roteamento por arquivo do expo-router) e no
  `apps/site` em `src/app/` (App Router). Esses dois diretórios são a **única** exceção ao
  `export default` proibido — os dois roteadores exigem. Todo o resto continua em exportação
  nomeada, inclusive os componentes que essas rotas montam.
- Import de app usa o alias `@/`; import entre pacotes usa `@rookhub/*`.
- **Imagens da marca** vivem em `imgs/` na raiz e são importadas pelo alias `@imgs/` —
  não copie esses arquivos para dentro de `apps/web`.
- Texto de interface em **português do Brasil**.
- Comentários explicam _por quê_, não _o quê_ — e citam o requisito quando houver (`RN-xxx`, `FE-xx`).
