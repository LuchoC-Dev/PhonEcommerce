import { HTMLAttributes } from "react";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger" | "info";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-surface text-text-muted border-border",
  primary: "bg-primary-muted text-primary-light border-primary",
  success: "bg-success-muted text-success border-success",
  warning: "bg-warning-muted text-warning border-warning",
  danger: "bg-danger-muted text-danger border-danger",
  info: "bg-info-muted text-info border-info",
};

function Badge({ variant = "default", children, className = "", ...props }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center justify-center whitespace-nowrap rounded-full border px-2.5 py-0.5",
        "text-xs font-medium font-body text-center",
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
