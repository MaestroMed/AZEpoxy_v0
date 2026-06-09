import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  pgEnum,
  index,
  integer,
  numeric,
  boolean,
} from "drizzle-orm/pg-core";

/* ── Enums ─────────────────────────────────────────────────────────── */

export const leadSourceEnum = pgEnum("lead_source", [
  "contact",
  "devis",
  "guide",
  "abandoned",
  "other",
]);

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
]);

export const leadEventTypeEnum = pgEnum("lead_event_type", [
  "created",
  "status_change",
  "note_added",
  "contacted",
]);

/* ── Tables ────────────────────────────────────────────────────────── */

/**
 * Leads — every form submission lands here. The pipeline (lib/leads.ts)
 * writes one row per submission and emits a `created` event in the
 * lead_events audit log.
 */
export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    source: leadSourceEnum("source").notNull().default("contact"),
    status: leadStatusEnum("status").notNull().default("new"),

    // Identity
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),
    company: text("company"),

    // Body
    message: text("message"),
    projectType: text("project_type"),
    ralCode: text("ral_code"),
    extra: jsonb("extra").$type<Record<string, unknown>>(),

    // Privacy: we hash the IP rather than store it raw (RGPD-friendly).
    ipHash: text("ip_hash"),

    // Admin-only annotation, separate from `message` which is the
    // visitor's own copy.
    notes: text("notes"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    statusIdx: index("leads_status_idx").on(table.status),
    sourceIdx: index("leads_source_idx").on(table.source),
    createdAtIdx: index("leads_created_at_idx").on(table.createdAt),
  }),
);

/**
 * Lead events — audit log of every change on a lead. Used to display
 * a history timeline on the admin detail page, and to power notification
 * triggers in the future.
 */
export const leadEvents = pgTable(
  "lead_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    type: leadEventTypeEnum("type").notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>(),
    /** Who triggered the event. "system" for automatic events, or the
     *  admin email for manual actions. */
    actor: text("actor").notNull().default("system"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    leadIdIdx: index("lead_events_lead_id_idx").on(table.leadId),
    createdAtIdx: index("lead_events_created_at_idx").on(table.createdAt),
  }),
);

/* ── SEO QA — résultats des passes de contrôle automatique ──────── */

/**
 * One row per QA run. The cron job `/api/cron/qa-villes` writes here.
 * The admin `/admin/seo` page reads the most recent rows to surface
 * health metrics and broken pages.
 */
export const seoQaRuns = pgTable(
  "seo_qa_runs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ranAt: timestamp("ran_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    durationMs: integer("duration_ms").notNull().default(0),
    totalPages: integer("total_pages").notNull().default(0),
    okCount: integer("ok_count").notNull().default(0),
    koCount: integer("ko_count").notNull().default(0),
    /** Per-page result map: { "/thermolaquage-cergy": { ok, issues, ... } } */
    pages: jsonb("pages").$type<Record<string, SeoQaPageResult>>().notNull(),
    /** "manual" | "cron" — provenance. */
    trigger: text("trigger").notNull().default("cron"),
  },
  (table) => ({
    ranAtIdx: index("seo_qa_runs_ran_at_idx").on(table.ranAt),
  }),
);

export interface SeoQaPageResult {
  ok: boolean;
  status?: number;
  /** List of failed checks. Empty when `ok` is true. */
  issues: string[];
  /** Approximate word count of the body text. */
  wordCount?: number;
  /** First H1 captured. */
  h1?: string;
  hasBreadcrumb?: boolean;
  hasFaq?: boolean;
  hasLocalBusiness?: boolean;
}

/* ══ DEVIS / QUOTES ════════════════════════════════════════════════ */

export const quoteStatusEnum = pgEnum("quote_status", [
  "draft",
  "sent",
  "accepted",
  "rejected",
  "expired",
]);

export const quotes = pgTable(
  "quotes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Numéro lisible AZ-2026-0001. */
    number: text("number").notNull().unique(),
    status: quoteStatusEnum("status").notNull().default("draft"),

    /** Lead source optionnel (devis créé depuis un lead). */
    leadId: uuid("lead_id").references(() => leads.id, {
      onDelete: "set null",
    }),

    // Client
    clientName: text("client_name").notNull(),
    clientEmail: text("client_email"),
    clientPhone: text("client_phone"),
    clientCompany: text("client_company"),
    clientAddress: text("client_address"),

    // Montants — numeric en centimes via string pour précision.
    /** Taux de TVA en % (ex "20"). */
    taxRate: numeric("tax_rate", { precision: 5, scale: 2 })
      .notNull()
      .default("20"),
    /** Sous-total HT, en euros (string décimal). */
    subtotal: numeric("subtotal", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    taxAmount: numeric("tax_amount", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    total: numeric("total", { precision: 12, scale: 2 }).notNull().default("0"),

    notes: text("notes"),
    /** Date de validité du devis. */
    validUntil: timestamp("valid_until", { withTimezone: true }),
    /** Quand il a été envoyé / accepté. */
    sentAt: timestamp("sent_at", { withTimezone: true }),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),

    createdBy: text("created_by").notNull().default("system"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    statusIdx: index("quotes_status_idx").on(table.status),
    createdAtIdx: index("quotes_created_at_idx").on(table.createdAt),
    leadIdIdx: index("quotes_lead_id_idx").on(table.leadId),
  }),
);

