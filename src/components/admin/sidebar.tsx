"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Radar,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";

interface SidebarProps {
  adminEmail: string;
  leadCount?: number;
}

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  exact?: boolean;
}

export function Sidebar({ adminEmail, leadCount }: SidebarProps) {
  const pathname = usePathname() ?? "";

  const items: NavItem[] = [
    {
      href: "/admin",
      label: "Tableau de bord",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/admin/leads",
      label: "Leads",
      icon: Users,
      badge: leadCount,
    },
    {
      href: "/admin/seo",
      label: "Santé SEO",
      icon: Radar,
    },
    {
      href: "/admin/settings",
      label: "Paramètres",
      icon: Settings,
    },
  ];

  return (
    <aside
      className="
        sticky top-0 z-30 hidden h-svh w-[248px] shrink-0 flex-col
        border-r border-white/[0.05] bg-[#0B0B14]
        lg:flex
      "
    >
      {/* Brand block */}
      <Link
        href="/admin"
        className="group flex items-center gap-3 border-b border-white/[0.05] px-5 py-5"
      >
        <div className="relative h-9 w-9 shrink-0">
          <div className="absolute inset-0 rounded-[10px] bg-[#0F0F1A] ring-1 ring-white/10" />
          <div
            aria-hidden
            className="absolute inset-0 rounded-[10px] az-mark-glow"
            style={{
              background:
                "radial-gradient(140% 100% at 95% 112%, rgba(232,93,44,0.6) 0%, rgba(200,72,24,0.22) 38%, transparent 72%)",
            }}
          />
          <svg
            className="relative h-full w-full"
            viewBox="0 0 44 44"
            fill="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="sidebar-ember" x1="0" y1="0" x2="1" y2="1">
                <stop className="az-mark-stop-1" offset="0%" stopColor="#FF9A5C" />
                <stop className="az-mark-stop-2" offset="55%" stopColor="#E85D2C" />
                <stop offset="100%" stopColor="#8B2E0A" />
              </linearGradient>
            </defs>
            <path
              d="M 7 33 L 15 9 L 23 33 M 10 26 L 20 26"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 25 11 L 37 11 L 25 31 L 37 31"
              stroke="url(#sidebar-ember)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-display text-[15px] font-black uppercase tracking-[0.04em] text-white">
            AZ Époxy
          </span>
          <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-full border border-[#E85D2C]/30 bg-[#E85D2C]/[0.08] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#FFB780]">
            Admin
          </span>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
          Navigation
        </p>
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`
                    group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200
                    ${
                      active
                        ? "bg-white/[0.05] text-white"
                        : "text-white/55 hover:bg-white/[0.03] hover:text-white/90"
                    }
                  `}
                >
                  {active && (
                    <span
                      aria-hidden
                      className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-[#FF9A5C] to-[#E85D2C]"
                    />
                  )}
                  <item.icon
                    className={`h-[16px] w-[16px] shrink-0 transition-colors ${
                      active
                        ? "text-[#FF9A5C]"
                        : "text-white/40 group-hover:text-white/70"
                    }`}
                  />
                  <span className="flex-1 font-medium">{item.label}</span>
                  {typeof item.badge === "number" && item.badge > 0 && (
                    <span
                      className={`
                        inline-flex h-[18px] min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold tabular-nums
                        ${
                          active
                            ? "bg-[#E85D2C] text-white"
                            : "bg-white/10 text-white/70 group-hover:bg-white/15"
                        }
                      `}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User block */}
      <div className="border-t border-white/[0.05] p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF7A40] to-[#C84818] text-[11px] font-bold text-white">
            {adminEmail.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-semibold text-white">
              {adminEmail}
            </p>
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">
              Connecté
            </p>
          </div>
          <form action="/admin/logout" method="POST">
            <button
              type="submit"
              aria-label="Se déconnecter"
              className="
                inline-flex h-8 w-8 items-center justify-center rounded-md
                text-white/40 transition-colors hover:bg-white/[0.05] hover:text-white
              "
            >
              <LogOut className="h-[14px] w-[14px]" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
