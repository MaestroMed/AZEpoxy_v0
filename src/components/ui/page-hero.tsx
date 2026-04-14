import Link from "next/link";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  label?: string;
  title: React.ReactNode;
  description?: string;
  variant?: "night" | "ember";
  breadcrumbs?: { label: string; href?: string }[];
  children?: React.ReactNode;
}

export function PageHero({
  label,
  title,
  description,
  variant = "night",
  breadcrumbs,
  children,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative isolate min-h-[60vh] overflow-hidden text-white",
        variant === "night" && "bg-brand-night",
        variant === "ember" && "bg-gradient-ember"
      )}
    >
      {/* Background layers */}
      {variant === "night" && (
        <>
          <div className="absolute inset-0 bg-gradient-night" />
          <div className="absolute inset-0 bg-industrial-grid-dark opacity-40" />
          <div className="absolute -left-40 top-1/3 h-[500px] w-[500px] rounded-full bg-brand-orange/20 blur-[140px]" />
          <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-brand-orange/10 blur-[120px]" />
        </>
      )}
      {variant === "ember" && (
        <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay" />
      )}

      <div className="container-wide relative flex min-h-[60vh] flex-col justify-center pt-40 pb-20">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Fil d'Ariane"
            className="mb-8 flex items-center gap-2 text-sm text-white/60"
          >
            <Link
              href="/"
              className="transition-colors hover:text-white"
            >
              Accueil
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                <span aria-hidden="true">&gt;</span>
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="transition-colors hover:text-white"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white/90">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <div className="max-w-4xl">
          {/* Label pill */}
          {label && (
            <span className="section-label-light">{label}</span>
          )}

          {/* Title */}
          <h1 className="heading-display mt-6 text-balance text-4xl leading-[0.95] sm:text-5xl lg:text-6xl">
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p className="mt-6 max-w-2xl text-balance text-lg text-white/70 sm:text-xl">
              {description}
            </p>
          )}

          {/* Extra content */}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}
