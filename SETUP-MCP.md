# MCP Tools Setup Guide

## Overview

Boundless OS requires specific MCP (Model Context Protocol) tools to function properly. These are not optional—they're essential for the workflow.

---

## Required MCP Tools

### 1. Context7 MCP ⚠️ **REQUIRED**

**What it does**: Enables AI to search and reference the latest documentation for any framework, library, or service you're using.

**Why it's required**:
- Ensures code uses current best practices (not outdated patterns from AI training data)
- Cites sources for implementation decisions
- Prevents bugs from deprecated APIs or methods
- Required for all Boundless OS workflows

**Setup**:

1. Open Claude Code settings
2. Navigate to MCP Servers section
3. Add Context7 MCP server:
   ```json
   {
     "mcpServers": {
       "context7": {
         "command": "npx",
         "args": ["-y", "@context7/mcp-server"]
       }
     }
   }
   ```
4. Restart Claude Code
5. Test: Ask Claude "Search the docs for Next.js App Router"

**Verification**:
```bash
# In Claude Code, run:
Can you search Context7 for Next.js routing documentation?

# Should return: relevant docs with citations
```

**Troubleshooting**:
- If not working: Check you have Node.js installed (`node --version`)
- Try manual install: `npm install -g @context7/mcp-server`
- Check Claude Code settings JSON for typos

---

### 2. Playwright MCP ⚠️ **REQUIRED**

**What it does**: Enables AI to control a real browser for testing—clicking buttons, filling forms, taking screenshots, verifying UI.

**Why it's required**:
- Visual testing shows you the app actually works (not just code that "should" work)
- Catches UI bugs that unit tests miss
- Tests real user flows end-to-end
- Required by ryan profile for all implementations

**Setup**:

1. Install Playwright in your project:
   ```bash
   npm install -D playwright
   npx playwright install
   ```

2. Add Playwright MCP to Claude Code settings:
   ```json
   {
     "mcpServers": {
       "playwright": {
         "command": "npx",
         "args": ["-y", "@playwright/mcp-server"]
       }
     }
   }
   ```

3. Restart Claude Code

4. Test:
   ```bash
   # In your project
   npx playwright test
   ```

**Verification**:
Ask Claude: "Can you write a Playwright test for the homepage?"
Should generate actual test code and be able to run it.

**Troubleshooting**:
- If browsers not installing: `npx playwright install --with-deps`
- On macOS: May need to approve browser installations in Security settings
- On Linux: May need additional dependencies (`npx playwright install-deps`)

---

## Optional (But Recommended) MCP Tools

### 3. Figma Make MCP

**What it does**: Generates designs, converts Figma designs to code.

**When to use**: If you have Figma designs you want to implement.

**Setup**:
```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@figma/mcp-server"],
      "env": {
        "FIGMA_TOKEN": "your-figma-token"
      }
    }
  }
}
```

Get Figma token: [https://www.figma.com/developers/api#access-tokens](https://www.figma.com/developers/api#access-tokens)

---

## Verifying Installation

Run this health check to verify MCP tools are set up correctly:

```bash
cd /path/to/your/project
~/boundless-os/scripts/health-check.sh
```

Look for:
```
✓ Context7 MCP: configured
✓ Playwright MCP: configured
```

---

## What Happens If Tools Are Missing?

### Without Context7:
- AI uses outdated patterns from training data
- Bugs from deprecated APIs
- No source citations for implementations
- **Boundless OS workflows will fail or produce lower-quality code**

### Without Playwright:
- No visual testing (only unit tests)
- UI bugs go undetected until manual testing
- Can't verify actual user experience
- **ryan profile standards cannot be enforced properly**

---

## MCP Tools in the Workflow

### Phase 2: Shape Spec
Context7 searches docs for best practices for the feature you're planning.

### Phase 3: Write Spec
Context7 verifies API methods exist and aren't deprecated.

### Phase 5: Implement
- Context7 checks docs while writing code
- Playwright creates tests to verify implementation

### Phase 6: Verify
Playwright runs tests automatically to confirm everything works.

---

## Cost

**Context7**: Free for reasonable usage
**Playwright**: Free (open source, runs locally)
**Figma Make**: Free tier available

---

## Common Issues

### Issue: "MCP server not responding"

**Solutions**:
1. Restart Claude Code
2. Check Node.js is installed: `node --version`
3. Manually install: `npm install -g @context7/mcp-server @playwright/mcp-server`
4. Check Claude settings JSON for syntax errors

---

### Issue: "Context7 searches return no results"

**Solutions**:
1. Check internet connection
2. Try a different query: "Search docs for [specific topic]"
3. Verify API token (if Context7 requires one in future)

---

### Issue: "Playwright tests fail to run"

**Solutions**:
1. Install browsers: `npx playwright install --with-deps`
2. Check project has Playwright installed: `ls node_modules/.bin/playwright`
3. Run a basic test: `npx playwright test --headed` (shows browser)

---

## Adding MCP Tools Mid-Project

If you started a project without MCP tools:

1. Install the tools following instructions above
2. Restart Claude Code
3. Run health check: `~/boundless-os/scripts/health-check.sh`
4. No need to reinstall Boundless OS—MCP tools work immediately

---

## Updating MCP Tools

MCP tools update automatically when you use `npx -y`:

```bash
# Context7 auto-updates
npx -y @context7/mcp-server

# Playwright update
npm update -D playwright
npx playwright install
```

---

## Questions?

- **Context7 docs**: [https://context7.com/docs](https://context7.com/docs)
- **Playwright docs**: [https://playwright.dev](https://playwright.dev)
- **MCP Protocol**: [https://modelcontextprotocol.io](https://modelcontextprotocol.io)
- **Boundless OS issues**: [https://github.com/buildermethods/boundless-os/issues](https://github.com/buildermethods/boundless-os/issues)

---

**These tools are essential to Boundless OS. Install them before starting any project!** ⚠️
