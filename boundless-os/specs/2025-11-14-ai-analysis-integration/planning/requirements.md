# Spec Requirements: AI Analysis Integration

## Initial Description
Claude API integration to analyze report text fields for sentiment, keywords, and patterns, feeding into alert rules engine for churn detection.

## Requirements Discussion

### Claude API Integration
- Use Claude API (Anthropic) for text analysis
- Analyze text fields from reports:
  - "Difficulties"
  - "Support needed"
  - "Additional notes"
  - "What completed"
  - "Biggest win"

### Prompt Structure
For each AI rule, use structured prompt:
```
You are analyzing an EA's daily report for potential churn risk signals.

Report Fields:
- Difficulties: "{difficulties_text}"
- Support Needed: "{support_needed_text}"
- Additional Notes: "{additional_notes_text}"
- What Completed: "{what_completed_text}"
- Biggest Win: "{biggest_win_text}"

Analyze for: [RULE NAME]

Patterns to detect:
{list_of_patterns}

Return JSON:
{
  "detected": boolean,
  "confidence": 0.0 to 1.0,
  "evidence": ["specific quotes from text"],
  "reasoning": "brief explanation"
}

Only return detected:true if there is clear evidence. When in doubt, return false.
```

### Pattern Detection
- Detect patterns specified in each AI rule
- Examples: Client dissatisfaction, pay violations, trust breakdown, recurring blockers
- Use semantic similarity for pattern matching
- Return confidence scores

### Optimization
- Batch multiple rules in single API call when analyzing same report
- Only run AI rules if logic rules suggest risk
- Cache results (don't re-analyze same report)
- Rate limiting (respect API limits)

### Cost Management
- Per report with all AI rules: ~$0.02-$0.04
- Logic rules: $0 (free, instant)
- Recommended: Run logic rules always, run AI rules only on reports flagged by logic

### Error Handling
- Handle API failures gracefully
- Retry logic for transient failures
- Fallback behavior (log error, continue with logic rules only)

### Integration
- Called by Alert Rules Engine (Backend)
- Feeds results back to engine
- Engine creates alerts based on AI analysis

## Requirements Summary

### Functional Requirements
- Claude API integration
- Text field analysis
- Pattern detection
- Confidence scoring
- Evidence extraction
- Batch processing
- Caching
- Error handling

### Scope Boundaries
**In Scope:**
- Claude API integration
- Pattern detection
- Optimization strategies

**Out of Scope:**
- Other AI providers (Claude only for MVP)
- Custom ML models (using Claude API only)
- Advanced sentiment analysis (Claude handles this)

### Technical Considerations
- Claude API (Anthropic)
- API key management
- Rate limiting
- Cost optimization
- Error handling and retries

