import Link from "next/link";

export default function CollectionNotFound() {
  return (
    <section className="bg-brand-cream py-32">
      <div className="container-wide max-w-2xl text-center">
        <h1 className="heading-display text-4xl text-brand-night">
          Collection introuvable.
        </h1>
        <p className="mt-4 text-brand-charcoal/70">
          Nos collections exclusives&nbsp;: Patina, Polaris, Dichroic, Sfera.
        </p>
        <Link href="/couleurs-ral" className="btn-primary mt-8">
          Voir le nuancier complet
        </Link>
      </div>
    </section>
  );
}
