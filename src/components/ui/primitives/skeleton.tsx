import { cn } from "@/lib/utils";

/**
 * Skeleton — placeholder pour les states de chargement.
 *
 * Upgrade : au lieu d'un simple animate-pulse (opacity), on utilise
 * un GRADIENT SHIMMER qui traverse de gauche à droite — lecture
 * "le contenu arrive" beaucoup plus claire que la pulse opacity.
 * Motion-safe respecté.
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-brand-night/[0.06]",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent motion-safe:animate-skeleton-shimmer motion-reduce:hidden"
      />
    </div>
  );
}
