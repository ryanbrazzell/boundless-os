/**
 * Date utility functions for frontend
 */

/**
 * Format timestamp to YYYY-MM-DD
 */
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toISOString().split("T")[0];
};

/**
 * Format timestamp to readable date string
 */
export const formatDateReadable = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

