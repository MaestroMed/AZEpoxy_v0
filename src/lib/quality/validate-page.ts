/**
 * Quality gate anti-désindexation (Vague SEO 1500 pages).
 *
 * Empêche la publication de toute page thin ou quasi-dupliquée — le motif
 * exact que Google sanctionne en "scaled content abuse". Une page ne passe le
 * gate que si elle apporte une valeur unique vérifiable.
 *
 * Fonctions PURES (aucun import server-only) → utilisables au build, dans un
 * script d'audit, ou dans un cron de gouvernance.
 *
 * Algorithme de quasi-duplication : w-shingles (5-grammes de mots) + similarité
 * de Jaccard. Seuil FAIL = 0,40 (deux pages ne différant que par la ville
 * dépassent vite ce seuil). Pour ≤ ~2000 pages, la comparaison directe O(n²)
 * suffit ; au-delà, brancher un MinHash + LSH (la signature est déjà calculée
 * via `shingleSet`).
 */

// ── Normalisation ───────────────────────────────────────────────────────────

const FR_STOPWORDS = new Set([
  "le", "la", "les", "un", "une", "des", "de", "du", "d", "l", "et", "ou",
  "a", "à", "au", "aux", "en", "dans", "sur", "pour", "par", "avec", "sans",
  "ce", "cet", "cette", "ces", "que", "qui", "quoi", "dont", "où", "se", "sa",
  "son", "ses", "votre", "vos", "nos", "notre", "est", "sont", "ont", "il",
  "elle", "vous", "nous", "plus", "moins", "très", "tout", "tous", "toute",
  "comme", "mais", "donc", "car", "ne", "pas", "y", "s", "n", "the",
]);

export function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents (combining marks)
    .replace(/<[^>]*>/g, " ") // strip any markup
    .replace(/[^a-z0-9\s]/g, " ") // strip punctuation
    .replace(/\s+/g, " ")
    .trim();
}

export function tokens(s: string, dropStopwords = true): string[] {
  const t = normalizeText(s).split(" ").filter(Boolean);
  return dropStopwords ? t.filter((w) => !FR_STOPWORDS.has(w)) : t;
}

/** Ensemble des w-shingles (n-grammes de mots glissants). */
export function shingleSet(text: string, w = 5): Set<string> {
  const t = tokens(text, false);
  const set = new Set<string>();
  if (t.length < w) {
    if (t.length) set.add(t.join(" "));
    return set;
  }
  for (let i = 0; i + w <= t.length; i++) set.add(t.slice(i, i + w).join(" "));
  return set;
}

export function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let inter = 0;
  const [small, large] = a.size < b.size ? [a, b] : [b, a];
  for (const s of small) if (large.has(s)) inter++;
  return inter / (a.size + b.size - inter);
}

