import { Hono } from "hono";
import { getDb } from "../db";
import { users, clients, pairings, userRoleValues } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, requireRole } from "../middleware/auth";
import { parseCSV, validateAllRows, CSVRow, ImportResult } from "../services/csv-import";
import type { AuthEnv } from "../auth/config";

type Env = AuthEnv;

const importRouter = new Hono<{ Bindings: Env }>();

// Apply auth middleware - only SUPER_ADMIN and HEAD_CLIENT_SUCCESS
importRouter.use("*", requireAuth);
importRouter.use("*", requireRole(["SUPER_ADMIN", "HEAD_CLIENT_SUCCESS"]));

// CSV import endpoint
importRouter.post("/import", async (c) => {
  try {
    const db = getDb(c.env);
    const body = await c.req.parseBody();
    const file = body.file as File;

    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    // Validate file type
    if (!file.name.endsWith(".csv")) {
      return c.json({ error: "File must be a CSV file" }, 400);
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return c.json({ error: "File size must be less than 5MB" }, 400);
    }

    // Read file content
    const csvText = await file.text();

    // Parse CSV
    const rows = parseCSV(csvText);

    // Validate row count (1000 max)
    if (rows.length > 1000) {
      return c.json({ error: "CSV file must have 1000 rows or fewer" }, 400);
    }

    // Validate all rows
    const { validRows, errors } = validateAllRows(rows);

    // If validation-only request (check query param)
    const validateOnly = c.req.query("validateOnly") === "true";
    if (validateOnly) {
      return c.json({
        totalRows: rows.length,
        validRows: validRows.length,
        invalidRows: errors.length,
        errors,
        preview: validRows.slice(0, 20), // Preview first 20 valid rows
      });
    }

    // Process import
    const result: ImportResult = {
      success: true,
      totalRows: rows.length,
      validRows: validRows.length,
      invalidRows: errors.length,
      createdPairings: 0,
      createdEAs: 0,
      createdClients: 0,
      errors,
    };

    // Process valid rows
    for (const row of validRows) {
      try {
        // Find or create EA
        let ea = await db.select().from(users).where(and(eq(users.email, row.eaEmail), eq(users.role, "EA"))).get();

        if (!ea) {
          // Create new EA user
          const newEA = await db
            .insert(users)
            .values({
              email: row.eaEmail,
              name: row.eaName,
              role: "EA",
              // Email verification will be handled by Better Auth
            })
            .returning()
            .get();
          ea = newEA;
          result.createdEAs++;
        }

        // Find or create client
        let client = await db.select().from(clients).where(eq(clients.name, row.clientName)).get();

        if (!client) {
          const newClient = await db
            .insert(clients)
            .values({
              name: row.clientName,
            })
            .returning()
            .get();
          client = newClient;
          result.createdClients++;
        }

        // Parse start date
        const startDateTimestamp = Math.floor(new Date(row.startDate).getTime() / 1000);

        // Parse accelerator settings
        const acceleratorEnabled = row.acceleratorEnabled?.trim().toUpperCase() === "Y";
        const acceleratorWeek = acceleratorEnabled ? 1 : null;

        // Create pairing
        await db
          .insert(pairings)
          .values({
            eaId: ea.id,
            clientId: client.id,
            startDate: startDateTimestamp,
            acceleratorEnabled,
            acceleratorWeek,
            acceleratorWeek1Goals: row.week1Goals || null,
            acceleratorWeek2Goals: row.week2Goals || null,
            acceleratorWeek3Goals: row.week3Goals || null,
            acceleratorWeek4Goals: row.week4Goals || null,
          })
          .run();

        result.createdPairings++;
      } catch (error) {
        // Add error for this row
        result.errors.push({
          row: rows.indexOf(row) + 2,
          field: "general",
          message: `Failed to create pairing: ${error instanceof Error ? error.message : String(error)}`,
        });
        result.invalidRows++;
        result.validRows--;
      }
    }

    return c.json({
      message: "Import completed",
      result,
    });
  } catch (error) {
    console.error("Error importing CSV:", error);
    return c.json({ error: `Failed to import CSV: ${error instanceof Error ? error.message : String(error)}` }, 500);
  }
});

export default importRouter;

