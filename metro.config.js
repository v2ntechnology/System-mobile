const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

/*
 * O Metro guarda em cache o resultado do Babel, mas a chave desse cache não
 * inclui o `babel.config.js`. Mudar o preset e reiniciar o servidor continuava
 * entregando código transformado pela configuração antiga — foi assim que o
 * `unstable_transformImportMeta` ficou sem efeito por um dia inteiro e o preview
 * web quebrou com `Cannot use 'import.meta' outside a module`, mesmo com a opção
 * declarada. Amarrar a versão do cache ao conteúdo do arquivo faz a invalidação
 * acontecer sozinha, sem depender de alguém lembrar do `--clear`.
 */
config.cacheVersion = crypto
  .createHash("sha1")
  .update(fs.readFileSync(path.join(__dirname, "babel.config.js")))
  .digest("hex");

module.exports = config;
