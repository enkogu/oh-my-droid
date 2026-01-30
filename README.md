# Oh My Droid

Multi-agent orchestration plugin for Factory AI Droid CLI.

> **Based on [oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode)** by Yeachan Heo - This project is a port of the oh-my-claudecode plugin, adapted for Factory AI's Droid CLI platform. All core architecture, agent definitions, skills, and orchestration patterns are derived from oh-my-claudecode.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Features](#features)
- [Custom Droids](#custom-droids-32)
- [Skills](#skills-35)
- [Project Structure](#project-structure)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Credits](#credits)
- [License](#license)

---

## Overview

Oh My Droid transforms Factory AI Droid CLI into an intelligent orchestration conductor with 32 specialized droids and 35+ skills for autonomous execution, parallel workflows, and intelligent task management.

**What you get:**
- Full autonomous execution from idea to working code
- Persistent task completion until verified done
- Parallel execution with multiple specialized droids
- Strategic planning with multi-agent consensus
- Built-in QA, security, and code review workflows
- Token-efficient operation modes

---

## Installation

### Method 1 (Recommended): Via Droid Marketplace

```bash
# Add the marketplace repository
droid plugin marketplace add MeroZemory/oh-my-droid

# Install the plugin
droid plugin install oh-my-droid@oh-my-droid
```

### Method 2: Automated Install Scripts

**macOS/Linux:**
```bash
# Clone the repository
git clone https://github.com/MeroZemory/oh-my-droid.git
cd oh-my-droid

# Run install script
./install.sh
```

**Windows (PowerShell):**
```powershell
# Clone the repository
git clone https://github.com/MeroZemory/oh-my-droid.git
cd oh-my-droid

# Run install script
.\install.ps1
```

### Method 3: Clone and Use Locally

```bash
# Clone the repository
git clone https://github.com/MeroZemory/oh-my-droid.git
cd oh-my-droid

# The hooks are automatically configured via .factory/settings.json
# Just start droid in this directory
droid
```

---

## Quick Start

Once installed, use magic keywords to activate special modes:

```bash
# Start droid
droid

# Ultrawork mode - maximum parallelism
ulw fix all the bugs

# Autopilot mode - autonomous execution
autopilot build a REST API

# Ralph mode - persistent until complete
ralph refactor the auth module

# Eco mode - token-efficient operation
eco analyze this file
```

### Magic Keywords

| Keyword | Mode | Description |
|---------|------|-------------|
| `ulw`, `ultrawork` | Ultrawork | Maximum parallel execution with multiple droids |
| `autopilot` | Autopilot | Full autonomous execution from idea to code |
| `ralph` | Ralph-loop | Persistent mode - won't stop until verified complete |
| `eco`, `ecomode` | Eco Mode | Token-efficient operation using lower-tier droids |
| `ultrapilot` | Ultrapilot | Parallel autopilot (3-5x faster) |
| `swarm` | Swarm | N coordinated droids with task claiming |
| `pipeline` | Pipeline | Sequential droid chaining |
| `plan` | Planning | Strategic planning interview |
| `search`, `find` | Search Mode | Enhanced codebase exploration |
| `analyze`, `debug` | Analysis Mode | Deep investigation with architect consultation |

---

## Features

### Autopilot: The Default Experience

Autopilot provides fully autonomous execution from high-level idea to working, tested code.

**When you say:**
- "autopilot build a REST API"
- "build me a React dashboard"
- "I want a CLI tool"

**Autopilot handles:**
- Automatic planning and requirements gathering
- Parallel execution with specialized droids
- Continuous verification and testing
- Self-correction until completion
- No manual intervention required

### Ralph-Loop: Persistence Until Done

Ralph mode ensures tasks complete fully with verified evidence.

**Features:**
- Continuous execution until all criteria met
- Mandatory architect verification
- Fresh evidence required (no assumptions)
- Auto-includes ultrawork parallelism

### Ultrawork: Maximum Parallelism

Execute independent tasks in parallel with multiple droids.

**Use for:**
- Multi-file changes
- Fixing multiple errors
- Implementing multiple features
- Large-scale refactoring

### Eco Mode: Token-Efficient Operation

Same parallel behavior as ultrawork but routes to lower-tier models for cost savings.

**Features:**
- Haiku/Sonnet droids instead of Opus
- Smart model routing per task complexity
- Budget-conscious execution

### Ultrapilot: Parallel Autopilot

Parallel autopilot with up to 5 concurrent workers for 3-5x faster execution.

**Best for:**
- Multi-component systems
- Fullstack applications
- Large refactoring projects

### Planning Modes

| Mode | Purpose | Agents |
|------|---------|--------|
| `plan` | Interactive planning interview | Planner (Opus) |
| `ralplan` | Iterative planning consensus | Planner + Architect + Critic |
| `review` | Review existing plan | Critic (Opus) |

### Built-in Workflows

| Workflow | Droids | Purpose |
|----------|--------|---------|
| `ultraqa` | QA-Tester + Build-Fixer | Test/fix cycling |
| `code-review` | Code-Reviewer (Opus) | Comprehensive review |
| `security-review` | Security-Reviewer (Opus) | Security audit |
| `tdd` | TDD-Guide + Executor | Test-driven development |
| `research` | Scientist (parallel) | Data analysis |

---

## Custom Droids (32)

Oh My Droid provides 32 specialized droids organized by family and tier.

### Droid Tiers

| Tier | Model | When to Use |
|------|-------|-------------|
| LOW | Haiku | Simple lookups, quick operations |
| MEDIUM | Sonnet | Standard work, feature implementation |
| HIGH | Opus | Complex reasoning, architecture, deep debugging |

### Droid Families

| Family | LOW | MEDIUM | HIGH | Purpose |
|--------|-----|--------|------|---------|
| **Analysis** | `architect-low` | `architect-medium` | `architect` | Strategic advice, debugging, investigation |
| **Execution** | `executor-low` | `executor` | `executor-high` | Code implementation, refactoring |
| **Search** | `explore` | `explore-medium` | `explore-high` | Codebase navigation, pattern finding |
| **Frontend** | `designer-low` | `designer` | `designer-high` | UI/UX development, component design |
| **Data Science** | `scientist-low` | `scientist` | `scientist-high` | Data analysis, ML, statistics |
| **QA & Testing** | `tdd-guide-low` | `qa-tester` / `tdd-guide` | `qa-tester-high` | Testing workflows, TDD |
| **Security** | `security-reviewer-low` | - | `security-reviewer` | Security audits, vulnerability scans |
| **Build** | `build-fixer-low` | `build-fixer` | - | Build error resolution |
| **Code Review** | `code-reviewer-low` | - | `code-reviewer` | Code quality review |
| **Research** | `researcher-low` | `researcher` | - | Documentation research |
| **Planning** | - | - | `planner` | Strategic planning |
| **Critique** | - | - | `critic` | Plan review |
| **Pre-Planning** | - | - | `analyst` | Requirements analysis |
| **Docs** | `writer` | - | - | Technical writing |
| **Vision** | - | `vision` | - | Image/diagram analysis |

### Droid Selection Guide

| Task Type | Best Droid | Tier |
|-----------|------------|------|
| Quick code lookup | `explore` | LOW |
| Find files/patterns | `explore` or `explore-medium` | LOW/MEDIUM |
| Complex architectural search | `explore-high` | HIGH |
| Simple code change | `executor-low` | LOW |
| Feature implementation | `executor` | MEDIUM |
| Complex refactoring | `executor-high` | HIGH |
| Debug simple issue | `architect-low` | LOW |
| Debug complex issue | `architect` | HIGH |
| UI component | `designer` | MEDIUM |
| Complex UI system | `designer-high` | HIGH |
| Write docs/comments | `writer` | LOW |
| Research docs/APIs | `researcher` | MEDIUM |
| Analyze images/diagrams | `vision` | MEDIUM |
| Strategic planning | `planner` | HIGH |
| Review/critique plan | `critic` | HIGH |
| Pre-planning analysis | `analyst` | HIGH |
| Test CLI interactively | `qa-tester` | MEDIUM |
| Security review | `security-reviewer` | HIGH |
| Quick security scan | `security-reviewer-low` | LOW |
| Fix build errors | `build-fixer` | MEDIUM |
| Simple build fix | `build-fixer-low` | LOW |
| TDD workflow | `tdd-guide` | MEDIUM |
| Quick test suggestions | `tdd-guide-low` | LOW |
| Code review | `code-reviewer` | HIGH |
| Quick code check | `code-reviewer-low` | LOW |
| Data analysis/stats | `scientist` | MEDIUM |
| Quick data inspection | `scientist-low` | LOW |
| Complex ML/hypothesis | `scientist-high` | HIGH |

---

## Skills (35+)

All skills use the `oh-my-droid:` prefix when invoking manually.

### Core Orchestration Skills

| Skill | Purpose | Auto-Trigger |
|-------|---------|--------------|
| `autopilot` | Full autonomous execution | "autopilot", "build me", "I want a" |
| `ralph` | Persistence until verified complete | "don't stop", "must complete", "ralph" |
| `ultrawork` | Maximum parallel execution | "ulw", "ultrawork" |
| `ultrapilot` | Parallel autopilot (3-5x faster) | "ultrapilot", "parallel build" |
| `ecomode` | Token-efficient parallel execution | "eco", "efficient", "budget" |
| `swarm` | N coordinated droids with task claiming | "swarm N droids" |
| `pipeline` | Sequential droid chaining | "pipeline", "chain" |
| `cancel` | Unified cancellation | "cancelomd", "stopomd" |

### Planning Skills

| Skill | Purpose | Auto-Trigger |
|-------|---------|--------------|
| `plan` | Planning session with interview | "plan this", "plan the" |
| `ralplan` | Iterative planning consensus | "ralplan" keyword |
| `review` | Review plan with Critic | "review plan" |
| `analyze` | Deep analysis/investigation | "analyze", "debug", "why" |

### Search and Analysis Skills

| Skill | Purpose | Auto-Trigger |
|-------|---------|--------------|
| `deepsearch` | Thorough codebase search | "search", "find", "where" |
| `deepinit` | Generate AGENTS.md hierarchy | "index codebase" |

### Quality Assurance Skills

| Skill | Purpose | Manual Command |
|-------|---------|----------------|
| `ultraqa` | QA cycling: test/fix/repeat | `/oh-my-droid:ultraqa` |
| `code-review` | Comprehensive code review | `/oh-my-droid:code-review` |
| `security-review` | Security vulnerability scan | `/oh-my-droid:security-review` |
| `tdd` | TDD enforcement | `/oh-my-droid:tdd` |
| `build-fix` | Fix build errors | `/oh-my-droid:build-fix` |

### Contextual Skills (Auto-Activate)

| Skill | Purpose | Context |
|-------|---------|---------|
| `frontend-ui-ux` | Design sensibility | UI/component work |
| `git-master` | Git expertise, atomic commits | Git/commit context |

### Utility Skills

| Skill | Purpose | Manual Command |
|-------|---------|----------------|
| `learner` | Extract reusable skill | `/oh-my-droid:learner` |
| `note` | Save to notepad | `/oh-my-droid:note` |
| `hud` | Configure HUD statusline | `/oh-my-droid:hud` |
| `doctor` | Diagnose installation | `/oh-my-droid:doctor` |
| `help` | Show usage guide | `/oh-my-droid:help` |
| `omd-setup` | Setup wizard | `/oh-my-droid:omd-setup` |
| `ralph-init` | Initialize PRD | `/oh-my-droid:ralph-init` |
| `release` | Automated release workflow | `/oh-my-droid:release` |
| `research` | Parallel scientist orchestration | `/oh-my-droid:research` |
| `mcp-setup` | Configure MCP servers | `/oh-my-droid:mcp-setup` |

---

## Project Structure

```
oh-my-droid/
├── .factory/
│   └── settings.json          # Project-local hooks configuration
├── scripts/                   # Hook implementation scripts
│   ├── keyword-detector.mjs   # Magic keyword detection
│   ├── session-start.mjs      # Session initialization
│   ├── persistent-mode.mjs    # Ralph-loop enforcement
│   └── ...
├── templates/
│   ├── droids/                # 32 custom droid definitions
│   │   ├── architect.json
│   │   ├── executor.json
│   │   ├── designer.json
│   │   └── ...
│   └── commands/              # 8 slash commands
│       ├── analyze.json
│       ├── build-fix.json
│       └── ...
├── droids/                    # Original droid definitions
├── skills/                    # 35+ skill definitions
│   ├── autopilot.ts
│   ├── ralph.ts
│   ├── ultrawork.ts
│   └── ...
├── hooks/
│   └── hooks.json             # Plugin hooks configuration
├── src/                       # TypeScript source
│   ├── agents/
│   ├── skills/
│   └── lib/
├── dist/                      # Compiled JavaScript
├── package.json
└── tsconfig.json
```

---

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Watch mode (auto-rebuild on changes)
npm run watch

# Run tests
npm test

# Lint code
npm run lint

# Type check
npm run type-check
```

### Building from Source

```bash
# Clone the repository
git clone https://github.com/MeroZemory/oh-my-droid.git
cd oh-my-droid

# Install dependencies
npm install

# Build
npm run build

# The plugin is now ready to use
droid
```

---

## Troubleshooting

### Hooks Not Executing

**Symptoms:**
- Magic keywords don't trigger modes
- Session start messages not showing
- Ralph-loop not activating

**Solutions:**

1. Verify configuration exists:
```bash
# Check project-local config
cat .factory/settings.json

# Or global config
cat ~/.factory/settings.json
```

2. Check script permissions (macOS/Linux):
```bash
chmod +x scripts/*.mjs
```

3. Run droid with debug mode:
```bash
droid --debug
```

4. Reinstall hooks:
```bash
# Run install script again
./install.sh   # or .\install.ps1 on Windows
```

### Ultrawork State Persisting

**Symptoms:**
- Ultrawork keeps running after cancellation
- State files not clearing

**Solution:**

Clear state files manually:
```bash
# Project-local state
rm -f .omd/ultrawork-state.json
rm -f .omd/state/ultrawork-state.json

# Global state
rm -f ~/.factory/omd/ultrawork-state.json
rm -f ~/.factory/omd/state/ultrawork-state.json
```

Or use the unified cancel command:
```bash
# Say in droid conversation:
cancelomd --force
```

### Scripts Not Found

**Symptoms:**
- Error: "Cannot find module"
- Hooks fail silently

**Solutions:**

1. Ensure running droid from project directory:
```bash
cd /path/to/oh-my-droid
droid
```

2. For global install, verify absolute paths in `~/.factory/settings.json`:
```json
{
  "hooks": {
    "UserPromptSubmit": [{
      "hooks": [{
        "type": "command",
        "command": "node /absolute/path/to/oh-my-droid/scripts/keyword-detector.mjs"
      }]
    }]
  }
}
```

### Droids Not Available

**Symptoms:**
- Custom droids not showing in droid list
- "Unknown droid" errors

**Solutions:**

1. Verify templates are installed:
```bash
ls -la templates/droids/
ls -la templates/commands/
```

2. Check Factory plugin directory:
```bash
ls -la ~/.factory/plugins/oh-my-droid/
```

3. Reinstall the plugin:
```bash
droid plugin uninstall oh-my-droid
droid plugin install oh-my-droid@oh-my-droid
```

### Performance Issues

**Symptoms:**
- Slow execution
- High token usage

**Solutions:**

1. Use eco mode for cost efficiency:
```bash
eco fix errors
```

2. Use appropriate droid tiers:
- LOW (haiku) for simple tasks
- MEDIUM (sonnet) for standard work
- HIGH (opus) only for complex reasoning

3. Limit parallelism:
```bash
# Instead of ultrawork for 1-2 tasks, use direct delegation
# Ultrawork is best for 3+ independent tasks
```

---

## Credits

This project is based on **[oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode)** by **Yeachan Heo**, the multi-agent orchestration plugin for Claude Code CLI. Oh My Droid adapts the same architecture and patterns for the Factory AI Droid platform.

### Key Adaptations from oh-my-claudecode

| oh-my-claudecode | oh-my-droid |
|------------------|-------------|
| Claude Code CLI | Factory AI Droid CLI |
| Agents | Custom Droids |
| `.omc/` state directory | `.omd/` state directory |
| `~/.claude/` global config | `~/.factory/` global config |
| `oh-my-claudecode:` prefix | `oh-my-droid:` prefix |

### Attribution

All core concepts, agent definitions, skills, and orchestration patterns are derived from oh-my-claudecode. This project serves as a bridge to bring the same powerful multi-agent capabilities to the Factory AI ecosystem.

**Original Author:** Yeachan Heo
**Original Project:** https://github.com/Yeachan-Heo/oh-my-claudecode
**Factory Droid Port:** Jio Kim

---

## License

MIT License

Copyright (c) 2025 Jio Kim
Based on oh-my-claudecode - Copyright (c) 2025 Yeachan Heo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

See [LICENSE](./LICENSE) for full text.
