import { getDb } from "../db";
import { ptoRecords } from "../db/schema";
import { eq, and, lte, gte } from "drizzle-orm";

/**
 * Check if an EA has active PTO for a given date
 * @param db Database instance
 * @param eaId EA user ID
 * @param dateTimestamp Date to check (Unix timestamp in seconds), defaults to now
 * @returns Active PTO record if found, null otherwise
 */
export const checkActivePTO = async (
  db: ReturnType<typeof getDb>,
  eaId: string,
  dateTimestamp?: number
): Promise<typeof ptoRecords.$inferSelect | null> => {
  const checkDate = dateTimestamp || Math.floor(Date.now() / 1000);

  const activePTO = await db
    .select()
    .from(ptoRecords)
    .where(
      and(
        eq(ptoRecords.eaId, eaId),
        lte(ptoRecords.startDate, checkDate),
        gte(ptoRecords.endDate, checkDate)
      )
    )
    .get();

  return activePTO || null;
};

/**
 * Check if an EA has active PTO (current date)
 */
export const isEAOutOfOffice = async (
  db: ReturnType<typeof getDb>,
  eaId: string
): Promise<boolean> => {
  const activePTO = await checkActivePTO(db, eaId);
  return activePTO !== null;
};

