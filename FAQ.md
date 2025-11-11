# Boundless OS Frequently Asked Questions

Common questions about Boundless OS, answered in plain language.

---

## General Questions

### What is Boundless OS?

Boundless OS is a **development framework that guides AI coding assistants** (like Claude Code, Cursor, or Windsurf) through structured workflows to build your product.

Think of it as giving your AI agent:
- **Standards** (how to code, design, test)
- **Context** (your product vision, tech stack)
- **Structure** (follow these phases: plan → spec → implement)

Instead of: "Claude, build me authentication" (and getting something random)
You get: "Claude, follow the Boundless OS authentication workflow" (and getting production-ready code that matches your standards)

---

### Do I need to know how to code to use Boundless OS?

**No, not necessarily.** Boundless OS has a "ryan" profile specifically designed for non-technical founders.

With the ryan profile:
- AI speaks in plain language (no jargon)
- Design principles produce professional UI (Stripe/Notion quality) automatically
- Security best practices are built-in
- Comments explain what code does in simple terms

**However**, you should:
- Understand your product idea clearly
- Be able to describe what you want to build
- Be willing to learn basic concepts (what's a database, what's an API)
- Review and test what's being built

Boundless OS makes AI build *for* you, but you're still the product owner guiding the vision.

---

### What AI coding tools does Boundless OS work with?

Boundless OS works with:
- **Claude Code** (recommended) - Anthropic's official CLI
- **Cursor** - AI-first code editor
- **Windsurf** - Codeium's AI IDE
- **Any AI tool** that can read markdown files

**Best experience**: Claude Code with multi-agent mode enabled.

---

### How is Boundless OS different from just using ChatGPT/Claude?

| Without Boundless OS | With Boundless OS |
|-----------------|---------------|
| Freeform prompting | Structured workflows |
| Inconsistent code quality | Standards enforced automatically |
| No product context | Mission & roadmap guide decisions |
| Rework common | Spec-driven (build it right first time) |
| "Build auth" → varies wildly | "Build auth" → follows your standards |
| Tests? Maybe, if you ask | Tests included automatically |

Boundless OS transforms AI from "helpful intern" to "senior developer who knows your codebase."

---

### Is Boundless OS free?

**Yes!** Boundless OS is free and open source (MIT license).

However, the AI tools themselves may have costs:
- Claude Code: Requires Claude Pro subscription ($20/month)
- Cursor: Has free and paid tiers
- Windsurf: Has free and paid tiers

---

### Can I use Boundless OS for existing projects?

**Yes!** You can install Boundless OS into any existing project:

```bash
cd /path/to/your/existing/project
~/boundless-os/scripts/project-install.sh
```

Boundless OS will:
- Install standards (you can customize these to match your existing code)
- Add commands to `.claude/commands/`
- Create `boundless-os/` folder for specs and product docs

Your existing code remains unchanged. Boundless OS is additive, not destructive.

---

### What languages/frameworks does Boundless OS support?

**All of them!** Boundless OS is language/framework agnostic.

The "ryan" profile defaults to:
- Frontend: Next.js + React + Tailwind
- Backend: Next.js API Routes + Supabase
- Auth: Clerk

But you can customize `boundless-os/standards/tech-stack.md` to use:
- Python/Django, Ruby/Rails, Laravel/PHP, Spring Boot/Java
- Vue, Svelte, Angular
- PostgreSQL, MySQL, MongoDB
- Any auth provider, payment provider, etc.

Boundless OS provides the *structure*. You choose the *technologies*.

---

## Installation & Setup

### Where should I install Boundless OS?

Boundless OS has two installations:

1. **Base installation** (do once):
   ```bash
   git clone https://github.com/buildermethods/boundless-os ~/boundless-os
   ```
   This goes in `~/boundless-os` (your home directory).

2. **Project installation** (do per project):
   ```bash
   cd /path/to/your/project
   ~/boundless-os/scripts/project-install.sh
   ```
   This installs Boundless OS *into* your project folder.

**Important**: Never install the project-level Boundless OS into `~/boundless-os`. That's the base installation.

---

### I ran the wizard but nothing happened. What now?

The wizard guides you through setup. After it completes:

1. **Check installation succeeded**:
   ```bash
   ls boundless-os/
   # Should see: standards/, config.yml, etc.
   ```

2. **If using Claude Code**, restart it:
   ```bash
   # Exit Claude Code (Ctrl+C)
   # Re-open in your project
   claude-code
   ```

3. **Try your first command**:
   ```
   /plan-product
   ```

4. **Still not working?** Run a health check:
   ```bash
   ~/boundless-os/scripts/health-check.sh
   ```

---

### Can I install Boundless OS in multiple projects?

**Yes!** That's the intended use.

- Base installation: Once in `~/boundless-os`
- Project installation: Once per project

