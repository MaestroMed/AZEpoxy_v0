import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd, type BreadcrumbItem } from "@/lib/jsonld";
import { cn } from "@/lib/utils";
import { TextReveal } from "@/components/ui/text-reveal";

interface PageHeroProps {
  label?: string;
  title: React.ReactNode;
  description?: string;
  /**
   * Visual variant.
   * - `transparent` (default) — no opaque bg, overlays let the layout-level
   *   narrative swarm perce through. Responsive : left-biased gradient on
   *   desktop (text zone dark, swarm zone clear), uniform dim + bottom
   *   fade on mobile.
   * - `night` — legacy solid dark with gradients + ember orbs.
   * - `ember` — brand orange gradient block.
   */
  variant?: "transparent" | "night" | "ember";
  /**
   * Trail of breadcrumbs to display *after* "Accueil". Passing a leading
   * "Accueil" entry is supported for back-compat — it is silently stripped.
   * The resulting list is also serialized as a BreadcrumbList JSON-LD script.
   */
  breadcrumbs?: BreadcrumbItem[];
  children?: React.ReactNode;
}

export function PageHero({
  label,
  title,
  description,
  variant = "transparent",
  breadcrumbs,
  children,
}: PageHeroProps) {
  const trail = stripLeadingHome(breadcrumbs);
  const showCrumbs = trail.length > 0;

  return (
    <section
      className={cn(
        "relative min-h-[60vh] overflow-hidden text-white",
        // Transparent variant does NOT use `isolate` — the stacking
        // context would block the persistent canvas from showing through.
        variant !== "transparent" && "isolate",
        variant === "night" && "bg-brand-night",
        variant === "ember" && "bg-gradient-ember"
      )}
    >
      {showCrumbs && <JsonLd data={breadcrumbLd(trail)} />}

      {variant === "transparent" && (
        <>
          {/* Desktop : left-biased dim so the text zone reads on any
              phase, the right half stays open for the swarm to show. */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-brand-night via-brand-night/60 to-brand-night/15 hidden md:block"
            aria-hidden
          />
          {/* Mobile : uniform dim (text wraps full width) + bottom fade. */}
          <div className="absolute inset-0 bg-brand-night/55 md:hidden" aria-hidden />
          <div
            className="absolute inset-0 bg-gradient-to-t from-brand-night/85 via-transparent to-transparent"
            aria-hidden
          />
        </>
      )}
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
        {showCrumbs && (
          <nav
            aria-label="Fil d'Ariane"
            className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/60"
          >
            <Link href="/" className="transition-colors hover:text-white">
              Accueil
            </Link>
            {trail.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
                {crumb.href ? (
                  <Link href={crumb.href} className="transition-colors hover:text-white">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-white/90">
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}

        <div className="max-w-4xl">
          {label && <span className="section-label-light">{label}</span>}
          <h1 className="heading-display mt-6 text-balance text-4xl leading-[0.95] sm:text-5xl lg:text-6xl">
            <TextReveal>{title}</TextReveal>
          </h1>
          {description && (
            <p className="mt-6 max-w-2xl text-balance text-lg text-white/70 sm:text-xl">
              {description}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}

function stripLeadingHome(items?: BreadcrumbItem[]): BreadcrumbItem[] {
  if (!items?.length) return [];
  const first = items[0];
  const isHome =
    first.href === "/" || first.label.trim().toLowerCase() === "accueil";
  return isHome ? items.slice(1) : items;
}
