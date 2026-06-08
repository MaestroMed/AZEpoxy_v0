/**
 * Spécialités — marchés cibles d'AZ Époxy :
 * jantes auto, moto, pièces auto et pièces métalliques industrielles.
 */

export interface Specialty {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  benefits: { title: string; description: string }[];
  popularColors: string[];
  priceFrom: string;
  turnaround: string;
  faqs: { question: string; answer: string }[];
  /* ── Champs conversion optionnels (pages argent enrichies) ──────────
     Rétro-compatibles : les spécialités sans ces champs rendent le
     template historique inchangé. */
  metaTitle?: string;
  metaDescription?: string;
  heroIntro?: string;
  pricingTiers?: { label: string; priceFrom: string; includes: string }[];
  trustSignals?: string[];
  internalLinks?: { anchor: string; href: string }[];
  ctaText?: string;
}

export const SPECIALTIES_FALLBACK: Specialty[] = [
  {
    slug: "jantes",
    title: "Thermolaquage de Jantes Auto",
    tagline: "Rénovation, peinture et personnalisation de jantes alliage — finition four, tenue garantie",
    metaTitle: "Thermolaquage Jantes Alu 95 — Dès 80 €/jante | AZ Époxy",
    metaDescription: "Thermolaquage et peinture de jantes alu à Bruyères-sur-Oise (95). Sablage + cuisson four, finition durable. Devis gratuit sous 24 h, dès 80 €/jante. Île-de-France & Oise.",
    description: "Vos jantes piquées, écaillées ou ternies retrouvent un éclat de neuf — ou la couleur exacte que vous voulez. Sablage, primaire d'accrochage, poudre cuite au four : une finition qui résiste à la poussière de frein, au sel et aux graviers, là où la peinture aérosol s'écaille en une saison. Devis gratuit sous 24 h.",
    heroIntro: "Vos jantes piquées, écaillées ou ternies retrouvent un éclat de neuf — ou la couleur exacte que vous voulez. Sablage, primaire d'accrochage, poudre cuite au four : une finition qui résiste à la poussière de frein, au sel et aux graviers, là où la peinture aérosol s'écaille en une saison. Devis gratuit sous 24 h.",
    icon: "CircleDot",
    benefits: [
      {
        title: "Une finition four, pas un coup de bombe",
        description: "Sablage complet, primaire d'accrochage époxy sans zinc ni plomb, puis poudre cuite au four : le revêtement fait corps avec l'aluminium. Résultat homogène, sans coulure ni reprise, avec une épaisseur régulière de 60 à 80 µm sur toute la jante, y compris les rayons et le creux de barrette."
      },
      {
        title: "Résiste à la poussière de frein incandescente",
        description: "Les particules de frein brûlantes s'incrustent dans une peinture classique et ternissent vos jantes en quelques mois. Le revêtement époxy forme une barrière chimique qui se nettoie d'un coup d'éponge — vos jantes restent nettes lavage après lavage."
      },
      {
        title: "Protégées contre le sel et la corrosion hivernale",
        description: "Sel de déneigement et fondants routiers attaquent l'aluminium nu et font cloquer les anciennes finitions. Notre traitement (sablage + primaire d'accrochage + poudre époxy) referme la surface de façon hermétique : pas d'oxydation blanche, pas de cloquage, même après plusieurs hivers."
      },
      {
        title: "Encaisse les graviers sans écailler",
        description: "Avec sa résistance aux chocs et son adhérence classe 0 au test de quadrillage, le thermolaquage absorbe les impacts de cailloux sans sauter en éclats comme un vernis. Le rebord de jante, zone la plus exposée, reste protégé."
      },
      {
        title: "Teinte et brillant qui ne passent pas",
        description: "Nos poudres certifiées de qualité architecturale conservent leur couleur et leur brillance des années, même en plein soleil. Pas de jaunissement, pas de farinage : un noir brillant reste profond, un satiné reste satiné."
      },
      {
        title: "Toutes finitions : RAL, NCS et effets premium",
        description: "Au-delà des teintes RAL & NCS classiques (noir brillant, gris anthracite, blanc, gris graphite), nous réalisons des effets métalliques, des finitions bicolores face usinée / flanc peint, et nos Effets Anodisés pour un rendu haut de gamme. Nuancier sur demande."
      }
    ],
    pricingTiers: [
      {
        label: "Jantes 15 à 17\" — teinte unie RAL/NCS",
        priceFrom: "à partir de 80 €/jante",
        includes: "Sablage à nu, primaire d'accrochage époxy, poudre époxy teinte unie (noir, anthracite, blanc, gris…), cuisson four et contrôle. Soit dès 320 € le jeu de 4."
      },
      {
        label: "Jantes 18 à 20\" — teinte unie RAL/NCS",
        priceFrom: "à partir de 95 €/jante",
        includes: "Même process complet, adapté aux grands diamètres et aux jantes larges. Sablage, primaire, poudrage et cuisson four inclus. Devis précis selon état initial."
      },
      {
        label: "Finition métallisée ou satinée premium",
        priceFrom: "à partir de 110 €/jante",
        includes: "Effets métalliques, gris graphite à paillettes, satinés profonds. Poudres certifiées de qualité architecturale. Diamètre et complexité de teinte chiffrés au devis."
      },
      {
        label: "Bicolore face usinée / flanc peint",
        priceFrom: "sur devis personnalisé",
        includes: "Masquage de la face diamantée, peinture du flanc et du creux, double passage. Rendu type monte d'origine sportive. Tarif établi après inspection des jantes."
      }
    ],
    trustSignals: [
      "Atelier 1 800 m² à Bruyères-sur-Oise (95820) — process maîtrisé de A à Z, rien n'est sous-traité",
      "Sablage, primaire d'accrochage et cuisson four réalisés sur place sous un même toit",
      "Préparation et application selon le référentiel Qualicoat et la norme ISO 12944",
      "Poudres certifiées de qualité architecturale — tenue UV et anti-corrosion durables",
      "Contrôle d'épaisseur et d'adhérence sur chaque jante avant restitution",
      "Particuliers et professionnels (préparateurs, centres auto) — enlèvement & livraison IDF + Oise"
    ],
    popularColors: [
      "RAL 9005",
      "RAL 7016",
      "RAL 9006",
      "RAL 7024",
      "RAL 9010",
      "RAL 7021"
    ],
    priceFrom: "80 €/jante",
    turnaround: "5 à 7 jours ouvrés",
    faqs: [
      {
        question: "Combien coûte le thermolaquage de 4 jantes ?",
        answer: "Cela dépend du diamètre, de l'état initial et de la finition. Pour un jeu de 4 jantes de 15 à 17 pouces en bon état, en teinte unie, comptez à partir de 320 € TTC (80 €/jante), sablage, primaire d'accrochage et cuisson four compris. Au-delà de 18 pouces, comptez dès 95 €/jante ; les finitions métallisées démarrent à 110 €/jante. Vous recevez un devis ferme et gratuit sous 24 h après envoi de quelques photos."
      },
      {
        question: "Le thermolaquage de jantes, ça tient combien de temps ?",
        answer: "Bien plus longtemps qu'une peinture aérosol ou qu'un vernis. Grâce au sablage à nu, au primaire d'accrochage et à la cuisson au four, le revêtement fait corps avec l'aluminium : il résiste aux UV, au sel, à la poussière de frein et aux graviers pendant des années, sans farinage ni écaillage. C'est aujourd'hui la solution la plus durable pour rénover des jantes alu."
      },
      {
        question: "Faut-il démonter les pneus avant de vous envoyer les jantes ?",
        answer: "Oui. Les jantes doivent nous parvenir nues : sans pneu, sans capteur de pression (TPMS) et sans plombs d'équilibrage. Votre garagiste ou centre auto réalise le démontage avant et le remontage + équilibrage après notre intervention. Si vous le souhaitez, nous pouvons vous orienter vers un monteur partenaire proche de l'atelier."
      },
      {
        question: "Quel délai pour récupérer mes jantes ?",
        answer: "Comptez 5 à 7 jours ouvrés pour un jeu de 4 jantes (sablage + primaire + poudrage + cuisson four + contrôle). En forte affluence (sortie d'hiver, printemps), le délai peut s'allonger légèrement. Nous vous confirmons une date de retrait précise dès la dépose — et un service express est possible selon notre planning."
      },
      {
        question: "Peut-on thermolaquer des jantes en aluminium forgé ou des jantes de marque ?",
        answer: "Absolument. Les jantes forgées comme les jantes coulées supportent parfaitement la cuisson au four. Nous adaptons la pression de sablage pour préserver la dureté, la face diamantée et les tolérances de montage des jantes haut de gamme. La finition et la durabilité sont identiques, quel que soit le type de jante."
      },
      {
        question: "Mes jantes sont piquées / corrodées / déjà repeintes — c'est rattrapable ?",
        answer: "Dans la grande majorité des cas, oui. Le sablage retire toute ancienne peinture, vernis et oxydation jusqu'au métal sain, ce qui efface les micro-piqûres et les départs de corrosion. Une jante voilée ou fissurée relève en revanche d'une réparation structurelle préalable, hors de notre champ — nous vous le signalons honnêtement à l'inspection plutôt que de masquer le défaut sous la poudre."
      },
      {
        question: "Quelle couleur ou finition choisir pour mes jantes ?",
        answer: "Les valeurs sûres : noir brillant (RAL 9005) pour un look intemporel, gris anthracite (RAL 7016) ou gris graphite (RAL 7024) pour un rendu sportif discret, blanc (RAL 9010) ou gris argent (RAL 9006) pour éclaircir. Nous travaillons toutes les teintes RAL & NCS, ainsi que des effets métallisés, satinés et bicolores. Demandez le nuancier : on vous conseille selon la couleur de votre voiture."
      }
    ],
    internalLinks: [
      {
        anchor: "Demander un devis jantes gratuit",
        href: "/devis"
      },
      {
        anchor: "Le thermolaquage en détail",
        href: "/services/thermolaquage"
      },
      {
        anchor: "Sablage & préparation des surfaces",
        href: "/services/sablage"
      },
      {
        anchor: "Nuancier RAL & NCS",
        href: "/couleurs-ral"
      },
      {
        anchor: "Effets & finitions premium",
        href: "/services/finitions"
      },
      {
        anchor: "Thermolaquage moto (cadres & jantes)",
        href: "/specialites/moto"
      },
      {
        anchor: "Pièces auto (étriers, caches moteur)",
        href: "/specialites/voiture"
      },
      {
        anchor: "Espace professionnels & préparateurs",
        href: "/professionnels"
      }
    ],
    ctaText: "Recevez votre devis jantes gratuit sous 24 h"
  },
  {
    slug: "moto",
    title: "Moto Art",
    tagline: "Custom et protection pour passionnés de deux-roues",
    description:
      "Cadres, jantes, bras oscillant, couvre-culasses, platines repose-pieds… Chaque pièce de votre moto peut être thermolaquée dans la couleur et la finition de votre choix. Nos poudres haute température résistent à la chaleur dégagée à proximité du moteur et de l'échappement, tout en offrant une palette de couleurs vibrantes.",
    icon: "Bike",
    benefits: [
      {
        title: "Design custom sur mesure",
        description:
          "Créez la moto de vos rêves en choisissant parmi plus de 200 teintes RAL, nos collections premium ou des combinaisons bicolores. Nous conseillons chaque client pour un rendu harmonieux et personnel.",
      },
      {
        title: "Résistance à la chaleur moteur",
        description:
          "Nos poudres époxy supportent des températures continues élevées avec pics thermiques résistants, ce qui les rend adaptées aux pièces proches du moteur et de la ligne d'échappement (hors collecteur direct).",
      },
      {
        title: "Couleurs vibrantes et durables",
        description:
          "Contrairement à la peinture aérosol, le thermolaquage offre des teintes profondes et éclatantes qui ne s'estompent pas sous l'effet des UV, des intempéries ou des lavages haute pression.",
      },
      {
        title: "Protection intégrale du châssis",
        description:
          "Le revêtement époxy protège le cadre et le bras oscillant contre la corrosion, les projections de graviers, les fluides mécaniques et l'usure quotidienne, prolongeant significativement la durée de vie de la moto.",
      },
    ],
    popularColors: ["RAL 9005", "RAL 3020", "RAL 5010", "RAL 1003", "RAL 2004"],
    priceFrom: "150 € / pièce",
    turnaround: "7-10 jours",
    faqs: [
      {
        question: "Quelles pièces de moto peut-on thermolaquer ?",
        answer:
          "Toutes les pièces métalliques démontables : cadre, sous-cadre, bras oscillant, jantes, té de fourche, platines, couvre-culasses, carters (après nettoyage). Les pièces en plastique (carénages, garde-boue) ne sont pas compatibles avec le procédé.",
      },
      {
        question: "Le thermolaquage résiste-t-il à la chaleur d'un moteur ?",
        answer:
          "Oui, pour les pièces situées à proximité du moteur (cadre, carters latéraux). Nos poudres résistent en continu à haute température. Pour les collecteurs et pots d'échappement exposés à des températures extrêmes, nous recommandons un traitement céramique spécifique.",
      },
      {
        question: "Quel délai pour un cadre complet de moto ?",
        answer:
          "Comptez 7 à 10 jours ouvrés pour un cadre complet (sablage + primaire éventuel + thermolaquage + contrôle). En période de forte activité (printemps), le délai peut atteindre 12 jours. Nous vous communiquons une date de retrait précise à la réception de la pièce.",
      },
    ],
  },
  {
    slug: "voiture",
    title: "Pièces Auto",
    tagline: "Étriers, caches moteur, arceaux et éléments de carrosserie",
    description:
      "Thermolaquage de pièces automobiles : étriers de frein, caches moteur, arceaux de sécurité, supports moteur, barres anti-rapprochement, élargisseurs d'ailes métalliques et tout composant en acier ou aluminium. Le revêtement époxy résiste à la chaleur du compartiment moteur, aux projections d'huile et aux vibrations mécaniques.",
    icon: "Car",
    benefits: [
      {
        title: "Résistance à la chaleur du compartiment moteur",
        description:
          "Les caches moteur, étriers et pièces sous capot sont exposés à des températures élevées. Nos poudres supportent à haute température en continu, bien au-delà des conditions thermiques habituelles du compartiment moteur.",
      },
      {
        title: "Esthétique et personnalisation",
        description:
          "Étriers de frein rouge vif, arceau assorti à la carrosserie, cache moteur noir satiné… Le thermolaquage apporte une touche esthétique soignée qui valorise votre véhicule.",
      },
      {
        title: "Protection anti-corrosion renforcée",
        description:
          "Le sablage préalable suivi de l'application de poudre époxy crée une barrière hermétique contre l'humidité, le sel, les fluides mécaniques et les projections abrasives du soubassement.",
      },
    ],
    popularColors: ["RAL 3020", "RAL 9005", "RAL 1003", "RAL 5010", "RAL 7016"],
    priceFrom: "50 € / pièce",
    turnaround: "5-7 jours",
    faqs: [
      {
        question: "Peut-on thermolaquer des étriers de frein ?",
        answer:
          "Oui, c'est l'une de nos prestations les plus demandées. Les étriers sont sablés, puis thermolaqués avec une poudre haute température résistant à à haute température en continu. Le tarif démarre à 50 € par étrier pour un traitement complet (sablage + thermolaquage).",
      },
      {
        question: "Le thermolaquage résiste-t-il aux vibrations mécaniques ?",
        answer:
          "Parfaitement. Grâce à sa flexibilité et à son adhérence exceptionnelle (classe 0 au test de quadrillage), le revêtement époxy absorbe les vibrations sans fissurer ni s'écailler, contrairement à une peinture liquide classique qui se craquelle sous l'effet des contraintes mécaniques.",
      },
      {
        question: "Traitez-vous les pièces en série pour les préparateurs auto ?",
        answer:
          "Oui, nous travaillons régulièrement avec des préparateurs et des garages spécialisés. Nous proposons des tarifs dégressifs à partir de 10 pièces et pouvons assurer des livraisons régulières. Contactez-nous pour établir un partenariat.",
      },
    ],
  },
  {
    slug: "pieces",
    title: "Pièces Métalliques",
    tagline: "Industriel, architectural et mobilier — toutes dimensions",
    description:
      "Notre cabine de sablage et notre four de 7 mètres de longueur nous permettent de traiter des pièces métalliques de grande dimension : portails, garde-corps, escaliers, charpentes, mobilier urbain, structures industrielles. Du prototype unitaire à la série de plusieurs centaines de pièces, nous adaptons notre organisation pour respecter vos délais et vos exigences qualité.",
    icon: "Factory",
    benefits: [
      {
        title: "Capacité grande dimension — cabine 7 × 3 × 4 m",
        description:
          "Notre cabine de sablage et notre four de polymérisation de 7 mètres accueillent des pièces de grande envergure : portails coulissants, garde-corps de balcon, structures métalliques assemblées.",
      },
      {
        title: "Protection anti-corrosion longue durée",
        description:
          "Pour les environnements agressifs (milieu marin, industriel, enterré), nous mettons en œuvre une préparation rigoureuse (sablage SA 2.5/SA 3), un primaire d'accrochage adapté et un thermolaquage époxy, dans le respect de la norme ISO 12944 catégorie C5-M.",
      },
      {
        title: "Production en série et répétabilité",
        description:
          "Nous garantissons une constance de teinte et d'épaisseur d'un lot à l'autre grâce à nos procédures de contrôle qualité : mesure d'épaisseur systématique, test d'adhérence et archivage des paramètres de cuisson.",
      },
    ],
    popularColors: ["RAL 7016", "RAL 9005", "RAL 9010", "RAL 7035", "RAL 6005"],
    priceFrom: "Sur devis",
    turnaround: "5-15 jours selon volume",
    faqs: [
      {
        question: "Quelle est la taille maximale des pièces que vous pouvez traiter ?",
        answer:
          "Notre four et notre cabine de sablage mesurent 7 mètres de longueur. Pour les pièces dépassant cette dimension, nous étudions au cas par cas la possibilité d'un traitement en plusieurs passes ou d'une intervention sur site par finitions spéciales.",
      },
      {
        question: "Travaillez-vous avec les professionnels du bâtiment ?",
        answer:
          "Oui, une part importante de notre activité concerne les serruriers, métalliers, architectes, paysagistes et entreprises de construction métallique. Nous proposons un compte professionnel avec tarifs préférentiels, facturation à 30 jours et enlèvement possible.",
      },
      {
        question: "Pouvez-vous traiter des séries de plusieurs centaines de pièces ?",
        answer:
          "Absolument. Notre organisation est dimensionnée pour absorber des séries allant de l'unité à plusieurs centaines de pièces. Pour les volumes importants, nous planifions la production en amont afin de garantir le respect des délais convenus. Un devis détaillé avec planning est établi pour chaque commande série.",
      },
    ],
  },

  {
    slug: "portail",
    title: "Portail & Ferronnerie",
    tagline: "Thermolaquage de portails, grilles et garde-corps fer & alu — protection extérieure longue durée",
    metaTitle: "Thermolaquage Portail & Ferronnerie — 95 / IDF | AZ Époxy",
    metaDescription: "Thermolaquage et rénovation de portail fer ou alu, grilles, garde-corps. Anticorrosion durable, teintes RAL & NCS, grandes pièces. Enlèvement/livraison. Devis gratuit.",
    description: "Votre portail, vos grilles et vos garde-corps méritent une finition qui tient des années face aux intempéries. Thermolaquage poudre époxy sur fer et aluminium, anticorrosion durable, teinte parfaitement uniforme. Particuliers et métalliers : demandez votre devis.",
    heroIntro: "Votre portail, vos grilles et vos garde-corps méritent une finition qui tient des années face aux intempéries. Thermolaquage poudre époxy sur fer et aluminium, anticorrosion durable, teinte parfaitement uniforme. Particuliers et métalliers : demandez votre devis.",
    icon: "Fence",
    benefits: [
      {
        title: "Grandes pièces — cabine 7 × 3 × 4 m",
        description: "Portail coulissant, portail battant double vantail, grille de clôture, garde-corps de terrasse, escalier extérieur : notre cabine de thermolaquage 7 × 3 × 4 m et notre four grande capacité traitent vos pièces de grande dimension d'une seule pièce, sans découpe ni raccord visible."
      },
      {
        title: "Anticorrosion durable en extérieur",
        description: "Un portail vit dehors toute l'année : pluie, gel, UV, pollution. Sablage soigné, primaire d'accrochage époxy sans zinc ni plomb puis poudre époxy forment une barrière hermétique contre la corrosion, dans le respect du référentiel Qualicoat et de la norme ISO 12944 selon l'exposition de votre site."
      },
      {
        title: "Teintes RAL & NCS au choix",
        description: "Choisissez parmi l'ensemble du nuancier RAL & NCS, en finition mat, satiné ou brillant, ainsi que nos Effets Corten, Métalliques, Irisés et Anodisés pour un portail vraiment singulier. Couleur profonde et homogène sur toute la pièce, sans coulure ni reprise."
      },
      {
        title: "Rénovation comme neuf",
        description: "Portail ancien écaillé, rouillé ou défraîchi ? Le décapage par sablage retire l'ancienne peinture et la rouille jusqu'au métal nu, puis le thermolaquage redonne à l'ouvrage une finition impeccable et une protection neuve, pour une fraction du prix d'un remplacement."
      },
      {
        title: "Fer, acier et aluminium",
        description: "Fer forgé, acier, tôle, profilés aluminium : nous adaptons la préparation et la poudre à chaque support pour une adhérence optimale (résultat classe 0 au test de quadrillage) et une tenue durable, que votre ferronnerie soit neuve ou à rénover."
      },
      {
        title: "Enlèvement & livraison",
        description: "Un portail, c'est lourd et encombrant. Nous organisons l'enlèvement et la livraison de vos ouvrages en Île-de-France et dans l'Oise — un vrai confort pour les particuliers comme pour les métalliers et serruriers qui nous confient leurs séries."
      }
    ],
    pricingTiers: [
      {
        label: "Garde-corps / grille",
        priceFrom: "à partir de 150 €",
        includes: "Sablage + thermolaquage d'un garde-corps, d'une grille de défense ou d'un petit ouvrage de ferronnerie, teinte RAL ou NCS au choix."
      },
      {
        label: "Portail battant",
        priceFrom: "à partir de 350 €",
        includes: "Décapage par sablage, primaire d'accrochage si nécessaire et thermolaquage d'un portail battant, finition mat / satiné / brillant."
      },
      {
        label: "Portail coulissant grand format",
        priceFrom: "sur devis",
        includes: "Traitement complet d'un portail coulissant ou double vantail de grande dimension en cabine 7 × 3 × 4 m, anticorrosion renforcée."
      },
      {
        label: "Pros — métalliers / serruriers",
        priceFrom: "tarifs dégressifs",
        includes: "Compte professionnel, tarifs préférentiels, enlèvement/livraison et constance de teinte d'un lot à l'autre pour vos séries d'ouvrages."
      }
    ],
    trustSignals: [
      "Atelier de 1 800 m² à Bruyères-sur-Oise (95820), desservant l'Île-de-France et l'Oise",
      "Cabine de thermolaquage 7 × 3 × 4 m et four grande capacité pour les portails de grande dimension",
      "Préparation et finitions conformes au référentiel Qualicoat et à la norme ISO 12944 selon l'exposition",
      "Primaire d'accrochage époxy sans zinc ni plomb et poudres certifiées de qualité architecturale",
      "Contrôle d'épaisseur et test d'adhérence (classe 0 au quadrillage) sur chaque ouvrage",
      "Enlèvement et livraison possibles — interlocuteur dédié pour métalliers et serruriers"
    ],
    popularColors: [
      "RAL 7016",
      "RAL 9005",
      "RAL 9016",
      "RAL 6005",
      "RAL 7039",
      "RAL 8019"
    ],
    priceFrom: "150 €",
    turnaround: "5-10 jours ouvrés selon dimension et état",
    faqs: [
      {
        question: "Pouvez-vous thermolaquer un grand portail coulissant ?",
        answer: "Oui. Notre cabine de thermolaquage mesure 7 × 3 × 4 m et notre four est de grande capacité : nous traitons les portails coulissants, les doubles vantaux et les grandes grilles de clôture d'un seul tenant, sans découpe ni raccord. Pour un ouvrage hors gabarit, nous étudions un traitement en plusieurs passes — parlons-en lors du devis."
      },
      {
        question: "Mon vieux portail en fer est rouillé et écaillé, peut-on le rénover ?",
        answer: "Tout à fait, c'est l'un de nos cas les plus fréquents. Le portail est d'abord sablé pour retirer l'ancienne peinture et la rouille jusqu'au métal nu, puis thermolaqué dans la teinte de votre choix. Vous retrouvez un ouvrage à l'aspect neuf et durablement protégé, pour bien moins cher qu'un remplacement."
      },
      {
        question: "Le thermolaquage tient-il vraiment en extérieur dans le temps ?",
        answer: "Oui. C'est précisément la vocation du procédé pour la ferronnerie d'extérieur : sablage, primaire d'accrochage époxy sans zinc ni plomb selon l'exposition, puis poudre époxy de qualité architecturale forment une barrière contre la corrosion et les UV. Nous travaillons selon le référentiel Qualicoat et la norme ISO 12944, en adaptant le système à l'exposition de votre site (ville, campagne, bord de mer)."
      },
      {
        question: "Quelles couleurs sont possibles pour un portail ou un garde-corps ?",
        answer: "L'intégralité du nuancier RAL & NCS, en finition mat, satiné ou brillant. Les gris anthracite (RAL 7016), noir (RAL 9005) et blancs sont les plus demandés, mais nous réalisons aussi des Effets Corten, Métalliques, Irisés et Anodisés. Demandez-nous un nuancier pour visualiser le rendu sur votre ouvrage."
      },
      {
        question: "Faut-il déposer le portail avant de vous l'apporter ?",
        answer: "Oui, l'ouvrage doit nous parvenir démonté et débarrassé de ses accessoires non métalliques (serrure, motorisation, joints, éléments plastiques). Pour les particuliers, votre poseur ou serrurier peut s'en charger ; pour les ferronnerie d'extérieur neuves, les métalliers nous livrent les pièces directement. Nous organisons l'enlèvement et la livraison en IDF et dans l'Oise."
      },
      {
        question: "Travaillez-vous avec les métalliers et serruriers en sous-traitance ?",
        answer: "Oui, c'est une part importante de notre activité. Nous offrons aux métalliers, serruriers et chaudronniers un compte professionnel avec tarifs préférentiels, enlèvement/livraison, constance de teinte et d'épaisseur d'un lot à l'autre, et un planning de production fiable pour vos séries de portails, garde-corps et grilles. Contactez-nous pour ouvrir un compte."
      }
    ],
    internalLinks: [
      {
        anchor: "Thermolaquage",
        href: "/thermolaquage"
      },
      {
        anchor: "Sablage & aérogommage",
        href: "/sablage"
      },
      {
        anchor: "Pièces métalliques grande dimension",
        href: "/specialites/pieces"
      },
      {
        anchor: "Nuancier RAL & NCS et effets",
        href: "/finitions"
      },
      {
        anchor: "Demander un devis",
        href: "/devis"
      }
    ],
    ctaText: "Recevoir mon devis portail gratuit"
  },
  {
    slug: "sablage-aerogommage",
    title: "Sablage & Aérogommage",
    tagline: "Décapage abrasif puissant ou aérogommage doux — le bon procédé pour chaque support",
    metaTitle: "Sablage & Aérogommage à Bruyères-sur-Oise (95) | AZ Époxy",
    metaDescription: "Sablage jante, décapage métal, aérogommage façade, volets et bois. Atelier en Île-de-France & Oise. Préparation avant peinture ou thermolaquage. Devis gratuit.",
    description: "Rouille, calamine, vieilles peintures, micro-corrosion : nous ramenons chaque support à nu, proprement. Sablage haute pression pour l'acier et la fonte, aérogommage doux pour le bois, la pierre, l'alu et les pièces fragiles. La préparation parfaite avant peinture ou thermolaquage.",
    heroIntro: "Rouille, calamine, vieilles peintures, micro-corrosion : nous ramenons chaque support à nu, proprement. Sablage haute pression pour l'acier et la fonte, aérogommage doux pour le bois, la pierre, l'alu et les pièces fragiles. La préparation parfaite avant peinture ou thermolaquage.",
    icon: "SprayCan",
    benefits: [
      {
        title: "Sablage : décapage puissant rouille & calamine",
        description: "La projection d'abrasif minéral à haute pression élimine l'oxydation profonde, la calamine de laminage, les résidus de soudure et les anciens revêtements sur l'acier, la fonte et les structures épaisses. On retrouve un métal sain, prêt à recevoir sa protection."
      },
      {
        title: "Aérogommage : doux pour les supports fragiles",
        description: "L'aérogommage projette un abrasif fin à basse pression avec un voile d'eau : il décape sans agresser. Idéal pour le bois (volets, poutres, meubles), la pierre, la brique, l'alu mince, la fonte ornementale et toute pièce délicate qu'un sablage classique abîmerait."
      },
      {
        title: "Sablage jante : la base d'une finition parfaite",
        description: "Avant thermolaquage, vos jantes alliage sont sablées pour retirer l'ancienne peinture, la poussière de frein incrustée et l'oxydation. On crée le profil d'accroche qui garantit une adhérence classe 0 et une tenue durable du nouveau revêtement."
      },
      {
        title: "Préparation avant peinture ou thermolaquage",
        description: "Le décapage crée un profil de rugosité contrôlé (25 à 75 µm) indispensable à l'accroche mécanique de la peinture ou de la poudre époxy. Un métal mal préparé, c'est un revêtement qui cloque ou s'écaille : la préparation conditionne toute la durabilité."
      },
      {
        title: "Pression et abrasif réglés pour chaque pièce",
        description: "Acier épais, alu mince, fonte ornementale ou bois ancien n'appellent pas le même traitement. Nous ajustons média, granulométrie et pression à chaque support pour ne retirer que l'indésirable, sans déformer ni creuser la matière."
      },
      {
        title: "Grande capacité — cabine 7 × 3 × 4 m",
        description: "Notre cabine 7 × 3 × 4 m accueille portails, garde-corps, charpentes, châssis et structures métalliques de grande dimension. De la jante unitaire à la série de chaudronnerie, nous adaptons l'organisation à votre volume et à vos délais."
      }
    ],
    pricingTiers: [
      {
        label: "Aérogommage volet / pièce bois",
        priceFrom: "à partir de 40 € / pièce",
        includes: "Décapage doux d'un volet, d'un meuble ou d'une pièce bois/fonte ornementale, abrasif fin, dépoussiérage. Surface prête à peindre ou à lasurer."
      },
      {
        label: "Sablage jante alliage",
        priceFrom: "à partir de 30 € / jante",
        includes: "Sablage d'une jante avant thermolaquage : retrait peinture, poussière de frein et oxydation, profil d'accroche. Tarif décapage seul, hors mise en peinture."
      },
      {
        label: "Sablage pièce métallique",
        priceFrom: "à partir de 50 € / pièce",
        includes: "Décapage haute pression d'une pièce acier ou fonte (portillon, garde-corps, mobilier), retrait rouille et calamine, propreté SA 2.5."
      },
      {
        label: "Structures & séries pro",
        priceFrom: "sur devis",
        includes: "Portails, charpentes, chaudronnerie et séries en cabine 7 × 3 × 4 m. Préparation ISO 12944, planning et tarifs dégressifs pour les professionnels."
      }
    ],
    trustSignals: [
      "Préparation selon le référentiel Qualicoat et la norme ISO 12944",
      "Propreté de surface contrôlée SA 2.5 / SA 3 (ISO 8501-1)",
      "Atelier de 1 800 m² à Bruyères-sur-Oise (95820)",
      "Cabine 7 × 3 × 4 m pour pièces de grande dimension",
      "Particuliers et professionnels — métalliers, serruriers, carrossiers, agencement",
      "Enlèvement et livraison possibles en Île-de-France et dans l'Oise"
    ],
    popularColors: [
      "RAL 9005",
      "RAL 7016",
      "RAL 9010",
      "RAL 7035",
      "RAL 9006"
    ],
    priceFrom: "40 € / pièce",
    turnaround: "3-7 jours selon support et volume",
    faqs: [
      {
        question: "Quelle différence entre sablage et aérogommage ?",
        answer: "Le sablage projette un abrasif à haute pression : c'est un décapage puissant, idéal pour l'acier, la fonte épaisse, la calamine et la rouille incrustée. L'aérogommage projette un abrasif fin à basse pression, souvent avec un voile d'eau : c'est un décapage doux, réservé aux supports fragiles comme le bois, la pierre, la brique, l'alu mince ou la fonte ornementale, qu'un sablage classique risquerait d'abîmer. Nous choisissons le procédé selon votre support et le rendu visé."
      },
      {
        question: "Peut-on sabler des jantes alliage ?",
        answer: "Oui, c'est une étape clé avant le thermolaquage. La jante est sablée avec un abrasif fin à pression maîtrisée pour retirer l'ancienne peinture, la poussière de frein et l'oxydation, sans altérer l'alliage. Cela crée le profil d'accroche qui garantit une adhérence classe 0 et une tenue durable du nouveau revêtement. Les jantes doivent nous parvenir nues, sans pneu ni capteur."
      },
      {
        question: "L'aérogommage convient-il pour des volets ou une façade en bois ?",
        answer: "Oui, c'est précisément l'usage où l'aérogommage excelle. Le procédé décape la peinture, la lasure ou le vernis sans creuser la fibre du bois ni marquer les arêtes, contrairement à un ponçage agressif ou un sablage classique. Volets, poutres, portes, meubles, pierre de façade ou brique retrouvent un support sain, prêt à recevoir une nouvelle finition."
      },
      {
        question: "Le sablage abîme-t-il le métal ?",
        answer: "Non, à condition d'adapter la pression et la granulométrie à l'épaisseur du support. Nous réglons nos paramètres pour chaque pièce afin de ne retirer que les couches indésirables — rouille, calamine, peinture — sans altérer la géométrie ni l'intégrité du métal. Pour l'alu mince ou les pièces sensibles, nous basculons sur un média fin à basse pression, voire sur l'aérogommage."
      },
      {
        question: "Pourquoi décaper avant de peindre ou de thermolaquer ?",
        answer: "Parce que la tenue d'un revêtement dépend entièrement de l'état du support. Le décapage élimine rouille, calamine, graisses et anciennes peintures, puis crée un profil de rugosité (25 à 75 µm) qui ancre mécaniquement la nouvelle couche. Sur un métal mal préparé, même la meilleure poudre cloque ou s'écaille. C'est l'étape qui conditionne la durabilité de toute la finition."
      },
      {
        question: "Quel délai pour un décapage ?",
        answer: "Comptez en général 3 à 7 jours ouvrés selon le support, le procédé et le volume. Une jante ou un volet partent vite ; un portail, une charpente ou une série de chaudronnerie demandent davantage d'organisation. En enchaînement direct avec un thermolaquage, le délai global est planifié dès la réception. Nous vous communiquons une date de retrait précise."
      },
      {
        question: "Intervenez-vous pour les professionnels et en série ?",
        answer: "Oui, une large part de notre activité concerne les métalliers, serruriers, chaudronniers, carrossiers et l'agencement. Notre cabine 7 × 3 × 4 m et notre organisation absorbent aussi bien la pièce unitaire que la série de plusieurs centaines de pièces. Compte professionnel, tarifs dégressifs, enlèvement et livraison en Île-de-France et dans l'Oise : contactez-nous pour un devis cadre."
      }
    ],
    internalLinks: [
      {
        anchor: "Thermolaquage poudre époxy",
        href: "/services/thermolaquage"
      },
      {
        anchor: "Finitions & effets spéciaux",
        href: "/services/finitions"
      },
      {
        anchor: "Rénovation de jantes auto",
        href: "/specialites/jantes"
      },
      {
        anchor: "Pièces métalliques & structures",
        href: "/specialites/pieces"
      },
      {
        anchor: "Demander un devis gratuit",
        href: "/devis"
      }
    ],
    ctaText: "Décrivez votre pièce, recevez votre devis sablage ou aérogommage"
  },
];

export function getSpecialtyBySlug(slug: string): Specialty | undefined {
  return SPECIALTIES.find((s) => s.slug === slug);
}

export const SPECIALTIES = SPECIALTIES_FALLBACK;

export async function getSpecialties(): Promise<Specialty[]> {
  return SPECIALTIES_FALLBACK;
}

export async function getSpecialtyBySlugAsync(
  slug: string
): Promise<Specialty | undefined> {
  return SPECIALTIES_FALLBACK.find((s) => s.slug === slug);
}
