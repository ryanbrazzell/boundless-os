#!/bin/bash

# =============================================================================
# Boundless OS Project Installation Script
# Installs Boundless OS into a project's codebase
# =============================================================================

set -e  # Exit on error

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BASE_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_DIR="$(pwd)"

# Source common functions
source "$SCRIPT_DIR/common-functions.sh"

# -----------------------------------------------------------------------------
# Default Values
# -----------------------------------------------------------------------------

DRY_RUN="false"
VERBOSE="false"
PROFILE=""
CLAUDE_CODE_COMMANDS=""
USE_CLAUDE_CODE_SUBAGENTS=""
AGENT_OS_COMMANDS=""
STANDARDS_AS_CLAUDE_CODE_SKILLS=""
RE_INSTALL="false"
OVERWRITE_ALL="false"
OVERWRITE_STANDARDS="false"
OVERWRITE_COMMANDS="false"
OVERWRITE_AGENTS="false"
INSTALLED_FILES=()

# -----------------------------------------------------------------------------
# Help Function
# -----------------------------------------------------------------------------

show_help() {
    cat << EOF
Usage: $0 [OPTIONS]

Install Boundless OS into the current project directory.

Options:
    --profile PROFILE                        Use specified profile (default: from config.yml)
    --claude-code-commands [BOOL]            Install Claude Code commands (default: from config.yml)
    --use-claude-code-subagents [BOOL]       Use Claude Code subagents (default: from config.yml)
    --boundless-os-commands [BOOL]               Install boundless-os commands (default: from config.yml)
    --standards-as-claude-code-skills [BOOL] Use Claude Code Skills for standards (default: from config.yml)
    --re-install                             Delete and reinstall Boundless OS
    --overwrite-all                          Overwrite all existing files during update
    --overwrite-standards                    Overwrite existing standards during update
    --overwrite-commands                     Overwrite existing commands during update
    --overwrite-agents                       Overwrite existing agents during update
    --dry-run                                Show what would be done without doing it
    --verbose                                Show detailed output
    -h, --help                               Show this help message

Note: Flags accept both hyphens and underscores (e.g., --use-claude-code-subagents or --use_claude_code_subagents)

Examples:
    $0
    $0 --profile rails
    $0 --claude-code-commands true --use-claude-code-subagents true
    $0 --boundless-os-commands true --dry-run

EOF
    exit 0
}

# -----------------------------------------------------------------------------
# Parse Command Line Arguments
# -----------------------------------------------------------------------------

parse_arguments() {
    while [[ $# -gt 0 ]]; do
        # Normalize flag by replacing underscores with hyphens
        local flag="${1//_/-}"

        case $flag in
            --profile)
                PROFILE="$2"
                shift 2
                ;;
            --claude-code-commands)
                read CLAUDE_CODE_COMMANDS shift_count <<< "$(parse_bool_flag "$CLAUDE_CODE_COMMANDS" "$2")"
                shift $shift_count
                ;;
            --use-claude-code-subagents)
                read USE_CLAUDE_CODE_SUBAGENTS shift_count <<< "$(parse_bool_flag "$USE_CLAUDE_CODE_SUBAGENTS" "$2")"
                shift $shift_count
                ;;
            --boundless-os-commands)
                read AGENT_OS_COMMANDS shift_count <<< "$(parse_bool_flag "$AGENT_OS_COMMANDS" "$2")"
                shift $shift_count
                ;;
            --standards-as-claude-code-skills)
                read STANDARDS_AS_CLAUDE_CODE_SKILLS shift_count <<< "$(parse_bool_flag "$STANDARDS_AS_CLAUDE_CODE_SKILLS" "$2")"
                shift $shift_count
                ;;
            --re-install)
                RE_INSTALL="true"
                shift
                ;;
            --overwrite-all)
                OVERWRITE_ALL="true"
                shift
                ;;
            --overwrite-standards)
                OVERWRITE_STANDARDS="true"
                shift
                ;;
            --overwrite-commands)
                OVERWRITE_COMMANDS="true"
                shift
                ;;
            --overwrite-agents)
                OVERWRITE_AGENTS="true"
                shift
                ;;
            --dry-run)
                DRY_RUN="true"
                shift
                ;;
            --verbose)
                VERBOSE="true"
                shift
                ;;
            -h|--help)
                show_help
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                ;;
        esac
    done
}

