# Memória do Projeto — RookHub System-mobile

> Este arquivo guarda apenas decisões e armadilhas que o código não explica sozinho.
>
> **Economia de tokens:** nunca ler o arquivo inteiro durante uma tarefa. Primeiro executar
> `rg -n '^#{2,3} ' .claude/memoria.md`; depois ler somente a seção relacionada e sempre
> `Gotchas`. Ao editar, manter o índice e remover informações que já estejam claras no código,
> README ou histórico Git.

**Índice:** Visão geral · Repositórios · Estrutura · Expo e build · Visual · Dados e sessão ·
Regras de domínio · Estado e pendências · Gotchas

## Visão geral

- Aplicativo de campo do motorista da plataforma SaaS RookHub.
- Repositório **exclusivamente mobile**, destinado a iOS e Android.
- Fase atual: MVP navegável com mocks, sem backend, autenticação real ou telemetria real.
- Conta de demonstração: `motorista@rookhub.com` / `rookhub123`.

## Repositórios

Os produtos são independentes e irmãos em `Projetos/Rookhub/`:

- `System-mobile`: este aplicativo Expo.
- `System-web`: painel administrativo web.
- `Website`: site institucional.

Não recriar painel, site, `apps/`, `packages/`, pnpm ou Turborepo neste repositório.

## Estrutura

- Pastas, arquivos e rotas **em inglês**; texto de interface em pt-BR. Rota é código, título de tela
  é interface: `app/trip/[id].tsx` tem `title: "Viagem"`.
- `app/`: rotas por arquivo do expo-router — `(tabs)/{index,trips,fuel,profile}`, `trip/[id]`,
  `fuel-entry`, `checklist`, `login`.
- `src/features/`: contratos, schemas, stores e componentes de cada domínio.
- `src/components/ui/`: primitivos nativos compartilhados.
- `src/mocks/`: implementação simulada dos contratos da camada de dados.
- `src/theme/`: tokens, provider e preferência de tema.
- `src/types/`: contratos mobile enquanto não existe cliente OpenAPI gerado.
- `docs/`: `ARCHITECTURE.md`, `PRODUCT.md`, `DESIGN.md` e `design-reference/`.

As telas dependem de `features/<nome>/api.ts`, nunca dos mocks diretamente. Isso permite substituir
os mocks por HTTP sem reescrever a interface.

## Expo e build

- Expo SDK 54, React Native 0.81, React 19 e expo-router 6.
- npm é o único gerenciador; `package-lock.json` é a fonte de resolução reproduzível.
- `tsconfig.json` estende `expo/tsconfig.base.json`; alias `@/*` aponta para `src/*` sem `baseUrl`.
- `babel-preset-expo` precisa estar declarado diretamente. Ele detecta Reanimated/Worklets e injeta
  o plugin necessário; não adicionar o plugin manualmente no `babel.config.js`.
- `react-native-reanimated` exige `react-native-worklets` direto e compatível com o SDK.
- `@expo/vector-icons` exige `expo-font` direto e compatível com o SDK.
- Alvos de produto: `ios` e `android`. `web` é somente preview de desenvolvimento, servido pelo
  mesmo Metro (`npm run dev` + tecla `w`, ou `npm run dev:web`).
- No desktop, `DevicePreview` limita o app real a uma moldura estilo iPhone de 393 × 852; não usa
  iframe, canvas nem screenshot. O arquivo base é transparente no nativo e a variante `.web.tsx`
  some em janelas de até 520 px.
- Image Picker usa câmera, mas não microfone. Manter `microphonePermission: false`.
- Gates: `npm run validate`, `npm run export:android` e `npm run export:ios`.

## Visual

- O sistema construído está descrito em `docs/DESIGN.md`, e o registro de produto em
  `docs/PRODUCT.md`; a
  direção escolhida fica no comentário de contrato no topo de `src/theme/index.ts`.
- Estrutura de duas superfícies (cabeçalho + folha sobreposta) decidida em 15/08/2026, a partir de
  `docs/design-reference/`. A referência é pinada como estrutura, não como paleta.
- Dois esquemas de cor com as **mesmas chaves** (`darkScheme` / `lightScheme`), decididos em
  15/08/2026: escuro para cabine à noite, claro para pátio ao sol.
- O escuro é **preto neutro**, não azul-marinho (pedido do usuário em 15/08/2026): o `#0B1220`
  herdado do painel pintava a tela inteira de azul mesmo sem acento. Escala acromática
  `#0A0A0A` / `#121212` / `#1C1C1C` com borda `#2E2E2E`; preto absoluto ficou de fora porque apaga
  a separação entre folha e card. `app.json` acompanha (`backgroundColor` e splash). O grafite
  `#212121` continua fora — quando o painel e o site forem atualizados, espelhar lá.
- O app é **azul, não roxo**. Com o chassi acromático, cor só entra como sinal: acento azul
  (`#2563EB` / `#93C5FD`), ciano para estado ativo. Sobre cinza puro o indigo do painel leria como
  violeta — por isso ele nunca vira acento aqui, e o login usa as paradas azuis do Spectrum
  (índices 3 a 5), nunca as violetas.
