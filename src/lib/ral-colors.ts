/**
 * RAL color catalog — curated subset of the RAL Classic palette.
 * Full extension with the complete 209+ RAL Classic list planned in ULTRAPLAN.md.
 *
 * Each entry carries:
 *  - code:   RAL reference (e.g., "RAL 9005")
 *  - name:   French human name
 *  - hex:    approximate sRGB hex for UI preview (not for print/spec matching)
 *  - family: grouping used by the picker (jaune, orange, rouge, violet, bleu,
 *            vert, gris, brun, noir, blanc)
 *  - popular: whether this color is in the "most popular" shortlist surfaced
 *             by the homepage marquee and quick-filter chips.
 */

export type RALFamily =
  | "jaune"
  | "orange"
  | "rouge"
  | "violet"
  | "bleu"
  | "vert"
  | "gris"
  | "brun"
  | "noir"
  | "blanc";

export interface RALColor {
  code: string;
  name: string;
  hex: string;
  family: RALFamily;
  popular?: boolean;
}

export const RAL_FAMILIES: { key: RALFamily; label: string; hex: string }[] = [
  { key: "jaune", label: "Jaune", hex: "#F4C430" },
  { key: "orange", label: "Orange", hex: "#E85D2C" },
  { key: "rouge", label: "Rouge", hex: "#B32428" },
  { key: "violet", label: "Violet", hex: "#6A3B6A" },
  { key: "bleu", label: "Bleu", hex: "#1D4E89" },
  { key: "vert", label: "Vert", hex: "#2E7D32" },
  { key: "gris", label: "Gris", hex: "#6C6F70" },
  { key: "brun", label: "Brun", hex: "#6B4423" },
  { key: "noir", label: "Noir", hex: "#1C1C1C" },
  { key: "blanc", label: "Blanc", hex: "#F4F4F0" },
];

export const RAL_COLORS: RALColor[] = [
  // Jaunes
  { code: "RAL 1003", name: "Jaune signalisation", hex: "#F7BA0B", family: "jaune", popular: true },
  { code: "RAL 1007", name: "Jaune narcisse", hex: "#E88C00", family: "jaune" },
  { code: "RAL 1018", name: "Jaune zinc", hex: "#F8F32B", family: "jaune" },
  { code: "RAL 1021", name: "Jaune colza", hex: "#EEC900", family: "jaune" },
  { code: "RAL 1023", name: "Jaune signalisation", hex: "#F0CA00", family: "jaune" },
  // Oranges
  { code: "RAL 2000", name: "Orangé jaune", hex: "#ED760E", family: "orange" },
  { code: "RAL 2004", name: "Orangé pur", hex: "#F44611", family: "orange", popular: true },
  { code: "RAL 2008", name: "Orangé rouge clair", hex: "#F3752C", family: "orange" },
  { code: "RAL 2009", name: "Orangé signalisation", hex: "#E55137", family: "orange" },
  { code: "RAL 2011", name: "Orangé foncé", hex: "#D4652F", family: "orange" },
  // Rouges
  { code: "RAL 3000", name: "Rouge feu", hex: "#AF2B1E", family: "rouge", popular: true },
  { code: "RAL 3002", name: "Rouge carmin", hex: "#A52019", family: "rouge" },
  { code: "RAL 3003", name: "Rouge rubis", hex: "#9B111E", family: "rouge" },
  { code: "RAL 3004", name: "Rouge pourpre", hex: "#75151E", family: "rouge" },
  { code: "RAL 3005", name: "Rouge vin", hex: "#5E2129", family: "rouge" },
  { code: "RAL 3020", name: "Rouge signalisation", hex: "#CC0605", family: "rouge", popular: true },
  // Violets
  { code: "RAL 4001", name: "Lilas rouge", hex: "#6D3F5B", family: "violet" },
  { code: "RAL 4003", name: "Violet érica", hex: "#C63678", family: "violet" },
  { code: "RAL 4005", name: "Lilas bleu", hex: "#6C4675", family: "violet" },
  { code: "RAL 4008", name: "Violet signalisation", hex: "#924E7D", family: "violet" },
  // Bleus
  { code: "RAL 5002", name: "Bleu outremer", hex: "#20214F", family: "bleu" },
  { code: "RAL 5003", name: "Bleu saphir", hex: "#1D1E33", family: "bleu" },
  { code: "RAL 5010", name: "Bleu gentiane", hex: "#0E294B", family: "bleu", popular: true },
  { code: "RAL 5012", name: "Bleu clair", hex: "#1E88E5", family: "bleu" },
  { code: "RAL 5013", name: "Bleu cobalt", hex: "#1E213D", family: "bleu" },
  { code: "RAL 5015", name: "Bleu ciel", hex: "#2271B3", family: "bleu" },
  { code: "RAL 5024", name: "Bleu pastel", hex: "#5D9B9B", family: "bleu" },
  // Verts
  { code: "RAL 6005", name: "Vert mousse", hex: "#0F4336", family: "vert", popular: true },
  { code: "RAL 6009", name: "Vert sapin", hex: "#27352A", family: "vert" },
  { code: "RAL 6018", name: "Vert jaune", hex: "#57A639", family: "vert" },
  { code: "RAL 6029", name: "Vert menthe", hex: "#20603D", family: "vert" },
  { code: "RAL 6037", name: "Vert pur", hex: "#008F39", family: "vert" },
  // Gris
  { code: "RAL 7016", name: "Gris anthracite", hex: "#293133", family: "gris", popular: true },
  { code: "RAL 7021", name: "Gris noir", hex: "#23282B", family: "gris" },
  { code: "RAL 7024", name: "Gris graphite", hex: "#474A51", family: "gris", popular: true },
  { code: "RAL 7035", name: "Gris clair", hex: "#CBD0CC", family: "gris", popular: true },
  { code: "RAL 7040", name: "Gris fenêtre", hex: "#9DA1AA", family: "gris" },
  { code: "RAL 7043", name: "Gris signalisation B", hex: "#4E5451", family: "gris" },
  { code: "RAL 7047", name: "Télégris 4", hex: "#D0D0D0", family: "gris" },
  // Bruns
  { code: "RAL 8001", name: "Brun ocre", hex: "#8E402A", family: "brun" },
  { code: "RAL 8004", name: "Brun cuivré", hex: "#8D4931", family: "brun" },
  { code: "RAL 8014", name: "Brun sépia", hex: "#4A3526", family: "brun" },
  { code: "RAL 8017", name: "Brun chocolat", hex: "#442F29", family: "brun" },
  { code: "RAL 8022", name: "Brun noir", hex: "#1A1A1A", family: "brun" },
  // Noirs & blancs
  { code: "RAL 9004", name: "Noir de sécurité", hex: "#282828", family: "noir", popular: true },
  { code: "RAL 9005", name: "Noir foncé", hex: "#0A0A0A", family: "noir", popular: true },
  { code: "RAL 9006", name: "Aluminium blanc", hex: "#A5A5A5", family: "blanc", popular: true },
  { code: "RAL 9007", name: "Aluminium gris", hex: "#8F8F8F", family: "blanc" },
  { code: "RAL 9010", name: "Blanc pur", hex: "#F1ECE1", family: "blanc", popular: true },
  { code: "RAL 9016", name: "Blanc de sécurité", hex: "#F6F6F6", family: "blanc", popular: true },
];

export const POPULAR_RAL = RAL_COLORS.filter((c) => c.popular);

export function getColorsByFamily(family: RALFamily): RALColor[] {
  return RAL_COLORS.filter((c) => c.family === family);
}
