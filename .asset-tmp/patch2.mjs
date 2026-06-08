import fs from 'node:fs';
const dir = '.asset-tmp/seo/';
const load = (f) => JSON.parse(fs.readFileSync(dir + f, 'utf8'));
const jantes = load('page_jantes_refonte.json');
const portail = load('page_portail_ferronnerie.json');
const sablage = load('page_sablage_aerogommage.json');
const dec = (s) => typeof s === 'string' ? s.replace(/&amp;/g, '&') : s;
const deep = (o) => JSON.parse(JSON.stringify(o, (k, v) => dec(v)));
const shortPrice = (t, fb) => (t && t[0]) ? dec(t[0].priceFrom).replace(/^à partir de\s*/i, '').trim() : fb;
const shortDelay = (t) => dec(t).split(/ — | pour /)[0].trim();
function build(j, icon) {
  return deep({ slug: j.slug, title: j.title, tagline: j.tagline, metaTitle: j.metaTitle, metaDescription: j.metaDescription,
    description: j.heroIntro, heroIntro: j.heroIntro, icon, benefits: j.benefits, pricingTiers: j.pricingTiers,
    trustSignals: j.trustSignals, popularColors: j.popularColors, priceFrom: shortPrice(j.pricingTiers, j.priceFrom||''),
    turnaround: shortDelay(j.turnaround), faqs: j.faqs, internalLinks: j.internalLinks, ctaText: j.ctaText });
}
const E = { jantes: build(jantes,'CircleDot'), portail: build(portail,'Fence'), sab: build(sablage,'SprayCan') };
function toTs(obj, indent='  ') {
  let s = JSON.stringify(obj, null, 2).replace(/^(\s*)"([a-zA-Z_]\w*)":/gm, '$1$2:');
  return s.split('\n').map((l) => indent + l).join('\n');
}
let src = fs.readFileSync('src/lib/specialites-data.ts', 'utf8');

// 1) Interface : insérer les champs optionnels avant la dernière '}' de l'interface
src = src.replace(
  /(faqs: \{ question: string; answer: string \}\[\];\n)(\})/,
  `$1  metaTitle?: string;\n  metaDescription?: string;\n  heroIntro?: string;\n  pricingTiers?: { label: string; priceFrom: string; includes: string }[];\n  trustSignals?: string[];\n  internalLinks?: { anchor: string; href: string }[];\n  ctaText?: string;\n$2`
);

// 2) Remplacer l'objet jantes (bracket-match)
function replaceObjBySlug(s, slug, ts) {
  const a = s.indexOf(`slug: "${slug}"`);
  const open = s.lastIndexOf('{', a);
  let d=0,end=-1; for(let i=open;i<s.length;i++){if(s[i]==='{')d++;else if(s[i]==='}'){d--;if(d===0){end=i+1;break;}}}
  return s.slice(0,open) + ts.trimStart() + s.slice(end);
}
src = replaceObjBySlug(src, 'jantes', toTs(E.jantes));

// 3) Insérer portail + sablage : ancrer sur '= [' (PAS sur Specialty[])
const decl = src.indexOf('SPECIALTIES_FALLBACK: Specialty[] = [');
const litStart = src.indexOf('= [', decl) + 2;   // index du '[' du tableau
let d=0,arrEnd=-1; for(let i=litStart;i<src.length;i++){if(src[i]==='[')d++;else if(src[i]===']'){d--;if(d===0){arrEnd=i;break;}}}
const ins = '\n' + toTs(E.portail).trimStart().replace(/^/,'  ') + ',\n  ' + toTs(E.sab).trimStart() + ',\n';
src = src.slice(0,arrEnd) + ins + src.slice(arrEnd);

fs.writeFileSync('src/lib/specialites-data.ts', src);
const slugs=[...src.matchAll(/slug: "([^"]+)"/g)].map(m=>m[1]);
console.log('✓ patché. Déclaration intacte:', src.includes('Specialty[] = ['));
console.log('  slugs:', slugs.join(', '));
