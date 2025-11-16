# Task Breakdown: Churn Detection System

## Overview
Total Tasks: 18

## Task List

### Database Layer

#### Task Group 1: Pattern State Storage
**Dependencies:** Database Schema spec (AlertRules, Alerts tables)

- [ ] 1.0 Create pattern state tracking table
  - [ ] 1.1 Write 2-8 focused tests for pattern state storage
    - Test pattern state creation
    - Test pattern state queries
    - Test window expiration logic
    - Limit to 2-8 highly focused tests maximum
  - [ ] 1.2 Create PatternState table schema (Drizzle)
    - Fields: id, ruleId, pairingId, occurrences (JSONB array with timestamps), windowStart, windowEnd, timestamps
    - Foreign keys: ruleId → AlertRules, pairingId → Pairings
    - Indexes: (ruleId, pairingId, windowEnd) for efficient queries
  - [ ] 1.3 Create migration for PatternState table
    - Migration file
    - Test migration up/down
  - [ ] 1.4 Seed default 26 rules from Churn Detection System spec
    - Create AlertRules records for all 26 rules
    - Set default thresholds, severities, enabled status
    - Store trigger conditions as JSONB
    - Reference Churn Detection System requirements document
  - [ ] 1.5 Ensure pattern state tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify table created correctly
    - Verify indexes work
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- PatternState table created
- Default 26 rules seeded
- Indexes created correctly

### API Layer

#### Task Group 2: Rule Evaluation API
**Dependencies:** Task Group 1, Alert Rules Engine Backend spec, AI Analysis Integration spec

- [ ] 2.0 Create rule evaluation API endpoint
  - [ ] 2.1 Write 2-8 focused tests for rule evaluation endpoint
    - Test logic rule evaluation
    - Test AI rule evaluation
    - Test alert creation
    - Limit to 2-8 highly focused tests maximum
  - [ ] 2.2 Create rule evaluation endpoint (Hono)
    - POST /api/alerts/evaluate
    - Accept: reportId (or report data)
    - Evaluate all enabled rules
    - Process logic rules first, then AI rules if needed
    - Create alerts when rules fire
    - Return evaluation results
    - Async processing (don't block)
  - [ ] 2.3 Implement logic rules evaluation engine
    - Evaluate immediate triggers (single report conditions)
    - Evaluate pattern-over-time (track occurrences in time windows)
    - Update PatternState table
    - Examples: workloadFeeling="Overwhelming", no work for 3+ days in 7-day window
  - [ ] 2.4 Implement AI rules evaluation engine
    - Call AI Analysis Integration service
    - Batch multiple AI rules in single API call
    - Parse JSON responses
    - Only create alerts if detected=true and confidence > threshold
  - [ ] 2.5 Implement alert creation logic
    - Create Alert record when rule fires
    - Store evidence (JSONB with confidence, reasoning, quotes)
    - Link to pairingId and ruleId
    - Prevent duplicate alerts
  - [ ] 2.6 Implement optimization strategies
    - Run logic rules first (always)
    - Only call AI if logic suggests risk
    - Batch multiple AI rules
    - Cache AI results
    - Rate limiting for API calls
  - [ ] 2.7 Ensure rule evaluation API tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify logic rules work
    - Verify AI rules work
    - Verify alerts created correctly
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- Logic rules evaluate correctly
- AI rules evaluate correctly
- Alerts created when rules fire
- Optimization strategies work

### Frontend Components

#### Task Group 3: Rule Configuration UI
**Dependencies:** Task Group 1, Alert Rules System UI spec

- [ ] 3.0 Create rule management admin interface
  - [ ] 3.1 Write 2-8 focused tests for rule management UI
    - Test rule list displays
    - Test rule configuration panel
    - Test enable/disable toggle
    - Limit to 2-8 highly focused tests maximum
  - [ ] 3.2 Create rule list component
    - Table/card list showing all 26 rules
    - Columns: Rule Name, Type, Severity, Status
    - Sortable and filterable
    - Click to open configuration panel
    - Use ShadcnUI Table or Card components
  - [ ] 3.3 Create rule configuration panel component
    - Side panel or modal for editing
    - Enable/disable toggle (ShadcnUI Switch)
    - Severity dropdown
    - Threshold inputs (numeric, dynamic based on rule type)
    - Pattern list for AI rules (text area, add/remove)
    - Alert title, description, suggested action fields
    - Save, Test, Reset buttons
  - [ ] 3.4 Create rule builder component (new rule creation)
    - Form to create custom rules
    - Rule type selection (Logic/AI Text)
    - Data source selection (multi-select report fields)
    - Threshold/pattern configuration
    - Save as new rule
  - [ ] 3.5 Implement rule testing functionality
    - "Test Rule" button
    - Run against historical reports
    - Display results (alert count, sample alerts, confidence distribution)
    - Loading state during test
  - [ ] 3.6 Apply styling and responsive design
    - Follow ShadcnUI design system
    - Desktop-first responsive layout
    - WCAG 2.1 AA accessibility
    - Stripe/Linear/Notion quality design
  - [ ] 3.7 Ensure rule management UI tests pass
    - Run ONLY the 2-8 tests written in 3.1
    - Verify rule list works
    - Verify configuration panel works
    - Verify enable/disable works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 3.1 pass
- Rule list displays correctly
- Rule configuration works
- Rule builder works
- Rule testing works
- Design matches quality standards

### Testing

#### Task Group 4: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-3

- [ ] 4.0 Review existing tests and fill critical gaps only
  - [ ] 4.1 Review tests from Task Groups 1-3
    - Review the 2-8 tests from Task 1.1
    - Review the 2-8 tests from Task 2.1
    - Review the 2-8 tests from Task 3.1
    - Total existing tests: approximately 6-24 tests
  - [ ] 4.2 Analyze test coverage gaps for churn detection only
    - Identify critical workflows that lack test coverage
    - Focus on end-to-end rule evaluation → alert creation flow
    - Focus on pattern-over-time detection
  - [ ] 4.3 Write up to 10 additional strategic tests maximum
    - Test complete flow: report submission → rule evaluation → alert creation
    - Test pattern-over-time detection across time windows
    - Test AI rule batching and caching
  - [ ] 4.4 Run churn detection tests only
    - Run ONLY tests related to churn detection (tests from 1.1, 2.1, 3.1, and 4.3)
    - Expected total: approximately 16-34 tests maximum
    - Do NOT run entire application test suite
    - Verify critical workflows pass

**Acceptance Criteria:**
- All churn detection tests pass (approximately 16-34 tests total)
- Critical workflows covered
- Pattern detection tested
- No more than 10 additional tests added

## Execution Order

Recommended implementation sequence:
1. Pattern State Storage (Task Group 1)
2. Rule Evaluation API (Task Group 2)
3. Rule Configuration UI (Task Group 3)
4. Test Review & Gap Analysis (Task Group 4)