Each project gets its own:
- Standards (can customize per project)
- Product mission & roadmap
- Specs for features

They all share the base Boundless OS installation.

---

### How do I update Boundless OS?

**Update base installation**:
```bash
cd ~/boundless-os
git pull origin main
```

**Update project installation**:
```bash
cd /path/to/your/project
~/boundless-os/scripts/project-update.sh
```

**Note**: Updating will bring in new Boundless OS features but won't overwrite your:
- Product documents (mission.md, roadmap.md)
- Specs
- Custom standards (unless you use `--overwrite-standards`)

---

### Can I uninstall Boundless OS?

**Yes.** Boundless OS includes an uninstall script:

```bash
cd /path/to/your/project
~/boundless-os/scripts/uninstall.sh
```

This removes:
- `boundless-os/` folder (standards, config)
- `.claude/commands/boundless-os/`
- `.claude/agents/boundless-os/`

**But preserves**:
- Your actual code (src/, app/, etc.)
- Your product documents (mission, roadmap, specs)

You can also manually delete:
```bash
rm -rf boundless-os/
rm -rf .claude/commands/boundless-os/
rm -rf .claude/agents/boundless-os/
```

---

## Using Boundless OS

### What should I do first after installing?

1. **Plan your product** (15-30 minutes):
   ```
   /plan-product
   ```
   This creates your mission, roadmap, and tech stack.

2. **Shape your first feature** (10-20 minutes):
   ```
   /shape-spec user-authentication
   ```
   (Replace "user-authentication" with whatever feature you want to build first)

3. **Complete the workflow**:
   ```
   /write-spec user-authentication
   /create-tasks user-authentication
   /implement-tasks user-authentication
   ```

4. **Celebrate!** You've gone from idea to working code with Boundless OS.

---

### Do I have to follow the 6-phase workflow exactly?

**Yes and no.**

**For best results, yes**: The workflow exists because it works. Skipping phases leads to rework.

**But you can adapt it**:
- Already have a mission? Skip `/plan-product`
- Feature is super simple? Combine shaping + spec writing
- Want to implement just a few tasks? Use `/implement-tasks [feature] --tasks 1,2,3`

The workflow is a guide, not a prison. But don't skip planning!

---

### Can I customize the standards?

**Absolutely!** Standards are just markdown files. Edit them:

```bash
# Edit an existing standard
code boundless-os/standards/design-principles.md

# Add a new standard
touch boundless-os/standards/my-custom-rule.md
```

