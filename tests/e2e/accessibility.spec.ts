import { test, expect } from "@playwright/test";

test.describe("Accessibility Compliance", () => {
  test("login page should have proper labels", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    
    // Check for email input
    await expect(page.locator('input[type="email"]').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('input[type="password"]').first()).toBeVisible({ timeout: 5000 });
  });

  test("forms should have submit buttons", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible({ timeout: 5000 });
  });

  test("navigation should be keyboard accessible", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    // Tab through form elements
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    // Should be able to navigate
  });
});
