import { describe, it, expect } from "vitest";
import { parseCSV, validateRow, validateAllRows } from "../csv-import";

describe("CSV Import Service Logic", () => {
  it("should parse CSV correctly", () => {
    const csvText = `EA Email,EA Name,Client Name,Start Date,Accelerator Enabled,Week 1 Goals,Week 2 Goals,Week 3 Goals,Week 4 Goals
ea1@example.com,John Doe,Acme Corp,2024-01-01,Y,Goal 1,Goal 2,Goal 3,Goal 4
ea2@example.com,Jane Smith,Tech Inc,2024-01-15,N,,,,
`;

    const rows = parseCSV(csvText);
    expect(rows.length).toBe(2);
    expect(rows[0].eaEmail).toBe("ea1@example.com");
    expect(rows[0].eaName).toBe("John Doe");
    expect(rows[0].clientName).toBe("Acme Corp");
    expect(rows[0].startDate).toBe("2024-01-01");
    expect(rows[0].acceleratorEnabled).toBe("Y");
  });

  it("should validate row correctly", () => {
    const validRow = {
      eaEmail: "test@example.com",
      eaName: "Test User",
      clientName: "Test Client",
      startDate: "2024-01-01",
      acceleratorEnabled: "Y",
    };

    const errors = validateRow(validRow, 1);
    expect(errors.length).toBe(0);
  });

  it("should detect validation errors", () => {
    const invalidRow = {
      eaEmail: "invalid-email",
      eaName: "",
      clientName: "Test Client",
      startDate: "invalid-date",
      acceleratorEnabled: "X",
    };

    const errors = validateRow(invalidRow, 1);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.field === "eaEmail")).toBe(true);
    expect(errors.some((e) => e.field === "eaName")).toBe(true);
    expect(errors.some((e) => e.field === "startDate")).toBe(true);
  });

  it("should validate all rows", () => {
    const rows = [
      {
        eaEmail: "valid@example.com",
        eaName: "Valid User",
        clientName: "Valid Client",
        startDate: "2024-01-01",
      },
      {
        eaEmail: "invalid-email",
        eaName: "",
        clientName: "Client",
        startDate: "2024-01-01",
      },
    ];

    const { validRows, errors } = validateAllRows(rows);
    expect(validRows.length).toBe(1);
    expect(errors.length).toBeGreaterThan(0);
  });
});

