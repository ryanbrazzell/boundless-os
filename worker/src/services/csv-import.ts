export interface CSVRow {
  eaEmail: string;
  eaName: string;
  clientName: string;
  startDate: string;
  acceleratorEnabled?: string;
  week1Goals?: string;
  week2Goals?: string;
  week3Goals?: string;
  week4Goals?: string;
}

export interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export interface ImportResult {
  success: boolean;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  createdPairings: number;
  createdEAs: number;
  createdClients: number;
  errors: ValidationError[];
}

/**
 * Parse CSV text into rows
 */
export const parseCSV = (csvText: string): CSVRow[] => {
  const lines = csvText.split("\n").filter((line) => line.trim().length > 0);
  if (lines.length === 0) return [];

  // Skip header row
  const dataLines = lines.slice(1);
  const rows: CSVRow[] = [];

  for (const line of dataLines) {
    // Simple CSV parsing - handle quoted fields
    const values: string[] = [];
    let currentValue = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          currentValue += '"';
          i++;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        // End of field
        values.push(currentValue.trim());
        currentValue = "";
      } else {
        currentValue += char;
      }
    }
    // Add last field
    values.push(currentValue.trim());

    if (values.length >= 4) {
      rows.push({
        eaEmail: values[0] || "",
        eaName: values[1] || "",
        clientName: values[2] || "",
        startDate: values[3] || "",
        acceleratorEnabled: values[4] || "",
        week1Goals: values[5] || "",
        week2Goals: values[6] || "",
        week3Goals: values[7] || "",
        week4Goals: values[8] || "",
      });
    }
  }

  return rows;
};

/**
 * Validate a CSV row
 */
export const validateRow = (row: CSVRow, rowNumber: number): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Validate EA Email
  if (!row.eaEmail || row.eaEmail.trim().length === 0) {
    errors.push({ row: rowNumber, field: "eaEmail", message: "EA Email is required" });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.eaEmail)) {
    errors.push({ row: rowNumber, field: "eaEmail", message: "EA Email must be a valid email address" });
  }

  // Validate EA Name
  if (!row.eaName || row.eaName.trim().length === 0) {
    errors.push({ row: rowNumber, field: "eaName", message: "EA Name is required" });
  }

  // Validate Client Name
  if (!row.clientName || row.clientName.trim().length === 0) {
    errors.push({ row: rowNumber, field: "clientName", message: "Client Name is required" });
  }

  // Validate Start Date
  if (!row.startDate || row.startDate.trim().length === 0) {
    errors.push({ row: rowNumber, field: "startDate", message: "Start Date is required" });
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(row.startDate)) {
      errors.push({ row: rowNumber, field: "startDate", message: "Start Date must be in YYYY-MM-DD format" });
    } else {
      const date = new Date(row.startDate);
      if (isNaN(date.getTime())) {
        errors.push({ row: rowNumber, field: "startDate", message: "Start Date must be a valid date" });
      }
    }
  }

  // Validate Accelerator Enabled
  if (row.acceleratorEnabled && row.acceleratorEnabled.trim().length > 0) {
    const enabled = row.acceleratorEnabled.trim().toUpperCase();
    if (enabled !== "Y" && enabled !== "N") {
      errors.push({ row: rowNumber, field: "acceleratorEnabled", message: "Accelerator Enabled must be Y or N" });
    }
  }

  return errors;
};

/**
 * Validate all rows
 */
export const validateAllRows = (rows: CSVRow[]): { validRows: CSVRow[]; errors: ValidationError[] } => {
  const errors: ValidationError[] = [];
  const validRows: CSVRow[] = [];

  rows.forEach((row, index) => {
    const rowErrors = validateRow(row, index + 2); // +2 because header is row 1, and we're 0-indexed
    if (rowErrors.length === 0) {
      validRows.push(row);
    } else {
      errors.push(...rowErrors);
    }
  });

  return { validRows, errors };
};

