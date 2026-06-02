import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * TextReveal — wrapper de titre hero, TOUJOURS visible.
 *
 * Historique (4 bugs successifs, tous rendant des H1 invisibles) :
 *   1. framer blur+rise → cassait `background-clip: text` des spans gradient
 *   2. framer mot-à-mot → gelait à mi-course (opacity 0.3-0.55) en prod
 *   3. CSS fade-in opacity `both` → figé au frame 0 (getAnimations vide)
 *
 * Le H1 est un élément SEO + UX critique. On abandonne définitivement
 * l'animation d'entrée : rendu statique, opacity 1 garantie par la classe
 * `.az-text-reveal` (globals.css). Zéro dépendance JS, zéro surface de gel.
 * La signature (delay/stagger) est conservée pour compat des call-sites.
 */

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
}

export function TextReveal({ children, className }: TextRevealProps) {
  return <span className={cn("az-text-reveal", className)}>{children}</span>;
}
