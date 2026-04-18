# AZ Époxy — Prompts d'images (pack complet)

Tous les prompts en anglais (meilleur rendu Midjourney v6 / Flux.1 / DALL-E 3) avec le contexte FR au-dessus. Style bible en section 0, à injecter en "reference" sur chaque run pour garantir la cohérence.

---

## 0. STYLE BIBLE (à ajouter à TOUS les prompts)

**Style tag universel** (append à tous les prompts) :

```
Editorial photography, Leica Q3 style, 35mm equivalent, shallow selective depth of field, Kodak Portra 400 color grading, subtle film grain, natural light with industrial rim highlights, 200°C golden-orange warm glow bleeding from off-screen oven, deep shadow blacks (#0F0F1A), warm cream accents (#F5F5F0), signature hot-orange accent (#E85D2C) used sparingly like a single ember, cinematic industrial workshop atmosphere, negative space composition for text overlay, zero lens flare, no people's faces in focus, Awwwards-tier craft, Architectural Digest × Monocle × Porsche Design Journal aesthetic, ultra-sharp on subject
```

**Negative (à ajouter à toutes les requêtes Midjourney, `--no …`) :**
```
--no text, watermark, signature, logo overlay, stock-photo lighting, HDR, oversharpened edges, fake chrome, rainbow chromatic aberration, plastic look, cartoonish, anime, 3D render look, overcooked bokeh, low-res, blurry, distorted metal, fake RAL code, obvious AI artifacts
```

**Aspect ratios de référence :**
- Hero page (desktop) : `16:9` ou `3:2`
- Portfolio tile : `4:5` (portrait) ou `1:1`
- Hero mobile : `4:5`
- OG image : `1200×630` soit `16:9` (`1.91:1` exact)
- Blog header : `16:9`
- Avant/Après : `3:2` chacun