# -----------------------------------------------------------------------------
# Configuration Functions
# -----------------------------------------------------------------------------

load_configuration() {
    # Load base configuration using common function
    load_base_config

    # Set effective values (command line overrides base config)
    EFFECTIVE_PROFILE="${PROFILE:-$BASE_PROFILE}"
    EFFECTIVE_CLAUDE_CODE_COMMANDS="${CLAUDE_CODE_COMMANDS:-$BASE_CLAUDE_CODE_COMMANDS}"
    EFFECTIVE_USE_CLAUDE_CODE_SUBAGENTS="${USE_CLAUDE_CODE_SUBAGENTS:-$BASE_USE_CLAUDE_CODE_SUBAGENTS}"
    EFFECTIVE_AGENT_OS_COMMANDS="${AGENT_OS_COMMANDS:-$BASE_AGENT_OS_COMMANDS}"
    EFFECTIVE_STANDARDS_AS_CLAUDE_CODE_SKILLS="${STANDARDS_AS_CLAUDE_CODE_SKILLS:-$BASE_STANDARDS_AS_CLAUDE_CODE_SKILLS}"
    EFFECTIVE_VERSION="$BASE_VERSION"

    # Validate configuration using common function (may override EFFECTIVE_STANDARDS_AS_CLAUDE_CODE_SKILLS if dependency not met)
    validate_config "$EFFECTIVE_CLAUDE_CODE_COMMANDS" "$EFFECTIVE_USE_CLAUDE_CODE_SUBAGENTS" "$EFFECTIVE_AGENT_OS_COMMANDS" "$EFFECTIVE_STANDARDS_AS_CLAUDE_CODE_SKILLS" "$EFFECTIVE_PROFILE"

    print_verbose "Configuration loaded:"
    print_verbose "  Profile: $EFFECTIVE_PROFILE"
    print_verbose "  Claude Code commands: $EFFECTIVE_CLAUDE_CODE_COMMANDS"
    print_verbose "  Use Claude Code subagents: $EFFECTIVE_USE_CLAUDE_CODE_SUBAGENTS"
    print_verbose "  Boundless OS commands: $EFFECTIVE_AGENT_OS_COMMANDS"
    print_verbose "  Standards as Claude Code Skills: $EFFECTIVE_STANDARDS_AS_CLAUDE_CODE_SKILLS"
}

# -----------------------------------------------------------------------------
# Installation Functions
# -----------------------------------------------------------------------------

