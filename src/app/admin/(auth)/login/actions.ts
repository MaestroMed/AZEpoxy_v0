"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  getCookieName,
  getSessionDurationSeconds,
  signSession,
  verifyAdminPassword,
} from "@/lib/admin/auth";
import { ratelimit } from "@/lib/ratelimit";

const LoginInput = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
  // Where to bounce the user back after login (defaults to /admin).
  from: z.string().optional(),
});

export type LoginState =
  | { ok: false; error: string }
  | { ok: true };

/**
 * Server action invoked by the login form. On success it sets a signed
 * session cookie and redirects to /admin (or back to the original
 * destination passed via `from`). On failure it returns a generic error
 * message — we never leak whether the email or the password was wrong.
 */
export async function loginAction(
  _prev: LoginState | null,
  formData: FormData,
): Promise<LoginState> {
  // Rate limiting par IP — 5 tentatives / 15 min. En cas de dépassement on
  // renvoie la même erreur générique qu'un mauvais mot de passe pour ne pas
  // révéler la présence du limiteur à un attaquant.
  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    hdrs.get("x-real-ip") ||
    "unknown";
  const limit = await ratelimit(ip, {
    prefix: "admin-login",
    limit: 5,
    window: "15 m",
  });
  if (!limit.success) {
    return { ok: false, error: "Identifiants incorrects." };
  }

  const parsed = LoginInput.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    from: formData.get("from") || undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Champs invalides",
    };
  }

  let valid: boolean;
  try {
    valid = await verifyAdminPassword(parsed.data.email, parsed.data.password);
  } catch (err) {
    console.error("[admin/login] auth check failed", err);
    return {
      ok: false,
      error:
        "L'authentification n'est pas encore configurée côté serveur. Voir README.",
    };
  }

  if (!valid) {
    // Generic message — never leak which field was wrong.
    return { ok: false, error: "Identifiants incorrects." };
  }

  const token = await signSession(parsed.data.email);
  const jar = await cookies();
  jar.set(getCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: getSessionDurationSeconds(),
  });

  // Validate `from` to prevent open-redirect.
  const from = parsed.data.from;
  const target =
    from && from.startsWith("/admin") && !from.startsWith("/admin/login")
      ? from
      : "/admin";

  redirect(target);
}
