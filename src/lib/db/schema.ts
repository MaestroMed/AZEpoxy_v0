import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  pgEnum,
  index,
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
    durationMs: text("duration_ms").notNull().default("0"),
    totalPages: text("total_pages").notNull().default("0"),
    okCount: text("ok_count").notNull().default("0"),
    koCount: text("ko_count").notNull().default("0"),
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
