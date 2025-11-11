#!/bin/bash

# Boundless OS Health Check Script
# Validates Boundless OS installation and configuration

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BASE_DIR="$(dirname "$SCRIPT_DIR")"

# Source common functions
source "$SCRIPT_DIR/common-functions.sh"

# Check counters
CHECKS_PASSED=0
CHECKS_FAILED=0
WARNINGS=0

# Results arrays
declare -a PASSED_CHECKS
declare -a FAILED_CHECKS
declare -a WARNING_MESSAGES

# Function to report a passing check
pass_check() {
    local message="$1"
    PASSED_CHECKS+=("$message")
    ((CHECKS_PASSED++))
    echo -e "${GREEN}✓${NC} $message"
}

# Function to report a failing check
fail_check() {
    local message="$1"
    FAILED_CHECKS+=("$message")
    ((CHECKS_FAILED++))
    echo -e "${RED}✗${NC} $message"
}

# Function to report a warning
warn_check() {
    local message="$1"
    WARNING_MESSAGES+=("$message")
    ((WARNINGS++))
    echo -e "${YELLOW}⚠${NC} $message"
}

# Clear screen and show header
clear
echo -e "${BOLD}${BLUE}"
echo "═══════════════════════════════════════════════════════════════════"
echo "                  Boundless OS Health Check                            "
echo "═══════════════════════════════════════════════════════════════════"
echo -e "${NC}"
echo ""

# ============================================================================
# CHECK 1: Base Installation
# ============================================================================

echo -e "${BOLD}${CYAN}Checking Base Installation...${NC}"
echo ""

if [ -d "$BASE_DIR" ] && [ -f "$BASE_DIR/config.yml" ]; then
    pass_check "Base installation found at: $BASE_DIR"
else
    fail_check "Base installation not found at: $BASE_DIR"
    echo ""
    echo -e "${RED}Boundless OS base installation is missing or incomplete.${NC}"
    echo -e "${YELLOW}Please install Boundless OS first:${NC}"
    echo -e "  git clone https://github.com/buildermethods/boundless-os ~/boundless-os"
    echo ""
    exit 1
fi

# Check base config file
if [ -f "$BASE_DIR/config.yml" ]; then
    pass_check "Base config.yml exists"

    # Extract version
    BASE_VERSION=$(grep "^version:" "$BASE_DIR/config.yml" | cut -d' ' -f2 | tr -d '"' | tr -d "'")
    if [ -n "$BASE_VERSION" ]; then
        pass_check "Base version: $BASE_VERSION"
    else
        warn_check "Could not determine base version"
    fi
else
    fail_check "Base config.yml missing"
fi

# Check required scripts
if [ -f "$BASE_DIR/scripts/project-install.sh" ]; then
    pass_check "Installation scripts present"
else
    fail_check "Installation scripts missing"
fi

# Check profiles
if [ -d "$BASE_DIR/profiles/default" ] && [ -d "$BASE_DIR/profiles/ryan" ]; then
    pass_check "Profiles installed (default, ryan)"
else
    warn_check "Some profiles may be missing"
fi

echo ""

# ============================================================================
# CHECK 2: Project Installation
# ============================================================================

echo -e "${BOLD}${CYAN}Checking Project Installation...${NC}"
echo ""

PROJECT_DIR="$(pwd)"

# Check if we're in the base installation directory
if [ "$PROJECT_DIR" == "$BASE_DIR" ]; then
    warn_check "You're in the base Boundless OS directory"
    echo ""
    echo -e "${YELLOW}This health check should be run from your project directory, not ~/boundless-os${NC}"
    echo ""
    echo -e "To check a project installation:"
    echo -e "  ${CYAN}cd /path/to/your/project${NC}"
    echo -e "  ${CYAN}~/boundless-os/scripts/health-check.sh${NC}"
    echo ""
    exit 0
fi

# Check if Boundless OS is installed in project
if [ -d "$PROJECT_DIR/boundless-os" ]; then
    pass_check "boundless-os/ folder exists"
