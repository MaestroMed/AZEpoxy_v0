# AZ Époxy — Banque de prompts génération d'images

Document à destination des outils de génération d'image (DALL·E 3, GPT-image, Midjourney v6, Imagen 3, Flux, SDXL). Tous les prompts respectent l'identité de marque et sont utilisables tels quels — ajuster le ratio si besoin.

---

## 1. Identité visuelle de référence

À glisser en préambule de chaque prompt si l'outil le permet (system prompt / style ref) :

> **AZ Époxy brand language.** Industrial powder-coating atelier in Bruyères-sur-Oise, Île-de-France. Premium craftsmanship aesthetic. Cinematic dynamic range, warm shadows, deliberate composition. Brand palette : deep midnight `#1A1A2E`, warm ember orange `#E85D2C`, warm off-white cream `#F5F5F0`. No stock-photo cheesiness, no people smiling at camera, no generic « teamwork » clichés.

### Style commun à appliquer partout

```
photorealistic, cinematic lighting, shallow depth of field where appropriate,
35mm full-frame look, subtle warm grain, controlled highlights, color graded
toward midnight blues and ember oranges, atelier authenticity, no text, no
logos, no watermarks
```

### Negative prompt commun

```
no text, no logos, no watermarks, no stock-photo smiles, no people facing
the camera, no UI overlays, no emoji, no obvious AI artifacts, no warped
hands, no warped tools, no plastic skin, no oversaturated neon, no chrome
HDR look, no clip-art, no cartoon, no 3D render generic, no CGI plastic
```

### Tips communs

- **Ratio** : `--ar 16:9` pour les héros pleine largeur, `--ar 4:3` pour les sections, `--ar 1:1` pour les vignettes galerie, `--ar 3:4` pour les portraits/produits verticaux.
- **Seed cohérence** : utiliser la même seed pour les variations d'une même série (ex. les 6 étapes process).
- **Iteration** : générer 4 images, sélectionner, upscaler. Sauvegarder en `.webp` 90% qualité.
- **Chemin cible** : déposer les images finales dans `public/images/` puis brancher via `<Image src="/images/...">`.

---

## 2. Hero principal — `/`

Le hero actuel utilise un canvas particles. L'image servira de fallback (motion réduit) et de poster pour le canvas.

**Filename** : `public/images/hero-home.webp`
**Ratio** : 21:9 ou 16:9
**Prompt** :

> Wide cinematic shot of a powder-coating atelier interior at dusk, deep matte black metal frame in foreground being electrostatically coated with fine ember-orange powder, fine particles suspended midair catching directional warm light beams cutting through industrial haze, polished concrete floor, raw structural beams overhead, deep midnight `#1A1A2E` ambient with warm `#E85D2C` ember accents, no people, deliberate negative space upper third for headline, anamorphic lens flare subtle, ultra-detailed surface textures, 35mm full-frame, shallow depth of field on foreground particles, color graded teal-and-orange industrial cinematic, premium craftsmanship mood — `--ar 16:9`

---

## 3. Heros de page

Tous au format **16:9**, déposés dans `public/images/heroes/`. Chaque page utilise `PageHero` avec un `image` prop. Les heros existants sont en variant `night` — l'image vient en background avec un overlay sombre (déjà géré côté CSS).

### `/services` — `heroes/services.webp`

> Industrial close-up of a freshly powder-coated steel piece exiting a curing oven, surface gleaming with deep glossy ember-orange `#E85D2C` finish, faint heat shimmer above, atelier in soft focus background showing tools and pneumatic lines, midnight blue ambient cooler tones in background contrasting with the warm coated piece, dramatic side rim light, cinematic, no text, no logo — `--ar 16:9`

### `/services/thermolaquage` — `heroes/thermolaquage.webp`

> Hyperrealistic close-up of an industrial powder-coating gun in operation, electrostatic spray of ultra-fine cream-white epoxy powder forming a soft halo around the nozzle, visible powder particles catching directional studio light, gloved hand barely visible at frame edge, deep matte midnight `#1A1A2E` background, dramatic chiaroscuro, premium industrial photography, 85mm macro look, shallow depth of field on the powder cloud — `--ar 16:9`

