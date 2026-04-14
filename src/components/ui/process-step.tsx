interface ProcessStepProps {
  step: number;
  title: string;
  description: string;
}

export function ProcessStep({ step, title, description }: ProcessStepProps) {
  const formattedStep = String(step).padStart(2, "0");

  return (
    <div className="relative">
      {/* Decorative large step number */}
      <span
        className="heading-display pointer-events-none absolute -top-4 left-0 select-none text-8xl text-brand-orange/20"
        aria-hidden="true"
      >
        {formattedStep}
      </span>

      <div className="relative pt-14">
        <h3 className="heading-display text-xl text-brand-night">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/70">
          {description}
        </p>
      </div>
    </div>
  );
}
