import {
  pgTable,
  text,
  integer,
  boolean,
  bigint,
  index,
  uniqueIndex,
  pgEnum,
  timestamp,
} from "drizzle-orm/pg-core";

// Helper function to generate UUID (works in Cloudflare Workers)
function generateUUID(): string {
  return crypto.randomUUID();
}

// Helper function to get current timestamp as Unix seconds
function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

export const userRoleValues = ["SUPER_ADMIN", "HEAD_CLIENT_SUCCESS", "HEAD_EAS", "EA", "CLIENT"] as const;
export const userRoleEnum = pgEnum("user_role", userRoleValues);
export type UserRole = typeof userRoleValues[number];

// Users table (Better Auth compatible)
export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey().$defaultFn(generateUUID),
    email: text("email").notNull(),
    name: text("name").notNull(),
    emailVerified: boolean("email_verified").notNull().default(false),
    password: text("password"),
    role: userRoleEnum("role").notNull().$type<UserRole>(),
    isActive: boolean("is_active").notNull().default(true),
    image: text("image"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("users_email_idx").on(table.email),
    index("users_role_idx").on(table.role),
  ]
);

// Better Auth session table
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  token: text("token").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Better Auth account table (for OAuth providers)
export const accounts = pgTable("accounts", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  providerId: text("provider_id").notNull(),
  accountId: text("account_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Better Auth verification table (for email verification)
export const verifications = pgTable("verifications", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Clients table
export const clients = pgTable(
  "clients",
  {
    id: text("id").primaryKey().$defaultFn(generateUUID),
    name: text("name").notNull(),
    createdAt: bigint("created_at", { mode: "number" }).notNull().$defaultFn(getCurrentTimestamp),
    updatedAt: bigint("updated_at", { mode: "number" }).notNull().$defaultFn(getCurrentTimestamp),
  },
  (table) => [
    index("clients_name_idx").on(table.name),
  ]
);

// EAs table (extends Users)
export const eas = pgTable(
  "eas",
  {
    id: text("id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
    expectedShowUpTime: text("expected_show_up_time"), // Time stored as text (HH:MM format)
    timezone: text("timezone"), // IANA timezone string (e.g., "America/New_York")
    healthcareEligibilityDate: bigint("healthcare_eligibility_date", { mode: "number" }),
    createdAt: bigint("created_at", { mode: "number" }).notNull().$defaultFn(getCurrentTimestamp),
    updatedAt: bigint("updated_at", { mode: "number" }).notNull().$defaultFn(getCurrentTimestamp),
  },
  (table) => [
    uniqueIndex("eas_id_idx").on(table.id),
  ]
);

// Enums for Pairings
export const healthStatusValues = ["GREEN", "YELLOW", "RED"] as const;
export const healthStatusEnum = pgEnum("health_status", healthStatusValues);
export type HealthStatus = typeof healthStatusValues[number];

// Pairings table
export const pairings = pgTable(
  "pairings",
  {
    id: text("id").primaryKey().$defaultFn(generateUUID),
    eaId: text("ea_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    clientId: text("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
    startDate: bigint("start_date", { mode: "number" }).notNull(),
    healthStatus: healthStatusEnum("health_status").$type<HealthStatus>(),
    healthStatusOverride: boolean("health_status_override").notNull().default(false),
    acceleratorEnabled: boolean("accelerator_enabled").notNull().default(false),
    acceleratorWeek: integer("accelerator_week"), // 1, 2, 3, 4, or null
    acceleratorWeek1Goals: text("accelerator_week1_goals"),
    acceleratorWeek2Goals: text("accelerator_week2_goals"),
    acceleratorWeek3Goals: text("accelerator_week3_goals"),
    acceleratorWeek4Goals: text("accelerator_week4_goals"),
    createdAt: bigint("created_at", { mode: "number" }).notNull().$defaultFn(getCurrentTimestamp),
    updatedAt: bigint("updated_at", { mode: "number" }).notNull().$defaultFn(getCurrentTimestamp),
  },
  (table) => [
    uniqueIndex("pairings_ea_client_idx").on(table.eaId, table.clientId),
    index("pairings_ea_idx").on(table.eaId),
    index("pairings_client_idx").on(table.clientId),
  ]
);

// Enums for EndOfDayReports
export const workloadFeelingValues = ["LIGHT", "MODERATE", "HEAVY", "OVERWHELMING"] as const;
export const workloadFeelingEnum = pgEnum("workload_feeling", workloadFeelingValues);
export type WorkloadFeeling = typeof workloadFeelingValues[number];

export const workTypeValues = ["NOT_MUCH", "REGULAR", "MIX", "MOSTLY_NEW"] as const;
export const workTypeEnum = pgEnum("work_type", workTypeValues);
export type WorkType = typeof workTypeValues[number];

export const feelingDuringWorkValues = ["GREAT", "GOOD", "OKAY", "STRESSED"] as const;
export const feelingDuringWorkEnum = pgEnum("feeling_during_work", feelingDuringWorkValues);
export type FeelingDuringWork = typeof feelingDuringWorkValues[number];

// EndOfDayReports table
export const endOfDayReports = pgTable(
  "end_of_day_reports",
  {
    id: text("id").primaryKey().$defaultFn(generateUUID),
    pairingId: text("pairing_id").notNull().references(() => pairings.id, { onDelete: "cascade" }),
    eaId: text("ea_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    reportDate: bigint("report_date", { mode: "number" }).notNull(),
    // Section 1: Client-Facing Questions
    workloadFeeling: workloadFeelingEnum("workload_feeling").notNull().$type<WorkloadFeeling>(),
    workType: workTypeEnum("work_type").notNull().$type<WorkType>(),
    feelingDuringWork: feelingDuringWorkEnum("feeling_during_work").notNull().$type<FeelingDuringWork>(),
    biggestWin: text("biggest_win").notNull(),
    whatCompleted: text("what_completed").notNull(),
    pendingTasks: text("pending_tasks"), // Optional
    hadDailySync: boolean("had_daily_sync").notNull(),
    // Section 2: Internal Team Questions
    difficulties: text("difficulties"), // Optional
    supportNeeded: text("support_needed"), // Optional
    additionalNotes: text("additional_notes"), // Optional
    createdAt: bigint("created_at", { mode: "number" }).notNull().$defaultFn(getCurrentTimestamp),
    updatedAt: bigint("updated_at", { mode: "number" }).notNull().$defaultFn(getCurrentTimestamp),
  },
  (table) => [
    uniqueIndex("reports_pairing_date_idx").on(table.pairingId, table.reportDate),
    index("reports_pairing_idx").on(table.pairingId),
    index("reports_ea_date_idx").on(table.eaId, table.reportDate),
    index("reports_date_idx").on(table.reportDate),
  ]
);

// Enums for AlertRules
export const ruleTypeValues = ["LOGIC", "AI_TEXT"] as const;
export const ruleTypeEnum = pgEnum("rule_type", ruleTypeValues);
export type RuleType = typeof ruleTypeValues[number];

export const severityValues = ["CRITICAL", "HIGH", "MEDIUM", "LOW"] as const;
export const severityEnum = pgEnum("severity", severityValues);
export type Severity = typeof severityValues[number];

// AlertRules table
export const alertRules = pgTable(
  "alert_rules",
  {
    id: text("id").primaryKey().$defaultFn(generateUUID),
    name: text("name").notNull(),
    ruleNumber: integer("rule_number").notNull(), // Rule #1-26
    ruleType: text("rule_type", { enum: ruleTypeEnum }).notNull().$type<RuleType>(),
    severity: severityEnum("severity").notNull().$type<Severity>(),
    isEnabled: boolean("is_enabled").notNull().default(true),
    triggerCondition: text("trigger_condition"), // JSON stored as text (SQLite doesn't have native JSONB)
    dataSource: text("data_source"), // Which fields to check
    businessRationale: text("business_rationale"),
    alertTitle: text("alert_title").notNull(),
    alertDescription: text("alert_description").notNull(),
    suggestedAction: text("suggested_action"), // Optional
    adjustableThresholds: text("adjustable_thresholds"), // JSON stored as text
    defaultThresholds: text("default_thresholds"), // JSON stored as text
    createdAt: bigint("created_at", { mode: "number" }).notNull().$defaultFn(getCurrentTimestamp),
    updatedAt: bigint("updated_at", { mode: "number" }).notNull().$defaultFn(getCurrentTimestamp),
  },
  (table) => [
    uniqueIndex("alert_rules_rule_number_idx").on(table.ruleNumber),
    index("alert_rules_is_enabled_idx").on(table.isEnabled),
    index("alert_rules_rule_type_idx").on(table.ruleType),
  ]
);

// Enums for Alerts
export const alertStatusValues = ["NEW", "INVESTIGATING", "WORKING_ON", "RESOLVED"] as const;
export const alertStatusEnum = pgEnum("alert_status", alertStatusValues);
export type AlertStatus = typeof alertStatusValues[number];

// Alerts table
export const alerts = pgTable(
  "alerts",
  {
    id: text("id").primaryKey().$defaultFn(generateUUID),
    pairingId: text("pairing_id").notNull().references(() => pairings.id, { onDelete: "cascade" }),
    ruleId: text("rule_id").notNull().references(() => alertRules.id, { onDelete: "cascade" }),
    severity: severityEnum("severity").notNull().$type<Severity>(),
    status: alertStatusEnum("status").notNull().$type<AlertStatus>().default("NEW"),
    assignedTo: text("assigned_to").references(() => users.id, { onDelete: "set null" }), // Nullable
    detectedAt: bigint("detected_at", { mode: "number" }).notNull().$defaultFn(getCurrentTimestamp),
    resolvedAt: bigint("resolved_at", { mode: "number" }),
    evidence: text("evidence"), // JSON stored as text (stores detection evidence, confidence, reasoning)
    notes: text("notes"), // Nullable
    createdAt: bigint("created_at", { mode: "number" }).notNull().$defaultFn(getCurrentTimestamp),
    updatedAt: bigint("updated_at", { mode: "number" }).notNull().$defaultFn(getCurrentTimestamp),
  },
  (table) => [
    index("alerts_pairing_status_idx").on(table.pairingId, table.status),
    index("alerts_severity_status_idx").on(table.severity, table.status),
    index("alerts_assigned_status_idx").on(table.assignedTo, table.status),
    index("alerts_detected_at_idx").on(table.detectedAt),
  ]
);

// Enums for CoachingNotes
export const noteTypeValues = ["EA_LEVEL", "PAIRING_LEVEL"] as const;
export const noteTypeEnum = pgEnum("note_type", noteTypeValues);
export type NoteType = typeof noteTypeValues[number];

// CoachingNotes table
export const coachingNotes = pgTable(
  "coaching_notes",
  {
    id: text("id").primaryKey().$defaultFn(generateUUID),
    noteType: noteTypeEnum("note_type").notNull().$type<NoteType>(),
    eaId: text("ea_id").references(() => users.id, { onDelete: "cascade" }), // Nullable, required if noteType=EA_LEVEL
    pairingId: text("pairing_id").references(() => pairings.id, { onDelete: "cascade" }), // Nullable, required if noteType=PAIRING_LEVEL
    content: text("content").notNull(),
    updatedBy: text("updated_by").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: bigint("created_at", { mode: "number" }).notNull().$defaultFn(getCurrentTimestamp),
    updatedAt: bigint("updated_at", { mode: "number" }).notNull().$defaultFn(getCurrentTimestamp),
  },
  (table) => [
    // Unique constraint: (noteType, eaId) for EA_LEVEL, (noteType, pairingId) for PAIRING_LEVEL
    // Note: SQLite doesn't support partial unique indexes, so we'll enforce this at application level
    // or use a composite unique index that allows nulls
    uniqueIndex("coaching_notes_ea_idx").on(table.noteType, table.eaId),
    uniqueIndex("coaching_notes_pairing_idx").on(table.noteType, table.pairingId),
  ]
);

// Enums for PTORecords
export const ptoReasonValues = ["PTO", "SICK", "OTHER"] as const;
export const ptoReasonEnum = pgEnum("pto_reason", ptoReasonValues);
export type PtoReason = typeof ptoReasonValues[number];

// PTORecords table
export const ptoRecords = pgTable(
  "pto_records",
  {
    id: text("id").primaryKey().$defaultFn(generateUUID),
    eaId: text("ea_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    startDate: bigint("start_date", { mode: "number" }).notNull(),
    endDate: bigint("end_date", { mode: "number" }).notNull(),
    reason: ptoReasonEnum("reason").notNull().$type<PtoReason>(),
    createdAt: bigint("created_at", { mode: "number" }).notNull().$defaultFn(getCurrentTimestamp),
    updatedAt: bigint("updated_at", { mode: "number" }).notNull().$defaultFn(getCurrentTimestamp),
  },
  (table) => [
    index("pto_records_ea_dates_idx").on(table.eaId, table.startDate, table.endDate),
  ]
);

// StartOfDayLogs table
export const startOfDayLogs = pgTable(
  "start_of_day_logs",
  {
    id: text("id").primaryKey().$defaultFn(generateUUID),
    eaId: text("ea_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    logDate: bigint("log_date", { mode: "number" }).notNull(),
    loggedAt: bigint("logged_at", { mode: "number" }).notNull().$defaultFn(getCurrentTimestamp),
    expectedShowUpTime: text("expected_show_up_time"), // Time stored as text (HH:MM format)
    wasLate: boolean("was_late").notNull().default(false),
    minutesLate: integer("minutes_late"), // Nullable
    createdAt: bigint("created_at", { mode: "number" }).notNull().$defaultFn(getCurrentTimestamp),
  },
  (table) => [
    uniqueIndex("start_of_day_logs_ea_date_idx").on(table.eaId, table.logDate),
    index("start_of_day_logs_ea_idx").on(table.eaId),
    index("start_of_day_logs_date_idx").on(table.logDate),
  ]
);

// CompanyAnnouncements table
export const companyAnnouncements = pgTable(
  "company_announcements",
  {
    id: text("id").primaryKey().$defaultFn(generateUUID),
    title: text("title").notNull(),
    content: text("content").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    expiresAt: bigint("expires_at", { mode: "number" }),
    createdBy: text("created_by").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: bigint("created_at", { mode: "number" }).notNull().$defaultFn(getCurrentTimestamp),
    updatedAt: bigint("updated_at", { mode: "number" }).notNull().$defaultFn(getCurrentTimestamp),
  },
  (table) => [
    index("announcements_active_expires_idx").on(table.isActive, table.expiresAt),
  ]
);

// PatternState table (for pattern-over-time detection)
export const patternState = pgTable(
  "pattern_state",
  {
    id: text("id").primaryKey().$defaultFn(generateUUID),
    pairingId: text("pairing_id").notNull().references(() => pairings.id, { onDelete: "cascade" }),
    ruleId: text("rule_id").notNull().references(() => alertRules.id, { onDelete: "cascade" }),
    occurrences: integer("occurrences").notNull().default(0),
    windowStart: bigint("window_start", { mode: "number" }).notNull(),
    windowEnd: bigint("window_end", { mode: "number" }).notNull(),
    windowDays: integer("window_days").notNull(),
    createdAt: bigint("created_at", { mode: "number" }).notNull().$defaultFn(getCurrentTimestamp),
    updatedAt: bigint("updated_at", { mode: "number" }).notNull().$defaultFn(getCurrentTimestamp),
  },
  (table) => [
    uniqueIndex("pattern_state_pairing_rule_idx").on(table.pairingId, table.ruleId),
    index("pattern_state_pairing_idx").on(table.pairingId),
    index("pattern_state_window_end_idx").on(table.windowEnd),
  ]
);
