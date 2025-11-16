# Specification: End of Day Report Form

## Goal
Create structured 10-question form for EAs to submit daily reports with client-facing and internal questions, displaying pairing-level coaching notes at top.

## User Stories
- As an EA, I want to quickly submit my daily report so that CSMs can monitor relationship health
- As an EA, I want to see coaching notes for this client so that I know what to focus on
- As a CSM, I want structured report data so that the system can detect churn patterns automatically

## Specific Requirements

**Form Structure - 10 Questions**
- Section 1: "Buy Back Time Report Questions" (Client-Facing): 7 questions
  - How's your workload feeling? (Required, Radio: Light | Moderate | Heavy | Overwhelming)
  - What type of work did you do today? (Required, Radio: Not much | Regular | Mix | Mostly new)
  - How did you feel during work today? (Required, Radio: Great | Good | Okay | Stressed)
  - What was your biggest win today? (Required, Text area)
  - What did you complete today? (Required, Text area)
  - Which projects/tasks are pending? (Optional, Text area)
  - Did you have a Daily Sync call? (Required, Yes/No toggle)
- Section 2: "Internal Team Questions" (CSM-Only): 3 questions
  - Did anything make work difficult today? (Optional, Text area)
  - Anything we can do to support you tomorrow? (Optional, Text area)
  - Additional Notes (Optional, Text area)

**Coaching Note Display**
- Display pairing-level coaching note at top of form (from CoachingNotes table, noteType=PAIRING_LEVEL, pairingId)
- Real-time updates (if admin updates note, EA sees it when loading form)
- Format: Card or banner above form fields
- Read-only display for EA

**Pairing Selection**
- If EA has multiple pairings, show dropdown/select to choose which client/pairing they're reporting for
- Pre-select if EA has only one active pairing
- Required selection before form submission

**Form Validation**
- Validate required fields before submission
- Show inline error messages for invalid fields
- Prevent submission if required fields missing
- Use React Hook Form for form management and validation

**Form Submission**
- Submit button saves all 10 fields to EndOfDayReports table
- Link to pairingId and eaId
- reportDate = today's date (use EA's timezone)
- Show success message after submission
- Optionally trigger Alert Rules Engine evaluation after submission
- Prevent duplicate submissions (one report per EA per pairing per day)

**Form UX**
- Form should take 2-3 minutes to complete (design for speed)
- Clear section labels and field labels
- Helpful placeholder text where appropriate
- Auto-save draft functionality (optional, can add later)
- Loading state during submission

**Data Mapping**
- Map all 10 form fields to database columns: workloadFeeling, workType, feelingDuringWork, biggestWin, whatCompleted, pendingTasks, hadDailySync, difficulties, supportNeeded, additionalNotes
- Store enum values for radio button fields
- Store text for text area fields
- Store boolean for toggle field

## Visual Design
No visual assets provided. Reference ShadFlareAi repository for form patterns and ShadcnUI form component usage.

## Existing Code to Leverage

**ShadcnUI Form Components**
- Use ShadcnUI Form, Input, Textarea, RadioGroup, Switch components
- Follow ShadcnUI form validation patterns
- Use React Hook Form integration with ShadcnUI

**React Hook Form Patterns**
- Use React Hook Form for form state management
- Implement validation schema (Zod or similar)
- Handle form submission and error states
- Follow React Hook Form best practices

## Out of Scope
- Auto-save drafts (can add later if needed)
- Report editing after submission (future feature - reports are immutable)
- File attachments (future feature)
- Rich text editing for text areas (plain text for MVP)
- Report templates (future feature)
- Bulk report submission (not applicable)

