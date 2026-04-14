"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GalleryItem {
  title: string;
  category?: string;
  colors?: string[];
}

interface GalleryGridProps {
  items: GalleryItem[];
  columns?: 2 | 3 | 4;
}

const placeholderColors = [
  "#3D3D3D",
  "#2D2D2D",
  "#4A4A4A",
  "#1A1A2E",
  "#5C3D2E",
  "#2E3D5C",
  "#3D5C2E",
  "#5C2E4A",
  "#4A5C2E",
  "#2E4A5C",
  "#5C4A2E",
  "#2E5C4A",
];

export function GalleryGrid({ items, columns = 3 }: GalleryGridProps) {
  return (
    <div
      className={cn(
        "grid gap-6",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      )}
    >
      {items.map((item, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
          style={{
            backgroundColor:
              placeholderColors[i % placeholderColors.length],
          }}
        >
          {/* Hover overlay */}
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {item.category && (
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">
                {item.category}
              </p>
            )}
            <p className="heading-display text-lg text-white">
              {item.title}
            </p>
          </div>

          {/* Always-visible title overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-5">
            <p className="text-sm font-semibold text-white">{item.title}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
