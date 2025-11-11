#!/bin/bash

# Boundless OS Interactive Installation Wizard
# Version: 2.1.1
# Description: Guides users through setting up Boundless OS in their project

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
AGENT_OS_BASE="$(dirname "$SCRIPT_DIR")"

# Source common functions
source "$SCRIPT_DIR/common-functions.sh"

# Clear screen and show welcome
clear

echo -e "${BOLD}${BLUE}"
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                                                                    ║"
echo "║                     Welcome to Boundless OS! 🚀                        ║"
echo "║                                                                    ║"
echo "║  Transform AI coding agents from confused interns into            ║"
echo "║  productive developers through structured workflows               ║"
echo "║                                                                    ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "${CYAN}This wizard will help you set up Boundless OS in about 2 minutes.${NC}"
echo ""
echo -e "You'll be guided through:"
echo -e "  ${GREEN}•${NC} Understanding your project type"
echo -e "  ${GREEN}•${NC} Configuring the right profile for you"
echo -e "  ${GREEN}•${NC} Installing Boundless OS into your project"
echo -e "  ${GREEN}•${NC} Learning what to do next"
echo ""
read -p "Press Enter to continue..."
clear

# ============================================================================
# STEP 1: Technical Level Assessment
# ============================================================================

echo -e "${BOLD}${BLUE}Step 1 of 6: Your Technical Background${NC}"
echo ""
echo -e "This helps us configure the right level of guidance for you."
echo ""
echo -e "What's your technical experience level?"
echo ""
echo -e "  ${BOLD}1)${NC} Non-technical founder"
echo -e "     ${CYAN}I have a great product idea but don't write code${NC}"
echo ""
echo -e "  ${BOLD}2)${NC} Some coding experience"
echo -e "     ${CYAN}I've done some tutorials, can read basic code${NC}"
echo ""
echo -e "  ${BOLD}3)${NC} Experienced developer"
echo -e "     ${CYAN}I write code regularly, understand dev workflows${NC}"
echo ""
read -p "Enter choice (1-3): " tech_level

case $tech_level in
    1)
        PROFILE="ryan"
        TECH_LABEL="non-technical founder"
        echo -e "${GREEN}✓${NC} We'll use the 'ryan' profile (optimized for non-technical founders)"
        ;;
    2)
        PROFILE="default"
        TECH_LABEL="developer with some experience"
        echo -e "${GREEN}✓${NC} We'll use the 'default' profile (balanced for learning developers)"
        ;;
    3)
        PROFILE="default"
        TECH_LABEL="experienced developer"
        echo -e "${GREEN}✓${NC} We'll use the 'default' profile (standard development workflow)"
        ;;
    *)
        echo -e "${YELLOW}Invalid choice. Defaulting to 'ryan' profile for maximum guidance.${NC}"
        PROFILE="ryan"
        TECH_LABEL="non-technical founder"
        ;;
esac

sleep 1
clear

# ============================================================================
# STEP 2: Project Type
# ============================================================================

echo -e "${BOLD}${BLUE}Step 2 of 6: What Are You Building?${NC}"
echo ""
echo -e "This helps us understand your project context."
echo ""
echo -e "What type of product are you building?"
echo ""
echo -e "  ${BOLD}1)${NC} SaaS application"
echo -e "     ${CYAN}Web app that people pay for (subscription, one-time purchase)${NC}"
echo ""
echo -e "  ${BOLD}2)${NC} E-commerce / Marketplace"
echo -e "     ${CYAN}Online store, two-sided marketplace, booking platform${NC}"
echo ""
echo -e "  ${BOLD}3)${NC} Internal business tool"
echo -e "     ${CYAN}CRM, admin panel, workflow automation for your team${NC}"
echo ""
echo -e "  ${BOLD}4)${NC} Mobile app"
echo -e "     ${CYAN}iOS/Android application${NC}"
echo ""
echo -e "  ${BOLD}5)${NC} Something else"
echo -e "     ${CYAN}API, developer tool, content site, etc.${NC}"
echo ""
read -p "Enter choice (1-5): " project_type

case $project_type in
    1) PROJECT_TYPE_LABEL="SaaS application" ;;
    2) PROJECT_TYPE_LABEL="E-commerce/Marketplace" ;;
    3) PROJECT_TYPE_LABEL="Internal business tool" ;;
    4) PROJECT_TYPE_LABEL="Mobile app" ;;
    5) PROJECT_TYPE_LABEL="Custom project" ;;
    *) PROJECT_TYPE_LABEL="General project" ;;
