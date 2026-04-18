/**
 * RAL — voix éditoriale.
 *
 * Chaque RAL iconique reçoit une micro-citation qui le place dans la
 * culture — voitures, mobilier, architecture, objets quotidiens. Le
 * but : transformer une grille de pastilles en vocabulaire, où chaque
 * couleur raconte de quoi elle est faite dans la mémoire commune.
 *
 * Utilisation :
 *   import { getRalEditorial } from "@/lib/ral-editorial";
 *   const line = getRalEditorial("RAL 3020");
 *
 * Retourne undefined si la RAL n'a pas de citation — la voix est
 * réservée aux RAL les plus porteuses. Ne pas étendre à l'ensemble
 * des 213 codes : la sélection fait la valeur.
 */

const EDITORIAL: Readonly<Record<string, string>> = {
  // ── Rouges ─────────────────────────────────────────────────────
  "RAL 3000":
    "Le rouge feu des camions de pompiers, des Ferrari 250 GTO, des Coca-Cola au verre.",
  "RAL 3003":
    "Le rubis des F40 de Maranello, des fauteuils de théâtre, des rouges-à-lèvres Chanel.",
  "RAL 3004":
    "Le pourpre des velours bordelais, des reliures Gallimard, des Fiat 500 Nuova Lusso.",
  "RAL 3020":
    "Le rouge des Vespa toscanes, des boîtes à lettres anglaises, du moteur d'une Ducati Monster.",
  "RAL 3031":
    "Le rouge oriental des tapis persans, des paquets de cigarettes Marlboro Classic.",

  // ── Oranges & jaunes ───────────────────────────────────────────
  "RAL 1003":
    "Le jaune des taxis new-yorkais, des Porsche 911 Carrera T, des panneaux SNCF à Lyon.",
  "RAL 1018":
    "Le jaune zinc des bulldozers, des imperméables de Bretagne, des carnets Moleskine safran.",
  "RAL 1023":
    "Le jaune signalisation des autoroutes allemandes, des Deux Chevaux de 1970.",
  "RAL 2002":
    "L'orange vermillon des Citroën H, des enseignes Shell d'avant-guerre.",
  "RAL 2004":
    "L'orange pur des combinaisons Gulf-Porsche 917, des radiateurs Gaggenau.",
  "RAL 2010":
    "L'orange signalisation des gilets de chantier, des valises Rimowa Original.",

  // ── Verts ──────────────────────────────────────────────────────
  "RAL 6005":
    "Le vert mousse des Triumph Street Triple, des portes géorgiennes, des bibliothèques du 19e.",
  "RAL 6009":
    "Le sapin sombre des forêts des Vosges, des Barbour waxed, des Porsche 911 de 1963.",
  "RAL 6018":
    "Le vert jaune des Lamborghini Miura, des chaises de jardin Fermob.",
  "RAL 6029":
    "Le vert menthe des Fiat 500 Giardiniera, des Fender Jazzmaster seafoam.",

  // ── Bleus ──────────────────────────────────────────────────────
  "RAL 5002":
    "Le bleu outremer des cartes marines, des Renault 4L bleues, des volets provençaux.",
  "RAL 5005":
    "Le bleu des piscines olympiques, des IBM System/360, des polos Ralph Lauren.",
  "RAL 5010":
    "Le bleu profond des uniformes de la Marine nationale, des reliures Pléiade.",
  "RAL 5012":
    "Le bleu lumineux des Lotus Elise Azure, des ciels de Corrèze en juillet.",
  "RAL 5015":
    "Le bleu ciel des Fender Stratocaster Lake Placid, des Tupperware de 1965.",

  // ── Gris ───────────────────────────────────────────────────────
  "RAL 7016":
    "Le gris des Land Rover Defender, des tubes IPN d'usine, des jours de pluie sur l'acier.",
  "RAL 7024":
    "Le graphite des locomotives à vapeur, des cadres de Leica M, des brumes atlantiques.",
  "RAL 7035":
    "Le gris des aéroports, des IBM Selectric, des ciels d'hiver parisiens.",
  "RAL 7040":
    "Le gris fenêtre des maisons flamandes, des Macintosh Classic, des Haussmann.",
  "RAL 7045":
    "Le gris télégrist des standardistes, des machines à écrire Olympia.",

  // ── Blancs ─────────────────────────────────────────────────────
  "RAL 9001":
    "Le blanc crème des Rolls-Royce d'avant-guerre, des pages jaunies d'Hemingway.",
  "RAL 9002":
    "Le blanc gris des architectures modernistes, des Vespa GS blanches.",
  "RAL 9003":
    "Le blanc signalisation des pistes d'atterrissage, des chemises Charvet.",
  "RAL 9006":
    "L'aluminium blanc des Mirage 2000, des Mac Pro, des satellites en orbite basse.",
  "RAL 9010":
    "Le blanc pur des pages d'art, des Eames DSW, des salles de musée du MoMA.",
  "RAL 9016":
    "Le blanc des salles d'opération, des Mercedes 300SL Gullwing, des Parthénons restaurés.",

  // ── Noirs ──────────────────────────────────────────────────────
  "RAL 9004":
    "Le noir signalisation des Apple iPhone, des Hermès Kelly, des taxis londoniens.",
  "RAL 9005":
    "Le noir d'avant la photographie, des Morgan 3-Wheeler, des lunettes d'écaille de Le Corbusier.",
  "RAL 9011":
    "Le graphite noir des Leica M Black Paint, des pianos Steinway D, des stylos Montblanc.",
  "RAL 9017":
    "Le noir des Aston Martin DB9, des tailleurs Balenciaga, des films Kodak Tri-X.",

  // ── Bruns ──────────────────────────────────────────────────────
  "RAL 8003":
    "Le brun argile des toits toscans, des Land Rover Series I, des Martini Rosso.",
  "RAL 8017":
    "Le chocolat des Jaguar E-Type, des Eames lounge, des malles Louis Vuitton.",
  "RAL 8019":
    "Le brun gris des vestes de chasse anglaises, des Burberry trenchs de 1940.",
};

/** Return the editorial line for a RAL code, or undefined if not curated. */
export function getRalEditorial(code: string): string | undefined {
  return EDITORIAL[code];
}

/** Total curated lines — useful for stats badge "XX couleurs curatées". */
export const CURATED_RAL_COUNT = Object.keys(EDITORIAL).length;

/** Flat list of curated codes — useful for admin / sitemap. */
export const CURATED_RAL_CODES: readonly string[] = Object.freeze(
  Object.keys(EDITORIAL),
);
