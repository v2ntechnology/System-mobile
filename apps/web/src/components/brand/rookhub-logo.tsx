import { cn } from "@rookhub/ui";

import logoLockup from "@imgs/logoCompletaBranca.svg";
import logoMark from "@imgs/logoOfficialBranca.svg";

export interface RookhubLogoProps {
  className?: string;
  /** `mark` = só a torre. `lockup` = torre + wordmark na horizontal. */
  variant?: "mark" | "lockup";
}

/** Marca oficial do RookHub. Ativos em `imgs/`, na raiz do monorepo. */
export function RookhubLogo({ className, variant = "lockup" }: RookhubLogoProps) {
  const isMark = variant === "mark";

  return (
    <img
      src={isMark ? logoMark : logoLockup}
      alt="RookHub"
      draggable={false}
      className={cn("select-none", isMark ? "h-16 w-auto" : "h-8 w-auto", className)}
    />
  );
}
