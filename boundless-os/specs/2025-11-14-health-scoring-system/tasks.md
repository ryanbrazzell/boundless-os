# Task Breakdown: Health Scoring System

## Overview
Total Tasks: 10

## Task List

### API Layer

#### Task Group 1: Health Calculation API
**Dependencies:** Database Schema spec (Pairings, Alerts, EndOfDayReports tables), Alert Rules Engine spec

- [x] 1.0 Create health calculation API endpoint
  - [x] 1.1 Write 2-8 focused tests for health calculation endpoint
    - Test RED health calculation
    - Test YELLOW health calculation
    - Test GREEN health calculation
    - Test manual override
    - Limit to 2-8 highly focused tests maximum (6 tests)
  - [x] 1.2 Create health calculation endpoint (Hono)
    - GET /api/pairings/:pairingId/health
    - Calculate health status on-demand
    - Return: healthStatus (GREEN/YELLOW/RED), calculatedAt, isOverride, reason
    - Check manual override first
    - Calculate health if not overridden
  - [x] 1.3 Implement RED health calculation logic
    - Check for active CRITICAL alerts
    - Check for missing reports (>2 business days)
    - Check latest report workloadFeeling="Overwhelming"
    - Check for specific CRITICAL alert types - Basic implementation, can enhance with specific alert types
    - Return RED on first match
  - [x] 1.4 Implement YELLOW health calculation logic
    - Check for active HIGH alerts
    - Check for 3+ active MEDIUM alerts
    - Check for no daily syncs (3+ days in last 7)
    - Check for sustained heavy/light workload (5+ consecutive days)
    - Check for no wins (10+ business days)
    - Return YELLOW on first match (if not RED)
  - [x] 1.5 Implement GREEN health calculation logic
    - Check: No CRITICAL or HIGH alerts, <3 MEDIUM alerts, Report within last 2 business days
    - Check for positive indicators (can offset MEDIUM alerts) - Basic implementation
    - Return GREEN if all conditions met
  - [x] 1.6 Implement report recency check
    - Query EndOfDayReports for most recent report
    - Calculate business days since last report
    - Handle timezone correctly (use EA's timezone) - Basic implementation
    - Return true if report within last 2 business days
  - [x] 1.7 Implement manual override support
    - Check Pairings.healthStatusOverride flag
    - If override=true: Return Pairings.healthStatus
    - If override=false: Calculate health automatically
  - [x] 1.8 Ensure health calculation API tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify RED calculation works
    - Verify YELLOW calculation works
    - Verify GREEN calculation works
    - Verify override works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Health calculation works correctly
- Manual override works
- Report recency check works

### Testing

#### Task Group 2: Test Review & Gap Analysis
**Dependencies:** Task Group 1

- [ ] 2.0 Review existing tests and fill critical gaps only
  - [ ] 2.1 Review tests from Task Group 1
    - Review the 2-8 tests from Task 1.1
    - Total existing tests: approximately 2-8 tests
  - [ ] 2.2 Analyze test coverage gaps for health scoring only
    - Identify critical workflows that lack test coverage
    - Focus on health calculation edge cases
    - Focus on business day calculation
  - [ ] 2.3 Write up to 10 additional strategic tests maximum
    - Test health calculation with various alert combinations
    - Test business day calculation edge cases
    - Test positive indicator offset logic
  - [ ] 2.4 Run health scoring tests only
    - Run ONLY tests related to health scoring (tests from 1.1 and 2.3)
    - Expected total: approximately 12-18 tests maximum
    - Do NOT run entire application test suite
    - Verify critical workflows pass

**Acceptance Criteria:**
- All health scoring tests pass (approximately 12-18 tests total)
- Critical workflows covered
- Edge cases tested
- No more than 10 additional tests added

## Execution Order

Recommended implementation sequence:
1. Health Calculation API (Task Group 1)
2. Test Review & Gap Analysis (Task Group 2)

