# Specification: Database Schema & Core Models

## Goal
Create complete database schema using Drizzle ORM with D1 Database for all core entities (users, clients, EAs, pairings, reports, alerts, rules, coaching notes) with proper relationships, indexes, and migration system.

## User Stories
- As a developer, I want a complete database schema so that all features can store and retrieve data correctly
- As an admin, I want data integrity constraints so that invalid data cannot be stored
- As the system, I want efficient indexes so that queries perform quickly

## Specific Requirements

**Core Tables Structure**
- Users table: id (UUID), email (unique), name, role (enum), isActive, emailVerified, Better Auth fields, timestamps
- Clients table: id (UUID), name, timestamps
- EAs table: id (references users), expectedShowUpTime, timezone, healthcareEligibilityDate, timestamps
- Pairings table: id, eaId, clientId, startDate, healthStatus (enum), healthStatusOverride (boolean), accelerator fields, timestamps, unique (eaId, clientId)
- EndOfDayReports table: id, pairingId, eaId, reportDate, all 10 report fields, timestamps, indexes on (pairingId, reportDate) and (eaId, reportDate)
- AlertRules table: id, name, ruleNumber, ruleType, severity, isEnabled, triggerCondition (jsonb), dataSource, businessRationale, alertTitle, alertDescription, suggestedAction, adjustableThresholds (jsonb), defaultThresholds (jsonb), timestamps
- Alerts table: id, pairingId, ruleId, severity, status (enum), assignedTo, detectedAt, resolvedAt, evidence (jsonb), notes, timestamps, indexes on (pairingId, status), (severity, status), (assignedTo, status)
- CoachingNotes table: id, noteType (enum), eaId (nullable), pairingId (nullable), content, updatedBy, timestamps, unique constraints per noteType
- PTORecords table: id, eaId, startDate, endDate, reason (enum), timestamps, index on (eaId, startDate, endDate)
- StartOfDayLogs table: id, eaId, logDate, loggedAt, expectedShowUpTime, wasLate, minutesLate, timestamps, unique (eaId, logDate)
- CompanyAnnouncements table: id, title, content, isActive, expiresAt, createdBy, timestamps

**Database Technology**
- Use D1 Database (SQLite at edge) via Cloudflare Workers
- Drizzle ORM for type-safe queries and schema definition
- Drizzle migrations system for version-controlled schema changes
- Support migration path to Neon Postgres if D1 proves insufficient (Drizzle abstracts differences)

**Relationships and Constraints**
- Foreign key constraints on all relationships (users→EAs, pairings→reports, etc.)
- Unique constraints: pairings (eaId, clientId), coaching notes per type, start of day logs (eaId, logDate)
- Check constraints for enum values
- Not null constraints on required fields
- Cascade delete rules where appropriate (or soft delete flags)

**Performance Indexes**
- Critical indexes: pairings (eaId, clientId), reports (pairingId, reportDate), (eaId, reportDate), alerts (pairingId, status), (severity, status), (assignedTo, status), start of day logs (eaId, logDate), PTO records (eaId, date range)
- Indexes optimized for dashboard queries and filtering operations
- Consider query patterns from dashboards when designing indexes

**Migration System**
- Use Drizzle migrations for all schema changes
- Version control all migration files
- Support rollback capability
- Test migrations on staging before production
- Migration files stored in `/drizzle/migrations/` directory

**Data Integrity**
- Enforce referential integrity with foreign keys
- Prevent duplicate pairings (unique constraint)
- Prevent duplicate start of day logs per EA per day
- Ensure coaching notes are unique per EA or pairing based on type
- Validate enum values at database level

## Visual Design
No visual assets provided. Database schema is backend-only.

## Existing Code to Leverage

**Drizzle ORM Patterns**
- Follow Drizzle ORM schema definition patterns from ShadFlareAi repository
- Use Drizzle's type-safe query builder patterns
- Follow migration file structure and naming conventions
- Reference Drizzle documentation for D1-specific patterns

**Database Design Patterns**
- Follow relational database best practices for normalization
- Use JSONB fields (via Drizzle) for flexible rule configuration storage
- Consider edge runtime limitations when designing schema

## Out of Scope
- Advanced analytics tables (separate feature)
- Audit logging tables (can add later if needed)
- Soft deletes implementation (can add later if needed)
- Database replication or backup strategies (infrastructure concern)
- Advanced indexing strategies beyond basic performance needs
- Database monitoring and optimization tools (infrastructure concern)
- Data migration scripts for existing data (not applicable for new system)
- Database connection pooling (handled by D1/Cloudflare)
- Advanced query optimization beyond indexes (premature optimization)

