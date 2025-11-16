# Task Breakdown: Database Schema & Core Models

## Overview
Total Tasks: 15

## Task List

### Database Layer

#### Task Group 1: Core Schema Setup
**Dependencies:** None

- [x] 1.0 Set up Drizzle ORM and D1 Database configuration
  - [x] 1.1 Write 2-8 focused tests for database connection and basic queries
    - Test D1 database connection
    - Test basic SELECT query
    - Test Drizzle ORM setup
    - Limit to 2-8 highly focused tests maximum
  - [x] 1.2 Configure Drizzle with D1 Database
    - Set up Drizzle config file
    - Configure D1 binding in wrangler.toml
    - Set up database connection
    - Reference ShadFlareAi repository patterns
  - [x] 1.3 Create database migration system
    - Set up Drizzle migrations directory structure
    - Configure migration commands
    - Test migration up/down functionality
  - [x] 1.4 Ensure database connection tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify D1 connection works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Drizzle ORM configured correctly
- Migration system functional
- Database connection established

#### Task Group 2: Core Tables Creation
**Dependencies:** Task Group 1

- [x] 2.0 Create core user and client tables
  - [x] 2.1 Write 2-8 focused tests for Users and Clients models
    - Test Users table creation and queries
    - Test Clients table creation and queries
    - Test role enum validation
    - Limit to 2-8 highly focused tests maximum
  - [x] 2.2 Create Users table schema (Drizzle)
    - Fields: id (UUID), email (unique), name, role (enum), isActive, emailVerified, Better Auth fields, timestamps
    - Enum for role: SUPER_ADMIN, HEAD_CLIENT_SUCCESS, HEAD_EAS, EA, CLIENT
    - Indexes: email (unique), role
    - Reference Database Schema spec
  - [x] 2.3 Create Clients table schema (Drizzle)
    - Fields: id (UUID), name, timestamps
    - Indexes: name
  - [x] 2.4 Create EAs table schema (Drizzle)
    - Fields: id (references users), expectedShowUpTime, timezone, healthcareEligibilityDate, timestamps
    - Foreign key to Users table
    - Indexes: id (unique)
  - [x] 2.5 Create migration files for core tables
    - Migration for Users table
    - Migration for Clients table
    - Migration for EAs table
    - Test migrations up/down
  - [x] 2.6 Ensure core tables tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify tables created correctly
    - Verify foreign keys work
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- Users, Clients, EAs tables created
- Migrations run successfully
- Foreign keys and indexes work

#### Task Group 3: Pairings and Reports Tables
**Dependencies:** Task Group 2

- [x] 3.0 Create pairings and reports tables
  - [x] 3.1 Write 2-8 focused tests for Pairings and Reports models
    - Test Pairings table creation and unique constraint
    - Test EndOfDayReports table creation and queries
    - Test foreign key relationships
    - Limit to 2-8 highly focused tests maximum
  - [x] 3.2 Create Pairings table schema (Drizzle)
    - Fields: id, eaId, clientId, startDate, healthStatus (enum), healthStatusOverride, accelerator fields, timestamps
    - Unique constraint: (eaId, clientId)
    - Foreign keys: eaId → Users, clientId → Clients
    - Indexes: (eaId, clientId) unique, eaId, clientId
  - [x] 3.3 Create EndOfDayReports table schema (Drizzle)
    - Fields: id, pairingId, eaId, reportDate, all 10 report fields (enums and text), timestamps
    - Foreign keys: pairingId → Pairings, eaId → Users
    - Indexes: (pairingId, reportDate), (eaId, reportDate), reportDate
  - [x] 3.4 Create migration files for pairings and reports
    - Migration for Pairings table
    - Migration for EndOfDayReports table
    - Test migrations
  - [x] 3.5 Ensure pairings and reports tests pass
    - Run ONLY the 2-8 tests written in 3.1
    - Verify unique constraints work
    - Verify indexes work
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 3.1 pass
- Pairings and EndOfDayReports tables created
- Unique constraints enforced
- Indexes created correctly

#### Task Group 4: Alerts and Rules Tables
**Dependencies:** Task Group 3

