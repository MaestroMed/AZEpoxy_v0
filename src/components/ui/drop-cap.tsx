"use client";

/**
 * DropCap — première lettre d'un paragraphe en grande capitale
 * illustrée, style magazine éditorial. Signature typographique.
 *
 * Usage : <DropCap>Premier paragraphe de l'article...</DropCap>
 * La première lettre est détachée, les lignes suivantes s'enroulent
 * autour via `float: left`.
 */

import { m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface DropCapProps {
  children: ReactNode;
  className?: string;
}

export function DropCap({ children, className }: DropCapProps) {
  const prefersReduced = useReducedMotion();

  // Extract first character from string children if possible.
  if (typeof children !== "string") {
    return <p className={className}>{children}</p>;
  }
  const first = children.charAt(0);
  const rest = children.slice(1);

  const letter = prefersReduced ? (
    <span
      className="float-left mr-3 -mt-1 font-display text-[5.5rem] font-black leading-[0.8] text-brand-orange"
      aria-hidden
    >
      {first}
    </span>
  ) : (
    <m.span
      initial={{ opacity: 0, scale: 0.6, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="float-left mr-3 -mt-1 font-display text-[5.5rem] font-black leading-[0.8] text-brand-orange"
      aria-hidden
    >
      {first}
    </m.span>
  );

  return (
    <p className={className}>
      {letter}
      {/* Aria concatenates first + rest for screen readers */}
      <span className="sr-only">{first}</span>
      {rest}
    </p>
  );
}
