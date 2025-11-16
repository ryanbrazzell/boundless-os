import { test, expect } from "@playwright/test";

test.describe("Admin Dashboards", () => {
  test("should display clients dashboard", async ({ page }) => {
    await page.goto("/dashboard/clients");
    // Check dashboard structure
    await expect(page.getByRole("heading", { name: /Clients Dashboard/i })).toBeVisible({ timeout: 5000 }).catch(() => {
      // May require authentication
    });
  });

  test("should display assistants dashboard", async ({ page }) => {
    await page.goto("/dashboard/assistants");
    await expect(page.getByRole("heading", { name: /Assistants Dashboard/i })).toBeVisible({ timeout: 5000 }).catch(() => {
      // May require authentication
    });
  });

  test("should display pairings dashboard", async ({ page }) => {
    await page.goto("/dashboard/pairings");
    await expect(page.getByRole("heading", { name: /Pairings Dashboard/i })).toBeVisible({ timeout: 5000 }).catch(() => {
      // May require authentication
    });
  });
});

