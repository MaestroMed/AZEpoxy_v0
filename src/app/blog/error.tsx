"use client";

import Link from "next/link";

export default function BlogError({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="bg-brand-cream py-32">
      <div className="container-wide max-w-2xl text-center">
        <h1 className="heading-display text-3xl text-brand-night">
          Impossible de charger l&apos;article.
        </h1>
        <p className="mt-4 text-brand-charcoal/70">
          Une erreur est survenue. Réessayez ou retournez à la liste des articles.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={() => reset()} className="btn-primary" type="button">
            Réessayer
          </button>
          <Link href="/blog" className="btn-secondary">
            Tous les articles
          </Link>
        </div>
      </div>
    </section>
  );
}
