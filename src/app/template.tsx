"use client";

/**
 * Page transition wrapper.
 *
 * Next.js 15 App Router unmounts + remounts `template.tsx` content on
 * every navigation (unlike `layout.tsx` which stays). That gives us a
 * free hook for run-on-mount animations without any key/AnimatePresence
 * dance.
 *
 * Pairs beautifully with the persistent narrative swarm living in the
 * root layout: content fades + slides while the WebGL canvas keeps
 * rendering underneath. The viewer sees a continuous cosmic backdrop
 * with HTML content materializing on top.
 */

import { m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) return <>{children}</>;

  return (
    <m.div
      initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}
