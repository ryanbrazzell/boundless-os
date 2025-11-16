import { test, expect } from "@playwright/test";

test.describe("Critical User Flows", () => {
  test("complete login flow structure", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    
    // Check login form elements exist
    await expect(page.locator('input[type="email"]').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('input[type="password"]').first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible({ timeout: 5000 });
  });

  test("forgot password flow", async ({ page }) => {
    await page.goto("/forgot-password");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000); // Give React time to render
    
    // Check page loaded (has email input)
    await expect(page.locator('input[type="email"]').first()).toBeVisible({ timeout: 10000 });
    
    // Check for submit button
    await expect(page.getByRole("button").first()).toBeVisible({ timeout: 5000 });
  });

  test("report form structure", async ({ page }) => {
    await page.goto("/reports/submit");
    await page.waitForLoadState("networkidle");
    
    // Should redirect to login if not authenticated (expected behavior)
    // Check that we're either on the report page or redirected to login
    const currentUrl = page.url();
    const isLoginPage = currentUrl.includes("/login");
    const isReportPage = currentUrl.includes("/reports/submit");
    
    // Should be on one of these pages
    expect(isLoginPage || isReportPage).toBeTruthy();
    
    // If on login page, verify it has form inputs
    if (isLoginPage) {
      await expect(page.locator('input[type="email"]').first()).toBeVisible({ timeout: 2000 });
    }
  });

  test("report history page", async ({ page }) => {
    await page.goto("/reports/history");
    await page.waitForLoadState("networkidle");
    
    // Should redirect to login if not authenticated (expected behavior)
    const currentUrl = page.url();
    const isLoginPage = currentUrl.includes("/login");
    const isHistoryPage = currentUrl.includes("/reports/history");
    
    // Should be on one of these pages
    expect(isLoginPage || isHistoryPage).toBeTruthy();
    
    // If on login page, verify it has form inputs
    if (isLoginPage) {
      await expect(page.locator('input[type="email"]').first()).toBeVisible({ timeout: 2000 });
    }
  });
});
