# SEO Master Plan — AZ Époxy → ~1500 pages uniques, anti-désindexation

> État de l'art Google **mi-2026**. Objectif : passer de ~387 à **~1500 pages
> *genuinement* uniques et utiles**, sans déclencher la "scaled content abuse"
> qui déclasserait tout le site. Document de référence — mis à jour au fil des vagues.

## 0. Le théorème central (à ne jamais oublier)

> *« Scaled content abuse is when many pages are generated **for the primary
> purpose of manipulating search rankings and not helping users** »* — et cela
> s'applique **« regardless of how it's created »** (Google Search Central).

Google ne juge pas *comment* une page est faite (IA, humain, template), mais
**pourquoi**. Et le système "helpful content" est **site-wide** : un mauvais
ratio soumis/indexé **contamine l'évaluation du domaine entier**. C'est pour ça
qu'on n'ajoute jamais une page sans valeur unique vérifiable, et qu'on assainit
*avant* de scaler.

## 1. Règles d'or (DO / DON'T)

**DO** — différenciation par la **donnée** (pas la variable) ; satisfaire
l'intention dominante ; E-E-A-T tangible et local (photos réelles, NAP cohérent
95820, avis) ; données originales non scrappables (avant/après horodatés) ;
profondeur calibrée sur la valeur (pas de quota de mots) ; maillage hub-and-spoke ;
fraîcheur honnête ; structured data alignée au visible ; **quality gate AVANT
publication** ; couverture progressive guidée par la demande.

**DON'T** — template + injection de variable comme seule différence (overlap
corps > ~40 % = doorway détectable) ; générer en masse "parce qu'on peut" ;
laisser des fiches thin (les 211 teintes RAL !) ; doorway pages ; contenu IA non
revu ; stitching de descriptifs fournisseur ; sur-promesse (doctrine) ; **laisser
le ratio soumis/indexé déraper** (= signal site-wide négatif).

## 2. Cible ~1500 pages (matrice, hors pages thin)

| Type | Route | Cible | Intention |
|---|---|---|---|
| Géo ville (A) | `/thermolaquage-[ville]` | 115 | locale mixte |
| **Combo service×ville (B)** | `/thermolaquage-[service]-[ville]` | **~900** | transac. locale 🔴 |
| Spécialité (C) | `/specialites/[slug]` | 16 | commerciale |
| Service pilier (D) | `/services/[slug]` | 8 | informationnelle |
| Prix×pièce (E) | `/prix/thermolaquage-[piece]` | 20 | "prix/tarif" 🔴 |
| Prix×pièce×ville (F) | `/prix/...-[ville]` | ~90 | transac. longue traîne |
| Guide/comparatif (G) | `/guides/[slug]` | 35 | "vs / comment" |
| Hub secteur pro (H) | `/professionnels/[secteur]` | 12 | B2B |
| Hub département (I) | `/zones/[dept]` | 9 | navigation+SEO |
| Réalisation (J) | `/realisations/[slug]` | 60 | preuve E-E-A-T |
| Teinte RAL gardée (K) | `/couleurs-ral/teinte/[code]` | **~45** | informationnelle |
| Blog (M) | `/blog/[slug]` | 40 | TOFU |
| Statiques (N) | — | 15 | conversion |

Le **seul levier poussé pour atteindre 1500 = le bloc B (combos)** : c'est le
type à plus forte intention ET le plus différenciable.

## 3. Catalogue de services money (alimentent les combos)

`jantes` 🔴, `portail` 🔴, `garde-corps` 🔴, `cloture-grille` 🟠, `ferronnerie`
🟠, `mobilier-jardin` 🟠, `escalier` 🟠, `jantes-moto` 🟠 → **8 services combo**.
Hors combo (page spécialité nationale, intention locale trop faible) :
`mobilier-metal`, `verriere`, `aerogommage`, `sablage`, `chassis-industriel`,
`mobilier-urbain`, `charpente-metallique`.

**Communes : 76 → ~115** (priorité 95 Val-d'Oise proche + 60 Oise industriel,
puis 78/93/92). Règle anti-thin : on ne crée une fiche ville **que** si on peut
renseigner ≥ `industries[]` + `access` + `nearbyVilles[]` réels.