esac

echo -e "${GREEN}✓${NC} Building a ${PROJECT_TYPE_LABEL}"
sleep 1
clear

# ============================================================================
# STEP 3: Project State
# ============================================================================

echo -e "${BOLD}${BLUE}Step 3 of 6: Project Status${NC}"
echo ""
echo -e "Do you have code already, or are you starting from scratch?"
echo ""
echo -e "  ${BOLD}1)${NC} Just have an idea (no code yet)"
echo -e "     ${CYAN}We'll help you plan from scratch${NC}"
echo ""
echo -e "  ${BOLD}2)${NC} Existing project (already have code)"
echo -e "     ${CYAN}We'll install Boundless OS into your existing codebase${NC}"
echo ""
echo -e "  ${BOLD}3)${NC} Need to create a new project folder"
echo -e "     ${CYAN}We'll help you set up a new directory${NC}"
echo ""
read -p "Enter choice (1-3): " project_state

case $project_state in
    1)
        PROJECT_STATE_LABEL="new idea"
        HAS_CODE=false
        ;;
    2)
        PROJECT_STATE_LABEL="existing project"
        HAS_CODE=true
        ;;
    3)
        PROJECT_STATE_LABEL="new project folder needed"
        HAS_CODE=false
        CREATE_NEW=true
        ;;
    *)
        PROJECT_STATE_LABEL="new idea"
        HAS_CODE=false
        ;;
esac

echo -e "${GREEN}✓${NC} Status: ${PROJECT_STATE_LABEL}"
sleep 1
clear

# ============================================================================
# STEP 4: Project Location
# ============================================================================

echo -e "${BOLD}${BLUE}Step 4 of 6: Project Location${NC}"
echo ""

if [ "$CREATE_NEW" = true ]; then
    echo -e "Let's create a new folder for your project."
    echo ""
    read -p "Project name (e.g., my-saas-app): " project_name

    # Suggest location
    DEFAULT_LOCATION="$HOME/$project_name"
    echo ""
    echo -e "Where should we create this project?"
    read -p "Path [default: $DEFAULT_LOCATION]: " project_path

    # Use default if empty
    if [ -z "$project_path" ]; then
        project_path="$DEFAULT_LOCATION"
    fi

    # Create directory
    if [ -d "$project_path" ]; then
        echo -e "${YELLOW}⚠ Directory already exists: $project_path${NC}"
        read -p "Use this directory anyway? (y/n): " use_existing
        if [ "$use_existing" != "y" ] && [ "$use_existing" != "Y" ]; then
            echo -e "${RED}Installation cancelled.${NC}"
            exit 1
        fi
    else
        mkdir -p "$project_path"
        echo -e "${GREEN}✓${NC} Created directory: $project_path"
    fi
else
    echo -e "Where is your project located?"
    echo ""
    echo -e "${CYAN}Examples:${NC}"
    echo -e "  ${HOME}/my-app"
    echo -e "  ${HOME}/code/saas-project"
    echo -e "  ${HOME}/Desktop/my-startup"
    echo ""
    read -p "Project path: " project_path

    # Expand tilde
    project_path="${project_path/#\~/$HOME}"

    # Check if directory exists
    if [ ! -d "$project_path" ]; then
        echo -e "${RED}✗ Directory does not exist: $project_path${NC}"
        read -p "Create it? (y/n): " create_it
        if [ "$create_it" = "y" ] || [ "$create_it" = "Y" ]; then
            mkdir -p "$project_path"
            echo -e "${GREEN}✓${NC} Created directory"
        else
            echo -e "${RED}Installation cancelled.${NC}"
            exit 1
        fi
    fi
fi

echo -e "${GREEN}✓${NC} Project location: $project_path"
sleep 1
clear

# ============================================================================
# STEP 5: AI Tool Selection
# ============================================================================

echo -e "${BOLD}${BLUE}Step 5 of 6: Which AI Coding Tool Do You Use?${NC}"
echo ""
echo -e "Boundless OS works with multiple AI coding assistants."
echo ""
echo -e "  ${BOLD}1)${NC} Claude Code"
echo -e "     ${CYAN}Anthropic's official CLI (recommended)${NC}"
echo ""
echo -e "  ${BOLD}2)${NC} Cursor"
echo -e "     ${CYAN}AI-first code editor${NC}"
echo ""
echo -e "  ${BOLD}3)${NC} Windsurf"
echo -e "     ${CYAN}Codeium's AI IDE${NC}"
echo ""
echo -e "  ${BOLD}4)${NC} Multiple / Other"
echo -e "     ${CYAN}Use Boundless OS with any AI tool${NC}"
echo ""
read -p "Enter choice (1-4): " ai_tool

