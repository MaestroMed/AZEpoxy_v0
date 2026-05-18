import Link from "next/link";

/**
 * Auth-route layout — centered card on an ember-warmed dark canvas.
 * Used by /admin/login (and any future password-reset flow).
 */
export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-svh overflow-hidden">
      {/* Ambient ember glow — bottom-right corner, like a kiln in the
          background of an otherwise-dark workshop. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-32 h-[36rem] w-[36rem] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(232,93,44,0.22), rgba(232,93,44,0.07) 50%, transparent 80%)",
          filter: "blur(20px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-32 h-[28rem] w-[28rem] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(26,26,46,0.6), transparent 75%)",
          filter: "blur(40px)",
        }}
      />

      {/* Faint industrial grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Back-to-site link, top-left */}
      <div className="absolute left-6 top-6 z-10">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55 backdrop-blur-sm transition-colors hover:border-white/25 hover:text-white"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">
            ←
          </span>
          Retour au site
        </Link>
      </div>

      <main className="relative z-10 flex min-h-svh items-center justify-center px-6 py-16">
        {children}
      </main>
    </div>
  );
}
