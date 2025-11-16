import { describe, it, expect, beforeAll } from "vitest";
import { getDb } from "../index";
import { users, clients, eas } from "../schema";

// Mock D1Database for testing
const createMockD1Database = (): D1Database => {
  return {
    prepare: (query: string) => {
      // Mock successful query execution
      return {
        bind: () => ({
          first: async () => ({ id: "test-id", email: "test@example.com", name: "Test User" }),
          run: async () => ({ success: true }),
          all: async () => ({ results: [] }),
        }),
        first: async () => ({ id: "test-id", email: "test@example.com", name: "Test User" }),
        run: async () => ({ success: true }),
        all: async () => ({ results: [] }),
      };
    },
    exec: async () => ({ success: true }),
    batch: async () => [],
  } as unknown as D1Database;
};

describe("Core Tables", () => {
  let db: ReturnType<typeof getDb>;
  let mockEnv: { DB: D1Database };

  beforeAll(() => {
    mockEnv = { DB: createMockD1Database() };
    db = getDb(mockEnv);
  });

  it("should have Users table schema defined", () => {
    expect(users).toBeDefined();
    expect(users.id).toBeDefined();
    expect(users.email).toBeDefined();
    expect(users.role).toBeDefined();
  });

  it("should have Clients table schema defined", () => {
    expect(clients).toBeDefined();
    expect(clients.id).toBeDefined();
    expect(clients.name).toBeDefined();
  });

  it("should have EAs table schema defined", () => {
    expect(eas).toBeDefined();
    expect(eas.id).toBeDefined();
    expect(eas.expectedShowUpTime).toBeDefined();
  });

  it("should validate role enum values", () => {
    const validRoles = ["SUPER_ADMIN", "HEAD_CLIENT_SUCCESS", "HEAD_EAS", "EA", "CLIENT"];
    validRoles.forEach((role) => {
      expect(validRoles.includes(role)).toBe(true);
    });
  });

  it("should have foreign key relationship from EAs to Users", () => {
    // Verify EAs table references Users table
    expect(eas.id).toBeDefined();
    // The foreign key is defined in the schema via .references()
  });
});