Changes apply to future implementations (already-built features won't automatically update).

**Tip**: If you make standards changes you love, consider:
- Creating a custom profile
- Contributing back to Boundless OS (open a PR!)

---

### What if I don't like the "ryan" profile defaults?

Switch to the "default" profile:

```bash
~/boundless-os/scripts/project-install.sh --profile default --re-install
```

Or create your own profile:

```bash
~/boundless-os/scripts/create-profile.sh my-custom-profile
```

Then customize the standards in `~/boundless-os/profiles/my-custom-profile/standards/`.

---

### Can I use Boundless OS with a team?

**Yes**, but with considerations:

**Good for teams**:
- Enforces consistent standards across developers
- Product mission/roadmap aligns everyone
- Specs provide clear requirements
- New team members onboard faster

**Requires coordination**:
- Commit `boundless-os/` folder to git
- Team agrees on standards
- Specs live in the repo (everyone can reference them)
- Choose single-agent or multi-agent mode consistently

**Best practice**: One person "owns" Boundless OS standards. Team suggests changes via PR.

---

### How long does it take to build a feature?

**Typical times**:

| Feature Complexity | Shaping | Spec + Tasks | Implementation | Total |
|-------------------|---------|--------------|----------------|-------|
| Simple (button, form) | 5-10 min | 5 min | 15-30 min | 25-45 min |
| Medium (auth, dashboard) | 15-20 min | 10 min | 1-2 hours | 1.5-2.5 hrs |
| Complex (payments, admin) | 20-30 min | 10 min | 2-4 hours | 2.5-5 hrs |
| Very Complex (multi-step) | 30+ min | 15 min | 4-8 hours | 5-9 hrs |

**First feature takes longest** (you're learning the workflow).
**Subsequent features are faster** (you understand the pattern).

Compare to traditional AI prompting where you might spend 4 hours on back-and-forth for a medium feature.

---

### What if the AI makes a mistake?

Even with Boundless OS, AI can make mistakes. Here's what to do:

1. **Check the spec**: Is the mistake because the spec was unclear?
   - Fix the spec: Edit `boundless-os/specs/[feature]/spec.md`
   - Re-implement: `/implement-tasks [feature]` (it will use the updated spec)

2. **Check your standards**: Does your standard need clarification?
   - Edit `boundless-os/standards/[standard-name].md`
   - Re-implement

3. **Report bugs**: If it's an Boundless OS bug, [open an issue](https://github.com/buildermethods/boundless-os/issues)

**Remember**: Boundless OS makes mistakes less likely (via structure), but doesn't eliminate them.

---

## Profiles & Standards

### What's the difference between "ryan" and "default" profiles?

| Aspect | Ryan Profile | Default Profile |
|--------|-------------|-----------------|
| Target | Non-technical founders | Experienced developers |
| Communication | Plain language, no jargon | Technical language OK |
| Design | S-tier UI (Stripe/Notion quality) | Flexible design |
| Tech Stack | Opinionated (Next.js, Supabase, Clerk) | Flexible (you choose) |
| Testing | Visual (Playwright) | Mix of unit/integration/e2e |
| Standards | 7 files (22 if inherited from default) | 15 files |

**Use ryan if**: You're non-technical or want maximum hand-holding.
**Use default if**: You're a developer and want more flexibility.

---

### Can I mix profiles?

**Not directly**, but you can:

1. Start with one profile:
   ```bash
   ~/boundless-os/scripts/project-install.sh --profile ryan
   ```

2. Copy standards from another profile:
   ```bash
   cp ~/boundless-os/profiles/default/standards/api.md boundless-os/standards/
   ```

3. Customize as needed

Or create a custom profile that mixes both.

---

### How do I create a custom profile?

```bash
~/boundless-os/scripts/create-profile.sh my-profile
```

This creates:
```
~/boundless-os/profiles/my-profile/
├── agents/        (copied from default)
├── commands/      (copied from default)
├── workflows/     (copied from default)
└── standards/     (empty - you populate these)
```

Then edit standards:
```bash
code ~/boundless-os/profiles/my-profile/standards/
```

Install with your profile:
```bash
~/boundless-os/scripts/project-install.sh --profile my-profile
```

---

## Technical Questions

### Does Boundless OS work offline?

**Partially:**

- The workflows, standards, and structure work offline
- But the AI tools (Claude Code, Cursor, etc.) require internet to communicate with AI models

You can read docs, specs, and standards offline. You can't generate new code offline.

---

### What if my internet is slow?

Boundless OS doesn't add overhead—it's just markdown files the AI reads.

If your internet is slow:
- Commands take longer (waiting for AI responses)
- But results are the same

**Tip**: Use multi-agent mode. Agents can work on different tasks, so slow internet affects individual tasks, not the whole workflow.

---

### Can I use Boundless OS with GitHub Copilot?

**Sort of.** GitHub Copilot is an autocomplete tool, not a command-driven AI agent.

Boundless OS is designed for:
- Claude Code (command-driven)
- Cursor (can execute commands)
- Windsurf (can execute commands)

Copilot doesn't have a command system, so you can't run `/plan-product` in Copilot.

**But**: You can use Boundless OS standards with Copilot:
- Keep standards in `boundless-os/standards/`
- Reference them in your code comments
- Copilot might pick up on patterns

Boundless OS works best with command-driven AI tools.

---

### How does Boundless OS handle secrets/environment variables?

Boundless OS never touches your `.env` files or secrets.

**Best practices** (enforced by ryan profile):
- Never commit `.env` to git
- Use environment variables for API keys
- Boundless OS implementations reference `process.env.VARIABLE_NAME`
- You manually add secrets to `.env` after code is generated

**Example**:
```typescript
// Boundless OS generates this:
const apiKey = process.env.STRIPE_SECRET_KEY

// You add this to .env:
STRIPE_SECRET_KEY=sk_test_...
```

---

### Can I version control Boundless OS files?

**Yes, you should!**

**Commit to git**:
- `boundless-os/product/` (mission, roadmap, tech stack)
- `boundless-os/specs/` (all feature specifications)
- `boundless-os/standards/` (your customized standards)
- `boundless-os/config.yml`
- `.claude/commands/boundless-os/` (if you customize commands)

**Don't commit**:
- `~/boundless-os/` (the base installation)

**Why**: Your team needs access to product docs, specs, and standards to stay aligned.

---

## Troubleshooting

### Commands aren't showing up in Claude Code

**Solutions**:

1. **Restart Claude Code**:
   ```bash
   # Exit (Ctrl+C or Cmd+Q)
   # Reopen
   claude-code
   ```

2. **Check commands exist**:
   ```bash
   ls .claude/commands/boundless-os/
   # Should see: plan-product.md, shape-spec.md, etc.
   ```

3. **Reinstall commands**:
   ```bash
   ~/boundless-os/scripts/project-install.sh --claude-code-commands true
   ```

4. **Check you're in the project directory**:
   ```bash
   pwd
   # Should be your project, NOT ~/boundless-os
   ```

---

### AI isn't following my standards

**Solutions**:

1. **Check standards are installed**:
   ```bash
   ls boundless-os/standards/
   ```

2. **Check standards are clear and specific**:
   ```bash
   cat boundless-os/standards/design-principles.md
   ```
   Vague standards → vague results.
   Specific standards → specific results.

3. **Explicitly reference standards**:
   ```
   /implement-tasks my-feature

   Make sure to follow design-principles.md exactly, especially the section on button styles.
   ```

4. **Reinstall standards**:
   ```bash
   ~/boundless-os/scripts/project-install.sh --overwrite-standards
   ```

---

### I'm getting "Boundless OS not installed" errors

**Solution**:

Check you're in the right directory:

```bash
pwd
# Should be your project directory, not ~/boundless-os

ls boundless-os/
# Should show: standards/, config.yml, etc.
```

If `boundless-os/` doesn't exist:
```bash
~/boundless-os/scripts/project-install.sh
```

---

### How do I get help?

1. **Check documentation**:
   - `QUICKSTART.md` - Getting started
   - `WORKFLOW.md` - Understanding the process
   - `TROUBLESHOOTING.md` - Common issues
   - This FAQ!

2. **Run health check**:
   ```bash
   ~/boundless-os/scripts/health-check.sh
   ```

3. **Search GitHub issues**:
   - [github.com/buildermethods/boundless-os/issues](https://github.com/buildermethods/boundless-os/issues)
   - Someone may have had the same problem

4. **Open a new issue**:
   - If you found a bug or have a feature request
   - Include: OS, Boundless OS version, what you tried, what happened

5. **Join the community**:
   - GitHub Discussions
   - Follow updates on the website

---

## Advanced Topics

### Can I use Boundless OS with CI/CD?

**Yes.** Boundless OS-generated code is just regular code.

Your CI/CD pipeline can:
- Run tests (Boundless OS creates tests)
- Lint code (Boundless OS follows your linting standards)
- Deploy (no special handling needed)

Boundless OS doesn't interfere with CI/CD—it just helps you write better code faster.

---

### Can I use multi-agent orchestration for complex features?

**Yes!** Use `/orchestrate-tasks` for features with 25+ tasks:

```
/orchestrate-tasks complex-feature
```

This:
- Splits tasks into groups
- Assigns groups to specialized agents
- Coordinates dependencies
- Runs tasks in parallel where possible

**When to use**:
- Features with 25+ tasks
- Features touching multiple systems (DB, API, frontend, auth, etc.)
- Features with parallel work streams

**When not to use**:
- Simple features (<15 tasks)
- Your first few features (learn the basics first)

---

### How do I contribute to Boundless OS?

**Ways to contribute**:

1. **Open issues**: Bug reports, feature requests
2. **Submit PRs**: Fix bugs, add features, improve docs
3. **Share profiles**: Create a profile, share it
4. **Write examples**: Real-world workflows, case studies
5. **Improve standards**: Suggest better patterns

**Getting started**:
1. Fork the repo
2. Make changes
3. Test with real projects
4. Open a PR with description

See [github.com/buildermethods/boundless-os](https://github.com/buildermethods/boundless-os) for contribution guidelines.

---

## Philosophy & Approach

### Why spec-driven development?

**Traditional approach**:
```
"Build feature X"
[AI builds something]
"No, like this"
[AI rebuilds]
"Almost, but..."
[AI tries again]
```

Result: 3-5 iterations, wasted time.

**Spec-driven approach**:
```
[Spend 20 minutes specifying exactly what you want]
"Build feature X per this spec"
[AI builds it correctly the first time]
```

Result: 1 iteration, done right.

**The philosophy**: Computers are great at following instructions. Humans are great at deciding what to build. Spec-driven development puts each in their strength zone.

---

### Why can't I just prompt the AI directly?

You can! But without structure:

- Quality varies wildly
- No consistency across features
- Standards forgotten
- Context lost between sessions
- Rework common

Boundless OS doesn't prevent prompting—it makes prompting more effective through:
- Persistent context (mission, standards)
- Proven workflows (reduce trial-and-error)
- Quality enforcement (standards applied automatically)

Think of it as: Freeform prompting is like improvising a song. Boundless OS is like following sheet music. Both are valid, but sheet music produces consistent results.

---

## Still Have Questions?

**Check these resources**:
- [QUICKSTART.md](./QUICKSTART.md) - Comprehensive getting started guide
- [WORKFLOW.md](./WORKFLOW.md) - Deep dive on the 6-phase workflow
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues and solutions
- [GitHub Issues](https://github.com/buildermethods/boundless-os/issues) - Search existing issues
- [GitHub Discussions](https://github.com/buildermethods/boundless-os/discussions) - Community Q&A

**Can't find your answer?**
[Open a new issue](https://github.com/buildermethods/boundless-os/issues/new) with the label `question`.

---

**Happy building!** 🚀
