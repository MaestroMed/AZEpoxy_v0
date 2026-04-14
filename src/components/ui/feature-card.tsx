import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  dark?: boolean;
}

export function FeatureCard({
  icon,
  title,
  description,
  dark = false,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group rounded-2xl p-8 transition-all",
        dark
          ? "border border-white/10 bg-white/[0.02] hover:border-brand-orange/40 hover:bg-white/[0.04]"
          : "bg-white shadow-md hover:shadow-lg"
      )}
    >
      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange">
        {icon}
      </div>
      <h3
        className={cn(
          "heading-display text-xl",
          dark ? "text-white" : "text-brand-night"
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          "mt-3 text-sm leading-relaxed",
          dark ? "text-white/60" : "text-brand-charcoal/70"
        )}
      >
        {description}
      </p>
    </div>
  );
}
