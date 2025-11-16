/**
 * Validation utilities for API endpoints
 */

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate date string format (YYYY-MM-DD)
 */
export const isValidDateString = (dateString: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return false;
  }
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * Sanitize string input (basic XSS prevention)
 */
export const sanitizeString = (input: string | null | undefined, maxLength?: number): string => {
  if (!input) return "";
  let sanitized = input.trim();
  
  // Remove potentially dangerous characters
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
};

/**
 * Validate UUID format
 */
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Validate enum value
 */
export const isValidEnumValue = <T extends string>(value: string, enumValues: readonly T[]): value is T => {
  return enumValues.includes(value as T);
};

/**
 * Validate pagination parameters
 */
export const validatePagination = (limit?: string, offset?: string): { limit: number; offset: number; errors: string[] } => {
  const errors: string[] = [];
  let limitNum = 30;
  let offsetNum = 0;

  if (limit) {
    limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 1000) {
      errors.push("Limit must be between 1 and 1000");
      limitNum = 30;
    }
  }

  if (offset) {
    offsetNum = parseInt(offset, 10);
    if (isNaN(offsetNum) || offsetNum < 0) {
      errors.push("Offset must be a non-negative integer");
      offsetNum = 0;
    }
  }

  return { limit: limitNum, offset: offsetNum, errors };
};

/**
 * Validate timestamp (Unix seconds)
 */
export const isValidTimestamp = (timestamp: number | string): boolean => {
  const ts = typeof timestamp === "string" ? parseInt(timestamp, 10) : timestamp;
  if (isNaN(ts)) return false;
  // Valid timestamp range: 2000-01-01 to 2100-01-01
  return ts >= 946684800 && ts <= 4102444800;
};

