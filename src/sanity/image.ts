import imageUrlBuilder from "@sanity/image-url";
import { dataset, isSanityConfigured, projectId } from "./env";

/** Loose source type — matches what Sanity image fields produce. */
export type SanityImageSource = Parameters<
  ReturnType<typeof imageUrlBuilder>["image"]
>[0];

const builder = isSanityConfigured
  ? imageUrlBuilder({ projectId: projectId!, dataset })
  : null;

export function urlFor(source: SanityImageSource) {
  if (!builder) {
    throw new Error("Sanity image URL requested but project not configured.");
  }
  return builder.image(source);
}

/**
 * Convenience: build a sized image URL with sensible defaults. Returns null
 * when no source is provided (callers should then render a fallback UI).
 */
export function imageUrl(
  source: SanityImageSource | undefined | null,
  width: number,
  height?: number
): string | null {
  if (!source || !builder) return null;
  let b = builder.image(source).auto("format").quality(80).width(width);
  if (height) b = b.height(height).fit("crop");
  return b.url();
}