# Install standards files
install_standards() {
    if [[ "$DRY_RUN" != "true" ]]; then
        print_status "Installing standards"
    fi

    local standards_count=0

    while read file; do
        if [[ "$file" == standards/* ]]; then
            local source=$(get_profile_file "$EFFECTIVE_PROFILE" "$file" "$BASE_DIR")
            local dest="$PROJECT_DIR/boundless-os/$file"

            if [[ -f "$source" ]]; then
                local installed_file=$(copy_file "$source" "$dest")
                if [[ -n "$installed_file" ]]; then
                    INSTALLED_FILES+=("$installed_file")
                    ((standards_count++)) || true
                fi
            fi
        fi
    done < <(get_profile_files "$EFFECTIVE_PROFILE" "$BASE_DIR" "standards")

    if [[ "$DRY_RUN" != "true" ]]; then
        if [[ $standards_count -gt 0 ]]; then
            echo "✓ Installed $standards_count standards in boundless-os/standards"
        fi
    fi
}

# Install and compile single-agent mode commands
# Install Claude Code commands with delegation (multi-agent files)
install_claude_code_commands_with_delegation() {
    if [[ "$DRY_RUN" != "true" ]]; then
        print_status "Installing Claude Code commands (with delegation to subagents)..."
    fi

    local commands_count=0
    local target_dir="$PROJECT_DIR/.claude/commands"

    mkdir -p "$target_dir"

    while read file; do
        # Process multi-agent command files OR orchestrate-tasks special case
        if [[ "$file" == commands/*/multi-agent/* ]] || [[ "$file" == commands/orchestrate-tasks/orchestrate-tasks.md ]]; then
            local source=$(get_profile_file "$EFFECTIVE_PROFILE" "$file" "$BASE_DIR")
            if [[ -f "$source" ]]; then
                # Extract command name from path (e.g., commands/create-spec/multi-agent/create-spec.md -> create-spec)
                local cmd_name=$(echo "$file" | cut -d'/' -f2)
                local dest="$target_dir/${cmd_name}.md"

                # Compile with workflow and standards injection (includes conditional compilation)
                local compiled=$(compile_command "$source" "$dest" "$BASE_DIR" "$EFFECTIVE_PROFILE")
                if [[ "$DRY_RUN" == "true" ]]; then
                    INSTALLED_FILES+=("$dest")
                fi
                ((commands_count++)) || true
            fi
        fi
    done < <(get_profile_files "$EFFECTIVE_PROFILE" "$BASE_DIR" "commands")

    if [[ "$DRY_RUN" != "true" ]]; then
        if [[ $commands_count -gt 0 ]]; then
            echo "✓ Installed $commands_count Claude Code commands (with delegation)"
        fi
    fi
}

# Install Claude Code commands without delegation (single-agent files with injection)
install_claude_code_commands_without_delegation() {
    if [[ "$DRY_RUN" != "true" ]]; then
        print_status "Installing Claude Code commands (without delegation)..."
    fi

    local commands_count=0

    while read file; do
        # Process single-agent command files OR orchestrate-tasks special case
        if [[ "$file" == commands/*/single-agent/* ]] || [[ "$file" == commands/orchestrate-tasks/orchestrate-tasks.md ]]; then
            local source=$(get_profile_file "$EFFECTIVE_PROFILE" "$file" "$BASE_DIR")
            if [[ -f "$source" ]]; then
                # Handle orchestrate-tasks specially (flat destination)
                if [[ "$file" == commands/orchestrate-tasks/orchestrate-tasks.md ]]; then
                    local dest="$PROJECT_DIR/.claude/commands/orchestrate-tasks.md"
                    # Compile without PHASE embedding for orchestrate-tasks
                    local compiled=$(compile_command "$source" "$dest" "$BASE_DIR" "$EFFECTIVE_PROFILE" "")
                    if [[ "$DRY_RUN" == "true" ]]; then
                        INSTALLED_FILES+=("$dest")
                    fi
                    ((commands_count++)) || true
                else
                    # Only install non-numbered files (e.g., plan-product.md, not 1-product-concept.md)
                    local filename=$(basename "$file")
                    if [[ ! "$filename" =~ ^[0-9]+-.*\.md$ ]]; then
                        # Extract command name (e.g., commands/plan-product/single-agent/plan-product.md -> plan-product.md)
                        local cmd_name=$(echo "$file" | sed 's|commands/\([^/]*\)/single-agent/.*|\1|')
                        local dest="$PROJECT_DIR/.claude/commands/$cmd_name.md"

                        # Compile with PHASE embedding (mode="embed")
                        local compiled=$(compile_command "$source" "$dest" "$BASE_DIR" "$EFFECTIVE_PROFILE" "embed")
                        if [[ "$DRY_RUN" == "true" ]]; then
                            INSTALLED_FILES+=("$dest")
                        fi
                        ((commands_count++)) || true
                    fi
                fi
            fi
        fi
    done < <(get_profile_files "$EFFECTIVE_PROFILE" "$BASE_DIR" "commands")

    if [[ "$DRY_RUN" != "true" ]]; then
        if [[ $commands_count -gt 0 ]]; then
            echo "✓ Installed $commands_count Claude Code commands (without delegation)"
        fi
    fi
}

# Install Claude Code static agents
install_claude_code_agents() {
    if [[ "$DRY_RUN" != "true" ]]; then
        print_status "Installing Claude Code agents..."
    fi

    local agents_count=0
    local target_dir="$PROJECT_DIR/.claude/agents"

    mkdir -p "$target_dir"

    while read file; do
        # Include all agent files (flatten structure - no subfolders in output)
        if [[ "$file" == agents/*.md ]] && [[ "$file" != agents/templates/* ]]; then
            local source=$(get_profile_file "$EFFECTIVE_PROFILE" "$file" "$BASE_DIR")
            if [[ -f "$source" ]]; then
                # Get just the filename (flatten directory structure)
                local filename=$(basename "$file")
                local dest="$target_dir/$filename"
                
                # Compile with workflow and standards injection
                local compiled=$(compile_agent "$source" "$dest" "$BASE_DIR" "$EFFECTIVE_PROFILE" "")
                if [[ "$DRY_RUN" == "true" ]]; then
                    INSTALLED_FILES+=("$dest")
                fi
                ((agents_count++)) || true
            fi
        fi
    done < <(get_profile_files "$EFFECTIVE_PROFILE" "$BASE_DIR" "agents")

    if [[ "$DRY_RUN" != "true" ]]; then
        if [[ $agents_count -gt 0 ]]; then
            echo "✓ Installed $agents_count Claude Code agents"
        fi
    fi
}

# Install boundless-os commands (single-agent files with injection)
install_boundless_os_commands() {
    if [[ "$DRY_RUN" != "true" ]]; then
        print_status "Installing boundless-os commands..."
    fi

    local commands_count=0

    while read file; do
        # Process single-agent command files OR orchestrate-tasks special case
        if [[ "$file" == commands/*/single-agent/* ]] || [[ "$file" == commands/orchestrate-tasks/orchestrate-tasks.md ]]; then
            local source=$(get_profile_file "$EFFECTIVE_PROFILE" "$file" "$BASE_DIR")
            if [[ -f "$source" ]]; then
                # Handle orchestrate-tasks specially (preserve folder structure)
                if [[ "$file" == commands/orchestrate-tasks/orchestrate-tasks.md ]]; then
                    local dest="$PROJECT_DIR/boundless-os/commands/orchestrate-tasks/orchestrate-tasks.md"
                else
                    # Extract command name and preserve numbering
                    local cmd_path=$(echo "$file" | sed 's|commands/\([^/]*\)/single-agent/\(.*\)|\1/\2|')
                    local dest="$PROJECT_DIR/boundless-os/commands/$cmd_path"
                fi

                # Compile with workflow and standards injection and PHASE embedding
                local compiled=$(compile_command "$source" "$dest" "$BASE_DIR" "$EFFECTIVE_PROFILE" "embed")
                if [[ "$DRY_RUN" == "true" ]]; then
                    INSTALLED_FILES+=("$dest")
                fi
                ((commands_count++)) || true
            fi
        fi
    done < <(get_profile_files "$EFFECTIVE_PROFILE" "$BASE_DIR" "commands")

    if [[ "$DRY_RUN" != "true" ]]; then
        if [[ $commands_count -gt 0 ]]; then
            echo "✓ Installed $commands_count boundless-os commands"
        fi
    fi
}

# Add or update claude.md banner to prioritize Boundless OS
update_claude_md_banner() {
    local banner_header="<!-- Boundless OS priority banner -->"
    local banner_content="# Using Claude in this repo\n\nBoundless OS is the source of truth.\n\n- Run workflows via .claude/commands/boundless-os/*.md (plan-product, shape-spec, write-spec, create-tasks, implement-tasks, orchestrate-tasks).\n- Read standards in boundless-os/standards/* (or Claude Skills if enabled).\n- Don’t free-prompt; always start from the corresponding Boundless OS command.\n\nIf anything here conflicts with Boundless OS, follow Boundless OS.\n"

    # Detect an existing claude.md file (case variations)
    local candidate=""
    if [[ -f "$PROJECT_DIR/claude.md" ]]; then
        candidate="$PROJECT_DIR/claude.md"
    elif [[ -f "$PROJECT_DIR/CLAUDE.md" ]]; then
        candidate="$PROJECT_DIR/CLAUDE.md"
    elif [[ -f "$PROJECT_DIR/Claude.md" ]]; then
        candidate="$PROJECT_DIR/Claude.md"
    else
        candidate="$PROJECT_DIR/claude.md"
    fi

    # If the banner already exists, do nothing
    if [[ -f "$candidate" ]] && grep -qi "$banner_header" "$candidate"; then
        return 0
    fi

    if [[ "$DRY_RUN" == "true" ]]; then
        # Track the file that would be created/modified
        INSTALLED_FILES+=("$candidate")
        return 0
    fi

    # Prepend the banner if file exists, otherwise create the file
    if [[ -f "$candidate" ]]; then
        local tmp_file=$(mktemp)
        {
            echo "$banner_header"
            echo ""
            echo "$banner_content"
            echo ""
            cat "$candidate"
        } > "$tmp_file"
        mv "$tmp_file" "$candidate"
    else
        {
            echo "$banner_header"
            echo ""
            echo "$banner_content"
        } > "$candidate"
    fi

    print_status "Updated $(basename "$candidate") with Boundless OS priority banner"
}

# Check for required MCP tools and write setup guidance
check_mcp_tools() {
    if [[ "$DRY_RUN" != "true" ]]; then
        print_status "Checking MCP tools (Playwright, Context7, Figma Make)"
    fi

    local playwright_status="missing"
    local context7_status="missing"
    local figmamake_status="missing"

    # Heuristic checks (best-effort)
    if command -v playwright >/dev/null 2>&1; then
        playwright_status="cli-installed"
    fi
    if [[ -d "$PROJECT_DIR/.claude" ]] && grep -Riq "playwright" "$PROJECT_DIR/.claude" 2>/dev/null; then
        playwright_status="configured"
    fi

    if [[ -d "$PROJECT_DIR/.claude" ]] && grep -Riq "context7" "$PROJECT_DIR/.claude" 2>/dev/null; then
        context7_status="configured"
    fi

    if [[ -d "$PROJECT_DIR/.claude" ]] && grep -Riq "figma" "$PROJECT_DIR/.claude" 2>/dev/null && grep -Riq "make" "$PROJECT_DIR/.claude" 2>/dev/null; then
        figmamake_status="configured"
    fi

    # Build SETUP-MCP content
    local setup_content="# MCP Tooling Setup\n\nThis project recommends the following Claude MCP servers:\n\n- Playwright MCP (visual/UI testing)\n- Context7 MCP (documentation lookup)\n- Figma Make MCP (design automation)\n\n## Current status (best-effort detection)\n- Playwright MCP: ${playwright_status}\n- Context7 MCP: ${context7_status}\n- Figma Make MCP: ${figmamake_status}\n\n## Actions\n- If any are \"missing\" or not working in Claude, enable these MCP servers in your Claude settings, then restart Claude and run the /improve-skills command.\n- Prefer CLI-first logins where applicable.\n\n## Verify\n- In Claude, confirm the MCP servers are listed and responsive.\n- Run Playwright commands and docs lookups via the corresponding Boundless OS commands.\n\n"

    local dest="$PROJECT_DIR/boundless-os/SETUP-MCP.md"
    if [[ "$DRY_RUN" == "true" ]]; then
        INSTALLED_FILES+=("$dest")
    else
        write_file "$setup_content" "$dest" >/dev/null
        print_status "Wrote boundless-os/SETUP-MCP.md with MCP setup guidance"
    fi
}

# Create boundless-os folder structure
create_boundless_os_folder() {
    if [[ "$DRY_RUN" != "true" ]]; then
        print_status "Installing boundless-os folder"
    fi

    # Create the main boundless-os folder
    ensure_dir "$PROJECT_DIR/boundless-os"

    # Create the configuration file
    local config_file=$(write_project_config "$EFFECTIVE_VERSION" "$EFFECTIVE_PROFILE" \
        "$EFFECTIVE_CLAUDE_CODE_COMMANDS" "$EFFECTIVE_USE_CLAUDE_CODE_SUBAGENTS" \
        "$EFFECTIVE_AGENT_OS_COMMANDS" "$EFFECTIVE_STANDARDS_AS_CLAUDE_CODE_SKILLS")
    if [[ "$DRY_RUN" == "true" && -n "$config_file" ]]; then
        INSTALLED_FILES+=("$config_file")
    fi

    if [[ "$DRY_RUN" != "true" ]]; then
        echo "✓ Created boundless-os folder"
        echo "✓ Created boundless-os project configuration"
    fi
}

# Perform fresh installation
perform_installation() {
    # Show dry run warning at the top if applicable
    if [[ "$DRY_RUN" == "true" ]]; then
        print_warning "DRY RUN - No files will be actually created"
        echo ""
    fi

    # Display configuration at the top
    echo ""
    print_status "Configuration:"
    echo -e "  Profile: ${YELLOW}$EFFECTIVE_PROFILE${NC}"
    echo -e "  Claude Code commands: ${YELLOW}$EFFECTIVE_CLAUDE_CODE_COMMANDS${NC}"
    echo -e "  Use Claude Code subagents: ${YELLOW}$EFFECTIVE_USE_CLAUDE_CODE_SUBAGENTS${NC}"
    echo -e "  Standards as Claude Code Skills: ${YELLOW}$EFFECTIVE_STANDARDS_AS_CLAUDE_CODE_SKILLS${NC}"
    echo -e "  Boundless OS commands: ${YELLOW}$EFFECTIVE_AGENT_OS_COMMANDS${NC}"
    echo ""

    # In dry run mode, just collect files silently
    if [[ "$DRY_RUN" == "true" ]]; then
        # Collect files without output
        create_boundless_os_folder
        install_standards

        # Install Claude Code files if enabled
        if [[ "$EFFECTIVE_CLAUDE_CODE_COMMANDS" == "true" ]]; then
            if [[ "$EFFECTIVE_USE_CLAUDE_CODE_SUBAGENTS" == "true" ]]; then
                install_claude_code_commands_with_delegation
                install_claude_code_agents
            else
                install_claude_code_commands_without_delegation
            fi
            install_claude_code_skills
            install_improve_skills_command
        fi

        # Install boundless-os commands if enabled
        if [[ "$EFFECTIVE_AGENT_OS_COMMANDS" == "true" ]]; then
            install_boundless_os_commands
        fi

        echo ""
        print_status "The following files would be created:"
        for file in "${INSTALLED_FILES[@]}"; do
            # Make paths relative to project root
            local relative_path="${file#$PROJECT_DIR/}"
            echo "  - $relative_path"
        done
    else
        # Normal installation with output
        create_boundless_os_folder
        echo ""

        install_standards
        echo ""

        # Install Claude Code files if enabled
        if [[ "$EFFECTIVE_CLAUDE_CODE_COMMANDS" == "true" ]]; then
            if [[ "$EFFECTIVE_USE_CLAUDE_CODE_SUBAGENTS" == "true" ]]; then
                install_claude_code_commands_with_delegation
                echo ""
                install_claude_code_agents
                echo ""
            else
                install_claude_code_commands_without_delegation
                echo ""
            fi
            install_claude_code_skills
            install_improve_skills_command
            echo ""
        fi

        # Install boundless-os commands if enabled
        if [[ "$EFFECTIVE_AGENT_OS_COMMANDS" == "true" ]]; then
            install_boundless_os_commands
            echo ""
        fi

        # Ensure claude.md (if present or created) points to Boundless OS workflows
        update_claude_md_banner

        # Check MCP tools and write setup guidance
        check_mcp_tools
    fi

    if [[ "$DRY_RUN" == "true" ]]; then
        echo ""
        read -p "Proceed with actual installation? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            DRY_RUN="false"
            INSTALLED_FILES=()
            perform_installation
        fi
    else
        # Enhanced success message with comprehensive guidance
        echo ""
        echo -e "${BOLD}${GREEN}"
        echo "════════════════════════════════════════════════════════════════════"
        echo ""
        echo "           ✓ Boundless OS Installed Successfully! 🎉"
        echo ""
        echo "════════════════════════════════════════════════════════════════════"
        echo -e "${NC}"
        echo ""

        echo -e "${BOLD}📍 Installation Summary:${NC}"
        echo ""
        echo -e "  ${GREEN}✓${NC} Profile: ${BOLD}$EFFECTIVE_PROFILE${NC}"

        # Profile-specific description
        if [[ "$EFFECTIVE_PROFILE" == "ryan" ]]; then
            echo -e "    ${CYAN}Optimized for non-technical founders with:${NC}"
            echo -e "    • Plain language communication (no jargon)"
            echo -e "    • S-tier design standards (Stripe/Notion quality)"
            echo -e "    • Visual testing with Playwright"
            echo -e "    • Security & code reviews automatic"
            echo ""
        fi

        # Show what was installed
        if [[ "$EFFECTIVE_CLAUDE_CODE_COMMANDS" == "true" ]]; then
            echo -e "  ${GREEN}✓${NC} Commands: ${BOLD}.claude/commands/${NC}"
            if [[ "$EFFECTIVE_USE_CLAUDE_CODE_SUBAGENTS" == "true" ]]; then
                echo -e "    ${CYAN}Multi-agent mode (commands delegate to specialized agents)${NC}"
                echo -e "  ${GREEN}✓${NC} Agents: ${BOLD}.claude/agents/${NC}"
                echo -e "    ${CYAN}8 specialized agents for structured workflows${NC}"
            else
                echo -e "    ${CYAN}Single-agent mode (all work done by main agent)${NC}"
            fi
            echo ""
        fi

        if [[ "$EFFECTIVE_AGENT_OS_COMMANDS" == "true" ]]; then
            echo -e "  ${GREEN}✓${NC} Commands: ${BOLD}boundless-os/commands/${NC}"
            echo -e "    ${CYAN}Tool-agnostic commands (Cursor, Windsurf, etc.)${NC}"
            echo ""
        fi

        echo -e "  ${GREEN}✓${NC} Standards: ${BOLD}boundless-os/standards/${NC}"
        if [[ "$EFFECTIVE_STANDARDS_AS_CLAUDE_CODE_SKILLS" == "true" ]]; then
            echo -e "    ${CYAN}Using Claude Code Skills for better discovery${NC}"
        else
            echo -e "    ${CYAN}Referenced directly by commands${NC}"
        fi
        echo ""

        echo -e "${BOLD}🚀 What's Next?${NC}"
        echo ""

        # Detect project state and suggest next action
        if [ -f "boundless-os/product/mission.md" ]; then
            echo -e "  ${CYAN}Your product is already planned!${NC}"
            echo ""
            echo -e "  ${BOLD}Next: Plan a new feature${NC}"
            if [[ "$EFFECTIVE_CLAUDE_CODE_COMMANDS" == "true" ]]; then
                echo -e "  ${YELLOW}→ /shape-spec <feature-name>${NC}"
            else
                echo -e "  ${YELLOW}→ Tell your AI: \"Let's shape a new spec for [feature-name]\"${NC}"
            fi
        else
            echo -e "  ${CYAN}Let's plan your product! This takes about 15-30 minutes.${NC}"
            echo -e "  ${CYAN}We'll create your mission, roadmap, and tech stack.${NC}"
            echo ""
            if [[ "$EFFECTIVE_CLAUDE_CODE_COMMANDS" == "true" ]]; then
                echo -e "  ${BOLD}1. Open Claude Code in this directory:${NC}"
                echo -e "     ${YELLOW}claude-code${NC}"
                echo ""
                echo -e "  ${BOLD}2. Run your first command:${NC}"
                echo -e "     ${YELLOW}/plan-product${NC}"
                echo ""
                echo -e "  ${CYAN}This will guide you through planning your product.${NC}"
            else
                echo -e "  ${BOLD}1. Open your AI coding tool in this directory${NC}"
                echo ""
                echo -e "  ${BOLD}2. Tell your AI agent:${NC}"
                echo -e "     ${YELLOW}\"Let's plan my product using Boundless OS\"${NC}"
                echo ""
                echo -e "  ${CYAN}Your AI will use boundless-os/commands/ to guide you.${NC}"
            fi
        fi

        echo ""
        echo -e "${BOLD}📖 Resources:${NC}"
        echo ""
        echo -e "  • Quickstart guide:    ${CYAN}$BASE_DIR/QUICKSTART.md${NC}"
        echo -e "  • Workflow explained:  ${CYAN}$BASE_DIR/WORKFLOW.md${NC}"
        echo -e "  • Example projects:    ${CYAN}$BASE_DIR/examples/${NC}"

        if [[ "$EFFECTIVE_PROFILE" == "ryan" ]]; then
            echo -e "  • Your profile guide:  ${CYAN}$BASE_DIR/profiles/ryan/README.md${NC}"
        fi

        echo -e "  • Full documentation:  ${CYAN}https://github.com/buildermethods/boundless-os${NC}"
        echo -e "  • Official website:    ${CYAN}https://buildermethods.com/boundless-os${NC}"
        echo ""

        echo -e "${BOLD}💡 The Boundless OS Workflow (6 Phases):${NC}"
        echo ""
        echo -e "   ${YELLOW}1.${NC} Plan Product   ${YELLOW}→${NC}  ${YELLOW}2.${NC} Shape Spec    ${YELLOW}→${NC}  ${YELLOW}3.${NC} Write Spec"
        echo -e "   ${YELLOW}4.${NC} Create Tasks   ${YELLOW}→${NC}  ${YELLOW}5.${NC} Implement     ${YELLOW}→${NC}  ${YELLOW}6.${NC} Verify"
        echo ""
        echo -e "   ${CYAN}Each phase builds on the previous one, guiding you from${NC}"
        echo -e "   ${CYAN}idea to working code through structured workflows.${NC}"
        echo ""

        # MCP tools reminder
        if [[ "$EFFECTIVE_CLAUDE_CODE_COMMANDS" == "true" ]]; then
            echo -e "${BOLD}🔧 Optional: Enhance with MCP Tools${NC}"
            echo ""
            echo -e "  For the best experience, install these Claude MCP servers:"
            echo -e "  • ${CYAN}Playwright MCP${NC} - Visual/UI testing"
            echo -e "  • ${CYAN}Context7 MCP${NC} - Documentation lookup"
            echo -e "  • ${CYAN}Figma Make MCP${NC} - Design automation"
            echo ""
            echo -e "  See ${CYAN}boundless-os/SETUP-MCP.md${NC} for setup instructions"
            echo ""
        fi

        echo -e "${GREEN}Ready to build something amazing! 🚀${NC}"
        echo ""
    fi
}

# Handle re-installation
handle_reinstallation() {
    print_section "Re-installation"

    print_warning "This will DELETE your current boundless-os/ folder and reinstall from scratch."
    echo ""

    # Check for Claude Code files
    if [[ -d "$PROJECT_DIR/.claude/agents/boundless-os" ]] || [[ -d "$PROJECT_DIR/.claude/commands/boundless-os" ]]; then
        print_warning "This will also DELETE:"
        [[ -d "$PROJECT_DIR/.claude/agents/boundless-os" ]] && echo "  - .claude/agents/boundless-os/"
        [[ -d "$PROJECT_DIR/.claude/commands/boundless-os" ]] && echo "  - .claude/commands/boundless-os/"
        echo ""
    fi

    read -p "Are you sure you want to proceed? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Re-installation cancelled"
        exit 0
    fi

    if [[ "$DRY_RUN" != "true" ]]; then
        print_status "Removing existing installation..."
        rm -rf "$PROJECT_DIR/boundless-os"
        rm -rf "$PROJECT_DIR/.claude/agents/boundless-os"
        rm -rf "$PROJECT_DIR/.claude/commands/boundless-os"
        echo "✓ Existing installation removed"
        echo ""
    fi

    perform_installation
}

# -----------------------------------------------------------------------------
# Main Execution
# -----------------------------------------------------------------------------

main() {
    print_section "Boundless OS Project Installation"

    # Parse command line arguments
    parse_arguments "$@"

    # Check if we're trying to install in the base installation directory
    check_not_base_installation

    # Validate base installation using common function
    validate_base_installation

    # Load configuration
    load_configuration

    # Check if Boundless OS is already installed
    if is_boundless_os_installed "$PROJECT_DIR"; then
        if [[ "$RE_INSTALL" == "true" ]]; then
            handle_reinstallation
        else
            # Delegate to update script
            print_status "Boundless OS is already installed. Running update..."
            exec "$BASE_DIR/scripts/project-update.sh" "$@"
        fi
    else
        # Fresh installation
        perform_installation
    fi
}

# Run main function
main "$@"
