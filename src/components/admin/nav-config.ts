import {
  LayoutDashboard,
  Users,
  KanbanSquare,
  LineChart,
  FileText,
  Image as ImageIcon,
  Star,
  Building,
  Radar,
  Activity,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  badgeKey?: "leads";
}

export interface AdminNavGroup {
  title: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    title: "Pilotage",
    items: [
      { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
      { href: "/admin/analytics", label: "Analytics", icon: LineChart },
    ],
  },
  {
    title: "CRM",
    items: [
      { href: "/admin/leads", label: "Leads", icon: Users, badgeKey: "leads" },
      { href: "/admin/leads?view=kanban", label: "Pipeline", icon: KanbanSquare },
      { href: "/admin/devis", label: "Devis", icon: FileText },
    ],
  },
  {
    title: "Contenu",
    items: [
      { href: "/admin/contenu/realisations", label: "Réalisations", icon: ImageIcon },
      { href: "/admin/contenu/avis", label: "Avis clients", icon: Star },
      { href: "/admin/contenu/entreprise", label: "Entreprise", icon: Building },
    ],
  },
  {
    title: "Système",
    items: [
      { href: "/admin/seo", label: "Santé SEO", icon: Radar },
      { href: "/admin/activite", label: "Activité", icon: Activity },
      { href: "/admin/settings", label: "Paramètres", icon: Settings },
    ],
  },
];

export function isNavActive(pathname: string, href: string, exact?: boolean): boolean {
  const base = href.split("?")[0];
  return exact ? pathname === base : pathname === base || pathname.startsWith(`${base}/`);
}