**Palette à verrouiller** (mentionner dans chaque prompt) :
- Orange brand : `#E85D2C` (flamme industrielle, four 200°C)
- Orange clair : `#FF7A48` (paint-gun jet, brasier)
- Night : `#1A1A2E` (fond, métal brut non-traité)
- Cream : `#F5F5F0` (peaux de poudre, papier de spec)
- Charcoal : `#2D2D2D` (ombre de cabine, corps d'outil)

---

## 1. PORTFOLIO RÉALISATIONS (16 projets × 2 = 32 prompts)

Pour chaque projet : **[A] hero catalog shot** (studio, fond neutre, pièce centrale, négative space pour titre overlay) + **[B] context/detail shot** (atelier ou montée sur véhicule, grain de finition visible).

### JANTES (4 projets)

#### Projet #1 — Jantes BMW M4 Noir Satin (RAL 9005)

**[A] Hero — Studio catalog `4:5`**
```
Black satin powder-coated BMW M4 Competition 19-inch alloy wheel, perfectly centered on seamless deep charcoal backdrop (#1A1A2E gradient to #0F0F1A), studio softbox from above-left, razor-sharp rim edge, micro-texture of matte powder finish visible, tyre sidewall "MICHELIN PILOT SPORT" subtly readable, single warm orange rim-light (#E85D2C) grazing the spoke edges suggesting the just-baked oven heat, shallow DoF on center hub, minimalist product photography, luxury automotive catalog aesthetic
```

**[B] Context — Installed on car `3:2`**
```
Same black satin M4 Competition wheel installed on anthracite BMW M4 chassis, low-angle 3/4 rear shot in a dim parking garage, single industrial overhead sodium light creating warm orange glow (#FF7A48) on the fender arch, concrete floor reflections, brake caliper visible in gunmetal grey, moody cinematic lighting
```

#### Projet #2 — Jantes Audi RS3 Gris Graphite Brillant (RAL 7024)

**[A] Hero `4:5`**
```
Graphite grey gloss powder-coated Audi RS3 19-inch 5-spoke wheel, floating against seamless #1A1A2E backdrop, mirror-glass clearcoat highlights catching a single warm ember (#E85D2C) rim light on the upper spoke, technical drawing vibe, crisp hub center with red calliper tip teased from shadow, luxury performance catalog photography, Porsche 911 design book aesthetic
```

**[B] Context `3:2`**
```
Low 3/4 front macro of gloss graphite RS3 wheel installed on Nardo grey Audi RS3 sedan, parked on wet cobblestone at dusk, warm tungsten streetlight making the grey wheel glow subtly amber on its upper surface, brake disc showing drilled pattern behind spokes, cinematic German engineering magazine shot
```

#### Projet #3 — Jantes Mercedes Classe C Blanc Pur (RAL 9010)

**[A] Hero `4:5`**
```
Pure white gloss powder-coated Mercedes 18-inch 10-spoke wheel on clean cream (#F5F5F0) cyclorama background, overhead cold softbox for crispness, single warm accent orange light (#E85D2C) from lower-right glancing the tyre sidewall, black Michelin tyre for dramatic contrast, minimal luxury editorial, Off-White × Mercedes campaign aesthetic
```

**[B] Context `3:2`**
```
Pure white wheel installed on white Mercedes C-Class parked in front of a modern cream brutalist villa wall, late afternoon golden hour sun grazing from right, hard-edged architectural shadows, lifestyle luxury photography
```

#### Projet #4 — Jantes Golf GTI Noir & Rouge Racing (RAL 9005 + 3020)

**[A] Hero `4:5`**
```
Two-tone powder-coated Golf GTI 18-inch wheel : matte black (#0F0F1A) spokes with machined red-racing (#CC1E1E) accents on the lip and spoke edges, perfectly lit on graphite backdrop, dual soft boxes to show both finishes, razor-sharp detail on the bi-colour transition lines, motorsport catalog photography, Liqui Moly racing team magazine feel
```

**[B] Context `3:2`**
```
Red and black wheels installed on Tornado Red Golf GTI at a racetrack paddock, sunset backlight silhouetting the rear fender, heat shimmer rising from track in background, dynamic low 3/4 rear quarter shot, Gran Turismo × Need For Speed cinematic feel
```

### MOTO (3 projets)

#### Projet #5 — Cadre Triumph Street Triple Vert Mousse (RAL 6005)

**[A] Hero `4:5`**
```
Moss green (RAL 6005, slightly muted olive-forest #3F5A33) powder-coated Triumph Street Triple motorcycle frame, isolated on deep charcoal cyclorama, studio strobe from above showing the weld beads and tube transitions in sharp relief, the frame's aggressive bracing geometry fully readable, single warm ember rim light (#E85D2C) from lower-right edge suggesting British racing heritage, Bonhams motorcycle auction catalog aesthetic, Iron & Air magazine feel
```

**[B] Context `3:2`**
```
Moss green Street Triple frame freshly out of oven sitting on an atelier welding bench, warm residual heat glow (#FF7A48) visible on the metal edges, workshop tools blurred in background, raw concrete floor, documentary craftsmanship photography, natural window light mixed with warm tungsten
```

#### Projet #6 — Jantes Ducati Monster Rouge Signalisation (RAL 3020)

**[A] Hero `4:5`**
```
Bright signal red (RAL 3020, vivid #C42B1C) gloss powder-coated Ducati Monster Y-spoke 17-inch wheel, on seamless #1A1A2E backdrop, high-key red pop, chrome valve stem and Pirelli Diablo tyre, sharp 3/4 angle, single overhead softbox + warm ember rim light, Ducati factory catalog photography, Ferrari design book aesthetic
```

**[B] Context `3:2`**
```
Signal red Ducati Monster wheel installed on matte black Monster naked bike in a dim Italian garage, warm incandescent ceiling bulb creating dramatic single-light scene, red wheel vibrant against black chassis, oily workshop texture on floor
```

#### Projet #7 — Cadre & Bras oscillant Yamaha MT-07 Noir & Or (RAL 9005 + 1003)

**[A] Hero `4:5`**
```
Custom Yamaha MT-07 chassis : matte black (RAL 9005) main frame with bright signal yellow-gold (RAL 1003, warm #F7B500) powder-coated swingarm and mounting plates, isolated on graphite cyclorama, two softboxes to show both contrasting finishes, dramatic chiaroscuro, 3/4 high angle showing the frame geometry clearly, Yamaha R1 race catalog aesthetic, aggressive yet elegant
```

**[B] Context `3:2`**
```
Finished MT-07 with matte black frame and gold swingarm parked in a raw concrete workshop, warm overhead tungsten bulb creating chiaroscuro, custom build magazine feature shot, low 3/4 from drivetrain side showing gold swingarm prominently, Bike EXIF magazine aesthetic
```

### MOBILIER (3 projets)

#### Projet #8 — Banquettes acier restaurant gris anthracite texturé (RAL 7016)

**[A] Hero `4:5`**
```
Textured anthracite grey (RAL 7016, deep charcoal #383E42 with subtle sandy micro-texture) powder-coated steel banquette frame, industrial tube-welded structure, isolated on cream (#F5F5F0) cyclorama, morning soft window light from left, close crop showing the fine structured texture of the finish catching light, Muji × Vitra furniture catalog aesthetic, editorial design magazine
```

**[B] Context `3:2`**
```
Multiple anthracite banquette structures installed on a Parisian restaurant terrace at golden hour, warm wooden seats (not visible, just the frames shown), café terrace ambiance, warm #E85D2C orange shop-front sign blur in background, Paris Haussmannian building backdrop, Monocle magazine feature
```

#### Projet #9 — Table basse Effet Corten Patina

**[A] Hero `4:5`**
```
Low laser-cut steel coffee table with Patina Corten Classic finish (weathered rusty oxide tones #8B4513 blended with warm ochre #D08340 and cool grey shadow areas, organic non-uniform oxidation pattern), solid oak top removed to show the raw Corten base alone, on cream backdrop, single warm sunset light glancing across the textured surface, artisanal furniture photography, Dinesen × ferm Living aesthetic
```

**[B] Context `3:2`**
```
Same Patina Corten coffee table with chunky oak top installed in a minimalist Scandinavian loft living room, huge north-facing window flooding cool light, single warm ember accent from a copper pendant lamp, ceramic coffee cup on table, linen throw, Kinfolk magazine interior feature
```

#### Projet #10 — Étagères murales Blanc de sécurité (RAL 9016)

**[A] Hero `4:5`**
```
Traffic white (RAL 9016, pure warm white #F1F0EA) matte powder-coated steel L-bracket wall shelving system, isolated on charcoal backdrop for maximum contrast, clean industrial design, crisp edge rendering, single soft overhead light, minimalist retail fixture photography
```

**[B] Context `3:2`**
```
8 identical white matte shelves installed across a concept-store brick wall, curated product objects (ceramics, books, plants) in soft-focus, warm retail lighting with single accent orange LED highlighting one shelf, concept-store interior photography, Aesop × Muji retail aesthetic
```

### INDUSTRIEL (3 projets)

#### Projet #11 — Charpente métallique atelier 200 m² (RAL 7035)

**[A] Hero `3:2`**
```
Large light-grey (RAL 7035, soft cool grey #CED3D0) powder-coated steel I-beam structure freshly coated, macro detail close-up showing the primer edge transition and powder coating micro-texture, factory workshop backdrop in soft blur, dramatic industrial light from high windows, single warm 200°C orange rim light (#E85D2C) on one beam edge suggesting just-out-of-oven, documentary industrial photography
```

**[B] Context `3:2`**
```
Massive light-grey powder-coated steel frame installation in a real artisanal workshop interior, low-angle perspective upward showing the I-beams crossing overhead forming a geometric ceiling grid, morning sunlight through skylights creating hard beam shadows on concrete floor, workshop tools on bench in foreground blurred, architectural photography
```

#### Projet #12 — Garde-corps inox brossé aluminium blanc (RAL 9006)

**[A] Hero `3:2`**
```
White aluminium (RAL 9006, warm metallic silver #A5A5A5 with subtle pearlescent shimmer) powder-coated steel handrail, close-up macro of the brushed-metal-look finish at an angle catching light, the ribbed tube structure visible, isolated on deep night backdrop, single directional light from above-right revealing the metallic flake effect, architectural detail photography
```

**[B] Context `3:2`**
```
White aluminium handrail installed along a concrete balcony of a modern residential building in Cergy, late afternoon warm sunlight raking along 45m of railing, geometric shadow patterns on concrete, a couple silhouetted in background walking, architectural magazine photography, Dezeen feature
```

#### Projet #13 — Supports panneaux solaires anti-corrosion (RAL 7040)

**[A] Hero `3:2`**
```
Window grey (RAL 7040, light cool grey #9CA0A9) powder-coated steel solar panel support bracket, isolated on cream backdrop, industrial product shot, razor-sharp edges, showing the dual-layer zinc metallization + epoxy finish by sectioning one detail corner cut away to reveal layers, infographic-like clean industrial photography
```

**[B] Context `3:2`**
```
Rows of grey solar panel support frames installed in a rural solar farm at dawn, hundreds of panels stretching to horizon, first golden morning light grazing the frame tops with warm orange glow, cool blue-grey shadows below, wide aerial-ish low-angle shot, clean-energy industrial editorial photography
```

### PORTAIL (3 projets)

#### Projet #14 — Portail coulissant 5m gris anthracite (RAL 7016)

**[A] Hero `3:2`**
```
Anthracite grey (RAL 7016, deep charcoal #383E42) powder-coated horizontal-slat sliding gate, 5 meters wide, photographed 3/4 angle against seamless cream backdrop, slats in parallel precision, clean industrial product photography, single warm 200°C orange rim light from left edge, subtle micro-texture of matte powder visible, Bauhaus furniture catalog sensibility
```

**[B] Context `3:2`**
```
Same anthracite sliding gate installed at the entrance of a modern concrete residence, late afternoon golden hour side light, the gate mid-slide showing the mechanism integration, gravel driveway in foreground, architectural residential photography, Dwell magazine feature
```

#### Projet #15 — Portail battant vert mousse + clôture (RAL 6005)

**[A] Hero `3:2`**
```
Moss green satin (RAL 6005, forest olive #2F4F2F) powder-coated wrought-iron ornamental swing gate with matching fence section, full frontal catalog shot against cream backdrop, ornate but minimal ironwork design, overhead soft light revealing the subtle satin sheen, architectural metalwork product photography
```

**[B] Context `3:2`**
```
Moss green gate installed at entrance of a stone country house surrounded by oak trees, dappled forest light filtering through leaves creating organic shadow patterns on the gate, warm summer afternoon, gravel path leading to stone house visible in background, French countryside lifestyle photography, Côté Sud magazine aesthetic
```

#### Projet #16 — Portail contemporain à lames noir mat (RAL 9005)

**[A] Hero `3:2`**
```
Jet black matte (RAL 9005, deep #0A0A0A) powder-coated aluminium contemporary horizontal-slat gate, strict geometry, isolated on graphite backdrop with single overhead softbox, the matte finish light-absorbing except for razor-sharp slat edges catching rim light, anti-fingerprint coating visible in its perfectly uniform dry finish, ultra-luxury architectural photography
```

**[B] Context `3:2`**
```
Matte black contemporary gate at the entrance of a minimalist black-clad modern villa, dusk scene with warm interior lights glowing from the house, the gate as silhouette anchor, cinematic architectural photography, John Pawson × Tadao Ando aesthetic
```

---

## 2. PAGES SERVICES

### /services/thermolaquage (hero + process shots)

**Hero wide `16:9`**
```
Wide establishing shot of a professional thermolaquage powder-coating booth interior at 200°C, industrial atmosphere, a single metal part suspended from ceiling hook on trolley conveyor, enveloped in the orange-gold glow (#E85D2C to #FF7A48) of the curing oven behind glowing through a semi-transparent polycarbonate wall, chromed spray gun in soft-focus foreground, dust-free cleanroom aesthetic, mood lighting with deep night shadows (#0F0F1A) and single hot-orange light source, negative space top-left for H1 text overlay, IndustryWeek × MIT Technology Review aesthetic
```

**Process shot #1 — Electrostatic spraying `3:2`**
```
Gloved craftsman's hands wielding a professional electrostatic spray gun releasing a fine orange epoxy powder cloud onto a black metal bracket, shallow depth of field focused on the powder cloud at mid-trajectory, the particles catching warm overhead light like glowing embers, the cabin interior softly blurred, craftsman uniform in charcoal overalls (no face visible), cinematic industrial craftsmanship photography
```

**Process shot #2 — Oven curing `3:2`**
```
Glimpse through the oven door of metal parts suspended inside the 200°C curing chamber, intense golden-orange glow (#FF7A48 to #E85D2C) filling the frame with heat haze shimmer visible, the silhouette of a hanging car part (wheel or frame) dark against the radiant heat, deep atmospheric perspective, single-light scene, ethereal industrial poetry
```

### /services/sablage (hero + avant/après)

**Hero `16:9`**
```
Wide shot of a 7-meter industrial sandblasting booth interior, a large rusty steel gate being sandblasted by a craftsman (back view, no face), visible plumes of grit blasting against the metal, LED overhead work lights, small particles suspended in air catching light rays, deep shadow perimeter, documentary industrial photography, BBC's "How It's Made" aesthetic
```

**Before — Rusty piece `3:2`**
```
Close-up of a rust-covered vintage steel gate section before treatment, heavy orange-brown corrosion (#8B4513 oxide tones), pitted surface, studio lit to show texture relief, on cream backdrop, forensic detail photography, ArtForum restoration feature
```

**After — Sandblasted piece `3:2`**
```
Same style composition : the gate section post-sandblasting, clean bright bare steel with uniform matte finish and fine sandblast texture, subtle cool blue-grey tones (#A5A5A5), studio lit identically to the "before" shot for perfect comparison, the metal now raw and ready for coating, forensic detail photography
```

### /services/metallisation

**Hero `16:9`**
```
A craftsman metallizing a steel support frame with a zinc-spray arc-gun, molten zinc arc visible as bright blue-white flash at the gun tip (#B8D4E8 cool), zinc particles landing on the steel creating a silver matte coating, shower of tiny bright sparks falling, dim industrial workshop background, dramatic single-light strong contrast, documentary industrial photography, National Geographic x Manufacturing
```

### /services/finitions (macro textures)

**Texture macro grid — 4 shots `1:1` each**
```
1) MATTE : Extreme macro of flat matte powder coating surface, uniform grain texture, raking light from left revealing the subtle velvet-like micro-surface, warm grey (#7A7A7A) tones, scientific material photography

2) SATIN : Extreme macro of satin finish powder coating, subtle sheen gradient from soft highlight to deep shadow, surface perfectly smooth, anthracite tone (#383E42), material sample catalog photography

3) TEXTURED : Extreme macro of structured powder coating ("texturé"), visible regular micro-bumps creating orange-peel-like pattern, raking light, warm grey tone, material texture library

4) METALLIC : Extreme macro of metallic powder coating, tiny reflective aluminium flakes visible in the finish, subtle shimmer gradient, champagne silver tone (#B8B5A5), luxury material photography
```

---

## 3. PAGES SPÉCIALITÉS (hero images)

### /specialites/jantes

**Hero `16:9`**
```
A single freshly-coated black satin wheel suspended on an atelier trolley-hook in the curing oven corridor, warm 200°C orange-gold glow (#FF7A48) backlighting it from an open oven in the background creating dramatic silhouette, foreground is in deep charcoal shadow with single cold workshop light on wheel's lower rim edge, negative space right side for text overlay, cinematic automotive craftsmanship photography
```

### /specialites/moto

**Hero `16:9`**
```
A fully restored motorcycle frame (powder-coated moss green or matte black) suspended in an atelier workshop, low perspective upward looking, warm tungsten workshop light from ceiling, exposed brick wall backdrop in soft focus, industrial-artisanal mood, Iron & Air × Bike EXIF magazine cover aesthetic
```

### /specialites/voiture

**Hero `16:9`**
```
Macro close-up of a powder-coated car body panel mid-spray, chrome gun tip in focus releasing a fine colored powder cloud (electric blue or deep red), the panel surface curving into soft-focus, industrial booth backdrop, cinematic automotive industry photography
```

### /specialites/pieces

**Hero `16:9`**
```
Flat-lay top-down editorial composition of 8-10 diverse powder-coated metal parts arranged on cream concrete surface : brackets, hinges, pipes, plates in various RAL finishes (orange, matte black, anthracite, white, green), organized like a typological study, soft morning light from top-left creating subtle shadows, Industrial Wes Anderson x Scandinavian precision, Pantone catalog reference aesthetic
```

---

## 4. PAGES CORE

### Homepage — Hero background plate

**Backplate for nuée `16:9`**
```
Dark moody atelier interior at night with single warm 200°C golden-orange glow (#E85D2C) emanating from an open industrial oven on the right side, cavernous perspective into the depth of the workshop, concrete floor with subtle reflections of the orange light, high ceiling with exposed steel beams disappearing into shadow, atmospheric haze, zero furniture/tools visible (will be overlaid with particle swarm), negative space on left 60% of frame for text, cinematic industrial atmosphere, Denis Villeneuve's Blade Runner 2049 atelier scene aesthetic
```

### /a-propos — Alternative photo blocks (si tu veux remplacer mes cards designées)

**Wide atelier `3:2`**
```
Wide establishing shot of the 1800m² AZ Époxy workshop interior, seen from a raised perspective : sandblasting booth on the left, spray booth center with visible warm orange oven glow through its polycarbonate wall, overhead rail system with suspended parts, craftsmen (silhouettes, no faces) working, clean organized industrial environment, natural morning light from skylights mixed with warm tungsten workshop lamps, documentary architectural photography, Eric Tabuchi aesthetic
```

**Portrait fondateur `4:5`** (si identifié)
```
Environmental portrait of a workshop craftsman in black overalls, mid-action inspecting a freshly powder-coated part held in gloved hands, warm side light from workshop window, shallow DoF on hands and part (face in soft focus or 3/4 cropped for anonymity), concrete workshop backdrop, Werkstatt Verlag × Monocle portrait aesthetic
```

**Équipement — 7m cabine `3:2`**
```
Interior perspective down the length of a 7-meter industrial spray booth, clean walls in matte cream, the vanishing point lit by a distant warm orange oven glow at the end, single hanging part visible mid-cabin, empty trolley rail overhead, cathedral-like industrial perspective, symmetrical composition, architectural industrial photography
```

### /contact — Right side of hero

**Hero `3:2`**
```
Exterior establishing shot of the AZ Époxy workshop building façade in Bruyères-sur-Oise at golden hour, industrial brick + metal-clad warehouse with the modest "AZ ÉPOXY" signage visible above the loading bay door, a single craftsman closing the bay for the day (silhouette, no face), warm late sun casting long shadows, lived-in authentic industrial photography, Eric Tabuchi French industrial suburbs aesthetic
```

---

## 5. BLOG — 10 article headers `16:9`

Numérotés selon l'ordre probable dans blog-data. Adapter au titre réel.

**#1 — "Qu'est-ce que le thermolaquage ?"**
```
Conceptual hero : a single metal bracket hovering mid-spray inside a powder-coating booth, orange epoxy powder cloud visible in mid-air around it like a suspended galaxy of dust, deep shadow backdrop, scientific demonstrative photography, NYT Science Times feature aesthetic
```

**#2 — "Normes qualité (Qualicoat, Qualimarine, GSB, ISO 12944)"**
```
Flat-lay top-down editorial : a powder-coated sample panel with a test cross-cut scoring pattern visible on its surface, a white laboratory glove, calipers, a certification stamp paper, all arranged on a linen backdrop, morning soft light, forensic craftsmanship photography, Wired feature story aesthetic
```

**#3 — "Jantes thermolaquage : guide complet"**
```
Single wheel in three stages displayed left-to-right like a typology: rusty used → sandblasted bare metal → freshly powder-coated black satin, each on its own pedestal against cream backdrop, editorial comparison photography, Bauhaus photo essay aesthetic
```

**#4 — "Durabilité et résistance UV"**
```
Half-and-half split image : one half shows a pristine powder-coated surface, the other half shows an untreated painted surface after UV exposure (cracked, faded), dramatic visual contrast, scientific before/after comparison, lab material testing photography
```

**#5 — "Préparation de surface : sablage, grenaillage, phosphatation"**
```
Extreme macro of a sandblasted steel surface revealing the fine uniform matte texture, raking side light showing every micro-bump, scientific material photography, Nature cover aesthetic
```

**#6 — "Températures et temps de cuisson au four"**
```
Dramatic shot of an industrial oven door cracked open slightly, revealing the incandescent orange-red glow (#E85D2C pushing to #FF3300) inside with just a silhouette of hanging parts visible, heat shimmer and haze, dark atmospheric perimeter, single-light-source cinematic photography
```

**#7 — "Effets spéciaux : texturé, métallisé, patina"**
```
Three stacked sample plates photographed together : one deep anthracite textured, one champagne metallic, one warm rusty Patina, vertical stacked arrangement on cream backdrop, raking light, material sample editorial
```

**#8 — "Thermolaquage vs peinture liquide"**
```
Split-frame comparison : left side spray gun with wet paint mist, right side spray gun with dry orange powder cloud, both in identical industrial settings, symmetrical composition, infographic-quality photography
```

**#9 — "Entretien et nettoyage des pièces thermolaquées"**
```
Close-up of a gloved hand wiping a powder-coated surface with a microfibre cloth, warm natural window light, shallow DoF, residential lifestyle crossover with industrial subject, Kinfolk x Popular Mechanics aesthetic
```

**#10 — "Avantages écologiques du thermolaquage"**
```
Conceptual : a powder-coating gun releasing a fine green-tinted epoxy powder cloud, with a small potted leafy plant in the blurred foreground, bright clean natural light, sustainability editorial photography, National Geographic x Wired feature aesthetic
```

---

## 6. OG IMAGES (social share backgrounds)

Ces plaques servent de fond AU-DESSOUS de la typographie que `ogTemplate` dessine par dessus. Aspect exact `1200×630` (soit `1.91:1`).

**OG Homepage**
```
Wide dark atmospheric atelier interior with a single dominant warm orange-gold oven glow (#E85D2C) on the right third of the frame, left 2/3 in deep shadow (#0F0F1A) reserved for title text overlay, subtle industrial grid visible on the back wall, cinematic branding image, 1.91:1
```

**OG /services**
```
Flat-lay : a single powder-coating spray gun centered low in the frame, fine orange particle suspended in mid-air like mist, cream backdrop, upper 2/3 negative space for text, industrial editorial branding, 1.91:1
```

**OG /couleurs-ral**
```
Dense typological grid of powder-coated sample swatches in the AZ brand palette (orange, cream, anthracite, deep night blue, forest green, signal red), seamless mosaic covering the right 2/3 of frame, left 1/3 deep night backdrop for text, Pantone × Werkstatt aesthetic, 1.91:1
```

**OG /realisations**
```
Artfully arranged still-life of 5 small powder-coated test panels stacked at varied angles like modernist sculpture, on cream concrete surface, dramatic side light, editorial composition, 1.91:1
```

**OG /a-propos**
```
Wide empty industrial workshop interior with the single warm oven glow signaling activity, monumentality and quiet craft, no people, 1.91:1
```

**OG /contact**
```
Top-down satellite-esque simplified map of the Bruyères-sur-Oise area with a single hot-orange marker pin, minimalist geographic illustration on cream background, 1.91:1
```

**OG /faq**
```
Clean flat-lay : a single powder-coated sample square on cream backdrop with a question mark subtly carved into its surface (engraved, not painted), elegant branded image, 1.91:1
```

**OG /blog**
```
Flat-lay of an open technical notebook with hand-drawn thermolaquage process schematics, a brass ruler, mechanical pencil, sample RAL chip, warm window light, editorial craftsmanship journal aesthetic, 1.91:1
```

**OG /devis**
```
Flat-lay of a metal quote-estimation document with a warm orange RAL sample chip pinned to its corner, a vintage mechanical pencil, on cream surface, editorial business photography, 1.91:1
```

**OG /rendez-vous**
```
Top-down close-up of an open architect's journal with a pencil-drawn circle around a specific date, a cup of espresso in brand night ceramic, subtle warm morning light, editorial appointment-booking aesthetic, 1.91:1
```

---

## 7. OUTILS DE GÉNÉRATION RECOMMANDÉS

| Prompt type | Outil recommandé | Note |
|---|---|---|
| Réalisations (portfolio hero) | **Midjourney v6.1** | Meilleur rendu métal/matière, supports `--sref` pour consistency |
| Macros finitions | **Flux.1 Pro** | Excellent sur micro-textures |
| Portraits/craftsmen | **Flux.1 Dev** | Moins plastique que MJ sur mains |
| OG plates (texte overlay) | **DALL-E 3** | Respecte les négatifs "no text" mieux |
| Hero cinématiques | **Midjourney v6.1 + `--stylize 400`** | Atmosphère industrielle |

### Workflow conseillé pour consistency

1. Génère 1 prompt "style reference" avec MJ v6.1 → récupère l'URL du best rendu
2. Ajoute `--sref <URL>` à **tous** les prompts suivants
3. Résultat : 32 photos cohérentes visuellement (même grain, même light direction, même palette)

### Paramètres Midjourney v6.1 recommandés

```
--ar 16:9 --style raw --stylize 300 --chaos 5 --sref <URL_STYLE_REF>
```

Pour les macros/textures : `--stylize 150 --chaos 0`
Pour les hero cinématiques : `--stylize 500 --chaos 15`

### Post-processing Photoshop à appliquer sur TOUT

1. Camera RAW filter : +4 Dehaze, -8 Saturation (désature le global), +15 Vibrance (remonte les couleurs pures)
2. Selective color : shift "Reds" -5 Cyan +10 Magenta +20 Yellow (recale sur brand orange #E85D2C)
3. LUT final : Fuji Pro 400H (Cinematic) opacity 35%
4. Grain : +8 fine mono
5. Export : WebP Q85 + AVIF Q80 (Next.js Image en servira le bon format)

---

## 8. PRIORISATION (pour budget image limité)

Si tu dois shooter en priorité, voici l'ordre d'impact Awwwards :

| Rang | Ensemble | Impact | Coût estimé (MJ) |
|---|---|---|---|
| 1 | **4 heroes services** (thermo, sablage, métallisation, finitions) | 🔥🔥🔥🔥🔥 | 8 runs |
| 2 | **16 réalisations hero** (catalog shots) | 🔥🔥🔥🔥🔥 | 32 runs |
| 3 | **Hero homepage backplate** | 🔥🔥🔥🔥 | 4 runs |
| 4 | **4 spécialités heroes** | 🔥🔥🔥 | 8 runs |
| 5 | **10 OG images** | 🔥🔥 | 20 runs |
| 6 | **10 blog headers** | 🔥🔥 | 20 runs |
| 7 | **3 a-propos alternates** (si tu veux remplacer les cards designées) | 🔥 | 6 runs |

**Budget total Midjourney v6.1 (Standard plan, 3.33€/mois pour ~20h fast generation)** : tout ça passe largement dans 1 mois de plan Standard. ≈ 100 images finales après sélection (2:1 keep ratio).

---

## 9. FALLBACK — si tu ne veux PAS de photos du tout

Le site peut garder le narrative swarm comme substitut visuel principal ET ajouter :

1. **Des vidéos courtes bouclées** de la nuée en phase Paint-Gun / Molten / Oven (rendu canvas capture, 3-5s, webm)
2. **Des schémas techniques** vectoriels dessinés pour /services (coupe d'une pièce, flow de production en 6 étapes)
3. **Des grandes typos RAL** en watermark pour toutes les sections (comme on a fait pour /a-propos avec "1800")

Cette voie est défendable artistiquement et garde la cohérence du concept "pas de photo mais une nuée qui RACONTE" — mais le jury Awwwards risque de pénaliser l'absence de preuve produit. Recommandation : le pack photo minimum = les 4 heroes services + les 16 hero réalisations (48 images après sélection). Le reste peut rester dans le langage graphique du site.