### `/services/sablage` — `heroes/sablage.webp`

> Wide shot of a steel structural piece being sandblasted inside a 7×3×4-meter industrial cabin, abrasive media projecting under controlled high-pressure stream, sparks and dust particles hovering, operator silhouette in protective suit at the edge of frame (back to camera), dramatic warm sodium-vapor work lighting against cool steel walls, motion-blur on the abrasive jet, cinematic, raw industrial grit, no faces visible — `--ar 16:9`

### `/services/finitions` — `heroes/finitions.webp`

> Studio macro shot of multiple powder-coated metal samples arranged in a fan, finishes ranging from deep matte black to satin pearl to brushed metallic to iridescent shifting hues, each sample catching light at different angles to reveal texture, deep midnight gradient background, cool studio lighting with controlled warm rim accent on the brightest sample, premium product photography aesthetic, 50mm lens, shallow depth of field — `--ar 16:9`

### `/specialites/jantes` — `heroes/specialite-jantes.webp`

> Hero shot of a satin-black powder-coated alloy wheel rotating at low speed on a balancing rig in a dim atelier, ember-orange brake caliper just visible behind the spokes, atmospheric dust caught in a single sidelight beam, deep midnight environment with warm ember accents, automotive editorial photography style, 85mm lens, shallow depth of field, no people, no logos on the wheel — `--ar 16:9`

### `/specialites/moto` — `heroes/specialite-moto.webp`

> Cinematic three-quarter shot of a custom motorcycle frame in deep gloss black powder-coat finish hanging on a workshop assembly stand, atmospheric backlight through atelier window, warm ember sparks faintly visible from a grinding station out of focus, deep midnight `#1A1A2E` background, premium custom-build aesthetic, no rider, no brand logos visible — `--ar 16:9`

### `/specialites/voiture` — `heroes/specialite-voiture.webp`

> Detail shot of a freshly thermolacquered automotive component (suspension arm or chassis bracket) on a workshop bench, satin charcoal finish catching directional warm light, micro-bokeh tools visible in soft background, premium industrial product photography, deep midnight ambient with single warm light source, no badges or logos, 50mm full-frame look — `--ar 16:9`

### `/specialites/pieces` — `heroes/specialite-pieces.webp`

> Wide shot of a row of industrial steel components — brackets, profiles, frames — freshly powder-coated in matte structural anthracite, lined up on a curing rack in an industrial atelier, even cool LED overhead lighting, polished concrete floor, scale and repetition emphasized, B2B industrial documentary photography, no people — `--ar 16:9`

### `/realisations` — `heroes/realisations.webp`

> Editorial flat-lay or low-angle shot of multiple finished powder-coated pieces — wheel, frame element, structural bracket, custom mobilier piece — arranged on a polished concrete atelier floor under warm directional light, each piece in a different RAL hue (one ember orange, one matte midnight, one cream off-white), composition graphic and balanced, premium portfolio aesthetic, 35mm lens — `--ar 16:9`

### `/blog` — `heroes/blog.webp`

> Macro shot of an open RAL color fan deck on a worn dark workshop bench, natural sidelight from a window, multiple tear-out paper notes annotated by hand visible at frame edges, atmospheric dust particles, deep midnight ambient with warm ember accent on the open color chip, editorial knowledge-base aesthetic, 50mm lens, shallow depth of field — `--ar 16:9`

### `/contact` — `heroes/contact.webp`

> Atmospheric wide shot of the AZ Époxy atelier exterior at golden hour, large industrial roll-up door partially open revealing warm interior glow, raw concrete and corrugated steel facade, late-day shadow falling across a polished concrete forecourt, warm ember light spilling from inside contrasting with cool dusk sky, no people, no signage with text — `--ar 16:9`

### `/devis` — `heroes/devis.webp`

