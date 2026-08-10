import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { Chip } from "@/components/ui/chip";
import { cn } from "@/lib/cn";

import { Container } from "./container";

export interface SectionProps extends ComponentPropsWithoutRef<"section"> {
  narrow?: boolean;
}

export function Section({ className, narrow, children, ...props }: SectionProps) {
  return (
    <section className={cn("py-16 sm:py-24", className)} {...props}>
      <Container narrow={narrow}>{children}</Container>
    </section>
  );
}

export interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  /** Dentro de um bloco claro os tokens invertem — `on-surface-*` some ali. */
  tone?: "surface" | "light";
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  tone = "surface",
  align = "left",
  className,
}: SectionHeadingProps) {
  const light = tone === "light";

  return (
    <div
      className={cn(
        "flex max-w-2xl flex-col gap-4",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow ? <Chip tone={tone}>{eyebrow}</Chip> : null}

      <h2
        className={cn(
          "font-display text-headline-lg sm:text-display-lg text-balance",
          light ? "text-on-light" : "text-on-surface",
        )}
      >
        {title}
      </h2>

      {description ? (
        <p
          className={cn(
            "text-body-lg text-pretty",
            light ? "text-on-light-variant" : "text-on-surface-variant",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
