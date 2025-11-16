import { getDb } from "../db";
import { pairings, alerts, endOfDayReports, severityEnum, alertStatusEnum } from "../db/schema";
import { eq, and, ne, desc, gte, lte } from "drizzle-orm";

// Helper function to calculate business days between two dates
const businessDaysBetween = (startTimestamp: number, endTimestamp: number): number => {
  const start = new Date(startTimestamp * 1000);
  const end = new Date(endTimestamp * 1000);
  
  let count = 0;
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

// Helper function to get business days ago timestamp
const getBusinessDaysAgoTimestamp = (days: number): number => {
  const now = Date.now();
  let current = new Date(now);
  let businessDaysCounted = 0;
  
  while (businessDaysCounted < days) {
    current.setDate(current.getDate() - 1);
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      businessDaysCounted++;
    }
  }
  
  return Math.floor(current.getTime() / 1000);
};

export interface HealthCalculationResult {
  healthStatus: "GREEN" | "YELLOW" | "RED";
  calculatedAt: number;
  isOverride: boolean;
  reason: string;
}

export const calculatePairingHealth = async (
  db: ReturnType<typeof getDb>,
  pairingId: string
): Promise<HealthCalculationResult> => {
  // Get pairing
  const pairing = await db.select().from(pairings).where(eq(pairings.id, pairingId)).get();
  
  if (!pairing) {
    throw new Error("Pairing not found");
  }

  // Check manual override first
  if (pairing.healthStatusOverride && pairing.healthStatus) {
    return {
      healthStatus: pairing.healthStatus,
      calculatedAt: Math.floor(Date.now() / 1000),
      isOverride: true,
      reason: "Manual override",
    };
  }

  // Get active alerts (not resolved)
  const activeAlerts = await db
    .select()
    .from(alerts)
    .where(
      and(
        eq(alerts.pairingId, pairingId),
        ne(alerts.status, "RESOLVED")
      )
    )
    .all();

  // Count alerts by severity
  const criticalAlerts = activeAlerts.filter((a) => a.severity === "CRITICAL");
  const highAlerts = activeAlerts.filter((a) => a.severity === "HIGH");
  const mediumAlerts = activeAlerts.filter((a) => a.severity === "MEDIUM");

  // Get most recent report
  const mostRecentReport = await db
    .select()
    .from(endOfDayReports)
    .where(eq(endOfDayReports.pairingId, pairingId))
    .orderBy(desc(endOfDayReports.reportDate))
    .get();

  // Check RED conditions
  if (criticalAlerts.length > 0) {
    return {
      healthStatus: "RED",
      calculatedAt: Math.floor(Date.now() / 1000),
      isOverride: false,
      reason: `Has ${criticalAlerts.length} active CRITICAL alert(s)`,
    };
  }

  // Check report recency (2+ business days missing)
  if (!mostRecentReport) {
    return {
      healthStatus: "RED",
      calculatedAt: Math.floor(Date.now() / 1000),
      isOverride: false,
      reason: "No reports submitted",
    };
  }

  const now = Math.floor(Date.now() / 1000);
  const businessDaysSinceReport = businessDaysBetween(mostRecentReport.reportDate, now);
  
  if (businessDaysSinceReport > 2) {
    return {
      healthStatus: "RED",
      calculatedAt: Math.floor(Date.now() / 1000),
      isOverride: false,
      reason: `No report in ${businessDaysSinceReport} business days`,
    };
  }

  // Check for "Overwhelming" workload
  if (mostRecentReport.workloadFeeling === "OVERWHELMING") {
    return {
      healthStatus: "RED",
      calculatedAt: Math.floor(Date.now() / 1000),
      isOverride: false,
      reason: "Latest report indicates overwhelming workload",
    };
  }

  // Check YELLOW conditions
  if (highAlerts.length > 0) {
    return {
      healthStatus: "YELLOW",
      calculatedAt: Math.floor(Date.now() / 1000),
      isOverride: false,
      reason: `Has ${highAlerts.length} active HIGH alert(s)`,
    };
  }

  if (mediumAlerts.length >= 3) {
    return {
      healthStatus: "YELLOW",
      calculatedAt: Math.floor(Date.now() / 1000),
      isOverride: false,
      reason: `Has ${mediumAlerts.length} active MEDIUM alert(s)`,
    };
  }

  // Check for no daily syncs (3+ days in last 7)
  const sevenDaysAgo = now - 7 * 24 * 60 * 60;
  const recentReports = await db
    .select()
    .from(endOfDayReports)
    .where(
      and(
        eq(endOfDayReports.pairingId, pairingId),
        gte(endOfDayReports.reportDate, sevenDaysAgo)
      )
    )
    .all();

  const reportsWithoutSync = recentReports.filter((r) => !r.hadDailySync);
  if (reportsWithoutSync.length >= 3) {
    return {
      healthStatus: "YELLOW",
      calculatedAt: Math.floor(Date.now() / 1000),
      isOverride: false,
      reason: "No daily syncs for 3+ days in last 7 days",
    };
  }

  // Check for sustained workload patterns (5+ consecutive days)
  if (recentReports.length >= 5) {
    const last5Reports = recentReports.slice(0, 5);
    const allHeavy = last5Reports.every((r) => r.workloadFeeling === "HEAVY");
    const allLight = last5Reports.every((r) => r.workloadFeeling === "LIGHT");
    
    if (allHeavy) {
      return {
        healthStatus: "YELLOW",
        calculatedAt: Math.floor(Date.now() / 1000),
        isOverride: false,
        reason: "Heavy workload sustained for 5+ consecutive days",
      };
    }
    
    if (allLight) {
      return {
        healthStatus: "YELLOW",
        calculatedAt: Math.floor(Date.now() / 1000),
        isOverride: false,
        reason: "Light workload sustained for 5+ consecutive days",
      };
    }
  }

  // Check for no wins (10+ business days)
  const tenBusinessDaysAgo = getBusinessDaysAgoTimestamp(10);
  const reportsWithoutWins = await db
    .select()
    .from(endOfDayReports)
    .where(
      and(
        eq(endOfDayReports.pairingId, pairingId),
        gte(endOfDayReports.reportDate, tenBusinessDaysAgo),
        eq(endOfDayReports.biggestWin, "")
      )
    )
    .all();

  if (reportsWithoutWins.length >= 10) {
    return {
      healthStatus: "YELLOW",
      calculatedAt: Math.floor(Date.now() / 1000),
      isOverride: false,
      reason: "No wins reported for 10+ business days",
    };
  }

  // GREEN - all conditions met
  return {
    healthStatus: "GREEN",
    calculatedAt: Math.floor(Date.now() / 1000),
    isOverride: false,
    reason: "No critical issues, reports current, healthy indicators present",
  };
};