> Overhead shot of a custom client project intake on a workshop bench: a dismounted alloy wheel laid flat next to a paper notebook with technical sketches, a tape measure, an open RAL color deck showing an ember-orange chip, an iPhone showing a photo of the piece, warm directional light, premium service-design aesthetic, no faces, no text on screen, 35mm overhead — `--ar 16:9`

### `/a-propos` — `heroes/a-propos.webp`

> Wide environmental shot of the AZ Époxy 1800 m² atelier interior, two craftsmen in protective gear visible at distance with their backs to camera working on different stations (sandblasting cabin and powder gun), polished concrete floor, raw industrial ceiling, warm directional sunlight from skylight cutting through faint atmospheric dust, deep blue ambient shadows with ember warm accents from work lights, documentary photography, no faces — `--ar 16:9`

### `/faq` — `heroes/faq.webp`

> Macro shot of multiple powder-coated metal samples and a paper notebook with hand-written annotations on a dark workshop bench, sidelight from a window, atmospheric and contemplative, deep midnight ambient with single warm key light, knowledge / documentation aesthetic, 50mm lens — `--ar 16:9`

### `/couleurs-ral` — `heroes/couleurs-ral.webp`

> Hero shot of a complete RAL color fan deck fully fanned out into a curved gradient arc, suspended slightly above a dark polished concrete surface, dramatic warm key light from above-right catching the saturated chips, deep midnight ambient background, premium product photography, 50mm lens, shallow depth of field on foreground chips — `--ar 16:9`

### `/rendez-vous` — `heroes/rendez-vous.webp`

> Atmospheric shot of the AZ Époxy atelier reception area : a plain wooden bench, a wall-mounted color sample board behind, warm pendant light, soft afternoon natural light through industrial window, no people, welcoming-but-industrial aesthetic, 35mm wide lens — `--ar 16:9`

### `/thermolaquage-[ville]` (générique pour les 4 villes) — `heroes/ville-generic.webp`

> Wide editorial shot of a delivery van loaded with freshly powder-coated metal pieces wrapped in protective film, parked at the AZ Époxy atelier loading dock at dawn, ambient mist, polished concrete forecourt, urban Île-de-France industrial backdrop in soft focus, deep midnight ambient with warm dawn light, B2B service aesthetic, no visible logos or license plates — `--ar 16:9`

> **Variations par ville** : générer 4 versions avec des arrière-plans subtilement différents (ex. autoroute Île-de-France, vue Vexin pour Pontoise, ZA Bruyères pour Bruyères, etc.) pour éviter la duplication SEO.

---

## 4. Sections : 6 étapes du procédé

Format **4:3** ou **3:4**, série cohérente, **même seed**, déposées dans `public/images/process/`. Chaque image illustre une étape, sans texte, mood unifié.

### Étape 1 — Réception & contrôle — `process/01-reception.webp`

> Close-up overhead of a piece being inspected at intake : gloved hands holding a digital caliper against a metal bracket, paper job sheet beside it, warm directional task lighting, deep midnight workbench, documentary precision aesthetic — `--ar 4:3`

### Étape 2 — Préparation / sablage — `process/02-preparation.webp`

> Steel piece mid-sandblasting inside a cabin, abrasive jet visible, sparks and dust suspended, operator silhouette at frame edge, dramatic warm work lighting, motion-blur on the jet — `--ar 4:3`

### Étape 3 — Dégraissage / rinçage — `process/03-degraissage.webp`

> Industrial parts washer rack with metal pieces being rinsed, water droplets suspended, cool industrial LED overhead with warm accent, clinical-but-rugged industrial aesthetic — `--ar 4:3`

### Étape 4 — Application primaire — `process/04-primaire.webp`

> Close-up of a powder-coating gun applying a uniform light grey primer layer to a steel piece on a hanging conveyor, fine powder cloud visible, electrostatic shimmer, deep midnight ambient with cool key light — `--ar 4:3`

### Étape 5 — Cuisson en four — `process/05-cuisson.webp`

