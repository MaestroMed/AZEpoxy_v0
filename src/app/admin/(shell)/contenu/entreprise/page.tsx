import { PageHeader } from "@/components/admin/primitives";
import { SettingsForm } from "@/components/admin/settings-form";
import { getSettings } from "@/lib/admin/content";
import { SITE } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function EntreprisePage() {
  const settings = await getSettings();

  // Pré-remplir depuis les constantes site si la DB est vide.
  const initial = {
    businessName: settings.businessName ?? SITE.name,
    phone: settings.phone ?? SITE.phone,
    email: settings.email ?? SITE.email,
    addressStreet: settings.addressStreet ?? SITE.address.street,
    addressZip: settings.addressZip ?? SITE.address.zip,
    addressCity: settings.addressCity ?? SITE.address.city,
    openingHours: settings.openingHours ?? "Lun-Ven 8h-18h",
    notifyOnLead: settings.notifyOnLead ?? false,
    notifyEmail: settings.notifyEmail ?? SITE.email,
  };

  return (
    <>
      <PageHeader
        eyebrow="Contenu"
        title="Profil entreprise"
        description="Coordonnées, horaires et préférences de notification."
      />
      <div className="px-8 py-7">
        <SettingsForm initial={initial} />
      </div>
    </>
  );
}
