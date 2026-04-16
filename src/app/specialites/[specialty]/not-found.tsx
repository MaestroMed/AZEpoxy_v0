import Link from "next/link";

export default function SpecialtyNotFound() {
  return (
    <section className="bg-brand-cream py-32">
      <div className="container-wide max-w-2xl text-center">
        <h1 className="heading-display text-4xl text-brand-night">
          Spécialité introuvable.
        </h1>
        <p className="mt-4 text-brand-charcoal/70">
          Nos spécialités&nbsp;: jantes auto, moto, pièces auto et pièces
          métalliques.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/specialites/jantes" className="btn-primary">
            Voir toutes les spécialités
          </Link>
          <Link href="/services" className="btn-secondary">
            Nos services
          </Link>
        </div>
      </div>
    </section>
  );
}