/** Hash simple et stable d'une intro normalisée (détection d'intro identique). */
export function introHash(intro: string): string {
  const norm = tokens(intro).join(" ");
  let h = 5381;
  for (let i = 0; i < norm.length; i++) h = ((h << 5) + h + norm.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

// ── Types ────────────────────────────────────────────────────────────────────

export type PageType =
  | "combo"
  | "geo"
  | "specialite"
  | "service"
  | "teinte-ral"
  | "blog";

export interface PageContent {
  url: string;
  type: PageType;
  title: string;
  metaDescription: string;
  h1: string;
  /** 1er bloc rédactionnel unique (= localAngle pour les combos). */
  intro: string;
  /** Tout le texte rédactionnel de la page (sans markup). */
  bodyText: string;
  /** Texte provenant du gabarit partagé (boilerplate connu). */
  templateText: string;
  internalLinks: { href: string; anchor: string }[];
  schemaTypes: string[];
}

export interface GateFailure {
  code: string;
  message: string;
  observed: number | string;
  threshold: number | string;
}

export interface GateResult {
  url: string;
  score: number; // 0–100
  status: "PASS" | "WARN" | "FAIL";
  failures: GateFailure[];
  warnings: GateFailure[];
}

/** Contexte global accumulé au fil des pages déjà validées. */
export interface GlobalContext {
  titles: Set<string>;
  metas: Set<string>;
  h1s: Set<string>;
  introHashes: Set<string>;
  shingles: { url: string; set: Set<string> }[];
}

export function emptyContext(): GlobalContext {
  return {
    titles: new Set(),
    metas: new Set(),
    h1s: new Set(),
    introHashes: new Set(),
    shingles: [],
  };
}

const REQUIRED_SCHEMA: Record<PageType, string[]> = {
  combo: ["Service", "BreadcrumbList"],
  geo: ["LocalBusiness", "BreadcrumbList"],
  specialite: ["Service", "FAQPage", "BreadcrumbList"],
  service: ["Service", "FAQPage", "BreadcrumbList"],
  "teinte-ral": ["BreadcrumbList"],
  blog: ["Article", "BreadcrumbList"],
};

// Seuils
const MIN_UNIQUE_WORDS = 300;
const WARN_UNIQUE_WORDS = 450;
const MIN_DATA_RATIO = 0.25;
const WARN_DATA_RATIO = 0.35;
const MIN_INTRO_WORDS = 50;
const NEAR_DUP_FAIL = 0.4;
const NEAR_DUP_WARN = 0.3;
const MIN_INTERNAL_LINKS = 3;

/**
 * Valide une page contre tous les gates, en tenant compte des pages déjà vues
 * (ctx). MUTE ctx (ajoute la page) seulement si on le demande via `commit`.
 */
export function validatePage(
  page: PageContent,
  ctx: GlobalContext,
  commit = true,
): GateResult {
  const failures: GateFailure[] = [];
  const warnings: GateFailure[] = [];

  // Mots hors boilerplate
  const tplSet = new Set(tokens(page.templateText));
  const bodyTokens = tokens(page.bodyText);
  const uniqueWords = bodyTokens.filter((w) => !tplSet.has(w)).length;
  if (uniqueWords < MIN_UNIQUE_WORDS) {
    failures.push({ code: "THIN_WORDCOUNT", message: "Trop peu de mots hors gabarit", observed: uniqueWords, threshold: MIN_UNIQUE_WORDS });
  } else if (uniqueWords < WARN_UNIQUE_WORDS) {
    warnings.push({ code: "THIN_WORDCOUNT", message: "Contenu un peu court", observed: uniqueWords, threshold: WARN_UNIQUE_WORDS });
  }

  // Ratio de données réelles (variables vs gabarit)
  const dataRatio = bodyTokens.length ? uniqueWords / bodyTokens.length : 0;
  if (dataRatio < MIN_DATA_RATIO) {
    failures.push({ code: "LOW_DATA_RATIO", message: "Trop de gabarit, pas assez de données locales", observed: dataRatio.toFixed(2), threshold: MIN_DATA_RATIO });
  } else if (dataRatio < WARN_DATA_RATIO) {
    warnings.push({ code: "LOW_DATA_RATIO", message: "Ratio de données réelles faible", observed: dataRatio.toFixed(2), threshold: WARN_DATA_RATIO });
  }

  // Unicité title / meta / H1
  if (ctx.titles.has(page.title)) failures.push({ code: "DUP_TITLE", message: "Title déjà utilisé", observed: page.title, threshold: "unique" });
  if (ctx.metas.has(page.metaDescription)) failures.push({ code: "DUP_META", message: "Meta description dupliquée", observed: page.metaDescription.slice(0, 40), threshold: "unique" });
  if (ctx.h1s.has(page.h1)) failures.push({ code: "DUP_H1", message: "H1 dupliqué", observed: page.h1, threshold: "unique" });

  // Intro : longueur + unicité
  const introWords = tokens(page.intro).length;
  if (introWords < MIN_INTRO_WORDS) {
    warnings.push({ code: "SHORT_INTRO", message: "Intro trop courte", observed: introWords, threshold: MIN_INTRO_WORDS });
  }
  const ih = introHash(page.intro);
  if (ctx.introHashes.has(ih)) failures.push({ code: "DUP_INTRO", message: "Intro identique à une autre page", observed: page.url, threshold: "unique" });

  // Quasi-duplication corps
  const sh = shingleSet(page.bodyText);
  let maxJ = 0;
  let maxUrl = "";
  for (const other of ctx.shingles) {
    const j = jaccard(sh, other.set);
    if (j > maxJ) { maxJ = j; maxUrl = other.url; }
  }
  if (maxJ >= NEAR_DUP_FAIL) {
    failures.push({ code: "NEAR_DUPLICATE", message: `Quasi-doublon de ${maxUrl}`, observed: maxJ.toFixed(2), threshold: NEAR_DUP_FAIL });
  } else if (maxJ >= NEAR_DUP_WARN) {
    warnings.push({ code: "NEAR_DUPLICATE", message: `Proche de ${maxUrl}`, observed: maxJ.toFixed(2), threshold: NEAR_DUP_WARN });
  }

  // Liens internes contextualisés (ancre ≥ 2 mots, href interne)
  const ctxLinks = page.internalLinks.filter(
    (l) => l.href.startsWith("/") && tokens(l.anchor, false).length >= 2,
  ).length;
  if (ctxLinks < MIN_INTERNAL_LINKS) {
    warnings.push({ code: "LOW_INTERNAL_LINKS", message: "Pas assez de liens internes contextualisés", observed: ctxLinks, threshold: MIN_INTERNAL_LINKS });
  }

  // Schémas requis
  const missing = REQUIRED_SCHEMA[page.type].filter((s) => !page.schemaTypes.includes(s));
  if (missing.length) {
    failures.push({ code: "MISSING_SCHEMA", message: `Schema manquant : ${missing.join(", ")}`, observed: page.schemaTypes.join(",") || "aucun", threshold: REQUIRED_SCHEMA[page.type].join(",") });
  }

  // Score pondéré
  let score = 100;
  score -= failures.some((f) => f.code === "THIN_WORDCOUNT") ? 20 : warnings.some((w) => w.code === "THIN_WORDCOUNT") ? 8 : 0;
  score -= failures.some((f) => f.code === "LOW_DATA_RATIO") ? 20 : warnings.some((w) => w.code === "LOW_DATA_RATIO") ? 8 : 0;
  score -= failures.some((f) => f.code === "NEAR_DUPLICATE") ? 15 : warnings.some((w) => w.code === "NEAR_DUPLICATE") ? 7 : 0;
  score -= failures.some((f) => f.code === "DUP_INTRO") || warnings.some((w) => w.code === "SHORT_INTRO") ? 10 : 0;
  score -= failures.some((f) => ["DUP_TITLE", "DUP_META", "DUP_H1"].includes(f.code)) ? 10 : 0;
  score -= warnings.some((w) => w.code === "LOW_INTERNAL_LINKS") ? 5 : 0;
  score -= failures.some((f) => f.code === "MISSING_SCHEMA") ? 5 : 0;
  score = Math.max(0, score);

  const status: GateResult["status"] =
    failures.length > 0 || score < 70 ? "FAIL" : score < 85 ? "WARN" : "PASS";

  if (commit && status !== "FAIL") {
    ctx.titles.add(page.title);
    ctx.metas.add(page.metaDescription);
    ctx.h1s.add(page.h1);
    ctx.introHashes.add(ih);
    ctx.shingles.push({ url: page.url, set: sh });
  }

  return { url: page.url, score, status, failures, warnings };
}