else
    fail_check "boundless-os/ folder not found"
    echo ""
    echo -e "${YELLOW}Boundless OS is not installed in this project.${NC}"
    echo -e "To install, run:"
    echo -e "  ${CYAN}~/boundless-os/scripts/project-install.sh${NC}"
    echo ""
    exit 1
fi

# Check project config
if [ -f "$PROJECT_DIR/boundless-os/config.yml" ]; then
    pass_check "Project config.yml exists"

    # Extract project configuration
    PROJECT_VERSION=$(grep "^version:" "$PROJECT_DIR/boundless-os/config.yml" | cut -d' ' -f2 | tr -d '"' | tr -d "'")
    PROJECT_PROFILE=$(grep "^profile:" "$PROJECT_DIR/boundless-os/config.yml" | cut -d' ' -f2 | tr -d '"' | tr -d "'")
    CLAUDE_CODE_COMMANDS=$(grep "^claude_code_commands:" "$PROJECT_DIR/boundless-os/config.yml" | cut -d' ' -f2)
    USE_SUBAGENTS=$(grep "^use_claude_code_subagents:" "$PROJECT_DIR/boundless-os/config.yml" | cut -d' ' -f2)

    if [ -n "$PROJECT_VERSION" ]; then
        pass_check "Project version: $PROJECT_VERSION"

        # Check if versions match
        if [ "$PROJECT_VERSION" == "$BASE_VERSION" ]; then
            pass_check "Project and base versions match"
        else
            warn_check "Version mismatch (project: $PROJECT_VERSION, base: $BASE_VERSION)"
        fi
    fi

    if [ -n "$PROJECT_PROFILE" ]; then
        pass_check "Using profile: $PROJECT_PROFILE"

        # Check if profile exists in base
        if [ -d "$BASE_DIR/profiles/$PROJECT_PROFILE" ]; then
            pass_check "Profile '$PROJECT_PROFILE' exists in base installation"
        else
            fail_check "Profile '$PROJECT_PROFILE' not found in base installation"
        fi
    fi
else
    fail_check "Project config.yml missing"
fi

echo ""

# ============================================================================
# CHECK 3: Standards
# ============================================================================

echo -e "${BOLD}${CYAN}Checking Standards...${NC}"
echo ""

if [ -d "$PROJECT_DIR/boundless-os/standards" ]; then
    pass_check "Standards directory exists"

    # Count standards files
    STANDARDS_COUNT=$(find "$PROJECT_DIR/boundless-os/standards" -name "*.md" -type f | wc -l | tr -d ' ')
    if [ "$STANDARDS_COUNT" -gt 0 ]; then
        pass_check "Found $STANDARDS_COUNT standards files"

        # Check for key standards
        if [ -f "$PROJECT_DIR/boundless-os/standards/design-principles.md" ] || \
           [ -f "$PROJECT_DIR/boundless-os/standards/coding-style.md" ]; then
            pass_check "Core standards present"
        else
            warn_check "Some core standards may be missing"
        fi
    else
        fail_check "No standards files found"
    fi
else
    fail_check "Standards directory not found"
fi

echo ""

# ============================================================================
# CHECK 4: Claude Code Integration
# ============================================================================

echo -e "${BOLD}${CYAN}Checking Claude Code Integration...${NC}"
echo ""

