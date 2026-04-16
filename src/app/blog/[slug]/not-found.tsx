import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ArticleNotFound() {
  return (
    <section className="bg-brand-cream py-32">
      <div className="container-wide max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-orange">
          Article introuvable
        </p>
        <h1 className="heading-display mt-4 text-4xl text-brand-night">
          Cet article n&apos;existe plus.
        </h1>
        <p className="mt-4 text-brand-charcoal/70">
          Il a peut-être été déplacé. Retrouvez nos guides thermolaquage,
          jantes et finitions sur la page blog.
        </p>
        <Link href="/blog" className="btn-primary mt-8">
          <ArrowLeft className="h-4 w-4" />
          Retour au blog
        </Link>
      </div>
    </section>
  );
}
