# Ryan's Boundless OS Profile

This custom profile contains standards and guidelines optimized for a non-technical founder building SaaS products with AI assistance.

---

## What's in This Profile?

### Design Standards (`standards/frontend/`)

**design-principles.md**
- Comprehensive S-tier design guide
- Inspired by Stripe, Notion, Apple
- Covers typography, color, spacing, components
- Implementation details for Tailwind CSS

**design-review-checklist.md**
- Quality checklist for UI reviews
- Design system foundations
- Module-specific patterns (tables, moderation, config panels)
- Accessibility requirements

**style-guide.md**
- Quick reference for common UI elements
- Simplified version of design principles
- Font sizes, colors, spacing scales
- Component patterns and best practices

### Global Standards (`standards/global/`)

**communication.md**
- How to explain technical concepts simply
- Plain language guidelines
- No jargon policy
- Example templates for common situations

**tech-stack.md**
- Default technologies (Vercel, Supabase, Claude Code)
- When to use each tool
- Cost considerations
- Performance targets

**code-review.md**
- Automatic quality checks after coding
- Security, performance, maintainability
- What gets fixed automatically vs. flagged
- Review checklists

### Testing Standards (`standards/testing/`)

**playwright-testing.md**
- Visual, on-screen testing approach
- When to write tests
- Test structure and organization
- Debugging tips for non-technical users

---

## Key Principles

### 1. **Non-Technical Friendly**
Everything explained in plain language. No jargon without explanation.

### 2. **Design Quality**
S-tier UI standards enforced by default. Every interface should look professional.

### 3. **Automatic Quality**
Code reviews and tests happen automatically. Only critical issues require founder input.

### 4. **Visual Testing**
Playwright tests that you can see running. Screenshots for all UI work.

### 5. **Founder-First Communication**
Technical details hidden. Focus on what matters: does it work, is it secure, does it look good?

---

## How This Profile Works

When Boundless OS is installed in a project with this profile:

1. **Standards are inherited** from the default profile
2. **Your custom standards are added** on top
3. **AI agents read these standards** before working
4. **Code follows your preferences** automatically

---

## What Gets Applied Automatically

### Design Work
- ✅ Tailwind CSS for styling
- ✅ 8px spacing grid
- ✅ Accessible color contrasts
- ✅ Responsive mobile-first design
- ✅ Component states (hover, focus, loading)

### Code Quality
- ✅ Security checks (no exposed keys, validated inputs)
- ✅ Error handling
- ✅ Loading states
- ✅ TypeScript for type safety
- ✅ Proper code organization

### Testing
- ✅ Playwright for visual testing
- ✅ Screenshots at multiple viewport sizes
- ✅ User flow testing (login, forms, etc.)
- ✅ Accessibility checks

### Communication
- ✅ Plain language explanations
- ✅ Simple progress updates
- ✅ Clear error messages
- ✅ Visual evidence (screenshots)

---

## Tech Stack Defaults

When starting new projects with this profile:

**Hosting:** Vercel
**Database:** Supabase
**Auth:** Clerk
**Frontend:** Next.js (or as project requires)
**Styling:** Tailwind CSS
**Testing:** Playwright
**AI Assistant:** Claude Code

---

## Customizing This Profile

To modify standards:

1. Edit files in `~/boundless-os/profiles/ryan/standards/`
2. Changes apply to all future projects
3. Existing projects need to re-run `project-install.sh` to update

### Adding New Standards

Create new `.md` files in appropriate folders:
- `standards/frontend/` - UI/UX guidelines
- `standards/backend/` - Server-side patterns
- `standards/global/` - Universal rules
- `standards/testing/` - Testing approaches

---

## Using This Profile in Projects

### Install in New Project

```bash
cd /path/to/your/project
~/boundless-os/scripts/project-install.sh
```

The installer will use the `ryan` profile by default (configured in `config.yml`).

### Install in Existing Project

Same command works for existing projects. Boundless OS will:
- Add standards to your project
- Set up commands for Claude Code
- Configure workflows
- Not overwrite existing code

### Use Different Profile for Specific Project

```bash
~/boundless-os/scripts/project-install.sh --profile default
```

---

## What Happens in Projects

After installation, your project gets:

### `.claude/` folder (Claude Code users)
- `/commands/boundless-os/` - Slash commands
- `/agents/boundless-os/` - Specialized subagents (if enabled)

### `boundless-os/` folder
- `/standards/` - Copy of your standards
- `/workflows/` - Development workflows

### How Claude Code Uses This
When working on your project, Claude Code:
1. Reads your standards before coding
2. Follows design principles for UI work
3. Runs code reviews automatically
4. Uses Playwright for testing
5. Communicates in plain language

---

## Profile Structure

```
ryan/
├── README.md (this file)
├── standards/
│   ├── frontend/
│   │   ├── design-principles.md (S-tier UI guide)
│   │   ├── design-review-checklist.md (Quality checklist)
│   │   └── style-guide.md (Quick reference)
│   ├── global/
│   │   ├── communication.md (Plain language rules)
│   │   ├── tech-stack.md (Default tools)
│   │   └── code-review.md (Quality standards)
│   └── testing/
│       └── playwright-testing.md (Visual testing)
├── agents/ (inherited from default)
├── commands/ (inherited from default)
└── workflows/ (inherited from default)
```

---

## Maintenance

### Updating Standards
Edit files directly in `~/boundless-os/profiles/ryan/standards/`

### Keeping Up to Date
When Boundless OS releases updates:
```bash
cd ~/boundless-os
git pull origin main
```

Your custom profile stays separate and won't be overwritten.

### Backing Up
Your profile is just markdown files. Back up the entire folder:
```bash
cp -r ~/boundless-os/profiles/ryan ~/boundless-os-backup/
```

---

## Troubleshooting

### Standards Not Being Applied
1. Check `~/boundless-os/config.yml` shows `profile: ryan`
2. Re-run project installation: `~/boundless-os/scripts/project-install.sh`
3. Verify files exist in project's `boundless-os/standards/` folder

### Claude Code Not Following Standards
1. Check standards are in `.claude/` folder (if using Claude Code)
2. Try starting a new conversation
3. Explicitly reference standards: "Follow the design-principles.md standards"

### Need Help
- Check Boundless OS docs: https://buildermethods.com/boundless-os
- Review installation guide for project setup
- Verify config.yml settings

---

## Summary

This profile transforms Claude Code into a design-aware, security-conscious development partner that communicates in plain English and automatically maintains quality standards.

**Key Benefits:**
- Professional UI design by default
- Security checks automatic
- Testing visual and understandable
- Communication founder-friendly
- Quality consistent across projects

**Perfect for:**
- Non-technical founders
- SaaS product development
- Projects requiring high design standards
- Teams shipping fast with AI assistance
