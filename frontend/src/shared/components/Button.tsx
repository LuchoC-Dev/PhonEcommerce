import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[--color-primary] text-white hover:bg-[--color-primary-hover] shadow-[--shadow-sm] hover:shadow-[--shadow-glow] disabled:bg-[--color-primary-muted] disabled:text-[--color-text-muted]",
  secondary:
    "bg-[--color-card] text-[--color-text] border border-[--color-border] hover:border-[--color-primary] hover:text-[--color-primary-light] disabled:opacity-50",
  ghost:
    "bg-transparent text-[--color-text-muted] hover:text-[--color-text] hover:bg-[--color-surface] disabled:opacity-40",
  danger:
    "bg-[--color-danger] text-white hover:bg-red-600 shadow-[--shadow-sm] disabled:bg-[--color-danger-muted] disabled:text-[--color-text-muted]",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-sm gap-1.5 rounded-[--radius-sm]",
  md: "h-10 px-4 text-sm gap-2 rounded-[--radius-md]",
  lg: "h-12 px-6 text-base gap-2.5 rounded-[--radius-lg]",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={[
          "inline-flex items-center justify-center font-[--font-display] font-medium",
          "transition-all duration-150 cursor-pointer select-none",
          "focus-visible:outline-2 focus-visible:outline-[--color-primary] focus-visible:outline-offset-2",
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
