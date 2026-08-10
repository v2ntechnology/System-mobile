import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

export interface GlassCardProps extends ComponentPropsWithoutRef<"div"> {
  /** Superfície de foco — rgba .09 + blur 24px. */
  elevated?: boolean;
}

/**
 * Container padrão sobre o grafite (FE-06), raio de 16px (FE-02).
 *
 * `min-w-0`: item de CSS Grid tem `min-width: auto` e não encolhe abaixo do
 * conteúdo — sem isto o card estoura o viewport no mobile.
 */
export function GlassCard({ className, elevated = false, ...props }: GlassCardProps) {
  return (
    <div className={cn("glass min-w-0", elevated && "glass-elevated", className)} {...props} />
  );
}
