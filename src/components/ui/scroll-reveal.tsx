"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
  once?: boolean;
}

const directionOffsets = {
  up: { x: 0, y: 30 },
  down: { x: 0, y: -30 },
  left: { x: -30, y: 0 },
  right: { x: 30, y: 0 },
} as const;

export function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  className,
  once = true,
}: ScrollRevealProps) {
  const offset = directionOffsets[direction];

  return (
    <motion.div
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "-80px", amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
