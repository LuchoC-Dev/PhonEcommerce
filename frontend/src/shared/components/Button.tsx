import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "subtle" | "secondary-alt";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  font?: "display" | "body";
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow-glow disabled:bg-primary-muted disabled:text-text-muted",
  secondary:
    "bg-card text-text border border-border hover:border-primary hover:text-primary-light disabled:opacity-50",
  ghost:
    "bg-transparent text-text-muted hover:text-text hover:bg-surface disabled:opacity-40",
  danger:
    "bg-danger text-white hover:bg-danger-hover shadow-sm disabled:bg-danger-muted disabled:text-text-muted",
  subtle:
    "bg-transparent text-text-muted hover:bg-border hover:text-text disabled:opacity-40",
  "secondary-alt":
    "bg-border text-text hover:bg-primary-muted/60 hover:text-text disabled:opacity-50",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-sm gap-1.5 rounded-sm",
  md: "h-10 px-4 text-sm gap-2 rounded-md",
  lg: "h-12 px-6 text-base gap-2.5 rounded-lg",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      font,
      disabled,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const effectiveFont = font ?? (variant === "subtle" ? "body" : "display");

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={[
          "inline-flex items-center justify-center font-medium",
          effectiveFont === "display" ? "font-display" : "font-body",
          "transition-all duration-150 cursor-pointer select-none",
          "focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2",
          "disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className,
        ].join(" ")}
        {...props}
      >
        {loading && (
          <span
            className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
