#!/bin/bash
# oh-my-droid install script
# Multi-agent orchestration plugin for Factory AI Droid CLI

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FACTORY_DIR="${HOME}/.factory"

echo "oh-my-droid install starting..."
echo ""

# Create directories
mkdir -p "${FACTORY_DIR}/droids"
mkdir -p "${FACTORY_DIR}/commands"
mkdir -p "${FACTORY_DIR}/plugins/oh-my-droid"

# Install droids (32)
echo "Installing droids... (32)"
cp -r "${SCRIPT_DIR}/templates/droids/"*.md "${FACTORY_DIR}/droids/"
echo "   Installed to ${FACTORY_DIR}/droids/"

# Install commands (8)
echo "Installing commands... (8)"
cp -r "${SCRIPT_DIR}/templates/commands/"*.md "${FACTORY_DIR}/commands/"
echo "   Installed to ${FACTORY_DIR}/commands/"

# Copy plugin files (skip if source and destination are the same directory)
echo "Copying plugin files..."
PLUGIN_DIR="${FACTORY_DIR}/plugins/oh-my-droid"
RESOLVED_SCRIPT_DIR="$(cd "$SCRIPT_DIR" && pwd -P)"
RESOLVED_PLUGIN_DIR=""
if [ -d "$PLUGIN_DIR" ]; then
    RESOLVED_PLUGIN_DIR="$(cd "$PLUGIN_DIR" && pwd -P)"
fi

if [ "$RESOLVED_SCRIPT_DIR" = "$RESOLVED_PLUGIN_DIR" ]; then
    echo "   Already running from plugin directory, skipping copy."
else
    cp -r "${SCRIPT_DIR}/scripts" "${PLUGIN_DIR}/"
    cp -r "${SCRIPT_DIR}/hooks" "${PLUGIN_DIR}/"
    cp -r "${SCRIPT_DIR}/skills" "${PLUGIN_DIR}/"
    cp "${SCRIPT_DIR}/package.json" "${PLUGIN_DIR}/"
    echo "   Installed to ${PLUGIN_DIR}"
fi

# Check settings.json
SETTINGS_FILE="${FACTORY_DIR}/settings.json"
if [ -f "$SETTINGS_FILE" ]; then
    if grep -q '"hooks"' "$SETTINGS_FILE"; then
        echo ""
        echo "   ${SETTINGS_FILE} already has hooks configured."
        echo "   Please verify manually."
    fi
fi

echo ""
echo "To enable hooks, add the following to settings.json:"
echo ""

cat << 'HOOKS_CONFIG'
  "hooks": {
    "UserPromptSubmit": [{ "hooks": [{ "type": "command", "command": "node ~/.factory/plugins/oh-my-droid/scripts/keyword-detector.mjs", "timeout": 5 }] }],
    "SessionStart": [{ "hooks": [{ "type": "command", "command": "node ~/.factory/plugins/oh-my-droid/scripts/session-start.mjs", "timeout": 5 }] }],
    "Stop": [{ "hooks": [{ "type": "command", "command": "node ~/.factory/plugins/oh-my-droid/scripts/persistent-mode.mjs", "timeout": 5 }] }]
  }
HOOKS_CONFIG

echo ""
echo "oh-my-droid install complete!"
echo ""
echo "Installed:"
echo "   - 32 custom droids (~/.factory/droids/)"
echo "   - 8 slash commands (~/.factory/commands/)"
echo "   - Hook scripts (~/.factory/plugins/oh-my-droid/)"
echo ""
echo "Usage:"
echo "   droid                    # Start new session"
echo "   ulw <task>               # Ultrawork mode"
echo "   /analyze <target>        # Analyze command"
echo ""
