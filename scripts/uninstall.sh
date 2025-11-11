#!/bin/bash

# Boundless OS Uninstall Script
# Safely removes Boundless OS from a project

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
PROJECT_DIR="$(pwd)"

# Source common functions
source "$SCRIPT_DIR/common-functions.sh"

# Flags
KEEP_PRODUCT=true
KEEP_SPECS=true
KEEP_STANDARDS=true
FORCE=false
DRY_RUN=false

# -----------------------------------------------------------------------------
# Help Function
# -----------------------------------------------------------------------------

show_help() {
    cat << EOF
Usage: $0 [OPTIONS]

Safely remove Boundless OS from the current project.

Options:
    --keep-product [true/false]      Keep product documents (default: true)
    --keep-specs [true/false]        Keep specifications (default: true)
    --keep-standards [true/false]    Keep custom standards (default: true)
    --force                          Skip confirmation prompts
    --dry-run                        Show what would be deleted without deleting
    -h, --help                       Show this help message

What Gets Deleted:
    ✗ boundless-os/config.yml
    ✗ .claude/commands/boundless-os/
    ✗ .claude/agents/boundless-os/
    ✗ claude.md Boundless OS banner (optional)

What's Preserved (by default):
    ✓ boundless-os/product/ (mission, roadmap, tech stack)
    ✓ boundless-os/specs/ (all feature specifications)
    ✓ boundless-os/standards/ (your custom standards)
    ✓ Your actual code (src/, app/, etc.)

Examples:
    $0                                # Safe uninstall (keeps user content)
    $0 --force                        # Skip confirmation
    $0 --keep-specs false             # Delete specs too
    $0 --dry-run                      # Preview what would be deleted

EOF
    exit 0
}

# -----------------------------------------------------------------------------
# Parse Command Line Arguments
# -----------------------------------------------------------------------------

while [[ $# -gt 0 ]]; do
    case $1 in
        --keep-product)
            KEEP_PRODUCT="$2"
            shift 2
            ;;
        --keep-specs)
            KEEP_SPECS="$2"
            shift 2
            ;;
        --keep-standards)
            KEEP_STANDARDS="$2"
            shift 2
            ;;
        --force)
            FORCE=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        -h|--help)
            show_help
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            show_help
            ;;
    esac
done

# -----------------------------------------------------------------------------
# Checks
# -----------------------------------------------------------------------------

check_installation() {
    # Check if we're in a project with Boundless OS
    if [ ! -d "$PROJECT_DIR/boundless-os" ]; then
        echo -e "${RED}✗ Boundless OS is not installed in this directory.${NC}"
        echo ""
        echo "Current directory: $PROJECT_DIR"
        echo ""
        echo "To uninstall Boundless OS, run this script from a project directory that has boundless-os/ installed."
        exit 1
    fi

    # Check we're not in the base installation
    if [ "$PROJECT_DIR" == "$BASE_DIR" ]; then
        echo -e "${RED}✗ Cannot uninstall from the base Boundless OS directory.${NC}"
        echo ""
        echo "This script uninstalls Boundless OS from individual projects, not the base installation."
        echo ""
        echo "To remove the base installation:"
        echo "  rm -rf ~/boundless-os"
        echo ""
        exit 1
    fi
}

# -----------------------------------------------------------------------------
# Uninstall Functions
# -----------------------------------------------------------------------------

show_banner() {
    echo -e "${BOLD}${RED}"
    echo "═══════════════════════════════════════════════════════════════════"
    echo "                   Boundless OS Uninstall                             "
    echo "═══════════════════════════════════════════════════════════════════"
    echo -e "${NC}"
    echo ""
}

