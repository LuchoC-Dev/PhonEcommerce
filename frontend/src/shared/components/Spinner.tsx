import { HTMLAttributes } from "react";

type SpinnerSize = "sm" | "md" | "lg";

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  label?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-[3px]",
};

function Spinner({ size = "md", label = "Cargando...", className = "", ...props }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={`inline-flex items-center justify-center ${className}`}
      {...props}
    >
      <span
        className={[
          "rounded-full border-[--color-border] border-t-[--color-primary] animate-spin",
          sizeClasses[size],
        ].join(" ")}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

function PageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-64">
      <Spinner size="lg" />
    </div>
  );
}

export { Spinner, PageSpinner };