> View into an industrial curing oven : a row of metal pieces hanging on a conveyor inside, heated air shimmer, controlled warm interior glow contrasting with cool exterior, no temperature display visible, atmospheric and high-craft — `--ar 4:3`

### Étape 6 — Contrôle qualité & expédition — `process/06-controle.webp`

> Macro shot of a finished powder-coated piece being inspected with a thickness gauge / surface tester, gloved hand operating the tool, surface gleaming with deep ember-orange satin finish, warm precision lighting, premium quality-control aesthetic — `--ar 4:3`

> **Note** : ne PAS faire apparaître de température affichée à l'écran, ni de pictogramme de zinc, ni de marque de poudre — exigences éditoriales strictes.

---

## 5. Avant / après sablage — `/services/sablage`

Remplace les SVG placeholder actuels (`public/images/sablage-{avant,apres}.svg`).

### `sablage-avant.webp` (4:3)

> Macro shot of a heavily oxidized steel structural bracket showing thick layered rust, flaking old paint patches, mill scale, surface contamination, ambient soft natural light from a workshop window, neutral background, documentary forensic aesthetic, ruler or scale reference faintly visible at edge for context — `--ar 4:3`

### `sablage-apres.webp` (4:3)

> Macro shot of the **same** structural bracket after sandblasting : exposed bare grey steel with uniform matte profile, anchor pattern visible, no rust no paint, identical framing and lighting as the « avant » image, neutral background, documentary forensic aesthetic — `--ar 4:3`

> **Critique** : utiliser la même seed et la même composition pour les deux images afin que le slider avant/après aligne correctement.

---

## 6. Galerie réalisations — sujets variés

Format **4:3**, même style éditorial, à mettre dans `public/images/realisations/`. Générer ~12 sujets pour la galerie filtrable.

### Catégorie « Jantes »

1. `realisations/jantes-01.webp` — Set of four matte black powder-coated alloy wheels arranged on a polished concrete floor, top-down editorial shot, atmospheric warm rim light, no tires mounted yet, premium aftermarket aesthetic — `--ar 4:3`
2. `realisations/jantes-02.webp` — Single bronze-pearl powder-coated alloy wheel hanging on a paint stand, three-quarter view, dramatic side rim light, deep midnight environment — `--ar 4:3`
3. `realisations/jantes-03.webp` — Detail macro of a wheel spoke showing satin charcoal finish with subtle metallic flake, extreme shallow depth of field — `--ar 4:3`

### Catégorie « Moto »

4. `realisations/moto-01.webp` — Custom motorcycle frame in deep gloss black powder-coat hanging on an assembly stand, atelier ambiance, no rider, no logos, three-quarter angle — `--ar 4:3`
5. `realisations/moto-02.webp` — Set of motorcycle wheels and swing-arm in matte anthracite finish laid out flat on workshop floor, overhead editorial — `--ar 4:3`
6. `realisations/moto-03.webp` — Macro of a freshly thermolacquered motorcycle triple-clamp in ember orange satin, surface flawless, premium product shot — `--ar 4:3`

### Catégorie « Industriel / structures »

7. `realisations/industriel-01.webp` — Long row of structural steel beams freshly coated in matte structural anthracite, hanging on overhead conveyor in atelier, perspective vanishing point, B2B documentary — `--ar 4:3`
8. `realisations/industriel-02.webp` — Stack of finished steel brackets neatly arranged on a pallet wrapped in protective film ready for shipment, warehouse warm lighting — `--ar 4:3`
9. `realisations/industriel-03.webp` — Detail of a powder-coated railing assembly mounted on a balcony post-installation, urban Île-de-France residential context, golden hour — `--ar 4:3`

### Catégorie « Mobilier / portails »

