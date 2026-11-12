import { after, NextResponse, type NextRequest } from "next/server";
import { renderRalGuide } from "@/lib/pdf/guide-ral";
import { extractIp, ratelimit } from "@/lib/ratelimit";
import { verifyTurnstile } from "@/lib/turnstile";
import { fanoutLead } from "@/lib/leads";

/**
 * Gated PDF lead magnet. POST { name, email, phone?, turnstileToken? }
 * returns the generated RAL guide and writes a lead with source:"guide".
 *
 * The PDF is rendered on-demand with @react-pdf/renderer (Node runtime).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface GuideRequest {
  name?: string;
  email?: string;
  phone?: string;
  turnstileToken?: string;
  website?: string;
}

export async function POST(request: NextRequest) {
  const ip = extractIp(request);
  const limit = await ratelimit(ip, {
    prefix: "guide",
    limit: 5,
    window: "1 h",
  });
  if (!limit.success) {
    return NextResponse.json(
      { error: "Trop de demandes. Réessayez dans une heure." },
      { status: 429 }
    );
  }

  let body: GuideRequest;
  try {
    body = (await request.json()) as GuideRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const text = (v: unknown, max: number) =>
    typeof v === "string" ? v.slice(0, max).trim() : "";
  const name = text(body.name, 200);
  const email = text(body.email, 320);

  if (body.website) {
    // Honeypot — pretend success so bots don't learn
    return NextResponse.json({ ok: true });
  }

  if (!name || !email || !/.+@.+\..+/.test(email)) {
    return NextResponse.json(
      { error: "Nom et email valides requis." },
      { status: 400 }
    );
  }

  const turnstile = await verifyTurnstile(body.turnstileToken ?? null, ip);
  if (!turnstile.success) {
    return NextResponse.json(
      { error: "Vérification anti-spam échouée." },
      { status: 403 }
    );
  }

  try {
    const pdf = await renderRalGuide({ customerName: name });

    // Écriture du lead après la réponse. `after` garde la fonction en vie
    // jusqu'au bout : un `void promise` peut être coupé par Vercel dès que
    // la réponse est partie, et le lead avec.
    after(() =>
      fanoutLead({
        source: "guide",
        name,
        email,
        phone: text(body.phone, 64),
        ip,
      })
    );

    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="azepoxy-guide-ral.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err) {

    console.error("[guide] PDF render failed", err);
    return NextResponse.json(
      { error: "Génération du guide impossible. Appelez-nous au 09 71 35 74 96." },
      { status: 500 }
    );
  }
}