show_what_will_be_deleted() {
    echo -e "${BOLD}What will be deleted:${NC}"
    echo ""

    # Always deleted
    if [ -f "$PROJECT_DIR/boundless-os/config.yml" ]; then
        echo -e "  ${RED}✗${NC} boundless-os/config.yml"
    fi

    if [ -d "$PROJECT_DIR/.claude/commands/boundless-os" ]; then
        echo -e "  ${RED}✗${NC} .claude/commands/boundless-os/"
    fi

    if [ -d "$PROJECT_DIR/.claude/agents/boundless-os" ]; then
        echo -e "  ${RED}✗${NC} .claude/agents/boundless-os/"
    fi

    # Conditionally deleted
    if [ "$KEEP_PRODUCT" != "true" ] && [ -d "$PROJECT_DIR/boundless-os/product" ]; then
        echo -e "  ${RED}✗${NC} boundless-os/product/ (mission, roadmap, tech stack)"
    fi

    if [ "$KEEP_SPECS" != "true" ] && [ -d "$PROJECT_DIR/boundless-os/specs" ]; then
        echo -e "  ${RED}✗${NC} boundless-os/specs/ (all feature specifications)"
    fi

    if [ "$KEEP_STANDARDS" != "true" ] && [ -d "$PROJECT_DIR/boundless-os/standards" ]; then
        echo -e "  ${RED}✗${NC} boundless-os/standards/ (your custom standards)"
    fi

    echo ""
    echo -e "${BOLD}What will be preserved:${NC}"
    echo ""

    # Always preserved
    echo -e "  ${GREEN}✓${NC} Your actual code (src/, app/, etc.)"

    # Conditionally preserved
    if [ "$KEEP_PRODUCT" == "true" ] && [ -d "$PROJECT_DIR/boundless-os/product" ]; then
        echo -e "  ${GREEN}✓${NC} boundless-os/product/ (mission, roadmap, tech stack)"
    fi

    if [ "$KEEP_SPECS" == "true" ] && [ -d "$PROJECT_DIR/boundless-os/specs" ]; then
        echo -e "  ${GREEN}✓${NC} boundless-os/specs/ (all feature specifications)"
    fi

    if [ "$KEEP_STANDARDS" == "true" ] && [ -d "$PROJECT_DIR/boundless-os/standards" ]; then
        echo -e "  ${GREEN}✓${NC} boundless-os/standards/ (your custom standards)"
    fi

    echo ""
}

confirm_uninstall() {
    if [ "$FORCE" == "true" ]; then
        return 0
    fi

    echo -e "${YELLOW}Are you sure you want to uninstall Boundless OS?${NC}"
    echo ""
    read -p "Type 'yes' to confirm: " confirmation

    if [ "$confirmation" != "yes" ]; then
        echo ""
        echo -e "${CYAN}Uninstall cancelled.${NC}"
        echo ""
        exit 0
    fi
}

perform_uninstall() {
    local items_deleted=0

    if [ "$DRY_RUN" == "true" ]; then
        echo -e "${YELLOW}DRY RUN - No files will be actually deleted${NC}"
        echo ""
    else
        echo -e "${CYAN}Uninstalling Boundless OS...${NC}"
        echo ""
    fi

    # Delete config
    if [ -f "$PROJECT_DIR/boundless-os/config.yml" ]; then
        if [ "$DRY_RUN" != "true" ]; then
            rm -f "$PROJECT_DIR/boundless-os/config.yml"
        fi
        echo -e "${RED}✗${NC} Removed boundless-os/config.yml"
        ((items_deleted++))
    fi

    # Delete Claude Code commands
    if [ -d "$PROJECT_DIR/.claude/commands/boundless-os" ]; then
        if [ "$DRY_RUN" != "true" ]; then
            rm -rf "$PROJECT_DIR/.claude/commands/boundless-os"
        fi
        echo -e "${RED}✗${NC} Removed .claude/commands/boundless-os/"
        ((items_deleted++))
    fi

    # Delete Claude Code agents
    if [ -d "$PROJECT_DIR/.claude/agents/boundless-os" ]; then
        if [ "$DRY_RUN" != "true" ]; then
            rm -rf "$PROJECT_DIR/.claude/agents/boundless-os"
        fi
        echo -e "${RED}✗${NC} Removed .claude/agents/boundless-os/"
        ((items_deleted++))
    fi

    # Delete SETUP-MCP.md if exists
    if [ -f "$PROJECT_DIR/boundless-os/SETUP-MCP.md" ]; then
        if [ "$DRY_RUN" != "true" ]; then
            rm -f "$PROJECT_DIR/boundless-os/SETUP-MCP.md"
        fi
        echo -e "${RED}✗${NC} Removed boundless-os/SETUP-MCP.md"
        ((items_deleted++))
    fi

    # Optionally delete product docs
    if [ "$KEEP_PRODUCT" != "true" ] && [ -d "$PROJECT_DIR/boundless-os/product" ]; then
        if [ "$DRY_RUN" != "true" ]; then
            rm -rf "$PROJECT_DIR/boundless-os/product"
        fi
        echo -e "${RED}✗${NC} Removed boundless-os/product/"
        ((items_deleted++))
    fi

    # Optionally delete specs
    if [ "$KEEP_SPECS" != "true" ] && [ -d "$PROJECT_DIR/boundless-os/specs" ]; then
        if [ "$DRY_RUN" != "true" ]; then
            rm -rf "$PROJECT_DIR/boundless-os/specs"
        fi
        echo -e "${RED}✗${NC} Removed boundless-os/specs/"
        ((items_deleted++))
    fi

    # Optionally delete standards
    if [ "$KEEP_STANDARDS" != "true" ] && [ -d "$PROJECT_DIR/boundless-os/standards" ]; then
        if [ "$DRY_RUN" != "true" ]; then
            rm -rf "$PROJECT_DIR/boundless-os/standards"
        fi
        echo -e "${RED}✗${NC} Removed boundless-os/standards/"
        ((items_deleted++))
    fi

    # Remove empty boundless-os directory if it's now empty
    if [ -d "$PROJECT_DIR/boundless-os" ]; then
        if [ -z "$(ls -A $PROJECT_DIR/boundless-os)" ]; then
            if [ "$DRY_RUN" != "true" ]; then
                rm -rf "$PROJECT_DIR/boundless-os"
            fi
            echo -e "${RED}✗${NC} Removed empty boundless-os/ directory"
            ((items_deleted++))
        fi
    fi

    # Ask about claude.md banner
    if [ -f "$PROJECT_DIR/claude.md" ] && grep -q "Boundless OS priority banner" "$PROJECT_DIR/claude.md"; then
        echo ""
        if [ "$FORCE" != "true" ]; then
            read -p "Remove Boundless OS banner from claude.md? (y/n): " remove_banner
        else
            remove_banner="y"
        fi

        if [ "$remove_banner" == "y" ] || [ "$remove_banner" == "Y" ]; then
            if [ "$DRY_RUN" != "true" ]; then
                # Remove banner section
                sed -i.bak '/<!-- Boundless OS priority banner -->/,/^$/d' "$PROJECT_DIR/claude.md"
                rm -f "$PROJECT_DIR/claude.md.bak"
            fi
            echo -e "${RED}✗${NC} Removed Boundless OS banner from claude.md"
            ((items_deleted++))
        fi
    fi

    echo ""
    return $items_deleted
}

