import "server-only";
import { cookies } from "next/headers";
import { getCookieName, verifySession, type AdminSession } from "./auth";

/**
 * Resolve the current admin session from the request cookies. Returns
 * null when the visitor is not authenticated. Safe to call from server
 * components and server actions.
 */
export async function getCurrentAdmin(): Promise<AdminSession | null> {
  const jar = await cookies();
  const token = jar.get(getCookieName())?.value;
  return verifySession(token);
}

/** Throw if not authenticated — for server-side guards. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getCurrentAdmin();
  if (!session) {
    throw new Error("UNAUTHENTICATED");
  }
  return session;
}
