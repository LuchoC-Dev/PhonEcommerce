import { HTMLAttributes } from "react";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger" | "info";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-[--color-surface] text-[--color-text-muted] border-[--color-border]",
  primary: "bg-[--color-primary-muted] text-[--color-primary-light] border-[--color-primary]",
  success: "bg-[--color-success-muted] text-[--color-success] border-[--color-success]",
  warning: "bg-[--color-warning-muted] text-[--color-warning] border-[--color-warning]",
  danger: "bg-[--color-danger-muted] text-[--color-danger] border-[--color-danger]",
  info: "bg-[--color-info-muted] text-[--color-info] border-[--color-info]",
};

function Badge({ variant = "default", children, className = "", ...props }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-[--radius-full] border px-2.5 py-0.5",
        "text-xs font-medium font-[--font-body]",
        variantClasses[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
