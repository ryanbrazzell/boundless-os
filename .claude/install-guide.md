# Boundless OS Installation Guide for Claude Code

**This guide is for Claude Code to follow when helping users install Boundless OS.**

---

## When to Use This Guide

Use this guide when a user:
- Shares the Boundless OS GitHub URL and asks to install it
- Says something like "install this" or "set this up"
- Asks how to get started with Boundless OS

---

## Installation Approach

**Be conversational, friendly, and guide them step-by-step.** This is especially important for non-technical founders.

---

## Step 1: Greet and Explain

Start with:

```
Hi! I'll help you install Boundless OS - a system that transforms me from a helpful assistant into a structured development partner.

Boundless OS will give me:
- Your product vision and standards
- Structured workflows to follow
- The context I need to build production-ready code

This will take about 2-3 minutes. Ready to get started?
```

Wait for confirmation.

---

## Step 2: Check Prerequisites

Ask:

```
First, let me check a few things:

1. Do you have Git installed? (Type: git --version)
2. Are we in the directory where you want to work on your project?
   (Current directory: [show pwd output])
```

If they need to:
- Install Git: Guide them to https://git-scm.com/downloads
- Change directory: Help them navigate with `cd` commands
- Create new project folder: Offer to create one

---

## Step 3: Clone Boundless OS Base Installation

Explain what you're doing:

```
Perfect! Now I'll install the Boundless OS base files to ~/boundless-os.
This is a one-time setup that all your projects will share.
```

Then run:

```bash
git clone https://github.com/buildermethods/boundless-os ~/boundless-os
```

Confirm success:

```
✓ Boundless OS base installed!

Now let's set it up for your specific project. I'll ask you a few questions
to configure it perfectly for your needs.
```

---

## Step 4: Interactive Setup (Replace Wizard)

**Instead of running the shell wizard, YOU ask the questions conversationally:**

### Question 1: Technical Level

```
Let's customize Boundless OS for you!

First, what's your technical background?

1. Non-technical founder (I have product ideas but don't code)
2. Some coding experience (I've done tutorials, can read basic code)
3. Experienced developer (I code regularly)

Just reply with 1, 2, or 3.
```

Based on answer:
- 1 → Use "ryan" profile
- 2 or 3 → Use "default" profile

Store this for later.

---

### Question 2: Project Type

```
Great! What type of product are you building?

1. SaaS application (web app people pay for)
2. E-commerce / Marketplace
3. Internal business tool
4. Mobile app
5. Something else

Reply with the number.
```

Store the answer (just for context, helps with later suggestions).

---

### Question 3: Project State

```
Do you have code already, or are we starting fresh?

1. Just have an idea (no code yet)
2. Existing project (already have code)
3. Need to create a new project folder

Which one?
```

If they choose 3, ask:
```
What should we name your project folder?
```

Then create it:
```bash
mkdir ~/[project-name]
cd ~/[project-name]
```

---

### Question 4: Tech Stack Preference

```
One more thing - what kind of app are you building?

1. Simple MVP (want to launch fast, expecting <10k users)
   → I'll set you up with: Vercel + Supabase + Next.js

2. High-performance app (expecting many users, need global scale)
   → I'll set you up with: Cloudflare Workers + Neon + Hono

3. I'm not sure yet / Let's decide later

Which sounds right?
```

Store the answer for tech stack recommendations.

---

## Step 5: Run Installation

Explain what you're doing:

```
Perfect! Now I'll install Boundless OS into your project with the settings we chose.

Installing...
```

Run the installation command:

```bash
~/boundless-os/scripts/project-install.sh --profile [ryan or default] --claude-code-commands true --use-claude-code-subagents true
```

---

## Step 6: Verify Installation

After installation completes, run a health check:

```bash
~/boundless-os/scripts/health-check.sh
```

---

## Step 7: Explain What Was Installed

