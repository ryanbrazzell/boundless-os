# Boundless OS Workflow Guide

**The 6-Phase Development Process**

This guide explains how Boundless OS transforms your product idea into working code through a structured 6-phase workflow.

---

## Table of Contents

1. [Overview](#overview)
2. [Visual Workflow](#visual-workflow)
3. [Phase Details](#phase-details)
4. [When to Use Each Phase](#when-to-use-each-phase)
5. [Single-Agent vs Multi-Agent](#single-agent-vs-multi-agent)
6. [Real-World Examples](#real-world-examples)
7. [Tips & Tricks](#tips--tricks)

---

## Overview

Boundless OS follows a **spec-driven development** approach. Instead of prompting AI agents with vague requests like "build me authentication," you guide them through a structured process:

```
Product Idea → Requirements → Specification → Tasks → Implementation → Verification
```

### Why This Works

**Traditional AI Coding** (without Boundless OS):
```
You: "Build user authentication"
AI:  "Sure! [generates code that kind of works but doesn't match your style]"
You: "No, I wanted it to look like Stripe's UI"
AI:  "Okay! [rewrites everything differently]"
You: "And it needs to use Clerk, not custom auth"
AI:  "Got it! [starts over again]"
```

Result: Hours of back-and-forth, inconsistent code, frustration.

**With Boundless OS**:
```
You: /shape-spec user-authentication
AI:  [asks clarifying questions upfront]
     [checks your design standards]
     [creates formal specification]
You: /implement-tasks user-authentication
AI:  [builds exactly what was spec'd]
     [follows your design principles automatically]
     [matches Stripe-quality UI from your standards]
     [uses Clerk per your tech stack]
     [tests everything]
```

Result: Production-ready code in one pass.

---

## Visual Workflow

### The Complete Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                          START HERE                              │
│                      (Do this once per project)                  │
│                                                                 │
│    ┌─────────────────────────────────────────────────────┐     │
│    │                                                     │     │
│    │  PHASE 1: PLAN PRODUCT                             │     │
│    │  ────────────────────────                           │     │
│    │  Command: /plan-product                            │     │
│    │  Time: 15-30 minutes                               │     │
│    │                                                     │     │
│    │  Creates:                                          │     │
│    │   • product/mission.md (your product's purpose)   │     │
│    │   • product/roadmap.md (development phases)       │     │
│    │   • product/tech-stack.md (technology choices)    │     │
│    │                                                     │     │
│    └─────────────────────────────────────────────────────┘     │
│                            │                                    │
│                            ▼                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                   FOR EACH FEATURE (repeat)                      │
│                                                                 │
│    ┌─────────────────────────────────────────────────────┐     │
│    │                                                     │     │
│    │  PHASE 2: SHAPE SPEC                               │     │
│    │  ───────────────────                                │     │
│    │  Command: /shape-spec [feature-name]               │     │
│    │  Time: 10-20 minutes                               │     │
│    │                                                     │     │
│    │  Creates:                                          │     │
│    │   • specs/[feature]/requirements.md               │     │
│    │                                                     │     │
│    │  What happens:                                     │     │
│    │   • AI asks clarifying questions                   │     │
│    │   • You provide answers and preferences            │     │
│    │   • AI researches best practices                   │     │
│    │   • Together you define what to build              │     │
│    │                                                     │     │
│    └─────────────────────────────────────────────────────┘     │
│                            │                                    │
│                            ▼                                    │
│                                                                 │
│    ┌─────────────────────────────────────────────────────┐     │
│    │                                                     │     │
│    │  PHASE 3: WRITE SPEC                               │     │
│    │  ───────────────────                                │     │
│    │  Command: /write-spec [feature-name]               │     │
│    │  Time: 5 minutes                                   │     │
│    │                                                     │     │
│    │  Creates:                                          │     │
│    │   • specs/[feature]/spec.md                        │     │
│    │                                                     │     │
│    │  What happens:                                     │     │
│    │   • Converts requirements → formal specification   │     │
│    │   • Adds technical details                         │     │
│    │   • Defines acceptance criteria                    │     │
│    │   • Plans database schema, APIs, UI                │     │
│    │                                                     │     │
│    └─────────────────────────────────────────────────────┘     │
│                            │                                    │
│                            ▼                                    │
│                                                                 │
│    ┌─────────────────────────────────────────────────────┐     │
│    │                                                     │     │
│    │  PHASE 4: CREATE TASKS                             │     │
│    │  ─────────────────────                              │     │
│    │  Command: /create-tasks [feature-name]             │     │
│    │  Time: 5 minutes                                   │     │
│    │                                                     │     │
│    │  Creates:                                          │     │
│    │   • specs/[feature]/tasks.md                       │     │
│    │                                                     │     │
│    │  What happens:                                     │     │
│    │   • Breaks spec into 10-20 implementable tasks     │     │
│    │   • Orders tasks by dependency                     │     │
│    │   • Estimates time for each                        │     │
│    │   • Groups related tasks                           │     │
│    │                                                     │     │
│    └─────────────────────────────────────────────────────┘     │
│                            │                                    │
│                            ▼                                    │
│                                                                 │
│    ┌─────────────────────────────────────────────────────┐     │
│    │                                                     │     │
│    │  PHASE 5: IMPLEMENT                                │     │
│    │  ──────────────────                                 │     │
│    │  Command: /implement-tasks [feature-name]          │     │
│    │  Time: 30 minutes - 2 hours                        │     │
│    │                                                     │     │
│    │  Creates:                                          │     │
│    │   • Actual code in your src/ directory             │     │
│    │   • Tests (unit, integration, e2e)                 │     │
│    │   • Database migrations (if needed)                │     │
│    │                                                     │     │
│    │  What happens:                                     │     │
│    │   • AI reads your standards                        │     │
│    │   • Implements each task following standards       │     │
│    │   • Writes tests                                   │     │
│    │   • Runs tests                                     │     │
│    │   • Fixes any failures                             │     │
│    │                                                     │     │
│    └─────────────────────────────────────────────────────┘     │
│                            │                                    │
│                            ▼                                    │
│                                                                 │
│    ┌─────────────────────────────────────────────────────┐     │
│    │                                                     │     │
│    │  PHASE 6: VERIFY                                   │     │
│    │  ───────────────                                    │     │
│    │  Command: (automatic during implement)             │     │
│    │  Time: Automatic                                   │     │
│    │                                                     │     │
│    │  Creates:                                          │     │
│    │   • specs/[feature]/verification.md                │     │
│    │                                                     │     │
│    │  What happens:                                     │     │
│    │   • Runs all tests                                 │     │
│    │   • Checks code quality                            │     │
│    │   • Verifies security                              │     │
│    │   • Confirms accessibility                         │     │
│    │   • Generates verification report                  │     │
│    │                                                     │     │
│    └─────────────────────────────────────────────────────┘     │
│                            │                                    │
│                            ▼                                    │
│                                                                 │
│                   ✓ FEATURE COMPLETE!                           │
│                                                                 │
│              (Return to Phase 2 for next feature)               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Flow Diagram (Mermaid)

```mermaid
graph TD
    A[Product Idea] -->|/plan-product| B[Product Planned]
    B --> C{Have a feature idea?}
    C -->|Yes| D[/shape-spec feature-name]
    D --> E[Requirements Defined]
    E --> F[/write-spec feature-name]
    F --> G[Specification Written]
    G --> H[/create-tasks feature-name]
    H --> I[Tasks Listed]
    I --> J[/implement-tasks feature-name]
    J --> K{Tests Pass?}
    K -->|No| L[Fix Issues]
    L --> J
    K -->|Yes| M[Verification Report]
    M --> N[Feature Complete!]
    N --> C
    C -->|No| O[Product Finished!]
```

---

## Phase Details

### Phase 1: Plan Product

**Purpose**: Define your product's mission, roadmap, and technical foundation.

**When**: Once at the start of every project.

**Duration**: 15-30 minutes (interactive Q&A).

#### What You'll Do

The AI will interview you about:

1. **Problem & Solution**
   - What problem does your product solve?
   - Who experiences this problem?
   - How does your solution help?

2. **Target Customer**
   - Who is your ideal user?
   - What are their characteristics?
   - What do they care about?

3. **Vision & Goals**
   - Where do you want to be in 6 months?
   - What's your unique value proposition?
   - What makes you different?

4. **Tech Stack**
   - What technologies do you want to use?
   - (Or: "I don't know, suggest something")

#### What You'll Get

Three documents that guide all future development:

**mission.md**:
```markdown
# Product Mission

## Problem
[Clear description of the problem you're solving]

## Solution
[How your product solves it]

## Target Customer
[Who this is for]

## Unique Value
[What makes you different]
```

**roadmap.md**:
```markdown
# Development Roadmap

## Phase 1: MVP (Weeks 1-4)
- [ ] User authentication
- [ ] Core feature X
- [ ] Basic dashboard

## Phase 2: Growth (Weeks 5-8)
- [ ] Feature Y
- [ ] Integrations
...
```

**tech-stack.md**:
```markdown
# Technology Stack

## Frontend
- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS
- UI Components: shadcn/ui

## Backend
- Database: Supabase (PostgreSQL)
- Auth: Clerk
- API: Next.js API Routes

...
```

#### Why This Matters

These documents become the AI's "north star." Every decision during implementation references back to:
- Does this match our mission?
- Does this serve our target customer?
- Does this use our chosen tech stack?

---

### Phase 2: Shape Spec

**Purpose**: Define what a feature should do before writing technical specs.

**When**: For each new feature you want to build.

**Duration**: 10-20 minutes (interactive Q&A).

#### What You'll Do

The AI will ask clarifying questions specific to your feature:

**Example (for "user-authentication"):**
```
AI: How should users sign up?
You: Email and password, plus Google OAuth

AI: What authentication provider do you prefer?
You: I've heard good things about Clerk

AI: What user roles do you need?
You: Just "user" and "admin" for now

AI: Any special requirements?
You: Password reset is important. 2FA can wait.
```

The AI will also research:
- Best practices for this feature
- Your design standards
- Security considerations
- Common patterns

#### What You'll Get

**requirements.md**:
```markdown
# User Authentication Requirements

## User Stories
1. As a new user, I want to sign up with email/password
2. As a user, I want to sign in with Google
3. As a user, I want to reset my password

## Decisions
- Use Clerk for authentication
- Support email/password and Google OAuth
- Two roles: "user" and "admin"
- Include password reset flow
- No 2FA in MVP (add later)

## Open Questions
- Collect additional profile info during signup?
- Redirect location after login?
```

#### Why This Matters

Shaping prevents:
- Scope creep ("we'll also add...")
- Missed requirements ("oh, we needed that?")
- Rework ("I meant it should work this way")

10-20 minutes of Q&A saves hours of implementation rework.

---

### Phase 3: Write Spec

**Purpose**: Convert requirements into a formal technical specification.

**When**: After you've shaped the feature.

**Duration**: 5 minutes (mostly automated).

#### What Happens

The AI takes your requirements.md and:
1. Expands each user story with acceptance criteria
2. Defines the technical approach
3. Plans database schema (if needed)
4. Designs API endpoints (if needed)
5. Describes UI flows
6. Lists security considerations

This is mostly automated—you just review and approve.

#### What You'll Get

**spec.md** (detailed technical specification):

```markdown
# User Authentication Specification

## User Stories

### US-1: Sign Up with Email/Password
**As a** new user
**I want to** create an account with email and password
**So that** I can access the platform

**Acceptance Criteria**:
- [ ] Sign-up form displays email and password fields
- [ ] Password must be 8+ characters
- [ ] Email validation prevents invalid formats
- [ ] Success redirects to onboarding
- [ ] Errors display inline

**Technical Approach**:
- Use Clerk's `<SignUp />` component
- Configure Clerk dashboard for email/password
- Add `users` table in Supabase for profile data
- Sync Clerk user ID with Supabase on signup

### Database Schema

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Security Considerations
- Clerk handles password hashing (bcrypt)
- Use HTTPS only (no plain HTTP)
- Implement rate limiting on sign-up endpoint
- Validate email format on both client and server

[... more details ...]
```

#### Why This Matters

The spec becomes the **source of truth**. The implementation phase follows this document exactly. No guessing, no interpretation, just execution.

---

### Phase 4: Create Tasks

**Purpose**: Break the specification into implementable tasks.

**When**: After the spec is written.

**Duration**: 5 minutes (mostly automated).

#### What Happens

The AI analyzes your spec and:
1. Identifies discrete tasks (install packages, create files, write functions, etc.)
2. Orders them by dependency (must do X before Y)
3. Groups related tasks
4. Estimates time for each
5. Flags potential challenges

#### What You'll Get

**tasks.md**:
```markdown
# User Authentication - Task List

## Setup & Configuration
- [ ] 1. Install Clerk SDK (`npm install @clerk/nextjs`) - 2 min
- [ ] 2. Add Clerk API keys to `.env.local` - 2 min
- [ ] 3. Configure Clerk in `app/layout.tsx` - 5 min
- [ ] 4. Create `users` table in Supabase - 5 min

## Sign-Up Flow
- [ ] 5. Create `/sign-up` page with Clerk component - 10 min
- [ ] 6. Add webhook to sync Clerk user to Supabase - 15 min
- [ ] 7. Create user profile completion form - 20 min
- [ ] 8. Add email verification flow - 10 min

## Sign-In Flow
- [ ] 9. Create `/sign-in` page - 10 min
- [ ] 10. Add Google OAuth provider - 10 min
- [ ] 11. Configure post-login redirect logic - 5 min

## Password Reset
- [ ] 12. Add "Forgot password?" link - 5 min
- [ ] 13. Implement password reset flow - 15 min

## Testing & Polish
- [ ] 14. Write Playwright tests for sign-up/sign-in - 20 min
- [ ] 15. Add loading states - 10 min
- [ ] 16. Test error scenarios - 15 min
- [ ] 17. Verify accessibility - 10 min

## Dependencies
- Task 8 depends on Task 6 (need webhook first)
- Tasks 14-17 should be done after features work

## Estimated Time
- Setup: 15 min
- Implementation: 2 hours
- Testing: 30 min
- **Total: ~2.5 hours**
```

#### Why This Matters

Breaking features into small tasks:
- Makes progress visible
- Prevents overwhelm
- Enables parallel work (for teams)
- Provides checkpoints for testing

---

### Phase 5: Implement

**Purpose**: Actually build the feature.

**When**: When you're ready to code.

**Duration**: 30 minutes to 2+ hours (varies by feature).

#### What Happens

The AI:
1. Reads your standards (design-principles.md, coding-style.md, etc.)
2. Reads your spec
3. Implements each task following both
4. Writes comments in plain language (if using ryan profile)
5. Adds tests for each component
6. Runs tests after each task
7. Fixes failures
8. Creates a verification report

You can:
- Implement all tasks: `/implement-tasks user-authentication`
- Implement specific tasks: `/implement-tasks user-authentication --tasks 1,2,3`
- Pause and resume anytime

#### What You'll Get

**Working Code**:
```typescript
// src/app/sign-up/page.tsx
import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignUp
        routing="path"
        path="/sign-up"
        afterSignUpUrl="/onboarding"
      />
    </div>
  )
}
```

**Tests**:
```typescript
// tests/auth.spec.ts
test('user can sign up with email and password', async ({ page }) => {
  await page.goto('/sign-up')
  await page.fill('[name="email"]', 'test@example.com')
  await page.fill('[name="password"]', 'SecurePass123')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/onboarding')
})
```

**All Following Your Standards**:
- S-tier UI (if using ryan profile)
- Accessible (keyboard navigation, screen readers)
- Secure (input validation, SQL injection prevention)
- Tested (every flow has tests)
- Commented (plain language explanations)

#### Why This Matters

This is where the magic happens. The AI builds production-ready code that:
- Matches your standards automatically
- Includes tests automatically
- Handles edge cases automatically
- Looks professional automatically

All because you did the planning upfront.

---

### Phase 6: Verify

**Purpose**: Confirm the feature is production-ready.

**When**: Automatically during Phase 5.

**Duration**: Automatic.

#### What Happens

The AI automatically:
1. Runs all tests (unit, integration, e2e)
2. Checks code quality (linting, type checking)
3. Verifies security (input validation, auth checks)
4. Confirms accessibility (keyboard nav, ARIA labels)
5. Generates a verification report

#### What You'll Get

**verification.md**:
```markdown
# User Authentication - Verification Report

Generated: 2024-01-15 14:30

## Summary
✓ All 17 tasks completed
✓ All tests passing (23/23)
✓ Code review: PASSED
✓ Security check: PASSED
✓ Accessibility: PASSED

## Test Results

### Sign-Up Flow
✓ User can sign up with email/password
✓ Invalid email shows error
✓ Short password shows error
✓ Duplicate email shows error
✓ Success redirects to onboarding
✓ User appears in database
✓ Clerk and Supabase IDs match
✓ Email verification sent

### Sign-In Flow
✓ User can sign in with email/password
✓ User can sign in with Google
✓ Invalid credentials show error
✓ Success redirects to dashboard
✓ Session persists across page loads
✓ Sign out works correctly
✓ Protected routes require auth

### Password Reset
✓ Forgot password link visible
✓ Reset email sent successfully
✓ Reset link works
✓ User can set new password
✓ Old password no longer works

### Edge Cases
✓ Network errors handled gracefully
✓ Loading states prevent double-submission
✓ Errors display user-friendly messages

## Code Quality

### Linting
✓ No ESLint errors
✓ No TypeScript errors
✓ All imports sorted correctly

### Standards Compliance
✓ Follows design-principles.md
✓ Uses S-tier components (shadcn/ui)
✓ Accessible (keyboard navigation works)
✓ Responsive (mobile, tablet, desktop tested)

## Security

✓ Password hashing via Clerk (bcrypt)
✓ HTTPS enforced
✓ Rate limiting on signup endpoint
✓ Email validation (client + server)
✓ SQL injection prevention (parameterized queries)
✓ XSS prevention (input sanitization)
✓ CSRF protection (Clerk handles)

## Ready for Production
✓ Feature is complete and verified
✓ No blocking issues found
✓ Meets all acceptance criteria
✓ Ready to deploy

## Next Steps
- Update boundless-os/product/roadmap.md
- Consider adding 2FA (future enhancement)
- Monitor signup conversion rate
```

#### Why This Matters

The verification report gives you confidence that:
- Everything works
- Nothing is broken
- Quality is high
- It's safe to deploy

No "I think it works"—you have proof.

---

## When to Use Each Phase

### Decision Tree

```
START
  │
  ├─ Do you have a product mission?
  │   NO  → Run /plan-product
  │   YES → Continue
  │
  ├─ Do you have a feature to build?
  │   NO  → Review your roadmap, decide next feature
  │   YES → Continue
  │
  ├─ Have you shaped this feature (requirements.md)?
  │   NO  → Run /shape-spec [feature-name]
  │   YES → Continue
  │
  ├─ Have you written the spec (spec.md)?
  │   NO  → Run /write-spec [feature-name]
  │   YES → Continue
  │
  ├─ Have you created tasks (tasks.md)?
  │   NO  → Run /create-tasks [feature-name]
  │   YES → Continue
  │
  ├─ Have you implemented (code exists)?
  │   NO  → Run /implement-tasks [feature-name]
  │   YES → Feature complete! Update roadmap.
  │
  └─ Return to top, pick next feature
```

---

## Single-Agent vs Multi-Agent

Boundless OS supports two execution modes:

### Single-Agent Mode

**How it works**:
- One AI agent does all the work
- Commands execute in your main chat
- Simpler, more direct

**Pros**:
- Easier to understand
- More conversational
- Good for learning
- Works with any AI tool

**Cons**:
- Can be slower for complex features
- One agent handles multiple specializations
- Context limits may be hit sooner

**When to use**:
- You're new to Boundless OS
- Your features are straightforward
- You prefer more control
- You're using an AI tool other than Claude Code

**Command example**:
```
/plan-product
[AI in your current chat handles everything]
```

---

### Multi-Agent Mode

**How it works**:
- Specialized agents for different tasks
- Commands delegate to the right agent
- Product Planner, Spec Writer, Implementer, etc.
- Each agent optimized for its role

**Pros**:
- Faster for complex features
- Specialized expertise per phase
- Better context management
- More powerful orchestration

**Cons**:
- Slightly more complex
- Requires Claude Code with subagents feature
- Less conversational

**When to use**:
- You're comfortable with Boundless OS
- Your features are complex
- You want maximum efficiency
- You're using Claude Code

**Command example**:
```
/plan-product
[Delegates to Product Planner agent]
[Agent completes work autonomously]
[Returns results to you]
```

**Configuration**:
```bash
# Enable multi-agent mode
~/boundless-os/scripts/project-install.sh --use-claude-code-subagents true
```

---

## Real-World Examples

### Example 1: SaaS App MVP

**Goal**: Build a basic SaaS app with auth, dashboard, and billing.

**Timeline**: 2 weeks

**Workflow**:

```
Week 1:
Day 1:  /plan-product (30 min)
        → Defined mission, roadmap, tech stack

Day 1:  /shape-spec user-authentication (20 min)
        → Decided: Clerk, email+Google, admin roles

Day 1:  /write-spec user-authentication (5 min)
        → Formal spec generated

Day 1:  /create-tasks user-authentication (5 min)
        → 17 tasks identified

Day 1-2: /implement-tasks user-authentication (2.5 hours)
         → Auth complete, all tests passing

Day 2:  /shape-spec dashboard (15 min)
        → Decided layout, metrics to show

Day 2:  /write-spec dashboard (5 min)
        → Spec with component breakdown

Day 2:  /create-tasks dashboard (5 min)
        → 12 tasks

Day 2-3: /implement-tasks dashboard (2 hours)
         → Dashboard complete with charts

Week 2:
Day 1:  /shape-spec billing-integration (20 min)
        → Decided: Stripe, 3 tiers, customer portal

Day 1:  /write-spec billing-integration (5 min)
        → Spec with Stripe integration details

Day 1:  /create-tasks billing-integration (5 min)
        → 20 tasks

Day 1-3: /implement-tasks billing-integration (4 hours)
         → Billing complete, webhooks working

Day 4-5: Testing, polish, deploy

Result: MVP live in 2 weeks
```

---

### Example 2: Adding a Feature to Existing App

**Scenario**: Your app exists, you want to add "team workspaces."

**Workflow**:

```
Step 1: Check your mission
        → Does this align? Yes, teams are the target.

Step 2: /shape-spec team-workspaces (25 min)
        → Define: What's a workspace? Who can create them?
          What permissions exist?

Step 3: /write-spec team-workspaces (5 min)
        → Spec includes: DB schema changes, new UI,
          permission system, invitation flow

Step 4: /create-tasks team-workspaces (5 min)
        → 30 tasks identified (complex feature)

Step 5: /implement-tasks team-workspaces (6 hours)
        → Feature complete with tests

Step 6: Review verification.md
        → All tests pass, ready to deploy

Result: Feature added in 1-2 days
```

---

## Tips & Tricks

### 1. Don't Skip Planning

**Tempting**:
```
"I know exactly what I want. Let's just code!"
[4 hours later]
"Wait, this isn't what I meant..."
```

**Better**:
```
[20 minutes of shaping]
[5 minutes spec writing]
[5 minutes task creation]
[Implement with clear direction]
[Done right the first time]
```

---

### 2. Shape Thoroughly

The quality of your implementation depends on the quality of your shaping.

**Bad shaping**:
```
/shape-spec search
AI: "What kind of search?"
You: "Just search"
AI: [creates basic text search]
You: "No, I meant AI-powered semantic search with filters"
```

**Good shaping**:
```
/shape-spec search
AI: "What kind of search?"
You: "AI-powered semantic search using OpenAI embeddings.
     Need filters for: date, category, author.
     Results should show snippets with highlights.
     Support fuzzy matching."
AI: [creates exactly what you described]
```

---

### 3. Review Specs Before Implementing

After `/write-spec`, read the spec.md:
```bash
cat boundless-os/specs/my-feature/spec.md
```

Check:
- Are the user stories correct?
- Is the technical approach sound?
- Any missing acceptance criteria?

It's easier to fix the spec than the implementation.

---

### 4. Implement in Batches

For large features with 30+ tasks:

**Don't**:
```
/implement-tasks huge-feature
[AI works for 6 hours]
[You have no idea what's happening]
```

**Do**:
```
/implement-tasks huge-feature --tasks 1-10
[Review first batch]
[Test first batch]

/implement-tasks huge-feature --tasks 11-20
[Review second batch]
[Test second batch]

[etc.]
```

---

### 5. Update Your Roadmap

After each feature:
```bash
code boundless-os/product/roadmap.md
```

Mark completed features and adjust priorities based on what you learned.

---

### 6. Use Orchestration for Complex Features

For features with 25+ tasks or multiple systems:

```
/orchestrate-tasks complex-feature
```

This uses multi-agent orchestration to parallelize work and coordinate dependencies.

---

### 7. Keep Standards Updated

As you learn what works:

```bash
code boundless-os/standards/design-principles.md
```

Add new patterns, remove outdated ones. Standards evolve with your product.

---

### 8. Review Verification Reports

Don't just trust "/implement-tasks" succeeded. Read the verification report:

```bash
cat boundless-os/specs/my-feature/verification.md
```

Check:
- All tests passed
- Security validated
- Accessibility confirmed

---

## Summary

### The Workflow in One Image

```
                    Boundless OS Workflow
                    ─────────────────

                         START
                           │
                           ▼
                    ┌──────────────┐
                    │ Plan Product │  ← Do once
                    └──────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │                                      │
        │        FOR EACH FEATURE:             │
        │                                      │
        │   Shape → Write Spec → Create Tasks  │
        │              │                       │
        │              ▼                       │
        │        Implement + Verify            │
        │              │                       │
        │              ▼                       │
        │       Feature Complete! ✓            │
        │                                      │
        └──────────────────────────────────────┘
                           │
                           ▼
                  Product Complete! 🎉
```

### Key Principles

1. **Plan before you code** - 30 minutes of planning saves hours of rework
2. **Follow the sequence** - Each phase builds on the previous
3. **One feature at a time** - Complete the full cycle before starting another
4. **Standards drive quality** - Good standards = good implementations automatically
5. **Verification gives confidence** - Don't deploy until you've verified

### Commands Quick Reference

| Phase | Command | Duration |
|-------|---------|----------|
| 1. Plan Product | `/plan-product` | 15-30 min |
| 2. Shape Spec | `/shape-spec [feature]` | 10-20 min |
| 3. Write Spec | `/write-spec [feature]` | 5 min |
| 4. Create Tasks | `/create-tasks [feature]` | 5 min |
| 5. Implement | `/implement-tasks [feature]` | 30 min - 2 hrs |
| 6. Verify | (automatic) | Automatic |

---

## Questions?

- **Quickstart Guide**: See `QUICKSTART.md`
- **Troubleshooting**: See `TROUBLESHOOTING.md`
- **FAQ**: See `FAQ.md`
- **Examples**: See `examples/`
- **GitHub**: [github.com/buildermethods/boundless-os](https://github.com/buildermethods/boundless-os)

**Now you understand the workflow—time to build!** 🚀
