---
name: omd-setup
description: Setup and configure oh-my-droid (the ONLY command you need to learn)
---

# OMD Setup

This is the **only command you need to learn**. After running this, everything else is automatic.

## Usage Modes

This skill handles three scenarios:

1. **Initial Setup (no flags)**: First-time installation wizard
2. **Local Configuration (`--local`)**: Configure project-specific settings (.factory/FACTORY.md)
3. **Global Configuration (`--global`)**: Configure global settings (~/.factory/FACTORY.md)

## Mode Detection

Check for flags in the user's invocation:
- If `--local` flag present → Skip to Local Configuration (Step 2A)
- If `--global` flag present → Skip to Global Configuration (Step 2B)
- If no flags → Run Initial Setup wizard (Step 1)

## Step 1: Initial Setup Wizard (Default Behavior)

Use the AskUserQuestion tool to prompt the user:

**Question:** "Where should I configure oh-my-droid?"

**Options:**
1. **Local (this project)** - Creates `.factory/FACTORY.md` in current project directory. Best for project-specific configurations.
2. **Global (all projects)** - Creates `~/.factory/FACTORY.md` for all Factory Droid sessions. Best for consistent behavior everywhere.

## Step 2A: Local Configuration (--local flag or user chose LOCAL)

### Create Local .factory Directory

```bash
# Create .factory directory in current project
mkdir -p .factory && echo ".factory directory ready"
```

### Copy FACTORY.md from Plugin

Copy FACTORY.md from the oh-my-droid plugin installation:

```bash
# Find the plugin's docs/FACTORY.md
PLUGIN_DIR=""

# Check common plugin locations
if [ -d "$HOME/.factory/plugins/oh-my-droid" ]; then
  PLUGIN_DIR="$HOME/.factory/plugins/oh-my-droid"
elif [ -d "$FACTORY_PLUGIN_ROOT" ]; then
  PLUGIN_DIR="$FACTORY_PLUGIN_ROOT"
fi

# Copy FACTORY.md
if [ -n "$PLUGIN_DIR" ] && [ -f "$PLUGIN_DIR/docs/FACTORY.md" ]; then
  cp "$PLUGIN_DIR/docs/FACTORY.md" .factory/FACTORY.md
  echo "Copied FACTORY.md to .factory/FACTORY.md"
else
  echo "Warning: Could not find plugin FACTORY.md. Creating minimal config..."
  echo "# oh-my-droid Configuration" > .factory/FACTORY.md
  echo "" >> .factory/FACTORY.md
  echo "Run /omd-help for usage instructions." >> .factory/FACTORY.md
fi
```

### Verify Plugin Installation

```bash
grep -q "oh-my-droid" ~/.factory/settings.json 2>/dev/null && echo "Plugin verified" || echo "Plugin NOT found - install via Factory plugin manager"
```

### Confirm Local Configuration Success

After completing local configuration, report:

**OMD Project Configuration Complete**
- FACTORY.md: Installed at ./.factory/FACTORY.md
- Scope: **PROJECT** - applies only to this project
- Hooks: Provided by plugin (no manual installation needed)
- Agents: 25+ available
- Model routing: Haiku/Sonnet/Opus based on task complexity

**Note**: This configuration is project-specific and won't affect other projects or global settings.

If `--local` flag was used, **STOP HERE**. Do not continue to HUD setup or other steps.

## Step 2B: Global Configuration (--global flag or user chose GLOBAL)

### Copy FACTORY.md from Plugin

```bash
# Find the plugin's docs/FACTORY.md
PLUGIN_DIR=""

# Check common plugin locations
if [ -d "$HOME/.factory/plugins/oh-my-droid" ]; then
  PLUGIN_DIR="$HOME/.factory/plugins/oh-my-droid"
elif [ -d "$FACTORY_PLUGIN_ROOT" ]; then
  PLUGIN_DIR="$FACTORY_PLUGIN_ROOT"
fi

# Copy FACTORY.md to global config
if [ -n "$PLUGIN_DIR" ] && [ -f "$PLUGIN_DIR/docs/FACTORY.md" ]; then
  cp "$PLUGIN_DIR/docs/FACTORY.md" ~/.factory/FACTORY.md
  echo "Copied FACTORY.md to ~/.factory/FACTORY.md"
else
  echo "Warning: Could not find plugin FACTORY.md. Creating minimal config..."
  echo "# oh-my-droid Configuration" > ~/.factory/FACTORY.md
  echo "" >> ~/.factory/FACTORY.md
  echo "Run /omd-help for usage instructions." >> ~/.factory/FACTORY.md
fi
```

### Clean Up Legacy Hooks (if present)

Check if old manual hooks exist and remove them to prevent duplicates:

```bash
# Remove legacy bash hook scripts (now handled by plugin system)
rm -f ~/.factory/hooks/keyword-detector.sh
rm -f ~/.factory/hooks/stop-continuation.sh
rm -f ~/.factory/hooks/persistent-mode.sh
rm -f ~/.factory/hooks/session-start.sh
echo "Legacy hooks cleaned"
```