- Os SVGs de `assets/brand/` usam a nomenclatura do `System-web` (`logo-rookhub-white.svg`,
  `logo-rookhub-dark.svg` e os `-html` do símbolo isolado), alinhados em 15/08/2026. `dark` é a
  versão colorida, para fundo claro; `white` é a de fundo escuro. Não voltar aos nomes em português.
- Cor só chega ao componente por `useColors()` / `useThemedStyles(makeStyles)`. Não existe
  `theme.colors`: um objeto estático congelaria a tela em um modo sem ninguém perceber.
- Preferência de tema (`system`/`light`/`dark`) mora em `src/theme/store.ts` e é ajustada no Perfil;
  `app.json` usa `userInterfaceStyle: "automatic"` para o modo `system` funcionar.
- Login é sempre claro, via `ForceScheme`: é a tela que gente de fora da operação vê.
- Toda tela passa por `SheetScreen`; nenhuma tela define casca ou fundo próprio.
- A home segue um cockpit de logística: bloqueio crítico, premiação por score, mapa da jornada,
  ações rápidas e próximas viagens. As faixas de bônus vêm em `DriverReward`; nunca calcular regra
  financeira dentro da tela.
- O mapa da rota tem **uma implementação só** (`route-map-canvas.tsx`), decidido em 15/08/2026:
  tiles raster do basemap CARTO/OpenStreetMap em `Image` e traçado em `react-native-svg`, ambos na
  mesma projeção Web Mercator. `react-native-maps` saiu porque não roda no navegador e obrigava a
  bifurcar a tela — o quadro é estático de propósito, então o mapa nativo só custava chave do Google
  e divergência. A atribuição do basemap é obrigatória e mora dentro do quadro.
- Primitivos nativos vivem em `src/components/ui`; não usar componentes DOM/Tailwind.
- Tokens vêm de `src/theme`. Evitar cores e raios literais fora do tema.
- `GlassCard` nativo usa superfície translúcida e borda; não simular `backdrop-filter` com BlurView
  em listas, pois prejudica o desempenho.
- Alvo de toque mínimo: 48pt, especialmente no checklist usado em campo.

## Dados e sessão

- No aparelho, o token é persistido com `expo-secure-store`. No preview web, `src/lib/storage.ts`
  usa `localStorage`; é conveniência de desenvolvimento, não segurança nem alvo de entrega.
- A hidratação do Zustand é assíncrona; `useHydrated()` precisa concluir antes da decisão de rota
  para evitar piscar a tela de login.
- Não existem variáveis de ambiente nesta fase. Quando houver API, apenas configuração pública pode
  usar `EXPO_PUBLIC_*`; segredos nunca entram no bundle.

## Regras de domínio

- Checklist pré-viagem com item crítico reprovado bloqueia a saída do veículo; não é apenas aviso.
- Foto é obrigatória quando o fluxo reprova item crítico ou registra comprovante configurado.
- A validação da tela é conveniência; quando o backend existir, ele será a fonte de autorização e
  das regras de negócio.

## Estado e pendências

- Concluído: app navegável com Início, Viagens, Abastecer, Perfil e checklist; estrutura mobile na
  raiz; tipos e tokens internalizados; pnpm/Turbo e produtos web removidos.
- Pendente de produto: backend/OpenAPI, autenticação real, telemetria e publicação nas lojas.
- Pendente de engenharia: ESLint, suíte de testes automatizados e confirmação do plano de uso do
  provedor de tiles do mapa antes de publicar nas lojas.
- O `npm audit` do SDK 54 ainda relata alertas transitivos na toolchain Expo/Metro (`image-size`,
  `postcss` e `uuid`). A correção automática sugerida troca Expo/React Native por versões
  incompatíveis; tratar em uma atualização planejada do SDK, não com `--force`.

## Gotchas

- Não usar pnpm nem recriar monorepo; instalar sempre com npm na raiz.
- Dependência Expo/React Native deve ser instalada com `npx expo install` quando aplicável.
- TypeScript verde não garante bundle: sempre gerar export Android e iOS.
- Se `expo/tsconfig.base.json` aparecer vermelho após reinstalar, confirmar `npm install`, reiniciar o
  servidor TypeScript do editor e validar com `npm run typecheck`.
- Não remover `babel-preset-expo`, `expo-font` ou `react-native-worklets` por parecerem transitivos.
- A web é **preview de desenvolvimento**, não alvo de entrega (decisão do usuário em 15/08/2026):
  `platforms` inclui `web` e `npm run dev:web` abre o app no navegador, mas os gates continuam sendo
  `export:android` e `export:ios`. Não criar tela, rota ou asset só de web.
- `expo-secure-store` não existe no navegador. Por isso todo store persistido passa por
  `src/lib/storage.ts`, que cai em `localStorage` quando `Platform.OS === "web"`; sem isso a
  hidratação falha e o app trava no splash do preview.
