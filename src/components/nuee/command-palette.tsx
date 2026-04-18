"use client";

/**
 * CommandPalette — ⌘K / Ctrl+K RAL-first search + quick nav.
 *
 * The palette is positioned primarily as a RAL search. Typing a number
 * (\"3020\"), a name (\"rouge\", \"anthracite\"), or a hex (\"#E85D2C\") shows
 * the matching RAL swatches inline with their editorial quote. Enter
 * opens the RAL's detail page (/couleurs-ral/teinte/[code]) with the
 * color pièce, realisations list, and \"devis in this RAL\" CTA.
 *
 * Nav commands (devis, rendez-vous, contact...) are kept as a secondary
 * set, shown first when the input is empty and as fallback when a
 * query has no RAL match. This way the palette is always useful —
 * either finding a color or jumping across the site.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import {
  Calendar,
  FileText,
  Home,
  Palette,
  Phone,
  Sparkles,
  Layers,
  Search,
  Image as ImageIcon,
  Volume2,
  ArrowUp,
  Zap,
} from "lucide-react";
import { getSwarm } from "@/lib/nuee/store";
import { getSoundEngine } from "@/lib/nuee/sound";
import { track } from "@/lib/analytics/events";
import { RAL_COLORS, type RALColor } from "@/lib/ral-colors";
import { getRalEditorial } from "@/lib/ral-editorial";

type CommandKind = "nav" | "action" | "ral";

interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  keywords: string[];
  kind: CommandKind;
  icon: React.ReactNode;
  href?: string;
  action?: () => void;
  /** RAL-specific fields (kind === "ral") */
  ral?: RALColor;
  ralQuote?: string;
}

/**
 * Match RAL colors against the query. Supports :
 *   · numeric code  ("3020", "9005")
 *   · full code     ("ral 3020", "RAL 9005")
 *   · name          ("rouge", "anthracite", "noir foncé")
 *   · hex           ("#e85d2c", "e85d2c")
 *
 * Returns up to `limit` best matches, with curated RALs boosted to
 * the top so the editorial layer surfaces first when relevant.
 */
function searchRal(query: string, limit = 8): RALColor[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  // Hex match — prefix "#" optional, must be 3/6 hex chars
  const hexMatch = q.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/);
  if (hexMatch) {
    const hex = `#${hexMatch[1]}`.toLowerCase();
    const exact = RAL_COLORS.filter((c) => c.hex.toLowerCase() === hex);
    if (exact.length) return exact.slice(0, limit);
  }

  // Numeric-only : match codes containing the digits
  const numMatch = q.match(/^\s*(?:ral\s*)?(\d{3,5})\s*$/i);
  if (numMatch) {
    const digits = numMatch[1];
    const prefix = RAL_COLORS.filter((c) =>
      c.code.replace(/^RAL\s*/i, "").startsWith(digits),
    );
    if (prefix.length) return prefix.slice(0, limit);
    const contains = RAL_COLORS.filter((c) =>
      c.code.replace(/^RAL\s*/i, "").includes(digits),
    );
    return contains.slice(0, limit);
  }

  // Text : name + family match. Curated RALs float to the top.
  const matches = RAL_COLORS.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.family.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q),
  );
  matches.sort((a, b) => {
    const ca = getRalEditorial(a.code) ? 1 : 0;
    const cb = getRalEditorial(b.code) ? 1 : 0;
    return cb - ca;
  });
  return matches.slice(0, limit);
}

/** Convert RAL code → URL slug ("RAL 3020" → "3020"). */
function ralToSlug(code: string): string {
  return code.replace(/^RAL\s*/i, "").trim();
}

