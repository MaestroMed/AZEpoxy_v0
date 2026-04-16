import { createClient, type QueryParams } from "next-sanity";
import {
  apiVersion,
  dataset,
  isSanityConfigured,
  projectId,
  writeToken,
} from "./env";

/** Read-only client. `null` when Sanity isn't configured. */
export const sanityClient = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
    })
  : null;

/** Write client (seed script, lead writes). Requires SANITY_WRITE_TOKEN. */
export const sanityWriteClient =
  isSanityConfigured && writeToken
    ? createClient({
        projectId,
        dataset,
        apiVersion,
        useCdn: false,
        token: writeToken,
        perspective: "raw",
      })
    : null;

interface FetchOptions {
  /** ISR tag(s) for selective revalidation from the Sanity webhook. */
  tags?: string[];
  /** Override revalidate (default: rely on tags + on-demand revalidation). */
  revalidate?: number | false;
}

/**
 * Fetch a GROQ query. Returns `null` when Sanity isn't configured so callers
 * can fall back to hardcoded data without throwing.
 */
export async function sanityFetch<T>(
  query: string,
  params: QueryParams = {},
  options: FetchOptions = {}
): Promise<T | null> {
  if (!sanityClient) return null;
  try {
    return await sanityClient.fetch<T>(query, params, {
      next: {
        tags: options.tags,
        revalidate: options.revalidate,
      },
    });
  } catch (err) {

    console.error("[sanityFetch] query failed", err);
    return null;
  }
}
