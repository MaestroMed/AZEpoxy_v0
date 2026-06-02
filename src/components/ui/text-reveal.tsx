import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * TextReveal — entrée fade-in pour les titres hero.
 *
 * IMPORTANT — historique : l'ancienne implémentation framer-motion
 * découpait le titre mot-à-mot et animait chaque span via `m.span`
 * (`animate="visible"`). Sous LazyMotion, ces animations GELAIENT de
 * façon flaky à mi-parcours (opacity 0.3-0.55, et le span gradient
 * bg-clip-text à 0) → des H1 entiers invisibles par intermittence sur
 * toutes les pages PageHero / CtaBand. C'est un élément SEO majeur :
 * inacceptable.
 *
 * Nouvelle implémentation : CSS pur, état au repos = VISIBLE. L'entrée
 * est un simple fade-in (`az-text-reveal` dans globals.css) en
 * animation-fill-mode both. Si l'animation ne tourne pas (JS off,
 * reduced-motion, throttling, hydration), le texte reste à opacity 1.
 * Zéro dépendance JS, zéro surface de gel, et pas de transform → le
 * `background-clip: text` des spans gradient n'est jamais cassé.
 */

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  /** Conservé pour compat de signature — délai d'entrée en ms. */
  delay?: number;
  /** Conservé pour compat — ignoré (plus de stagger mot-à-mot). */
  stagger?: number;
}

export function TextReveal({ children, className, delay }: TextRevealProps) {
  return (
    <span
      className={cn("az-text-reveal", className)}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </span>
  );
}
