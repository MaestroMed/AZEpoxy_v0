interface ProcessStepProps {
  step: number;
  title: string;
  description: string;
  /** Optional : total count for connecting line rendering. */
  total?: number;
  /** Render in dark surface (e.g. on brand-night sections). */
  dark?: boolean;
}

/**
 * ProcessStep — étape de process numérotée, style architectural.
 *
 * Signature : un GRAND numéro décoratif en ghost (2xl → 8rem) derrière
 * le titre, un dot accent qui se remplit au hover, + une barre verticale
 * de liaison depuis le dot qui descend en dégradé (subtile illusion
 * "chaine").
 *
 * Le dot est animé au hover (scale + ring pulse), la card entière
 * translate légèrement (-2px) avec shadow ember.
 */
export function ProcessStep({
  step,
  title,
  description,
  dark = false,
}: ProcessStepProps) {
  const formattedStep = String(step).padStart(2, "0");

  return (
    <div className="group relative">
      {/* Large ghost number */}
      <span
        className={`heading-display pointer-events-none absolute -top-2 left-0 select-none text-[6.5rem] font-black leading-none tracking-tight transition-colors duration-500 sm:text-8xl ${
          dark
            ? "text-white/[0.08] group-hover:text-brand-orange/25"
            : "text-brand-orange/15 group-hover:text-brand-orange/30"
        }`}
        aria-hidden="true"
      >
        {formattedStep}
      </span>

      <div className="relative pt-16 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5">
        {/* Small accent dot — signe "étape en cours" */}
        <span
          aria-hidden
          className={`absolute left-0 top-12 flex h-3 w-3 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-300 ${
            dark
              ? "bg-brand-orange/30 group-hover:bg-brand-orange"
              : "bg-brand-orange/40 group-hover:bg-brand-orange"
          } group-hover:shadow-[0_0_0_4px_rgba(232,93,44,0.2)]`}
        />
        {/* Thin connecting line beneath the dot — vertical descent */}
        <span
          aria-hidden
          className={`absolute left-[0.3125rem] top-14 h-8 w-px bg-gradient-to-b ${
            dark
              ? "from-brand-orange/30 to-transparent"
              : "from-brand-orange/40 to-transparent"
          }`}
        />
        <div className="pl-6">
          <h3
            className={`heading-display text-xl transition-colors duration-300 ${
              dark ? "text-white" : "text-brand-night"
            }`}
          >
            {title}
          </h3>
          <p
            className={`mt-3 text-sm leading-relaxed ${
              dark ? "text-white/65" : "text-brand-charcoal/70"
            }`}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
