# Task Breakdown: AI Analysis Integration

## Overview
Total Tasks: 10

## Task List

### API Layer

#### Task Group 1: Claude API Integration Service
**Dependencies:** Churn Detection System spec, Alert Rules Engine spec

- [x] 1.0 Create Claude API integration service
  - [x] 1.1 Write 2-8 focused tests for Claude API integration
    - Test API call with structured prompt
    - Test JSON response parsing
    - Test error handling
    - Test batching multiple rules
    - Limit to 2-8 highly focused tests maximum (11 tests)
  - [x] 1.2 Set up Claude API client
    - Install Claude API SDK or use HTTP client (using fetch)
    - Configure API key from environment variables (CLAUDE_API_KEY)
    - Handle authentication
    - Support Claude API version/latest (claude-3-5-sonnet-20241022)
  - [x] 1.3 Create structured prompt builder
    - Build prompt from report fields and rule configuration
    - Include: report text fields, rule name, patterns to detect
    - Format prompt consistently for all AI rules
    - Return formatted prompt string
  - [x] 1.4 Implement Claude API call function
    - Send prompt to Claude API
    - Request JSON response format
    - Handle API response
    - Parse JSON response
  - [x] 1.5 Implement JSON response parsing
    - Parse response: detected (boolean), confidence (float), evidence (array), reasoning (string)
    - Validate response structure
    - Handle malformed responses gracefully
    - Extract all fields correctly
  - [x] 1.6 Implement batch processing
    - Combine multiple AI rules into single API call
    - Merge prompts for multiple rules
    - Parse multiple responses from batched request
    - Return results per rule
  - [x] 1.7 Implement error handling and retry logic
    - Handle API failures (retry with exponential backoff)
    - Handle timeout errors
    - Handle rate limit errors (queue request, retry later)
    - Fallback behavior: Return detected=false if API fails
    - Log errors for monitoring
  - [x] 1.8 Implement caching
    - Cache AI analysis results (don't re-analyze same report)
    - Store in cache/KV with reportId as key
    - Check cache before making API call
    - Invalidate cache when report updated (24 hour TTL)
  - [x] 1.9 Ensure Claude API integration tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify API calls work
    - Verify response parsing works
    - Verify error handling works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Claude API integration works
- Structured prompts work
- JSON response parsing works
- Batching works
- Error handling works
- Caching works

### Testing

#### Task Group 2: Test Review & Gap Analysis
**Dependencies:** Task Group 1

- [ ] 2.0 Review existing tests and fill critical gaps only
  - [ ] 2.1 Review tests from Task Group 1
    - Review the 2-8 tests from Task 1.1
    - Total existing tests: approximately 2-8 tests
  - [ ] 2.2 Analyze test coverage gaps for AI integration only
    - Identify critical workflows that lack test coverage
    - Focus on end-to-end AI analysis → alert creation flow
    - Focus on error handling edge cases
  - [ ] 2.3 Write up to 10 additional strategic tests maximum
    - Test complete flow: report → AI analysis → alert creation
    - Test batching multiple rules
    - Test caching behavior
  - [ ] 2.4 Run AI integration tests only
    - Run ONLY tests related to AI integration (tests from 1.1 and 2.3)
    - Expected total: approximately 12-18 tests maximum
    - Do NOT run entire application test suite
    - Verify critical workflows pass

**Acceptance Criteria:**
- All AI integration tests pass (approximately 12-18 tests total)
- Critical workflows covered
- Error handling tested
- No more than 10 additional tests added

## Execution Order

Recommended implementation sequence:
1. Claude API Integration Service (Task Group 1)
2. Test Review & Gap Analysis (Task Group 2)

