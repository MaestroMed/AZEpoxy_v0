# Plan SEO & Lead-Gen — AZ Époxy

> Objectif unique : **un maximum de demandes de devis (leads)**.
> Mesure du succès = nombre de `form_submit` / appels / WhatsApp par mois, pas le rang.
>
> Contenu de référence généré (workflow `seo-leads-blitz`) : voir `docs/seo-content/*.json`.

## Le constat stratégique

Le socle technique est **au-dessus de 95 % des concurrents** : ~350 URLs au sitemap, schema, maillage géo IDF, site rapide, accessibilité 100/100. Mais pour un artisan local, **les leads ne viennent pas d'abord du nombre de pages** :

> **Leads = (Google Business Profile + Avis) → (Trafic qualifié) → (Taux de conversion)**

Le site a sur-investi le « trafic » (géo-pages) et sous-investi le **local pack (GBP)**, les **pages à forte intention commerciale**, et la **conversion**. Ce plan rééquilibre vers le lead.

---

## Les 8 leviers (par impact-leads)

### 🥇 1. Google Business Profile + moteur d'avis — `[PROPRIÉTAIRE]`
Le plus gros levier local (40-60 % des leads d'un artisan via le map pack).
- [ ] Revendiquer/optimiser la fiche GBP (Bruyères-sur-Oise) : catégories, zone, photos, horaires, services.
- [ ] Mettre en place une demande d'avis systématique après chaque chantier (SMS/email + lien GBP direct).
- [ ] Objectif : 20+ avis 5★ en 90 jours.

### 🥈 2. Pages « argent » à intention commerciale — `[FAIT en partie]`
- [x] **Refonte `/specialites/jantes`** : fourchettes prix par diamètre/finition, réassurance, FAQ anti-objection.
- [x] **Nouvelle `/specialites/portail`** (portail, grilles, garde-corps fer & alu).
- [x] **Nouvelle `/specialites/sablage-aerogommage`** (sablage vs aérogommage).
- [x] Template enrichi : sections `pricingTiers` + `trustSignals` + meta sur-mesure.
- [ ] Régénérer les vrais visuels hero portail + sablage (Higgsfield — fallback en place).

### 🥉 3. CRO — convertir le trafic existant — `[partiellement]`
Voir l'audit complet : `docs/seo-content/cro_audit.json` (14 findings + 9 trous de tracking).
- [x] Seuil sticky CTA mobile 280 → 120 px (accès devis plus tôt).
- [x] Lien WhatsApp avec message pré-rempli.
- [x] `RESEND_FROM` configurable (déjà fait dans leads.ts).
- [x] **Email capturé dès l'étape 2 du wizard** → la relance d'abandon fonctionne enfin (avant : étape 4, 90 % des abandons sans email).
- [x] **Beacon d'abandon sur `pagehide`** en plus de `visibilitychange` (mobile iOS).
- [x] **Tracking funnel** `form_start` / `form_step` / `form_error` émis dans le wizard.
- [x] **Champ « Comment nous avez-vous trouvé ? » retiré** (friction).
- [x] **CTA secondaires sur l'écran de succès** (Appeler + Voir réalisations).
- [x] **Barre de réassurance sur `/devis`** (atelier, particuliers & pros, 24 h, IDF+Oise).
- [ ] **HIGH — Fourchette de prix live dans le wizard** (réutiliser `pricing-data.ts`).
- [ ] **HIGH — Notification temps réel du lead** (SMS/WhatsApp au gérant via `LEAD_WEBHOOK_URL` — speed-to-lead < 5 min).
- [ ] MED — Brancher la vraie note Google sur la barre de réassurance (quand avis GBP en place).
- [ ] MED — Lien téléphone cliquable visible dès le hero/header desktop.
- [ ] MED — POST `/api/devis` : persister le lead AVANT d'envoyer les emails (découpler de la latence Resend).
- [ ] MED — Fusionner / rendre skippable l'étape Couleur (4 → 3 étapes).
- [ ] ⚠️ Vérifier que WhatsApp fonctionne sur le 09 (sinon ajouter `SITE.whatsapp` mobile ou retirer le bouton).

### 4. Combos géo × service — `[FAIT ✅]`
- [x] **30 pages live** : `/thermolaquage-jantes-{ville}` + `/thermolaquage-portail-{ville}` sur 15 communes (Cergy, Pontoise, Argenteuil, Poissy, Sarcelles…).
- [x] Route `/combos/[service]/[ville]` + rewrites next.config (avant le générique) + contenu unique par combo (angle local réel + bénéfices/prix + cross-links) + sitemap (priority 0.8).

### 5. Cluster blog (autorité thématique) — `[CONTENU PRÊT]`
6 briefs prêts : `docs/seo-content/blog_cluster.json` (prix jantes, sablage vs aérogommage, couleur RAL jantes, prix portail, anticorrosion, durée de vie). Chacun lie vers les money pages.
- [ ] Rédiger les 6 articles (HTML, ~1200-1800 mots) + injecter dans `blog-data.ts`.

### 6. Indexation & couverture — `[FAIT en partie]`
- [x] Sitemap étendu : 121 → **350 URLs** (+213 teintes RAL, +16 réalisations, +2 money pages priority 0.9).
- [ ] **PROPRIÉTAIRE — Soumettre `sitemap.xml` dans Search Console** + demander l'indexation de 5 pages clés. (Sans ça tout rame.)
- [ ] Maillage interne renforcé depuis les pages fortes vers les money pages.

### 7. Confiance / E-E-A-T — `[à faire]`
- [ ] Études de cas réelles (réalisations avec ville + RAL + avant/après).
- [ ] Page À-propos enrichie (équipe, atelier, histoire).
- [ ] Avis réels saisis en admin (schema AggregateRating déjà en place).

### 8. Page Pros B2B (sous-traitance) — `[CONTENU PRÊT]`
Contenu prêt : `docs/seo-content/page_pros_sous_traitance.json` (métalliers, serruriers, chaudronniers, industriels — fort LTV).
- [ ] Enrichir `/professionnels` avec ce contenu (capacité cabine 7×3×4 m, séries, comptes pro, enlèvement/livraison).

---

## Actions PROPRIÉTAIRE (je ne peux pas les faire)
1. **Google Business Profile** : revendiquer + optimiser + lancer les avis.
2. **Search Console** : soumettre le sitemap + demander l'indexation.
3. **GA4** : définir `NEXT_PUBLIC_GA4_ID` (env Vercel) + marquer `form_submit`, clic `tel:`, WhatsApp comme **conversions (Key Events)**.
4. **Resend** : créer le compte, vérifier le domaine `azepoxy.fr`, définir `RESEND_API_KEY` + `RESEND_FROM`, activer le toggle « Notifier sur nouveau lead ».
5. **WhatsApp** : confirmer qu'un compte WhatsApp existe sur le numéro, sinon fournir un mobile dédié.

---

## Roadmap 30 / 60 / 90 jours
- **30 j (fondations leads)** : GBP + 1ers avis · GA4 + conversions · soumettre sitemap · activer Resend + relance abandons · CRO wizard (email tôt + preuve sociale + prix live).
- **60 j (couverture commerciale)** : 30 combos géo×service · 6 articles blog · page pros enrichie · vrais visuels hero.
- **90 j (autorité)** : études de cas · backlinks/citations locales · A/B test CTA · itération sur les données GSC/GA4.

---

## Journal d'implémentation
- **2026-06-08** — Sprint 1 : 3 pages argent (jantes refonte + portail + sablage), template enrichi (prix/réassurance), sitemap 121→350, nav étendue, CRO quick wins (sticky 120px, WhatsApp prefill). Contenu workflow persisté dans `docs/seo-content/`.
