# Boundless OS Troubleshooting Guide

Common issues and their solutions.

---

## Installation Issues

### Problem: "Permission denied" when running install script

**Symptoms**:
```bash
bash: ./project-install.sh: Permission denied
```

**Solution**:
Make the script executable:
```bash
chmod +x ~/boundless-os/scripts/project-install.sh
chmod +x ~/boundless-os/scripts/wizard-install.sh
```

Then run again.

---

### Problem: "Boundless OS not found" error

**Symptoms**:
```bash
~/boundless-os/scripts/project-install.sh: No such file or directory
```

**Solution**:
You haven't installed the base Boundless OS yet:
```bash
git clone https://github.com/buildermethods/boundless-os ~/boundless-os
cd ~/boundless-os
```

Then try the project installation again.

---

### Problem: Installing into ~/boundless-os itself

**Symptoms**:
Error message: "Cannot install Boundless OS into its own base directory"

**Solution**:
You're trying to install the project-level Boundless OS into the base installation directory. Don't do this!

```bash
# Wrong:
cd ~/boundless-os
~/boundless-os/scripts/project-install.sh

# Right:
cd /path/to/your/actual/project
~/boundless-os/scripts/project-install.sh
```

---

### Problem: Installation hangs or takes forever

**Symptoms**:
Install script runs but never completes.

**Solutions**:

1. **Check your internet connection** (scripts download files from profiles)

2. **Try with --dry-run to see what would happen**:
   ```bash
   ~/boundless-os/scripts/project-install.sh --dry-run
   ```

3. **Check disk space**:
   ```bash
   df -h .
   ```
   Need at least 50MB free.

4. **Kill and restart**:
   ```bash
   # Press Ctrl+C to cancel
   # Try again
   ~/boundless-os/scripts/project-install.sh
   ```

---

## Claude Code Integration Issues

### Problem: Commands not showing up in Claude Code

**Symptoms**:
You type `/plan-product` but Claude doesn't recognize it.

**Solutions**:

1. **Restart Claude Code**:
   ```bash
   # Exit Claude Code (Ctrl+C or Cmd+Q)
   # Wait 5 seconds
   # Reopen
   claude-code
   ```

2. **Check commands were installed**:
   ```bash
   ls .claude/commands/boundless-os/
   # Should see: plan-product.md, shape-spec.md, etc.
   ```

3. **Check you're in the project directory**:
   ```bash
   pwd
   # Should be your project, NOT ~/boundless-os
   ```

4. **Reinstall commands**:
   ```bash
   ~/boundless-os/scripts/project-install.sh --claude-code-commands true
   ```

5. **Check Claude Code version**:
   Make sure you're using a recent version of Claude Code that supports slash commands.

---

### Problem: Commands exist but don't work correctly

**Symptoms**:
Commands show up, but when you run them, nothing happens or they error.

**Solutions**:

1. **Check Boundless OS version compatibility**:
   ```bash
   cat ~/boundless-os/config.yml | grep version
   cat boundless-os/config.yml | grep version
   # Should match
   ```

2. **Update both base and project**:
   ```bash
   cd ~/boundless-os
   git pull origin main

   cd /path/to/your/project
   ~/boundless-os/scripts/project-update.sh
   ```

3. **Check for profile mismatch**:
   ```bash
   cat boundless-os/config.yml
   # Note the profile

   ls ~/boundless-os/profiles/[profile-name]
   # Should exist
   ```

---

### Problem: Subagents not working (multi-agent mode)

**Symptoms**:
Commands say they're delegating to agents, but nothing happens.

**Solutions**:

1. **Check agents are installed**:
   ```bash
   ls .claude/agents/boundless-os/
   # Should see: product-planner.md, spec-writer.md, etc.
   ```

2. **Check Claude Code supports subagents**:
   Multi-agent mode requires Claude Code version that supports the Task tool.

3. **Fall back to single-agent mode**:
   ```bash
   ~/boundless-os/scripts/project-install.sh --use-claude-code-subagents false --re-install
   ```

---

## Standards & Quality Issues

### Problem: AI not following my standards

**Symptoms**:
Generated code doesn't match your design principles or coding style.

**Solutions**:

