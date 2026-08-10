/**
 * Constantes públicas do site institucional.
 *
 * O painel é outro app (`apps/web`, porta 5173 em desenvolvimento) e vai ganhar
 * domínio próprio na publicação — por isso a URL vem do ambiente, não hardcoded.
 */
export const siteConfig = {
  name: "RookHub",
  tagline: "Gestão inteligente de frotas para o transporte rodoviário de cargas",
  description:
    "O RookHub reúne rastreamento em tempo real, checklist do motorista, custo por km, manutenção preventiva e segurança em uma única plataforma.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://rookhub.com.br",
  panelUrl: process.env.NEXT_PUBLIC_PANEL_URL ?? "http://localhost:5173",
  contactEmail: "contato@rookhub.com.br",
  phone: "+55 (11) 4000-0000",
} as const;

export const navLinks = [
  { href: "/recursos", label: "Recursos" },
  { href: "/planos", label: "Planos" },
  { href: "/blog", label: "Blog" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
] as const;
