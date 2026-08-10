import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

export interface ChipProps extends ComponentPropsWithoutRef<"span"> {
  /** Sobre superfície clara os semânticos da marca dão ~2:1 — daí o par. */
  tone?: "surface" | "light";
}

/** Etiqueta de seção — o "olho" que abre cada bloco da página. */
export function Chip({ className, tone = "surface", ...props }: ChipProps) {
  return (
    <span
      className={cn(
        "rounded-pill text-label-sm inline-flex items-center gap-2 px-3 py-1 uppercase",
        tone === "surface"
          ? "border-outline-variant text-on-surface-variant border bg-white/[0.04]"
          : "border-light-outline text-on-light-variant border bg-black/[0.04]",
        className,
      )}
      {...props}
    />
  );
}