1. **Check standards are installed**:
   ```bash
   ls boundless-os/standards/
   # Should see multiple .md files
   ```

2. **Read your standards to ensure they're clear**:
   ```bash
   cat boundless-os/standards/design-principles.md
   ```
   Vague standards → vague results.
   Specific standards → specific results.

3. **Make standards more specific**:
   ```markdown
   # Bad (vague)
   - Use good design

   # Good (specific)
   - Buttons: 12px rounded corners, 600 font weight
   - Colors: Primary #4F46E5, hover #4338CA
   - Spacing: Use 4px grid (p-2, p-4, p-6, etc.)
   ```

4. **Explicitly reference standards in your command**:
   ```
   /implement-tasks my-feature

   Follow design-principles.md exactly, especially the button styles section.
   ```

5. **Reinstall standards**:
   ```bash
   ~/boundless-os/scripts/project-install.sh --overwrite-standards
   ```

---

### Problem: Generated code has bugs

**Symptoms**:
Tests fail, or code doesn't work as expected.

**Solutions**:

1. **Check the spec**:
   ```bash
   cat boundless-os/specs/[feature]/spec.md
   ```
   Is the spec clear? Does it describe the correct behavior?

2. **Fix the spec and re-implement**:
   ```bash
   code boundless-os/specs/[feature]/spec.md
   # Make corrections

   /implement-tasks [feature]
   # AI will use the updated spec
   ```

3. **Check your standards for correctness**:
   If multiple features have similar bugs, your standards might have incorrect patterns.

4. **Provide more context**:
   ```
   /implement-tasks my-feature

   The previous attempt had this issue: [describe bug]
   Please fix by: [describe solution]
   ```

---

## Workflow Issues

### Problem: "No product mission found" error

**Symptoms**:
When running `/shape-spec`, you get an error about missing mission.

**Solution**:
You skipped Phase 1. Run:
```
/plan-product
```

This creates your product mission, which other commands reference.

---

### Problem: "No requirements found" when running /write-spec

**Symptoms**:
Error says requirements.md doesn't exist.

**Solution**:
You skipped Phase 2. Run:
```
/shape-spec [feature-name]
```

This creates the requirements that /write-spec needs.

---

### Problem: "No spec found" when running /create-tasks

**Symptoms**:
Error says spec.md doesn't exist.

**Solution**:
You skipped Phase 3. Run:
```
/write-spec [feature-name]
```

This creates the spec that /create-tasks needs.

---

### Problem: Getting lost in the workflow

**Symptoms**:
Not sure what command to run next.

**Solutions**:

1. **Run health check**:
   ```bash
   ~/boundless-os/scripts/health-check.sh
   ```
   This shows your current state and suggests next steps.

2. **Check the workflow diagram**:
   See `WORKFLOW.md` for the visual flow.

3. **Remember the sequence**:
   ```
   /plan-product (once)
   ↓
   /shape-spec [feature]
   ↓
   /write-spec [feature]
   ↓
   /create-tasks [feature]
   ↓
   /implement-tasks [feature]
   ↓
   Feature done! Repeat from shape-spec for next feature.
   ```

---

## File & Directory Issues

### Problem: "boundless-os/ directory not found"

**Symptoms**:
Commands error saying boundless-os/ doesn't exist.

**Solution**:
Boundless OS isn't installed in this project:
```bash
pwd  # Make sure you're in your project directory
~/boundless-os/scripts/project-install.sh
```

---

### Problem: "Cannot write to boundless-os/ directory"

**Symptoms**:
Permission errors when trying to create files.

**Solutions**:

1. **Check directory permissions**:
   ```bash
   ls -la boundless-os/
   ```

2. **Fix permissions**:
   ```bash
   chmod -R u+w boundless-os/
   ```

3. **Check disk space**:
   ```bash
   df -h .
   ```

---

### Problem: Files appearing in wrong locations

**Symptoms**:
Specs or standards end up in unexpected directories.

**Solution**:
Make sure you're running commands from your project root:
```bash
cd /path/to/your/project  # Go to project root
pwd  # Verify you're in the right place
/plan-product  # Now run commands
```

---

## MCP Tools Issues

### Problem: "Context7 MCP not available"

**Symptoms**:
Commands that need documentation lookup fail.

