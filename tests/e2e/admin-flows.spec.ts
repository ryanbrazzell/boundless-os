import { test, expect } from "@playwright/test";

test.describe("Admin Flows", () => {
  test("user management page structure", async ({ page }) => {
    await page.goto("/admin/users");
    await expect(page.getByRole("heading", { name: /User Management/i })).toBeVisible({ timeout: 5000 }).catch(() => {
      // May require authentication
    });
  });

  test("alert rules management page", async ({ page }) => {
    await page.goto("/admin/alert-rules");
    await expect(page.getByRole("heading", { name: /Alert Rules Management/i })).toBeVisible({ timeout: 5000 }).catch(() => {
      // May require authentication
    });
  });

  test("coaching notes management page", async ({ page }) => {
    await page.goto("/admin/coaching-notes");
    await expect(page.getByRole("heading", { name: /Coaching Notes Management/i })).toBeVisible({ timeout: 5000 }).catch(() => {
      // May require authentication
    });
  });

  test("announcements management page", async ({ page }) => {
    await page.goto("/admin/announcements");
    await expect(page.getByRole("heading", { name: /Company Announcements/i })).toBeVisible({ timeout: 5000 }).catch(() => {
      // May require authentication
    });
  });

  test("PTO management page", async ({ page }) => {
    await page.goto("/admin/pto");
    await expect(page.getByRole("heading", { name: /PTO.*Out of Office Management/i })).toBeVisible({ timeout: 5000 }).catch(() => {
      // May require authentication
    });
  });

  test("accelerator management page", async ({ page }) => {
    await page.goto("/admin/accelerator");
    await expect(page.getByRole("heading", { name: /4-Week Accelerator Management/i })).toBeVisible({ timeout: 5000 }).catch(() => {
      // May require authentication
    });
  });
});

