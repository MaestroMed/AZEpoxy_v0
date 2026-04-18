"use client";

/**
 * TextReveal — word-by-word blur+rise reveal for hero titles.
 *
 * Splits plain strings into spans, staggers their entrance
 * (opacity 0 + y 18 + blur 10 → 0) with ease-out cubic. React children
 * are also supported — any non-string node renders as-is, inheriting a
 * slightly delayed reveal to stay in sync.
 *
 * A thin wrapper over framer-motion's `m` so the bundle cost is zero
 * incremental when the provider is already mounted.
 *
 * Reduced-motion → renders plain static text.
 */

import { m, useReducedMotion } from "framer-motion";
import { Children, type ReactNode } from "react";

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger between words in ms. Default 55. */
  stagger?: number;
  /** Base delay in ms before the whole reveal starts. Default 0. */
  delay?: number;
}

const REVEAL_VARIANTS = {
  hidden: { opacity: 0, y: 18, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export function TextReveal({ children, className, stagger = 55, delay = 0 }: TextRevealProps) {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) {
    return <span className={className}>{children}</span>;
  }

  let wordCount = 0;

  // Flatten all children into pieces we can animate word-by-word.
  const nodes: ReactNode[] = [];
  Children.forEach(children, (child, childIndex) => {
    if (typeof child === "string") {
      const words = child.split(/(\s+)/);
      words.forEach((word, i) => {
        if (!word.trim()) {
          nodes.push(<span key={`ws-${childIndex}-${i}`}>{word}</span>);
          return;
        }
        const idx = wordCount++;
        nodes.push(
          <m.span
            key={`w-${childIndex}-${i}`}
            className="inline-block"
            variants={REVEAL_VARIANTS}
            initial="hidden"
            animate="visible"
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
              delay: delay / 1000 + (idx * stagger) / 1000,
            }}
            style={{ willChange: "transform, opacity, filter" }}
          >
            {word}
          </m.span>,
        );
      });
    } else {
      // Non-string child (like a styled span for the gradient) — wrap in
      // its own reveal so it stays synchronized with the last word.
      const idx = wordCount++;
      nodes.push(
        <m.span
          key={`n-${childIndex}`}
          className="inline-block"
          variants={REVEAL_VARIANTS}
          initial="hidden"
          animate="visible"
          transition={{
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
            delay: delay / 1000 + (idx * stagger) / 1000,
          }}
          style={{ willChange: "transform, opacity, filter" }}
        >
          {child}
        </m.span>,
      );
    }
  });

  return <span className={className}>{nodes}</span>;
}
