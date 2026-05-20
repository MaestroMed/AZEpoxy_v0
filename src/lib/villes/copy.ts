/**
 * Composer functions — transforme les données structurées d'une Ville
 * en blocs de copy uniques.
 *
 * Pourquoi : Google détecte les "doorway pages" (mass-prod templated
 * city pages). Notre défense : chaque page surface du contenu réellement
 * unique, composé à partir de faits vérifiables (distance, trajet,
 * quartiers, industries) — pas un template avec juste le nom changé.
 *
 * Toutes les fonctions ici sont déterministes et sans I/O : elles
 * tournent côté serveur au build / au request, à coût zéro.
 */

import {
  driveTier,
  INDUSTRY_LABEL,
  type Industry,
  type Ville,
} from "@/lib/villes-data";

/* ── Intro / hero ──────────────────────────────────────────────── */

/**
 * Première phrase du hero — utilise `customIntro` si dispo, sinon
 * compose à partir de la géographie.
 */
export function composeIntroParagraph(ville: Ville): string {
  if (ville.customIntro && ville.customIntro.length > 30) {
    return ville.customIntro;
  }
  // Fallback composé depuis les data structurées.
  const tier = driveTier(ville.driveTimeMin);
  const proximity =
    tier === "proche"
      ? `à seulement ${ville.distance} de notre atelier`
      : tier === "moyen"
        ? `à ${ville.distance} de notre atelier, soit ${ville.driveTime} de trajet`
        : `à ${ville.distance} de Bruyères-sur-Oise, accessible en ${ville.driveTime} via ${ville.access}`;

  const industries = ville.industries ?? [];
  const industryClause = industries.length
    ? `Le tissu local — ${industries
        .slice(0, 3)
        .map((i) => INDUSTRY_LABEL[i].toLowerCase())
        .join(", ")} — fait régulièrement appel à notre savoir-faire`
    : `Les artisans métalliers, les particuliers et les bureaux d'études locaux nous confient leurs pièces`;

  return `AZ Époxy intervient à ${ville.name} (${ville.departmentCode}, ${ville.department}), ${proximity}. ${industryClause} pour le thermolaquage poudre époxy de leurs portails, garde-corps, jantes, pièces industrielles et mobilier extérieur.`;
}

/* ── Stats hero ─────────────────────────────────────────────────── */

export function composeHeroStats(ville: Ville): {
  label: string;
  value: string;
}[] {
  return [
    { label: "Distance atelier", value: ville.distance },
    { label: "Trajet voiture", value: ville.driveTime },
    { label: "Express disponible", value: "48 h" },
    { label: "Couleurs RAL & NCS", value: "200+" },
  ];
}

/* ── Client archetypes ─────────────────────────────────────────── */

