Create `boundless-os/product/tech-stack.md` with a list of all tech stack choices that cover all aspects of this product's codebase.

### Creating the Tech Stack document

#### Step 1: Note User's Input Regarding Tech Stack

IF the user has provided specific information in the current conversation in regards to tech stack choices, these notes ALWAYS take precidence.  These must be reflected in your final `tech-stack.md` document that you will create.

#### Step 2: Run Fit Check Against Recommended Stack (Guidance, not mandate)

Before adopting any recommended defaults from the user's standards, run a quick fit check:
- Does this product need SSR/SEO or server-rendered marketing pages? If yes, consider Next.js on Cloudflare Pages Functions (or hybrid) instead of SPA‑only.
- Are there region/regulatory constraints (EU-only, HIPAA, etc.)? Verify provider regions/compliance; propose compliant alternatives if needed.
- Does the team have required familiarity for the proposed stack? If not, offer transitional options.
- Are there existing provider commitments (e.g., Vercel, AWS)? Ensure compatibility or propose adapters.
- Are realtime/websocket-heavy features required? Validate approach; propose alternates if needed.
- Do budget constraints require lower-cost variants? Consider Workers AI fallback and minimal tiers.

If any item fails, prepare 1–2 alternative options with concise pros/cons.

#### Step 3: Gather User's Default Tech Stack Information

Reconcile and fill in the remaining gaps in the tech stack list by finding, reading and analyzing information regarding the tech stack.  Find this information in the following sources, in this order:

1. If user has provided their default tech stack under "User Standards & Preferences Compliance", READ and analyze this document.
2. If the current project has any of these files, read them to find information regarding tech stack choices for this codebase:
  - `claude.md`
  - `agents.md`

#### Step 4: Present Options & Confirm with Founder

Create a short proposal in the conversation with:
- Option A (recommended) + 2–3 bullet pros/cons
- Option B (alternative) + 2–3 bullet pros/cons
- Call to action: "Please confirm Option A or B (or request changes)."

Do not finalize the stack until the founder confirms.

#### Step 5: Create the Tech Stack Document

Create `boundless-os/product/tech-stack.md` and populate it with the final list of all technical stack choices, reconciled between the information the user has provided to you and the information found in provided sources.
