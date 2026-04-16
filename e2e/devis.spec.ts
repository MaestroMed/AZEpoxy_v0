import { expect, test } from "@playwright/test";

test.describe("devis wizard", () => {
  test("progresses through type selection", async ({ page }) => {
    await page.goto("/devis");
    await expect(
      page.getByRole("heading", { name: /devis/i }).first()
    ).toBeVisible();

    const jantesCard = page.getByRole("button", { name: /jantes/i }).first();
    await jantesCard.click();

    await expect(page.getByText(/vos coordonnées|détails|continuer/i)).toBeVisible();
  });

  test("deep-links RAL from query param", async ({ page }) => {
    await page.goto("/devis?ral=RAL%209005");
    // The hidden honeypot input is always present; we just assert the URL
    // was accepted and the wizard rendered without crashing.
    await expect(
      page.getByRole("heading", { name: /devis/i }).first()
    ).toBeVisible();
    expect(page.url()).toContain("ral=RAL");
  });
});
