"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorSwatchProps {
  code: string;
  name: string;
  hex: string;
  size?: "sm" | "md" | "lg";
  inCart?: boolean;
  onToggleCart?: () => void;
}

const sizeClasses = {
  sm: "h-20",
  md: "h-32",
  lg: "h-40",
} as const;

export function ColorSwatch({
  code,
  name,
  hex,
  size = "md",
  inCart,
  onToggleCart,
}: ColorSwatchProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(hex);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = hex;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
      className={cn(
        "relative w-full cursor-pointer overflow-hidden rounded-xl shadow-lg transition-shadow hover:shadow-xl group",
        sizeClasses[size]
      )}
      style={{ backgroundColor: hex }}
      role="button"
      tabIndex={0}
      aria-label={`${code} ${name} — cliquer pour copier ${hex}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Bottom gradient overlay for text legibility */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
        aria-hidden="true"
      />

      {/* Cart toggle button */}
      {onToggleCart && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCart();
          }}
          className={cn(
            "absolute top-1.5 right-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full transition-all",
            inCart
              ? "bg-brand-orange text-white scale-100"
              : "bg-white/80 text-brand-night/60 scale-0 group-hover:scale-100 hover:bg-white"
          )}
          aria-label={inCart ? `Retirer ${code} de la sélection` : `Ajouter ${code} à la sélection`}
        >
          {inCart ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
        </button>
      )}

      {/* Color info */}
      <div className="absolute inset-x-0 bottom-0 p-3">
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-white/90">
          {code}
        </p>
        <p className="text-sm font-semibold text-white">{name}</p>
      </div>

      {/* Copied toast */}
      {copied && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-night shadow-lg">
            Copié !
          </span>
        </div>
      )}
    </motion.div>
  );
}
