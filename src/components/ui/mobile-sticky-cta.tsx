"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MessageCircle, Phone, FileText } from "lucide-react";
import { cn, SITE } from "@/lib/utils";
import { track } from "@/lib/analytics/events";

/**
 * Sticky CTA bar rendered only on mobile. Three one-tap actions:
 *   - Call the atelier
 *   - Open WhatsApp
 *   - Jump to the devis wizard
 *
 * Hidden on the devis page itself (the wizard IS the CTA there) and on the
 * Studio route. Fades in after a short scroll to avoid hiding the hero.
 */
export function MobileStickyCta() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 280);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hidden =
    pathname?.startsWith("/devis") ||
    pathname?.startsWith("/studio") ||
    pathname?.startsWith("/rendez-vous");

  if (hidden) return null;

  const whatsappUrl = `https://wa.me/${SITE.phoneHref.replace(/\D/g, "")}`;

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex items-stretch gap-px border-t border-white/10 bg-brand-night/95 backdrop-blur-xl shadow-[0_-12px_32px_rgba(0,0,0,0.3)] transition-[transform,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden",
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-full pointer-events-none opacity-0"
      )}
    >
      {/* Accent gradient line top */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-orange/60 to-transparent"
      />
      <CtaAction
        href={SITE.phoneHref}
        icon={<Phone className="h-4 w-4" />}
        label="Appeler"
        onClick={() =>
          track("cta_click", {
            placement: "sticky_mobile",
            target: SITE.phoneHref,
            label: "Appeler",
          })
        }
      />
      <CtaAction
        href={whatsappUrl}
        icon={<MessageCircle className="h-4 w-4" />}
        label="WhatsApp"
        external
        onClick={() =>
          track("cta_click", {
            placement: "sticky_mobile",
            target: whatsappUrl,
            label: "WhatsApp",
          })
        }
      />
      <Link
        href="/devis"
        onClick={() =>
          track("cta_click", {
            placement: "sticky_mobile",
            target: "/devis",
            label: "Devis",
          })
        }
        className="group/devis relative flex flex-1 items-center justify-center gap-2 overflow-hidden bg-brand-orange px-3 py-3.5 text-sm font-semibold text-white active:bg-brand-orange-dark"
      >
        {/* Sheen */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-br from-transparent via-white/18 to-transparent transition-transform duration-700 group-hover/devis:translate-x-full group-active/devis:translate-x-full"
        />
        <FileText className="relative h-4 w-4" />
        <span className="relative">Devis gratuit</span>
      </Link>
    </div>
  );
}

interface CtaActionProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  external?: boolean;
  onClick?: () => void;
}

function CtaAction({ href, icon, label, external, onClick }: CtaActionProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="group relative flex flex-1 items-center justify-center gap-2 bg-white/[0.03] px-3 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/[0.08] active:bg-white/[0.12]"
    >
      <span className="transition-transform duration-300 group-active:scale-90">
        {icon}
      </span>
      <span>{label}</span>
    </a>
  );
}
