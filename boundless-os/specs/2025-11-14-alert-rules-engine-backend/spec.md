# Specification: Alert Rules Engine (Backend)

## Goal
Implement backend system that evaluates End of Day reports against enabled churn detection rules, detects immediate triggers and patterns over time, calculates alert severity, and creates alert records automatically.

## User Stories
- As the system, I want to evaluate reports against rules automatically so that churn risks are detected without manual review
- As a CSM, I want alerts created only when rules fire so that I see actionable issues
- As the system, I want to optimize AI API calls so that costs are controlled

## Specific Requirements

**Rule Evaluation Trigger**
- Triggered automatically after report submission (async, don't block submission)
- Can be triggered manually via API endpoint for testing
- Evaluate against all enabled rules (isEnabled=true in AlertRules table)
- Process rules in order: Logic rules first, then AI rules if needed

**Logic Rules Evaluation**
- Fast, free pattern matching on structured fields (enums, booleans, dates)
- Check report fields: workloadFeeling, workType, feelingDuringWork, hadDailySync, reportDate
- Evaluate immediate triggers: Single report conditions (e.g., workloadFeeling = "Overwhelming")
- Evaluate pattern-over-time: Track occurrences across multiple reports in time windows
- Store pattern state in database (pattern tracking table or JSONB in alerts)
- Examples: "Overwhelming workload" (immediate), "No work for 3+ days in 7-day window" (pattern)

**Pattern-Over-Time Detection**
- Track pattern occurrences across time windows: 3-day, 7-day, 14-day, 21-day
- Store pattern state: ruleId, pairingId, occurrences, windowStart, windowEnd
- Query recent reports for pairing within time window
- Count occurrences matching pattern
- Fire alert when threshold met (e.g., 3 occurrences in 7-day window)
- Reset pattern state when window expires

**AI Rules Evaluation**
- Only run if logic rules suggest risk (optimization)
- Batch multiple AI rules in single Claude API call when analyzing same report
- Use structured prompt from AI Analysis Integration spec
- Parse JSON response: detected, confidence, evidence, reasoning
- Only create alert if detected=true and confidence > threshold (e.g., 0.7)
- Cache results to avoid re-analyzing same report

**Alert Creation**
- When rule fires, create Alert record in Alerts table
- Fields: pairingId, ruleId, severity (from rule config), status (NEW), detectedAt (now), evidence (JSONB with confidence, reasoning, quotes)
- Link alert to pairing for dashboard display
- Don't create duplicate alerts (check if alert already exists for this rule+pairing+date)

**Severity Calculation**
- Use severity from rule configuration (AlertRules.severity)
- Some rules always CRITICAL regardless of config (e.g., "Overwhelming workload")
- Severity stored in Alert record for filtering and prioritization

**Optimization Strategies**
- Run logic rules first (free, instant) - always run these
- Only call Claude API if logic rules suggest risk (flag from logic evaluation)
- Batch multiple AI rules in single API call (combine prompts)
- Cache AI analysis results (don't re-analyze same report)
- Rate limiting: Respect Claude API rate limits
- Async processing: Don't block report submission

**Pattern State Management**
- Store pattern state in database (new table or JSONB in existing table)
- Track: ruleId, pairingId, occurrences array with timestamps, windowStart, windowEnd
- Query efficiently with indexes on (ruleId, pairingId, windowEnd)
- Clean up expired windows (cron job or on-demand)
- Handle timezone correctly (use EA's timezone for date calculations)

**Integration Points**
- Called after Report Submission & Storage saves report
- Integrates with AI Analysis Integration for text analysis
- Creates alerts in Alerts table
- Updates pattern state for pattern-over-time rules

**Error Handling**
- Handle rule evaluation errors gracefully (log error, continue with other rules)
- Handle Claude API failures (retry logic, fallback to logic-only evaluation)
- Handle database errors (transaction rollback, error logging)
- Don't fail report submission if rule evaluation fails

## Visual Design
No visual assets provided. Backend-only system.

## Existing Code to Leverage

**Database Schema**
- Use AlertRules and Alerts tables from Database Schema spec
- Follow Drizzle ORM patterns for queries
- Use existing indexes for performance

**AI Analysis Integration**
- Integrate with Claude API service from AI Analysis Integration spec
- Use structured prompt format and JSON response parsing
- Follow optimization patterns for batching and caching

## Out of Scope
- Alert resolution workflow (separate feature)
- Alert notification system (separate feature)
- Advanced ML models beyond Claude API
- Real-time rule evaluation (evaluates after report submission)
- Rule execution scheduling (evaluates on-demand)
- Advanced pattern ML beyond time-window counting
- Rule dependency management (rules are independent)

