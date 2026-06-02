import { redirect } from "next/navigation";
import { sql } from "drizzle-orm";
import { Sidebar } from "@/components/admin/sidebar";
import { AdminMobileNav } from "@/components/admin/mobile-nav";
import { getCurrentAdmin } from "@/lib/admin/session";
import { getDb, leads } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Belt-and-braces: middleware already gates this, but if anyone ever
  // hits the route with a stale cookie we redirect rather than crash.
  const session = await getCurrentAdmin();
  if (!session) {
    redirect("/admin/login");
  }

  // Count `new` leads for the sidebar badge. Cheap query, runs on every
  // admin page navigation — Neon HTTP makes that cost ~5 ms.
  let newCount = 0;
  try {
    const rows = await getDb()
      .select({ count: sql<number>`count(*)::int` })
      .from(leads)
      .where(sql`${leads.status} = 'new'`);
    newCount = rows[0]?.count ?? 0;
  } catch (err) {
    console.error("[admin/layout] lead count failed", err);
  }

  return (
    <div className="flex min-h-svh">
      <Sidebar adminEmail={session.email} leadCount={newCount} />
      <div className="flex-1 min-w-0">
        <AdminMobileNav adminEmail={session.email} leadCount={newCount} />
        {children}
      </div>
    </div>
  );
}
