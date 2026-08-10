# RookHub — Frontend

Monorepo do frontend do **RookHub**, plataforma inteligente de gestão de frotas para o
transporte rodoviário de cargas.

> Repositório **exclusivamente frontend**. O backend (Java 21 / Spring Boot) vive em outro
> repositório e ainda não está conectado — todas as telas operam sobre dados mockados.

---

## Sumário

- [1. Pré-requisitos](#1-pré-requisitos)
- [2. Instalação](#2-instalação)
- [3. Rodando os apps](#3-rodando-os-apps)
- [4. Estrutura do monorepo](#4-estrutura-do-monorepo)
- [5. Fluxo de trabalho e commits](#5-fluxo-de-trabalho-e-commits)
- [6. Convenções de código](#6-convenções-de-código)
- [7. UI/UX — a linguagem visual](#7-uiux--a-linguagem-visual)
- [8. Telas prontas](#8-telas-prontas)
- [9. Mocks e integração com o backend](#9-mocks-e-integração-com-o-backend)
- [10. Problemas comuns](#10-problemas-comuns)

---

## 1. Pré-requisitos

| Ferramenta  | Versão                    | Observação                                           |
| ----------- | ------------------------- | ---------------------------------------------------- |
| **Node.js** | `>= 20` (recomendado: 22) | use `nvm` para não brigar com outros projetos        |
| **pnpm**    | `9.15.0`                  | **obrigatório** — npm/yarn quebram o workspace       |
| **Git**     | qualquer                  | —                                                    |
| **Expo Go** | SDK 54                    | só para quem for mexer no app do motorista (celular) |

O gerenciador está travado em `packageManager: "pnpm@9.15.0"` no `package.json` da raiz. A
maneira mais segura de obter a versão certa:

```bash
corepack enable
corepack prepare pnpm@9.15.0 --activate
pnpm -v   # deve imprimir 9.15.0
```

> **Não use `npm install` nem `yarn`.** O projeto depende de `workspace:*` e do layout de
> `node_modules` do pnpm (veja a regra D6 do [CLAUDE.md](CLAUDE.md) sobre o Metro do React
> Native). Um `package-lock.json` ou `yarn.lock` no repositório é bug, não conveniência.

---

## 2. Instalação

```bash
git clone <url-do-repo> rookhub-frontend
cd rookhub-frontend
pnpm install          # instala os 6 workspaces de uma vez, a partir da raiz
```

O `pnpm install` é rodado **sempre na raiz** — nunca dentro de `apps/web` ou `packages/ui`.
Ele resolve os três apps e os três pacotes juntos e escreve um único `pnpm-lock.yaml`.

### Variáveis de ambiente

Todas são **opcionais em desenvolvimento** — sem nenhuma delas o projeto sobe com os mocks.

**`apps/web/.env`** (copie de [`apps/web/.env.example`](apps/web/.env.example)):

| Variável            | Padrão                     | Para quê                                       |
| ------------------- | -------------------------- | ---------------------------------------------- |
| `VITE_API_BASE_URL` | `http://localhost:8080/v1` | URL do backend, quando existir                 |
| `VITE_API_MODE`     | `mock`                     | `mock` nesta fase · `http` com backend plugado |

**`apps/site/.env.local`**:

| Variável                | Padrão                   | Para quê                              |
| ----------------------- | ------------------------ | ------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`  | `https://rookhub.com.br` | base do `sitemap.xml` e do Open Graph |
| `NEXT_PUBLIC_PANEL_URL` | `http://localhost:5173`  | destino do botão "Entrar no painel"   |

Arquivos `.env*` estão no `.gitignore` — **nunca commite um**. Se criar uma variável nova,
adicione-a ao `.env.example` correspondente para o resto do time saber que ela existe.

---

## 3. Rodando os apps

### Tudo de uma vez

```bash
pnpm dev
```

O Turborepo sobe o painel em <http://localhost:5173> e o site em <http://localhost:3000>.
O app do motorista **não** entra nesse comando (o Expo quer o terminal só para ele).

### Painel administrativo — `apps/web`

```bash
pnpm --filter @rookhub/web dev        # http://localhost:5173
pnpm --filter @rookhub/web build      # tsc --noEmit && vite build
pnpm --filter @rookhub/web preview    # serve o build de produção
```

Contas de demonstração (senha de todas: `rookhub123`). Em desenvolvimento elas aparecem no
próprio bloco _"Contas de demonstração"_ da tela de login — o componente `DevCredentials`
some no build de produção.

| E-mail                   | Papel                                  |
| ------------------------ | -------------------------------------- |
| `dono@rookhub.com`       | OWNER                                  |
| `gestor@rookhub.com`     | MANAGER                                |
| `operador@rookhub.com`   | OPERATOR (sem visibilidade financeira) |
| `manutencao@rookhub.com` | MAINTENANCE (plano reduzido)           |
| `bloqueado@rookhub.com`  | simula conta bloqueada (403)           |

### Site institucional — `apps/site`

```bash
pnpm --filter @rookhub/site dev       # Next.js — http://localhost:3000
pnpm --filter @rookhub/site build     # next build (typecheck incluído)
```

Páginas: **Home** (hero, números, módulos, como funciona, app do motorista, depoimentos, FAQ),
**Recursos**, **Planos**, **Sobre**, **Blog** (listagem + artigo) e **Contato** (formulário
validado com Zod).

Tudo é renderizado no servidor: só o menu móvel e o formulário são componentes cliente. Os
primitivos são próprios de `apps/site/src/components/ui/` — `@rookhub/ui` carrega Radix e WebGL
que uma landing não precisa. O que se compartilha é `@rookhub/tokens` (o mesmo `@theme`) e
`@rookhub/types`.

### App do motorista — `apps/driver`

```bash
pnpm --filter @rookhub/driver dev     # Expo — leia o QR com o Expo Go, ou tecle a / i
pnpm --filter @rookhub/driver android
pnpm --filter @rookhub/driver ios
```

Entre com `motorista@rookhub.com` / `rookhub123`. Telas: **Início** (viagem atual, pendência de
checklist, próximas), **Viagens** (com detalhe e avanço do status), **Abastecer** (registro com
km/l apurado e histórico) e **Perfil** (score, CNH, contrato, eventos). O checklist pré-viagem
abre a partir do Início e bloqueia a saída do veículo quando reprova item crítico.

O celular precisa estar na **mesma rede Wi-Fi** do computador e com o **Expo Go do SDK 54** —
um Expo Go mais velho responde _"Project is incompatible with this version of Expo Go"_.
Subir de SDK é decisão do time inteiro, não de uma branch (regra D4b do CLAUDE.md).

`@rookhub/ui` é web-only (DOM + Tailwind); o app tem primitivos nativos equivalentes em
`apps/driver/src/components/ui/` e reusa `@rookhub/types` e os tokens de cor em TS.

---

## 4. Estrutura do monorepo

```
rookhubFrontend/
├── apps/
│   ├── web/        Painel — Vite 6 + React 19 + React Router v7 (SPA)
│   ├── site/       Site institucional — Next.js 15 (App Router, RSC)
│   └── driver/     App do motorista — Expo SDK 54 + React Native 0.81
├── packages/
│   ├── tokens/     Fonte de verdade do design: @theme do Tailwind v4 + camada .glass
│   ├── ui/         Primitivos glassmorphism compartilhados — web apenas
│   └── types/      Contratos de domínio (temporários, até o OpenAPI existir)
├── imgs/           Ativos de marca — importados pelo alias @imgs/
├── CLAUDE.md       Regras de projeto que não se negociam — leitura obrigatória
└── turbo.json      Orquestração das tasks
```

Dentro de cada app, a organização é **por feature**:

```
src/features/<nome>/
├── api.ts          única fronteira de dados que os componentes enxergam
├── schema.ts       validação Zod
├── store.ts        estado Zustand (quando precisa)
├── components/
└── pages/
```

### Stack fixa

React 19 · React Router v7 · Vite 6 · TypeScript · Tailwind CSS v4 · Radix UI (shadcn-style) ·
TanStack Query v5 · Zustand · react-hook-form + Zod · Phosphor Icons (Duotone) · sonner ·
Recharts (gráficos) · MapLibre GL (mapa).

Adicionar biblioteca nova é conversa de time, não decisão de branch. Se for inevitável, instale
**no workspace certo**:

```bash
pnpm --filter @rookhub/web add <pacote>          # dependência do painel
pnpm --filter @rookhub/ui add <pacote>           # dependência de um primitivo compartilhado
pnpm add -w -D <pacote>                          # ferramenta da raiz (prettier, turbo…)
```

---

## 5. Fluxo de trabalho e commits

### Antes de abrir a branch

```bash
git checkout main
git pull
pnpm install          # o lockfile pode ter mudado no pull
git checkout -b feat/mapa-filtro-por-status
```

Prefixos de branch: `feat/`, `fix/`, `refactor/`, `docs/`, `chore/`.

### O checklist que impede quebrar a aplicação

Rode **os três** antes de cada commit. Leva menos de um minuto com o cache do Turborepo:

```bash
pnpm typecheck        # tsc --noEmit nos 3 apps + 3 pacotes
pnpm format           # Prettier + ordenação de classes Tailwind
pnpm build            # build de produção dos 3 apps
```

- **`pnpm typecheck` é o gate principal.** Ele pega a maior parte do que quebraria a build.
- **`pnpm format` altera arquivos** — rode **antes** do `git add`, senão o diff sai sujo e o
  próximo dev reformata tudo em cima do seu código.
- **`pnpm build` é obrigatório quando você mexeu em `packages/`.** Uma mudança em
  `@rookhub/tokens` ou `@rookhub/ui` atinge os três apps ao mesmo tempo, e o typecheck sozinho
  não vê problema de bundling (worker do MapLibre, WebGL do `ogl`, RSC do Next).
- O app do motorista não tem build aqui — valide-o **rodando no Expo Go**. Uma tela nativa
  quebrada passa reto pelo `typecheck`.

> ⚠️ `pnpm lint` está declarado mas **ainda não funciona** — o ESLint não está instalado nem
> configurado. Não confie nele como verificação; use `typecheck` + `format` + `build`.

Além disso, verifique manualmente o que o TypeScript não vê:

- [ ] A tela ainda funciona em **mobile** (375px) e em **desktop** — o painel é usado nos dois.
- [ ] Nenhum **hex solto** entrou no componente (regra 2 do CLAUDE.md).
- [ ] Todo input tem **label associado**; erro tem `aria-invalid` + `role="alert"`.
- [ ] Nenhum `console.log` esquecido.
- [ ] Nenhum `.env`, `dist/`, `.next/`, `node_modules/` no `git status`.

### O commit

```bash
git add -p                     # revise o que está indo — evita commitar lixo
git commit -m "feat(mapa): filtro por status na lista lateral"
git push -u origin feat/mapa-filtro-por-status
```

Padrão de mensagem — **Conventional Commits**, em português, no imperativo:

```
<tipo>(<escopo>): <o que mudou, em minúsculas, sem ponto final>
```

| Tipo       | Quando                                     |
| ---------- | ------------------------------------------ |
| `feat`     | funcionalidade nova visível para o usuário |
| `fix`      | correção de bug                            |
| `refactor` | mudança interna sem alterar comportamento  |
| `style`    | só visual/formatação                       |
| `docs`     | documentação                               |
| `chore`    | dependências, config, build                |

Escopos usuais: `web`, `site`, `driver`, `ui`, `tokens`, `types`, ou o nome da feature
(`mapa`, `auth`, `custos`, `checklists`…).

**Um commit = uma ideia.** Se a mensagem precisa de "e", provavelmente são dois commits.

### Pull request

Abra PR contra `main`, com:

- **título** no mesmo padrão do commit;
- **o que mudou e por quê** — cite o requisito quando houver (`RN-xxx`, `FE-xx`, `RF-xxx`);
- **print ou vídeo** de toda mudança visual (é um projeto de frontend — o diff não mostra o
  que importa);
- confirmação de que `typecheck`, `format` e `build` passaram.

Nunca commite direto na `main`, e nunca faça `push --force` numa branch que outra pessoa
esteja usando.

### Conflito no `pnpm-lock.yaml`

Não resolva à mão. Pegue a versão da `main` e regenere:

```bash
git checkout --theirs pnpm-lock.yaml   # ou --ours, conforme o lado que tem a verdade
pnpm install
git add pnpm-lock.yaml
```

---

## 6. Convenções de código

- Arquivos em `kebab-case.tsx`; componentes em `PascalCase`.
- **Exportação nomeada** — `export default` é proibido. Única exceção: `apps/driver/app/` e
  `apps/site/src/app/`, porque expo-router e App Router exigem. Os componentes que essas rotas
  montam continuam em exportação nomeada.
- Import dentro de um app usa o alias `@/`; entre pacotes, `@rookhub/*`; imagens de marca,
  `@imgs/` (os arquivos vivem em `imgs/` na raiz — **não copie** para dentro de um app).
- Texto de interface em **português do Brasil**.
- Comentários explicam **por quê**, não **o quê** — e citam o requisito quando houver.
- Números em tabelas e métricas recebem a classe `.tabular`.

---

## 7. UI/UX — a linguagem visual

Tudo abaixo vive em [`packages/tokens/src/theme.css`](packages/tokens/src/theme.css), exposto
como `@theme` do Tailwind v4. O espelho em TypeScript (para gráficos, canvas e o app nativo)
é [`packages/tokens/src/tokens.ts`](packages/tokens/src/tokens.ts).

> **Regra número um: nunca escreva um hex solto num componente.** Use o token
> (`bg-surface-container`, `text-on-light-variant`, …). É o que mantém os três apps
> parecendo o mesmo produto.

### 7.1 Fundo — Graphite `#212121`

É o fundo de **toda** a aplicação: login, painel, modais, site institucional, app do motorista.
Nenhuma tela define fundo próprio. A rampa neutra inteira foi derivada dele, de forma
**acromática** (sem matiz azulado).

| Token                    | Hex       | Uso                                      |
| ------------------------ | --------- | ---------------------------------------- |
| `background` / `surface` | `#212121` | fundo da aplicação — **âncora**          |
| `surface-lowest`         | `#171717` | poços: campos de entrada, áreas recuadas |
| `surface-low`            | `#262626` | vidro sobre o fundo                      |
| `surface-container`      | `#2E2E2E` | card padrão                              |
| `surface-high`           | `#383838` | card elevado                             |
| `surface-highest`        | `#434343` | modais                                   |

### 7.2 Marca

Duas âncoras, inalteradas desde o documento de arquitetura:

| Token       | Hex       | Nome   |
| ----------- | --------- | ------ |
| `primary`   | `#6366F1` | Indigo |
| `secondary` | `#06B6D4` | Cyan   |

⚠️ **`primary` não carrega texto branco.** `#6366F1` com branco dá 4,47:1 e reprova AA por uma
casa decimal. Superfície indigo com texto branco usa **`primary-strong` (`#5457EE`)** — botão,
chip, pill de navegação ativa. O `primary` fica para preenchimento, borda e ícone.

O **Spectrum Gradient** (magenta → púrpura → indigo → azul → sky → cyan) é a assinatura da
marca e tem uso **parcimonioso**: hover do botão primário e pouco mais.

### 7.3 Texto sobre o grafite

| Token                | Hex       | Contraste | Uso                 |
| -------------------- | --------- | --------- | ------------------- |
| `on-surface`         | `#F0F0F2` | 14,1:1    | texto principal     |
| `on-surface-variant` | `#B4B4BC` | 7,8:1     | texto secundário    |
| `on-surface-muted`   | `#9A9AA4` | —         | texto terciário     |
| `outline`            | `#6E6E76` | 3,2:1     | traço de componente |
| `outline-variant`    | `#3A3A3E` | —         | divisórias sutis    |

Semânticos ficam na faixa **clara** do matiz, para funcionar sobre o escuro:
`success #34D399` · `warning #FBBF24` · `error #FB7185` · `info #38BDF8`.

### 7.4 Superfície clara — os painéis do dashboard

O painel inverte a lógica do login: cards claros sobre o grafite (decisão do Figma). Dentro de
um `LightCard`, os tokens `on-surface-*` são praticamente invisíveis — use a família
`on-light-*`:

| Token              | Hex       | Uso                                 |
| ------------------ | --------- | ----------------------------------- |
| `light`            | `#E8EAEC` | painel claro                        |
| `light-container`  | `#F4F5F6` | bloco interno claro                 |
| `on-light`         | `#16161A` | texto principal — 15,2:1            |
| `on-light-variant` | `#4A4A54` | texto secundário — 7,3:1            |
| `on-light-muted`   | `#62626C` | texto terciário — 5,0:1             |
| `light-outline`    | `#C7C9CE` | divisórias                          |
| `primary-on-light` | `#4338CA` | indigo em texto corrido sobre claro |

Há também `error-on-light`, `warning-on-light` e `success-on-light`.

> **Nunca use `text-error` dentro de um `LightCard`.** Os semânticos da marca são claros por
> construção e dão ~2:1 sobre o painel claro. O `primary` sobre claro dá 3,7:1: serve para
> título ≥24px bold (AA Large) e nada mais.

### 7.5 Tipografia

| Família        | Fonte              | Uso                                    |
| -------------- | ------------------ | -------------------------------------- |
| `font-display` | **Sora Variable**  | títulos, números de destaque, wordmark |
| `font-sans`    | **Inter Variable** | corpo, rótulos, tabelas — tudo o mais  |

Ambas vêm do `@fontsource-variable/*` (auto-hospedadas, sem chamada ao Google Fonts) e são
importadas uma única vez no entrypoint do app.

Escala — use sempre o token, nunca `text-[18px]`:

| Token              | Tamanho / linha | Peso | Uso                    |
| ------------------ | --------------- | ---- | ---------------------- |
| `text-display-lg`  | 48 / 56         | 700  | hero                   |
| `text-headline-lg` | 32 / 40         | 600  | título de página       |
| `text-headline-md` | 24 / 32         | 600  | título de seção / card |
| `text-body-lg`     | 18 / 28         | 400  | texto de destaque      |
| `text-body-md`     | 16 / 24         | 400  | corpo padrão           |
| `text-label-md`    | 14 / 20         | 500  | rótulos                |
| `text-label-sm`    | 12 / 16         | 500  | metadados, eyebrow     |

> **Escala nova em `@theme` precisa ser registrada em `packages/ui/src/lib/cn.ts`** (e também
> em `apps/site/src/lib/cn.ts`). O `tailwind-merge` não conhece nossos tokens: sem declarar a
> escala, ele confunde `text-body-md` (tamanho) com `text-on-light` (cor), põe as duas no mesmo
> grupo e **descarta uma em silêncio**. O sintoma é texto herdando a cor do body, sem erro
> nenhum no build. Vale para `text-*` e `rounded-*`.

### 7.6 Raio

| Token          | Valor  | Uso                          |
| -------------- | ------ | ---------------------------- |
| `rounded-sm`   | 8px    | chips pequenos               |
| `rounded-md`   | 12px   | **elementos internos**       |
| `rounded-lg`   | 16px   | **containers**               |
| `rounded-xl`   | 24px   | superfícies grandes          |
| `rounded-pill` | 9999px | telas de autenticação, pills |

**Exceção das telas de autenticação:** campos e botões usam `rounded-pill`, conforme o Figma
(`shape="pill"` no `SpectrumButton`, `pill` no `GlassInput`).

### 7.7 Vidro (glassmorphism)

Todo container usa a classe `.glass`, via `<GlassCard>` — **nunca** as propriedades soltas.
As opacidades são travadas para contraste determinístico: superfície `rgba(255,255,255,0.05)`,
elevada `0.09`, blur 16px / 24px, borda 1px em gradiente.

- Listas e tabelas com mais de 20 linhas **nunca** aplicam blur por item — só no container.
- **Diálogo não usa `.glass`**: a 9% o conteúdo da página atravessa o texto. `GlassModal` tem
  superfície opaca própria; o blur fica no overlay e na borda.
- `.glass-well` é o poço escuro (inputs sobre o grafite); `.light-well` é o poço sobre painel
  claro. Não misture.
- Existe fallback automático (`:root.no-blur`) para hardware modesto e navegadores sem
  `backdrop-filter`.

No app do motorista **não há `backdrop-filter`** — React Native não tem, e simular com
`BlurView` por card derruba o FPS em lista. Lá o `GlassCard` usa superfície translúcida +
borda clara.

### 7.8 Fundos

- **Telas de autenticação:** `<AuroraBackdrop />` — grafite com aurora indigo subindo do rodapé,
  vinheta e grão. O grão (`.grain`) existe para matar o banding dos radiais grandes em telas de
  8 bits; **não remova**.
- **Painel:** grafite chapado com os cards claros por cima.
- **Site institucional:** grafite chapado, **nenhuma camada de efeito**. Em página longa e
  rolável, qualquer glow cai sob um parágrafo diferente a cada viewport, o que torna a auditoria
  de contraste impossível. Decorar fundo de seção nova aqui é reabrir esse problema.

### 7.9 Gráficos

Recharts (`visx` fica reservado ao Painel do Dono). Paleta categórica validada para daltonismo
sobre a superfície clara (deutan ΔE 15,5 · tritan 11,6):

| Token     | Hex       |
| --------- | --------- |
| `chart-1` | `#4F46E5` |
| `chart-2` | `#0E8FA8` |
| `chart-3` | `#E11D48` |

A **ordem é fixa**: a cor segue a série, nunca a posição no ranking — um filtro que muda a
contagem não pode repintar as sobreviventes. Nunca dois eixos Y. Todo gráfico tem legenda
(≥2 séries), tooltip e uma visão em tabela equivalente.

### 7.10 Ícones

**Phosphor Icons**, peso **Duotone**, em toda a interface. No `apps/site`, ícone dentro de
server component vem de `@phosphor-icons/react/ssr` — a entrada padrão depende de contexto do
React no cliente. No `apps/driver`, `@expo/vector-icons`.

### 7.11 Logo e ativos de marca

Vivem em [`imgs/`](imgs/) na raiz e são importados pelo alias `@imgs/`. Não copie para dentro
de um app. O componente `RookhubLogo` (existe em `apps/web` e em `apps/site`) encapsula a
escolha:

| `variant`  | Arquivo                  | Uso                               |
| ---------- | ------------------------ | --------------------------------- |
| `"lockup"` | `logoCompletaBranca.svg` | torre + wordmark, na horizontal   |
| `"mark"`   | `logoOfficialBranca.svg` | só a torre — favicon, avatar, app |

Há versão colorida (`logoOfficialColorida.svg`, `logoCompletaColorida.svg`) para fundo claro, e
o wordmark isolado (`RookHubNome.svg`). **Prefira sempre o SVG**; os PNGs existem para contextos
que não aceitam vetor. Nunca redesenhe, recorte ou recolora a marca à mão.

### 7.12 Acessibilidade

Não é opcional — é gate de CI no projeto real.

- Qualquer cor de texto nova precisa passar em **AA (4,5:1)** sobre o fundo em que vai viver.
  Atenção redobrada sobre a aurora: o núcleo do glow chega a `#594E9D` e derruba tokens que
  passam tranquilamente no fundo liso.
- Label sempre associado ao input (`hideLabel` mantém o `sr-only`).
- Erro tem `aria-invalid` + `role="alert"`.
- Foco visível preservado — não remova o outline sem substituir por algo equivalente.
- No app do motorista, **alvo de toque mínimo de 48pt** (`HIT_TARGET`): ele é usado em pé, no
  pátio, de luva.

### 7.13 Escala de `z-index`

Não invente valor solto — um contexto de empilhamento baixo num ancestral prende o filho, por
mais alto que ele seja.

| Camada                                    | Valor                   |
| ----------------------------------------- | ----------------------- |
| fundos (`AuroraBackdrop`, foto do banner) | `-z-10`                 |
| conteúdo da página (`PageContent`)        | `z-10`                  |
| FAB do assistente                         | `z-30`                  |
| topbar e seus menus                       | `z-[1000]`              |
| diálogo — overlay / conteúdo              | `z-[1100]` / `z-[1101]` |

O diálogo fica **acima** da topbar de propósito: modal cobre a navegação, não o contrário.

### 7.14 Primitivos disponíveis

Antes de escrever um componente, veja se ele já existe em
[`packages/ui/src/index.ts`](packages/ui/src/index.ts):

`GlassCard` · `LightCard` · `GlassInput` · `GlassSelect` · `GlassModal` · `SpectrumButton` ·
`StatTile` · `StatusChip` · `DataTable` · `Checkbox` · `Alert` · `Spinner` · `Avatar` ·
`AuroraBackdrop` · `GlowBackdrop` · `BlindsBackdrop` · `GradientBlinds` · `Grainient` · `cn`

E os de layout do painel: `PageTabs` (`components/layout/page-tabs.tsx`) e o hook
`useMasterDetail` (`hooks/use-master-detail.ts`) são **obrigatórios em tela nova** — o tablist
flutuante e a auto-seleção do painel de detalhe já estavam copiados em três páginas. Não
recopiar.

`@rookhub/ui` é **web apenas** (DOM + Tailwind). O `apps/driver` tem os equivalentes nativos e
o `apps/site` tem os seus, mais leves. O que os três compartilham é `@rookhub/tokens` e
`@rookhub/types`.

---

## 8. Telas prontas

**Painel (`apps/web`)**

- `/login` — autenticação por e-mail e senha + SSO Google (mockado)
- `/esqueci-minha-senha` — solicitação de redefinição (mockada)
- `/app` — dashboard: hero do hub, top motoristas, indicadores, manutenção e custo por km
- `/app/caminhoes` — despesas do período, filtros e master-detail da frota
- `/app/motoristas` — pódio mês/ano e ficha completa: pessoais, CNH, contrato, score, eventos
- `/app/relatorios` — indicadores por período, catálogo com prévia, envios recorrentes
- `/app/mapa` — posição da frota em tempo real (MapLibre), com aviso de dado desatualizado
- `/app/viagens` — em curso, atrasadas e concluídas, com a linha do tempo da máquina de estados
- `/app/custos` — custo por km em camadas, por veículo, abastecimentos com detecção de anomalia
- `/app/seguranca` — eventos com vídeo, fila de contestações e copiloto do operador
- `/app/manutencao` — ordens de serviço, planos preventivos e desempenho por oficina
- `/app/checklists` — preenchimentos, bloqueios de veículo e templates versionados
- `/app/notificacoes` — central multi-módulo; o sino da topbar abre as últimas
- `/app/configuracoes` — usuários e papéis, plano e módulos, saúde das integrações

**Assistente "Pergunte à sua frota"** — botão flutuante no canto inferior direito, ou
`Ctrl+R` / `Ctrl+K`. Responde com texto, gráfico, tabela, a fonte do número e ações
contextuais; fora do escopo, recusa.

---

## 9. Mocks e integração com o backend

Cada app tem o seu conjunto de mocks (`<app>/src/mocks/`), com latência e erros no formato
RFC 9457. São conjuntos **separados** — um app não importa o mock do outro — mas contam a
**mesma história**: mesmos ids, mesmas placas, mesmos códigos de viagem, mesmos preços de plano.

Nenhum componente conhece a origem dos dados. A troca acontece em um único lugar por feature:

```
src/features/auth/api.ts   →  hoje chama src/mocks/auth.ts
                              amanhã chama o cliente gerado do OpenAPI
```

Ao plugar o backend: substitua o corpo das funções em `features/*/api.ts` e apague
`src/mocks/`. **Nenhuma tela é tocada.** Vale igual nos três apps.

> Guarda de rota é conveniência, não segurança. A autorização real (papel + entitlement) é
> sempre do backend. Dado financeiro passa por `useFinancialVisibility()` (RF-007): quem não
> pode ver enxerga o campo **bloqueado, não escondido** — sumir com o campo vira chamado de
> suporte. No backend o campo simplesmente não vem no payload.

---

## 10. Problemas comuns

| Sintoma                                                  | Causa provável / solução                                                                              |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `Cannot find module '@rookhub/…'`                        | rode `pnpm install` **na raiz**, não dentro do app                                                    |
| Texto herdando a cor do body, sem erro no build          | escala nova em `@theme` não registrada no `cn.ts` — veja 7.5                                          |
| Card estourando a largura no mobile                      | item de CSS Grid tem `min-width: auto`; falta `min-w-0` no container novo                             |
| Barra de gráfico com `height: %` achatada                | `items-end` tirou o stretch; use `justify-end` no item e deixe o cruzado em `stretch`                 |
| Mapa preto, sem erro no console                          | worker do MapLibre — `setWorkerUrl` e `worker.format: "es"` no `vite.config.ts`                       |
| Menu suspenso abrindo ~370px à esquerda do botão         | o `Content` está ancorado no `NavigationMenu.Root`; ancore no `Item` (`relative` + `absolute left-0`) |
| _"Project is incompatible with this version of Expo Go"_ | Expo Go do celular está em SDK diferente do projeto (54)                                              |
| App do motorista pisca no login a cada abertura          | leitura do keychain é assíncrona — use `useHydrated()` antes de decidir rota                          |
| `pnpm lint` falha com `eslint: not found`                | esperado; o ESLint ainda não foi configurado. Use `typecheck` + `format` + `build`                    |

---

## Scripts da raiz

| Comando          | O que faz                                  |
| ---------------- | ------------------------------------------ |
| `pnpm dev`       | Sobe painel (5173) e site (3000)           |
| `pnpm build`     | Typecheck + build de produção dos apps web |
| `pnpm preview`   | Serve os builds de produção                |
| `pnpm typecheck` | Verificação de tipos em todo o monorepo    |
| `pnpm format`    | Prettier com ordenação de classes Tailwind |

---

As regras de design e arquitetura em detalhe — inclusive as que este README resume — estão em
**[CLAUDE.md](CLAUDE.md)**. Leia antes do primeiro PR.