```
✓ Installation complete! Here's what I just set up:

📁 Files installed:
- .claude/commands/boundless-os/ - Special commands I can now use
- boundless-os/standards/ - Your coding standards and design principles
- boundless-os/config.yml - Configuration

🎨 Profile: [ryan or default]
[If ryan]: This profile is optimized for non-technical founders with:
- Plain language communication (no jargon!)
- Professional UI design (Stripe/Notion quality)
- Visual testing (you can see it work)
- Security by default

💡 Your tech stack suggestion: [based on their choice]
[Show simple or high-performance stack details]
```

---

## Step 8: MCP Tools Check (IMPORTANT!)

```
⚠️ Important: Boundless OS requires two MCP tools to work properly:

1. Context7 MCP - Lets me search documentation for latest best practices
2. Playwright MCP - Lets me test your app visually (clicking, typing, seeing)

Let me check if you have these installed...
```

Check if they're available (you can try to use them).

If missing:
```
I notice you don't have [Context7/Playwright] MCP installed yet.

These are REQUIRED for Boundless OS to work properly. Without them:
- I'll use outdated patterns (no Context7)
- I can't do visual testing (no Playwright)

I can guide you through installing them now. It takes about 5 minutes.

Should I show you how to install the required MCP tools?
```

If they say yes, provide instructions from ~/boundless-os/SETUP-MCP.md.

---

## Step 9: First Steps

```
🚀 You're all set! Here's what to do next:

STEP 1: Plan your product (15-30 minutes)

Type this command:
/plan-product

I'll ask you questions about:
- What problem you're solving
- Who your target customer is
- Your 6-month vision
- Tech stack details

Then I'll create:
- boundless-os/product/mission.md (your product's purpose)
- boundless-os/product/roadmap.md (development phases)
- boundless-os/product/tech-stack.md (technologies and why)

STEP 2: Build your first feature

After planning, you can start building features with:
/shape-spec [feature-name]

For example:
/shape-spec user-authentication

Would you like to start planning your product now?
Just type: /plan-product
```

---

## Step 10: Offer Resources

```
📚 Resources you can reference anytime:

All docs are available locally (no internet needed):

- ~/boundless-os/QUICKSTART.md - Complete beginner's guide
- ~/boundless-os/WORKFLOW.md - Understanding the 6 phases
- ~/boundless-os/FAQ.md - Common questions answered
- ~/boundless-os/TROUBLESHOOTING.md - Solutions to issues
- ~/boundless-os/SETUP-MCP.md - MCP tools setup

Need help? Just ask me!

Ready to start building? Type: /plan-product
```

---

## Important Guidelines for Claude

When helping users install Boundless OS:

1. **Be patient and encouraging** - Many users are non-technical
2. **Explain what each command does** before running it
3. **Show the output** of commands so they can see progress
4. **Use plain language** - No jargon without explanation
5. **Confirm each step** before moving to the next
6. **Celebrate success** - This is exciting for them!
7. **Emphasize MCP tools** - They're REQUIRED, not optional

---

## If Installation Fails

If something goes wrong:

1. **Don't panic the user** - Stay calm and helpful
2. **Run the health check**: `~/boundless-os/scripts/health-check.sh`
3. **Show them the output** and explain what's wrong
4. **Offer solutions** from ~/boundless-os/TROUBLESHOOTING.md
5. **If stuck**, direct them to: https://github.com/buildermethods/boundless-os/issues

---

## After Installation is Complete

The user is now ready to:

1. Run `/plan-product` to define their product vision
2. Run `/shape-spec [feature]` to plan features
3. Build features through the 6-phase workflow
4. Get production-ready code that matches their standards

Your job is to guide them through this structured process, making it feel natural and conversational.

---

## Summary of Commands You'll Use

```bash
# Prerequisites check
git --version
pwd

# Installation
git clone https://github.com/buildermethods/boundless-os ~/boundless-os
cd [project-directory]
~/boundless-os/scripts/project-install.sh --profile [ryan|default] --claude-code-commands true --use-claude-code-subagents true

# Verification
~/boundless-os/scripts/health-check.sh

# First steps (after installation)
/plan-product
/shape-spec [feature-name]
```

---

**Remember**: This is about making AI-assisted development accessible to everyone, especially non-technical founders. Be the helpful, knowledgeable guide they need!
