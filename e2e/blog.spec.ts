import { expect, test } from "@playwright/test";

test.describe("blog", () => {
  test("lists articles and opens a detail page", async ({ page }) => {
    await page.goto("/blog");
    await expect(
      page.getByRole("heading", { name: /articles/i }).first()
    ).toBeVisible();

    const firstCard = page.locator('a[href^="/blog/"]').first();
    await expect(firstCard).toBeVisible();
    const href = await firstCard.getAttribute("href");
    expect(href).toMatch(/^\/blog\/.+/);
    await firstCard.click();
    await page.waitForURL(/\/blog\/[^/]+/);
    await expect(
      page.getByRole("heading", { level: 1 })
    ).toBeVisible();
  });

  test("blog detail emits Article schema", async ({ page }) => {
    await page.goto("/blog/thermolaquage-vs-peinture-liquide");
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const hasArticle = scripts.some((raw) => {
      try {
        return JSON.parse(raw)["@type"] === "Article";
      } catch {
        return false;
      }
    });
    expect(hasArticle).toBe(true);
  });
});

test("healthz returns ok", async ({ request }) => {
  const res = await request.get("/api/healthz");
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.ok).toBe(true);
});