# -----------------------------------------------------------------------------
# Main Execution
# -----------------------------------------------------------------------------

main() {
    show_banner

    # Run checks
    check_installation

    # Show what will happen
    show_what_will_be_deleted

    # Confirm
    confirm_uninstall

    # Perform uninstall
    perform_uninstall
    items_deleted=$?

    # Summary
    echo ""
    echo -e "${BOLD}${GREEN}"
    echo "═══════════════════════════════════════════════════════════════════"
    if [ "$DRY_RUN" == "true" ]; then
        echo "               Uninstall Preview Complete                         "
    else
        echo "               Uninstall Complete                                 "
    fi
    echo "═══════════════════════════════════════════════════════════════════"
    echo -e "${NC}"
    echo ""

    if [ "$DRY_RUN" == "true" ]; then
        echo -e "${YELLOW}This was a dry run. No files were actually deleted.${NC}"
        echo ""
        echo "To perform the actual uninstall, run:"
        echo "  $0"
        echo ""
    else
        echo -e "${GREEN}Boundless OS has been uninstalled from this project.${NC}"
        echo ""
        echo -e "Removed $items_deleted item(s)."
        echo ""

        if [ "$KEEP_PRODUCT" == "true" ] || [ "$KEEP_SPECS" == "true" ] || [ "$KEEP_STANDARDS" == "true" ]; then
            echo -e "${CYAN}Preserved user content:${NC}"
            [ "$KEEP_PRODUCT" == "true" ] && [ -d "$PROJECT_DIR/boundless-os/product" ] && echo "  • boundless-os/product/"
            [ "$KEEP_SPECS" == "true" ] && [ -d "$PROJECT_DIR/boundless-os/specs" ] && echo "  • boundless-os/specs/"
            [ "$KEEP_STANDARDS" == "true" ] && [ -d "$PROJECT_DIR/boundless-os/standards" ] && echo "  • boundless-os/standards/"
            echo ""
        fi

        echo -e "${BOLD}What's next?${NC}"
        echo ""
        echo "To reinstall Boundless OS later:"
        echo "  ~/boundless-os/scripts/project-install.sh"
        echo ""
        echo "To completely remove the base Boundless OS:"
        echo "  rm -rf ~/boundless-os"
        echo ""
    fi
}

# Run main function
main
