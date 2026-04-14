import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label?: string;
  labelIcon?: React.ReactNode;
  title: React.ReactNode;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  dark?: boolean;
  centered?: boolean;
}

export function SectionHeader({
  label,
  labelIcon,
  title,
  description,
  ctaLabel,
  ctaHref,
  dark = false,
  centered = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        centered && "text-center",
        !centered && "max-w-3xl"
      )}
    >
      {/* Label pill */}
      {label && (
        <span className={dark ? "section-label-light" : "section-label"}>
          {labelIcon}
          {label}
        </span>
      )}

      {/* Heading */}
      <h2
        className={cn(
          "heading-display mt-4 text-4xl sm:text-5xl",
          dark ? "text-white" : "text-brand-night"
        )}
      >
        {title}
      </h2>

      {/* Description */}
      {description && (
        <p
          className={cn(
            "mt-4 text-lg",
            dark ? "text-white/70" : "text-brand-charcoal/70",
            centered && "mx-auto max-w-2xl"
          )}
        >
          {description}
        </p>
      )}

      {/* CTA */}
      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className={cn(
            "mt-6 inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-all",
            dark
              ? "border-white/20 bg-white/5 text-white hover:border-white hover:bg-white/10"
              : "border-brand-night/15 bg-white text-brand-night hover:border-brand-night hover:bg-brand-night hover:text-white"
          )}
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
