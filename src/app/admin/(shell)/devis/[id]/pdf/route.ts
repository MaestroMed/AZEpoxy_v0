import { NextResponse, type NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { getCurrentAdmin } from "@/lib/admin/session";
import { getQuote } from "@/lib/admin/quotes";
import { QuoteDocument } from "@/lib/admin/quote-pdf";

export const dynamic = "force-dynamic";
// @react-pdf a besoin du runtime Node (pas Edge).
export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const result = await getQuote(id);
  if (!result) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const element = createElement(QuoteDocument, {
    quote: result.quote,
    items: result.items,
  }) as Parameters<typeof renderToBuffer>[0];
  const buffer = await renderToBuffer(element);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${result.quote.number}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
