import { ImageResponse } from "next/og";
import { ogTemplate } from "@/lib/og";
import {
  BLOG_ARTICLES_FALLBACK,
  getBlogArticleBySlug,
} from "@/lib/blog-data";

export const alt = "Article AZ Époxy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return BLOG_ARTICLES_FALLBACK.map((a) => ({ slug: a.slug }));
}

export default async function BlogArticleOg({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getBlogArticleBySlug(params.slug);
  const title = article?.title ?? "Blog AZ Époxy";
  const tagline =
    article?.description ??
    "Expertise thermolaquage, sablage, finitions — nos articles techniques.";

  return new ImageResponse(
    ogTemplate({
      label: article?.category ?? "Blog",
      title: truncate(title, 90),
      tagline: truncate(tagline, 140),
    }),
    size
  );
}

function truncate(input: string, max: number): string {
  if (input.length <= max) return input;
  return `${input.slice(0, max - 1).trimEnd()}…`;
}
