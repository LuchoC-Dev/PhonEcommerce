import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, placeholder, className = "", id, children, ...props }, ref) => {
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
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            className={[
              "h-10 w-full appearance-none rounded-[--radius-md] border border-[--color-border]",
              "bg-[--color-card] px-3 pr-9 text-sm text-[--color-text]",
              "transition-colors duration-150 cursor-pointer",
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
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {children}
          </select>
          <span
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[--color-text-muted]"
            aria-hidden="true"
          >
            ▾
          </span>
        </div>
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

Select.displayName = "Select";

export { Select };
