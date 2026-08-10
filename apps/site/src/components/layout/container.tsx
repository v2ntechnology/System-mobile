import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

export interface ContainerProps extends ComponentPropsWithoutRef<"div"> {
  /** Coluna estreita para texto corrido — acima de ~75ch a leitura despenca. */
  narrow?: boolean;
}

export function Container({ className, narrow = false, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        narrow ? "max-w-3xl" : "max-w-6xl",
        className,
      )}
      {...props}
    />
  );
}
