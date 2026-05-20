import "server-only";
import type { SeoQaPageResult } from "@/lib/db/schema";

/**
 * SEO QA — vérification automatique des pages villes.
 *
 * Pour chaque URL, on fetch la page en HTTP, on extrait quelques signaux
 * critiques (title, h1, schema.org markers, word count), puis on liste
 * les défauts détectés. Le résultat est stocké en DB pour suivi temporel.
 *
 * On reste sur du HTTP simple plutôt que Chrome MCP / Puppeteer :
 *  - 10× plus rapide (≤200 ms/page vs 2-5 s)
 *  - Pas de browser, pas de mémoire, exécutable sur Edge / cron Vercel
 *  - Couvre 80 % des cas (deindex, soft 404, thin content, schema cassé)
 *
 * Chrome MCP reste utile pour les vérifications visuelles (regression
 * UI, screenshots), à déclencher manuellement.
 */

const WORD_COUNT_MIN = 600;

export interface QaCheckConfig {
  baseUrl: string;
  paths: string[];
  /** Timeout par page (ms). */
  fetchTimeoutMs?: number;
  /** Concurrent fetches. Garder bas pour ne pas se rate-limiter
   *  soi-même. */
  concurrency?: number;
}

export interface QaRunSummary {
  totalPages: number;
  okCount: number;
  koCount: number;
  durationMs: number;
  pages: Record<string, SeoQaPageResult>;
}

/* ── Page check ──────────────────────────────────────────────────── */

async function checkPage(
  baseUrl: string,
  path: string,
  timeoutMs: number,
): Promise<SeoQaPageResult> {
  const url = baseUrl + path;
  const issues: string[] = [];

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "AZEpoxy-SEO-QA/1.0",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(timeoutMs),
      // Avoid Next.js fetch cache inside the cron job.
      cache: "no-store",
    });

    if (res.status !== 200) {
      issues.push(`http-${res.status}`);
      return { ok: false, status: res.status, issues };
    }

    const html = await res.text();

    // Title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (!titleMatch) issues.push("no-title");

    // H1
    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const h1 = h1Match ? stripTags(h1Match[1]).trim() : undefined;
    if (!h1) issues.push("no-h1");

    // Meta description
    const descMatch = html.match(
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
    );
    if (!descMatch) issues.push("no-meta-description");
    else if (descMatch[1].length < 80) issues.push("meta-description-too-short");

    // Canonical
    const canonicalMatch = html.match(
      /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i,
    );
    if (!canonicalMatch) issues.push("no-canonical");

    // Schema.org markers
    const hasBreadcrumb = html.includes('"@type":"BreadcrumbList"') ||
      html.includes('"@type": "BreadcrumbList"');
    const hasFaq = html.includes('"@type":"FAQPage"') ||
      html.includes('"@type": "FAQPage"');
    const hasLocalBusiness = html.includes('"@type":"LocalBusiness"') ||
      html.includes('"@type": "LocalBusiness"');

    if (!hasLocalBusiness) issues.push("no-local-business-schema");

    // Word count (rough — strip tags then count)
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const text = bodyMatch ? stripTags(bodyMatch[1]) : stripTags(html);
    const wordCount = text
      .split(/\s+/)
      .filter((w) => w.length > 0).length;

    if (wordCount < WORD_COUNT_MIN) {
      issues.push(`thin-content-${wordCount}-words`);
    }

    // Noindex check
    if (
      /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)
    ) {
      issues.push("noindex-set");
    }

    return {
      ok: issues.length === 0,
      status: 200,
      issues,
      wordCount,
      h1,
      hasBreadcrumb,
      hasFaq,
      hasLocalBusiness,
    };
  } catch (err) {
    issues.push(
      err instanceof Error && err.name === "TimeoutError"
        ? "timeout"
        : `fetch-error: ${err instanceof Error ? err.message : "unknown"}`,
    );
    return { ok: false, issues };
  }
}

/* ── Concurrent runner ──────────────────────────────────────────── */

async function runPool<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let cursor = 0;

  async function next() {
    while (true) {
      const i = cursor++;
      if (i >= items.length) return;
      out[i] = await worker(items[i]);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () =>
    next(),
  );
  await Promise.all(workers);
  return out;
}

/* ── Public API ──────────────────────────────────────────────────── */

export async function runQaPass(config: QaCheckConfig): Promise<QaRunSummary> {
  const t0 = Date.now();
  const fetchTimeoutMs = config.fetchTimeoutMs ?? 8000;
  const concurrency = config.concurrency ?? 4;

  const results = await runPool(config.paths, concurrency, (p) =>
    checkPage(config.baseUrl, p, fetchTimeoutMs),
  );

  const pages: Record<string, SeoQaPageResult> = {};
  let okCount = 0;
  let koCount = 0;
  config.paths.forEach((p, i) => {
    pages[p] = results[i];
    if (results[i].ok) okCount++;
    else koCount++;
  });

  return {
    totalPages: config.paths.length,
    okCount,
    koCount,
    durationMs: Date.now() - t0,
    pages,
  };
}

/* ── Helpers ─────────────────────────────────────────────────────── */

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
}
