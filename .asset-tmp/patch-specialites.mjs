import fs from 'node:fs';

const dir = '.asset-tmp/seo/';
const load = (f) => JSON.parse(fs.readFileSync(dir + f, 'utf8'));
const jantes = load('page_jantes_refonte.json');
const portail = load('page_portail_ferronnerie.json');
const sablage = load('page_sablage_aerogommage.json');

const dec = (s) => typeof s === 'string' ? s.replace(/&amp;/g, '&') : s;
const deep = (o) => JSON.parse(JSON.stringify(o, (k, v) => dec(v)));

function shortPrice(tiers, fallback) {
  if (tiers && tiers[0]) return dec(tiers[0].priceFrom).replace(/^à partir de\s*/i, '').trim();
  return fallback;
}
function shortDelay(t) {
  return dec(t).split(/ — | pour /)[0].trim();
}

function build(j, icon) {
  return deep({
    slug: j.slug,
    title: j.title,
    tagline: j.tagline,
    metaTitle: j.metaTitle,
    metaDescription: j.metaDescription,
    description: j.heroIntro,           // l'intro riche sert de description
    heroIntro: j.heroIntro,
    icon,
    benefits: j.benefits,
    pricingTiers: j.pricingTiers,
    trustSignals: j.trustSignals,
    popularColors: j.popularColors,
    priceFrom: shortPrice(j.pricingTiers, j.priceFrom || ''),
    turnaround: shortDelay(j.turnaround),
    faqs: j.faqs,
    internalLinks: j.internalLinks,
    ctaText: j.ctaText,
  });
}

const entries = {
  jantes: build(jantes, 'CircleDot'),
  portail: build(portail, 'Fence'),
  'sablage-aerogommage': build(sablage, 'SprayCan'),
};

// JSON → TS object literal (clés simples dé-quotées), indenté à 2 espaces pour vivre dans le tableau
function toTs(obj) {
  let s = JSON.stringify(obj, null, 2);
  s = s.replace(/^(\s*)"([a-zA-Z_]\w*)":/gm, '$1$2:'); // unquote simple keys
  return s.split('\n').map((l) => '  ' + l).join('\n');
}

let src = fs.readFileSync('src/lib/specialites-data.ts', 'utf8');

// 1) Remplacer l'objet jantes (bracket-matching depuis le { avant slug:"jantes")
function replaceObjectBySlug(src, slug, tsBlock) {
  const anchor = src.indexOf(`slug: "${slug}"`);
  if (anchor < 0) throw new Error('slug introuvable: ' + slug);
  let open = src.lastIndexOf('{', anchor);
  let depth = 0, end = -1;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
  }
  return src.slice(0, open) + tsBlock.trimStart() + src.slice(end);
}
src = replaceObjectBySlug(src, 'jantes', toTs(entries.jantes));

// 2) Insérer portail + sablage avant la fermeture du tableau SPECIALTIES_FALLBACK
const arrStart = src.indexOf('SPECIALTIES_FALLBACK: Specialty[] = [');
let bdepth = 0, arrEnd = -1;
for (let i = src.indexOf('[', arrStart); i < src.length; i++) {
  if (src[i] === '[') bdepth++;
  else if (src[i] === ']') { bdepth--; if (bdepth === 0) { arrEnd = i; break; } }
}
const insertion = '\n' + toTs(entries.portail).trimStart().replace(/^/, '  ') + ',\n  ' + toTs(entries['sablage-aerogommage']).trimStart() + ',\n';
// arrEnd pointe sur ']' ; le dernier objet finit par '},' avant. On insère juste avant ']'.
src = src.slice(0, arrEnd) + insertion + src.slice(arrEnd);

// 3) SLUG_TO_CATEGORY (dans le fichier page) — fait séparément. Ici, sauvegarde data.
fs.writeFileSync('src/lib/specialites-data.ts', src);
console.log('✓ specialites-data.ts patché : jantes remplacé, portail + sablage-aerogommage ajoutés');
console.log('  slugs présents:', [...src.matchAll(/slug: "([^"]+)"/g)].map(m=>m[1]).join(', '));
