"use client";

import { useCallback, useState, useEffect, useRef, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Check, CircleDot, Bike, DoorOpen, Armchair, Factory, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { POPULAR_RAL, RAL_COLORS } from "@/lib/ral-colors";
import { PhotoUpload } from "@/components/ui/photo-upload";
import { TurnstileWidget } from "@/components/ui/turnstile";
import { trackEvent } from "@/components/analytics/ga4";
import {
  clearDevisDraft,
  loadDevisDraft,
  reportAbandonedDevis,
  saveDevisDraft,
} from "@/lib/devis-storage";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const inputClass =
  "w-full rounded-xl border border-brand-night/15 bg-white px-4 py-3 text-brand-night placeholder:text-brand-charcoal/40 focus:outline-none focus:ring-2 focus:ring-brand-orange transition-shadow";
const labelClass = "mb-1.5 block text-sm font-semibold text-brand-night";

const PROJECT_TYPES = [
  { slug: "jantes", label: "Jantes", Icon: CircleDot },
  { slug: "moto", label: "Moto", Icon: Bike },
  { slug: "portail", label: "Portail", Icon: DoorOpen },
  { slug: "mobilier", label: "Mobilier", Icon: Armchair },
  { slug: "industriel", label: "Industriel", Icon: Factory },
  { slug: "autre", label: "Autre", Icon: Package },
];

const FINITIONS = ["Mat", "Satiné", "Brillant", "Texturé", "Effet spécial"];

const STEPS = ["Type", "Détails", "Couleur", "Contact"];

type Status = "idle" | "loading" | "success" | "error";

interface FormData {
  projectType: string;
  // Jantes
  nbJantes: string;
  tailleJantes: string;
  etatJantes: string;
  // Moto
  typePieceMoto: string;
  marqueMoto: string;
  // Portail
  largeur: string;
  hauteur: string;
  typePortail: string;
  materiauPortail: string;
  // Generic
  description: string;
  dimensions: string;
  // Color
  selectedRal: string;
  finition: string;
  // Contact
  name: string;
  email: string;
  phone: string;
  address: string;
  source: string;
  consent: boolean;
}

const initialFormData: FormData = {
  projectType: "", nbJantes: "4", tailleJantes: "18-20", etatJantes: "renovation",
  typePieceMoto: "", marqueMoto: "", largeur: "", hauteur: "", typePortail: "coulissant",
  materiauPortail: "acier", description: "", dimensions: "", selectedRal: "",
  finition: "Satiné", name: "", email: "", phone: "", address: "", source: "", consent: false,
};

export function DevisWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(initialFormData);
  const [photos, setPhotos] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [direction, setDirection] = useState(1);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);
  const submittedRef = useRef(false);
  const searchParams = useSearchParams();

  const handleTurnstile = useCallback((token: string | null) => {
    setTurnstileToken(token);
  }, []);

  // Restore an autosaved draft on mount.
  useEffect(() => {
    const draft = loadDevisDraft();
    if (draft) {
      setData((prev) => ({ ...prev, ...(draft.data as Partial<FormData>) }));
      setStep(Math.min(Math.max(draft.step, 1), 4));
      setDraftRestored(true);
    }
  }, []);

  // Pre-fill RAL + project type from query params (e.g., /devis?ral=RAL 9005&type=jantes)
  useEffect(() => {
    const ralParam = searchParams.get("ral");
    const typeParam = searchParams.get("type");
    setData((d) => {
      const next = { ...d };
      if (ralParam && !d.selectedRal) {
        const codes = ralParam.split(",").filter((c) =>
          RAL_COLORS.some((r) => r.code === c)
        );
        if (codes.length > 0) next.selectedRal = codes.join(", ");
      }
      if (typeParam && !d.projectType) {
        next.projectType = typeParam;
      }
      return next;
    });
  }, [searchParams]);

  // Autosave draft whenever step or data changes.
  useEffect(() => {
    if (submittedRef.current) return;
    saveDevisDraft(step, {
      ...data,
      // Strip personal fields we don't want on disk for long.
      photos: undefined,
    });
  }, [step, data]);

  // Fire abandon beacon when the user leaves the tab past step 1 without submitting.
  useEffect(() => {
    const handler = () => {
      if (submittedRef.current) return;
      if (document.visibilityState !== "hidden") return;
      const draft = loadDevisDraft();
      if (draft) reportAbandonedDevis(draft);
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  const set = (field: keyof FormData, value: string | boolean) =>
    setData((d) => ({ ...d, [field]: value }));

  const next = () => { setDirection(1); setStep((s) => Math.min(s + 1, 4)); };
  const prev = () => { setDirection(-1); setStep((s) => Math.max(s - 1, 1)); };

  const selectType = (slug: string) => {
    set("projectType", slug);
    next();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!data.consent) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const fd = new FormData();
      fd.append("name", data.name);
      fd.append("email", data.email);
      fd.append("phone", data.phone);
      fd.append("service", data.projectType);
      fd.append("piece", data.projectType === "jantes"
        ? `${data.nbJantes} jantes ${data.tailleJantes} pouces (${data.etatJantes})`
        : data.projectType === "moto"
        ? `${data.typePieceMoto} — ${data.marqueMoto}`
        : data.projectType === "portail"
        ? `Portail ${data.typePortail} ${data.materiauPortail} ${data.largeur}×${data.hauteur}`
        : data.description);
      fd.append("dimensions", data.dimensions || `${data.largeur}×${data.hauteur}`);
      fd.append("ral", data.selectedRal || "Non défini");
      const msg = `Finition: ${data.finition}\nSource: ${data.source || "Non renseigné"}\nAdresse: ${data.address || "Non renseignée"}`;
      fd.append("message", msg);
      for (const photo of photos) fd.append("photos", photo);
      if (turnstileToken) fd.set("turnstileToken", turnstileToken);
      const res = await fetch("/api/devis", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      trackEvent("form_submit", { variant: "wizard" });
      submittedRef.current = true;
      clearDevisDraft();
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erreur. Appelez-nous au 09 71 35 74 96.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-brand-success/30 bg-brand-success/10 p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-success/20">
          <Check className="h-8 w-8 text-brand-success" />
        </div>
        <p className="heading-display text-2xl text-brand-night">Demande envoyée !</p>
        <p className="mt-3 text-brand-charcoal/70 max-w-md mx-auto">
          Nous avons bien reçu votre demande de devis. Notre équipe vous recontactera sous 24h avec un chiffrage personnalisé.
        </p>
      </div>
    );
  }

  const selectedRalColor = POPULAR_RAL.find((c) => c.code === data.selectedRal);

  const resetDraft = () => {
    clearDevisDraft();
    setData(initialFormData);
    setStep(1);
    setDraftRestored(false);
  };

  return (
    <div className="rounded-2xl border border-brand-night/10 bg-white shadow-sm overflow-hidden">
      {draftRestored && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-night/10 bg-brand-cream px-5 py-3 text-sm">
          <span className="text-brand-charcoal/80">
            Nous avons restauré votre demande en cours.
          </span>
          <button
            type="button"
            onClick={resetDraft}
            className="font-semibold text-brand-orange hover:underline"
          >
            Recommencer à zéro
          </button>
        </div>
      )}

      {/* Progress bar */}
      <div className="flex border-b border-brand-night/10">
        {STEPS.map((label, i) => (
          <button
            key={label}
            onClick={() => { if (i + 1 < step) { setDirection(-1); setStep(i + 1); } }}
            className={cn(
              "flex-1 py-4 text-center text-sm font-semibold transition-colors",
              i + 1 === step ? "bg-brand-orange text-white" :
              i + 1 < step ? "bg-brand-orange/10 text-brand-orange cursor-pointer" :
              "bg-brand-cream/50 text-brand-charcoal/40"
            )}
          >
            <span className="hidden sm:inline">{i + 1}. </span>{label}
          </button>
        ))}
      </div>

      <div className="p-6 sm:p-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ x: direction * 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction * -50, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {/* Step 1 — Type */}
            {step === 1 && (
              <div>
                <h3 className="heading-display text-xl text-brand-night mb-2">Quel est votre projet ?</h3>
                <p className="text-sm text-brand-charcoal/60 mb-6">Sélectionnez le type de pièce à traiter.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PROJECT_TYPES.map(({ slug, label, Icon }) => (
                    <button
                      key={slug}
                      type="button"
                      onClick={() => selectType(slug)}
                      className={cn(
                        "rounded-xl border p-5 text-center transition-all hover:border-brand-orange hover:shadow-md",
                        data.projectType === slug ? "border-brand-orange bg-brand-orange/5" : "border-brand-night/10 bg-white"
                      )}
                    >
                      <Icon className="mx-auto h-8 w-8 text-brand-orange mb-2" />
                      <span className="text-sm font-semibold text-brand-night">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 — Details */}
            {step === 2 && (
              <div className="space-y-5">
                <h3 className="heading-display text-xl text-brand-night mb-2">Détails du projet</h3>

                {data.projectType === "jantes" && (
                  <>
                    <div>
                      <label className={labelClass}>Nombre de jantes</label>
                      <select value={data.nbJantes} onChange={(e) => set("nbJantes", e.target.value)} className={cn(inputClass, "appearance-none")}>
                        {["1", "2", "3", "4", "5+"].map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Taille</label>
                      <select value={data.tailleJantes} onChange={(e) => set("tailleJantes", e.target.value)} className={cn(inputClass, "appearance-none")}>
                        <option value="15-17">15-17 pouces</option>
                        <option value="18-20">18-20 pouces</option>
                        <option value="21-22">21-22 pouces</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>État actuel</label>
                      <select value={data.etatJantes} onChange={(e) => set("etatJantes", e.target.value)} className={cn(inputClass, "appearance-none")}>
                        <option value="neuves">Neuves (première application)</option>
                        <option value="renovation">Rénovation (décapage nécessaire)</option>
                      </select>
                    </div>
                  </>
                )}

                {data.projectType === "moto" && (
                  <>
                    <div>
                      <label className={labelClass}>Type de pièce</label>
                      <select value={data.typePieceMoto} onChange={(e) => set("typePieceMoto", e.target.value)} className={cn(inputClass, "appearance-none")} defaultValue="">
                        <option value="" disabled>Sélectionner</option>
                        <option value="cadre">Cadre</option>
                        <option value="jantes">Jantes moto</option>
                        <option value="bras-oscillant">Bras oscillant</option>
                        <option value="reservoir">Réservoir</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Marque / Modèle</label>
                      <input value={data.marqueMoto} onChange={(e) => set("marqueMoto", e.target.value)} placeholder="Ex : Yamaha MT-07" className={inputClass} />
                    </div>
                  </>
                )}

                {data.projectType === "portail" && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Largeur (m)</label>
                        <input value={data.largeur} onChange={(e) => set("largeur", e.target.value)} placeholder="Ex : 3.5" type="number" step="0.1" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Hauteur (m)</label>
                        <input value={data.hauteur} onChange={(e) => set("hauteur", e.target.value)} placeholder="Ex : 1.8" type="number" step="0.1" className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Type</label>
                      <select value={data.typePortail} onChange={(e) => set("typePortail", e.target.value)} className={cn(inputClass, "appearance-none")}>
                        <option value="coulissant">Coulissant</option>
                        <option value="battant">Battant</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Matériau</label>
                      <select value={data.materiauPortail} onChange={(e) => set("materiauPortail", e.target.value)} className={cn(inputClass, "appearance-none")}>
                        <option value="acier">Acier</option>
                        <option value="aluminium">Aluminium</option>
                        <option value="fer-forge">Fer forgé</option>
                      </select>
                    </div>
                  </>
                )}

                {(data.projectType === "mobilier" || data.projectType === "industriel" || data.projectType === "autre") && (
                  <>
                    <div>
                      <label className={labelClass}>Description de la pièce</label>
                      <textarea value={data.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Décrivez votre pièce (type, matériau, état...)" className={cn(inputClass, "resize-y")} />
                    </div>
                    <div>
                      <label className={labelClass}>Dimensions approximatives</label>
                      <input value={data.dimensions} onChange={(e) => set("dimensions", e.target.value)} placeholder="Ex : 200 x 100 x 50 cm" className={inputClass} />
                    </div>
                  </>
                )}

                <div>
                  <label className={labelClass}>Photos <span className="font-normal text-brand-charcoal/50">(optionnel)</span></label>
                  <PhotoUpload files={photos} onChange={setPhotos} />
                </div>

                <div className="flex justify-between pt-4">
                  <button type="button" onClick={prev} className="inline-flex items-center gap-2 rounded-full border border-brand-night/15 px-6 py-3 text-sm font-semibold text-brand-night hover:bg-brand-cream">
                    <ArrowLeft className="h-4 w-4" /> Retour
                  </button>
                  <button type="button" onClick={next} className="btn-primary">
                    Continuer <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 — Color */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="heading-display text-xl text-brand-night mb-2">Choisissez votre couleur</h3>
                <div>
                  <label className={labelClass}>Couleur RAL</label>
                  <div className="grid grid-cols-7 gap-2">
                    {POPULAR_RAL.slice(0, 14).map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        title={`${c.code} — ${c.name}`}
                        onClick={() => set("selectedRal", c.code)}
                        className={cn(
                          "aspect-square rounded-lg border-2 transition-all hover:scale-110",
                          data.selectedRal === c.code ? "border-brand-orange ring-2 ring-brand-orange/30 scale-110" : "border-transparent"
                        )}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                  {selectedRalColor && (
                    <p className="mt-2 text-sm text-brand-charcoal/70">
                      Sélectionné : <strong>{selectedRalColor.code}</strong> — {selectedRalColor.name}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => set("selectedRal", "")} className="text-sm text-brand-charcoal/50 hover:text-brand-orange">
                      Je ne sais pas encore
                    </button>
                    <span className="text-brand-charcoal/30">·</span>
                    <a href="/couleurs-ral" target="_blank" className="text-sm text-brand-orange hover:underline">
                      Voir les 200+ couleurs →
                    </a>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Finition</label>
                  <div className="flex flex-wrap gap-2">
                    {FINITIONS.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => set("finition", f)}
                        className={cn(
                          "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                          data.finition === f ? "border-brand-orange bg-brand-orange text-white" : "border-brand-night/15 bg-white text-brand-night hover:border-brand-orange"
                        )}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <button type="button" onClick={prev} className="inline-flex items-center gap-2 rounded-full border border-brand-night/15 px-6 py-3 text-sm font-semibold text-brand-night hover:bg-brand-cream">
                    <ArrowLeft className="h-4 w-4" /> Retour
                  </button>
                  <button type="button" onClick={next} className="btn-primary">
                    Continuer <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4 — Contact + Recap */}
            {step === 4 && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="heading-display text-xl text-brand-night mb-2">Vos coordonnées</h3>

                {/* Honeypot */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                <div>
                  <label className={labelClass}>Nom complet *</label>
                  <input value={data.name} onChange={(e) => set("name", e.target.value)} required placeholder="Jean Dupont" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input value={data.email} onChange={(e) => set("email", e.target.value)} type="email" required placeholder="jean@exemple.fr" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Téléphone</label>
                  <input value={data.phone} onChange={(e) => set("phone", e.target.value)} type="tel" placeholder="06 12 34 56 78" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Adresse <span className="font-normal text-brand-charcoal/50">(optionnel)</span></label>
                  <input value={data.address} onChange={(e) => set("address", e.target.value)} placeholder="Pour estimer la livraison" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Comment nous avez-vous trouvé ? <span className="font-normal text-brand-charcoal/50">(optionnel)</span></label>
                  <select value={data.source} onChange={(e) => set("source", e.target.value)} className={cn(inputClass, "appearance-none")}>
                    <option value="">— Sélectionner —</option>
                    <option value="google">Google</option>
                    <option value="bouche-a-oreille">Bouche-à-oreille</option>
                    <option value="reseaux-sociaux">Réseaux sociaux</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                {/* Recap */}
                <div className="rounded-xl bg-brand-cream p-5 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange mb-3">Récapitulatif</p>
                  <p className="text-sm"><span className="text-brand-charcoal/50">Type :</span> <strong>{PROJECT_TYPES.find((t) => t.slug === data.projectType)?.label || data.projectType}</strong></p>
                  {data.selectedRal && <p className="text-sm"><span className="text-brand-charcoal/50">Couleur :</span> <strong>{data.selectedRal}</strong></p>}
                  <p className="text-sm"><span className="text-brand-charcoal/50">Finition :</span> <strong>{data.finition}</strong></p>
                  {photos.length > 0 && <p className="text-sm"><span className="text-brand-charcoal/50">Photos :</span> <strong>{photos.length} fichier(s)</strong></p>}
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.consent}
                    onChange={(e) => set("consent", e.target.checked)}
                    required
                    className="mt-1 h-4 w-4 rounded border-brand-night/30 text-brand-orange focus:ring-brand-orange"
                  />
                  <span className="text-sm text-brand-charcoal/70">
                    J&apos;accepte d&apos;être recontacté par AZ Époxy concernant ma demande de devis.
                  </span>
                </label>

                <TurnstileWidget
                  siteKey={TURNSTILE_SITE_KEY}
                  onToken={handleTurnstile}
                />

                {status === "error" && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorMsg}</div>
                )}

                <div className="flex justify-between pt-4">
                  <button type="button" onClick={prev} className="inline-flex items-center gap-2 rounded-full border border-brand-night/15 px-6 py-3 text-sm font-semibold text-brand-night hover:bg-brand-cream">
                    <ArrowLeft className="h-4 w-4" /> Retour
                  </button>
                  <button type="submit" disabled={status === "loading"} className={cn("btn-primary", status === "loading" && "pointer-events-none opacity-70")}>
                    {status === "loading" ? <><Loader2 className="h-4 w-4 animate-spin" /> Envoi...</> : "Envoyer ma demande"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
