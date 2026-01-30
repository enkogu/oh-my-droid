# oh-my-droid Windows install script
# Multi-agent orchestration plugin for Factory AI Droid CLI

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$FactoryDir = Join-Path $env:USERPROFILE ".factory"

Write-Host "oh-my-droid install starting..." -ForegroundColor Cyan
Write-Host ""

# Create directories
$dirs = @(
    (Join-Path $FactoryDir "droids"),
    (Join-Path $FactoryDir "commands"),
    (Join-Path $FactoryDir "plugins\oh-my-droid")
)

foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

# Install droids (32)
Write-Host "Installing droids... (32)" -ForegroundColor Yellow
$droidsSource = Join-Path $ScriptDir "templates\droids\*.md"
$droidsTarget = Join-Path $FactoryDir "droids"
Copy-Item -Path $droidsSource -Destination $droidsTarget -Force
Write-Host ("   Installed to " + $droidsTarget) -ForegroundColor Green

# Install commands (8)
Write-Host "Installing commands... (8)" -ForegroundColor Yellow
$commandsSource = Join-Path $ScriptDir "templates\commands\*.md"
$commandsTarget = Join-Path $FactoryDir "commands"
Copy-Item -Path $commandsSource -Destination $commandsTarget -Force
Write-Host ("   Installed to " + $commandsTarget) -ForegroundColor Green

# Copy plugin files (skip if source and destination are the same directory)
Write-Host "Copying plugin files..." -ForegroundColor Yellow
$pluginDir = Join-Path $FactoryDir "plugins\oh-my-droid"
$resolvedScriptDir = (Resolve-Path $ScriptDir).Path.TrimEnd('\')
$resolvedPluginDir = if (Test-Path $pluginDir) { (Resolve-Path $pluginDir).Path.TrimEnd('\') } else { "" }

if ($resolvedScriptDir -eq $resolvedPluginDir) {
    Write-Host "   Already running from plugin directory, skipping copy." -ForegroundColor Gray
} else {
    Copy-Item -Path (Join-Path $ScriptDir "scripts") -Destination $pluginDir -Recurse -Force
    Copy-Item -Path (Join-Path $ScriptDir "hooks") -Destination $pluginDir -Recurse -Force
    Copy-Item -Path (Join-Path $ScriptDir "skills") -Destination $pluginDir -Recurse -Force
    Copy-Item -Path (Join-Path $ScriptDir "package.json") -Destination $pluginDir -Force
    Write-Host ("   Installed to " + $pluginDir) -ForegroundColor Green
}

# Check settings.json
$settingsFile = Join-Path $FactoryDir "settings.json"
if (Test-Path $settingsFile) {
    $content = Get-Content $settingsFile -Raw
    if ($content -match '"hooks"') {
        Write-Host ""
        Write-Host ("   " + $settingsFile + " already has hooks configured.") -ForegroundColor Yellow
        Write-Host "   Please verify manually."
    }
}

Write-Host ""
Write-Host "To enable hooks, add the following to settings.json:" -ForegroundColor Cyan
Write-Host ""

$hooksJson = @'
  "hooks": {
    "UserPromptSubmit": [{ "hooks": [{ "type": "command", "command": "node ~/.factory/plugins/oh-my-droid/scripts/keyword-detector.mjs", "timeout": 5 }] }],
    "SessionStart": [{ "hooks": [{ "type": "command", "command": "node ~/.factory/plugins/oh-my-droid/scripts/session-start.mjs", "timeout": 5 }] }],
    "Stop": [{ "hooks": [{ "type": "command", "command": "node ~/.factory/plugins/oh-my-droid/scripts/persistent-mode.mjs", "timeout": 5 }] }]
  }
'@
Write-Host $hooksJson -ForegroundColor Gray

Write-Host ""
Write-Host "oh-my-droid install complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Installed:" -ForegroundColor Cyan
Write-Host "   - 32 custom droids (~/.factory/droids/)"
Write-Host "   - 8 slash commands (~/.factory/commands/)"
Write-Host "   - Hook scripts (~/.factory/plugins/oh-my-droid/)"
Write-Host ""
Write-Host "Usage:" -ForegroundColor Cyan
Write-Host "   droid                    # Start new session"
Write-Host "   ulw <task>               # Ultrawork mode"
Write-Host "   /analyze <target>        # Analyze command"
Write-Host ""
