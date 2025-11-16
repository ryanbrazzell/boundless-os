import { describe, it, expect, vi, beforeEach } from "vitest";
import { logger, LogLevel } from "../logger";

describe("Logger", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should log info messages", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.info("Test message");
    expect(consoleSpy).toHaveBeenCalledWith("[INFO] Test message");
  });

  it("should log error messages", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    logger.error("Test error");
    expect(consoleSpy).toHaveBeenCalled();
  });

  it("should respect log level", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.setLevel(LogLevel.ERROR);
    logger.info("Should not log");
    expect(consoleSpy).not.toHaveBeenCalled();
  });
});

