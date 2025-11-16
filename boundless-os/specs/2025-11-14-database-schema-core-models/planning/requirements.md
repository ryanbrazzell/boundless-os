# Spec Requirements: Database Schema & Core Models

## Initial Description
Complete database schema for users, clients, EAs, pairings, reports, alerts, rules, coaching notes, and all relationships with migrations.

## Requirements Discussion

### Database Context
Based on the product mission, authentication requirements, and churn detection system, we need to store:
- Users (with roles: SUPER_ADMIN, Head of Client Success, Head of EAs, EA, CLIENT)
- Clients
- Executive Assistants (EAs) - subset of users with EA role
- EA-Client Pairings
- End of Day Reports (10 fields)
- Alerts (from churn detection rules)
- Alert Rules (26 rules with configuration)
- Coaching Notes (EA-level and pairing-level)
- 4-Week Accelerator data
- PTO/Out of Office records
- Company Announcements
- Start of Day attendance logs

### Technology Stack
- **Database**: D1 Database (SQLite at edge) via Cloudflare Workers
- **ORM**: Drizzle ORM (TypeScript-first)
- **Migrations**: Drizzle migrations system

### Core Tables Required

**Users Table:**
- id (UUID, primary key)
- email (text, unique, not null)
- name (text, not null)
- role (enum: SUPER_ADMIN, HEAD_CLIENT_SUCCESS, HEAD_EAS, EA, CLIENT)
- isActive (boolean, default true)
- emailVerified (boolean, default false)
- createdAt (timestamp)
- updatedAt (timestamp)
- Better Auth integration fields (handled by Better Auth)

**Clients Table:**
- id (UUID, primary key)
- name (text, not null)
- createdAt (timestamp)
- updatedAt (timestamp)

**EAs Table (extends Users):**
- id (UUID, primary key, references users.id)
- expectedShowUpTime (time, nullable)
- timezone (text, nullable)
- healthcareEligibilityDate (date, nullable)
- createdAt (timestamp)
- updatedAt (timestamp)

**Pairings Table:**
- id (UUID, primary key)
- eaId (UUID, references users.id where role=EA)
- clientId (UUID, references clients.id)
- startDate (date, not null)
- healthStatus (enum: GREEN, YELLOW, RED, nullable - manual override)
- healthStatusOverride (boolean, default false - indicates manual override)
- acceleratorEnabled (boolean, default false)
- acceleratorWeek (integer, nullable: 1, 2, 3, 4, null)
- acceleratorWeek1Goals (text, nullable)
- acceleratorWeek2Goals (text, nullable)
- acceleratorWeek3Goals (text, nullable)
- acceleratorWeek4Goals (text, nullable)
- createdAt (timestamp)
- updatedAt (timestamp)
- Unique constraint: (eaId, clientId)

**EndOfDayReports Table:**
- id (UUID, primary key)
- pairingId (UUID, references pairings.id)
- eaId (UUID, references users.id)
- reportDate (date, not null)
- workloadFeeling (enum: LIGHT, MODERATE, HEAVY, OVERWHELMING)
- workType (enum: NOT_MUCH, REGULAR, MIX, MOSTLY_NEW)
- feelingDuringWork (enum: GREAT, GOOD, OKAY, STRESSED)
- biggestWin (text, nullable)
- whatCompleted (text, nullable)
- pendingTasks (text, nullable)
- hadDailySync (boolean)
- difficulties (text, nullable)
- supportNeeded (text, nullable)
- additionalNotes (text, nullable)
- createdAt (timestamp)
- updatedAt (timestamp)
- Index on: (pairingId, reportDate), (eaId, reportDate)

