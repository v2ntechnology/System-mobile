import logoLockup from "@imgs/logoCompletaBranca.svg";
import logoMark from "@imgs/logoOfficialBranca.svg";

import { cn } from "@/lib/cn";

export interface RookhubLogoProps {
  className?: string;
  /** `mark` = só a torre. `lockup` = torre + wordmark na horizontal. */
  variant?: "mark" | "lockup";
}

/**
 * Marca oficial do RookHub. Ativos em `imgs/`, na raiz do monorepo.
 *
 * `<img>` e não `next/image`: são SVGs, que o otimizador do Next repassa
 * intactos de qualquer forma — o componente só acrescentaria peso de runtime.
 */
export function RookhubLogo({ className, variant = "lockup" }: RookhubLogoProps) {
  const isMark = variant === "mark";
  const asset = isMark ? logoMark : logoLockup;

  return (
    <img
      src={asset.src}
      width={asset.width}
      height={asset.height}
      alt="RookHub"
      draggable={false}
      className={cn("select-none", isMark ? "h-9 w-auto" : "h-8 w-auto", className)}
    />
  );
}