### Verify Plugin Installation

```bash
grep -q "oh-my-droid" ~/.factory/settings.json 2>/dev/null && echo "Plugin verified" || echo "Plugin NOT found - install via Factory plugin manager"
```

### Confirm Global Configuration Success

After completing global configuration, report:

**OMD Global Configuration Complete**
- FACTORY.md: Installed at ~/.factory/FACTORY.md
- Scope: **GLOBAL** - applies to all Factory Droid sessions
- Hooks: Provided by plugin (no manual installation needed)
- Agents: 25+ available
- Model routing: Haiku/Sonnet/Opus based on task complexity

**Note**: Hooks are now managed by the plugin system automatically. No manual hook installation required.

If `--global` flag was used, **STOP HERE**. Do not continue to HUD setup or other steps.

## Step 3: Setup HUD Statusline

The HUD shows real-time status in Factory Droid's status bar. **Invoke the hud skill** to set up and configure:

Use the Skill tool to invoke: `omd-hud` with args: `setup`

This will:
1. Install the HUD wrapper script to `~/.factory/hud/omd-hud.mjs`
2. Configure `statusLine` in `~/.factory/settings.json`
3. Report status and prompt to restart if needed

## Step 4: Set Default Execution Mode

Use the AskUserQuestion tool to prompt the user:

**Question:** "Which parallel execution mode should be your default when you say 'fast' or 'parallel'?"

**Options:**
1. **ultrawork (maximum capability)** - Uses all agent tiers including Opus for complex tasks. Best for challenging work where quality matters most. (Recommended)
2. **ecomode (token efficient)** - Prefers Haiku/Sonnet agents, avoids Opus. Best for pro-plan users who want cost efficiency.

Store the preference in `~/.factory/.omd-config.json`:

```bash
# Read existing config or create empty object
CONFIG_FILE="$HOME/.factory/.omd-config.json"
mkdir -p "$(dirname "$CONFIG_FILE")"

if [ -f "$CONFIG_FILE" ]; then
  EXISTING=$(cat "$CONFIG_FILE")
else
  EXISTING='{}'
fi

# Set defaultExecutionMode (replace USER_CHOICE with "ultrawork" or "ecomode")
echo "$EXISTING" | jq --arg mode "USER_CHOICE" '. + {defaultExecutionMode: $mode, configuredAt: (now | todate)}' > "$CONFIG_FILE"
echo "Default execution mode set to: USER_CHOICE"
```

**Note**: This preference ONLY affects generic keywords ("fast", "parallel"). Explicit keywords ("ulw", "eco") always override this preference.

## Step 5: Show Welcome Message

```
OMD Setup Complete!

You don't need to learn any commands. I now have intelligent behaviors that activate automatically.

WHAT HAPPENS AUTOMATICALLY:
- Complex tasks -> I parallelize and delegate to specialized agents
- "plan this" -> I start a planning interview
- "don't stop until done" -> I persist until verified complete
- "stop" or "cancel" -> I intelligently stop current operation

MAGIC KEYWORDS (optional power-user shortcuts):
Just include these words naturally in your request:

| Keyword | Effect | Example |
|---------|--------|---------|
| ralph | Persistence mode | "ralph: fix the bug" |
| ralplan | Iterative planning | "ralplan this feature" |
| ulw | Max parallelism | "ulw fix all errors" |
| eco | Token-efficient mode | "eco fix lint errors" |
| plan | Planning interview | "plan the new feature" |

Combine them: "ralph ulw: implement authentication"

HUD STATUSLINE:
The status bar now shows OMD state. Restart Factory Droid to see it.

AVAILABLE AGENTS:
- architect: System design and debugging (Opus)
- executor: Focused implementation (Sonnet)
- explore: Fast pattern matching (Haiku)
- designer: UI/UX specialist (Sonnet)
- planner: Strategic planning (Opus)
- And 20+ more specialized agents

That's it! Just use Factory Droid normally.
```

## Help Text

When user runs `/omd-setup --help` or just `--help`, display:

```
OMD Setup - Configure oh-my-droid

USAGE:
  /omd-setup           Run initial setup wizard
  /omd-setup --local   Configure local project (.factory/FACTORY.md)
  /omd-setup --global  Configure global settings (~/.factory/FACTORY.md)
  /omd-setup --help    Show this help

MODES:
  Initial Setup (no flags)
    - Interactive wizard for first-time setup
    - Configures FACTORY.md (local or global)
    - Sets up HUD statusline
    - Sets default execution mode

  Local Configuration (--local)
    - Copies FACTORY.md to ./.factory/
    - Project-specific settings
    - Use this to update project config after OMD upgrades

  Global Configuration (--global)
    - Copies FACTORY.md to ~/.factory/
    - Applies to all Factory Droid sessions
    - Cleans up legacy hooks
    - Use this to update global config after OMD upgrades

EXAMPLES:
  /omd-setup           # First time setup
  /omd-setup --local   # Update this project
  /omd-setup --global  # Update all projects
```