**Combos priorisés (pas le cartésien brut)** — 3 cercles de distance :
- Cercle 1 (≤25 min, ~25 villes) → 8 services
- Cercle 2 (25-55 min, ~55 villes) → 4-8 services selon tissu local
- Cercle 3 (>55 min, ~35 villes) → 2 services historiques

## 4. Les 5 vagues (jamais de dump — une vague ne s'ouvre que si la précédente passe le gate)

- **Vague 0 — Assainissement** *(en cours)* : ~166 teintes thin → `noindex,follow` + hors sitemap ; ~45 gardées. **−166 URLs avant d'en ajouter.** ← remonte la qualité moyenne, le geste anti-désindexation #1.
- **Vague 1 — Plus forte intention** (~260) : combos jantes+portail sur les 76 villes ; 4 nouvelles spécialités money ; pages Prix×pièce.
- **Vague 2 — Cercle 1 complet** (~220) : 8 services × 25 villes proches + ~30 nouvelles communes.
- **Vague 3 — Éditorial d'autorité** (~110) : guides/comparatifs, hubs pro, hubs dept, blog → alimentent le maillage.
- **Vague 4 — Cercle 2 + Prix locaux** (~430).
- **Vague 5 — Longue traîne & preuve** (~300) : cercle 2 étendu + cercle 3 + 60 réalisations.

**Gate de passage entre vagues** : (1) % indexé en hausse, (2) impressions/clics
par type, (3) "Explorée non indexée" sous seuil. Sinon on stoppe et on enrichit.

## 5. Moteur d'unicité (combos)

Chaque combo = **composition de faits locaux vérifiables**, pas un texte rempli.
7 dimensions croisées : tissu éco (`industries`), accès/itinéraire
(`distance`+`access`+`driveTime`), clientèle type, contrainte matière locale,
repères/quartiers (`landmarks`/`neighborhoods`), preuve à proximité, logistique
dérivée de `driveTimeMin`. Le `Combo` se décompose en `localAngle` /
`localConstraint` / `clientele` / `localProof?` / `angleType` — l'`angleType`
(proximité / industriel / patrimoine / premium / volume / grand-paris) pilote le
**registre d'intro ET l'ordre des sections** → 3+ empreintes structurelles
distinctes, légitimement justifiées par l'intention. **Anti-templating sans spin**
: variété de données + structure, jamais de dictionnaire de synonymes.

## 6. Quality gate (implémenté : `src/lib/quality/validate-page.ts`)

`validatePage(page, ctx)` → `PASS | WARN | FAIL`. Bloque la publication si :
- `THIN_WORDCOUNT` : < 300 mots hors gabarit
- `LOW_DATA_RATIO` : < 0,25 de tokens variables vs gabarit
- `DUP_TITLE/META/H1/INTRO` : collision avec une page publiée
- `NEAR_DUPLICATE` : Jaccard de w-shingles (5-grammes) ≥ **0,40** avec une page existante
- `MISSING_SCHEMA` : schema requis manquant
WARN (non bloquant) : `LOW_INTERNAL_LINKS` (< 3 liens contextuels), contenu court.
> ⚠️ Constat : **les combos actuels échouent le gate** (uniqueAngle ~80 mots,
> dataRatio ~0,25). Il faut **épaissir le template avec de vraies données locales
> AVANT de scaler** — c'est la première tâche de la Vague 1.

## 7. Gouvernance & monitoring (à brancher)

- **Search Console API dans l'admin** (roadmap v1.6) : % indexé, impressions,
  pages "non indexées" + raisons → on pilote par la donnée.
- **Pruning** : une page sans impression après ~8-12 semaines → enrichir, fusionner,
  ou `noindex`. La gouvernance maintient la qualité moyenne pendant qu'on scale.
- **Sitemap segmenté par vague** (à faire) pour piloter le crawl.

## 8. Hors-code (TOI) — le carburant qui rend tout ça rentable

**Google Business Profile + avis** (levier #1 local), backlinks (annuaires métier,
partenaires), GA4 conversions. Un domaine jeune sans GBP ni lien indexe lentement
quelle que soit la perfection technique.
