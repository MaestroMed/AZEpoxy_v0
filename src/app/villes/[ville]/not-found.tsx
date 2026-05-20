import Link from "next/link";
import { MapPin } from "lucide-react";

export default function VilleNotFound() {
  return (
    <section className="bg-brand-cream py-32">
      <div className="container-wide max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">
          <MapPin className="h-3 w-3" />
          Ville non listée
        </span>
        <h1 className="heading-display mt-6 text-4xl text-brand-night">
          Nous n&apos;avons pas encore de page dédiée à cette ville.
        </h1>
        <p className="mt-4 text-brand-charcoal/70">
          Nous intervenons partout en Île-de-France au départ de notre atelier
          de Bruyères-sur-Oise (95). Demandez un devis : nous calculons le
          coût d&apos;intervention en quelques heures.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/devis" className="btn-primary">
            Demander un devis gratuit
          </Link>
          <Link href="/contact" className="btn-secondary">
            Nous contacter
          </Link>
        </div>
      </div>
    </section>
  );
}
