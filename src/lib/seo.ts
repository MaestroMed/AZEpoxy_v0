import type { Metadata } from "next";
import { SITE } from "@/lib/utils";

const DEFAULT_OG = "/og-image.jpg";

export interface BuildMetadataInput {
  title: string;
  description: string;
  /** Path beginning with "/" — used to derive the canonical URL. */
  path?: string;
  /** Page-specific OG/Twitter image. Defaults to /og-image.jpg. */
  image?: string;
  /** OG type. Default "website"; use "article" on blog posts. */
  type?: "website" | "article";
  /** Set true on legal/utility pages we don't want indexed. */
  noindex?: boolean;
  /** Optional Article-specific fields, only honored when type === "article". */
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
    authors?: string[];
  };
  /** Extra keywords appended to the brand defaults. */
  keywords?: string[];
}

/**
 * Centralized metadata builder. The root layout sets `metadataBase` and the
 * default title template, so callers only specify the page-level overrides.
 */
export function buildMetadata(input: BuildMetadataInput): Metadata {
  const path = normalizePath(input.path);
  const url = `${SITE.url}${path}`;
  const image = input.image ?? DEFAULT_OG;

  const meta: Metadata = {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      type: input.type ?? "website",
      locale: "fr_FR",
      url,
      siteName: SITE.name,
      title: input.title,
      description: input.description,
      images: [{ url: image, width: 1200, height: 630, alt: input.title }],
      ...(input.type === "article" && input.article
        ? {
            publishedTime: input.article.publishedTime,
            modifiedTime: input.article.modifiedTime,
            section: input.article.section,
            tags: input.article.tags,
            authors: input.article.authors ?? [SITE.name],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [image],
    },
  };

  if (input.keywords?.length) {
    meta.keywords = input.keywords;
  }

  if (input.noindex) {
    meta.robots = { index: false, follow: false };
  }

  return meta;
}

function normalizePath(path?: string): string {
  if (!path || path === "/") return "";
  return path.startsWith("/") ? path : `/${path}`;
}
