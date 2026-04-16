"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics/events";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    if (openIndex !== index) {
      track("faq_expand", { question: items[index].question.substring(0, 50) });
    }
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="divide-y divide-brand-night/10">
      {items.map((item, i) => (
        <div key={i} className="py-6">
          <button
            onClick={() => toggle(i)}
            className="flex w-full items-center justify-between gap-4 text-left"
            aria-expanded={openIndex === i}
          >
            <span className="heading-display text-lg text-brand-night">
              {item.question}
            </span>
            <ChevronDown
              className={cn(
                "h-5 w-5 flex-shrink-0 text-brand-charcoal/50 transition-transform duration-300",
                openIndex === i && "rotate-180"
              )}
            />
          </button>

          <AnimatePresence initial={false}>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="pt-4 text-brand-charcoal/70 leading-relaxed">
                  {item.answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
