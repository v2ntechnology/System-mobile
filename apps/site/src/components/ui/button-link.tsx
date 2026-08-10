import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import { buttonVariants, type ButtonProps } from "./button";
import { cn } from "@/lib/cn";

export interface ButtonLinkProps
  extends
    ComponentPropsWithoutRef<typeof Link>,
    Pick<ButtonProps, "variant" | "size" | "shape" | "block"> {}

/**
 * CTA que navega.
 *
 * Existe em vez de um `asChild`: no App Router quase todo CTA é um `next/link`,
 * e o `Slot` do Radix arrastaria uma dependência inteira para resolver um caso só.
 * Link externo (painel, contato) continua sendo `<a>` com `buttonVariants`.
 */
export function ButtonLink({ className, variant, size, shape, block, ...props }: ButtonLinkProps) {
  return (
    <Link className={cn(buttonVariants({ variant, size, shape, block }), className)} {...props} />
  );
}
