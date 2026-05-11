import { HTMLAttributes, forwardRef } from "react";
import Link from "next/link";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padded?: boolean;
  href?: string;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable = false, padded = true, href, children, className = "", ...props }, ref) => {
    const classes = [
      "rounded-xl border border-border bg-card/50",
      "shadow-sm",
      padded ? "p-6" : "",
      hoverable
        ? "transition-all duration-200 hover:border-primary hover:shadow-glow cursor-pointer"
        : "",
      className,
    ].join(" ");

    if (href) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }

    return (
      <div ref={ref} className={classes} {...props}>
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
    className={`font-display text-xl font-semibold text-text ${className}`}
    {...props}
  >
    {children}
  </h3>
);

const CardDescription = ({ children, className = "", ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`text-sm text-text-muted mt-1 ${className}`} {...props}>
    {children}
  </p>
);

const CardFooter = ({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={`mt-6 pt-4 border-t border-border ${className}`} {...props}>
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardDescription, CardFooter };
