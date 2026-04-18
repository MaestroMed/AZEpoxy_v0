"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics/events";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * FAQ accordion, award-tier.
 *
 * • Numérotation discrète (01, 02, …) à gauche — architectural.
 * • Plus icon qui rotate en X (45°) au lieu d'un chevron standard.
 * • Background-color lerp au hover (très subtle) + border accent.
 * • Expand smooth avec ease-out-expo, contenu fade-up inside.
 * • Item actif : border-l-2 brand-orange + label plus lisible.
 */
export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    if (openIndex !== index) {
      track("faq_expand", { question: items[index].question.substring(0, 50) });
    }
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item, i) => {
        const open = openIndex === i;
        const num = String(i + 1).padStart(2, "0");
        return (
          <li
            key={i}
            className={cn(
              "group relative overflow-hidden rounded-xl border transition-all duration-500",
              open
                ? "border-brand-orange/40 bg-white shadow-[0_8px_30px_-20px_rgba(232,93,44,0.35)]"
                : "border-brand-night/10 bg-white/60 hover:border-brand-night/25 hover:bg-white"
            )}
          >
            <button
              onClick={() => toggle(i)}
              className="flex w-full items-start gap-5 p-6 text-left"
              aria-expanded={open}
              aria-controls={`faq-panel-${i}`}
            >
              <span
                className={cn(
                  "mt-1.5 shrink-0 font-mono text-xs font-semibold tabular-nums tracking-wider transition-colors",
                  open ? "text-brand-orange" : "text-brand-charcoal/40"
                )}
                aria-hidden
              >
                {num}
              </span>
              <span
                className={cn(
                  "flex-1 heading-display text-lg leading-snug transition-colors",
                  open ? "text-brand-night" : "text-brand-night/85 group-hover:text-brand-night"
                )}
              >
                {item.question}
              </span>
              <span
                className={cn(
                  "mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                  open
                    ? "border-brand-orange bg-brand-orange text-white rotate-45"
                    : "border-brand-night/15 text-brand-charcoal/60 group-hover:border-brand-night/30"
                )}
                aria-hidden
              >
                <Plus className="h-4 w-4" />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <m.div
                  key="content"
                  id={`faq-panel-${i}`}
                  role="region"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.4, ease: EASE_OUT_EXPO },
                    opacity: { duration: 0.25, delay: open ? 0.1 : 0 },
                  }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 pl-[4.25rem]">
                    <m.p
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.35, ease: EASE_OUT_EXPO, delay: 0.08 }}
                      className="text-brand-charcoal/75 leading-relaxed"
                    >
                      {item.answer}
                    </m.p>
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
