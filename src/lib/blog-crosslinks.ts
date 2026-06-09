/**
 * Maillage interne contextuel pour les articles de blog.
 *
 * Injecte des liens éditoriaux vers les pages "argent" (services /
 * spécialités / nuancier) directement dans le corps HTML de l'article,
 * sur la première occurrence pertinente de chaque terme. Le but SEO :
 * transmettre du jus de lien avec une ancre descriptive, depuis du
 * contenu informationnel vers les pages de conversion.
 *
 * Sûreté : on tokenise le HTML (balises vs texte) et on n'injecte QUE
 * dans les nœuds texte situés hors d'un `<a>` et hors d'un titre
 * (`<h1>`–`<h6>`). On ne touche jamais à l'intérieur d'une balise, ce
 * qui garantit qu'on ne casse pas le markup existant.
 */

interface CrossLinkRule {
  /** Doit matcher un mot entier ; insensible à la casse. */
  re: RegExp;
  href: string;
  /** N'injecte pas ce lien si l'article porte ce slug (auto-référence). */
  skipForSlug?: string;
}

// Ordre = priorité d'injection (les termes les plus spécifiques d'abord).
const RULES: CrossLinkRule[] = [
  { re: /\bjantes?(?:\s+(?:alu(?:minium)?|auto|moto))?\b/i, href: "/specialites/jantes", skipForSlug: "preparer-jantes-thermolaquage" },
  { re: /\bsablage\b/i, href: "/services/sablage" },
  { re: /\b(?:nuancier|couleurs?)\s+RAL\b/i, href: "/couleurs-ral" },
  { re: /\bthermolaquage\s+(?:de\s+)?moto(?:s|cyclettes?)?\b/i, href: "/specialites/moto" },
  { re: /\bthermolaquage\s+(?:de\s+)?portail\b/i, href: "/specialites/portail", skipForSlug: "thermolaquage-portail-prix-duree-entretien" },
  { re: /\ba[ée]rogommage\b/i, href: "/specialites/sablage-aerogommage", skipForSlug: "sablage-ou-aerogommage-lequel-choisir" },
  { re: /\bfinitions?\s+(?:sp[ée]ciales?|mat(?:es?)?|satin[ée]es?|textur[ée]es?)\b/i, href: "/services/finitions" },
];

const MAX_LINKS = 3;
const ANCHOR_CLASS =
  "font-semibold text-brand-orange-dark underline decoration-brand-orange/40 underline-offset-2 hover:decoration-brand-orange";

const TAG_RE = /(<[^>]*>)/;

function isOpening(token: string, tag: string): boolean {
  return new RegExp(`^<${tag}(\\s|>|/)`, "i").test(token);
}
function isClosing(token: string, tag: string): boolean {
  return new RegExp(`^</${tag}\\s*>`, "i").test(token);
}

/**
 * Renvoie le HTML de l'article enrichi de liens internes contextuels.
 * @param html    Contenu HTML de confiance (authored in blog-data.ts).
 * @param slug    Slug de l'article courant (pour éviter l'auto-référence).
 */
export function injectCrossLinks(html: string, slug: string): string {
  const rules = RULES.filter((r) => r.skipForSlug !== slug);
  const used = new Set<string>();
  let injected = 0;

  const tokens = html.split(TAG_RE);
  let anchorDepth = 0;
  let headingDepth = 0;

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (!tok) continue;

    // Balise : on met à jour la profondeur des contextes à éviter.
    if (tok.startsWith("<")) {
      if (isOpening(tok, "a")) anchorDepth++;
      else if (isClosing(tok, "a")) anchorDepth = Math.max(0, anchorDepth - 1);
      else if (/^<h[1-6](\s|>)/i.test(tok)) headingDepth++;
      else if (/^<\/h[1-6]\s*>/i.test(tok)) headingDepth = Math.max(0, headingDepth - 1);
      continue;
    }

    // Nœud texte hors contexte interdit : on tente une injection.
    if (anchorDepth > 0 || headingDepth > 0 || injected >= MAX_LINKS) continue;

    let text = tok;
    for (const rule of rules) {
      if (injected >= MAX_LINKS) break;
      if (used.has(rule.href)) continue;
      const m = text.match(rule.re);
      if (!m || m.index === undefined) continue;
      const matched = m[0];
      const anchor = `<a href="${rule.href}" class="${ANCHOR_CLASS}">${matched}</a>`;
      text = text.slice(0, m.index) + anchor + text.slice(m.index + matched.length);
      used.add(rule.href);
      injected++;
    }
    tokens[i] = text;
  }

  return tokens.join("");
}
