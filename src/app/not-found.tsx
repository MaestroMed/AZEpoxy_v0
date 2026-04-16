import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative isolate min-h-[80vh] overflow-hidden bg-brand-night text-white">
      <div className="absolute inset-0 bg-gradient-night" />
      <div className="absolute inset-0 bg-industrial-grid-dark opacity-40" />
      <div className="absolute -left-40 top-1/3 h-[500px] w-[500px] rounded-full bg-brand-orange/20 blur-[140px]" />
      <div className="container-wide relative flex min-h-[80vh] flex-col items-start justify-center pt-40 pb-20">
        <span className="section-label-light">
          <Compass className="h-3 w-3" />
          Erreur 404
        </span>
        <h1 className="heading-display mt-6 text-balance text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
          Cette page n&apos;existe{" "}
          <span className="bg-gradient-ember bg-clip-text text-transparent">
            plus.
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-balance text-lg text-white/70">
          Le lien est peut-être obsolète. Voici quelques pistes pour retrouver
          ce que vous cherchez.
        </p>
        <div className="mt-10 grid w-full max-w-3xl gap-3 sm:grid-cols-2">
          <NotFoundCard
            href="/services"
            title="Nos services"
            description="Thermolaquage, sablage, métallisation, finitions spéciales."
          />
          <NotFoundCard
            href="/couleurs-ral"
            title="Nuancier RAL"
            description="200+ couleurs et collections exclusives."
          />
          <NotFoundCard
            href="/realisations"
            title="Réalisations"
            description="Quelques-uns de nos chantiers récents."
          />
          <NotFoundCard
            href="/devis"
            title="Devis gratuit"
            description="Réponse sous 24h, photos bienvenues."
          />
        </div>
        <Link href="/" className="btn-primary mt-10">
          Retour à l&apos;accueil
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function NotFoundCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-colors hover:border-brand-orange/60 hover:bg-white/10"
    >
      <div>
        <p className="font-display text-lg font-semibold text-white">{title}</p>
        <p className="mt-1 text-sm text-white/60">{description}</p>
      </div>
      <ArrowRight className="h-5 w-5 shrink-0 text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-brand-orange" />
    </Link>
  );
}
