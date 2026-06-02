import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/util";

type Variant = "primary" | "water" | "secondary" | "ghost" | "danger";
type Size = "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-on-brand hover:brightness-110",
  water: "bg-water text-on-water hover:brightness-110",
  secondary: "bg-surface-2 text-ink border-2 border-line hover:border-brand",
  ghost: "bg-transparent text-ink border-2 border-line hover:bg-surface-2",
  danger: "bg-danger text-on-danger hover:brightness-110",
};

const sizes: Record<Size, string> = {
  md: "min-h-13 px-5 text-lg",
  lg: "min-h-14 px-6 text-xl w-full",
  icon: "min-h-13 min-w-13 p-0 text-2xl",
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
        "inline-flex items-center justify-center gap-2 rounded-xl2 font-bold",
        "transition-[filter,background-color,border-color] duration-150 active:translate-y-px",
        "disabled:cursor-not-allowed disabled:opacity-60",
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
