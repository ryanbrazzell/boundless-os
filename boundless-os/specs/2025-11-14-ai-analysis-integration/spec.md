# Specification: AI Analysis Integration

## Goal
Integrate Claude API (Anthropic) to analyze End of Day report text fields for sentiment, keywords, and patterns, returning structured results that feed into the Alert Rules Engine for churn detection.

## User Stories
- As the system, I want to detect subtle churn signals in text that logic rules miss so that CSMs catch issues early
- As an admin, I want AI analysis to be cost-effective so that the system remains affordable
- As a CSM, I want accurate pattern detection so that false positives are minimized

## Specific Requirements

**Claude API Integration**
- Use Claude API (Anthropic) for text analysis
- API key stored in environment variables (CLAUDE_API_KEY)
- Handle API authentication and requests
- Support Claude API version/latest
- Error handling and retry logic for transient failures

**Text Field Analysis**
- Analyze text fields from End of Day reports: difficulties, supportNeeded, additionalNotes, whatCompleted, biggestWin
- Combine all text fields into single analysis context
- Extract relevant quotes and evidence from text
- Detect patterns specified in AI rules (from Churn Detection System spec)

**Structured Prompt Format**
- Use consistent prompt structure for all AI rules:
```
You are analyzing an EA's daily report for potential churn risk signals.

Report Fields:
- Difficulties: "{difficulties_text}"
- Support Needed: "{support_needed_text}"
- Additional Notes: "{additional_notes_text}"
- What Completed: "{what_completed_text}"
- Biggest Win: "{biggest_win_text}"

Analyze for: [RULE NAME - e.g., "Client Dissatisfaction"]

Patterns to detect:
{list_of_patterns_from_rule_config}

Return JSON:
{
  "detected": boolean,
  "confidence": 0.0 to 1.0,
  "evidence": ["specific quotes from text"],
  "reasoning": "brief explanation"
}

Only return detected:true if there is clear evidence. When in doubt, return false.
```

**Pattern Detection**
- Detect patterns from rule configuration (adjustableThresholds.patterns)
- Examples: Client dissatisfaction phrases, pay violation mentions, trust breakdown language, recurring blocker mentions
- Use semantic understanding (not just keyword matching)
- Return confidence scores (0.0-1.0) for detected patterns
- Extract specific quotes as evidence

**JSON Response Parsing**
- Parse Claude API JSON response
- Validate response structure (detected, confidence, evidence, reasoning)
- Handle malformed responses gracefully
- Extract detected boolean, confidence float, evidence array, reasoning string
- Only create alert if detected=true AND confidence > threshold (e.g., 0.7)

**Batch Processing**
- Batch multiple AI rules in single API call when analyzing same report
- Combine prompts for multiple rules into single request
- Parse multiple responses from batched request
- Reduces API calls and costs

**Optimization Strategies**
- Only run AI rules if logic rules suggest risk (flag from Alert Rules Engine)
- Cache results: Don't re-analyze same report (store in cache/KV)
- Batch multiple rules: Combine prompts for efficiency
- Rate limiting: Respect Claude API rate limits (requests per minute)
- Cost target: ~$0.02-$0.04 per report with all AI rules

**Error Handling**
- Handle API failures gracefully (retry with exponential backoff)
- Handle timeout errors (increase timeout or retry)
- Handle rate limit errors (queue request, retry later)
- Fallback behavior: If AI fails, continue with logic rules only (don't block alert creation)
- Log errors for monitoring and debugging

**Cost Management**
- Track API usage and costs
- Monitor cost per report analysis
- Alert if costs exceed thresholds (optional)
- Optimize prompts to reduce token usage where possible

**Integration Points**
- Called by Alert Rules Engine (Backend) when AI rules need evaluation
- Receives report data and rule configuration
- Returns analysis results (detected, confidence, evidence, reasoning)
- Results feed into alert creation logic

## Visual Design
No visual assets provided. Backend-only API integration.

## Existing Code to Leverage

**Claude API Patterns**
- Follow Claude API best practices for prompt engineering
- Use structured JSON responses for consistent parsing
- Implement error handling and retry logic patterns
- Reference Claude API documentation for latest patterns

**Alert Rules Engine Integration**
- Integrate with Alert Rules Engine for rule evaluation flow
- Follow batching and caching patterns from engine
- Use evidence format compatible with alert creation

## Out of Scope
- Other AI providers (Claude only for MVP)
- Custom ML models (using Claude API only)
- Advanced sentiment analysis beyond pattern detection
- Multi-language support (English only for MVP)
- Custom model fine-tuning (using Claude API as-is)
- Real-time streaming analysis (batch processing only)
- Advanced confidence calibration (use confidence as-is)

