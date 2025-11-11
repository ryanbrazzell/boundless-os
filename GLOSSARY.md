# Boundless OS Glossary

Plain language explanations of technical terms used in Boundless OS.

---

## Boundless OS Terms

### Boundless OS
The structured development framework you're using. Provides workflows, standards, and commands that guide AI coding assistants.

### Base Installation
The main Boundless OS folder in `~/boundless-os` that contains profiles, scripts, and shared resources. Install once, use for all projects.

### Project Installation
Boundless OS installed into a specific project folder. Contains standards, specs, and commands for that project. Install once per project.

### Profile
A collection of standards, agents, and workflows optimized for a specific type of user. Examples: "ryan" (non-technical founders), "default" (developers).

### Standards
Markdown files that define how code should be written, what designs should look like, and what quality means for your project. The AI reads these to understand your expectations.

### Spec (Specification)
A detailed document describing exactly what a feature should do, how it should work, and how to implement it. Think of it as a blueprint for your feature.

### Workflow
The structured process Boundless OS uses to go from idea to working code. Six phases: Plan Product → Shape Spec → Write Spec → Create Tasks → Implement → Verify.

---

## Development Phases

### Phase 1: Plan Product
Creating your product's mission statement, development roadmap, and tech stack choices. Do this once per project.

### Phase 2: Shape Spec
Figuring out what a feature should do before writing detailed specs. Interactive Q&A with the AI. Do this for each new feature.

### Phase 3: Write Spec
Converting requirements into a formal technical specification with acceptance criteria, technical approach, and implementation details. Mostly automated.

### Phase 4: Create Tasks
Breaking a specification into small, implementable tasks (like "create sign-up page" or "add error handling"). Mostly automated.

### Phase 5: Implement
Actually writing the code, tests, and documentation for your feature. The AI does this by following your spec and standards.

### Phase 6: Verify
Checking that everything works: tests pass, code quality is good, security is solid, accessibility works. Happens automatically during implementation.

---

## AI & Tools

### AI Agent
The AI assistant (like Claude, GPT, etc.) that writes code for you. "Agent" emphasizes that it's doing work autonomously, not just answering questions.

### Claude Code
Anthropic's official command-line interface for using Claude. Recommended AI tool for Boundless OS.

### Cursor
An AI-first code editor (alternative to Claude Code).

### Windsurf
Codeium's AI IDE (another alternative).

### Single-Agent Mode
One AI agent does all the work. Simpler, more conversational. Good for learning or simple projects.

### Multi-Agent Mode
Different specialized AI agents handle different tasks. More powerful, faster for complex work. Requires Claude Code with subagent support.

### Subagent
A specialized AI agent that handles one specific type of task (like Product Planner, Spec Writer, or Implementer). Used in multi-agent mode.

### MCP (Model Context Protocol)
A way to give AI tools access to external services like documentation search (Context7) or browser automation (Playwright). Think of it as plugins for AI.

### Context7 MCP
An MCP tool that lets AI search documentation (like Next.js docs, React docs, etc.) to get up-to-date information.

### Playwright MCP
An MCP tool that lets AI control a real browser for testing (clicking buttons, filling forms, checking what users see).

---

## Technical Concepts (Plain Language)

### API (Application Programming Interface)
A way for different programs to talk to each other. Like a menu at a restaurant: lists what you can request and what you'll get back.

### API Endpoint
A specific URL that does one thing. Like `/api/users` might give you a list of users, while `/api/login` handles logging in.

### Authentication (Auth)
Proving who you are (usually with email + password or "Sign in with Google"). Like showing ID to enter a building.

### Authorization
What you're allowed to do after proving who you are. Like having a "visitor" badge vs an "employee" badge—different permissions.

### Backend
The part of your app that runs on servers and handles data, business logic, and security. Users don't see this directly.

### Database (DB)
Where your app stores information permanently (users, posts, settings, etc.). Like a filing cabinet for your app.

### Frontend
The part of your app that users see and interact with (buttons, forms, pages). Runs in the web browser.

### Framework
A set of pre-built tools and structures for building apps faster. Like IKEA furniture vs building from raw wood—framework provides the pieces, you assemble them.

### Git
A system for tracking changes to your code over time. Like "track changes" in Microsoft Word, but much more powerful.

### GitHub
A website where developers store code, collaborate with others, and track issues. Uses Git.

### Middleware
Code that runs between a request coming in and a response going out. Like a security guard checking everyone entering a building.

### Migration
A change to your database structure (adding a new table, adding a column, etc.). Called a "migration" because you're moving from one database structure to another.

### Repository (Repo)
A folder containing your project's code and Git history. Usually stored on GitHub.

### Tech Stack
The collection of technologies your app uses (programming language, database, frameworks, hosting, etc.). Like the ingredients list for a recipe.

---

## Code & Quality