case $ai_tool in
    1)
        AI_TOOL_LABEL="Claude Code"
        USE_CLAUDE_CODE=true
        USE_AGENT_OS_COMMANDS=false
        ;;
    2)
        AI_TOOL_LABEL="Cursor"
        USE_CLAUDE_CODE=false
        USE_AGENT_OS_COMMANDS=true
        ;;
    3)
        AI_TOOL_LABEL="Windsurf"
        USE_CLAUDE_CODE=false
        USE_AGENT_OS_COMMANDS=true
        ;;
    4)
        AI_TOOL_LABEL="Multiple tools"
        USE_CLAUDE_CODE=true
        USE_AGENT_OS_COMMANDS=true
        ;;
    *)
        AI_TOOL_LABEL="Claude Code (default)"
        USE_CLAUDE_CODE=true
        USE_AGENT_OS_COMMANDS=false
        ;;
esac

echo -e "${GREEN}✓${NC} Using ${AI_TOOL_LABEL}"
sleep 1
clear

# ============================================================================
# STEP 6: Configuration Summary
# ============================================================================

echo -e "${BOLD}${BLUE}Step 6 of 6: Confirm Installation${NC}"
echo ""
echo -e "Here's what we'll set up:"
echo ""
echo -e "${BOLD}Project:${NC}"
echo -e "  Location:  $project_path"
echo -e "  Type:      $PROJECT_TYPE_LABEL"
echo -e "  Status:    $PROJECT_STATE_LABEL"
echo ""
echo -e "${BOLD}Configuration:${NC}"
echo -e "  Profile:   $PROFILE (optimized for $TECH_LABEL)"
echo -e "  AI Tool:   $AI_TOOL_LABEL"
echo ""
echo -e "${BOLD}What will be installed:${NC}"
echo -e "  ${GREEN}✓${NC} Boundless OS commands in .claude/commands/boundless-os/"
echo -e "  ${GREEN}✓${NC} Development standards in boundless-os/standards/"
echo -e "  ${GREEN}✓${NC} AI agents for structured workflows"
echo -e "  ${GREEN}✓${NC} Project scaffolding (folders, not code)"
echo ""
read -p "Continue with installation? (y/n): " confirm

if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo -e "${YELLOW}Installation cancelled.${NC}"
    exit 0
fi

clear

# ============================================================================
# INSTALLATION
# ============================================================================

echo -e "${BOLD}${BLUE}Installing Boundless OS...${NC}"
echo ""

# Navigate to project directory
cd "$project_path"

# Build installation command with flags
INSTALL_CMD="$SCRIPT_DIR/project-install.sh"
INSTALL_FLAGS=""

if [ "$PROFILE" = "ryan" ]; then
    INSTALL_FLAGS="$INSTALL_FLAGS --profile ryan"
fi

if [ "$USE_CLAUDE_CODE" = true ]; then
    INSTALL_FLAGS="$INSTALL_FLAGS --claude-code-commands true"
    INSTALL_FLAGS="$INSTALL_FLAGS --use-claude-code-subagents true"
fi

if [ "$USE_AGENT_OS_COMMANDS" = true ]; then
    INSTALL_FLAGS="$INSTALL_FLAGS --boundless-os-commands true"
fi

# Run installation
echo -e "${CYAN}Running: project-install.sh $INSTALL_FLAGS${NC}"
echo ""

$INSTALL_CMD $INSTALL_FLAGS

# Check if installation succeeded
if [ $? -eq 0 ]; then
    INSTALL_SUCCESS=true
else
    INSTALL_SUCCESS=false
fi

clear

# ============================================================================
# SUCCESS MESSAGE
# ============================================================================

