"use client";

/**
 * PullQuote — citation mise en valeur, style magazine.
 *
 * Affiche un bloc avec :
 *  • Un grand guillemet ouvrant en gradient ember
 *  • La citation en gros (serif-ish via font-display)
 *  • Une attribution optionnelle en caps étroites
 *
 * Animation au scroll : fade + slide from left + blur, ease-out-expo.
 */

import { m, useReducedMotion } from "framer-motion";

interface PullQuoteProps {
  quote: string;
  author?: string;
  source?: string;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function PullQuote({ quote, author, source }: PullQuoteProps) {
  const reduce = useReducedMotion();
  const content = (
    <blockquote className="relative my-12 pl-8 sm:pl-14">
      <span
        aria-hidden
        className="absolute left-0 top-0 select-none bg-gradient-ember bg-clip-text font-display text-[5.5rem] font-black leading-[0.7] text-transparent sm:text-[7rem]"
      >
        “
      </span>
      <p className="heading-display text-2xl leading-snug text-brand-night sm:text-3xl">
        {quote}
      </p>
      {(author || source) && (
        <footer className="mt-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-charcoal/60">
          <span className="h-px w-8 bg-brand-orange" aria-hidden />
          {author && <span>{author}</span>}
          {author && source && <span className="text-brand-charcoal/30">·</span>}
          {source && <span className="text-brand-charcoal/45">{source}</span>}
        </footer>
      )}
    </blockquote>
  );

  if (reduce) return content;

  return (
    <m.div
      initial={{ opacity: 0, x: -20, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
    >
      {content}
    </m.div>
  );
}