const COMMANDS: CommandItem[] = [
  {
    id: "home",
    label: "Accueil",
    kind: "nav",
    href: "/",
    icon: <Home className="h-4 w-4" />,
    keywords: ["home", "accueil", "start"],
  },
  {
    id: "devis",
    label: "Demander un devis",
    hint: "Réponse sous 24h",
    kind: "nav",
    href: "/devis",
    icon: <FileText className="h-4 w-4" />,
    keywords: ["devis", "quote", "estimation", "prix"],
  },
  {
    id: "rendez-vous",
    label: "Prendre rendez-vous",
    hint: "Calendrier en ligne",
    kind: "nav",
    href: "/rendez-vous",
    icon: <Calendar className="h-4 w-4" />,
    keywords: ["rdv", "meeting", "appointment", "booking", "cal"],
  },
  {
    id: "couleurs",
    label: "Nuancier RAL",
    hint: "213 teintes + 4 collections",
    kind: "nav",
    href: "/couleurs-ral",
    icon: <Palette className="h-4 w-4" />,
    keywords: ["ral", "couleurs", "nuancier", "palette", "adapta"],
  },
  {
    id: "realisations",
    label: "Nos réalisations",
    kind: "nav",
    href: "/realisations",
    icon: <ImageIcon className="h-4 w-4" />,
    keywords: ["portfolio", "realisations", "projets", "work"],
  },
  {
    id: "services",
    label: "Nos services",
    kind: "nav",
    href: "/services",
    icon: <Layers className="h-4 w-4" />,
    keywords: ["services", "thermolaquage", "sablage", "finitions"],
  },
  {
    id: "specialites",
    label: "Spécialités",
    hint: "Jantes, moto, portails…",
    kind: "nav",
    href: "/specialites",
    icon: <Sparkles className="h-4 w-4" />,
    keywords: ["specialites", "specialities", "niches"],
  },
  {
    id: "contact",
    label: "Nous contacter",
    kind: "nav",
    href: "/contact",
    icon: <Phone className="h-4 w-4" />,
    keywords: ["contact", "telephone", "mail"],
  },
  // ── Actions contextuelles (kind: "action") ──────────────────────
  {
    id: "toggle-sound",
    label: "Activer / couper le son ambiant",
    hint: "Son procédural, cycle de phases",
    kind: "action",
    icon: <Volume2 className="h-4 w-4" />,
    keywords: ["son", "sound", "audio", "musique", "ambiance"],
    action: () => {
      const engine = getSoundEngine();
      if (engine.enabled) engine.disable();
      else engine.enable();
      try {
        window.localStorage.setItem(
          "az-swarm-sound",
          engine.enabled ? "on" : "off",
        );
      } catch {
        /* localStorage unavailable */
      }
    },
  },
  {
    id: "scroll-top",
    label: "Revenir en haut de page",
    kind: "action",
    icon: <ArrowUp className="h-4 w-4" />,
    keywords: ["haut", "top", "scroll", "remonter"],
    action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
  },
  {
    id: "burst",
    label: "Déclencher un burst de la nuée",
    hint: "Explosion radiale puis reforme",
    kind: "action",
    icon: <Zap className="h-4 w-4" />,
    keywords: ["burst", "explosion", "fun", "easter", "boom"],
    action: () => {
      getSwarm().triggerBurst(1200);
      getSoundEngine().whoosh(0.7);
    },
  },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Global shortcut (⌘K / Ctrl+K).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => {
          if (!v) track("command_palette_open", {});
          return !v;
        });
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // ── A11y — focus trap + return focus + inert siblings ──────────────
  //
  // Ouverture : on mémorise l'élément focusé AVANT d'ouvrir, on focus le
  // champ recherche, et on applique `inert` aux siblings pour les
  // retirer du tab order.
  // Fermeture : on retire inert, et on rend le focus à l'élément
  // d'origine — pattern a11y attendu pour les modales.
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return;

    // Mémorise le focus courant (sauf si c'est déjà dans la palette).
    lastFocusedRef.current = document.activeElement as HTMLElement | null;

    setQuery("");
    setActiveIdx(0);
    requestAnimationFrame(() => inputRef.current?.focus());

    // Marque les siblings body du panel en inert.
    const bodyKids = Array.from(document.body.children) as HTMLElement[];
    const inerted: HTMLElement[] = [];
    for (const kid of bodyKids) {
      if (kid.dataset.palettePanel === "true" || kid.tagName === "SCRIPT") continue;
      if (!kid.hasAttribute("inert")) {
        kid.setAttribute("inert", "");
        inerted.push(kid);
      }
    }

    return () => {
      inerted.forEach((el) => el.removeAttribute("inert"));
      // Redonne le focus — petit délai pour laisser React finir l'unmount.
      requestAnimationFrame(() => lastFocusedRef.current?.focus());
    };
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    // Empty query → just nav commands.
    if (!q) return COMMANDS;

    // RAL-first : if we get RAL matches, they take the top slots.
    const rals = searchRal(q, 8);
    const ralItems: CommandItem[] = rals.map((c) => ({
      id: `ral-${c.code}`,
      label: c.code,
      hint: c.name,
      keywords: [c.code, c.name, c.family],
      kind: "ral",
      icon: <Palette className="h-4 w-4" />,
      href: `/couleurs-ral/teinte/${ralToSlug(c.code)}`,
      ral: c,
      ralQuote: getRalEditorial(c.code),
    }));

    // Nav commands that still match the text — small subset.
    const navMatches = COMMANDS.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.keywords.some((k) => k.includes(q)),
    );

    return [...ralItems, ...navMatches];
  }, [query]);

  // Keep active index in range.
  useEffect(() => {
    if (activeIdx >= filtered.length) setActiveIdx(Math.max(0, filtered.length - 1));
  }, [filtered.length, activeIdx]);

  const execute = (cmd: CommandItem) => {
    track("command_palette_execute", { command_id: cmd.id, kind: cmd.kind });
    setOpen(false);
    if (cmd.href) router.push(cmd.href);
    cmd.action?.();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[activeIdx];
      if (cmd) execute(cmd);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <m.div
          className="fixed inset-0 z-[120] flex items-start justify-center px-4 pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Fermer la palette de commandes"
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <m.div
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-brand-night/95 shadow-2xl backdrop-blur-xl"
            initial={{ y: -12, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -8, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="Palette de commandes"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <Search className="h-4 w-4 text-white/50" aria-hidden />
              <input
                ref={inputRef}
                type="text"
                placeholder="RAL 3020, rouge, #E85D2C..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIdx(0);
                }}
                onKeyDown={onKeyDown}
                className="flex-1 border-0 bg-transparent p-0 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-0"
                aria-label="Rechercher un RAL ou une page"
              />
              <kbd className="hidden rounded border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/50 sm:inline">
                Esc
              </kbd>
            </div>

            {/* Results */}
            <ul className="max-h-[50vh] overflow-auto py-2" role="listbox">
              {filtered.length === 0 && (
                <li className="px-5 py-8 text-center text-sm text-white/50">
                  Rien ne correspond à « {query} »
                </li>
              )}
              {filtered.map((cmd, i) => {
                const active = i === activeIdx;
                const isRal = cmd.kind === "ral";
                const ralColor = cmd.ral;
                return (
                  <li key={cmd.id} role="option" aria-selected={active}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIdx(i)}
                      onClick={() => execute(cmd)}
                      className={
                        "flex w-full items-center gap-3 px-5 py-3 text-left transition-colors " +
                        (active
                          ? "bg-brand-orange/15 text-white"
                          : "text-white/75 hover:bg-white/[0.04]")
                      }
                    >
                      {/* Icon slot — for RAL rows, show the actual color swatch */}
                      {isRal && ralColor ? (
                        <span
                          aria-hidden
                          className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg ring-1 ring-white/15 transition-transform duration-300 group-hover:scale-105"
                          style={{ backgroundColor: ralColor.hex }}
                        >
                          {cmd.ralQuote && (
                            <span
                              aria-hidden
                              className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-brand-orange ring-2 ring-brand-night"
                              title="Teinte curatée"
                            />
                          )}
                        </span>
                      ) : (
                        <span
                          className={
                            "flex h-8 w-8 items-center justify-center rounded-lg " +
                            (active
                              ? "bg-brand-orange text-white"
                              : "bg-white/5 text-white/60")
                          }
                        >
                          {cmd.icon}
                        </span>
                      )}

                      <span className="flex-1 min-w-0">
                        <span className="flex items-center gap-2">
                          <span
                            className={`block text-sm font-medium ${
                              isRal ? "font-mono font-bold tracking-wider" : ""
                            }`}
                          >
                            {cmd.label}
                          </span>
                          {isRal && ralColor && (
                            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                              {ralColor.hex.toUpperCase()}
                            </span>
                          )}
                        </span>
                        {cmd.hint && (
                          <span className="mt-0.5 block truncate text-[11px] text-white/55">
                            {cmd.hint}
                          </span>
                        )}
                        {isRal && cmd.ralQuote && active && (
                          <span className="mt-1 block max-w-sm truncate text-[11px] italic text-brand-orange/80">
                            &ldquo;{cmd.ralQuote}&rdquo;
                          </span>
                        )}
                      </span>
                      {active && (
                        <kbd className="shrink-0 rounded border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/60">
                          ↵
                        </kbd>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Footer hint */}
            <div className="flex items-center gap-4 border-t border-white/10 px-5 py-2.5 text-[11px] text-white/40">
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[10px]">↑↓</kbd>
                Naviguer
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[10px]">↵</kbd>
                Aller
              </span>
              <span className="ml-auto flex items-center gap-1.5">
                <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
                Ouvrir
              </span>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