if [ "$CLAUDE_CODE_COMMANDS" == "true" ]; then
    # Check for key Boundless OS commands in flat structure
    if [ -f "$PROJECT_DIR/.claude/commands/plan-product.md" ]; then
        pass_check "Claude Code commands installed"

        # Count commands (excluding non-Boundless OS commands)
        COMMANDS_COUNT=0
        for cmd in plan-product shape-spec write-spec create-tasks implement-tasks orchestrate-tasks; do
            if [ -f "$PROJECT_DIR/.claude/commands/$cmd.md" ]; then
                ((COMMANDS_COUNT++))
            fi
        done

        if [ "$COMMANDS_COUNT" -gt 0 ]; then
            pass_check "Found $COMMANDS_COUNT Boundless OS command(s)"
            pass_check "Core commands present (plan-product, etc.)"
        else
            fail_check "No Boundless OS command files found"
        fi
    else
        fail_check "Claude Code commands not found"
    fi

    if [ "$USE_SUBAGENTS" == "true" ]; then
        # Check for key Boundless OS agents in flat structure
        if [ -f "$PROJECT_DIR/.claude/agents/product-planner.md" ]; then
            pass_check "Claude Code agents installed"

            # Count Boundless OS agents
            AGENTS_COUNT=0
            for agent in product-planner spec-initializer spec-shaper spec-writer spec-verifier tasks-list-creator implementer implementation-verifier; do
                if [ -f "$PROJECT_DIR/.claude/agents/$agent.md" ]; then
                    ((AGENTS_COUNT++))
                fi
            done

            if [ "$AGENTS_COUNT" -gt 0 ]; then
                pass_check "Found $AGENTS_COUNT Boundless OS agent(s)"
            else
                fail_check "No Boundless OS agent files found"
            fi
        else
            fail_check "Claude Code agents not found"
        fi
    else
        pass_check "Single-agent mode (subagents not enabled)"
    fi
else
    pass_check "Claude Code commands not enabled (using other AI tool)"
fi

# Check for claude.md
if [ -f "$PROJECT_DIR/claude.md" ] || [ -f "$PROJECT_DIR/CLAUDE.md" ]; then
    pass_check "claude.md file exists"
else
    warn_check "claude.md not found (optional, but recommended)"
fi

echo ""

# ============================================================================
# CHECK 5: Project Structure
# ============================================================================

echo -e "${BOLD}${CYAN}Checking Project Structure...${NC}"
echo ""

# Check for product folder
if [ -d "$PROJECT_DIR/boundless-os/product" ]; then
    pass_check "product/ folder exists"

    # Check if product is planned
    if [ -f "$PROJECT_DIR/boundless-os/product/mission.md" ]; then
        pass_check "Product mission defined"
    else
        warn_check "Product not yet planned (run /plan-product)"
    fi

    if [ -f "$PROJECT_DIR/boundless-os/product/roadmap.md" ]; then
        pass_check "Product roadmap exists"
    fi

    if [ -f "$PROJECT_DIR/boundless-os/product/tech-stack.md" ]; then
        pass_check "Tech stack documented"
    fi
else
    warn_check "product/ folder not found (will be created when you run /plan-product)"
fi

# Check for specs folder
if [ -d "$PROJECT_DIR/boundless-os/specs" ]; then
    pass_check "specs/ folder exists"

    # Count specs
    SPECS_COUNT=$(find "$PROJECT_DIR/boundless-os/specs" -mindepth 1 -maxdepth 1 -type d | wc -l | tr -d ' ')
    if [ "$SPECS_COUNT" -gt 0 ]; then
        pass_check "Found $SPECS_COUNT spec(s)"
    else
        warn_check "No specs created yet (use /shape-spec [feature-name])"
    fi
else
    warn_check "specs/ folder not found (will be created when you run /shape-spec)"
fi

echo ""

# ============================================================================
# CHECK 6: File Permissions
# ============================================================================

echo -e "${BOLD}${CYAN}Checking File Permissions...${NC}"
echo ""

# Check if directories are writable
if [ -w "$PROJECT_DIR/boundless-os" ]; then
    pass_check "boundless-os/ directory is writable"
else
    fail_check "boundless-os/ directory is not writable"
fi

# Check if scripts are executable
if [ -x "$BASE_DIR/scripts/project-install.sh" ]; then
    pass_check "Installation scripts are executable"
else
    warn_check "Some scripts may not be executable"
fi

echo ""

# ============================================================================
# SUMMARY
# ============================================================================

echo -e "${BOLD}${BLUE}"
echo "═══════════════════════════════════════════════════════════════════"
echo "                        Health Check Summary                        "
echo "═══════════════════════════════════════════════════════════════════"
echo -e "${NC}"
echo ""

