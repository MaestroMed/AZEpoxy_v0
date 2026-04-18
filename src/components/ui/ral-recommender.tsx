"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { RAL_COLORS, type RALColor, type RALFamily } from "@/lib/ral-colors";
import { cn } from "@/lib/utils";

type ProjectUse = "jantes" | "portail" | "mobilier" | "interieur" | "industriel";
type Mood = "sobre" | "vif" | "chaud" | "clair";

interface AnswerState {
  use: ProjectUse | null;
  mood: Mood | null;
}

const USES: { key: ProjectUse; label: string }[] = [
  { key: "jantes", label: "Jantes auto/moto" },
  { key: "portail", label: "Portail / clôture" },
  { key: "mobilier", label: "Mobilier" },
  { key: "interieur", label: "Intérieur / déco" },
  { key: "industriel", label: "Industriel" },
];

const MOODS: { key: Mood; label: string }[] = [
  { key: "sobre", label: "Sobre et élégant" },
  { key: "vif", label: "Vif et coloré" },
  { key: "chaud", label: "Chaud et naturel" },
  { key: "clair", label: "Clair et lumineux" },
];

const USE_FAMILIES: Record<ProjectUse, RALFamily[]> = {
  jantes: ["noir", "gris", "blanc"],
  portail: ["gris", "noir", "vert", "brun"],
  mobilier: ["blanc", "gris", "noir", "brun"],
  interieur: ["blanc", "gris", "bleu", "vert"],
  industriel: ["gris", "bleu", "noir", "vert"],
};

const MOOD_FAMILIES: Record<Mood, RALFamily[]> = {
  sobre: ["noir", "gris", "blanc", "brun"],
  vif: ["rouge", "orange", "jaune", "bleu", "vert"],
  chaud: ["orange", "rouge", "brun", "jaune"],
  clair: ["blanc", "gris", "bleu", "jaune"],
};

function scoreColor(color: RALColor, answers: AnswerState): number {
  let score = color.popular ? 2 : 0;
  if (answers.use && USE_FAMILIES[answers.use].includes(color.family)) score += 3;
  if (answers.mood && MOOD_FAMILIES[answers.mood].includes(color.family)) score += 3;
  return score;
}

/**
 * Two-question heuristic RAL recommender. Picks the six highest-scoring
 * codes based on project type + visual mood. An LLM upgrade is a drop-in
 * future enhancement — the UI contract stays the same.
 */
export function RalRecommender() {
  const [answers, setAnswers] = useState<AnswerState>({ use: null, mood: null });

  const suggestions = useMemo(() => {
    if (!answers.use && !answers.mood) {
      return RAL_COLORS.filter((c) => c.popular).slice(0, 6);
    }
    return [...RAL_COLORS]
      .map((c) => ({ color: c, score: scoreColor(c, answers) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((c) => c.color);
  }, [answers]);

  const selectedCodes = suggestions.map((c) => c.code).join(",");

  return (
    <div className="rounded-3xl border border-brand-night/10 bg-white p-8 shadow-sm sm:p-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <span className="section-label">
            <Sparkles className="h-3 w-3" />
            Recommandation
          </span>
          <h3 className="heading-display mt-4 text-2xl text-brand-night sm:text-3xl">
            Quelle teinte pour votre projet&nbsp;?
          </h3>
          <p className="mt-2 text-brand-charcoal/70">
            Deux questions, six propositions RAL taillées pour vous.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <QuestionGroup
          label="Type de projet"
          options={USES}
          active={answers.use}
          onChange={(use) => setAnswers((a) => ({ ...a, use }))}
        />
        <QuestionGroup
          label="Ambiance recherchée"
          options={MOODS}
          active={answers.mood}
          onChange={(mood) => setAnswers((a) => ({ ...a, mood }))}
        />
      </div>

      <div className="mt-10">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">
          Six suggestions
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {suggestions.map((color, i) => (
            <Link
              key={color.code}
              href={`/devis?ral=${encodeURIComponent(color.code)}`}
              data-magnetic
              className="group relative overflow-hidden rounded-xl border border-brand-night/10 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/40 hover:shadow-[0_10px_28px_-14px_rgba(232,93,44,0.4)]"
              style={{
                animation: `stat-pop 420ms cubic-bezier(0.22,1,0.36,1) ${i * 60}ms both`,
              }}
            >
              {/* Sheen sur le swatch color au hover */}
              <div
                className="relative h-16 w-full overflow-hidden rounded-md"
                style={{ backgroundColor: color.hex }}
                aria-hidden="true"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-br from-transparent via-white/30 to-transparent mix-blend-overlay transition-transform duration-700 group-hover:translate-x-full" />
              </div>
              <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/50">
                {color.code}
              </p>
              <p className="text-sm font-semibold text-brand-night leading-tight line-clamp-2 transition-colors group-hover:text-brand-orange">
                {color.name}
              </p>
            </Link>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/devis?ral=${encodeURIComponent(selectedCodes)}`}
            className="btn-primary"
          >
            Demander un devis avec ces couleurs
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/couleurs-ral" className="btn-secondary">
            Voir le nuancier complet
          </Link>
        </div>
      </div>
    </div>
  );
}

interface QuestionGroupProps<T extends string> {
  label: string;
  options: { key: T; label: string }[];
  active: T | null;
  onChange: (value: T) => void;
}

function QuestionGroup<T extends string>({
  label,
  options,
  active,
  onChange,
}: QuestionGroupProps<T>) {
  return (
    <fieldset>
      <legend className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-charcoal/70">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => onChange(o.key)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300",
              active === o.key
                ? "border-brand-orange bg-brand-orange text-white shadow-[0_4px_14px_-6px_rgba(232,93,44,0.5)] ring-1 ring-brand-orange/40 ring-offset-2 ring-offset-white"
                : "border-brand-night/15 bg-white text-brand-charcoal/70 hover:-translate-y-0.5 hover:border-brand-night/40 hover:shadow-sm"
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