const ARCHETYPE_COPY: Record<Industry, { title: string; desc: string }> = {
  metallerie: {
    title: "Métalliers & serruriers",
    desc: "Portails, grilles, garde-corps, escaliers métalliques. Production en série ou rénovation unitaire — nous prenons les cadences et la qualité de finition.",
  },
  ferronnerie: {
    title: "Ferronnerie d'art",
    desc: "Rampes ouvragées, balcons en fer forgé, grilles de patrimoine. Thermolaquage avec finitions mates ou patines architecturales, dans le respect du dessin original.",
  },
  automobile: {
    title: "Carrossiers & préparateurs auto",
    desc: "Jantes, étriers, châssis, accessoires custom. Effets métalliques, anodisés, irisés — tout le nuancier RAL et nos collections premium accessibles.",
  },
  moto: {
    title: "Préparateurs moto",
    desc: "Cadres, jantes, swing-arms, fourches. Démontage maîtrisé, finition mat profond ou candy translucide, retour livré et emballé.",
  },
  industrie: {
    title: "Industriels & fabricants",
    desc: "Pièces de série, sous-traitance de finition, traitement anti-corrosion C5. Devis cadre annuel, planning dédié, qualité constante lot après lot.",
  },
  promotion: {
    title: "Promoteurs & constructeurs",
    desc: "Menuiseries aluminium, ferronnerie de bâtiment, mobilier urbain neuf. Fiches techniques RAL et NCS détaillées pour les bureaux d'études.",
  },
  architectes: {
    title: "Architectes & bureaux d'études",
    desc: "Conseil amont sur les teintes RAL et NCS, échantillons sur demande, conformité aux normes Qualicoat / ISO 12944. Suivi de chantier disponible.",
  },
  "mobilier-urbain": {
    title: "Collectivités & mobilier urbain",
    desc: "Bancs, candélabres, signalétique, abris. Traitement anti-graffiti possible, résistance UV longue durée pour l'espace public.",
  },
  particuliers: {
    title: "Particuliers exigeants",
    desc: "Portails, clôtures, garde-corps, mobilier extérieur, pièces auto de collection. Devis gratuit sous 24 h, enlèvement et restitution sur demande.",
  },
  chaudronnerie: {
    title: "Chaudronniers",
    desc: "Ensembles chaudronnés, charpentes, châssis volumineux. Cabine 7 × 3 × 4 m capable d'accueillir les pièces hors-normes des ateliers de la vallée.",
  },
  renovation: {
    title: "Chantiers de rénovation",
    desc: "ANRU, copropriétés, bailleurs sociaux. Reprise complète de garde-corps de balcon, clôtures et portails dans le cadre des opérations de réhabilitation.",
  },
};

export function composeClientArchetypes(
  ville: Ville,
): { title: string; desc: string }[] {
  const industries = ville.industries ?? [];
  if (industries.length === 0) {
    // Fallback générique
    return [
      ARCHETYPE_COPY.particuliers,
      ARCHETYPE_COPY.metallerie,
      ARCHETYPE_COPY.architectes,
    ];
  }
  return industries.slice(0, 6).map((i) => ARCHETYPE_COPY[i]);
}

/* ── FAQ locale ────────────────────────────────────────────────── */

export interface LocalFaq {
  question: string;
  answer: string;
}

/**
 * 4-5 Q&A composées depuis les data — chaque page a une FAQ
 * littéralement unique (mentionne la ville, le trajet, les quartiers).
 */
export function composeLocalFaq(ville: Ville): LocalFaq[] {
  const tier = driveTier(ville.driveTimeMin);
  const faqs: LocalFaq[] = [];

  // Q1 — Intervention possible ?
  faqs.push({
    question: `Vous prenez en charge des pièces à ${ville.name} ?`,
    answer: `Oui, nous traitons régulièrement des projets à ${ville.name} (${ville.departmentCode}). ${
      tier === "proche"
        ? `Avec ${ville.distance} entre notre atelier de Bruyères-sur-Oise et ${ville.name}, l'enlèvement et la restitution sont possibles en une demi-journée.`
        : tier === "moyen"
          ? `${ville.name} est à ${ville.distance} de notre atelier, soit ${ville.driveTime} de trajet via ${ville.access}. Un enlèvement / livraison est organisable selon le volume.`
          : `${ville.name} se situe à ${ville.distance} de Bruyères-sur-Oise. Pour les commandes de série, nous organisons un transport groupé optimisé.`
    }`,
  });

  // Q2 — Délais ?
  faqs.push({
    question: `Quels sont les délais pour un thermolaquage depuis ${ville.name} ?`,
    answer: `Le délai standard est de 5 à 10 jours ouvrés à compter de la réception en atelier, selon la complexité de la pièce et la finition demandée. Un service express 48 h est disponible sur demande pour les urgences. ${
      tier === "proche"
        ? `La proximité de ${ville.name} permet souvent un dépôt le matin et une reprise dès la fin de cycle.`
        : `Pour les clients de ${ville.name}, nous bloquons un créneau de retour rapide une fois la finition validée.`
    }`,
  });

  // Q3 — Quartiers / zone (si on a des neighborhoods)
  if (ville.neighborhoods && ville.neighborhoods.length > 0) {
    const list = ville.neighborhoods.slice(0, 4).join(", ");
    faqs.push({
      question: `Vous intervenez dans tous les quartiers de ${ville.name} ?`,
      answer: `Oui, notre rayon d'intervention couvre l'intégralité de ${ville.name}, notamment ${list}. Pour les pièces de grande dimension (portails, charpentes), notre cabine 7 × 3 × 4 m accueille les ouvrages que peu d'ateliers franciliens peuvent traiter.`,
    });
  }

  // Q4 — Devis
  faqs.push({
    question: `Comment obtenir un devis depuis ${ville.name} ?`,
    answer: `Trois options : (1) formulaire en ligne avec photos de la pièce — réponse sous 24 h, (2) visite d'atelier sur rendez-vous pour étudier un projet complexe, (3) appel direct au 09 71 35 74 96. Pour les professionnels de ${ville.name}, un devis cadre annuel est négociable avec planning dédié.`,
  });

  // Q5 — Couleurs (universel mais contextualisé)
  faqs.push({
    question: `Quelles couleurs sont disponibles pour les chantiers de ${ville.name} ?`,
    answer: `L'intégralité du nuancier RAL Classic (200+ teintes) et du Natural Color System (NCS), plus quatre familles d'effets architecturaux : Corten oxydés, Métalliques structurés, Irisés dichroïques et Anodisés cosmos. Les architectes et BE de ${ville.name} peuvent recevoir un nuancier physique sur demande.`,
  });

  return faqs;
}

