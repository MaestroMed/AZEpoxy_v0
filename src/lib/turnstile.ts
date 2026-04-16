/**
 * Cloudflare Turnstile — anti-bot verification.
 *
 * When TURNSTILE_SECRET_KEY is not set we skip verification and return true
 * so local dev and fresh deploys keep working. Production MUST configure
 * the secret and the corresponding NEXT_PUBLIC_TURNSTILE_SITE_KEY on the
 * client widget.
 */

export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;

const VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export interface TurnstileVerifyResult {
  success: boolean;
  /** `skipped` when no secret is configured; the caller decides whether to log or reject. */
  skipped?: boolean;
  errorCodes?: string[];
}

export async function verifyTurnstile(
  token: string | null | undefined,
  remoteIp?: string
): Promise<TurnstileVerifyResult> {
  if (!TURNSTILE_SECRET) {
    return { success: true, skipped: true };
  }
  if (!token) {
    return { success: false, errorCodes: ["missing-input-response"] };
  }

  try {
    const body = new URLSearchParams();
    body.append("secret", TURNSTILE_SECRET);
    body.append("response", token);
    if (remoteIp) body.append("remoteip", remoteIp);

    const res = await fetch(VERIFY_URL, { method: "POST", body });
    const data = (await res.json()) as {
      success: boolean;
      "error-codes"?: string[];
    };
    return {
      success: !!data.success,
      errorCodes: data["error-codes"],
    };
  } catch {
    return { success: false, errorCodes: ["network-error"] };
  }
}

export const isTurnstileConfigured = Boolean(TURNSTILE_SECRET);
