# Specification: Churn Detection System

## Goal
Implement AI-powered churn detection system that analyzes EA daily reports using 26 rules (8 CRITICAL, 7 HIGH, 11 MEDIUM, 3 POSITIVE) combining fast logic rules and Claude API text analysis to automatically detect churn risk patterns and trigger prioritized alerts.

## User Stories
- As a CSM, I want alerts only for relationships needing intervention so that I can focus on what matters instead of reading every report
- As the system, I want to detect churn patterns automatically so that issues are caught 2-4 weeks earlier than manual review
- As an admin, I want customizable alert rules so that I can tune sensitivity and adjust detection patterns without code

## Specific Requirements

**26 Churn Detection Rules**
- 8 CRITICAL rules: Report not submitted, overwhelming workload, no work pattern, health/stress crisis, empty reports, client dissatisfaction, pay violations, trust breakdown
- 7 HIGH rules: No daily syncs, recurring blockers, heavy/light workload sustained, no wins, EA pay concerns, client holding work
- 11 MEDIUM rules: Surface-level reporting, routine work only, pending accumulation, support ignored, energy decline, grammar issues, non-ROI tasks, life challenges
- 3 POSITIVE indicators: Specific wins, proactive communication, quality reporting (offset negative signals)
- Each rule has: trigger condition, data source, severity, adjustable thresholds, default status (enabled/disabled)

**Logic Rules Engine**
- Fast, free pattern matching on structured fields (radio buttons, toggles, dates)
- Evaluate immediately when report submitted (no API calls)
- Track patterns over time windows (3-day, 7-day, 14-day, 21-day)
- Store pattern state in database or KV for time-window tracking
- Examples: workload feeling, work type, daily sync, consecutive days patterns

**AI Text Analysis Rules**
- Use Claude API to analyze text fields: difficulties, support needed, additional notes, what completed, biggest win
- Structured prompt with report fields and patterns to detect
- Return JSON: detected (boolean), confidence (0.0-1.0), evidence (quotes), reasoning
- Only return detected:true if clear evidence (when in doubt, return false)
- Batch multiple rules in single API call when analyzing same report
- Run AI rules only if logic rules suggest risk (optimization)

**Pattern Detection Logic**
- Weight patterns over single incidents (don't alert on isolated events)
- Track occurrences over time windows rather than reacting to single data points
- Account for external factors: holiday periods (suppress low-severity alerts), natural disasters (suppress for 24-48 hours)
- Only implement external factor handling if simple (don't overcomplicate)

**Alert Creation**
- When rule fires, create Alert record with: pairingId, ruleId, severity, status (NEW), detectedAt, evidence (JSONB)
- Evidence stores: confidence, reasoning, specific quotes from text
- Link alert to pairing for dashboard display
- Severity from rule configuration (CRITICAL, HIGH, MEDIUM, LOW)

**Rule Configuration System**
- 26 pre-configured rules with default thresholds and settings
- Admins can enable/disable any rule
- Admins can adjust thresholds (days, word counts, percentages)
- Admins can edit severity levels
- Admins can customize alert titles, descriptions, suggested actions
- Admins can add/remove AI patterns for text analysis rules
- Test rule functionality against historical data
- Reset to default settings

**Cost Optimization**
- Logic rules: Free, always run
- AI rules: ~$0.02-$0.04 per report with all rules
- Run logic rules first, only call AI if logic suggests risk
- Batch multiple AI rules in single API call
- Cache results (don't re-analyze same report)
- Rate limiting to respect API limits

**Success Metrics Tracking**
- Alert Precision: % of alerts that are real issues (target: 70%+)
- Alert Recall: % of actual churn cases flagged (target: 85%+)
- False Positive Rate: % of alerts dismissed (target: <30%)
- Time to Detection: Days between issue starting and alert (target: <3 days)
- Resolution Rate: % of alerts resolved (target: 80%+)
- Rule tuning: If rule has >50% false positive rate, adjust thresholds or disable

## Visual Design
No visual assets provided. Reference churn detection system requirements document for complete rule specifications.

## Existing Code to Leverage

**Alert Rules Management Pattern**
- Rule configuration UI should follow similar pattern to user management interface
- Toggle on/off, threshold adjustment, severity editing patterns
- Database storage and API patterns for rule management

**Claude API Integration Patterns**
- Follow Claude API best practices for prompt engineering
- Use structured JSON responses for consistent parsing
- Implement error handling and retry logic for API calls

## Out of Scope
- Complex external factor handling beyond simple holiday/disaster suppression
- Advanced ML models beyond Claude API
- Real-time alert notifications (separate feature)
- Alert resolution workflow (separate feature)
- Alert analytics and reporting (future feature)
- Custom rule creation UI beyond basic rule builder (26 pre-configured rules sufficient for MVP)
- Rule versioning and history (future feature)
- Advanced pattern ML beyond Claude API analysis