if [ "$INSTALL_SUCCESS" = true ]; then
    echo -e "${BOLD}${GREEN}"
    echo "╔════════════════════════════════════════════════════════════════════╗"
    echo "║                                                                    ║"
    echo "║              ✓ Boundless OS Installed Successfully! 🎉                 ║"
    echo "║                                                                    ║"
    echo "╚════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    echo -e "${BOLD}📍 Installation Summary:${NC}"
    echo ""
    echo -e "  ${GREEN}✓${NC} Profile: ${BOLD}$PROFILE${NC}"
    if [ "$PROFILE" = "ryan" ]; then
        echo -e "    ${CYAN}Optimized for non-technical founders with:${NC}"
        echo -e "    • Plain language communication (no jargon)"
        echo -e "    • S-tier design standards (Stripe/Notion quality)"
        echo -e "    • Visual testing with Playwright"
        echo -e "    • Security & code reviews automatic"
    fi
    echo ""
    echo -e "  ${GREEN}✓${NC} Commands installed: ${BOLD}.claude/commands/boundless-os/${NC}"
    echo -e "  ${GREEN}✓${NC} Standards installed: ${BOLD}boundless-os/standards/${NC}"
    echo -e "  ${GREEN}✓${NC} Agents configured: ${BOLD}8 specialized agents${NC}"
    echo ""
    echo -e "${BOLD}🚀 What's Next?${NC}"
    echo ""

    # Detect project state and suggest next action
    if [ -f "boundless-os/product/mission.md" ]; then
        echo -e "  Your product is already planned!"
        echo -e "  ${CYAN}Next: Plan a new feature${NC}"
        echo -e "  ${BOLD}→ /shape-spec <feature-name>${NC}"
    else
        echo -e "  Let's plan your product! This takes about 15-30 minutes."
        echo -e "  ${CYAN}We'll create your mission, roadmap, and tech stack.${NC}"
        echo ""
        if [ "$USE_CLAUDE_CODE" = true ]; then
            echo -e "  ${BOLD}1. Open Claude Code in this directory:${NC}"
            echo -e "     ${YELLOW}claude-code${NC}"
            echo ""
            echo -e "  ${BOLD}2. Run your first command:${NC}"
            echo -e "     ${YELLOW}/plan-product${NC}"
        else
            echo -e "  ${BOLD}1. Open your AI coding tool in this directory${NC}"
            echo ""
            echo -e "  ${BOLD}2. Tell your AI agent:${NC}"
            echo -e "     ${YELLOW}\"Let's plan my product using Boundless OS\"${NC}"
        fi
    fi

    echo ""
    echo -e "${BOLD}📖 Resources:${NC}"
    echo ""
    echo -e "  • Quickstart guide:    ${CYAN}$AGENT_OS_BASE/QUICKSTART.md${NC}"
    echo -e "  • Workflow explained:  ${CYAN}$AGENT_OS_BASE/WORKFLOW.md${NC}"
    echo -e "  • Example projects:    ${CYAN}$AGENT_OS_BASE/examples/${NC}"

    if [ "$PROFILE" = "ryan" ]; then
        echo -e "  • Your profile guide:  ${CYAN}$AGENT_OS_BASE/profiles/ryan/README.md${NC}"
    fi

    echo -e "  • Full documentation:  ${CYAN}https://github.com/buildermethods/boundless-os${NC}"
    echo ""
    echo -e "${BOLD}💡 Tip:${NC} Boundless OS works in 6 phases:"
    echo -e "   ${YELLOW}1.${NC} Plan Product  ${YELLOW}→${NC}  ${YELLOW}2.${NC} Shape Spec  ${YELLOW}→${NC}  ${YELLOW}3.${NC} Write Spec"
    echo -e "   ${YELLOW}4.${NC} Create Tasks  ${YELLOW}→${NC}  ${YELLOW}5.${NC} Implement   ${YELLOW}→${NC}  ${YELLOW}6.${NC} Verify"
    echo ""
    echo -e "${GREEN}Ready to build something amazing!${NC}"
    echo ""

else
    echo -e "${BOLD}${RED}"
    echo "╔════════════════════════════════════════════════════════════════════╗"
    echo "║                                                                    ║"
    echo "║                   ✗ Installation Failed                            ║"
    echo "║                                                                    ║"
    echo "╚════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    echo -e "${YELLOW}Something went wrong during installation.${NC}"
    echo ""
    echo -e "${BOLD}Troubleshooting:${NC}"
    echo -e "  1. Check the error messages above"
    echo -e "  2. Ensure you have write permissions in: $project_path"
    echo -e "  3. Try running the installer directly:"
    echo -e "     ${CYAN}cd $project_path${NC}"
    echo -e "     ${CYAN}$INSTALL_CMD $INSTALL_FLAGS${NC}"
    echo ""
    echo -e "  4. Get help:"
    echo -e "     ${CYAN}https://github.com/buildermethods/boundless-os/issues${NC}"
    echo ""
fi
