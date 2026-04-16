import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "rounded-full bg-brand-orange text-white shadow-lg shadow-brand-orange/30 hover:bg-brand-orange-dark hover:shadow-xl hover:shadow-brand-orange/40 hover:-translate-y-0.5 focus-visible:ring-brand-orange",
        secondary:
          "rounded-full border border-brand-night/20 bg-transparent text-brand-night hover:border-brand-night hover:bg-brand-night hover:text-white focus-visible:ring-brand-night",
        ghostLight:
          "rounded-full border border-white/30 bg-white/5 text-white backdrop-blur-sm hover:border-white hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-brand-night",
        ghost:
          "rounded-full text-brand-night hover:bg-brand-night/5 focus-visible:ring-brand-night",
        link:
          "text-brand-orange underline-offset-4 hover:underline focus-visible:ring-brand-orange",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-7 py-3.5",
        lg: "px-9 py-4 text-lg",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { buttonVariants };
