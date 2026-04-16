"use client";

import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";
import * as React from "react";

/**
 * Wraps the tree in framer-motion's LazyMotion + domAnimation feature pack so
 * the heavy m.motion components only ship the DOM-animation features (~5 KB)
 * instead of the full 30 KB bundle. Also installs a MotionConfig that respects
 * the user's reduced-motion preference globally.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
