"use client";

/**
 * NavPreviewLink — Next.js Link qui déclenche un aperçu de la phase
 * nuée en survolant. Wrapped convenience so nav rendering stays
 * declarative.
 *
 * Sur hover/focus : morph vers la phase "attendue" pour la route
 * (collection name, service signature, etc.). Sur leave/blur : revert
 * à la phase précédente. Si l'user navigue, la route binding de la
 * destination prend le relais sans double-morph.
 */

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { usePreviewPhase } from "@/lib/nuee/preview-phase";
import type { Phase } from "@/lib/nuee/types";
import { createCollectionNamePhase } from "@/lib/nuee/phases/collection-name";
import { OVEN_PHASE } from "@/lib/nuee/phases/oven";
import { PAINT_GUN_PHASE } from "@/lib/nuee/phases/paint-gun";
import { RAL_CASCADE_PHASE } from "@/lib/nuee/phases/ral-cascade";
import { FLOW_PHASE } from "@/lib/nuee/phases/flow";
import { MOLTEN_POOL_PHASE } from "@/lib/nuee/phases/molten-pool";

// Collection accent colors (hex) mirror `src/lib/collections-data.ts`.
const COLLECTION_PREVIEW: Record<string, Phase> = {
  "/couleurs-ral/patina": createCollectionNamePhase("PATINA", "#A0522D"),
  "/couleurs-ral/polaris": createCollectionNamePhase("POLARIS", "#4A6FA5"),
  "/couleurs-ral/dichroic": createCollectionNamePhase("DICHROIC", "#7B2FBE"),
  "/couleurs-ral/sfera": createCollectionNamePhase("SFERA", "#B87333"),
};

/** Resolve href → phase. Returns null if no preview defined. */
function resolvePhase(href: string): Phase | null {
  if (COLLECTION_PREVIEW[href]) return COLLECTION_PREVIEW[href];
  if (href === "/couleurs-ral") return RAL_CASCADE_PHASE;
  if (href.startsWith("/services/thermolaquage")) return OVEN_PHASE;
  if (href.startsWith("/services/sablage")) return PAINT_GUN_PHASE;
  if (href.startsWith("/services/finitions")) return RAL_CASCADE_PHASE;
  if (href.startsWith("/services/metallisation")) return FLOW_PHASE;
  if (href === "/services") return MOLTEN_POOL_PHASE;
  if (href === "/devis" || href === "/rendez-vous" || href === "/contact") return FLOW_PHASE;
  return null;
}

interface NavPreviewLinkProps extends Omit<ComponentProps<typeof Link>, "href"> {
  href: string;
  children: ReactNode;
}

export function NavPreviewLink({ href, children, ...rest }: NavPreviewLinkProps) {
  const phase = resolvePhase(href);
  const preview = usePreviewPhase(() => phase ?? MOLTEN_POOL_PHASE);

  if (!phase) {
    // No preview phase known — render a plain Link with identical props.
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <Link href={href} {...rest} {...preview}>
      {children}
    </Link>
  );
}
