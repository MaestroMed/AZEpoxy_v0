/**
 * Resolved Sanity configuration. All values are optional — when the project
 * id is missing we fall back to the hardcoded data shipped with the repo so
 * the site still builds and renders without a Sanity project.
 */

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-10-01";
export const studioUrl =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ?? "/studio";

/** Server-only token for write operations (seed script + lead writes). */
export const writeToken = process.env.SANITY_WRITE_TOKEN;

/** Webhook secret for signed revalidation calls from Sanity. */
export const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET;

/** True when the project is wired up enough to read content. */
export const isSanityConfigured = Boolean(projectId);

export function assertConfigured(reason: string): string {
  if (!projectId) {
    throw new Error(
      `Sanity not configured (${reason}). Set NEXT_PUBLIC_SANITY_PROJECT_ID.`
    );
  }
  return projectId;
}
