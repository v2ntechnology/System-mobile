// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getDefaultConfig } = require("expo/metro-config");
const path = require("node:path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

/**
 * Metro em monorepo pnpm.
 *
 * `watchFolders` faz o bundler enxergar `packages/*` — sem isso, editar
 * `@rookhub/types` não recarrega o app. `nodeModulesPaths` resolve o store do
 * pnpm, que fica na raiz e não dentro de `apps/driver`.
 */
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];
config.resolver.unstable_enableSymlinks = true;
/* Sem `disableHierarchicalLookup`: o pnpm resolve dependência de dependência
   dentro do `node_modules` do próprio pacote, e desligar a busca hierárquica
   deixa esses pacotes sem raiz nenhuma para procurar. */

module.exports = config;
