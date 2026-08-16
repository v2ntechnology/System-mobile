# Instruções para Claude — RookHub System-mobile (pt-BR)

## Comportamento

- Responder sempre em pt-BR, de forma direta, com resumo breve ao final.
- **Nunca usar travessão (`—`)** em texto de interface, README, documentação, comentário de código
  ou mensagem de commit (decisão do usuário em 15/08/2026). Quebrar a frase em duas, ou usar
  dois-pontos e parênteses, em vez de trocar o travessão por vírgula.
- Fazer somente o que foi solicitado; não criar abstrações ou refatorações sem uso real.
- Este repositório contém **somente o aplicativo mobile**. O painel administrativo está no projeto
  irmão `../System-web` e o site institucional em `../Website`.
- Na primeira tarefa de código ou infraestrutura da sessão, executar
  `rg -n '^#{2,3} ' .claude/memoria.md`, ler apenas a seção relacionada à tarefa e sempre
  `Gotchas`. Nunca carregar a memória inteira: essa é a técnica oficial de economia de tokens.

## Código e arquitetura

- Stack: Expo SDK 54, React Native 0.81, React 19, expo-router 6 e TypeScript estrito.
- Rotas ficam em `app/`; código reutilizável fica em `src/`, organizado por feature.
- Telas consomem `src/features/<nome>/api.ts`; nunca acessar mocks diretamente a partir de telas.
- Nomes de código, arquivos e pastas em inglês; textos de interface em pt-BR.
- Usar exportações nomeadas. `export default` é permitido apenas em `app/`, por exigência do
  expo-router.
- Nunca usar `any` para silenciar erros; preferir `unknown` com narrowing. Usar `import type` para
  tipos porque `verbatimModuleSyntax` está ativo.
- Não reintroduzir `baseUrl`. O alias `@/*` é definido por `paths` no `tsconfig.json`.
- Cores, raios e medidas compartilhadas vêm de `src/theme`; não espalhar valores visuais literais.
- Manter alvo de toque mínimo de 48pt nos controles usados em campo.
- No aparelho, o token de sessão fica no keychain por `expo-secure-store`; o preview web usa o
  fallback de desenvolvimento em `src/lib/storage.ts`. Aguardar `useHydrated()` antes de decidir
  a rota inicial.

## Dependências e validação

- Usar **npm**, sempre na raiz. Não recriar pnpm, workspace ou Turborepo.
- Para pacotes do ecossistema Expo/React Native, preferir `npx expo install <pacote>` para obter a
  versão compatível com o SDK.
- `babel-preset-expo`, `expo-font` e os peers nativos usados pelo app devem estar declarados
  diretamente; não depender de hoisting transitivo.
- Os alvos de produto são iOS e Android. A plataforma web existe **apenas como preview de
  desenvolvimento** (`npm run dev:web`): não criar tela, rota, asset ou dependência exclusiva de web,
  e não tratar o navegador como alvo de entrega. A única casca exclusiva é
  `src/components/device-preview.web.tsx`, que desenha a moldura interativa no computador.
- **Paridade obrigatória entre preview e aparelho.** O que aparece no navegador tem de ser o mesmo
  que aparece no Expo Go: mesmo componente, mesmo layout, mesmos pixels — mapa, gráfico, câmera,
  animação, qualquer um. Não criar variante `.web.tsx` / `.native.tsx` que mude aparência ou
  comportamento, nem versão "simplificada" para o navegador. Se uma biblioteca não roda nas três
  plataformas, trocar por uma que rode em vez de bifurcar a tela. Única exceção: o
  `device-preview.web.tsx` acima, que é a moldura em volta do app, não o app.
- Antes de fechar uma mudança, deixar limpo:
  `npm run validate`, `npm run export:android` e `npm run export:ios`.
- Ainda não há ESLint nem suíte de testes; não alegar cobertura inexistente.

## Segredos

- A fase atual usa mocks e não contém segredos reais nem backend conectado.
- Somente variáveis `EXPO_PUBLIC_*` chegam ao bundle. Nunca usar esse prefixo para segredo.
- Contas de demonstração são fictícias e podem aparecer no código e na documentação.
- Autorização no frontend é UX; a autorização real deverá ser validada pelo backend.

## Git e autoria

- Repositório: `https://github.com/v2ntechnology/System-mobile.git`, branch principal `main`.
- Alterar identidade Git apenas com `git config --local`; nunca alterar a configuração global.
- Mensagem de commit em pt-BR, sem `Co-Authored-By` e **sem prefixo de Conventional Commits**
  (decisão do usuário em 15/08/2026): nada de `feat:`, `fix(escopo):` e afins. O assunto explica em
  uma frase o que a mudança faz, e o corpo explica brevemente o porquê.
- Cada pessoa configura a **própria identidade** no repositório, e a credencial de push da conta que
  tem acesso a ele, sempre com `git config --local`:
  `git config --local user.name "Seu Nome"` e `git config --local user.email "seu.email@exemplo.com"`.
  Nunca versionar neste documento nome, e-mail, token ou caminho de credencial de alguém: o arquivo
  vale para o time inteiro, e quem clonar passaria a commitar com a identidade de outra pessoa.
- Nunca usar `push --force`, `reset --hard` ou reescrever histórico sem solicitação explícita.
- `.claude/CLAUDE.md` e `.claude/memoria.md` são documentos do projeto. Não registrar dados
  pessoais; configurações locais de permissão continuam ignoradas.
- Antes de commitar, revisar o diff e confirmar que `.env`, `dist/`, `.expo/`, diretórios nativos
  gerados e `node_modules/` não entraram.
- Registrar na memória apenas decisões e armadilhas que o código não revela; manter o documento
  curto e o índice atualizado.