**AlertRules Table:**
- id (UUID, primary key)
- name (text, not null)
- ruleNumber (integer, unique - corresponds to Rule #1-26)
- ruleType (enum: LOGIC, AI_TEXT)
- severity (enum: CRITICAL, HIGH, MEDIUM, LOW)
- isEnabled (boolean, default true)
- triggerCondition (jsonb - stores rule-specific configuration)
- dataSource (text - which fields to check)
- businessRationale (text)
- alertTitle (text)
- alertDescription (text)
- suggestedAction (text, nullable)
- adjustableThresholds (jsonb - stores threshold config)
- defaultThresholds (jsonb - stores default values)
- createdAt (timestamp)
- updatedAt (timestamp)

**Alerts Table:**
- id (UUID, primary key)
- pairingId (UUID, references pairings.id)
- ruleId (UUID, references alertRules.id)
- severity (enum: CRITICAL, HIGH, MEDIUM, LOW)
- status (enum: NEW, INVESTIGATING, WORKING_ON, RESOLVED)
- assignedTo (UUID, nullable, references users.id)
- detectedAt (timestamp, not null)
- resolvedAt (timestamp, nullable)
- evidence (jsonb - stores detection evidence, confidence, reasoning)
- notes (text, nullable)
- createdAt (timestamp)
- updatedAt (timestamp)
- Index on: (pairingId, status), (severity, status), (assignedTo, status)

**CoachingNotes Table:**
- id (UUID, primary key)
- noteType (enum: EA_LEVEL, PAIRING_LEVEL)
- eaId (UUID, references users.id, nullable - required if noteType=EA_LEVEL)
- pairingId (UUID, references pairings.id, nullable - required if noteType=PAIRING_LEVEL)
- content (text, not null)
- updatedBy (UUID, references users.id)
- createdAt (timestamp)
- updatedAt (timestamp)
- Unique constraint: (noteType, eaId) for EA_LEVEL, (noteType, pairingId) for PAIRING_LEVEL

**PTORecords Table:**
- id (UUID, primary key)
- eaId (UUID, references users.id)
- startDate (date, not null)
- endDate (date, not null)
- reason (enum: PTO, SICK, OTHER)
- createdAt (timestamp)
- updatedAt (timestamp)
- Index on: (eaId, startDate, endDate)

**StartOfDayLogs Table:**
- id (UUID, primary key)
- eaId (UUID, references users.id)
- logDate (date, not null)
- loggedAt (timestamp, not null)
- expectedShowUpTime (time)
- wasLate (boolean, default false)
- minutesLate (integer, nullable)
- createdAt (timestamp)
- Unique constraint: (eaId, logDate)

**CompanyAnnouncements Table:**
- id (UUID, primary key)
- title (text, not null)
- content (text, not null)
- isActive (boolean, default true)
- expiresAt (timestamp, nullable)
- createdBy (UUID, references users.id)
- createdAt (timestamp)
- updatedAt (timestamp)

### Relationships Summary

- Users → EAs (one-to-one, where role=EA)
- Users → Clients (many-to-many via Pairings)
- Pairings → EndOfDayReports (one-to-many)
- Pairings → Alerts (one-to-many)
- AlertRules → Alerts (one-to-many)
- Users → CoachingNotes (one-to-many, EA-level)
- Pairings → CoachingNotes (one-to-many, pairing-level)
- Users → PTORecords (one-to-many)
- Users → StartOfDayLogs (one-to-many)
- Users → CompanyAnnouncements (createdBy, one-to-many)

### Indexes for Performance

**Critical Indexes:**
- Pairings: (eaId, clientId) unique
- EndOfDayReports: (pairingId, reportDate), (eaId, reportDate)
- Alerts: (pairingId, status), (severity, status), (assignedTo, status)
- StartOfDayLogs: (eaId, logDate) unique
- PTORecords: (eaId, startDate, endDate) for date range queries

### Migration Strategy

- Use Drizzle migrations
- Version control all migrations
- Support rollback
- Test migrations on staging before production

### Data Integrity Constraints

- Foreign key constraints on all relationships
- Unique constraints where needed (pairings, coaching notes)
- Check constraints for enum values
- Not null constraints on required fields

## Requirements Summary

### Functional Requirements

**Core Tables:**
- Users table with role-based access
- Clients table
- EAs table (extends users)
- Pairings table (EA-Client relationships)
- EndOfDayReports table (10 fields)
- AlertRules table (26 rules with configuration)
- Alerts table (detected churn risks)
- CoachingNotes table (EA and pairing level)
- PTORecords table
- StartOfDayLogs table
- CompanyAnnouncements table

**Relationships:**
- All foreign key relationships defined
- Unique constraints where needed
- Proper indexing for query performance

**Migrations:**
- Drizzle migration system
- Version controlled
- Rollback support

### Scope Boundaries

**In Scope:**
- All core tables for MVP features
- Relationships and constraints
- Indexes for performance
- Migration system setup

**Out of Scope:**
- Advanced analytics tables (separate feature)
- Audit logging tables (can add later)
- Soft deletes (can add later if needed)

### Technical Considerations

**Database:**
- D1 Database (SQLite) via Cloudflare Workers
- Drizzle ORM for type-safe queries
- Edge-optimized schema design

**Performance:**
- Indexes on frequently queried fields
- Efficient foreign key relationships
- Consider query patterns from dashboards

**Scalability:**
- Schema designed to handle growth
- Migration path to Neon Postgres if D1 insufficient

