import Link from "next/link";
import {
  Activity,
  FileText,
  Image as ImageIcon,
  Settings as SettingsIcon,
  Star,
  Users,
} from "lucide-react";
import { Card, PageHeader } from "@/components/admin/primitives";
import { getRecentActivity } from "@/lib/admin/activity";
import { formatRelativeFr, formatDateTimeFr } from "@/lib/admin/format";
import type { AdminActivity } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ActivitePage() {
  const rows = await getRecentActivity(80);

  return (
    <>
      <PageHeader
        eyebrow="Système"
        title="Journal d'activité"
        description="Toutes les actions effectuées dans le backoffice — statuts, devis, contenu."
      />

      <div className="px-8 py-7">
        <Card>
          {rows.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03]">
                <Activity className="h-5 w-5 text-white/40" />
              </div>
              <p className="mt-5 font-display text-lg font-black text-white">
                Aucune activité
              </p>
              <p className="mt-2 text-sm text-white/45">
                Les actions admin (changements de statut, devis, contenu)
                apparaîtront ici.
              </p>
            </div>
          ) : (
            <ul className="px-5 py-3">
              {rows.map((a, i) => (
                <ActivityRow key={a.id} activity={a} last={i === rows.length - 1} />
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}

function iconFor(action: string) {
  if (action.startsWith("lead")) return Users;
  if (action.startsWith("quote")) return FileText;
  if (action.startsWith("content.realisation")) return ImageIcon;
  if (action.startsWith("content.avis")) return Star;
  if (action.startsWith("content.settings")) return SettingsIcon;
  return Activity;
}

function hrefFor(a: AdminActivity): string | null {
  if (a.entityType === "lead" && a.entityId)
    return `/admin/leads/${a.entityId}`;
  if (a.entityType === "quote" && a.entityId)
    return `/admin/devis/${a.entityId}`;
  if (a.entityType === "realisation" && a.entityId)
    return `/admin/contenu/realisations/${a.entityId}`;
  if (a.entityType === "testimonial" && a.entityId)
    return `/admin/contenu/avis/${a.entityId}`;
  return null;
}

function ActivityRow({
  activity,
  last,
}: {
  activity: AdminActivity;
  last: boolean;
}) {
  const Icon = iconFor(activity.action);
  const href = hrefFor(activity);
  const inner = (
    <div className="flex gap-4 py-3">
      <div className="relative flex flex-col items-center">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-white/55">
          <Icon className="h-3.5 w-3.5" />
        </div>
        {!last && <span className="mt-1 w-px flex-1 bg-white/[0.06]" />}
      </div>
      <div className="min-w-0 flex-1 pb-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[13px] text-white/85">{activity.summary}</p>
          <span
            title={formatDateTimeFr(activity.createdAt)}
            className="shrink-0 text-[10px] uppercase tracking-[0.14em] text-white/30"
          >
            {formatRelativeFr(activity.createdAt)}
          </span>
        </div>
        <p className="mt-0.5 text-[11px] text-white/35">
          {activity.actor === "system" ? "Système" : activity.actor}
          <span className="mx-1.5 text-white/15">·</span>
          <span className="font-mono">{activity.action}</span>
        </p>
      </div>
    </div>
  );
  return (
    <li>
      {href ? (
        <Link href={href} className="block rounded-lg transition-colors hover:bg-white/[0.02]">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </li>
  );
}
