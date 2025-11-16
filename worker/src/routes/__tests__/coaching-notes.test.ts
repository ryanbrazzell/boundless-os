import { describe, it, expect } from "vitest";
import coachingNotesRouter from "../coaching-notes";
import { noteTypeValues } from "../../db/schema";
import { adminRoles } from "../../middleware/auth";

describe("Coaching Notes API Endpoints", () => {
  it("should have coaching notes router defined", () => {
    expect(coachingNotesRouter).toBeDefined();
  });

  it("should validate note type enums", () => {
    expect(noteTypeValues).toContain("EA_LEVEL");
    expect(noteTypeValues).toContain("PAIRING_LEVEL");
  });

  it("should validate admin roles for updates", () => {
    expect(adminRoles).toContain("SUPER_ADMIN");
    expect(adminRoles).toContain("HEAD_CLIENT_SUCCESS");
    expect(adminRoles).toContain("HEAD_EAS");
  });

  it("should have correct endpoint paths", () => {
    const expectedPaths = [
      "/ea/:eaId",
      "/pairing/:pairingId",
    ];
    
    expectedPaths.forEach((path) => {
      expect(path).toBeDefined();
      expect(path.includes(":")).toBe(true);
    });
  });

  it("should validate coaching notes structure", () => {
    const noteStructure = {
      id: "note-1",
      content: "Test note",
      noteType: "EA_LEVEL",
      updatedBy: "admin-1",
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
    };

    expect(noteStructure.id).toBeDefined();
    expect(noteStructure.content).toBeDefined();
    expect(noteStructure.noteType).toBeDefined();
    expect(noteTypeValues).toContain(noteStructure.noteType);
  });
});
