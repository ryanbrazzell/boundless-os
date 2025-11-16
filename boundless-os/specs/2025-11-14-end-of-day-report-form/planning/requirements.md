# Spec Requirements: End of Day Report Form

## Initial Description
Structured 10-question form with client-facing questions (workload, work type, mood, wins, completions, pending, daily sync) and internal questions (difficulties, support needs, notes) with coaching note display.

## Requirements Discussion

### Form Structure
Exactly 10 fields organized into two sections:

**Section 1: "Buy Back Time Report Questions" (Client-Facing)**
1. How's your workload feeling? (Required, Radio: Light | Moderate | Heavy | Overwhelming)
2. What type of work did you do today? (Required, Radio: Not much | Regular | Mix | Mostly new)
3. How did you feel during work today? (Required, Radio: Great | Good | Okay | Stressed)
4. What was your biggest win today? (Required, Text area)
5. What did you complete today? (Required, Text area)
6. Which projects/tasks are pending? (Optional, Text area)
7. Did you have a Daily Sync call? (Required, Yes/No toggle)

**Section 2: "Internal Team Questions" (CSM-Only)**
8. Did anything make work difficult today? (Optional, Text area)
9. Anything we can do to support you tomorrow? (Optional, Text area)
10. Additional Notes (Optional, Text area)

### Coaching Note Display
- Display current pairing-level coaching note at top of form
- Real-time updates (if admin updates note, EA sees it when loading form)
- Format: Card or banner above form fields

### Form Behavior
- EA selects which client/pairing they're reporting for (if EA has multiple pairings)
- Form validates required fields before submission
- Submit button saves report and shows success message
- Form should take 2-3 minutes to complete
- Auto-save draft (optional, can add later)

### Data Storage
- All 10 fields saved to EndOfDayReports table
- Linked to pairingId and eaId
- reportDate = today's date
- Timestamp tracking (createdAt, updatedAt)

## Requirements Summary

### Functional Requirements
- 10-question structured form
- Two sections (client-facing and internal)
- Coaching note display at top
- Pairing selection (if EA has multiple)
- Required field validation
- Form submission and success feedback
- Data saved to database

### Scope Boundaries
**In Scope:**
- 10-question form structure
- Coaching note display
- Form validation
- Submission and storage

**Out of Scope:**
- Auto-save drafts (can add later)
- Report editing after submission (future feature)
- File attachments (future feature)

### Technical Considerations
- ShadcnUI form components
- React Hook Form for form management
- TanStack Query for submission
- Real-time coaching note updates