10. `realisations/mobilier-01.webp` — Custom outdoor garden bench freshly powder-coated in deep ember orange, set against a neutral garden backdrop, premium lifestyle product photography — `--ar 4:3`
11. `realisations/mobilier-02.webp` — Wrought-iron entrance gate in deep gloss black, post-installation against a country residence facade, golden hour, editorial real-estate quality — `--ar 4:3`
12. `realisations/mobilier-03.webp` — Pair of designer outdoor lounge chairs in matte cream powder-coat finish on a stone terrace, atmospheric lifestyle shot — `--ar 4:3`

---

## 7. Spécialités — sections de produits

Pour les pages spécialités, en complément du hero, une image « showcase » centrale.

### Jantes — showcase
> Editorial three-quarter shot of an alloy wheel mid-rotation on a paint stand inside the atelier, freshly coated in saturated ember orange, atmospheric dust caught in a sidelight beam, premium aftermarket aesthetic — `--ar 3:2`

### Moto — showcase
> Empty motorcycle frame and tank suspended on assembly stands inside the atelier, freshly powder-coated, three-quarter angle, atmospheric deep blue ambient, ember rim light — `--ar 3:2`

### Voiture — showcase
> Cluster of automotive components (suspension arms, brake calipers, valve cover) freshly powder-coated in different finishes laid out on a workshop bench, overhead editorial — `--ar 3:2`

### Pièces industrielles — showcase
> Long parallel row of identical structural brackets coated in matte anthracite, hanging on a curing-rack conveyor, repetition and scale emphasized, B2B industrial — `--ar 3:2`

---

## 8. Section atelier / chiffres clés

À placer en background des sections « stats » (1800 m², 200+ couleurs, 15+ années, 2000+ projets).

### `sections/atelier-wide.webp` (21:9)

> Ultra-wide environmental shot of the entire AZ Époxy atelier interior captured at a slight low angle, sandblasting cabin on left, powder-coating booth center, curing oven on right, warm directional sunlight from skylights cutting through atmospheric dust, polished concrete floor, raw structural beams, scale of 1800 m² emphasized, no people, documentary architectural photography — `--ar 21:9`

---

## 9. Couleurs RAL & familles d'effets

Pour les pages collections (anciennement Adaptacolor — désormais familles génériques).

### Effets corten — `couleurs-ral/effets-corten.webp`
> Macro of a powder-coated metal panel showing a deep authentic corten / weathered-steel effect with rust-orange to deep maroon gradient, surface texture mimicking oxidized steel without actual corrosion, dramatic side light, premium architectural sample — `--ar 4:3`

### Métalliques — `couleurs-ral/metalliques.webp`
> Macro of a powder-coated panel in structured metallic finish with chrome flake catching directional light, satin sheen, deep midnight ambient — `--ar 4:3`

### Irisés — `couleurs-ral/irises.webp`
> Macro of a powder-coated panel showing iridescent dichroic finish shifting from violet-blue to cyan-green depending on viewing angle, multiple light sources at different angles to reveal the effect, dramatic studio aesthetic — `--ar 4:3`

### Anodisés — `couleurs-ral/anodises.webp`
> Macro of a powder-coated panel mimicking deep anodized aluminum finish, velvet-smooth, rich saturated color (deep amber or violet), subtle directional sheen, premium architectural sample — `--ar 4:3`

---

## 10. Vignettes blog — par article

Pour chaque article de blog (10 articles dans `BLOG_ARTICLES_FALLBACK`), générer une cover **3:2** déposée dans `public/images/blog/{slug}.webp`. Prompt générique adaptable :

> Editorial cover image illustrating « [TITRE_DE_L_ARTICLE] », deep midnight ambient with warm ember accents, atelier or macro context relevant to the article subject, no text, no faces, premium technical knowledge-base aesthetic, 35mm look — `--ar 3:2`

### Exemples spécifiques

