import "server-only";
import { asc, desc, eq } from "drizzle-orm";
import {
  getDb,
  realisations,
  testimonials,
  siteSettings,
  type Realisation,
  type NewRealisation,
  type Testimonial,
  type NewTestimonial,
  type SiteSettingsData,
} from "@/lib/db";

/* ══ RÉALISATIONS ══════════════════════════════════════════════════ */

export async function listRealisations(): Promise<Realisation[]> {
  return getDb()
    .select()
    .from(realisations)
    .orderBy(asc(realisations.sortOrder), desc(realisations.createdAt));
}

export async function getRealisation(
  id: string,
): Promise<Realisation | null> {
  const [r] = await getDb()
    .select()
    .from(realisations)
    .where(eq(realisations.id, id))
    .limit(1);
  return r ?? null;
}

export async function createRealisation(
  data: Omit<NewRealisation, "id" | "createdAt" | "updatedAt">,
): Promise<string> {
  const [row] = await getDb()
    .insert(realisations)
    .values(data)
    .returning({ id: realisations.id });
  return row.id;
}

export async function updateRealisation(
  id: string,
  data: Partial<NewRealisation>,
): Promise<void> {
  await getDb()
    .update(realisations)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(realisations.id, id));
}

export async function deleteRealisation(id: string): Promise<void> {
  await getDb().delete(realisations).where(eq(realisations.id, id));
}

/* ══ AVIS / TESTIMONIALS ═══════════════════════════════════════════ */

export async function listTestimonials(): Promise<Testimonial[]> {
  return getDb()
    .select()
    .from(testimonials)
    .orderBy(asc(testimonials.sortOrder), desc(testimonials.createdAt));
}

export async function getTestimonial(
  id: string,
): Promise<Testimonial | null> {
  const [t] = await getDb()
    .select()
    .from(testimonials)
    .where(eq(testimonials.id, id))
    .limit(1);
  return t ?? null;
}

export async function createTestimonial(
  data: Omit<NewTestimonial, "id" | "createdAt">,
): Promise<string> {
  const [row] = await getDb()
    .insert(testimonials)
    .values(data)
    .returning({ id: testimonials.id });
  return row.id;
}

export async function updateTestimonial(
  id: string,
  data: Partial<NewTestimonial>,
): Promise<void> {
  await getDb().update(testimonials).set(data).where(eq(testimonials.id, id));
}

export async function deleteTestimonial(id: string): Promise<void> {
  await getDb().delete(testimonials).where(eq(testimonials.id, id));
}

/* ══ SETTINGS (singleton) ══════════════════════════════════════════ */

export async function getSettings(): Promise<SiteSettingsData> {
  if (!process.env.DATABASE_URL) return {};
  try {
    const [row] = await getDb()
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.id, "default"))
      .limit(1);
    return row?.data ?? {};
  } catch {
    return {};
  }
}

export async function saveSettings(
  data: SiteSettingsData,
  updatedBy: string,
): Promise<void> {
  const db = getDb();
  await db
    .insert(siteSettings)
    .values({ id: "default", data, updatedBy, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: siteSettings.id,
      set: { data, updatedBy, updatedAt: new Date() },
    });
}

/* ══ LECTURES PUBLIQUES (DB → fallback code) ═══════════════════════ */

/**
 * Avis publiés pour le site public : DB si elle contient des entrées,
 * sinon le dataset hardcodé. Tant que la DB est vide, comportement
 * inchangé (zéro risque).
 */
export async function getPublicTestimonials(): Promise<Testimonial[]> {
  if (!process.env.DATABASE_URL) return [];
  try {
    const rows = await getDb()
      .select()
      .from(testimonials)
      .where(eq(testimonials.published, true))
      .orderBy(asc(testimonials.sortOrder), desc(testimonials.createdAt));
    return rows;
  } catch {
    return [];
  }
}

export async function getPublicRealisations(): Promise<Realisation[]> {
  if (!process.env.DATABASE_URL) return [];
  try {
    const rows = await getDb()
      .select()
      .from(realisations)
      .where(eq(realisations.published, true))
      .orderBy(asc(realisations.sortOrder), desc(realisations.createdAt));
    return rows;
  } catch {
    return [];
  }
}
