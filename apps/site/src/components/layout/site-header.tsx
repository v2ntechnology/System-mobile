"use client";

import { List, X } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { RookhubLogo } from "@/components/brand/rookhub-logo";
import { buttonVariants } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { cn } from "@/lib/cn";
import { navLinks, siteConfig } from "@/lib/site-config";

import { Container } from "./container";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // O menu móvel é overlay: manter a rota anterior aberta ao navegar esconde a página nova.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    /* z-[1000] — mesma faixa da topbar do painel (regra 8h). */
    <header className="fixed inset-x-0 top-0 z-[1000]">
      <div
        className={cn(
          "transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled
            ? "border-outline-variant bg-background/80 border-b backdrop-blur-xl"
            : "border-b border-transparent",
        )}
      >
        <Container className="flex h-16 items-center justify-between gap-4 sm:h-20">
          <Link href="/" aria-label="RookHub — página inicial" className="shrink-0">
            <RookhubLogo />
          </Link>

          <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-pill text-body-md px-4 py-2 transition-colors duration-200",
                    active
                      ? /* Pill ativa em indigo carrega texto branco: `primary-strong` (regra 2). */
                        "bg-primary-strong text-on-primary"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-white/[0.06]",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={siteConfig.panelUrl}
              className={buttonVariants({ variant: "ghost", size: "sm", shape: "pill" })}
            >
              Entrar
            </a>
            <ButtonLink href="/contato" variant="bright" size="sm">
              Agendar demonstração
            </ButtonLink>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            /* D3 do app vale aqui também: 44px é o mínimo confortável no toque. */
            className="border-outline-variant text-on-surface inline-flex h-11 w-11 items-center justify-center rounded-md border lg:hidden"
          >
            {open ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
            <span className="sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
          </button>
        </Container>
      </div>

      {open ? (
        <div
          id="menu-mobile"
          className="border-outline-variant bg-background/95 border-b backdrop-blur-xl lg:hidden"
        >
          <Container className="flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-body-lg text-on-surface rounded-md px-3 py-3 hover:bg-white/[0.06]"
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-3 flex flex-col gap-3">
              <a
                href={siteConfig.panelUrl}
                className={buttonVariants({ variant: "ghost", block: true })}
              >
                Entrar no painel
              </a>
              <ButtonLink href="/contato" variant="bright" block>
                Agendar demonstração
              </ButtonLink>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
