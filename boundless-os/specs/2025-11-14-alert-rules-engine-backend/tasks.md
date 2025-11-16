# Task Breakdown: Alert Rules Engine (Backend)

## Overview
Total Tasks: 12

## Task List

### API Layer

#### Task Group 1: Rule Evaluation Engine
**Dependencies:** Database Schema spec (AlertRules, Alerts, PatternState tables), Churn Detection System spec, AI Analysis Integration spec

- [x] 1.0 Create rule evaluation engine
  - [x] 1.1 Write 2-8 focused tests for rule evaluation engine
    - Test logic rule evaluation
    - Test pattern-over-time detection
    - Test AI rule evaluation (placeholder)
    - Test alert creation
    - Limit to 2-8 highly focused tests maximum (5 tests)
  - [x] 1.2 Create rule evaluation service/function
    - Accept report data and pairingId
    - Query all enabled rules (isEnabled=true)
    - Process logic rules first
    - Process AI rules if logic suggests risk (placeholder for AI integration)
    - Create alerts when rules fire
    - Async processing (don't block report submission)
  - [x] 1.3 Implement logic rules evaluation
    - Evaluate immediate triggers (single report conditions)
    - Check report fields: workloadFeeling, workType, feelingDuringWork, hadDailySync
    - Examples: workloadFeeling="Overwhelming" → fire alert
  - [x] 1.4 Implement pattern-over-time detection
    - Track occurrences across time windows (3-day, 7-day, 14-day, 21-day)
    - Query recent reports for pairing within time window
    - Count occurrences matching pattern
    - Update PatternState table
    - Fire alert when threshold met
  - [x] 1.5 Integrate with AI Analysis Integration
    - Call AI service when AI rules need evaluation (placeholder - will integrate later)
    - Batch multiple AI rules in single API call (placeholder)
    - Parse JSON responses (placeholder)
    - Only create alerts if detected=true and confidence > threshold (placeholder)
  - [x] 1.6 Implement alert creation logic
    - Create Alert record when rule fires
    - Store evidence (JSON stored as text with confidence, reasoning, quotes)
    - Link to pairingId and ruleId
    - Prevent duplicate alerts
  - [x] 1.7 Implement optimization strategies
    - Run logic rules first (always)
    - Only call AI if logic suggests risk (placeholder - AI integration pending)
    - Batch multiple AI rules (placeholder)
    - Cache AI results (placeholder)
    - Rate limiting for API calls (placeholder)
  - [x] 1.8 Ensure rule evaluation engine tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify logic rules work
    - Verify pattern detection works
    - Verify AI rules work (placeholder tests)
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Logic rules evaluate correctly
- Pattern-over-time detection works
- AI rules evaluate correctly
- Alerts created when rules fire
- Optimization strategies work

### Testing

#### Task Group 2: Test Review & Gap Analysis
**Dependencies:** Task Group 1

- [ ] 2.0 Review existing tests and fill critical gaps only
  - [ ] 2.1 Review tests from Task Group 1
    - Review the 2-8 tests from Task 1.1
    - Total existing tests: approximately 2-8 tests
  - [ ] 2.2 Analyze test coverage gaps for alert rules engine only
    - Identify critical workflows that lack test coverage
    - Focus on end-to-end rule evaluation → alert creation flow
    - Focus on pattern-over-time edge cases
  - [ ] 2.3 Write up to 10 additional strategic tests maximum
    - Test complete flow: report submission → rule evaluation → alert creation
    - Test pattern state tracking across time windows
    - Test AI rule batching and caching
  - [ ] 2.4 Run alert rules engine tests only
    - Run ONLY tests related to alert rules engine (tests from 1.1 and 2.3)
    - Expected total: approximately 12-18 tests maximum
    - Do NOT run entire application test suite
    - Verify critical workflows pass

**Acceptance Criteria:**
- All alert rules engine tests pass (approximately 12-18 tests total)
- Critical workflows covered
- Pattern detection tested
- No more than 10 additional tests added

## Execution Order

Recommended implementation sequence:
1. Rule Evaluation Engine (Task Group 1)
2. Test Review & Gap Analysis (Task Group 2)

