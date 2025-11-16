/**
 * Date and timezone utilities
 */

/**
 * Get start of day timestamp (midnight) for a given date
 */
export const getStartOfDay = (date: Date | number, timezone?: string): number => {
  const d = typeof date === "number" ? new Date(date * 1000) : date;
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.floor(start.getTime() / 1000);
};

/**
 * Get end of day timestamp (23:59:59) for a given date
 */
export const getEndOfDay = (date: Date | number, timezone?: string): number => {
  const start = getStartOfDay(date, timezone);
  return start + 86400 - 1; // Add 24 hours minus 1 second
};

/**
 * Calculate business days between two dates
 */
export const calculateBusinessDays = (startDate: number, endDate: number): number => {
  let count = 0;
  const start = new Date(startDate * 1000);
  const end = new Date(endDate * 1000);
  const current = new Date(start);

  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Not Sunday (0) or Saturday (6)
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
};

/**
 * Format timestamp to ISO date string (YYYY-MM-DD)
 */
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toISOString().split("T")[0];
};

/**
 * Parse date string (YYYY-MM-DD) to timestamp
 */
export const parseDate = (dateString: string): number => {
  const date = new Date(dateString + "T00:00:00Z"); // Add time to ensure UTC parsing
  return Math.floor(date.getTime() / 1000);
};

/**
 * Get date range for last N days
 */
export const getDateRange = (days: number): { start: number; end: number } => {
  const end = Math.floor(Date.now() / 1000);
  const start = end - days * 24 * 60 * 60;
  return { start, end };
};

/**
 * Check if timestamp is today
 */
export const isToday = (timestamp: number, timezone?: string): boolean => {
  const now = Math.floor(Date.now() / 1000);
  const today = getStartOfDay(now, timezone);
  const target = getStartOfDay(timestamp, timezone);
  return today === target;
};

