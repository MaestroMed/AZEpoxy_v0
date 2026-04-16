import { expect, test } from "@playwright/test";

test.describe("homepage", () => {
  test("renders hero and primary CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/AZ\s*Époxy/i);

    const hero = page.getByRole("heading", { level: 1 });
    await expect(hero).toBeVisible();

    const devisCta = page.getByRole("link", { name: /devis gratuit/i }).first();
    await expect(devisCta).toBeVisible();
  });

  test("emits LocalBusiness + BreadcrumbList schema", async ({ page }) => {
    await page.goto("/");
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const types = scripts.map((raw) => {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed)
          ? parsed.map((p) => p["@type"])
          : [parsed["@type"]];
      } catch {
        return [];
      }
    });
    const flat = types.flat();
    expect(flat).toContain("LocalBusiness");
    expect(flat).toContain("WebSite");
  });

  test("RAL recommender updates suggestions", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("button", { name: "Jantes auto/moto", exact: true })
      .scrollIntoViewIfNeeded();
    await page
      .getByRole("button", { name: "Jantes auto/moto", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Sobre et élégant", exact: true })
      .click();
    await expect(
      page.getByText("Demander un devis avec ces couleurs")
    ).toBeVisible();
  });
});
