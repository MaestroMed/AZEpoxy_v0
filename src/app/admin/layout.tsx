import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Espace administrateur — AZ Époxy",
    template: "%s · Admin AZ Époxy",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

/**
 * Root admin layout. Forces an isolated dark surface so the admin never
 * inherits public-site theming. The public-site chrome (header / footer /
 * easter eggs) is suppressed at the root layout level via PublicChrome.
 */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh bg-[#08080F] text-white/90 antialiased">
      {children}
    </div>
  );
}
