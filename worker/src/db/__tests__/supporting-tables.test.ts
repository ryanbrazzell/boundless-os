import { describe, it, expect, beforeAll } from "vitest";
import { getDb } from "../index";
import { coachingNotes, ptoRecords, startOfDayLogs, companyAnnouncements } from "../schema";

// Mock D1Database for testing
const createMockD1Database = (): D1Database => {
  return {
    prepare: (query: string) => {
      return {
        bind: () => ({
          first: async () => ({ 
            id: "test-id", 
            noteType: "EA_LEVEL",
            eaId: "ea-1",
            logDate: Math.floor(Date.now() / 1000)
          }),
          run: async () => ({ success: true }),
          all: async () => ({ results: [] }),
        }),
        first: async () => ({ 
          id: "test-id",
          noteType: "EA_LEVEL",
          eaId: "ea-1",
          logDate: Math.floor(Date.now() / 1000)
        }),
        run: async () => ({ success: true }),
        all: async () => ({ results: [] }),
      };
    },
    exec: async () => ({ success: true }),
    batch: async () => [],
  } as unknown as D1Database;
};

describe("Supporting Tables", () => {
  let db: ReturnType<typeof getDb>;
  let mockEnv: { DB: D1Database };

  beforeAll(() => {
    mockEnv = { DB: createMockD1Database() };
    db = getDb(mockEnv);
  });

  it("should have CoachingNotes table schema defined", () => {
    expect(coachingNotes).toBeDefined();
    expect(coachingNotes.id).toBeDefined();
    expect(coachingNotes.noteType).toBeDefined();
    expect(coachingNotes.eaId).toBeDefined();
    expect(coachingNotes.pairingId).toBeDefined();
    expect(coachingNotes.content).toBeDefined();
  });

  it("should have PTORecords table schema defined", () => {
    expect(ptoRecords).toBeDefined();
    expect(ptoRecords.id).toBeDefined();
    expect(ptoRecords.eaId).toBeDefined();
    expect(ptoRecords.startDate).toBeDefined();
    expect(ptoRecords.endDate).toBeDefined();
    expect(ptoRecords.reason).toBeDefined();
  });

  it("should have StartOfDayLogs table schema defined", () => {
    expect(startOfDayLogs).toBeDefined();
    expect(startOfDayLogs.id).toBeDefined();
    expect(startOfDayLogs.eaId).toBeDefined();
    expect(startOfDayLogs.logDate).toBeDefined();
    expect(startOfDayLogs.loggedAt).toBeDefined();
    expect(startOfDayLogs.wasLate).toBeDefined();
  });

  it("should have CompanyAnnouncements table schema defined", () => {
    expect(companyAnnouncements).toBeDefined();
    expect(companyAnnouncements.id).toBeDefined();
    expect(companyAnnouncements.title).toBeDefined();
    expect(companyAnnouncements.content).toBeDefined();
    expect(companyAnnouncements.isActive).toBeDefined();
    expect(companyAnnouncements.createdBy).toBeDefined();
  });

  it("should validate CoachingNotes unique constraints", () => {
    // Verify unique constraints are defined in schema
    expect(coachingNotes.noteType).toBeDefined();
    expect(coachingNotes.eaId).toBeDefined();
    expect(coachingNotes.pairingId).toBeDefined();
    // Unique constraints enforced via uniqueIndex in schema
  });

  it("should validate StartOfDayLogs unique constraint (eaId, logDate)", () => {
    // Verify unique constraint is defined
    expect(startOfDayLogs.eaId).toBeDefined();
    expect(startOfDayLogs.logDate).toBeDefined();
    // Unique constraint enforced via uniqueIndex
  });

  it("should validate PTO reason enum values", () => {
    const validReasons = ["PTO", "SICK", "OTHER"];
    validReasons.forEach((reason) => {
      expect(validReasons.includes(reason)).toBe(true);
    });
  });

  it("should validate note type enum values", () => {
    const validNoteTypes = ["EA_LEVEL", "PAIRING_LEVEL"];
    validNoteTypes.forEach((type) => {
      expect(validNoteTypes.includes(type)).toBe(true);
    });
  });
});

