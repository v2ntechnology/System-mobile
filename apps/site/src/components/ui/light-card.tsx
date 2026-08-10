import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

export interface LightCardProps extends ComponentPropsWithoutRef<"div"> {
  /** Bloco interno claro (`light-container`) em vez do painel (`light`). */
  inner?: boolean;
}

/**
 * Painel claro sobre o grafite — a mesma inversão do dashboard.
 *
 * NÃO usa `.glass`. Todo texto aqui dentro precisa dos tokens `on-light-*`:
 * `on-surface-*` é praticamente invisível, e `text-error` dá ~2:1.
 */
export function LightCard({ className, inner = false, ...props }: LightCardProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col rounded-lg p-5 sm:p-6",
        inner ? "bg-light-container" : "bg-light shadow-[0_18px_50px_-30px_rgba(0,0,0,0.8)]",
        className,
      )}
      {...props}
    />
  );
}
