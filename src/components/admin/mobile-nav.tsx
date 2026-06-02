"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { ADMIN_NAV, isNavActive } from "@/components/admin/nav-config";

export function AdminMobileNav({
  adminEmail,
  leadCount,
}: {
  adminEmail: string;
  leadCount?: number;
}) {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);

  // Ferme le drawer à chaque navigation.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Topbar — mobile/tablet only */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/[0.06] bg-[#0B0B14]/95 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Mark />
          <span className="font-display text-sm font-black uppercase tracking-[0.04em] text-white">
            AZ Époxy
          </span>
          <span className="rounded-full border border-[#E85D2C]/30 bg-[#E85D2C]/[0.08] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#FFB780]">
            Admin
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Fermer"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <nav className="absolute right-0 top-0 flex h-full w-[280px] flex-col bg-[#0B0B14] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
              <span className="font-display text-sm font-black uppercase tracking-[0.04em] text-white">
                Navigation
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer le menu"
                className="rounded-lg p-1.5 text-white/60 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4">
              {ADMIN_NAV.map((group) => (
                <div key={group.title} className="mb-4">
                  <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
                    {group.title}
                  </p>
                  <ul className="flex flex-col gap-0.5">
                    {group.items.map((item) => {
                      const active = isNavActive(pathname, item.href, item.exact);
                      const badge =
                        item.badgeKey === "leads" ? leadCount : undefined;
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                              active
                                ? "bg-white/[0.06] text-white"
                                : "text-white/60 hover:bg-white/[0.03] hover:text-white"
                            }`}
                          >
                            <item.icon
                              className={`h-[17px] w-[17px] ${active ? "text-[#FF9A5C]" : "text-white/40"}`}
                            />
                            <span className="flex-1 font-medium">{item.label}</span>
                            {typeof badge === "number" && badge > 0 && (
                              <span className="inline-flex h-[18px] min-w-[20px] items-center justify-center rounded-full bg-[#E85D2C] px-1.5 text-[10px] font-bold text-white">
                                {badge}
                              </span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <div className="border-t border-white/[0.06] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#FF7A40] to-[#C84818] text-[11px] font-bold text-white">
                  {adminEmail.slice(0, 1).toUpperCase()}
                </div>
                <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-white">
                  {adminEmail}
                </span>
                <form action="/admin/logout" method="POST">
                  <button
                    type="submit"
                    aria-label="Se déconnecter"
                    className="rounded-md p-2 text-white/40 hover:text-white"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

function Mark() {
  return (
    <div className="relative h-8 w-8 shrink-0">
      <div className="absolute inset-0 rounded-[9px] bg-[#0F0F1A] ring-1 ring-white/10" />
      <svg className="relative h-full w-full" viewBox="0 0 44 44" fill="none" aria-hidden>
        <defs>
          <linearGradient id="mnav-ember" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF9A5C" />
            <stop offset="55%" stopColor="#E85D2C" />
            <stop offset="100%" stopColor="#8B2E0A" />
          </linearGradient>
        </defs>
        <path d="M 7 33 L 15 9 L 23 33 M 10 26 L 20 26" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 25 11 L 37 11 L 25 31 L 37 31" stroke="url(#mnav-ember)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
