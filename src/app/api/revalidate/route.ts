import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { revalidateSecret } from "@/sanity/env";

/**
 * Sanity → Next.js GROQ-powered webhook. Configure the projection in the
 * Sanity webhook UI to:
 *   { _type, "slug": slug.current }
 *
 * The route fires both `<type>:list` and `<type>:<slug>` so the listing page
 * and the detail page both refresh.
 */
export async function POST(req: NextRequest) {
  if (!revalidateSecret) {
    return NextResponse.json(
      { ok: false, message: "SANITY_REVALIDATE_SECRET not set" },
      { status: 500 }
    );
  }

  let body: { _type?: string; slug?: string } | null = null;
  let isValidSignature = false;
  try {
    const parsed = await parseBody<{ _type?: string; slug?: string }>(
      req,
      revalidateSecret
    );
    body = parsed.body;
    isValidSignature = parsed.isValidSignature ?? false;
  } catch (err) {

    console.error("[revalidate] body parse failed", err);
    return NextResponse.json({ ok: false, message: "Invalid body" }, { status: 400 });
  }

  if (!isValidSignature) {
    return NextResponse.json({ ok: false, message: "Invalid signature" }, { status: 401 });
  }

  if (!body?._type) {
    return NextResponse.json({ ok: false, message: "Missing _type" }, { status: 400 });
  }

  const tags = [`${body._type}:list`];
  if (body.slug) tags.push(`${body._type}:${body.slug}`);

  for (const tag of tags) revalidateTag(tag);

  return NextResponse.json({ ok: true, revalidated: tags });
}
