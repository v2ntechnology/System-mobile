import "@fontsource-variable/inter";
import "@fontsource-variable/sora";
import "@/styles/global.css";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  /*
   * Ao contrário do painel (`noindex`, FE-03), o site institucional existe para
   * ser encontrado — é a única superfície pública do produto.
   */
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#212121",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      {/*
       * Sem camada de fundo: o site é grafite chapado, direto do token
       * `--color-background` aplicado ao `body` em `styles/global.css`.
       */}
      <body>
        {/* Regra 9 — teclado precisa de rota curta até o conteúdo. */}
        <a
          href="#conteudo"
          className="focus:bg-bright focus:text-on-bright sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[1200] focus:rounded-md focus:px-4 focus:py-2"
        >
          Pular para o conteúdo
        </a>

        <SiteHeader />

        {/* `pt-16/20` compensa a topbar fixa. */}
        <main id="conteudo" className="relative z-10 pt-16 sm:pt-20">
          {children}
        </main>

        <SiteFooter />
      </body>
    </html>
  );
}
