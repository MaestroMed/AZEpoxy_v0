import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  StickyNote,
  UserCog,
} from "lucide-react";
import {
  Card,
  PageHeader,
  SourceBadge,
  StatusBadge,
  statusLabel,
} from "@/components/admin/primitives";
import { getLeadById } from "@/lib/admin/queries";
import { formatDateTimeFr, formatRelativeFr } from "@/lib/admin/format";
import { StatusPicker } from "./status-picker";
import { NoteForm } from "./note-form";
import type { LeadEvent } from "@/lib/db";

interface LeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const result = await getLeadById(id);
  if (!result) notFound();
  const { lead, events } = result;

  return (
    <>
      <PageHeader
        eyebrow={
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white/45 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3 w-3" />
            Leads
          </Link>
        }
        title={lead.name}
        description={
          <span className="inline-flex items-center gap-2">
            <SourceBadge source={lead.source} />
            <span className="text-white/30">·</span>
            <span>Reçu le {formatDateTimeFr(lead.createdAt)}</span>
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/devis/nouveau?lead=${lead.id}`}
              className="
                inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-[#FF7A40] to-[#C84818] px-3.5 py-1.5
                text-[11px] font-semibold uppercase tracking-[0.12em] text-white
                shadow-[0_8px_24px_-12px_rgba(232,93,44,0.7)] transition-transform hover:-translate-y-px
              "
            >
              <FileText className="h-3 w-3" />
              Devis
            </Link>
            {lead.email && (
              <a
                href={`mailto:${lead.email}`}
                className="
                  inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5
                  text-[11px] font-semibold uppercase tracking-[0.12em] text-white/75
                  transition-colors hover:border-white/25 hover:text-white
                "
              >
                <Mail className="h-3 w-3" />
                Email
              </a>
            )}
            {lead.phone && (
              <a
                href={`tel:${lead.phone.replace(/\s/g, "")}`}
                className="
                  inline-flex items-center gap-1.5 rounded-full border border-[#E85D2C]/30 bg-[#E85D2C]/[0.08] px-3.5 py-1.5
                  text-[11px] font-semibold uppercase tracking-[0.12em] text-[#FFB780]
                  transition-colors hover:border-[#E85D2C]/55 hover:bg-[#E85D2C]/[0.15]
                "
              >
                <Phone className="h-3 w-3" />
                Appeler
              </a>
            )}
          </div>
        }
      />

      <div className="grid gap-6 px-8 py-7 lg:grid-cols-[1fr_320px]">
        {/* LEFT — content */}
        <div className="space-y-4 min-w-0">
          {/* Contact card */}
          <Card title="Identité et contact">
            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 px-5 py-4 sm:grid-cols-2">
              <Field label="Nom" value={lead.name} />
              <Field label="Email" value={lead.email ?? "—"} mono={Boolean(lead.email)} />
              <Field label="Téléphone" value={lead.phone ?? "—"} mono={Boolean(lead.phone)} />
              <Field label="Entreprise" value={lead.company ?? "—"} />
              <Field label="Type de projet" value={lead.projectType ?? "—"} />
              <Field
                label="Couleur RAL"
                value={lead.ralCode ? `RAL ${lead.ralCode}` : "—"}
                mono={Boolean(lead.ralCode)}
              />
            </dl>
          </Card>

          {/* Message card */}
          {lead.message && (
            <Card title="Message du visiteur" hint={`${lead.message.length} caractères`}>
              <div className="px-5 py-4">
                <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-white/85">
                  {lead.message}
                </p>
              </div>
            </Card>
          )}

          {/* Extra data */}
          {lead.extra && Object.keys(lead.extra).length > 0 && (
            <Card title="Données du formulaire">
              <div className="px-5 py-4">
                <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                  {Object.entries(lead.extra).map(([key, value]) => (
                    <Field
                      key={key}
                      label={key}
                      value={
                        typeof value === "string" ||
                        typeof value === "number" ||
                        typeof value === "boolean"
                          ? String(value)
                          : JSON.stringify(value)
                      }
                    />
                  ))}
                </dl>
              </div>
            </Card>
          )}

          {/* Timeline */}
          <Card title="Historique" hint={`${events.length} ${events.length === 1 ? "événement" : "événements"}`}>
            <ul className="px-5 py-4">
              {events.map((event, index) => (
                <TimelineRow
                  key={event.id}
                  event={event}
                  last={index === events.length - 1}
                />
              ))}
            </ul>
          </Card>
        </div>

        {/* RIGHT — actions */}
        <div className="space-y-4">
          {/* Current status */}
          <Card title="Statut actuel">
            <div className="flex items-center justify-between px-5 py-4">
              <StatusBadge status={lead.status} />
              <span className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                {statusLabel(lead.status)}
              </span>
            </div>
          </Card>

          {/* Status picker */}
          <Card>
            <div className="px-3 py-3">
              <div className="mb-2 flex items-center gap-2 px-2 pt-1">
                <UserCog className="h-3.5 w-3.5 text-white/40" />
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
                  Changer le statut
                </p>
              </div>
              <StatusPicker leadId={lead.id} current={lead.status} />
            </div>
          </Card>

          {/* Notes */}
          <Card>
            <div className="px-5 py-4">
              <div className="mb-3 flex items-center gap-2">
                <StickyNote className="h-3.5 w-3.5 text-white/40" />
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
                  Note interne
                </p>
              </div>
              <NoteForm leadId={lead.id} />
              {lead.notes && (
                <div className="mt-4 rounded-lg border border-white/[0.05] bg-black/30 px-3 py-2.5">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                    Dernière note
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-[12px] leading-relaxed text-white/75">
                    {lead.notes}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

/* ─── Helpers ─────────────────────────────────────────────────────── */

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
        {label}
      </dt>
      <dd
        className={`mt-1 break-words text-sm text-white/85 ${mono ? "font-mono text-[13px]" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}

function TimelineRow({ event, last }: { event: LeadEvent; last: boolean }) {
  const meta = describeEvent(event);
  return (
    <li className="relative flex gap-4 pb-5 last:pb-0">
      {!last && (
        <span
          aria-hidden
          className="absolute left-[6px] top-3 h-full w-px bg-white/[0.07]"
        />
      )}
      <span
        aria-hidden
        className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ring-4 ring-[#08080F] ${meta.dot}`}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[13px] font-semibold text-white">{meta.title}</p>
          <p className="shrink-0 text-[10px] uppercase tracking-[0.14em] text-white/30">
            {formatRelativeFr(event.createdAt)}
          </p>
        </div>
        {meta.body && (
          <p className="mt-1 whitespace-pre-wrap text-[12px] leading-relaxed text-white/55">
            {meta.body}
          </p>
        )}
        {event.actor && event.actor !== "system" && (
          <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/30">
            par {event.actor}
          </p>
        )}
      </div>
    </li>
  );
}

function describeEvent(event: LeadEvent): {
  title: string;
  body?: string;
  dot: string;
} {
  const payload = (event.payload ?? {}) as Record<string, unknown>;
  switch (event.type) {
    case "created":
      return {
        title: "Lead créé",
        body:
          typeof payload.source === "string"
            ? `Soumission via le formulaire "${payload.source}"`
            : undefined,
        dot: "bg-[#E85D2C]",
      };
    case "status_change":
    case "contacted":
      return {
        title:
          event.type === "contacted"
            ? "Marqué comme contacté"
            : `Statut → ${String(payload.to ?? "?")}`,
        body:
          typeof payload.from === "string" && typeof payload.to === "string"
            ? `${payload.from} → ${payload.to}`
            : undefined,
        dot:
          event.type === "contacted"
            ? "bg-blue-400"
            : "bg-amber-300",
      };
    case "note_added":
      return {
        title: "Note ajoutée",
        body:
          typeof payload.note === "string" ? payload.note : undefined,
        dot: "bg-white/55",
      };
    default:
      return { title: event.type, dot: "bg-white/30" };
  }
}
