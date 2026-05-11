import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padded?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable = false, padded = true, children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          "rounded-xl border border-[#1e1e2e] bg-[#0d0d14]/50",
          "shadow-[--shadow-sm]",
          padded ? "p-6" : "",
          hoverable
            ? "transition-all duration-200 hover:border-[--color-primary] hover:shadow-[--shadow-glow] cursor-pointer"
            : "",
          className,
        ].join(" ")}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

const CardHeader = ({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "", ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={`font-[--font-display] text-xl font-semibold text-[--color-text] ${className}`}
    {...props}
  >
    {children}
  </h3>
);

const CardDescription = ({ children, className = "", ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`text-sm text-[--color-text-muted] mt-1 ${className}`} {...props}>
    {children}
  </p>
);

const CardFooter = ({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={`mt-6 pt-4 border-t border-[--color-border] ${className}`} {...props}>
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardDescription, CardFooter };
