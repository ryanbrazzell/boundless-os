import { getDb } from "../db";
import { endOfDayReports, pairings, users, clients } from "../db/schema";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";

export interface AnalyticsTrends {
  period: {
    startDate: number;
    endDate: number;
  };
  submissionRates: {
    totalReports: number;
    averagePerEA: number;
    reportsPerDay: Array<{ date: number; count: number }>;
  };
  workloadDistribution: {
    LIGHT: number;
    MODERATE: number;
    HEAVY: number;
    OVERWHELMING: number;
  };
  moodDistribution: {
    GREAT: number;
    GOOD: number;
    OKAY: number;
    STRESSED: number;
  };
  dailySyncFrequency: {
    percentage: number;
    total: number;
    withSync: number;
  };
  winReportingFrequency: {
    percentage: number;
    total: number;
    withWins: number;
  };
}

/**
 * Calculate analytics trends for reports
 */
export const calculateAnalyticsTrends = async (
  db: ReturnType<typeof getDb>,
  filters: {
    eaId?: string;
    clientId?: string;
    pairingId?: string;
    period: "7d" | "30d" | "90d" | "custom";
    startDate?: number;
    endDate?: number;
  }
): Promise<AnalyticsTrends> => {
  const now = Math.floor(Date.now() / 1000);
  let startDate: number;
  let endDate: number = now;

  // Calculate period dates
  switch (filters.period) {
    case "7d":
      startDate = now - 7 * 24 * 60 * 60;
      break;
    case "30d":
      startDate = now - 30 * 24 * 60 * 60;
      break;
    case "90d":
      startDate = now - 90 * 24 * 60 * 60;
      break;
    case "custom":
      startDate = filters.startDate || now - 30 * 24 * 60 * 60;
      endDate = filters.endDate || now;
      break;
  }

  // Build base query
  let query = db
    .select({
      id: endOfDayReports.id,
      reportDate: endOfDayReports.reportDate,
      workloadFeeling: endOfDayReports.workloadFeeling,
      feelingDuringWork: endOfDayReports.feelingDuringWork,
      hadDailySync: endOfDayReports.hadDailySync,
      biggestWin: endOfDayReports.biggestWin,
      eaId: endOfDayReports.eaId,
      pairingId: endOfDayReports.pairingId,
    })
    .from(endOfDayReports)
    .where(and(gte(endOfDayReports.reportDate, startDate), lte(endOfDayReports.reportDate, endDate)));

  // Apply filters
  if (filters.eaId) {
    query = query.where(eq(endOfDayReports.eaId, filters.eaId)) as any;
  }
  if (filters.pairingId) {
    query = query.where(eq(endOfDayReports.pairingId, filters.pairingId)) as any;
  }
  if (filters.clientId) {
    query = query
      .innerJoin(pairings, eq(endOfDayReports.pairingId, pairings.id))
      .where(eq(pairings.clientId, filters.clientId)) as any;
  }

  const reports = await query.all();

  // Calculate submission rates
  const totalReports = reports.length;
  const uniqueEAs = new Set(reports.map((r) => r.eaId)).size;
  const averagePerEA = uniqueEAs > 0 ? totalReports / uniqueEAs : 0;

  // Calculate reports per day
  const reportsPerDayMap = new Map<number, number>();
  reports.forEach((report) => {
    const day = Math.floor(report.reportDate / (24 * 60 * 60)) * (24 * 60 * 60);
    reportsPerDayMap.set(day, (reportsPerDayMap.get(day) || 0) + 1);
  });
  const reportsPerDay = Array.from(reportsPerDayMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date - b.date);

  // Calculate workload distribution
  const workloadDistribution = {
    LIGHT: 0,
    MODERATE: 0,
    HEAVY: 0,
    OVERWHELMING: 0,
  };
  reports.forEach((report) => {
    if (report.workloadFeeling in workloadDistribution) {
      workloadDistribution[report.workloadFeeling as keyof typeof workloadDistribution]++;
    }
  });

  // Calculate mood distribution
  const moodDistribution = {
    GREAT: 0,
    GOOD: 0,
    OKAY: 0,
    STRESSED: 0,
  };
  reports.forEach((report) => {
    if (report.feelingDuringWork in moodDistribution) {
      moodDistribution[report.feelingDuringWork as keyof typeof moodDistribution]++;
    }
  });

  // Calculate daily sync frequency
  const withSync = reports.filter((r) => r.hadDailySync).length;
  const dailySyncFrequency = {
    percentage: totalReports > 0 ? (withSync / totalReports) * 100 : 0,
    total: totalReports,
    withSync,
  };

  // Calculate win reporting frequency
  const withWins = reports.filter((r) => r.biggestWin && r.biggestWin.trim().length > 0).length;
  const winReportingFrequency = {
    percentage: totalReports > 0 ? (withWins / totalReports) * 100 : 0,
    total: totalReports,
    withWins,
  };

  return {
    period: {
      startDate,
      endDate,
    },
    submissionRates: {
      totalReports,
      averagePerEA,
      reportsPerDay,
    },
    workloadDistribution,
    moodDistribution,
    dailySyncFrequency,
    winReportingFrequency,
  };
};

