"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  m,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CollectionFinish } from "@/lib/collections-data";

interface CollectionHeroMosaicProps {
  name: string;
  subtitle: string;
  description: string;
  tags: string[];
  finishes: CollectionFinish[];       // toutes (pour compter)
  accentColor: string;                 // ex "#A0522D"
  bgGradient: string;                  // tailwind: "from-... via-... to-..."
  catalogueUrl: string;
  primaryHref?: string;
  primaryLabel?: string;
}

// ── Split finishes into 3 columns of up to 8 tiles each ────────────────
function splitColumns(finishes: CollectionFinish[]) {
  const withImage = finishes.filter((f) => f.imageUrl);
  const cols: CollectionFinish[][] = [[], [], []];
  withImage.forEach((f, i) => cols[i % 3].push(f));
  return cols.map((col) => {
    // Duplicate for seamless marquee loop; cap at 8 unique items
    const unique = col.slice(0, 8);
    return unique.length ? [...unique, ...unique] : unique;
  });
}

// ── Column marquee (CSS keyframes, GPU-accelerated) ────────────────────
function MosaicColumn({
  finishes,
  durationSec,
  direction,
  parallaxY,
  paused,
}: {
  finishes: CollectionFinish[];
  durationSec: number;
  direction: "up" | "down";
  parallaxY: ReturnType<typeof useTransform<number, number>>;
  paused: boolean;
}) {
  const prefersReduced = useReducedMotion();

  if (!finishes.length) return <div className="flex-1" aria-hidden />;

  const animationName =
    prefersReduced ? "none" : direction === "up" ? "marquee-up" : "marquee-down";

  return (
    <m.div
      className="relative flex-1 overflow-hidden"
      style={{ y: parallaxY, willChange: "transform" }}
    >
      <div
        className="flex flex-col gap-3 will-change-transform"
        style={{
          animationName,
          animationDuration: `${durationSec}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {finishes.map((f, i) => (
          <div
            key={`${f.id}-${i}`}
            className="relative aspect-square w-full overflow-hidden rounded-xl"
          >
            {f.imageUrl && (
              <Image
                src={f.imageUrl}
                alt=""
                fill
                sizes="(min-width: 1024px) 280px, 33vw"
                quality={55}
                loading="lazy"
                className="object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </m.div>
  );
}

// ── Live cycling featured tile (top-right) ──────────────────────────────
function LiveFeaturedTile({
  finishes,
  paused,
  accentColor,
}: {
  finishes: CollectionFinish[];
  paused: boolean;
  accentColor: string;
}) {
  const cycle = useMemo(
    () => finishes.filter((f) => f.imageUrl).slice(0, 10),
    [finishes],
  );
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (paused || cycle.length === 0) return;
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % cycle.length);
    }, 4000);
    return () => clearInterval(t);
  }, [paused, cycle.length]);

  if (!cycle.length) return null;
  const current = cycle[idx];

  return (
    <div className="pointer-events-none absolute top-6 right-6 z-20 hidden w-[260px] lg:block">
      <div
        className="relative h-[320px] w-full overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-2xl backdrop-blur-sm"
        style={{ willChange: "transform" }}
      >
        <AnimatePresence mode="wait">
          <m.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {current.imageUrl && (
              <Image
                src={current.imageUrl}
                alt={current.name}
                fill
                sizes="260px"
                quality={70}
                className="object-cover"
                priority={idx === 0}
              />
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 pt-10">
              <div
                className="mb-2 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/80"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
                Now showing
              </div>
              <div className="truncate text-sm font-semibold text-white">
                {current.name}
              </div>
            </div>
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────
export function CollectionHeroMosaic({
  name,
  subtitle,
  description,
  tags,
  finishes,
  accentColor,
  bgGradient,
  catalogueUrl,
  primaryHref = "/devis",
  primaryLabel = "Demander un devis",
}: CollectionHeroMosaicProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);
  const prefersReduced = useReducedMotion();

  // Pause marquees + featured-tile cycling when scrolled out of view (CPU saver).
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? false),
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Mouse position (normalised 0..1), throttled with rAF.
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 80, damping: 20 });
  const sy = useSpring(my, { stiffness: 80, damping: 20 });
  const rafRef = useRef<number | null>(null);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReduced) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const cx = e.clientX;
      const cy = e.clientY;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        mx.set((cx - rect.left) / rect.width);
        my.set((cy - rect.top) / rect.height);
      });
    },
    [mx, my, prefersReduced],
  );

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Spotlight transforms — use transform, not background-position.
  const [size, setSize] = useState({ w: 1, h: 1 });
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () =>
      setSize({ w: el.offsetWidth || 1, h: el.offsetHeight || 1 });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const spotX = useTransform(sx, (v) => v * size.w - size.w * 0.4);
  const spotY = useTransform(sy, (v) => v * size.h - size.h * 0.4);

  // Parallax for columns — subtle -12px..+12px.
  const parY1 = useTransform(sy, [0, 1], [-12, 12]);
  const parY2 = useTransform(sy, [0, 1], [12, -12]);
  const parY3 = useTransform(sy, [0, 1], [-8, 8]);

  const cols = useMemo(() => splitColumns(finishes), [finishes]);
  const paused = !inView;
  const totalWithImage = finishes.filter((f) => f.imageUrl).length;

  // Word-by-word heading reveal
  const words = name.split(" ");

  return (
    <section
      ref={containerRef}
      onMouseMove={onMove}
      className={cn(
        "relative isolate overflow-hidden text-white",
        "min-h-[85vh] lg:min-h-[88vh]",
      )}
    >
      {/* ── Base gradient ─────────────────────────────────────────── */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br",
          bgGradient,
        )}
      />

      {/* ── Mosaic (3 columns) ────────────────────────────────────── */}
      <div className="absolute inset-0 flex gap-3 p-3 opacity-55 mix-blend-screen sm:opacity-65">
        <MosaicColumn
          finishes={cols[0]}
          durationSec={28}
          direction="up"
          parallaxY={parY1}
          paused={paused}
        />
        <MosaicColumn
          finishes={cols[1]}
          durationSec={36}
          direction="down"
          parallaxY={parY2}
          paused={paused}
        />
        <MosaicColumn
          finishes={cols[2]}
          durationSec={32}
          direction="up"
          parallaxY={parY3}
          paused={paused}
        />
      </div>

      {/* ── Spotlight (conic radial gradient following cursor) ────── */}
      {!prefersReduced && (
        <m.div
          aria-hidden
          className="pointer-events-none absolute z-[1] h-[80%] w-[80%] rounded-full blur-3xl"
          style={{
            x: spotX,
            y: spotY,
            background: `radial-gradient(circle, ${accentColor}66 0%, ${accentColor}22 40%, transparent 70%)`,
            willChange: "transform",
          }}
        />
      )}

      {/* ── Vignette + readability gradient ───────────────────────── */}
      <div className="pointer-events-none absolute inset-0 z-[2] shadow-[inset_0_0_200px_40px_rgba(0,0,0,0.7)]" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-black/85 via-black/50 to-black/20" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-noise opacity-20 mix-blend-overlay" />

      {/* ── Live featured tile ───────────────────────────────────── */}
      <LiveFeaturedTile
        finishes={finishes}
        paused={paused}
        accentColor={accentColor}
      />

      {/* ── Ghost number (bottom-left decoration) ────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 z-[3] translate-y-[8%] translate-x-[-2%] select-none font-display text-[20rem] font-bold leading-none text-white/[0.04]"
      >
        {totalWithImage}
      </div>

      {/* ── Content ──────────────────────────────────────────────── */}
      <div className="container-wide relative z-10 flex min-h-[85vh] flex-col justify-center py-24 lg:min-h-[88vh] lg:pt-32">
        <div className="max-w-3xl">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            <span>{subtitle}</span>
            <span className="text-white/40">•</span>
            <span>{finishes.length} finitions</span>
          </div>

          <h1 className="heading-display text-balance text-5xl leading-[0.95] sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
            {words.map((word, i) => (
              <m.span
                key={`${word}-${i}`}
                className={cn(
                  "mr-[0.25em] inline-block",
                  i === words.length - 1 && "bg-clip-text text-transparent",
                )}
                style={
                  i === words.length - 1
                    ? {
                        backgroundImage: `linear-gradient(135deg, ${accentColor} 0%, #fff 100%)`,
                      }
                    : undefined
                }
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {word}
              </m.span>
            ))}
          </h1>

          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-6 max-w-2xl text-balance text-lg text-white/75 sm:text-xl"
          >
            {description}
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-6 flex flex-wrap gap-2"
          >
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/70 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.8 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Link
              href={primaryHref}
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-night transition-all hover:bg-white/90"
            >
              {primaryLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href={catalogueUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/[0.08]"
            >
              Catalogue Adaptacolor
              <ExternalLink className="h-4 w-4" />
            </a>
          </m.div>
        </div>
      </div>
    </section>
  );
}
