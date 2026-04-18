"use client";

/**
 * SpecialtySwarmBinding — active la phase Collection Name avec le nom
 * de la spécialité survolée en particules (JANTES / MOTO / VOITURE /
 * PIÈCES MÉTALLIQUES), dans la couleur d'accent de la spécialité.
 *
 * Chaque niche a sa propre teinte signature cohérente avec son univers :
 *   jantes   → orange brand (#E85D2C) — feu/performance
 *   moto     → bleu acier (#4A6FA5) — précision métallique
 *   voiture  → rouge profond (#9B2C2C) — sportivité
 *   pieces   → bronze (#8B5A2B) — industriel
 */

import { useEffect, useMemo } from "react";
import { getSwarm } from "@/lib/nuee/store";
import { createCollectionNamePhase } from "@/lib/nuee/phases/collection-name";

type SpecialtySlug = "jantes" | "moto" | "voiture" | "pieces";

const SPECIALTY_LABELS: Record<SpecialtySlug, string> = {
  jantes: "JANTES",
  moto: "MOTO ART",
  voiture: "VOITURE",
  pieces: "PIÈCES",
};

const SPECIALTY_ACCENTS: Record<SpecialtySlug, string> = {
  jantes: "#E85D2C",   // brand orange — feu, performance
  moto: "#4A6FA5",     // bleu acier — précision
  voiture: "#9B2C2C",  // rouge profond — sportivité
  pieces: "#8B5A2B",   // bronze — industriel
};

export function SpecialtySwarmBinding({ slug }: { slug: string }) {
  const phase = useMemo(() => {
    const key = slug as SpecialtySlug;
    const label = SPECIALTY_LABELS[key] ?? slug.toUpperCase();
    const accent = SPECIALTY_ACCENTS[key] ?? "#E85D2C";
    return createCollectionNamePhase(label, accent);
  }, [slug]);

  useEffect(() => {
    const s = getSwarm();
    s.setAnchorOffsetX(0);
    s.setPhase(phase, { durationMs: 2200 });
    return () => s.setAnchorOffsetX(0);
  }, [phase]);

  return null;
}
