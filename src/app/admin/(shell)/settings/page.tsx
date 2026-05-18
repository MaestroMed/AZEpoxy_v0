import { Card, PageHeader } from "@/components/admin/primitives";
import { getCurrentAdmin } from "@/lib/admin/session";
import { CheckCircle2, Database, Mail, Webhook, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await getCurrentAdmin();

  const integrations: {
    label: string;
    env: string;
    icon: typeof Database;
    description: string;
  }[] = [
    {
      label: "Base de données Postgres",
      env: "DATABASE_URL",
      icon: Database,
      description: "Stockage durable des leads et de l'historique.",
    },
    {
      label: "Resend (envoi d'emails)",
      env: "RESEND_API_KEY",
      icon: Mail,
      description: "Notifications de devis et accusés de réception.",
    },
    {
      label: "Webhook CRM",
      env: "LEAD_WEBHOOK_URL",
      icon: Webhook,
      description: "Optionnel — relais des leads vers Zapier / Make / Notion.",
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Paramètres"
        title="Configuration"
        description="État des intégrations branchées au backoffice."
      />

      <div className="space-y-6 px-8 py-7">
        <Card title="Session administrateur">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/35">
                Connecté en tant que
              </p>
              <p className="mt-1 font-mono text-sm text-white/85">
                {session?.email ?? "—"}
              </p>
            </div>
            <form action="/admin/logout" method="POST">
              <button
                type="submit"
                className="
                  rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5
                  text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70
                  transition-colors hover:border-white/30 hover:text-white
                "
              >
                Se déconnecter
              </button>
            </form>
          </div>
        </Card>

        <Card title="Intégrations">
          <ul className="divide-y divide-white/[0.04]">
            {integrations.map((it) => {
              const configured = Boolean(process.env[it.env]);
              return (
                <li
                  key={it.env}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <div
                    className={`
                      flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
                      ${
                        configured
                          ? "bg-emerald-500/[0.1] text-emerald-300"
                          : "bg-white/[0.04] text-white/30"
                      }
                    `}
                  >
                    <it.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white">
                      {it.label}
                    </p>
                    <p className="mt-0.5 text-[12px] text-white/45">
                      {it.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    {configured ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                        <span className="font-semibold uppercase tracking-[0.12em] text-emerald-300">
                          Actif
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3.5 w-3.5 text-white/30" />
                        <span className="font-semibold uppercase tracking-[0.12em] text-white/35">
                          Non configuré
                        </span>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card title="À propos">
          <div className="space-y-3 px-5 py-4 text-sm text-white/55">
            <p>
              Backoffice maison — auth par mot de passe (bcrypt + JWT
              cookie), DB Postgres via Neon, pipeline de leads
              fire-and-forget vers Postgres + webhook optionnel.
            </p>
            <p>
              Les soumissions des formulaires publics (devis, contact,
              guide, abandon) écrivent automatiquement ici, avec un
              événement <code>created</code> dans la timeline.
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}
