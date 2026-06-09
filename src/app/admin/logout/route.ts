import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getCookieName } from "@/lib/admin/auth";

/**
 * Clear the admin session cookie and bounce back to /admin/login.
 * POST uniquement (CSRF-safe) — un GET déclenchable par simple lien ou
 * image permettrait de déconnecter l'admin à son insu.
 */
async function handler(req: NextRequest) {
  const jar = await cookies();
  jar.set(getCookieName(), "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  return NextResponse.redirect(new URL("/admin/login", req.url));
}

export const POST = handler;
