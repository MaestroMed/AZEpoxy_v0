"use client";

import { useEffect, useState } from "react";

/**
 * Fond du hero d'accueil.
 *
 * Stratégie LCP/perf :
 *   • Le poster (50KB, préchargé en haute priorité) est rendu en `<img>` —
 *     il devient l'élément LCP, peint dès le FCP sur TOUS les appareils.
 *   • La vidéo cinématique (~1.7MB) n'est chargée QUE sur desktop non-tactile.
 *     Sur mobile/tablette elle est superflue (data + décodage main-thread) et
 *     dégradait le LCP en devenant elle-même l'élément le plus grand.
 *
 * Le poster doit pointer EXACTEMENT vers l'URL préchargée dans page.tsx
 * (`/images/hero/hero-poster.webp`) — donc `<img>` brut, pas next/image
 * (qui réécrit l'URL en /_next/image et raterait le preload).
 */
export function HeroBackground() {
  const [allowVideo, setAllowVideo] = useState(false);

  useEffect(() => {
    const fine =
      matchMedia("(pointer: fine)").matches &&
      matchMedia("(min-width: 768px)").matches &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches;
    setAllowVideo(fine);
  }, []);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hero/hero-poster.webp"
        alt=""
        aria-hidden="true"
        // @ts-expect-error fetchPriority est valide en HTML, types React en retard
        fetchpriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {allowVideo && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
      )}
    </>
  );
}
