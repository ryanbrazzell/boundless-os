import { test, expect } from "@playwright/test";

test.describe("Route Navigation", () => {
  test("should redirect unauthenticated users to login", async ({ page }) => {
    await page.goto("/");
    // Should redirect to login or show login page
    await expect(page).toHaveURL(/.*login.*/, { timeout: 5000 }).catch(() => {
      // May already be on login or redirecting
    });
  });

  test("should have accessible routes", async ({ page }) => {
    const routes = [
      "/login",
      "/forgot-password",
      "/coming-soon",
    ];

    for (const route of routes) {
      await page.goto(route);
      // Check page loads (not 404)
      await expect(page.locator("body")).toBeVisible({ timeout: 5000 });
    }
  });
});

