import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /*
   * `@rookhub/*` são publicados como TypeScript-fonte (sem build). O Next precisa
   * compilá-los junto com o app, senão o server component quebra no primeiro import.
   */
  transpilePackages: ["@rookhub/tokens", "@rookhub/types"],

  /*
   * A biblioteca da marca vive em `imgs/` na raiz do monorepo — fora do diretório do
   * app. O import estático é resolvido pelo alias `@imgs` do tsconfig; o `outputFileTracingRoot`
   * é o que faz o build enxergar a raiz do workspace na hora de empacotar.
   */
  outputFileTracingRoot: new URL("../../", import.meta.url).pathname,

  eslint: {
    // O lint do monorepo roda pelo Prettier + tsc; o do Next não é gate aqui.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