# Calculate overall health
TOTAL_CHECKS=$((CHECKS_PASSED + CHECKS_FAILED))
if [ $TOTAL_CHECKS -gt 0 ]; then
    HEALTH_PERCENTAGE=$((CHECKS_PASSED * 100 / TOTAL_CHECKS))
else
    HEALTH_PERCENTAGE=0
fi

echo -e "${BOLD}Overall Health:${NC}"
echo ""
echo -e "  ${GREEN}✓ Passed:${NC}  $CHECKS_PASSED"
echo -e "  ${RED}✗ Failed:${NC}  $CHECKS_FAILED"
echo -e "  ${YELLOW}⚠ Warnings:${NC} $WARNINGS"
echo ""

# Determine health status
if [ $CHECKS_FAILED -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        echo -e "${BOLD}${GREEN}Status: EXCELLENT${NC} 🎉"
        echo ""
        echo "Your Boundless OS installation is perfect!"
    else
        echo -e "${BOLD}${GREEN}Status: GOOD${NC} ✓"
        echo ""
        echo "Your Boundless OS installation is working well."
        echo "There are some minor warnings you may want to address."
    fi
elif [ $CHECKS_FAILED -le 2 ]; then
    echo -e "${BOLD}${YELLOW}Status: NEEDS ATTENTION${NC} ⚠"
    echo ""
    echo "Your Boundless OS installation has some issues that should be fixed."
else
    echo -e "${BOLD}${RED}Status: CRITICAL${NC} ✗"
    echo ""
    echo "Your Boundless OS installation has significant issues."
fi

echo ""

# Show failed checks if any
if [ $CHECKS_FAILED -gt 0 ]; then
    echo -e "${BOLD}${RED}Failed Checks:${NC}"
    echo ""
    for check in "${FAILED_CHECKS[@]}"; do
        echo -e "  ${RED}✗${NC} $check"
    done
    echo ""
fi

# Show warnings if any
if [ $WARNINGS -gt 0 ]; then
    echo -e "${BOLD}${YELLOW}Warnings:${NC}"
    echo ""
    for warning in "${WARNING_MESSAGES[@]}"; do
        echo -e "  ${YELLOW}⚠${NC} $warning"
    done
    echo ""
fi

# Recommendations
if [ $CHECKS_FAILED -gt 0 ] || [ $WARNINGS -gt 0 ]; then
    echo -e "${BOLD}Recommendations:${NC}"
    echo ""

    if [ $CHECKS_FAILED -gt 0 ]; then
        echo -e "  ${CYAN}1. Try reinstalling Boundless OS:${NC}"
        echo -e "     cd $PROJECT_DIR"
        echo -e "     ~/boundless-os/scripts/project-install.sh --re-install"
        echo ""
    fi

    if grep -q "version mismatch" <<< "${WARNING_MESSAGES[@]}"; then
        echo -e "  ${CYAN}2. Update your project installation:${NC}"
        echo -e "     cd $PROJECT_DIR"
        echo -e "     ~/boundless-os/scripts/project-update.sh"
        echo ""
    fi

    if grep -q "not yet planned" <<< "${WARNING_MESSAGES[@]}"; then
        echo -e "  ${CYAN}3. Plan your product:${NC}"
        echo -e "     Open Claude Code and run: /plan-product"
        echo ""
    fi

    if grep -q "No specs created" <<< "${WARNING_MESSAGES[@]}"; then
        echo -e "  ${CYAN}4. Create your first feature:${NC}"
        echo -e "     Open Claude Code and run: /shape-spec [feature-name]"
        echo ""
    fi
fi

# Resources
echo -e "${BOLD}Resources:${NC}"
echo ""
echo -e "  • Quickstart Guide:  ${CYAN}$BASE_DIR/QUICKSTART.md${NC}"
echo -e "  • Troubleshooting:   ${CYAN}$BASE_DIR/TROUBLESHOOTING.md${NC}"
echo -e "  • GitHub Issues:     ${CYAN}https://github.com/buildermethods/boundless-os/issues${NC}"
echo ""

# Exit code
if [ $CHECKS_FAILED -eq 0 ]; then
    exit 0
else
    exit 1
fi