- **`blog/thermolaquage-vs-peinture-liquide.webp`** → split-frame composition : powder-coated piece on the left half, liquid-painted piece on the right half, both lit identically to compare finish, deep midnight backdrop.
- **`blog/preparer-jantes-thermolaquage.webp`** → close-up of an alloy wheel mid-prep on a workshop bench, masking tape on hub area, surface freshly sandblasted.
- **`blog/couleurs-ral-guide-complet.webp`** → fanned RAL color deck on dark concrete, dramatic side light.
- **`blog/durabilite-thermolaquage.webp`** → comparison between a brand-new powder-coated piece and an aged outdoor piece showing color retention, side-by-side.
- **`blog/cout-thermolaquage.webp`** → macro of a notebook with hand-written estimate next to powder samples.
- **`blog/thermolaquage-eco-responsable.webp`** → atmospheric atelier shot with green-tinged industrial sunlight from skylight, emphasizing zero-VOC clean process.

---

## 11. Pictogrammes / icônes complémentaires

Si besoin de pictos vectorisés (au-delà des `lucide-react` existants), utiliser un style **line-art monoligne 2 px brand-orange sur fond transparent**. Prompt :

> Minimal line-art icon of [SUBJECT], 2-pixel uniform stroke, ember orange `#E85D2C` on transparent background, geometric and deliberate, no fill, modern industrial aesthetic, square 1:1 ratio — `--ar 1:1`

Suggestions : pistolet thermolaquage, four de cuisson, jante, châssis moto, portail, bracket industriel.

---

## 12. Open Graph custom (optionnel)

Les OG actuels sont générés via `ImageResponse` (Satori) — pas besoin d'images. Mais si on veut surcharger avec une vraie photo en arrière-plan d'un OG :

**Format** : 1200×630 PNG/JPG
**Prompt générique** :

> Cinematic horizontal composition with deliberate negative space upper-left for headline overlay, atmospheric atelier scene related to [PAGE_SUBJECT], deep midnight ambient with ember orange accents, premium industrial editorial — `--ar 1200:630`

---

## 13. Workflow recommandé

1. **Génération en lot** : grouper par série (heros, process, galerie) pour conserver la cohérence stylistique. Utiliser la même seed.
2. **Sélection** : générer 4 variantes par prompt, ne garder qu'une.
3. **Upscale** : x2 ou x4 selon l'usage (hero = 1920×1080 minimum, galerie = 1200×900, vignette blog = 1200×800).
4. **Conversion** : exporter en `.webp` qualité 85, `next/image` se chargera de l'AVIF/WebP responsive automatiquement.
5. **Dépôt** : `public/images/heroes/`, `public/images/process/`, `public/images/realisations/`, `public/images/blog/`, `public/images/sections/`.
6. **Branchement** :
   - Heros : passer `image="/images/heroes/xyz.webp"` au composant `PageHero`.
   - Galerie : remplacer les couleurs placeholders dans `gallery-grid.tsx` par `<Image>`.
   - Blog : champ `image` du schema Sanity `post` (déjà prévu).
7. **Audit a11y** : alt text descriptif obligatoire, jamais juste « image ».

---

## 14. Garde-fous éditoriaux (rappel chef de projet)

À **NE JAMAIS** faire apparaître dans une image générée :

- ❌ Affichage de température (200°C, 180°C, °C, °F)
- ❌ Marques de poudre lisibles (Interpon, Akzo Nobel, Tiger, etc.)
- ❌ Pictogrammes ou étiquettes mentionnant le zinc / Zn
- ❌ Logos concurrents
- ❌ Texte français ou anglais en dur dans l'image
- ❌ Personnes face caméra avec sourire stock-photo
- ❌ Drapeau / étiquette de norme avec un texte spécifique (Qualicoat, ISO)

À **PRIVILÉGIER** :

- ✅ Atmosphère atelier authentique (béton, structure métallique, poussière douce, lumière directionnelle chaude)
- ✅ Palette midnight `#1A1A2E` + ember `#E85D2C` + cream `#F5F5F0`
- ✅ Composition cinéma (35mm, anamorphic, golden-hour ou warm-task-light)
- ✅ Échelle et savoir-faire visibles : grand atelier, équipement professionnel
- ✅ Pieces post-finition pour montrer la qualité visuelle (pas de pièces brutes uniquement)
