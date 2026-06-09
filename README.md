# AZ Époxy — azepoxy.fr

Site vitrine + machine SEO locale + backoffice pour **AZ Époxy**, atelier de
thermolaquage (peinture poudre époxy/polyester) et sablage en Île-de-France.

Trois blocs fonctionnels :

- **Vitrine** : services, couleurs RAL/NCS, réalisations, blog, devis multi-étapes.
- **SEO local** : ~80 pages villes + hubs départements + combos service×ville,
  sitemaps dédiés, QA automatique hebdomadaire, ping IndexNow.
- **Backoffice `/admin`** : leads (kanban), devis PDF, contenu (réalisations,
  avis, profil), analytics, santé SEO, journal d'activité.

## Stack

- **Next.js 15** (App Router, React 19, TypeScript) + Tailwind CSS
- **Neon Postgres** + **Drizzle ORM** (migrations versionnées dans `drizzle/migrations/`)
- **Auth admin custom** : JWT signé `jose` en cookie httpOnly, mot de passe bcrypt
  (single-admin via variables d'env, pas de table users)
- **Resend** (emails transactionnels), **Upstash** Redis (rate limit) + QStash
  (relance devis abandonné), **Cloudflare Turnstile** (anti-bot)
- **Vercel** (hébergement, crons, analytics), **Sentry** (erreurs, optionnel)

## Démarrage

```bash
cp .env.example .env.local   # puis remplir (au minimum DATABASE_URL + auth admin)
npm i
npm run dev                  # http://localhost:3000
```

Pour l'admin local : générer le hash du mot de passe avec `npm run admin:hash`,
le coller dans `ADMIN_PASSWORD_HASH`, définir `ADMIN_EMAIL` et un
`ADMIN_JWT_SECRET` d'au moins 32 caractères (`openssl rand -base64 48`).

## Commandes

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de dev |
| `npm run build` | Build production — **en local, lancer sous bash avec `NODE_OPTIONS=--max-old-space-size=10240 npm run build`, sinon OOM** (beaucoup de routes statiques) |
| `npm run db:generate` | Génère une migration SQL depuis `src/lib/db/schema.ts` |
| `npm run db:migrate` | Applique les migrations (`scripts/db-migrate.ts`) |
| `npm run db:studio` | Drizzle Studio (explorateur DB) |
| `npm run admin:hash` | Génère le hash bcrypt pour `ADMIN_PASSWORD_HASH` |
| `npm run check:metadata` | Audit des metadata SEO des pages |
| `npm run e2e` | Tests Playwright (`npm run e2e:install` la 1re fois) |
| `npm run lhci` | Audit Lighthouse CI |

## Déploiement

Déploiement **uniquement** via la CLI :

```bash
vercel --prod --yes
```

Les déploiements déclenchés par `git push` sont **volontairement désactivés**
via `"git": { "deploymentEnabled": false }` dans `vercel.json`. Objectif :
garder un contrôle manuel du moment de mise en prod (le build est lourd et
chaque déploiement invalide des caches SEO). Ne pas retirer ce garde-fou sans
décision explicite.

## Architecture

### Rewrites SEO (`next.config.mjs`)

Les URLs publiques `prefix-{param}` ne sont pas des routes App Router valides ;
elles sont réécrites vers des dossiers dynamiques internes :

- `/thermolaquage-jantes-{ville}` → `/combos/jantes/{ville}`
- `/thermolaquage-portail-{ville}` → `/combos/portail/{ville}`
- `/thermolaquage-{slug}` → `/villes/{slug}` (villes **et** hubs départements)

**L'ordre est important** : les combos service×ville doivent précéder le
rewrite ville générique, sinon `jantes-cergy` serait interprété comme un slug
de ville inexistant. Premier match gagne.

### Crons Vercel (`vercel.json`)

- `/api/cron/qa-villes` — lundi 3h UTC : visite toutes les pages clés (villes,
  hubs, services), vérifie title/H1/canonical/JSON-LD/word count, stocke le
  résultat en DB (table `seo_qa_runs`, dashboard `/admin/seo`), puis ping
  IndexNow avec les URLs OK.
- `/api/cron/indexnow` — tous les jours 6h UTC : soumet les URLs à IndexNow.

Les deux routes exigent le header `Authorization: Bearer <CRON_SECRET>`
(injecté automatiquement par Vercel Cron quand le secret est défini). Pas de
secret en query string.

## Doctrine éditoriale (résumé)

Règles de contenu non négociables — détail et justifications dans
[`docs/SEO-PLAN.md`](docs/SEO-PLAN.md) :

- **Pas de certification Qualicoat revendiquée** (l'atelier n'est pas certifié).
- **Pas de zinc / métallisation** dans l'offre.
- **Pas de températures ni durées de cuisson fixes** annoncées (dépend des
  poudres et des pièces).
- Dimensions cabine : **7 × 3 × 4 m** — seule valeur à citer.
- Teintes : **RAL et NCS** uniquement (pas de marques de poudre).
- Devis : politique de **devis cadre** (fourchettes, pas de prix fermes en ligne).

Toute nouvelle page ou modification de contenu doit respecter ces règles.
