import Link from "next/link";

import { RookhubLogo } from "@/components/brand/rookhub-logo";
import { siteConfig } from "@/lib/site-config";

import { Container } from "./container";

const columns = [
  {
    title: "Produto",
    links: [
      { href: "/recursos", label: "Recursos" },
      { href: "/#app-motorista", label: "App do motorista" },
      { href: "/recursos#assistente", label: "Assistente de frota" },
      { href: "/planos", label: "Planos" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "/sobre", label: "Sobre o RookHub" },
      { href: "/blog", label: "Blog" },
      { href: "/contato", label: "Fale com vendas" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/contato#privacidade", label: "Privacidade" },
      { href: "/contato#lgpd", label: "LGPD" },
      { href: "/contato#seguranca", label: "Segurança" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-outline-variant border-t">
      <Container className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="flex min-w-0 flex-col gap-4">
          <RookhubLogo />
          {/*
           * `on-surface`, não `on-surface-variant`: o rodapé fica sobre a faixa mais
           * baixa do fundo, onde a vinheta escurece o grafite e derruba o token
           * secundário abaixo do confortável (regra 7).
           */}
          <p className="text-body-md text-on-surface max-w-sm">{siteConfig.description}</p>
          <p className="text-label-md text-on-surface-variant">
            <a href={`mailto:${siteConfig.contactEmail}`} className="hover:text-secondary">
              {siteConfig.contactEmail}
            </a>
            {" · "}
            <span className="tabular">{siteConfig.phone}</span>
          </p>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title} className="flex min-w-0 flex-col gap-3">
            <h2 className="text-label-md text-on-surface-muted font-sans uppercase">
              {column.title}
            </h2>
            {column.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-body-md text-on-surface-variant hover:text-on-surface"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ))}
      </Container>

      <Container className="border-outline-variant text-label-md text-on-surface-muted flex flex-col gap-2 border-t py-6 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © <span className="tabular">{new Date().getFullYear()}</span> RookHub. Todos os direitos
          reservados.
        </p>
        <p>Feito no Brasil para quem roda o Brasil.</p>
      </Container>
    </footer>
  );
}
