import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
  {
    variants: {
      variant: {
        ember:
          "border border-brand-orange/30 bg-brand-orange/10 text-brand-orange",
        night:
          "border border-brand-night/20 bg-brand-night/5 text-brand-night",
        light:
          "border border-white/20 bg-white/5 text-white/90 backdrop-blur-sm",
        success:
          "border border-brand-success/30 bg-brand-success/10 text-brand-success",
        muted:
          "border border-foreground/10 bg-muted text-muted-foreground",
      },
    },
    defaultVariants: { variant: "ember" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
