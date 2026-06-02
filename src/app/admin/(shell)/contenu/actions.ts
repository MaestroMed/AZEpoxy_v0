"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  createRealisation,
  updateRealisation,
  deleteRealisation,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  saveSettings,
} from "@/lib/admin/content";
import { requireAdmin } from "@/lib/admin/session";
import { logActivity } from "@/lib/admin/activity";

/* ── Réalisations ──────────────────────────────────────────────── */

const RealisationSchema = z.object({
  title: z.string().trim().min(1),
  category: z.enum(["jantes", "moto", "mobilier", "industriel", "portail"]),
  description: z.string().trim().default(""),
  colors: z.array(z.string()).default([]),
  image: z.string().trim().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

function parseRealisation(formData: FormData) {
  const raw = formData.get("payload");
  if (typeof raw !== "string") return { error: "Données manquantes" };
  try {
    return RealisationSchema.parse(JSON.parse(raw));
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Données invalides" };
  }
}

export async function saveRealisationAction(
  id: string | null,
  formData: FormData,
) {
  const admin = await requireAdmin();
  const data = parseRealisation(formData);
  if ("error" in data) return { ok: false as const, error: data.error };
  const values = {
    title: data.title,
    category: data.category,
    description: data.description,
    colors: data.colors,
    image: data.image || null,
    featured: data.featured,
    published: data.published,
    sortOrder: data.sortOrder,
  };
  if (id) {
    await updateRealisation(id, values);
    await logActivity({
      actor: admin.email,
      action: "content.realisation.update",
      entityType: "realisation",
      entityId: id,
      summary: `Réalisation modifiée : ${data.title}`,
    });
  } else {
    const newId = await createRealisation(values);
    await logActivity({
      actor: admin.email,
      action: "content.realisation.create",
      entityType: "realisation",
      entityId: newId,
      summary: `Réalisation créée : ${data.title}`,
    });
  }
  revalidatePath("/admin/contenu/realisations");
  redirect("/admin/contenu/realisations");
}

export async function deleteRealisationAction(id: string) {
  const admin = await requireAdmin();
  await deleteRealisation(id);
  await logActivity({
    actor: admin.email,
    action: "content.realisation.delete",
    entityType: "realisation",
    entityId: id,
    summary: "Réalisation supprimée",
  });
  revalidatePath("/admin/contenu/realisations");
  redirect("/admin/contenu/realisations");
}

/* ── Avis ──────────────────────────────────────────────────────── */

const TestimonialSchema = z.object({
  name: z.string().trim().min(1),
  company: z.string().trim().optional(),
  role: z.string().trim().optional(),
  quote: z.string().trim().min(1),
  rating: z.number().int().min(1).max(5).default(5),
  service: z.string().trim().optional(),
  source: z.string().trim().default("manual"),
  published: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

function parseTestimonial(formData: FormData) {
  const raw = formData.get("payload");
  if (typeof raw !== "string") return { error: "Données manquantes" };
  try {
    return TestimonialSchema.parse(JSON.parse(raw));
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Données invalides" };
  }
}

export async function saveTestimonialAction(
  id: string | null,
  formData: FormData,
) {
  const admin = await requireAdmin();
  const data = parseTestimonial(formData);
  if ("error" in data) return { ok: false as const, error: data.error };
  const values = {
    name: data.name,
    company: data.company || null,
    role: data.role || null,
    quote: data.quote,
    rating: data.rating,
    service: data.service || null,
    source: data.source,
    published: data.published,
    sortOrder: data.sortOrder,
  };
  if (id) {
    await updateTestimonial(id, values);
    await logActivity({
      actor: admin.email,
      action: "content.avis.update",
      entityType: "testimonial",
      entityId: id,
      summary: `Avis modifié : ${data.name}`,
    });
  } else {
    const newId = await createTestimonial(values);
    await logActivity({
      actor: admin.email,
      action: "content.avis.create",
      entityType: "testimonial",
      entityId: newId,
      summary: `Avis créé : ${data.name}`,
    });
  }
  revalidatePath("/admin/contenu/avis");
  redirect("/admin/contenu/avis");
}

export async function deleteTestimonialAction(id: string) {
  const admin = await requireAdmin();
  await deleteTestimonial(id);
  await logActivity({
    actor: admin.email,
    action: "content.avis.delete",
    entityType: "testimonial",
    entityId: id,
    summary: "Avis supprimé",
  });
  revalidatePath("/admin/contenu/avis");
  redirect("/admin/contenu/avis");
}

/* ── Settings ──────────────────────────────────────────────────── */

const SettingsSchema = z.object({
  businessName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  addressStreet: z.string().optional(),
  addressZip: z.string().optional(),
  addressCity: z.string().optional(),
  openingHours: z.string().optional(),
  notifyOnLead: z.boolean().optional(),
  notifyEmail: z.string().optional(),
});

export async function saveSettingsAction(formData: FormData) {
  const admin = await requireAdmin();
  const raw = formData.get("payload");
  if (typeof raw !== "string") return { ok: false as const, error: "Vide" };
  let data;
  try {
    data = SettingsSchema.parse(JSON.parse(raw));
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Invalide" };
  }
  await saveSettings(data, admin.email);
  await logActivity({
    actor: admin.email,
    action: "content.settings.update",
    summary: "Profil entreprise mis à jour",
  });
  revalidatePath("/admin/contenu/entreprise");
  return { ok: true as const };
}
