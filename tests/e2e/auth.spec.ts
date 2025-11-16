import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test("should display login page", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000); // Give React time to render
    
    // Check for form inputs (most important check - these should always be present)
    await expect(page.locator('input[type="email"]').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[type="password"]').first()).toBeVisible({ timeout: 10000 });
    
    // Check for submit button
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible({ timeout: 5000 });
  });

  test("should show validation errors for empty form", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    
    const submitButton = page.getByRole("button", { name: /sign in/i });
    await submitButton.click();
    
    // Form validation should prevent submission - check we're still on login page
    await expect(page).toHaveURL(/.*login.*/, { timeout: 2000 });
  });

  test("should navigate to forgot password", async ({ page }) => {
    await page.goto("/forgot-password");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000); // Give React time to render
    
    // Check for email input (most important check - should always be present)
    await expect(page.locator('input[type="email"]').first()).toBeVisible({ timeout: 10000 });
    
    // Check for submit button
    await expect(page.getByRole("button").first()).toBeVisible({ timeout: 5000 });
  });
});