### Acceptance Criteria
Specific conditions that must be true for a feature to be considered "done." Example: "User can sign up with email and password" or "Error messages appear in red."

### Bug
An error or unexpected behavior in your code. When code doesn't do what it's supposed to.

### Code Review
Someone checking your code for mistakes, security issues, or ways to improve it. Boundless OS does this automatically.

### Edge Case
An unusual situation your code needs to handle. Example: What happens if someone enters 1000 characters in a name field meant for 50?

### Linting
Automatically checking code for style issues and common mistakes. Like spellcheck for code.

### Refactoring
Improving code structure without changing what it does. Like reorganizing your closet—same clothes, better arrangement.

### Tests
Code that automatically checks if your other code works correctly. Like having a robot QA tester.

### Unit Test
Tests a single small piece of code in isolation (like one function).

### Integration Test
Tests how multiple pieces work together.

### End-to-End Test (E2E)
Tests the entire user flow from start to finish, like a real user would.

---

## Design & UI

### Accessibility (a11y)
Making your app usable by everyone, including people with disabilities (screen readers, keyboard-only navigation, color blindness, etc.).

### Component
A reusable piece of UI. Like a LEGO brick—build it once, use it many times.

### Responsive Design
Making your app look good on all screen sizes (phone, tablet, desktop).

### UI (User Interface)
What users see and interact with (buttons, forms, colors, layout).

### UX (User Experience)
How users feel when using your app. Good UX = easy, pleasant. Bad UX = confusing, frustrating.

###S-Tier Design
The highest quality design—think Stripe, Notion, Apple level. Professional, polished, attention to detail.

---

## Hosting & Deployment

### Deploy / Deployment
Making your app available on the internet for real users. Like opening a store after building it.

### Environment Variable
A secret or setting stored outside your code (like API keys, database passwords). Keeps secrets safe.

### Hosting / Hosting Provider
A company that runs servers where your app lives. Like renting space in a data center.

### Production
The "real" version of your app that actual users see. Opposite of "development" (where you're still building).

### Server
A computer that runs your backend code and responds to user requests. Can be physical or virtual (in the cloud).

### Staging
A test version of your app that looks like production but isn't public. For testing before real launch.

---

## Boundless OS Files & Folders

### `.claude/`
Folder containing Claude Code integration files (commands and agents). The dot means it's hidden by default.

### `boundless-os/`
Main Boundless OS folder in your project. Contains standards, product docs, specs, and config.

### `boundless-os/product/`
Your product vision: mission statement, roadmap, tech stack. Created by `/plan-product`.

### `boundless-os/specs/`
Specifications for each feature. Each feature gets its own subfolder with requirements, spec, tasks, and verification.

### `boundless-os/standards/`
Rules for how code should be written, designed, and tested. The AI reads these to know your expectations.

### `config.yml`
Configuration file telling Boundless OS which profile to use, which commands to install, etc. Like a settings file.

### `mission.md`
Document describing your product's purpose, target customer, and value proposition. Your "why."

### `roadmap.md`
Phased plan for building your product (what to build when). Your development schedule.

### `tech-stack.md`
List of technologies your project uses (Next.js, Supabase, Tailwind, etc.) and why.

### `requirements.md`
Initial feature requirements from Phase 2 (shaping). Less formal than spec.md.

### `spec.md`
Formal technical specification for a feature. Blueprint the AI follows when implementing.

### `tasks.md`
List of small, implementable tasks broken down from a spec.

### `verification.md`
Report showing that a feature works correctly (tests pass, quality checks pass, etc.).

---

## Commands

### `/plan-product`
Command that starts the product planning process. Creates mission, roadmap, tech stack.

### `/shape-spec [feature-name]`
Command that starts defining a new feature through Q&A. Creates requirements.

### `/write-spec [feature-name]`
Command that converts requirements into a formal specification. Creates spec.md.

### `/create-tasks [feature-name]`
Command that breaks a spec into implementable tasks. Creates tasks.md.

### `/implement-tasks [feature-name]`
Command that actually builds the feature (writes code, tests, etc.).

### `/orchestrate-tasks [feature-name]`
Advanced command that uses multiple agents to implement complex features faster.

---

## Quality Terms

### Production-Ready
Code that's good enough to show real users. Has tests, handles errors, looks polished, is secure.

### MVP (Minimum Viable Product)
The simplest version of your product that still solves the core problem. Just enough to launch and learn from users.

### Scope Creep
When a feature keeps growing beyond its original plan. "Let's add this... and this... and this..."—prevents completion.

### Technical Debt
Shortcuts or quick fixes that make code worse long-term. Like credit card debt for code—easy now, painful later.

---

## Questions?

If you don't see a term explained here, check:
- `FAQ.md` - Frequently asked questions
- `QUICKSTART.md` - Comprehensive guide
- `WORKFLOW.md` - Process explanations

Or [open an issue](https://github.com/buildermethods/boundless-os/issues) to ask!
