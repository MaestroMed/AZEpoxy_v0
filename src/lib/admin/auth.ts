import "server-only";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

/**
 * Backoffice authentication primitives.
 *
 * Single-admin pattern: ADMIN_EMAIL + ADMIN_PASSWORD_HASH live in env
 * vars. Login compares the submitted password against the bcrypt hash;
 * on success we mint a JWT signed with ADMIN_JWT_SECRET and stash it
 * in an httpOnly cookie. Middleware verifies the cookie on every
 * /admin/* request.
 *
 * Generate ADMIN_PASSWORD_HASH with `npm run admin:hash`.
 */

const COOKIE_NAME = "az_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface AdminSession {
  email: string;
  /** Issued-at (seconds since epoch). */
  iat: number;
  /** Expiry (seconds since epoch). */
  exp: number;
}

function getJwtSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_JWT_SECRET is missing or too short (min 32 chars). Generate one with: openssl rand -base64 48",
    );
  }
  return new TextEncoder().encode(secret);
}

export function getCookieName(): string {
  return COOKIE_NAME;
}

export function getSessionDurationSeconds(): number {
  return SESSION_DURATION_SECONDS;
}

/** Compare a plaintext password against the configured ADMIN_PASSWORD_HASH. */
export async function verifyAdminPassword(
  email: string,
  password: string,
): Promise<boolean> {
  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedHash = process.env.ADMIN_PASSWORD_HASH;

  if (!expectedEmail || !expectedHash) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD_HASH must be set in env. Run `npm run admin:hash` to generate the hash.",
    );
  }

  // Constant-ish: always run bcrypt to avoid an email-existence timing
  // leak. We then check both email and hash result.
  const passwordOk = await bcrypt.compare(password, expectedHash);
  const emailOk = email.trim().toLowerCase() === expectedEmail.toLowerCase();
  return passwordOk && emailOk;
}

/** Hash a plaintext password (used by the admin:hash CLI script). */
export async function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, 12);
}

/** Sign a JWT session token. */
export async function signSession(email: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(now)
    .setExpirationTime(now + SESSION_DURATION_SECONDS)
    .setSubject(email)
    .sign(getJwtSecret());
}

/**
 * Verify a token and return the session payload. Returns null when the
 * token is missing, malformed, expired, or signed with the wrong secret.
 * Never throws on bad input.
 */
export async function verifySession(
  token: string | undefined,
): Promise<AdminSession | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
      algorithms: ["HS256"],
    });
    if (typeof payload.email !== "string") return null;
    if (typeof payload.iat !== "number" || typeof payload.exp !== "number") {
      return null;
    }
    return {
      email: payload.email,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}