- [x] 4.0 Create alerts and rules tables
  - [x] 4.1 Write 2-8 focused tests for Alerts and AlertRules models
    - Test AlertRules table creation and queries
    - Test Alerts table creation and relationships
    - Test JSONB fields (triggerCondition, evidence)
    - Limit to 2-8 highly focused tests maximum
  - [x] 4.2 Create AlertRules table schema (Drizzle)
    - Fields: id, name, ruleNumber (unique), ruleType (enum), severity (enum), isEnabled, triggerCondition (JSONB), dataSource, businessRationale, alertTitle, alertDescription, suggestedAction, adjustableThresholds (JSONB), defaultThresholds (JSONB), timestamps
    - Indexes: ruleNumber (unique), isEnabled, ruleType
  - [x] 4.3 Create Alerts table schema (Drizzle)
    - Fields: id, pairingId, ruleId, severity (enum), status (enum), assignedTo, detectedAt, resolvedAt, evidence (JSONB), notes, timestamps
    - Foreign keys: pairingId → Pairings, ruleId → AlertRules, assignedTo → Users
    - Indexes: (pairingId, status), (severity, status), (assignedTo, status), detectedAt
  - [x] 4.4 Create migration files for alerts and rules
    - Migration for AlertRules table
    - Migration for Alerts table
    - Seed default 26 rules from Churn Detection System spec (deferred to seed script)
    - Test migrations
  - [x] 4.5 Ensure alerts and rules tests pass
    - Run ONLY the 2-8 tests written in 4.1
    - Verify JSONB fields work
    - Verify indexes work
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 4.1 pass
- AlertRules and Alerts tables created
- JSONB fields store/retrieve correctly
- Default rules seeded

#### Task Group 5: Supporting Tables
**Dependencies:** Task Group 2

- [x] 5.0 Create supporting tables (coaching notes, PTO, logs, announcements)
  - [x] 5.1 Write 2-8 focused tests for supporting tables
    - Test CoachingNotes table with unique constraints
    - Test PTORecords table with date ranges
    - Test StartOfDayLogs table with unique constraint
    - Limit to 2-8 highly focused tests maximum
  - [x] 5.2 Create CoachingNotes table schema (Drizzle)
    - Fields: id, noteType (enum), eaId (nullable), pairingId (nullable), content, updatedBy, timestamps
    - Unique constraints: (noteType, eaId) for EA-level, (noteType, pairingId) for pairing-level
    - Foreign keys: eaId → Users, pairingId → Pairings, updatedBy → Users
  - [x] 5.3 Create PTORecords table schema (Drizzle)
    - Fields: id, eaId, startDate, endDate, reason (enum), timestamps
    - Foreign key: eaId → Users
    - Indexes: (eaId, startDate, endDate) for date range queries
  - [x] 5.4 Create StartOfDayLogs table schema (Drizzle)
    - Fields: id, eaId, logDate, loggedAt, expectedShowUpTime, wasLate, minutesLate, timestamps
    - Unique constraint: (eaId, logDate)
    - Foreign key: eaId → Users
    - Indexes: (eaId, logDate) unique, eaId, logDate
  - [x] 5.5 Create CompanyAnnouncements table schema (Drizzle)
    - Fields: id, title, content, isActive, expiresAt (nullable), createdBy, timestamps
    - Foreign key: createdBy → Users
    - Indexes: (isActive, expiresAt) for active announcement queries
  - [x] 5.6 Create migration files for supporting tables
    - Migration for CoachingNotes
    - Migration for PTORecords
    - Migration for StartOfDayLogs
    - Migration for CompanyAnnouncements
    - Test migrations
  - [x] 5.7 Ensure supporting tables tests pass
    - Run ONLY the 2-8 tests written in 5.1
    - Verify unique constraints work
    - Verify date range queries work
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 5.1 pass
- All supporting tables created
- Unique constraints enforced
- Indexes created correctly

### Testing

#### Task Group 6: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-5

- [x] 6.0 Review existing tests and fill critical gaps only
  - [x] 6.1 Review tests from Task Groups 1-5
    - Review the 2-8 tests from Task 1.1 (3 tests)
    - Review the 2-8 tests from Task 2.1 (5 tests)
    - Review the 2-8 tests from Task 3.1 (5 tests)
    - Review the 2-8 tests from Task 4.1 (6 tests)
    - Review the 2-8 tests from Task 5.1 (8 tests)
    - Total existing tests: 27 tests
  - [x] 6.2 Analyze test coverage gaps for database schema only
    - Identify critical relationships that lack test coverage
    - Focus on foreign key integrity
    - Focus on unique constraint enforcement
    - Focus on index performance
  - [x] 6.3 Write up to 10 additional strategic tests maximum
    - Test foreign key cascades (if applicable)
    - Test complex queries using indexes
    - Test migration rollback
    - Test data integrity constraints
  - [x] 6.4 Run database schema tests only
    - Run ONLY tests related to database schema (tests from 1.1, 2.1, 3.1, 4.1, 5.1, and 6.3)
    - Expected total: approximately 20-50 tests maximum
    - Do NOT run entire application test suite
    - Verify all migrations work
    - Verify all constraints enforced

**Acceptance Criteria:**
- All database schema tests pass (37 tests total)
- All migrations run successfully
- All constraints enforced correctly
- 10 additional strategic tests added (integrity constraints)

## Execution Order

Recommended implementation sequence:
1. Core Schema Setup (Task Group 1)
2. Core Tables Creation (Task Group 2)
3. Pairings and Reports Tables (Task Group 3)
4. Alerts and Rules Tables (Task Group 4)
5. Supporting Tables (Task Group 5)
6. Test Review & Gap Analysis (Task Group 6)

