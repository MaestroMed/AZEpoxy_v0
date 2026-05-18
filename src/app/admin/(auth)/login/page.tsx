import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Connexion",
};

interface LoginPageProps {
  searchParams: Promise<{ from?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { from } = await searchParams;

  return (
    <div className="w-full max-w-[420px]">
      {/* Mark + identity block — sits above the card */}
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-[16px] bg-[#0F0F1A] ring-1 ring-white/10" />
          <div
            aria-hidden
            className="absolute inset-0 rounded-[16px] az-mark-glow"
            style={{
              background:
                "radial-gradient(140% 100% at 95% 112%, rgba(232,93,44,0.62) 0%, rgba(200,72,24,0.24) 38%, transparent 72%)",
            }}
          />
          <svg
            className="relative h-full w-full"
            viewBox="0 0 44 44"
            fill="none"
            role="img"
            aria-label="AZ Époxy"
          >
            <defs>
              <linearGradient id="login-ember" x1="0" y1="0" x2="1" y2="1">
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
              stroke="url(#login-ember)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="mt-5 font-display text-2xl font-black tracking-tight text-white">
          Espace administrateur
        </p>
        <p className="mt-2 text-sm text-white/45">
          AZ Époxy · Gestion des leads et du contenu
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-7 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur-[2px]">
        <LoginForm from={from} />
      </div>

      <p className="mt-6 text-center text-[11px] uppercase tracking-[0.2em] text-white/30">
        Accès réservé · Connexion chiffrée
      </p>
    </div>
  );
}
