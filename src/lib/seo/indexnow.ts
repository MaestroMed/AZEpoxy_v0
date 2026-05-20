import "server-only";

/**
 * IndexNow — protocole de notification d'indexation supporté par Bing,
 * Yandex, Naver, Seznam (indirectement Google via Bingbot). On ping
 * api.indexnow.org avec la liste d'URLs à recrawler — gratuit, simple,
 * limité à 10 000 URLs/jour/host.
 *
 * Setup :
 *  1. Une clé aléatoire stockée dans `INDEXNOW_KEY` (env) ET dans un
 *     fichier `public/{key}.txt` (vérification de propriété).
 *  2. Endpoint `/api/cron/indexnow` qui POST la liste des pages villes.
 */

const ENDPOINT = "https://api.indexnow.org/IndexNow";

export interface IndexNowResult {
  ok: boolean;
  status?: number;
  submitted: number;
  body?: string;
  error?: string;
}

export async function submitToIndexNow(
  urls: string[],
  options?: {
    host?: string;
    key?: string;
    keyLocation?: string;
  },
): Promise<IndexNowResult> {
  const key = options?.key ?? process.env.INDEXNOW_KEY;
  const host =
    options?.host ??
    (process.env.NEXT_PUBLIC_SITE_URL
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname
      : "www.azepoxy.fr");
  const keyLocation =
    options?.keyLocation ?? `https://${host}/${key}.txt`;

  if (!key) {
    return {
      ok: false,
      submitted: 0,
      error: "INDEXNOW_KEY not set",
    };
  }

  if (urls.length === 0) {
    return { ok: true, submitted: 0 };
  }

  const body = JSON.stringify({
    host,
    key,
    keyLocation,
    urlList: urls,
  });

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Host: "api.indexnow.org",
      },
      body,
      signal: AbortSignal.timeout(8_000),
    });
    const text = res.ok ? "" : await res.text();
    return {
      ok: res.ok,
      status: res.status,
      submitted: urls.length,
      body: text || undefined,
    };
  } catch (err) {
    return {
      ok: false,
      submitted: 0,
      error: err instanceof Error ? err.message : "unknown",
    };
  }
}