/* ── Comment ça se passe (process locality) ────────────────────── */

export function composeProcessSteps(
  ville: Ville,
): { label: string; description: string }[] {
  const tier = driveTier(ville.driveTimeMin);
  return [
    {
      label: "1 — Contact & devis",
      description: `Vous nous envoyez les photos et dimensions depuis ${ville.name}. Réponse chiffrée sous 24 h.`,
    },
    {
      label: "2 — Dépôt ou enlèvement",
      description:
        tier === "proche"
          ? `Vous déposez sur place à Bruyères-sur-Oise (${ville.driveTime} depuis ${ville.name}) ou nous organisons un enlèvement.`
          : tier === "moyen"
            ? `Dépôt à l'atelier (${ville.driveTime} via ${ville.access}) ou enlèvement groupé sur ${ville.name} pour les commandes pros.`
            : `Enlèvement organisé sur ${ville.name} (${ville.driveTime}) ou prise en charge logistique pour les grosses commandes.`,
    },
    {
      label: "3 — Procédé en atelier",
      description:
        "Préparation (sablage SA 2.5), dégraissage, primaire d'accrochage, application poudre 60-80 µm au pistolet électrostatique, cuisson en four — cycle ajusté à la pièce.",
    },
    {
      label: "4 — Contrôle qualité",
      description:
        "Mesure d'épaisseur au micromètre, test d'adhérence cross-cut ISO 2409, inspection visuelle sous éclairage contrôlé. Aucune pièce ne quitte l'atelier sans validation.",
    },
    {
      label: "5 — Retour à " + ville.name,
      description:
        tier === "proche"
          ? `Pièce restituée en main propre ou livrée à ${ville.name} dans la foulée du contrôle.`
          : `Pièce emballée puis livrée à ${ville.name}, ou récupération sur place à Bruyères-sur-Oise selon vos préférences.`,
    },
  ];
}

/* ── Schema.org FAQPage payload ────────────────────────────────── */

export function composeFaqJsonLd(faqs: LocalFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

/* ── Word count (helper QA) ────────────────────────────────────── */

export function countComposedWords(ville: Ville): number {
  const blocks = [
    composeIntroParagraph(ville),
    ...composeClientArchetypes(ville).map((a) => `${a.title} ${a.desc}`),
    ...composeLocalFaq(ville).map((f) => `${f.question} ${f.answer}`),
    ...composeProcessSteps(ville).map((p) => `${p.label} ${p.description}`),
  ];
  const text = blocks.join(" ");
  return text.split(/\s+/).filter((w) => w.length > 0).length;
}
