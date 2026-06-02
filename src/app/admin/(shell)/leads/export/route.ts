import { NextResponse, type NextRequest } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/session";
import { listLeads } from "@/lib/admin/queries";
import type { LeadSource, LeadStatus } from "@/lib/db";

export const dynamic = "force-dynamic";

function csvCell(v: unknown): string {
  if (v == null) return "";
  const s = String(v);
  if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const sp = req.nextUrl.searchParams;
  const { rows } = await listLeads({
    q: sp.get("q") ?? undefined,
    status: (sp.get("status") as LeadStatus) ?? undefined,
    source: (sp.get("source") as LeadSource) ?? undefined,
    limit: 5000,
  });

  const header = [
    "Date",
    "Nom",
    "Email",
    "Téléphone",
    "Entreprise",
    "Source",
    "Statut",
    "Type projet",
    "Code RAL",
    "Message",
  ];
  const lines = [header.join(";")];
  for (const l of rows) {
    lines.push(
      [
        new Date(l.createdAt).toISOString(),
        l.name,
        l.email,
        l.phone,
        l.company,
        l.source,
        l.status,
        l.projectType,
        l.ralCode,
        l.message?.replace(/\n/g, " "),
      ]
        .map(csvCell)
        .join(";"),
    );
  }
  // BOM pour Excel FR (accents).
  const body = "﻿" + lines.join("\r\n");
  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-azepoxy-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