**Solutions**:

1. **Install Context7 MCP** in Claude settings:
   - Open Claude Code settings
   - Go to MCP servers section
   - Add Context7 MCP server
   - Restart Claude Code

2. **Check it's working**:
   Ask Claude: "Can you search the docs for Next.js routing?"
   If Context7 is working, it will search documentation.

3. **See setup guide**:
   ```bash
   cat boundless-os/SETUP-MCP.md
   ```

---

### Problem: "Playwright MCP not available"

**Symptoms**:
Visual testing commands fail.

**Solutions**:

1. **Install Playwright MCP** in Claude settings

2. **Install Playwright CLI**:
   ```bash
   npm install -D playwright
   npx playwright install
   ```

3. **Check it's configured**:
   ```bash
   cat boundless-os/SETUP-MCP.md
   ```

---

## Version & Update Issues

### Problem: "Version mismatch" warning

**Symptoms**:
Health check shows base and project versions don't match.

**Solution**:
Update your project to match the base:
```bash
cd /path/to/your/project
~/boundless-os/scripts/project-update.sh
```

---

### Problem: Update script fails

**Symptoms**:
project-update.sh errors or doesn't complete.

**Solutions**:

1. **Try with --overwrite-all**:
   ```bash
   ~/boundless-os/scripts/project-update.sh --overwrite-all
   ```
   Warning: This will overwrite your custom standards.

2. **Backup and reinstall**:
   ```bash
   # Backup custom standards
   cp -r boundless-os/standards boundless-os/standards.backup

   # Backup product docs
   cp -r boundless-os/product boundless-os/product.backup

   # Reinstall
   ~/boundless-os/scripts/project-install.sh --re-install

   # Restore custom standards
   cp boundless-os/standards.backup/* boundless-os/standards/
   ```

---

## Profile Issues

### Problem: "Profile not found" error

**Symptoms**:
Error says specified profile doesn't exist.

**Solutions**:

1. **Check available profiles**:
   ```bash
   ls ~/boundless-os/profiles/
   # Should see: default, ryan
   ```

2. **Use a valid profile**:
   ```bash
   ~/boundless-os/scripts/project-install.sh --profile ryan
   # or
   ~/boundless-os/scripts/project-install.sh --profile default
   ```

3. **If you created a custom profile**, make sure it exists:
   ```bash
   ls ~/boundless-os/profiles/[your-profile-name]
   ```

---

### Problem: Switching profiles doesn't work

**Symptoms**:
You change profiles but nothing seems different.

**Solution**:
Profile changes require re-installation:
```bash
~/boundless-os/scripts/project-install.sh --profile [new-profile] --re-install
```

**Warning**: This will overwrite your current standards with the new profile's standards. Back up first if you have customizations!

---

## Performance Issues

### Problem: Commands are very slow

**Symptoms**:
Commands take minutes to respond.

**Possible causes**:

1. **Slow internet** - AI models require internet connection
2. **Large codebase** - More code = more context to process
3. **Complex standards** - Very long standards files take longer to process

**Solutions**:

1. **Check internet speed**:
   Run a speed test. Boundless OS works best with 5+ Mbps.

2. **Simplify standards temporarily**:
   Keep only the most important standards files.

3. **Use single-agent mode** (faster for simple tasks):
   ```bash
   ~/boundless-os/scripts/project-install.sh --use-claude-code-subagents false --re-install
   ```

4. **Break features into smaller pieces**:
   Instead of one huge feature, split into multiple smaller features.

---

## Output Quality Issues

### Problem: Generated code is too simple/basic

**Symptoms**:
Code works but lacks polish, edge case handling, or professional quality.

**Solutions**:

1. **Use the ryan profile** (enforces S-tier quality):
   ```bash
   ~/boundless-os/scripts/project-install.sh --profile ryan --re-install
   ```

2. **Make your spec more detailed**:
   Add explicit acceptance criteria for edge cases:
   ```markdown
   ## Edge Cases to Handle
   - Network timeout (show retry button)
   - Empty state (show helpful message)
   - Loading states (show skeleton UI)
   - Errors (user-friendly messages)
   ```

3. **Add quality standards**:
   Create `boundless-os/standards/quality-checklist.md` with your requirements.

