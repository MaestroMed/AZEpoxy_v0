"use client";

/**
 * CommandPalette — ⌘K / Ctrl+K quick navigation.
 *
 * Signature award feature : press ⌘K anywhere on the site, a blurred
 * modal appears with a search input and a filtered list of destinations.
 * Arrow keys to navigate, Enter to go, Esc to close.
 *
 * Deliberately minimal : just navigation + a few contextual actions
 * (request devis, call, etc.). Not a super-app — just a power-user shortcut.
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
} from "lucide-react";

type CommandKind = "nav" | "action";

interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  keywords: string[];
  kind: CommandKind;
  icon: React.ReactNode;
  href?: string;
  action?: () => void;
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
        setOpen((v) => !v);
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
    if (!q) return COMMANDS;
    return COMMANDS.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.keywords.some((k) => k.includes(q)),
    );
  }, [query]);

  // Keep active index in range.
  useEffect(() => {
    if (activeIdx >= filtered.length) setActiveIdx(Math.max(0, filtered.length - 1));
  }, [filtered.length, activeIdx]);

  const execute = (cmd: CommandItem) => {
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
                placeholder="Chercher une page ou une action..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIdx(0);
                }}
                onKeyDown={onKeyDown}
                className="flex-1 border-0 bg-transparent p-0 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-0"
                aria-label="Chercher"
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
                      <span
                        className={
                          "flex h-8 w-8 items-center justify-center rounded-lg " +
                          (active ? "bg-brand-orange text-white" : "bg-white/5 text-white/60")
                        }
                      >
                        {cmd.icon}
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-medium">{cmd.label}</span>
                        {cmd.hint && (
                          <span className="mt-0.5 block text-[11px] text-white/50">
                            {cmd.hint}
                          </span>
                        )}
                      </span>
                      {active && (
                        <kbd className="rounded border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/60">
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
