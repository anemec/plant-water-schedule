import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/util";

type Variant = "primary" | "water" | "secondary" | "ghost" | "danger";
type Size = "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-strong text-canvas hover:bg-brand focus-visible:bg-brand",
  water: "bg-water-strong text-canvas hover:bg-water focus-visible:bg-water",
  secondary:
    "bg-surface-2 text-ink border border-line hover:border-brand/60 hover:bg-surface",
  ghost: "bg-transparent text-ink hover:bg-surface-2",
  danger: "bg-danger/15 text-danger border border-danger/40 hover:bg-danger/25",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-4 text-base",
  lg: "min-h-13 px-5 text-lg",
  icon: "min-h-11 min-w-11 p-0 text-xl",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-extrabold",
        "transition-colors duration-150 active:translate-y-px",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