export const quoteItems = pgTable(
  "quote_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    quoteId: uuid("quote_id")
      .notNull()
      .references(() => quotes.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    description: text("description"),
    quantity: numeric("quantity", { precision: 10, scale: 2 })
      .notNull()
      .default("1"),
    unit: text("unit").notNull().default("u"),
    unitPrice: numeric("unit_price", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    lineTotal: numeric("line_total", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => ({
    quoteIdIdx: index("quote_items_quote_id_idx").on(table.quoteId),
  }),
);

/* ══ CONTENU — réalisations / avis / settings ══════════════════════ */

export const realisationCategoryEnum = pgEnum("realisation_category", [
  "jantes",
  "moto",
  "mobilier",
  "industriel",
  "portail",
]);

export const realisations = pgTable(
  "realisations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    category: realisationCategoryEnum("category").notNull().default("portail"),
    description: text("description").notNull().default(""),
    /** Liste de codes RAL/teintes. */
    colors: jsonb("colors").$type<string[]>().notNull().default([]),
    /** Chemin image (/images/realisations/...). */
    image: text("image"),
    featured: boolean("featured").notNull().default(false),
    published: boolean("published").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    publishedIdx: index("realisations_published_idx").on(table.published),
    sortIdx: index("realisations_sort_idx").on(table.sortOrder),
  }),
);

export const testimonials = pgTable(
  "testimonials",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    company: text("company"),
    role: text("role"),
    quote: text("quote").notNull(),
    rating: integer("rating").notNull().default(5),
    service: text("service"),
    source: text("source").notNull().default("manual"),
    published: boolean("published").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    publishedIdx: index("testimonials_published_idx").on(table.published),
  }),
);

/** Singleton key-value pour les réglages du site (id fixe = 'default'). */
export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey().default("default"),
  data: jsonb("data").$type<SiteSettingsData>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedBy: text("updated_by").notNull().default("system"),
});

export interface SiteSettingsData {
  businessName?: string;
  phone?: string;
  email?: string;
  addressStreet?: string;
  addressZip?: string;
  addressCity?: string;
  openingHours?: string;
  /** Notifier par email à chaque nouveau lead. */
  notifyOnLead?: boolean;
  notifyEmail?: string;
}

/* ══ JOURNAL D'ACTIVITÉ ADMIN ══════════════════════════════════════ */

export const adminActivity = pgTable(
  "admin_activity",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Qui : email admin ou 'system'. */
    actor: text("actor").notNull().default("system"),
    /** Verbe : "lead.status", "quote.created", "content.updated"… */
    action: text("action").notNull(),
    /** Type d'entité concernée : "lead" | "quote" | "realisation"… */
    entityType: text("entity_type"),
    entityId: text("entity_id"),
    /** Résumé lisible. */
    summary: text("summary").notNull(),
    meta: jsonb("meta").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    createdAtIdx: index("admin_activity_created_at_idx").on(table.createdAt),
    entityIdx: index("admin_activity_entity_idx").on(
      table.entityType,
      table.entityId,
    ),
  }),
);

/* ── Inferred types ───────────────────────────────────────────────── */

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type LeadEvent = typeof leadEvents.$inferSelect;
export type NewLeadEvent = typeof leadEvents.$inferInsert;
export type LeadSource = (typeof leadSourceEnum.enumValues)[number];
export type LeadStatus = (typeof leadStatusEnum.enumValues)[number];
export type LeadEventType = (typeof leadEventTypeEnum.enumValues)[number];
export type SeoQaRun = typeof seoQaRuns.$inferSelect;
export type NewSeoQaRun = typeof seoQaRuns.$inferInsert;

export type Quote = typeof quotes.$inferSelect;
export type NewQuote = typeof quotes.$inferInsert;
export type QuoteItem = typeof quoteItems.$inferSelect;
export type NewQuoteItem = typeof quoteItems.$inferInsert;
export type QuoteStatus = (typeof quoteStatusEnum.enumValues)[number];
export type Realisation = typeof realisations.$inferSelect;
export type NewRealisation = typeof realisations.$inferInsert;
export type RealisationCategory =
  (typeof realisationCategoryEnum.enumValues)[number];
export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;
export type SiteSettingsRow = typeof siteSettings.$inferSelect;
export type AdminActivity = typeof adminActivity.$inferSelect;
export type NewAdminActivity = typeof adminActivity.$inferInsert;