- O Zustand usa `import.meta.env.MODE` (vem junto do `persist`, no mesmo módulo do `devtools`);
  como o Metro web serve script clássico, manter `unstable_transformImportMeta: true` no
  `babel-preset-expo`, senão o navegador dá `Cannot use 'import.meta' outside a module` e fica na
  tela branca.
- **A chave de cache do Metro não inclui o `babel.config.js`.** Mudar o preset e reiniciar o
  servidor continuava servindo o código transformado pela configuração antiga — foi por isso que o
  erro de `import.meta` sobreviveu à correção e voltou duas vezes. Por isso `metro.config.js`
  deriva `cacheVersion` do hash do `babel.config.js`: qualquer mudança no Babel invalida o cache
  sozinha. Verificado em 15/08/2026 alterando a opção e reiniciando **sem** `--clear`: o bundle
  acompanhou nos dois sentidos. Não remover esse `cacheVersion`.
- Para conferir o bundle web sem abrir o navegador: baixar
  `/node_modules/expo-router/entry.bundle?platform=web&dev=true` do Metro e passar em
  `new vm.Script(...)` no Node — o parse falha com o mesmo `SyntaxError` que o Chrome mostra.
- No `onRehydrateStorage`, não referenciar a constante do próprio store. `localStorage` hidrata
  sincronamente durante a criação dela; usar o `state` entregue pelo callback evita TDZ e splash
  infinito sem erro no console.
- A moldura do preview lê `useScreenScheme()`, não `useTheme()`: notch e indicador são pintados
  pelo app no aparelho de verdade, então precisam acompanhar a tela — inclusive o login, que força
  o claro lá no fundo da árvore. Como contexto só desce, o `ForceScheme` avisa o `ThemeProvider`
  por um canal separado, e por isso o provider fica **por fora** do `DevicePreview` no
  `app/_layout.tsx`. Inverter essa ordem devolve a faixa preta sobre tela clara. Chassi, ilha,
  câmera e botões continuam escuros: são peça física.
- A moldura de desktop fica em `src/components/device-preview.web.tsx`. Não duplicar o app em
  iframe nem instalar biblioteca de mockup: limitar o container preserva hot reload, rotas,
  formulários e os bundles nativos sem dependência nova.
- Preview e aparelho mostram a mesma tela; a paridade é regra do projeto, não preferência. Antes de
  criar qualquer `.web.tsx` / `.native.tsx` de produto, procurar a solução que roda nas três
  plataformas — foi por isso que `react-native-maps` saiu e o mapa virou tiles + SVG.
- Os PNGs de `assets/` são gerados a partir de `assets/brand/*.svg` e levam o nome do SVG de
  origem (`logo-rookhub-white.png` para o splash, `logo-rookhub-white-html*.png` para ícone e
  adaptativos); se voltarem a ficar com o desenho padrão do Expo (seta azul, alvo cinza), foram
  sobrescritos por template.
- O splash do sistema é imagem parada e não distingue "carregando" de "travado"; quem espera com o
  motorista é a `BootScreen` (marca + indicador). Por isso o `hideAsync()` roda no mount e não
  depende das fontes — mas a BootScreen não pode ganhar texto, porque a Inter ainda não está em
  memória nesse instante.
- Não adicionar permissão de microfone: o Image Picker a inclui por padrão se o plugin não receber
  `microphonePermission: false`.
- Não executar `npm audit fix --force`: no estado atual ele propõe mudança incompatível de SDK.
- Não decidir rota antes de `useHydrated()`; isso causa o flash de login na abertura.
- Chaves do `expo-secure-store` aceitam apenas letras, números, `.`, `-` e `_`; não usar `:` no
  nome do storage persistido.
- Não espalhar hex visual nem usar componentes web no React Native.
- `style={{ color: undefined }}` **apaga** a cor de quem veio antes: o `flattenStyle` copia a chave
  sem checar `undefined`, e o texto cai no preto padrão da plataforma — some no escuro e passa
  despercebido no claro. Prop de cor opcional entra com guarda
  (`textColor ? { color: textColor } : undefined`), nunca direto no objeto de estilo. Foi assim que
  o score do Perfil ficou preto no modo escuro.
- Importar fonte do `@expo-google-fonts/*` **por subcaminho** (`.../400Regular`). Pelo índice do
  pacote o Metro empacota as 18 variantes (~6 MB) no bundle.
- Não combinar `fontFamily` de peso específico com `fontWeight`: no Android o peso é ignorado e o
  texto volta ao Regular.
- `docs/design-reference/` e `.claude/skills/` estão no `.prettierignore`; sem isso o
  `format:check` do `npm run validate` reprova por arquivo que não é do app.
- Ao renomear rota, atualizar também o `name=` do `Tabs.Screen`/`Stack.Screen`: ele é string livre,
  o TypeScript não acusa, e a tela órfã perde `options` — a aba aparece sem ícone e sem título.
- Caminho com colchete (`app/trip/[id].tsx`) exige `-LiteralPath` no PowerShell; sem isso o
  `Move-Item` trata `[id]` como curinga e não move nada.
