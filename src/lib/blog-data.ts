export interface BlogArticle {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  image?: string;
  content: string;
}

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: "thermolaquage-vs-peinture-liquide",
    title: "Thermolaquage vs peinture liquide : quel choix pour vos pièces métalliques ?",
    description:
      "Comparatif complet entre le thermolaquage poudre époxy et la peinture liquide traditionnelle. Durabilité, coût, environnement.",
    date: "2025-01-15",
    readTime: "6 min",
    category: "Guide",
    content: `
      <p>Quand il s'agit de protéger et embellir des pièces métalliques, deux grandes options s'offrent à vous : la <strong>peinture liquide traditionnelle</strong> et le <strong>thermolaquage poudre époxy</strong>. Si la peinture liquide reste répandue, le thermolaquage s'impose de plus en plus comme la solution professionnelle de référence. Voici pourquoi.</p>

      <h2>Le principe du thermolaquage</h2>
      <p>Le thermolaquage consiste à appliquer une poudre époxy ou polyester par projection électrostatique sur une pièce métallique préalablement sablée. La pièce est ensuite placée dans un four à 180-200°C pendant 15 à 20 minutes. La poudre fond et se polymérise pour former un revêtement extrêmement résistant.</p>

      <h2>Durabilité : avantage thermolaquage</h2>
      <p>Le film obtenu par thermolaquage mesure entre 60 et 120 microns d'épaisseur, contre 20 à 40 microns pour une peinture liquide. Cette épaisseur supérieure confère une résistance accrue aux chocs, aux rayures et à la corrosion. En conditions extérieures, un thermolaquage bien réalisé conserve son aspect pendant <strong>10 à 15 ans</strong>, contre 3 à 5 ans pour une peinture liquide standard.</p>

      <h2>Impact environnemental : 0 COV</h2>
      <p>La peinture liquide utilise des solvants organiques volatils (COV) nocifs pour la santé et l'environnement. Le thermolaquage, lui, fonctionne avec de la poudre sèche : <strong>zéro solvant, zéro COV, zéro déchet liquide</strong>. La poudre excédentaire est récupérée et recyclée à 98%. C'est un procédé véritablement éco-responsable.</p>

      <h2>Coût : un investissement rentable</h2>
      <p>Si le thermolaquage peut sembler plus coûteux à l'unité, il s'avère largement rentable sur le long terme. Pas de retouche à prévoir pendant 10 ans, pas d'entretien particulier, résistance aux UV et aux intempéries. Pour les professionnels qui traitent des volumes importants, le coût unitaire diminue considérablement.</p>

      <h2>Choix des couleurs</h2>
      <p>Le thermolaquage offre un éventail de plus de <strong>200 couleurs RAL</strong> ainsi que des finitions spéciales : mat, satiné, brillant, texturé, métallisé. Des effets premium comme le givre, la rouille Corten ou le caméléon sont également disponibles. La peinture liquide offre aussi une large palette, mais les finitions spéciales sont plus difficiles à reproduire de manière homogène.</p>

      <h2>Notre verdict</h2>
      <p>Pour toute application industrielle, automobile ou décorative exigeant durabilité et qualité, le thermolaquage est le choix évident. Chez AZ Époxy, nous traitons chaque pièce avec le même niveau d'exigence, que ce soit un jeu de jantes ou un portail de 6 mètres.</p>
    `,
  },
  {
    slug: "preparer-jantes-thermolaquage",
    title: "Comment préparer vos jantes avant un thermolaquage ?",
    description:
      "Les étapes essentielles pour préparer vos jantes alu avant de les confier à un professionnel du thermolaquage.",
    date: "2025-02-10",
    readTime: "5 min",
    category: "Tutoriel",
    content: `
      <p>Vous souhaitez faire thermolaquer vos jantes pour leur redonner un aspect neuf ou changer radicalement de look ? Une bonne préparation en amont facilite le travail du professionnel et garantit un résultat optimal. Voici ce que vous devez savoir.</p>

      <h2>Étape 1 : Démonter les pneus</h2>
      <p>Idéalement, apportez vos jantes <strong>sans pneus</strong>. Le démontage/remontage des pneumatiques est une opération que votre garagiste peut réaliser facilement. Si vous ne pouvez pas les démonter, pas de panique : chez AZ Époxy, nous pouvons nous en charger, mais prévoyez un délai supplémentaire.</p>

      <h2>Étape 2 : Retirer les accessoires</h2>
      <p>Enlevez les caches centraux, les plombs d'équilibrage, les capteurs TPMS si possible, et tout autocollant ou cache-écrou. Ces éléments ne supportent pas les 180°C du four de polymérisation.</p>

      <h2>Étape 3 : Nettoyage basique</h2>
      <p>Un simple nettoyage au jet d'eau suffit pour retirer la boue, le goudron et la poussière de frein. Pas besoin de décaper vous-même : le sablage professionnel que nous réalisons en atelier élimine toute trace d'ancienne peinture, de corrosion et d'impuretés.</p>

      <h2>Étape 4 : Inspecter les dégâts</h2>
      <p>Examinez vos jantes à la recherche de fissures, voiles ou déformations. Un thermolaquage ne corrige pas les défauts structurels. Si une jante est fissurée, elle doit être réparée (voire remplacée) avant le traitement. Les rayures superficielles et impacts légers seront traités lors de la préparation.</p>

      <h2>Étape 5 : Choisir votre couleur</h2>
      <p>Consultez notre <strong>nuancier de plus de 200 couleurs RAL</strong> sur notre site. Les teintes les plus populaires pour les jantes sont le noir mat (RAL 9005 mat), le gris anthracite (RAL 7016), le bronze satiné et le gunmetal. N'hésitez pas à nous demander conseil — nous réalisons aussi des finitions bicolores et des effets spéciaux.</p>

      <h2>Délai et tarif</h2>
      <p>Comptez en moyenne <strong>3 à 5 jours ouvrés</strong> pour un jeu de 4 jantes (sablage + primaire + thermolaquage + contrôle qualité). Notre service express permet un traitement en 48h pour les demandes urgentes. Le tarif varie selon la taille : de 80€/jante pour du 15-17 pouces à 200€/jante pour du 21-22 pouces.</p>
    `,
  },
  {
    slug: "couleurs-ral-guide-complet",
    title: "Guide complet des couleurs RAL pour le thermolaquage",
    description:
      "Tout savoir sur le nuancier RAL : histoire, familles de couleurs, comment choisir la teinte idéale pour votre projet.",
    date: "2025-03-05",
    readTime: "7 min",
    category: "Guide",
    content: `
      <p>Le nuancier <strong>RAL</strong> est le standard européen de référence pour la désignation des couleurs. Créé en 1927 en Allemagne (Reichs-Ausschuß für Lieferbedingungen), il compte aujourd'hui plus de 200 teintes classiques utilisées dans l'industrie, l'architecture et le design. Voici tout ce que vous devez savoir pour choisir la couleur idéale.</p>

      <h2>Les familles RAL Classic</h2>
      <p>Le nuancier RAL Classic est organisé en 9 familles :</p>
      <ul>
        <li><strong>RAL 1xxx — Jaunes</strong> : du jaune zinc au jaune safran</li>
        <li><strong>RAL 2xxx — Oranges</strong> : de l'orange pur au rouge sang</li>
        <li><strong>RAL 3xxx — Rouges</strong> : du rouge flamme au rose</li>
        <li><strong>RAL 4xxx — Violets</strong> : du bordeaux au lilas</li>
        <li><strong>RAL 5xxx — Bleus</strong> : du bleu ciel au bleu acier</li>
        <li><strong>RAL 6xxx — Verts</strong> : du vert émeraude au vert olive</li>
        <li><strong>RAL 7xxx — Gris</strong> : du gris clair au gris anthracite</li>
        <li><strong>RAL 8xxx — Bruns</strong> : du beige au brun chocolat</li>
        <li><strong>RAL 9xxx — Blancs et noirs</strong> : du blanc pur au noir profond</li>
      </ul>

      <h2>Les couleurs les plus demandées</h2>
      <p>Chez AZ Époxy, voici notre top 10 des couleurs les plus commandées :</p>
      <ol>
        <li><strong>RAL 9005</strong> — Noir foncé (mat ou brillant)</li>
        <li><strong>RAL 7016</strong> — Gris anthracite</li>
        <li><strong>RAL 9010</strong> — Blanc pur</li>
        <li><strong>RAL 7035</strong> — Gris clair</li>
        <li><strong>RAL 9016</strong> — Blanc signalisation</li>
        <li><strong>RAL 7024</strong> — Gris graphite</li>
        <li><strong>RAL 3004</strong> — Rouge pourpre</li>
        <li><strong>RAL 5003</strong> — Bleu saphir</li>
        <li><strong>RAL 6005</strong> — Vert mousse</li>
        <li><strong>RAL 8017</strong> — Brun chocolat</li>
      </ol>

      <h2>Matt, satiné ou brillant ?</h2>
      <p>Chaque couleur RAL est disponible en plusieurs finitions :</p>
      <ul>
        <li><strong>Brillant</strong> (gloss 80+) : finition miroir, idéale pour les jantes et pièces auto</li>
        <li><strong>Satiné</strong> (gloss 40-60) : compromis élégant, très utilisé en mobilier et architecture</li>
        <li><strong>Mat</strong> (gloss &lt;20) : look contemporain, masque les micro-imperfections</li>
        <li><strong>Texturé</strong> : finition granuleuse anti-dérapante, parfaite pour le mobilier extérieur</li>
      </ul>

      <h2>Comment choisir ?</h2>
      <p>Notre conseil : commandez un <strong>échantillon</strong> avant de vous décider. Les couleurs à l'écran ne remplacent jamais un rendu physique. Chez AZ Époxy, nous pouvons réaliser une plaquette d'essai sur un échantillon métallique pour valider votre choix avant de traiter l'ensemble de vos pièces.</p>
    `,
  },
  {
    slug: "sablage-metal-pourquoi-indispensable",
    title: "Sablage métal : pourquoi c'est une étape indispensable",
    description:
      "Le sablage est la clé d'un thermolaquage réussi. Découvrez pourquoi cette préparation de surface est incontournable.",
    date: "2025-04-02",
    readTime: "5 min",
    category: "Technique",
    content: `
      <p>On ne le répétera jamais assez : un thermolaquage réussi commence par un <strong>sablage impeccable</strong>. Cette étape de préparation de surface est souvent méconnue du grand public, mais elle conditionne 80% de la qualité du résultat final.</p>

      <h2>Qu'est-ce que le sablage ?</h2>
      <p>Le sablage (ou grenaillage) consiste à projeter un abrasif à haute pression sur une surface métallique. L'impact des particules retire la rouille, les anciennes couches de peinture, la calamine et toute contamination de surface. Le résultat : un métal propre, rugueux et parfaitement prêt à recevoir un revêtement.</p>

      <h2>Pourquoi sabler avant de thermolaquer ?</h2>
      <p>La poudre époxy a besoin d'une surface propre et rugueuse pour adhérer correctement. Sans sablage :</p>
      <ul>
        <li>La poudre n'adhère pas uniformément → cloques et décollements</li>
        <li>La rouille sous-jacente continue à corroder le métal → le revêtement se soulève</li>
        <li>Les résidus de graisse empêchent la polymérisation correcte → finition irrégulière</li>
      </ul>
      <p>Le sablage crée un profil d'accroche (rugosité Sa 2.5 selon ISO 8501) qui multiplie par 5 l'adhérence de la poudre par rapport à une surface simplement dégraissée.</p>

      <h2>Les différents abrasifs</h2>
      <p>Chez AZ Époxy, nous utilisons différents médias selon la pièce à traiter :</p>
      <ul>
        <li><strong>Corindon brun</strong> (oxyde d'aluminium) : abrasif polyvalent, idéal pour l'acier et la fonte</li>
        <li><strong>Microbilles de verre</strong> : plus doux, parfait pour l'aluminium et les pièces décoratives</li>
        <li><strong>Grenat</strong> : compromis entre agressivité et finesse, excellent pour les jantes alu</li>
      </ul>

      <h2>Sablage vs décapage chimique</h2>
      <p>Le décapage chimique utilise des produits corrosifs pour dissoudre les anciennes peintures. Il est efficace mais présente des inconvénients : temps de traitement long (12-48h), résidus chimiques à neutraliser, impact environnemental. Le sablage mécanique est plus rapide (quelques minutes), plus propre et crée directement le profil de rugosité nécessaire.</p>

      <h2>Notre processus</h2>
      <p>Notre cabine de sablage professionnelle permet de traiter des pièces jusqu'à <strong>7 mètres de long</strong>. Chaque pièce est inspectée après sablage pour vérifier la propreté de surface et le profil de rugosité avant de passer à l'étape de poudrage. C'est cette rigueur qui garantit la tenue de nos thermolaquages dans le temps.</p>
    `,
  },
  {
    slug: "metallisation-zinc-protection-ultime",
    title: "Métallisation au zinc : la protection anti-corrosion ultime",
    description:
      "Découvrez la métallisation au zinc par projection thermique, le traitement anticorrosion le plus performant pour l'acier.",
    date: "2025-05-12",
    readTime: "6 min",
    category: "Technique",
    content: `
      <p>Pour les pièces exposées à des environnements agressifs — maritime, industriel, chimique — le thermolaquage seul peut ne pas suffire. C'est là qu'intervient la <strong>métallisation au zinc</strong>, une technique de protection cathodique qui offre une durée de vie exceptionnelle.</p>

      <h2>Principe de la métallisation</h2>
      <p>La métallisation par projection thermique (ou schoopage) consiste à fondre du fil de zinc dans un arc électrique ou une flamme, puis à le projeter sous forme de micro-gouttelettes sur la surface métallique. Le zinc se solidifie instantanément et forme une couche protectrice de 80 à 150 microns.</p>

      <h2>Protection cathodique : le zinc se sacrifie</h2>
      <p>Le zinc est un métal plus réactif que l'acier (potentiel électrochimique inférieur). En cas de rayure ou d'impact, le zinc se corrode <strong>à la place de l'acier</strong>. C'est le principe de l'anode sacrificielle, le même utilisé dans la galvanisation à chaud. La différence : la métallisation peut être appliquée sur des pièces de toute taille, sans les plonger dans un bain de zinc fondu.</p>

      <h2>Système duplex : métallisation + thermolaquage</h2>
      <p>La combinaison métallisation + thermolaquage est ce qu'on appelle un <strong>système duplex</strong>. C'est la Rolls-Royce de la protection anti-corrosion :</p>
      <ul>
        <li>La couche de zinc protège l'acier par effet cathodique</li>
        <li>Le thermolaquage protège le zinc de l'usure mécanique et des UV</li>
        <li>La durée de vie combinée est <strong>supérieure à la somme</strong> des deux traitements séparés (effet synergique)</li>
      </ul>
      <p>Un système duplex bien réalisé offre une protection de <strong>25 à 40 ans</strong> en environnement extérieur, contre 10-15 ans pour un thermolaquage seul.</p>

      <h2>Applications typiques</h2>
      <p>Nous recommandons la métallisation pour :</p>
      <ul>
        <li>Portails et clôtures en bord de mer</li>
        <li>Structures métalliques extérieures (pergolas, charpentes)</li>
        <li>Mobilier urbain et équipements de collectivités</li>
        <li>Pièces industrielles exposées à des produits chimiques</li>
        <li>Garde-corps et rampes en milieu humide</li>
      </ul>

      <h2>Métallisation chez AZ Époxy</h2>
      <p>Notre équipement de projection thermique à l'arc permet de traiter des pièces de grande dimension dans notre cabine de 7 mètres. Le processus complet — sablage Sa 3, métallisation zinc 100µm, thermolaquage 80µm — est réalisé dans un délai de 5 à 7 jours ouvrés. Un investissement qui se rentabilise dès la première année grâce à l'absence totale d'entretien.</p>
    `,
  },
  {
    slug: "entretien-pieces-thermolaquees",
    title: "Comment entretenir vos pièces thermolaquées pour qu'elles durent",
    description:
      "Conseils pratiques pour entretenir et nettoyer vos pièces thermolaquées : jantes, portails, mobilier, garde-corps.",
    date: "2025-06-18",
    readTime: "4 min",
    category: "Conseil",
    content: `
      <p>Le thermolaquage est réputé pour sa durabilité exceptionnelle. Mais un minimum d'entretien permet de conserver l'éclat de vos pièces pendant des décennies. Voici nos recommandations.</p>

      <h2>Nettoyage régulier</h2>
      <p>La règle d'or : un nettoyage régulier à l'eau tiède savonneuse. Utilisez un chiffon doux ou une éponge non abrasive avec du savon neutre (type savon de Marseille ou liquide vaisselle doux). Rincez abondamment à l'eau claire et séchez avec un chiffon propre.</p>

      <h2>Ce qu'il faut éviter</h2>
      <ul>
        <li><strong>Solvants agressifs</strong> : acétone, white spirit, diluant — ils attaquent le film de poudre</li>
        <li><strong>Éponges abrasives</strong> : Scotch-Brite, paille de fer — elles rayent la surface</li>
        <li><strong>Nettoyeurs haute pression</strong> à distance trop courte (&lt;30 cm) — le jet peut endommager les bords</li>
        <li><strong>Produits acides</strong> : détartrants, nettoyants WC — corrosion du revêtement</li>
      </ul>

      <h2>Fréquence recommandée</h2>
      <p>Pour les pièces extérieures (portails, garde-corps, mobilier de jardin), nous recommandons un nettoyage <strong>2 à 4 fois par an</strong>, idéalement à chaque changement de saison. Pour les jantes, un lavage mensuel est préconisé en raison de l'exposition à la poussière de frein et au sel de déneigement.</p>

      <h2>Retouches mineures</h2>
      <p>En cas de rayure profonde ou d'éclat, n'essayez pas de repeindre vous-même. Contactez-nous : nous pouvons réaliser une <strong>retouche localisée</strong> ou, si nécessaire, un re-thermolaquage de la pièce concernée. Traiter une rayure rapidement évite que la corrosion ne s'installe sous le revêtement.</p>

      <h2>Garantie AZ Époxy</h2>
      <p>Tous nos thermolaquages sont garantis <strong>2 ans</strong> contre les défauts de fabrication (cloques, décollements, perte d'adhérence). Cette garantie couvre une utilisation normale dans des conditions standard. Pour les systèmes duplex (métallisation + thermolaquage), la garantie est étendue à 5 ans.</p>
    `,
  },
  {
    slug: "thermolaquage-portail-fer-forge",
    title: "Thermolaquage d'un portail en fer forgé : le guide complet",
    description:
      "De la dépose à la repose : tout le processus de thermolaquage d'un portail en fer forgé expliqué étape par étape.",
    date: "2025-07-22",
    readTime: "6 min",
    category: "Guide",
    content: `
      <p>Le portail est la première chose que vos visiteurs voient. Un portail en fer forgé thermolaqué associe l'élégance du travail artisanal à la durabilité d'une finition industrielle. Voici comment se déroule le processus complet.</p>

      <h2>Étape 1 : Diagnostic et devis</h2>
      <p>Nous commençons par un diagnostic de votre portail : état de la structure, niveau de corrosion, dimensions exactes. Un devis détaillé vous est envoyé sous 24 heures avec les options de traitement recommandées. Pour les portails très corrodés, nous pouvons recommander un système duplex (métallisation + thermolaquage).</p>

      <h2>Étape 2 : Dépose</h2>
      <p>La dépose du portail peut être réalisée par vos soins ou par notre équipe. Pensez à protéger les gonds et les motorisations. Si votre portail est motorisé, nous vous recommandons de faire intervenir votre installateur pour la déconnexion et la reconnexion.</p>

      <h2>Étape 3 : Sablage intégral</h2>
      <p>Notre cabine de <strong>7 mètres</strong> accepte les portails de grande dimension. Le sablage retire toute trace de rouille, d'ancienne peinture et de calamine. Les barreaux, volutes et éléments décoratifs sont sablés dans leurs moindres recoins — un avantage majeur par rapport au ponçage manuel.</p>

      <h2>Étape 4 : Traitement anticorrosion</h2>
      <p>Après sablage, un primaire anticorrosion est appliqué dans les heures qui suivent pour éviter toute ré-oxydation. Pour les portails exposés (bord de mer, zone humide), nous appliquons une couche de métallisation zinc avant le primaire.</p>

      <h2>Étape 5 : Thermolaquage</h2>
      <p>La poudre époxy ou polyester est appliquée par projection électrostatique. La charge électrique garantit que la poudre atteint chaque recoin, y compris l'intérieur des tubes et les zones difficiles d'accès. La pièce passe ensuite au four à 190°C pendant 20 minutes.</p>

      <h2>Étape 6 : Contrôle et livraison</h2>
      <p>Chaque portail est inspecté visuellement et au moyen d'un contrôle d'épaisseur (60-120 µm requis). Nous vérifions l'uniformité de la couleur, l'absence de coulures et l'adhérence du revêtement. Le portail est ensuite emballé avec soin pour le transport.</p>

      <h2>Tarif indicatif</h2>
      <p>Le thermolaquage d'un portail en fer forgé standard (2 vantaux, ~3m de large) se situe entre <strong>400 et 800 €</strong> selon l'état initial et le traitement choisi. Comptez un délai de 5 à 7 jours ouvrés.</p>
    `,
  },
  {
    slug: "finitions-speciales-tendances",
    title: "Finitions spéciales : les tendances 2025 en thermolaquage",
    description:
      "Effet rouille Corten, givre, caméléon, soft-touch : découvrez les finitions tendance qui subliment vos pièces.",
    date: "2025-08-30",
    readTime: "5 min",
    category: "Tendances",
    content: `
      <p>Le thermolaquage ne se limite plus aux couleurs unies classiques. Les fabricants de poudre rivalisent d'innovation pour proposer des finitions toujours plus spectaculaires. Tour d'horizon des tendances qui marquent 2025.</p>

      <h2>L'effet rouille Corten</h2>
      <p>Très prisé en architecture contemporaine, l'effet Corten reproduit l'aspect de l'acier auto-patiné sans aucune corrosion réelle. La poudre imite les nuances orangées et brunes de l'oxydation naturelle. Résultat : un look industriel et organique, avec la protection d'un thermolaquage classique. Idéal pour les façades, les jardinières et le mobilier extérieur haut de gamme.</p>

      <h2>Le givre et les textures 3D</h2>
      <p>Les finitions givrées (ou "wrinkle") créent un relief tactile sur la surface. La poudre, formulée avec des agents texturants, produit une surface ondulée qui évoque le givre ou l'écorce d'arbre. Au-delà de l'esthétique, cette texture présente un avantage fonctionnel : elle masque les imperfections de surface et offre une meilleure prise en main.</p>

      <h2>Le caméléon (dichroïque)</h2>
      <p>Les pigments interférentiels changent de couleur selon l'angle de vue. Un bleu qui vire au violet, un vert qui devient doré... Ces finitions captivantes sont particulièrement populaires sur les jantes et les pièces moto. Chez AZ Époxy, notre gamme <strong>Dichroic</strong> propose 4 combinaisons de couleurs pour un effet unique garanti.</p>

      <h2>Le soft-touch</h2>
      <p>Inspiré de l'industrie automobile premium, le soft-touch donne à la surface un toucher velouté, presque « peau de pêche ». Cette finition ultra-mate (gloss &lt;5) est recherchée pour le mobilier design, les luminaires et les accessoires de luxe. Elle apporte une sensation de douceur incomparable au toucher.</p>

      <h2>Le métallisé bonded</h2>
      <p>Les poudres bonded intègrent des paillettes métalliques directement fusionnées aux grains de poudre époxy. Le résultat est plus homogène et plus profond que les métallisés classiques. Or, argent, bronze, cuivre, gunmetal : les options sont nombreuses et donnent un rendu premium incomparable.</p>

      <h2>Disponibilité chez AZ Époxy</h2>
      <p>Toutes ces finitions sont disponibles sur commande. Certaines nécessitent un délai d'approvisionnement de 3 à 5 jours pour la poudre. Nous vous invitons à consulter notre page <strong>Finitions spéciales</strong> ou à nous contacter pour discuter de votre projet créatif.</p>
    `,
  },
  {
    slug: "thermolaquage-moto-custom",
    title: "Thermolaquage moto : personnalisez votre machine à l'infini",
    description:
      "Cadre, bras oscillant, jantes, carter : le thermolaquage ouvre des possibilités infinies pour customiser votre moto.",
    date: "2025-09-15",
    readTime: "5 min",
    category: "Spécialité",
    content: `
      <p>La moto, c'est la passion du détail. Chaque pièce compte, chaque couleur raconte une histoire. Le thermolaquage est devenu l'arme secrète des motards exigeants qui veulent un résultat <strong>durable, unique et professionnel</strong>.</p>

      <h2>Quelles pièces thermolaquer ?</h2>
      <p>Quasiment toutes les pièces métalliques de votre moto peuvent être thermolaquées :</p>
      <ul>
        <li><strong>Cadre et sous-cadre</strong> : la transformation la plus spectaculaire</li>
        <li><strong>Bras oscillant</strong> : souvent assorti au cadre</li>
        <li><strong>Jantes</strong> : rayons, bâtons ou à disque</li>
        <li><strong>Platines de repose-pieds, tés de fourche</strong></li>
        <li><strong>Carter moteur</strong> (après masquage des zones d'assemblage)</li>
        <li><strong>Supports de phare, garde-boue, béquille</strong></li>
      </ul>

      <h2>Le processus pour une moto</h2>
      <p>Le thermolaquage moto demande une attention particulière car les pièces sont souvent complexes avec des zones d'assemblage précises :</p>
      <ol>
        <li>Démontage complet des éléments à traiter</li>
        <li>Masquage des portées de roulements, filetages et surfaces d'appui</li>
        <li>Sablage adapté (microbilles pour l'alu, corindon pour l'acier)</li>
        <li>Application de la poudre et cuisson contrôlée</li>
        <li>Retrait des masquages et contrôle dimensionnel</li>
      </ol>

      <h2>Idées de personnalisation</h2>
      <p>Les combinaisons les plus populaires chez nos clients motards :</p>
      <ul>
        <li>Cadre noir mat + jantes or métallisé → look café racer</li>
        <li>Cadre vert British Racing + pièces alu brossé → style classique</li>
        <li>Full noir brillant cadre + jantes + bras → stealth fighter</li>
        <li>Cadre blanc nacré + jantes rouge fluo → racing audacieux</li>
      </ul>

      <h2>Tarifs et délais</h2>
      <p>Un cadre moto complet (sablage + thermolaquage) se situe entre <strong>200 et 400 €</strong>. Pour un projet complet (cadre + bras + jantes + petites pièces), comptez entre 500 et 900 € selon la complexité. Délai standard : 5 à 7 jours ouvrés. Service express disponible sur demande.</p>

      <h2>Conseil de pro</h2>
      <p>Profitez d'une révision moteur pour thermolaquer votre cadre. La moto est déjà démontée, c'est le moment idéal. Et pensez à nous confier toutes les pièces en même temps pour garantir une parfaite homogénéité de teinte.</p>
    `,
  },
  {
    slug: "normes-qualite-thermolaquage-qualicoat",
    title: "Normes et certifications en thermolaquage : ce que vous devez savoir",
    description:
      "Qualicoat, Qualimarine, GSB, ISO 12944 : comprendre les normes qualité qui garantissent un thermolaquage durable.",
    date: "2025-10-28",
    readTime: "5 min",
    category: "Technique",
    content: `
      <p>Dans le monde du thermolaquage, toutes les prestations ne se valent pas. Les normes et certifications existent pour garantir un niveau de qualité mesurable et reproductible. Voici les principales références à connaître.</p>

      <h2>Qualicoat : la référence européenne</h2>
      <p>Le label <strong>Qualicoat</strong> est le standard européen pour le laquage sur aluminium. Il impose des exigences strictes : épaisseur minimale de 60 µm, tests d'adhérence (quadrillage), résistance au brouillard salin (1000 heures minimum), résistance aux UV (Florida Test). Un thermolaqueur certifié Qualicoat est audité régulièrement et ses produits sont testés en laboratoire indépendant.</p>

      <h2>Qualimarine : pour les environnements marins</h2>
      <p>Extension de Qualicoat, <strong>Qualimarine</strong> certifie les traitements adaptés aux atmosphères marines. Les tests de brouillard salin sont portés à 2000 heures et les exigences de prétraitement sont renforcées. Indispensable pour les constructions en bord de mer.</p>

      <h2>GSB : le standard allemand</h2>
      <p>Le label <strong>GSB</strong> (Gütegemeinschaft für die Stückbeschichtung von Bauteilen) est l'équivalent allemand de Qualicoat, avec des exigences encore plus strictes sur certains critères. Il est particulièrement reconnu en Europe du Nord et en Suisse.</p>

      <h2>ISO 12944 : protection anticorrosion</h2>
      <p>La norme <strong>ISO 12944</strong> définit les systèmes de protection anticorrosion pour les structures en acier. Elle classifie les environnements de C1 (intérieur sec) à CX (offshore extrême) et prescrit les systèmes de peinture adaptés à chaque catégorie. Un thermolaqueur sérieux sait positionner sa prestation dans cette classification.</p>

      <h2>Les tests de contrôle qualité</h2>
      <p>Chez AZ Époxy, chaque lot est contrôlé selon les protocoles suivants :</p>
      <ul>
        <li><strong>Épaisseur</strong> : mesure au micromètre (objectif 60-120 µm)</li>
        <li><strong>Adhérence</strong> : test de quadrillage (ISO 2409) — aucun décollement toléré</li>
        <li><strong>Brillance</strong> : mesure au glossmètre pour vérifier la conformité à la finition commandée</li>
        <li><strong>Aspect visuel</strong> : inspection à 100% sous éclairage contrôlé</li>
      </ul>

      <h2>Pourquoi c'est important pour vous</h2>
      <p>Un prestataire qui applique ces normes vous garantit un résultat prévisible et durable. Méfiez-vous des tarifs trop bas qui s'accompagnent souvent de raccourcis sur la préparation de surface ou l'épaisseur de poudre. La qualité d'un thermolaquage se mesure en années de tenue, pas en euros économisés à la commande.</p>
    `,
  },
];