---

### Problem: UI doesn't match design expectations

**Symptoms**:
UI is functional but not visually polished.

**Solutions**:

1. **Use ryan profile** (S-tier design by default):
   ```bash
   ~/boundless-os/scripts/project-install.sh --profile ryan --re-install
   ```

2. **Enhance design-principles.md**:
   ```bash
   code boundless-os/standards/design-principles.md
   ```
   Add specific: colors, fonts, spacing, shadows, animations.

3. **Reference design systems**:
   In your standards, say: "Match Stripe's button styles" or "Use shadcn/ui components"

4. **Provide screenshots** (if possible):
   Show the AI what you want it to look like.

---

## Git & Version Control Issues

### Problem: Merge conflicts in boundless-os/

**Symptoms**:
Git merge conflicts in boundless-os/specs/ or boundless-os/standards/.

**Solutions**:

1. **For product docs** (mission, roadmap):
   - Keep the most recent version
   - Manually merge important changes

2. **For specs**:
   - Usually keep both (they're different features)
   - Or keep the more complete version

3. **For standards**:
   - Carefully merge changes
   - Test after merging (regenerate a feature to see if it works)

4. **For config.yml**:
   - Keep your local config (has your profile, settings)

---

### Problem: .claude/ directory in gitignore

**Symptoms**:
Team members don't have your commands.

**Solution**:
`.claude/commands/boundless-os/` should be committed (unless you customized commands heavily).

Check your `.gitignore`:
```bash
# Remove this line if present:
.claude/

# Or be more specific:
.claude/*
!.claude/commands/boundless-os/
```

Then commit:
```bash
git add .claude/commands/boundless-os/
git commit -m "Add Boundless OS commands"
```

---

## Getting More Help

### Run Health Check

Before asking for help, run:
```bash
~/boundless-os/scripts/health-check.sh
```

This identifies many common issues automatically.

---

### Check Documentation

- `QUICKSTART.md` - Getting started guide
- `WORKFLOW.md` - Understanding the process
- `FAQ.md` - Frequently asked questions
- This file! - Common problems

---

### Search GitHub Issues

Someone else may have had the same problem:
[github.com/buildermethods/boundless-os/issues](https://github.com/buildermethods/boundless-os/issues)

Use search: "error: [your error message]"

---

### Open a New Issue

If you can't find a solution:

1. Go to [github.com/buildermethods/boundless-os/issues/new](https://github.com/buildermethods/boundless-os/issues/new)

2. Include:
   - **Operating System**: (macOS, Linux, Windows)
   - **Boundless OS Version**: (from `cat ~/boundless-os/config.yml`)
   - **AI Tool**: (Claude Code, Cursor, etc.)
   - **What you tried**: (exact commands you ran)
   - **What happened**: (error messages, unexpected behavior)
   - **What you expected**: (what should have happened)

3. Paste output from health check:
   ```bash
   ~/boundless-os/scripts/health-check.sh > health-check-output.txt
   ```
   Attach the file.

---

### Community Support

- **GitHub Discussions**: Ask questions, share tips
- **Official Website**: [buildermethods.com/boundless-os](https://buildermethods.com/boundless-os)

---

## Emergency: Complete Reset

If nothing works and you want to start fresh:

```bash
# 1. Backup important files
cp -r boundless-os/product ~/boundless-os-backup-product
cp -r boundless-os/specs ~/boundless-os-backup-specs
cp -r boundless-os/standards ~/boundless-os-backup-standards-custom

# 2. Remove Boundless OS from project
rm -rf boundless-os/
rm -rf .claude/commands/boundless-os/
rm -rf .claude/agents/boundless-os/

# 3. Update base Boundless OS
cd ~/boundless-os
git pull origin main

# 4. Reinstall in project
cd /path/to/your/project
~/boundless-os/scripts/project-install.sh

# 5. Restore backups
cp -r ~/boundless-os-backup-product/* boundless-os/product/
cp -r ~/boundless-os-backup-specs/* boundless-os/specs/
# (Merge custom standards manually if needed)

# 6. Test
~/boundless-os/scripts/health-check.sh
```

---

**Still stuck? We're here to help.** Open an issue on GitHub and we'll get you sorted!
