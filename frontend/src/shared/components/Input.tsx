import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[--color-text-muted] font-[--font-body]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            "h-10 w-full rounded-[--radius-md] border border-[--color-border]",
            "bg-[--color-card] px-3 text-sm text-[--color-text]",
            "placeholder:text-[--color-text-subtle]",
            "transition-colors duration-150",
            "focus:outline-none focus:border-[--color-primary] focus:ring-1 focus:ring-[--color-primary]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error
              ? "border-[--color-danger] focus:border-[--color-danger] focus:ring-[--color-danger]"
              : "",
            className,
          ].join(" ")}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-[--color-danger]" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-[--color-text-subtle]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
