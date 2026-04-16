import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { sanityWriteClient } from "@/sanity/client";

/**
 * Cron-pulled Google Places (New) review sync.
 *
 * Protected by GOOGLE_REVIEWS_SYNC_SECRET (header `x-sync-secret`) so only
 * the scheduler can trigger it. Run from Vercel Cron or a Cloudflare
 * Worker hitting this route daily.
 *
 * Dependencies (env):
 *   - GOOGLE_PLACES_API_KEY: restricted key with Places API (New) enabled
 *   - GOOGLE_PLACE_ID: your business Place ID
 *   - GOOGLE_REVIEWS_SYNC_SECRET: shared secret for cron triggers
 *   - SANITY_WRITE_TOKEN: required to upsert review documents
 *
 * When any are missing we return 501 so the cron reports an actionable
 * error instead of silently succeeding.
 */

interface PlaceReview {
  name: string;
  rating?: number;
  originalText?: { text?: string };
  text?: { text?: string };
  publishTime?: string;
  authorAttribution?: { displayName?: string };
}

interface PlaceDetailsResponse {
  id?: string;
  rating?: number;
  userRatingCount?: number;
  reviews?: PlaceReview[];
}

export async function POST(request: NextRequest) {
  const secret = process.env.GOOGLE_REVIEWS_SYNC_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "GOOGLE_REVIEWS_SYNC_SECRET not configured" },
      { status: 501 }
    );
  }
  if (request.headers.get("x-sync-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) {
    return NextResponse.json(
      { error: "GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID are required" },
      { status: 501 }
    );
  }

  if (!sanityWriteClient) {
    return NextResponse.json(
      { error: "SANITY_WRITE_TOKEN not configured" },
      { status: 501 }
    );
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=fr`;
    const res = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "id,rating,userRatingCount,reviews.name,reviews.rating,reviews.originalText,reviews.text,reviews.publishTime,reviews.authorAttribution",
      },
      // Don't cache — we want the freshest reviews from Google
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "Places API error", status: res.status, details: text },
        { status: 502 }
      );
    }

    const data = (await res.json()) as PlaceDetailsResponse;
    const reviews = data.reviews ?? [];

    const tx = sanityWriteClient.transaction();
    for (const r of reviews) {
      const externalId = r.name;
      if (!externalId) continue;
      const id = `review.google.${externalId.split("/").pop()}`;
      const body =
        r.originalText?.text ?? r.text?.text ?? "";
      tx.createOrReplace({
        _id: id,
        _type: "review",
        author: r.authorAttribution?.displayName ?? "Client Google",
        rating: r.rating ?? 5,
        body,
        publishedAt: r.publishTime ?? new Date().toISOString(),
        source: "google",
        externalId,
        language: "fr",
      });
    }
    await tx.commit({ visibility: "async" });
    revalidateTag("review:list");

    return NextResponse.json({
      ok: true,
      synced: reviews.length,
      overall: { rating: data.rating, count: data.userRatingCount },
    });
  } catch (err) {

    console.error("[reviews/sync] failed", err);
    return NextResponse.json(
      { error: "Sync failed", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

// Allow GET triggers from simple cron tools too, same secret.
export const GET = POST;
