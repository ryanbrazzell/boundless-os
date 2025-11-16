import { describe, it, expect } from "vitest";
import { parsePagination, normalizePagination, createPaginationResult } from "../pagination";

describe("Pagination Utilities", () => {
  it("should parse pagination from query", () => {
    const result = parsePagination({ limit: "50", offset: "10" });
    expect(result.limit).toBe(50);
    expect(result.offset).toBe(10);
  });

  it("should normalize page-based pagination", () => {
    const result = normalizePagination({ page: 2, pageSize: 20 });
    expect(result.limit).toBe(20);
    expect(result.offset).toBe(20);
  });

  it("should normalize limit/offset pagination", () => {
    const result = normalizePagination({ limit: 50, offset: 10 });
    expect(result.limit).toBe(50);
    expect(result.offset).toBe(10);
  });

  it("should respect max limit", () => {
    const result = normalizePagination({ limit: 2000 }, 30, 1000);
    expect(result.limit).toBe(1000);
  });

  it("should create pagination result", () => {
    const data = [1, 2, 3];
    const result = createPaginationResult(data, { limit: 10, offset: 0, total: 3 });
    expect(result.data).toEqual(data);
    expect(result.pagination.hasMore).toBe(false);
  });
});

