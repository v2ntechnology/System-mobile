import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-sans text-body-md font-medium",
    "transition-[background,box-shadow,opacity,transform,border-color] duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        /* `primary-strong`, não `primary`: o âncora reprova AA com texto branco. */
        primary: [
          "bg-primary-strong text-on-primary shadow-[0_8px_24px_-12px_rgba(99,102,241,0.9)]",
          "hover:shadow-[0_10px_32px_-10px_rgba(99,102,241,0.9)]",
          "hover:[background-image:var(--spectrum-gradient)]",
          "active:translate-y-px",
        ],
        /** Pill claro — CTA de conversão do site, herdado das telas de autenticação. */
        bright: [
          "bg-bright text-on-bright shadow-[0_10px_30px_-12px_rgba(248,250,252,0.45)]",
          "hover:bg-white hover:shadow-[0_14px_38px_-12px_rgba(248,250,252,0.6)]",
          "active:translate-y-px",
        ],
        /** Ação secundária sobre o grafite. */
        ghost: [
          "border border-outline-variant bg-white/[0.04] text-on-surface",
          "hover:border-outline hover:bg-white/[0.08]",
        ],
        /** Ação dentro de um bloco claro — o `ghost` some sobre `light`. */
        "ghost-on-light": [
          "border border-light-outline bg-transparent text-on-light",
          "hover:bg-black/[0.05]",
        ],
        link: "text-secondary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3 text-label-md",
        md: "h-11 px-4",
        lg: "h-12 px-6",
        xl: "h-13 px-7 text-body-lg",
      },
      shape: {
        /** FE-02 — elemento interno. */
        rounded: "rounded-md",
        pill: "rounded-pill",
      },
      block: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      shape: "pill",
    },
  },
);

export interface ButtonProps
  extends ComponentPropsWithoutRef<"button">, VariantProps<typeof buttonVariants> {}

export function Button({
  className,
  variant,
  size,
  shape,
  block,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size, shape, block }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
