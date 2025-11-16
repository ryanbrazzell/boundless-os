# Specification: Health Scoring System

## Goal
Calculate pairing health status (Green/Yellow/Red) automatically based on active alerts, report recency (2 business days), and support manual override for false positives.

## User Stories
- As a CSM, I want to see pairing health at a glance so that I know which relationships need attention
- As an admin, I want to manually override health status so that I can handle false positives
- As the system, I want to calculate health automatically so that CSMs don't have to manually assess each pairing

## Specific Requirements

**Health Calculation Logic - RED (Critical)**
- Pairing shows RED if any of these conditions are true:
  - Has active CRITICAL severity alert (status != RESOLVED)
  - Missing reports: No report submitted in last 2+ business days
  - Latest report has workloadFeeling = "Overwhelming"
  - Latest report triggered client dissatisfaction alert (CRITICAL)
  - Latest report triggered pay violation alert (CRITICAL)
  - Latest report triggered trust breakdown alert (CRITICAL)
- Check conditions in order, return RED on first match

**Health Calculation Logic - YELLOW (At Risk)**
- Pairing shows YELLOW if any of these conditions are true (and not RED):
  - Has active HIGH severity alert
  - Has 3+ active MEDIUM severity alerts
  - No daily syncs: hadDailySync=false for 3+ days in last 7 days
  - Heavy workload sustained: workloadFeeling="Heavy" for 5+ consecutive days
  - Light workload sustained: workloadFeeling="Light" for 5+ consecutive days
  - No wins reported: biggestWin empty/null for 10+ business days
- Check conditions in order, return YELLOW on first match

**Health Calculation Logic - GREEN (Healthy)**
- Pairing shows GREEN if all of these are true:
  - No active CRITICAL or HIGH alerts
  - Less than 3 active MEDIUM alerts
  - Regular report submissions: Report submitted within last 2 business days
- Bonus points (can offset MEDIUM alerts): Specific wins reported regularly, proactive communication detected, consistent quality reporting

**Report Recency Check**
- Check if report submitted within last 2 business days
- Business days = Monday-Friday (exclude weekends and holidays if configured)
- Query EndOfDayReports table for pairingId, order by reportDate DESC, check most recent
- If no report OR reportDate > 2 business days ago → contributes to RED status
- Handle timezone correctly (use EA's timezone)

**Alert-Based Scoring**
- Query Alerts table for pairingId where status != RESOLVED
- Filter by severity: CRITICAL, HIGH, MEDIUM
- Count alerts by severity
- Apply scoring logic: CRITICAL → RED, HIGH → YELLOW, 3+ MEDIUM → YELLOW
- Check alert types for specific conditions (client dissatisfaction, pay violation, etc.)

**Manual Override Support**
- Check Pairings.healthStatusOverride flag
- If override=true: Return Pairings.healthStatus value (manual override)
- If override=false: Calculate health automatically using logic above
- Admins can set override via Pairing Management interface
- Clear override button returns to automatic calculation

**Calculation Frequency**
- Calculate on-demand when viewing pairing (lazy calculation)
- Recalculate automatically after: New report submitted, new alert created, alert resolved, manual override changed
- Cache calculated health status (optional, for performance)
- Invalidate cache when conditions change

**Positive Indicators (Bonus Points)**
- Can offset negative signals (MEDIUM alerts)
- Check for: Specific wins (Rule #24), proactive communication (Rule #25), quality reporting (Rule #26)
- If positive indicators present: May keep GREEN status despite 1-2 MEDIUM alerts
- Implemented via positive indicator rules from Churn Detection System

**API Endpoint**
- GET /api/pairings/:pairingId/health
- Calculate health status on-demand
- Return: { healthStatus: "GREEN" | "YELLOW" | "RED", calculatedAt, isOverride, reason }
- Reason field explains why health is this status (for debugging/admin)

## Visual Design
No visual assets provided. Health status displayed as colored indicators (🟢🟡🔴) in dashboards.

## Existing Code to Leverage

**Database Schema**
- Use Pairings, Alerts, EndOfDayReports tables from Database Schema spec
- Query efficiently using existing indexes
- Follow Drizzle ORM patterns for queries

**Alert Rules Engine Integration**
- Use alert data from Alert Rules Engine
- Check alert severities and types for health calculation
- Integrate with positive indicator rules

## Out of Scope
- Complex ML-based scoring (keep simple logic-based)
- Historical health trends (future feature)
- Health prediction (future feature)
- Health score numbers (use color indicators only)
- Health change notifications (future feature)
- Advanced business day calculation (basic Monday-Friday only)
- Health score analytics (future feature)

