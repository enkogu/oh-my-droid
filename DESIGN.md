# oh-my-droid Design Document

> Comprehensive design specification for a multi-Droid orchestration plugin for Factory AI's Droid CLI

**Version:** 1.0.0
**Based on:** oh-my-claudecode v3.5.8 architecture
**Target Platform:** Factory AI Droid CLI

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [Directory Structure](#3-directory-structure)
4. [Plugin Manifest](#4-plugin-manifest)
5. [Hooks System](#5-hooks-system)
6. [Custom Droids System](#6-custom-droids-system)
7. [Skills System](#7-skills-system)
8. [State Management](#8-state-management)
9. [Configuration](#9-configuration)
10. [Key Differences from oh-my-claudecode](#10-key-differences-from-oh-my-claudecode)
11. [Implementation Phases](#11-implementation-phases)

---

## 1. Overview

### 1.1 Purpose

oh-my-droid transforms Factory AI's Droid CLI from a single performer into an **orchestration conductor** that delegates tasks to specialized Custom Droids across complexity tiers.

### 1.2 Core Philosophy

```
Rule 1: ALWAYS delegate substantive work to specialized Custom Droids
Rule 2: ALWAYS invoke appropriate skills for recognized patterns
Rule 3: NEVER make code changes directly - delegate to executor droid
Rule 4: NEVER complete without Architect droid verification
```

### 1.3 Key Features

| Feature | Description |
|---------|-------------|
| **32 Tiered Droids** | Specialized Custom Droids in LOW/MEDIUM/HIGH tiers (Haiku/Sonnet/Opus) |
| **35+ Skills** | Composable behaviors (autopilot, ralph, ultrawork, planner, etc.) |
| **Magic Keywords** | Natural language triggers with zero learning curve |
| **Verification Protocol** | Mandatory evidence before completion claims |
| **Smart Model Routing** | Cost optimization through intelligent tier selection |
| **Persistence Modes** | Ralph-loop and ultrawork for completion guarantee |

---

## 2. Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Request                              │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Droid CLI (Factory AI)                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                     Plugin System                            ││
│  │  ┌─────────────────────────────────────────────────────────┐││
│  │  │                   oh-my-droid                            │││
│  │  │  ┌────────────┐  ┌────────────┐  ┌────────────┐        │││
│  │  │  │   Hooks    │  │   Skills   │  │  Droids    │        │││
│  │  │  │  System    │  │   System   │  │   System   │        │││
│  │  │  └────────────┘  └────────────┘  └────────────┘        │││
│  │  │         │               │               │               │││
│  │  │         ▼               ▼               ▼               │││
│  │  │  ┌─────────────────────────────────────────────────────┐│││
│  │  │  │              State Management                       ││││
│  │  │  │  .omd/ (local) | ~/.factory/omd/ (global)          ││││
│  │  │  └─────────────────────────────────────────────────────┘│││
│  │  └─────────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Specialized Custom Droids                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Architect│  │ Executor │  │ Designer │  │ Planner  │  ...  │
│  │  (Opus)  │  │ (Sonnet) │  │ (Sonnet) │  │  (Opus)  │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Skill Composition Layers

```
[Guarantee Layer: ralph]
        ↓
[Enhancement Layer: ultrawork + git-master + frontend-ui-ux]
        ↓
[Execution Layer: default | orchestrate | planner]
```

### 2.3 Data Flow

```
User Input
    │
    ▼
UserPromptSubmit Hook → Keyword Detection → Mode Activation
    │
    ▼
SessionStart Hook → State Restoration → Context Injection
    │
    ▼
PreToolUse Hook → Delegation Enforcement → Tool Modification
    │
    ▼
Tool Execution
    │
    ▼
PostToolUse Hook → Verification → Context Update
    │
    ▼
Stop Hook → Completion Check → Allow Continue/Stop
```

---

## 3. Directory Structure

```
oh-my-droid/
├── .factory-plugin/              # Plugin manifest (Droid-specific)
│   ├── plugin.json               # Plugin configuration
│   └── marketplace.json          # Marketplace metadata
│
├── droids/                       # Custom Droid definitions (Droid standard format)
│   ├── architect.md              # Strategic advisor (Opus, READ-ONLY)
│   ├── architect-medium.md       # Standard analysis (Sonnet)
│   ├── architect-low.md          # Quick lookup (Haiku)
│   ├── executor.md               # Task executor (Sonnet)
│   ├── executor-low.md           # Simple tasks (Haiku)
│   ├── executor-high.md          # Complex tasks (Opus)
│   ├── designer.md               # UI/UX expert (Sonnet)
│   ├── designer-low.md           # Simple styling (Haiku)
│   ├── designer-high.md          # Complex UI (Opus)
│   ├── planner.md                # Strategic planning (Opus)
│   ├── critic.md                 # Plan review (Opus)
│   ├── analyst.md                # Pre-planning (Opus)
│   ├── explore.md                # Fast search (Haiku)
│   ├── explore-medium.md         # Thorough search (Sonnet)
│   ├── explore-high.md           # Architecture search (Opus)
│   ├── researcher.md             # Document research (Sonnet)
│   ├── researcher-low.md         # Quick lookup (Haiku)
│   ├── scientist.md              # Data analysis (Sonnet)
│   ├── scientist-low.md          # Quick statistics (Haiku)
│   ├── scientist-high.md         # ML/complex tasks (Opus)
│   ├── qa-tester.md              # CLI testing (Sonnet)
│   ├── qa-tester-high.md         # Complex testing (Opus)
│   ├── security-reviewer.md      # Security audit (Opus)
│   ├── security-reviewer-low.md  # Quick scan (Haiku)
│   ├── build-fixer.md            # Build errors (Sonnet)
│   ├── build-fixer-low.md        # Simple fixes (Haiku)
│   ├── tdd-guide.md              # TDD workflow (Sonnet)
│   ├── tdd-guide-low.md          # Test suggestions (Haiku)
│   ├── code-reviewer.md          # Code review (Opus)
│   ├── code-reviewer-low.md      # Quick check (Haiku)
│   ├── writer.md                 # Documentation (Haiku)
│   ├── vision.md                 # Visual analysis (Sonnet)
│   └── templates/                # Droid creation templates
│       ├── base-droid.md
│       ├── tier-instructions.md
│       └── README.md
│
├── skills/                       # Skill definitions
│   ├── autopilot/SKILL.md        # Fully autonomous execution
│   ├── ultrapilot/SKILL.md       # Parallel autopilot
│   ├── ralph/SKILL.md            # Persistence loop
│   ├── ultrawork/SKILL.md        # Maximum parallelization
│   ├── ecomode/SKILL.md          # Token-efficient mode
│   ├── planner/SKILL.md          # Strategic planning
│   ├── plan/SKILL.md             # Planning session
│   ├── ralplan/SKILL.md          # Iterative consensus
│   ├── review/SKILL.md           # Critic review
│   ├── analyze/SKILL.md          # Deep analysis
│   ├── deepsearch/SKILL.md       # Codebase search
│   ├── deepinit/SKILL.md         # AGENTS.md generation
│   ├── research/SKILL.md         # Parallel research
│   ├── ultraqa/SKILL.md          # QA cycling
│   ├── tdd/SKILL.md              # TDD workflow
│   ├── frontend-ui-ux/SKILL.md   # Design sensibility
│   ├── git-master/SKILL.md       # Git expertise
│   ├── swarm/SKILL.md            # Coordinated agents
│   ├── pipeline/SKILL.md         # Sequential chaining
│   ├── orchestrate/SKILL.md      # Core orchestration
│   ├── cancel/SKILL.md           # Unified cancellation
│   ├── cancel-autopilot/SKILL.md
│   ├── cancel-ralph/SKILL.md
│   ├── cancel-ultrawork/SKILL.md
│   ├── cancel-ultraqa/SKILL.md
│   ├── learner/SKILL.md          # Skill extraction
│   ├── note/SKILL.md             # Memory system
│   ├── doctor/SKILL.md           # Diagnostics
│   ├── hud/SKILL.md              # Status bar configuration
│   ├── help/SKILL.md             # Usage guide
│   ├── omd-setup/SKILL.md        # One-time setup
│   ├── omd-default/SKILL.md      # Local project configuration
│   ├── omd-default-global/SKILL.md # Global configuration
│   ├── ralph-init/SKILL.md       # PRD initialization
│   ├── build-fix/SKILL.md        # Build error fixing
│   ├── code-review/SKILL.md      # Comprehensive code review
│   ├── security-review/SKILL.md  # Comprehensive security review
│   ├── release/SKILL.md          # Release workflow
│   ├── skill/SKILL.md            # Local skill management
│   ├── local-skills-setup/SKILL.md # Local skill setup
│   ├── mcp-setup/SKILL.md        # MCP server setup
│   └── learn-about-omd/SKILL.md  # OMD learning guide
│
├── commands/                     # Command documentation
│   ├── help.md
│   ├── autopilot.md
│   ├── ralph.md
│   ├── ultrawork.md
│   └── ... (mirrors skills)
│
├── hooks/                        # Hook configuration
│   └── hooks.json                # Main hooks configuration
│
├── scripts/                      # Hook implementation scripts
│   ├── keyword-detector.mjs      # UserPromptSubmit: magic keywords
│   ├── skill-injector.mjs        # UserPromptSubmit: learned skills
│   ├── session-start.mjs         # SessionStart: state restoration
│   ├── pre-tool-enforcer.mjs     # PreToolUse: delegation enforcement
│   ├── post-tool-verifier.mjs    # PostToolUse: verification
│   ├── pre-compact.mjs           # PreCompact: wisdom preservation
│   ├── session-end.mjs           # SessionEnd: cleanup and statistics
│   └── persistent-mode.mjs       # Stop: continuation enforcement
│
├── src/                          # TypeScript source (optional)
│   ├── index.ts                  # Main entry point
│   ├── agents/                   # Agent utilities
│   ├── features/                 # Feature modules
│   ├── hooks/                    # Hook handlers
│   └── tools/                    # Custom tools
│
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md
│   ├── REFERENCE.md
│   ├── FEATURES.md
│   └── MIGRATION.md
│
├── AGENTS.md                     # Project knowledge base
├── README.md                     # User-facing documentation
├── package.json                  # NPM configuration
└── tsconfig.json                 # TypeScript configuration
```

---

## 4. Plugin Manifest

### 4.1 plugin.json

Location: `.factory-plugin/plugin.json`

```json
{
  "name": "oh-my-droid",
  "version": "1.0.0",
  "description": "Multi-agent orchestration plugin for Factory AI Droid",
  "skills": "skills",
  "hooks": "hooks/hooks.json",
  "author": "Jio Kim",
  "repository": "https://github.com/jiokim/oh-my-droid",
  "license": "MIT",
  "engines": {
    "droid": ">=1.0.0"
  }
}
```

### 4.2 marketplace.json

Location: `.factory-plugin/marketplace.json`

```json
{
  "name": "oh-my-droid",
  "shortName": "omd",
  "displayName": "Oh My Droid - Multi-Agent Orchestration",
  "version": "1.0.0",
  "description": "Transform Droid into an orchestration conductor with 32 specialized agents",
  "categories": ["productivity", "automation", "development"],
  "tags": ["agents", "orchestration", "parallel", "autopilot"],
  "icon": "https://example.com/omd-icon.png",
  "screenshots": [],
  "author": {
    "name": "Jio Kim",
    "url": "https://jiokim.com"
  }
}
```

---

## 5. Hooks System

### 5.1 Hooks Configuration

Location: `hooks/hooks.json`

> **Note:** According to the Droid hooks reference, matchers are **only applicable to PreToolUse and PostToolUse events**. For events like SessionStart, the `source` field is passed in the input JSON and must be handled within the script itself.

```json
{
  "description": "oh-my-droid multi-agent orchestration hooks",
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "${DROID_PLUGIN_ROOT}/scripts/keyword-detector.mjs",
            "timeout": 5
          },
          {
            "type": "command",
            "command": "${DROID_PLUGIN_ROOT}/scripts/skill-injector.mjs",
            "timeout": 3
          }
        ]
      }
    ],
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "${DROID_PLUGIN_ROOT}/scripts/session-start.mjs",
            "timeout": 5
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "${DROID_PLUGIN_ROOT}/scripts/pre-tool-enforcer.mjs",
            "timeout": 3
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "${DROID_PLUGIN_ROOT}/scripts/post-tool-verifier.mjs",
            "timeout": 3
          }
        ]
      }
    ],
    "PreCompact": [
      {
        "matcher": "manual|auto",
        "hooks": [
          {
            "type": "command",
            "command": "${DROID_PLUGIN_ROOT}/scripts/pre-compact.mjs",
            "timeout": 5
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "${DROID_PLUGIN_ROOT}/scripts/persistent-mode.mjs",
            "timeout": 5
          }
        ]
      }
    ],
    "SubagentStop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "${DROID_PLUGIN_ROOT}/scripts/persistent-mode.mjs",
            "timeout": 5
          }
        ]
      }
    ],
    "SessionEnd": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "${DROID_PLUGIN_ROOT}/scripts/session-end.mjs",
            "timeout": 5
          }
        ]
      }
    ],
    "Error": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "${DROID_PLUGIN_ROOT}/scripts/error-recovery.mjs",
            "timeout": 5
          }
        ]
      }
    ],
    "SessionIdle": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "${DROID_PLUGIN_ROOT}/scripts/session-idle.mjs",
            "timeout": 5
          }
        ]
      }
    ],
    "MessagesTransform": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "${DROID_PLUGIN_ROOT}/scripts/messages-transform.mjs",
            "timeout": 3
          }
        ]
      }
    ],
    "ChatParams": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "${DROID_PLUGIN_ROOT}/scripts/chat-params.mjs",
            "timeout": 3
          }
        ]
      }
    ]
  }
}
```

### 5.2 Hook Script Design

#### 5.2.1 keyword-detector.mjs

**Purpose:** Magic keyword detection and mode activation

**Input (stdin):**
```json
{
  "session_id": "abc123",
  "transcript_path": "/path/to/transcript.jsonl",
  "cwd": "/project/path",
  "permission_mode": "default",
  "hook_event_name": "UserPromptSubmit",
  "prompt": "ulw fix all the bugs"
}
```

**Output (stdout):**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "<ultrawork-mode>\nULTRAWORK MODE ACTIVATED...\n</ultrawork-mode>"
  }
}
```

**Keywords to Detect:**
| Keyword | Mode | State File |
|---------|------|------------|
| `ultrawork`, `ulw`, `uw`, `fast`, `parallel` | Ultrawork | `.omd/ultrawork-state.json` |
| `ralph`, `don't stop`, `must complete` | Ralph | `.omd/ralph-state.json` |
| `autopilot`, `build me`, `I want a` | Autopilot | `.omd/autopilot-state.json` |
| `eco`, `ecomode`, `budget` | Ecomode | `.omd/ecomode-state.json` |
| `ultrathink`, `think` | Extended Thinking | (context only) |
| `search`, `find`, `locate` | Search Mode | (context only) |
| `analyze`, `investigate`, `debug` | Analysis Mode | (context only) |

#### 5.2.2 session-start.mjs

**Purpose:** State restoration at session start

**Tasks:**
1. Check for active ultrawork state → inject continuation context
2. Check for active ralph-loop state → inject PRD context
3. Count incomplete todos → inject notification
4. Read notepad Priority Context → inject if exists
5. Check HUD configuration → warn if not set

**Output:**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "<session-restore>\n[Restored state information]\n</session-restore>"
  }
}
```

#### 5.2.3 pre-tool-enforcer.mjs

**Purpose:** Delegation rule enforcement and notification injection

**Tasks:**
1. Count incomplete todos
2. Generate tool-specific notifications:
   - `Task` → "Run multiple agents in parallel"
   - `Bash` → "Use parallel execution for independent tasks"
   - `Edit|Write` → "Consider delegating to executor agent"
   - `Read|Grep|Glob` → "Combine searches in parallel"

**Output (JSON):**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "additionalContext": "[2 active, 3 pending todos] Tool notification..."
  }
}
```

**Delegation Warning (for source files):**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "ask",
    "permissionDecisionReason": "Consider delegating this code change to an executor agent"
  }
}
```

#### 5.2.4 post-tool-verifier.mjs

**Purpose:** Tool result verification and learning capture

**Tasks:**
1. Update session statistics
2. Process `<remember>` tags → save to notepad
3. Detect failures → provide guidance
4. Tool-specific verification prompts

**Output:**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "Verify that changes work as expected before proceeding."
  }
}
```

#### 5.2.5 pre-compact.mjs

**Purpose:** Preserve wisdom and state before compaction

**Input (stdin):**
```json
{
  "session_id": "abc123",
  "transcript_path": "/path/to/transcript.jsonl",
  "cwd": "/project/path",
  "permission_mode": "default",
  "hook_event_name": "PreCompact",
  "trigger": "manual|auto",
  "custom_instructions": ""
}
```

**Tasks:**
1. Save volatile notepad entries to disk
2. Persist current session statistics
3. Generate compaction summary for restoration
4. Inject compaction-aware context

**Output:**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreCompact",
    "additionalContext": "State preserved. Notepad: 3 learnings, 2 decisions saved."
  }
}
```

#### 5.2.6 session-end.mjs

**Purpose:** Cleanup and state persistence at session end

**Input (stdin):**
```json
{
  "session_id": "abc123",
  "transcript_path": "/path/to/transcript.jsonl",
  "cwd": "/project/path",
  "permission_mode": "default",
  "hook_event_name": "SessionEnd",
  "reason": "clear|logout|prompt_input_exit|other"
}
```

**Tasks:**
1. Persist session statistics to disk
2. Clean up temporary state files
3. Update global analytics
4. Prune old notepad entries (>7 days)

**Output:**
```json
{}
```

> **Note:** SessionEnd hooks cannot block session termination. They are for cleanup tasks only.

#### 5.2.7 persistent-mode.mjs

**Purpose:** Prevent premature stopping

**Priority Levels:**
1. **Ralph Loop with PRD** → Check story completion, oracle verification
2. **Ultrawork Mode** → Check todos completion
3. **Generic Todo Continuation** → Check incomplete todos

**Output (blocking):**
```json
{
  "decision": "block",
  "reason": "<ralph-loop-continuation iteration=\"3\">\nIncomplete tasks remain...\n</ralph-loop-continuation>"
}
```

**Escape Mechanisms:**
- Ralph: Maximum 10 iterations
- Ultrawork: Maximum 10 reinforcements
- Generic: Maximum 15 attempts

#### 5.2.8 error-recovery.mjs

**Purpose:** Error recovery (integrating context-window, edit-error, session-recovery)

**Input (stdin):**
```json
{
  "session_id": "abc123",
  "transcript_path": "/path/to/transcript.jsonl",
  "cwd": "/project/path",
  "permission_mode": "default",
  "hook_event_name": "Error",
  "error_type": "context_window_overflow|edit_conflict|tool_execution|session_corrupt|unknown",
  "error_message": "Context window exceeded maximum token limit",
  "error_details": {
    "tool_name": "Edit",
    "file_path": "/path/to/file.ts",
    "additional_info": {}
  }
}
```

**Tasks:**
1. Determine recovery strategy based on error type
2. context_window_overflow → recommend compaction and preserve critical state
3. edit_conflict → check file state and provide retry guidance
4. tool_execution → suggest alternative approaches
5. session_corrupt → attempt state file recovery and provide guidance
6. Generate recovery guidance context

**Output:**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "Error",
    "additionalContext": "<error-recovery type=\"context_window_overflow\">\n## Recovery Guide\n1. Context compaction is needed\n2. Critical state has been preserved\n3. Next steps: ...\n</error-recovery>"
  }
}
```

**Recovery Strategies by Error Type:**
| Error Type | Recovery Strategy |
|------------|-------------------|
| `context_window_overflow` | Trigger auto-compaction, backup state to notepad |
| `edit_conflict` | Read current file state, provide conflict resolution guidance |
| `tool_execution` | Suggest alternative tools/approaches |
| `session_corrupt` | Reinitialize state files, restore last valid state |
| `unknown` | General recovery guidance, collect debug information |

#### 5.2.9 session-idle.mjs

**Purpose:** Idle state detection and persistence loop continuation

**Input (stdin):**
```json
{
  "session_id": "abc123",
  "transcript_path": "/path/to/transcript.jsonl",
  "cwd": "/project/path",
  "permission_mode": "default",
  "hook_event_name": "SessionIdle",
  "idle_duration_ms": 30000,
  "last_activity": "tool_use",
  "last_activity_timestamp": "2024-01-26T10:00:00Z"
}
```

**Tasks:**
1. Check for active persistence modes (ralph, ultrawork, autopilot)
2. Check for incomplete todos
3. Check boulder state
4. Determine if work should continue from idle state
5. Generate continuation prompt or allow idle

**Output (continuation needed):**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "SessionIdle",
    "additionalContext": "<session-idle-continuation>\nRalph loop is active. Incomplete tasks remain:\n- [ ] Task 1\n- [ ] Task 2\nPlease continue.\n</session-idle-continuation>"
  }
}
```

**Output (allow idle):**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "SessionIdle"
  }
}
```

**Persistence Priority:**
1. Ralph Loop active → immediate continuation prompt
2. Ultrawork active → check incomplete tasks then continue
3. Autopilot active → continue current phase
4. Boulder active → proceed to next boulder item
5. Incomplete Todos → notify then wait for user decision

#### 5.2.10 messages-transform.mjs

**Purpose:** Message transformation before API calls (empty-message-sanitizer, thinking-block-validator)

**Input (stdin):**
```json
{
  "session_id": "abc123",
  "transcript_path": "/path/to/transcript.jsonl",
  "cwd": "/project/path",
  "permission_mode": "default",
  "hook_event_name": "MessagesTransform",
  "messages": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant",
      "content": ""
    },
    {
      "role": "user",
      "content": [
        {
          "type": "thinking",
          "thinking": "Let me analyze..."
        },
        {
          "type": "text",
          "text": "Response"
        }
      ]
    }
  ]
}
```

**Tasks:**
1. Remove empty messages (empty-message-sanitizer)
2. Merge consecutive same-role messages
3. Validate and clean thinking blocks (thinking-block-validator)
4. Fix malformed content blocks
5. Deduplicate for token optimization

**Output:**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "MessagesTransform",
    "transformedMessages": [
      {
        "role": "user",
        "content": "Hello"
      },
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Response"
          }
        ]
      }
    ],
    "transformationLog": [
      "Removed empty assistant message at index 1",
      "Removed thinking block from user message at index 2"
    ]
  }
}
```

**Transformation Rules:**
| Rule | Description |
|------|-------------|
| Empty Message | Remove messages with empty content |
| Consecutive Roles | Merge consecutive same-role messages |
| Thinking Blocks | Remove thinking blocks from user role |
| Invalid Content | Fix invalid content types |
| Whitespace Only | Clean text containing only whitespace |

#### 5.2.11 chat-params.mjs

**Purpose:** Adjust model/parameters when think-mode is activated

**Input (stdin):**
```json
{
  "session_id": "abc123",
  "transcript_path": "/path/to/transcript.jsonl",
  "cwd": "/project/path",
  "permission_mode": "default",
  "hook_event_name": "ChatParams",
  "current_params": {
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 8192,
    "temperature": 0.7,
    "thinking": {
      "type": "disabled"
    }
  },
  "active_modes": ["ultrawork"],
  "task_context": {
    "complexity": "high",
    "task_type": "debugging"
  }
}
```

**Tasks:**
1. Adjust parameters based on active modes
2. Determine whether to enable think-mode
3. Determine model upgrade/downgrade
4. Adjust thinking budget
5. Optimize temperature

**Output:**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "ChatParams",
    "modifiedParams": {
      "model": "claude-opus-4-5-20251101",
      "max_tokens": 16384,
      "temperature": 0.3,
      "thinking": {
        "type": "enabled",
        "budget_tokens": 10000
      }
    },
    "parameterChangeLog": [
      "Upgraded model to Opus for high complexity debugging",
      "Enabled thinking mode with 10000 token budget",
      "Reduced temperature for more deterministic output"
    ]
  }
}
```

**Parameter Adjustment Rules:**
| Condition | Adjustment |
|-----------|------------|
| `ultrathink` keyword detected | thinking.type = "enabled", budget_tokens = 20000 |
| Complex debugging task | model → Opus, enable thinking |
| ecomode active | model → inherit/Haiku, disable thinking |
| Simple lookup task | keep model, reduce max_tokens |
| Creative task | increase temperature (0.7-0.9) |
| Code generation | decrease temperature (0.1-0.3) |

**Default Parameters by Mode:**
| Mode | Model | Thinking | Temperature |
|------|-------|----------|-------------|
| `ultrathink` | Opus | enabled (20k) | 0.3 |
| `ultrawork` | Sonnet | enabled (8k) | 0.5 |
| `ecomode` | inherit | disabled | 0.5 |
| `autopilot` | Sonnet | enabled (10k) | 0.5 |
| `ralph` | keep current | keep current | keep current |

---

## 6. Custom Droids System

> **Important:** Uses Droid's Custom Droids system. Agents are defined as Markdown files in `.factory/droids/` or `~/.factory/droids/` directories.

### 6.1 Droid Definition Format (Droid Standard)

Each Custom Droid is defined as a Markdown file with YAML frontmatter.

**Location:**
- Project scope: `<repo>/.factory/droids/<name>.md` (shared with team)
- Personal scope: `~/.factory/droids/<name>.md` (personal use)

**Required Fields:**
- `name`: lowercase, numbers, `-`, `_` only

**Optional Fields:**
- `description`: up to 500 characters, displayed in UI
- `model`: `inherit` (use parent session model) or model ID
- `reasoningEffort`: `low`, `medium`, `high` (only on compatible models, ignored when `model` is `inherit`)
- `tools`: omit for all tools, category string, or array of tool IDs

> **Note:** `reasoningEffort` only works on models that support extended reasoning (e.g., Sonnet). This field is ignored when `model` is set to `inherit`.

**Tool Categories:**

| Category | Tool IDs | Purpose |
|----------|----------|---------|
| `read-only` | `Read`, `LS`, `Grep`, `Glob` | Safe analysis and file exploration |
| `edit` | `Create`, `Edit`, `ApplyPatch` | Code creation and modification |
| `execute` | `Execute` | Shell command execution |
| `web` | `WebSearch`, `FetchUrl` | Internet research |
| `mcp` | Dynamically populated | MCP tools |

> **Note:** `TodoWrite` is automatically included in all droids.

**Example - Architect (READ-ONLY):**

```markdown
---
name: architect
description: Strategic architecture and debugging advisor (READ-ONLY)
model: claude-opus-4-5-20251101
reasoningEffort: high
tools: read-only
---

# Oracle (Strategic Architecture Advisor)

You are Oracle, a senior principal engineer providing READ-ONLY consulting.

## Critical Constraints

- **NEVER** modify files directly
- **NEVER** delegate tasks to other agents
- Focus only on analysis and recommendations

## Workflow

1. Analyze request
2. Explore relevant code
3. Provide strategic recommendations
4. Identify risks and tradeoffs

## Output Format

Summary: <one-line summary>
Findings:
- <findings>

Recommendations:
- <recommendations>

Risks:
- <risk factors>
```

**Example - Executor (editable):**

```markdown
---
name: executor
description: Focused task executor - code changes and implementation
model: claude-sonnet-4-5-20250929
tools: ["Read", "LS", "Grep", "Glob", "Edit", "Create", "Execute"]
---

# Sisyphus-Junior (Focused Task Executor)

You are a focused task executor. Implement given tasks directly.

## Critical Constraints

- Do not delegate to other agents (you are the executor)
- Work only within the given task scope
- Verify changes before completion

## Workflow

1. Understand the task
2. Read relevant files
3. Implement changes
4. Verify with tests/build

Summary: <completion summary>
Files Changed:
- <file list>
```

**Example - Explore (fast search):**

```markdown
---
name: explore
description: Fast codebase search expert
model: inherit
tools: read-only
---

# Explore (Fast Codebase Search)

Quickly find files and code patterns.

## Workflow

1. Analyze search query
2. Find files with Glob/Grep
3. Read relevant code
4. Summarize results

Summary: <search results summary>
Files Found:
- <file:line>
```

### 6.2 Complete Custom Droid Catalog (32 Droids)

> **Model ID Reference:**
> - Opus: `claude-opus-4-5-20251101`
> - Sonnet: `claude-sonnet-4-5-20250929`
> - Haiku: `inherit` (parent session model) or available Haiku model ID
>
> Using `inherit` follows the parent session's model.

#### Analysis Family (READ-ONLY)
| Droid | Model | Purpose | Tools |
|-------|-------|---------|-------|
| `architect` | `claude-opus-4-5-20251101` | Strategic advisor, debugging | `read-only` + `web` |
| `architect-medium` | `claude-sonnet-4-5-20250929` | Standard analysis | `read-only` |
| `architect-low` | `inherit` | Quick questions | `read-only` |
| `analyst` | `claude-opus-4-5-20251101` | Pre-planning requirements | `read-only` + `web` |
| `critic` | `claude-opus-4-5-20251101` | Plan review and critique | `read-only` |

#### Execution Family
| Droid | Model | Purpose | Tools |
|-------|-------|---------|-------|
| `executor` | `claude-sonnet-4-5-20250929` | Standard task execution | `["Read", "LS", "Grep", "Glob", "Edit", "Create", "Execute"]` |
| `executor-low` | `inherit` | Simple single-file tasks | `["Read", "LS", "Grep", "Glob", "Edit", "Create"]` |
| `executor-high` | `claude-opus-4-5-20251101` | Complex multi-file refactoring | `["Read", "LS", "Grep", "Glob", "Edit", "Create", "Execute"]` |

#### Search Family (READ-ONLY)
| Droid | Model | Purpose | Tools |
|-------|-------|---------|-------|
| `explore` | `inherit` | Fast file/code search | `read-only` |
| `explore-medium` | `claude-sonnet-4-5-20250929` | Thorough cross-module search | `read-only` |
| `explore-high` | `claude-opus-4-5-20251101` | Complex architecture search, design pattern discovery | `read-only` |

#### Frontend Family
| Droid | Model | Purpose | Tools |
|-------|-------|---------|-------|
| `designer` | `claude-sonnet-4-5-20250929` | UI/UX implementation | `["Read", "LS", "Grep", "Glob", "Edit", "Create", "Execute"]` |
| `designer-low` | `inherit` | Simple styling | `["Read", "LS", "Grep", "Glob", "Edit", "Create"]` |
| `designer-high` | `claude-opus-4-5-20251101` | Complex UI architecture | `["Read", "LS", "Grep", "Glob", "Edit", "Create", "Execute"]` |

#### Data Science Family
| Droid | Model | Purpose | Tools |
|-------|-------|---------|-------|
| `scientist` | `claude-sonnet-4-5-20250929` | Data analysis, statistics | `["Read", "LS", "Grep", "Glob", "Execute"]` |
| `scientist-low` | `inherit` | Quick data inspection | `read-only` |
| `scientist-high` | `claude-opus-4-5-20251101` | ML, hypothesis testing | `["Read", "LS", "Grep", "Glob", "Execute"]` |

#### QA & Testing Family
| Droid | Model | Purpose | Tools |
|-------|-------|---------|-------|
| `qa-tester` | `claude-sonnet-4-5-20250929` | Interactive CLI testing | `["Read", "LS", "Grep", "Glob", "Execute"]` |
| `qa-tester-high` | `claude-opus-4-5-20251101` | Complex E2E/integration testing | `["Read", "LS", "Grep", "Glob", "Execute"]` |
| `tdd-guide` | `claude-sonnet-4-5-20250929` | TDD workflow | `["Read", "LS", "Grep", "Glob", "Edit", "Create", "Execute"]` |
| `tdd-guide-low` | `inherit` | Test suggestions | `read-only` |

#### Security Family
| Droid | Model | Purpose | Tools |
|-------|-------|---------|-------|
| `security-reviewer` | `claude-opus-4-5-20251101` | OWASP vulnerability detection | `["Read", "LS", "Grep", "Glob", "WebSearch"]` |
| `security-reviewer-low` | `inherit` | Quick security scan | `read-only` |

#### Build & Quality Family
| Droid | Model | Purpose | Tools |
|-------|-------|---------|-------|
| `build-fixer` | `claude-sonnet-4-5-20250929` | TypeScript/build errors | `["Read", "LS", "Grep", "Glob", "Edit", "Create", "Execute"]` |
| `build-fixer-low` | `inherit` | Simple build fixes | `["Read", "LS", "Grep", "Glob", "Edit", "Create"]` |
| `code-reviewer` | `claude-opus-4-5-20251101` | Expert code review | `read-only` |
| `code-reviewer-low` | `inherit` | Quick quality check | `read-only` |

#### Research & Documentation Family
| Droid | Model | Purpose | Tools |
|-------|-------|---------|-------|
| `researcher` | `claude-sonnet-4-5-20250929` | External document research | `["Read", "LS", "Grep", "Glob", "WebSearch", "FetchUrl"]` |
| `researcher-low` | `inherit` | Quick document lookup | `["Read", "LS", "Grep", "Glob", "WebSearch"]` |
| `writer` | `inherit` | Technical documentation | `["Read", "LS", "Grep", "Glob", "Edit", "Create"]` |

#### Planning Family
| Droid | Model | Purpose | Tools |
|-------|-------|---------|-------|
| `planner` | `claude-opus-4-5-20251101` | Strategic planning | `["Read", "LS", "Grep", "Glob", "Edit", "Create", "Execute", "WebSearch"]` |

#### Specialized
| Droid | Model | Purpose | Tools |
|-------|-------|---------|-------|
| `vision` | `claude-sonnet-4-5-20250929` | Image/PDF analysis | `read-only` |

### 6.3 Tier System

| Tier | Model | Cost | Scope | File Limit | Use For |
|------|-------|------|-------|------------|---------|
| **LOW** | `inherit` | $ | Simple, well-defined | 1-5 files | Lookups, simple edits |
| **MEDIUM** | `claude-sonnet-4-5-20250929` | $$ | Medium complexity | 5-20 files | Features, standard tasks |
| **HIGH** | `claude-opus-4-5-20251101` | $$$ | Complex, architectural | Unlimited | Refactoring, debugging |

> **Note:** Using `inherit` follows the parent session's model for cost efficiency. LOW tier droids typically use `inherit` to automatically use Haiku when the parent uses Haiku.

### 6.4 Droid Selection Guide

| Task Type | Best Droid | Model Tier |
|-----------|------------|------------|
| Quick code lookup | `explore` | LOW (inherit) |
| Find files/patterns | `explore` or `explore-medium` | LOW/MEDIUM |
| Complex architecture search | `explore-high` | HIGH (Opus) |
| Simple code change | `executor-low` | LOW (inherit) |
| Feature implementation | `executor` | MEDIUM (Sonnet) |
| Complex refactoring | `executor-high` | HIGH (Opus) |
| Debug simple issue | `architect-low` | LOW (inherit) |
| Debug complex issue | `architect` | HIGH (Opus) |
| UI component | `designer` | MEDIUM (Sonnet) |
| Complex UI system | `designer-high` | HIGH (Opus) |
| Write docs/comments | `writer` | LOW (inherit) |
| Research docs/APIs | `researcher` | MEDIUM (Sonnet) |
| Analyze images/diagrams | `vision` | MEDIUM (Sonnet) |
| Strategic planning | `planner` | HIGH (Opus) |
| Review/critique plan | `critic` | HIGH (Opus) |
| Security review | `security-reviewer` | HIGH (Opus) |
| Fix build errors | `build-fixer` | MEDIUM (Sonnet) |
| TDD workflow | `tdd-guide` | MEDIUM (Sonnet) |
| Code review | `code-reviewer` | HIGH (Opus) |
| Data analysis | `scientist` | MEDIUM (Sonnet) |

### 6.5 How to Invoke Droids

Custom Droids are invoked via the **Task tool** with the `subagent_type` parameter:

```
User: "Review this diff with the code-reviewer droid"
or
User: "Run the subagent `architect` to analyze this architecture"
```

Droid can autonomously invoke Custom Droids without user request.

### 6.6 Delegation Categories

A semantic task classification system that automatically determines model tier, temperature, and thinking budget based on prompt keywords.

**Category Definitions:**

| Category | Tier | Temperature | Thinking | Use For |
|----------|------|-------------|----------|---------|
| `visual-engineering` | HIGH | 0.7 | high | UI/UX, frontend, design systems |
| `ultrabrain` | HIGH | 0.3 | max | Complex reasoning, architecture, deep debugging |
| `artistry` | MEDIUM | 0.9 | medium | Creative solutions, brainstorming |
| `quick` | LOW | 0.1 | low | Simple lookups, basic operations |
| `writing` | MEDIUM | 0.5 | medium | Documentation, technical writing |

**Auto-detection Keywords:**

| Category | Detection Keywords |
|----------|-------------------|
| `visual-engineering` | UI, UX, frontend, design, component, styling, layout |
| `ultrabrain` | debug, complex, architecture, refactor, analyze deeply |
| `artistry` | creative, brainstorm, innovative, explore options |
| `quick` | simple, quick, lookup, find, what is |
| `writing` | document, write, README, comment, explain |

**Usage Examples:**

```
// "Create a UI component" → visual-engineering detected
Task(subagent_type="designer", model="opus", temperature=0.7, thinking="high")

// "Debug this bug" → ultrabrain detected
Task(subagent_type="architect", model="opus", temperature=0.3, thinking="max")

// "Find UserService" → quick detected
Task(subagent_type="explore", model="haiku", temperature=0.1, thinking="low")
```

---

## 7. Skills System

### 7.1 Skill Definition Format

Location: `skills/{skill-name}/SKILL.md`

```markdown
---
name: ultrawork
description: Maximum parallel execution mode
---

# Ultrawork Skill

Enables maximum performance mode with parallel agent orchestration.

## When Activated

This skill enhances Droid's capabilities as follows:
1. Parallel execution: Run multiple agents simultaneously
2. Aggressive delegation: Route tasks to specialists immediately
3. Background tasks: Use run_in_background: true for long tasks
4. Smart model routing: Use tiered agents to save tokens

## Delegation Enforcement (Important)

**You are an orchestrator, not an implementer.**

| Task | Do Directly | Delegate |
|------|-------------|----------|
| Read files for context | Yes | - |
| Track progress (TODO) | Yes | - |
| Spawn parallel agents | Yes | - |
| **All code changes** | Never | executor |
| **UI work** | Never | designer |
| **Documentation** | Never | writer |

...
```

### 7.2 Complete Skills Catalog (35+ Skills)

#### Execution Modes
| Skill | Purpose | Trigger Keywords |
|-------|---------|------------------|
| `autopilot` | Fully autonomous 5-phase execution | "autopilot", "build me", "I want a" |
| `ultrapilot` | Parallel autopilot (3-5x faster) | "ultrapilot", "parallel build" |
| `ralph` | Persistence loop until verified | "ralph", "don't stop", "must complete" |
| `ultrawork` | Maximum parallel execution | "ulw", "ultrawork", "fast", "parallel" |
| `ecomode` | Token-efficient execution | "eco", "ecomode", "budget" |
| `swarm` | N coordinated agents | "swarm N agents" |
| `pipeline` | Sequential agent chaining | "pipeline", "chain" |

#### Planning & Analysis
| Skill | Purpose |
|-------|---------|
| `plan` | Interactive planning interview |
| `planner` | Strategic planning consultant |
| `ralplan` | Iterative Planner→Architect→Critic consensus |
| `review` | Critic-based plan review |
| `analyze` | Deep analysis and investigation |
| `deepsearch` | Multi-strategy codebase search |
| `deepinit` | AGENTS.md hierarchy generation |
| `research` | Parallel scientist orchestration |

#### Development Workflows
| Skill | Purpose |
|-------|---------|
| `ultraqa` | QA cycling: test→fix→repeat |
| `tdd` | Test-first development enforcement |
| `frontend-ui-ux` | Silent design sensibility (auto-activated) |
| `git-master` | Git expertise (auto-activated) |
| `ralph-init` | PRD initialization with stories |
| `build-fix` | Fix build/TypeScript errors with minimal changes |
| `code-review` | Run comprehensive code review |
| `security-review` | Run comprehensive security review |

#### Utilities
| Skill | Purpose |
|-------|---------|
| `cancel` | Unified cancellation (auto-detection) |
| `cancel-autopilot` | Cancel autopilot |
| `cancel-ralph` | Cancel ralph loop |
| `cancel-ultrawork` | Cancel ultrawork |
| `cancel-ultraqa` | Cancel ultraqa |
| `learner` | Extract reusable skill |
| `note` | Compaction-resistant memory |
| `doctor` | Installation diagnostics |
| `hud` | Status bar configuration |
| `help` | Usage guide |
| `omd-setup` | One-time setup wizard |
| `omd-default` | Local project configuration |
| `omd-default-global` | Global configuration |
| `release` | Automated release workflow |
| `skill` | Local skill management (list, add, remove, search, edit) |
| `local-skills-setup` | Local skill setup and management |
| `mcp-setup` | MCP server setup |
| `learn-about-omd` | OMD usage pattern analysis and recommendations |

### 7.3 Skill Invocation

**Explicit:**
```
/oh-my-droid:autopilot Build a REST API
/oh-my-droid:ralph Fix all bugs
```

**Implicit (magic keywords):**
```
"autopilot build me a dashboard" → autopilot activated
"ulw fix all errors" → ultrawork activated
"don't stop until it works" → ralph activated
```

---

## 8. State Management

### 8.1 State File Locations

| State | Local Path | Global Path |
|-------|------------|-------------|
| Ultrawork | `.omd/ultrawork-state.json` | `~/.factory/omd/ultrawork-state.json` |
| Ralph | `.omd/ralph-state.json` | - |
| Autopilot | `.omd/autopilot-state.json` | - |
| Ecomode | `.omd/ecomode-state.json` | - |
| UltraQA | `.omd/ultraqa-state.json` | - |
| Ralplan | `.omd/ralplan-state.json` | - |
| Swarm | `.omd/swarm-state.json` | - |
| Ultrapilot | `.omd/ultrapilot-state.json` | - |
| Pipeline | `.omd/pipeline-state.json` | - |
| PRD | `.omd/prd.json` | - |
| Verification | `.omd/ralph-verification.json` | - |
| Plans | `.omd/plans/*.md` | - |
| Notepads | `.omd/notepads/{plan}/` | - |
| Session Stats | - | `~/.factory/omd/.session-stats.json` |
| Learned Skills | `.omd/skills/*.md` | `~/.factory/omd/skills/*.md` |
| Todos | `.omd/todos.json` | `~/.factory/omd/todos/*.json` |
| Boulder | `.omd/boulder.json` | - |
| Progress Log | `.omd/progress.txt` | - |
| Metrics Log | `.omd/logs/metrics.jsonl` | - |
| Delegation Audit | `.omd/logs/delegation-audit.jsonl` | - |
| Global State | - | `~/.factory/omd/state/{name}.json` |
| Global Droids | - | `~/.factory/droids/` |

### 8.2 State File Schemas

#### ultrawork-state.json
```json
{
  "active": true,
  "started_at": "2024-01-26T10:00:00Z",
  "original_prompt": "ulw fix all bugs",
  "reinforcement_count": 0,
  "escape_threshold": 10
}
```

#### ralph-state.json
```json
{
  "active": true,
  "started_at": "2024-01-26T10:00:00Z",
  "original_prompt": "ralph: refactor auth",
  "promise": "Refactor authentication module",
  "iteration": 1,
  "max_iterations": 10,
  "prd_path": ".omd/prd.json",
  "verification_pending": false
}
```

#### autopilot-state.json
```json
{
  "active": true,
  "phase": "execution",
  "started_at": "2024-01-26T10:00:00Z",
  "spec_path": ".omd/autopilot/spec.md",
  "plan_path": ".omd/plans/autopilot-impl.md",
  "metrics": {
    "tasks_completed": 5,
    "tasks_total": 10,
    "agents_spawned": 12
  }
}
```

#### ultraqa-state.json
```json
{
  "active": true,
  "goal_type": "tests|build|lint|typecheck|custom",
  "goal_pattern": null,
  "cycle": 1,
  "max_cycles": 5,
  "failures": [],
  "started_at": "2024-01-26T10:00:00Z",
  "session_id": "abc123"
}
```

| Field | Description |
|-------|-------------|
| `goal_type` | QA goal type (tests, build, lint, typecheck, custom) |
| `goal_pattern` | Custom goal pattern |
| `cycle` | Current cycle number |
| `max_cycles` | Maximum number of cycles (default: 5) |
| `failures` | Array of failure logs |

#### ultrapilot-state.json
```json
{
  "active": true,
  "iteration": 1,
  "maxIterations": 3,
  "originalTask": "Build a REST API",
  "subtasks": ["Create models", "Add routes", "Write tests"],
  "workers": [],
  "ownership": {},
  "startedAt": "2024-01-26T10:00:00Z",
  "completedAt": null,
  "totalWorkersSpawned": 0,
  "successfulWorkers": 0,
  "failedWorkers": 0,
  "sessionId": "abc123"
}
```

| Field | Description |
|-------|-------------|
| `workers` | Array of active worker states |
| `ownership` | File ownership mapping |
| `totalWorkersSpawned` | Total workers spawned |
| `successfulWorkers` | Number of successful workers |
| `failedWorkers` | Number of failed workers |

#### ecomode-state.json
```json
{
  "active": true,
  "tier": "LOW",
  "startedAt": "2024-01-26T10:00:00Z",
  "sessionId": "abc123"
}
```

#### boulder.json
```json
{
  "active_plan": "plan-name",
  "started_at": "2024-01-26T10:00:00Z",
  "session_ids": ["session-1", "session-2"],
  "plan_name": "feature-implementation"
}
```

#### progress.txt
```
=== Codebase Patterns ===
- TypeScript monorepo with pnpm
- React frontend, Node.js backend

=== Progress Entries ===
[2024-01-26 10:00] Started implementation
[2024-01-26 10:30] Completed phase 1
```

### 8.3 Notepad Wisdom System

Location: `.omd/notepads/{plan-name}/`

| File | Purpose |
|------|---------|
| `learnings.md` | Technical discoveries, patterns |
| `decisions.md` | Architecture choices, rationale |
| `issues.md` | Known issues, workarounds |
| `problems.md` | Blockers, challenges |

#### Notepad API Functions

| Function | Description | Return Value |
|----------|-------------|--------------|
| `initPlanNotepad(planName)` | Initialize notepad directory for plan | `{ path: string }` |
| `addLearning(planName, content)` | Add technical discovery | `{ success: boolean }` |
| `addDecision(planName, content)` | Add architecture decision | `{ success: boolean }` |
| `addIssue(planName, content)` | Add known issue | `{ success: boolean }` |
| `addProblem(planName, content)` | Add blocker | `{ success: boolean }` |
| `getWisdomSummary(planName)` | Get full wisdom summary | `{ learnings, decisions, issues, problems }` |
| `readPlanWisdom(planName)` | Read specific plan wisdom | `PlanWisdom` object |

### 8.4 Context Persistence

Use `<remember>` tags to save context that survives conversation compaction.

**Tag Format:**

| Tag | Lifetime | Use For |
|-----|----------|---------|
| `<remember>info</remember>` | 7 days | Session-specific context |
| `<remember priority>info</remember>` | Permanent | Critical patterns/facts |

**What to Capture:**
- Architecture decisions
- Error resolution methods
- User preferences
- Important code patterns

**What NOT to Capture:**
- Progress (use todos)
- Temporary state
- Information in AGENTS.md

**Processing Flow:**
1. PostToolUse hook detects `<remember>` tags
2. Tag content saved to notepad
3. PreCompact hook preserves priority items
4. SessionStart hook restores active context

### 8.5 Directory Diagnostics

`lsp_diagnostics_directory` tool for project-level type checking.

**Strategies:**

| Strategy | Description | Priority |
|----------|-------------|----------|
| `auto` | Auto-select (prefers tsc when tsconfig.json exists) | Default |
| `tsc` | Use TypeScript compiler (fast) | Requires tsconfig.json |
| `lsp` | Use Language Server (fallback) | Iterates all files |

**When to Use:**
- Check entire project for errors before commit
- Type verification after refactoring
- Diagnose build failures

---

## 9. Configuration

### 9.1 User Configuration

Location: `~/.factory/omd.config.json`

```json
{
  "defaultExecutionMode": "ultrawork",
  "hudEnabled": true,
  "hudPreset": "focused",
  "modelRouting": {
    "defaultTier": "MEDIUM",
    "escalateOnFailure": true
  },
  "persistence": {
    "ralphMaxIterations": 10,
    "ultraworkEscapeThreshold": 10,
    "todoMaxAttempts": 15
  },
  "delegation": {
    "enforceForSourceFiles": true,
    "warnedExtensions": [".ts", ".tsx", ".js", ".jsx", ".py", ".go", ".rs"]
  },
  "delegationCategories": {
    "visual-engineering": { "tier": "HIGH", "temperature": 0.7, "thinking": "high" },
    "ultrabrain": { "tier": "HIGH", "temperature": 0.3, "thinking": "max" },
    "artistry": { "tier": "MEDIUM", "temperature": 0.9, "thinking": "medium" },
    "quick": { "tier": "LOW", "temperature": 0.1, "thinking": "low" },
    "writing": { "tier": "MEDIUM", "temperature": 0.5, "thinking": "medium" }
  },
  "categoryKeywords": {
    "visual-engineering": ["UI", "UX", "frontend", "design", "component"],
    "ultrabrain": ["debug", "complex", "architecture", "refactor"],
    "artistry": ["creative", "brainstorm", "innovative"],
    "quick": ["simple", "quick", "lookup", "find"],
    "writing": ["document", "write", "README"]
  },
  "backgroundExecution": {
    "maxConcurrentTasks": 5,
    "commands": ["npm install", "npm run build", "npm test", "docker build"]
  },
  "circuitBreaker": {
    "threshold": 3,
    "cooldownSeconds": 60
  },
  "contextPersistence": {
    "defaultTTL": "7d",
    "priorityTTL": "permanent"
  },
  "diagnostics": {
    "strategy": "auto",
    "tscEnabled": true,
    "lspFallback": true
  }
}
```

### 9.2 Project Configuration

Location: `.factory/omd.config.json`

```json
{
  "projectType": "typescript",
  "testCommand": "npm test",
  "buildCommand": "npm run build",
  "lintCommand": "npm run lint",
  "customAgents": [],
  "disabledSkills": [],
  "rules": {
    "coding-style": true,
    "security": true,
    "testing": true
  }
}
```

---

## 10. Key Differences from oh-my-claudecode

### 10.1 Platform Differences

| Aspect | oh-my-claudecode | oh-my-droid |
|--------|------------------|-------------|
| **Platform** | Claude Code | Factory AI Droid |
| **Plugin Dir** | `.claude-plugin/` | `.factory-plugin/` |
| **Settings** | `~/.claude/settings.json` | `~/.factory/settings.json` |
| **Project Settings** | `.claude/settings.json` | `.factory/settings.json` |
| **State Dir** | `.omc/` | `.omd/` |
| **Global State** | `~/.claude/` | `~/.factory/omd/` |
| **Env Variable** | `CLAUDE_PROJECT_DIR` | `FACTORY_PROJECT_DIR` |
| **Plugin Root Env** | `${CLAUDE_PLUGIN_ROOT}` | `${DROID_PLUGIN_ROOT}` |
| **Transcript Path** | `~/.claude/projects/` | `~/.factory/projects/` |

### 10.2 Naming Conventions

| oh-my-claudecode | oh-my-droid |
|------------------|-------------|
| `omc` | `omd` |
| `oh-my-claudecode:` | `omd-` (filename prefix) |
| `/oh-my-claudecode:help` | `/omd-help` |
| `omc-setup` | `omd-setup` |
| `.omc/` | `.omd/` |
| `CLAUDE.md` | `FACTORY.md` or project instruction file |

### 10.2.1 Slash Command Architecture Decision

**Important: Slash Command System Differences Between Factory Droid and Claude Code**

| Aspect | Claude Code | Factory Droid |
|--------|-------------|---------------|
| **Subfolder Support** | Supported (`sc/`, `oh-my-claudecode/`) | **Not Supported** (flat structure only) |
| **Plugin Prefix** | `/oh-my-claudecode:setup` | **Not Supported** |
| **Command Location** | `~/.claude/commands/{subfolder}/` | `~/.factory/commands/` (top-level only) |
| **Conflict Prevention** | Namespace separation via subfolders | **Filename prefix** used |

#### Design Decision Background

As stated in the Factory Droid official documentation ([custom-slash-commands.md](docs/droid/custom-slash-commands.md)):

> "Commands must live at the top level of the `commands` directory. Nested folders are ignored today."

Therefore, oh-my-droid installs commands as follows:

```
~/.factory/commands/
├── omd-setup.md        → /omd-setup
├── omd-autopilot.md    → /omd-autopilot
├── omd-ultrawork.md    → /omd-ultrawork
├── omd-ralph.md        → /omd-ralph
└── ...                 → /omd-{skill-name}
```

#### Why the `omd-` Prefix?

1. **Conflict Prevention**: Prevents name collisions with other plugins/user commands
2. **Consistency**: Similar to oh-my-claudecode's `omc-` pattern
3. **Discoverability**: All oh-my-droid commands auto-complete when typing `/omd-`
4. **Simplicity**: Short prefix easy for users to remember

#### Comparison with oh-my-claudecode

```
# oh-my-claudecode (Claude Code)
/oh-my-claudecode:setup     # Uses plugin prefix
/oh-my-claudecode:autopilot

# oh-my-droid (Factory Droid)
/omd-setup                   # Uses filename prefix
/omd-autopilot
```

### 10.3 Hook Input Differences

| Field | Claude Code | Droid |
|-------|-------------|-------|
| `session_id` | Same | Same |
| `transcript_path` | Same | Same |
| `cwd` | Same | Same |
| `permission_mode` | Same | Same |

### 10.4 Hook Output Differences

Hook output format is identical across platforms:
- Exit codes (0, 2, other)
- JSON output with `decision`, `reason`, `hookSpecificOutput`
- `permissionDecision` for PreToolUse

---

## 10.5 MCP Tool Handling

MCP tools follow the `mcp__<server>__<tool>` pattern. The plugin handles them as follows:

### PreToolUse/PostToolUse Matching

The `*` matcher captures all tools including MCP tools. For specific MCP handling:

```json
{
  "PreToolUse": [
    {
      "matcher": "mcp__.*",
      "hooks": [
        {
          "type": "command",
          "command": "${DROID_PLUGIN_ROOT}/scripts/mcp-handler.mjs"
        }
      ]
    }
  ]
}
```

### Default Behavior

By default, oh-my-droid passes MCP tools through without special handling. The delegation enforcer does not warn about MCP tools as they are external integrations.

---

## 10.6 Error Handling Strategy

### Hook Script Errors

| Exit Code | Behavior | Droid Response |
|-----------|----------|----------------|
| 0 | Success | Normal proceed |
| 2 | Blocking error | Process stderr as feedback |
| Other | Non-blocking error | Show stderr to user, proceed |

### Script Error Handling Pattern

```javascript
#!/usr/bin/env node
import { readFileSync } from 'fs';

try {
  const input = JSON.parse(readFileSync(0, 'utf-8'));

  // Process input...

  console.log(JSON.stringify({ /* output */ }));
  process.exit(0);

} catch (error) {
  // Log to stderr for debugging
  console.error(`[omd] Error: ${error.message}`);

  // Non-blocking error - let Droid continue
  process.exit(1);
}
```

### State File Errors

- **Missing state file**: Treated as "mode not activated"
- **Corrupted JSON**: Log warning, reset to default state
- **Permission error**: Log warning, continue without state

### Timeout Handling

- Each hook has a configured timeout (3-5 seconds)
- On timeout, Droid continues without hook output
- Scripts should complete critical work first, optional work last

---

## 11. Implementation Phases

### Phase 1: Core Infrastructure (Week 1)

1. **Plugin Manifest**
   - Create `.factory-plugin/plugin.json`
   - Create `.factory-plugin/marketplace.json`

2. **Basic Hooks**
   - Configure `hooks/hooks.json`
   - `scripts/session-start.mjs` - basic context injection
   - `scripts/keyword-detector.mjs` - magic keyword detection

3. **Core Skills**
   - `skills/help/SKILL.md`
   - `skills/omd-setup/SKILL.md`
   - `skills/orchestrate/SKILL.md`

4. **Essential Custom Droids**
   - `droids/architect.md`
   - `droids/executor.md`
   - `droids/explore.md`

### Phase 2: Execution Modes (Week 2)

1. **Ultrawork**
   - `skills/ultrawork/SKILL.md`
   - State management
   - Keyword detection integration

2. **Ralph**
   - `skills/ralph/SKILL.md`
   - `scripts/persistent-mode.mjs`
   - PRD support

3. **Supporting Skills**
   - `skills/cancel/SKILL.md`
   - `skills/cancel-ultrawork/SKILL.md`
   - `skills/cancel-ralph/SKILL.md`

### Phase 3: Planning System (Week 3)

1. **Planner**
   - `skills/planner/SKILL.md`
   - `droids/planner.md`
   - `droids/critic.md`
   - `droids/analyst.md`

2. **Planning Skills**
   - `skills/plan/SKILL.md`
   - `skills/ralplan/SKILL.md`
   - `skills/review/SKILL.md`

### Phase 4: Complete Custom Droids Catalog (Week 4)

1. **All Tiered Custom Droids**
   - Complete 32 droid definitions (`droids/*.md`)
   - Template system

2. **Advanced Skills**
   - `skills/autopilot/SKILL.md`
   - `skills/ultrapilot/SKILL.md`
   - `skills/swarm/SKILL.md`
   - `skills/pipeline/SKILL.md`

### Phase 5: Quality & Polish (Week 5)

1. **Additional Skills**
   - `skills/ultraqa/SKILL.md`
   - `skills/tdd/SKILL.md`
   - `skills/frontend-ui-ux/SKILL.md`
   - `skills/git-master/SKILL.md`

2. **Utilities**
   - `skills/doctor/SKILL.md`
   - `skills/hud/SKILL.md`
   - `skills/note/SKILL.md`
   - `skills/learner/SKILL.md`

3. **Documentation**
   - Complete README.md
   - AGENTS.md
   - All command documentation

### Phase 6: Testing & Release (Week 6)

1. **Testing**
   - Hook script testing
   - Skill integration testing
   - Custom Droids verification

2. **Release**
   - npm package preparation
   - Marketplace submission
   - User documentation

---

## Appendix A: Hook Input/Output Reference

### A.0 Common JSON Output Fields

All hook types support the following optional fields:

```json
{
  "continue": true,          // Whether Droid should continue (default: true)
                             // If false, Droid will stop processing after hooks execution

  "stopReason": "string",    // Message displayed to user when continue is false
                             // Not shown to Droid

  "suppressOutput": true,    // Hide stdout in transcript mode (default: false)

  "systemMessage": "string"  // Warning message displayed to user
}
```

**Important:**
- `continue: false` takes precedence over `decision: block` output
- For `PreToolUse`, this differs from `permissionDecision: deny` which only blocks one tool call
- For `Stop/SubagentStop`, this takes precedence over `decision: block`

### A.1 UserPromptSubmit

**Input:**
```json
{
  "session_id": "abc123",
  "transcript_path": "~/.factory/projects/.../transcript.jsonl",
  "cwd": "/project/path",
  "permission_mode": "default",
  "hook_event_name": "UserPromptSubmit",
  "prompt": "user's message"
}
```

**Output (context injection):**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "Context to inject"
  }
}
```

**Output (blocking):**
```json
{
  "decision": "block",
  "reason": "Reason displayed to user"
}
```

### A.2 SessionStart

**Input:**
```json
{
  "session_id": "abc123",
  "transcript_path": "~/.factory/projects/.../transcript.jsonl",
  "cwd": "/project/path",
  "permission_mode": "default",
  "hook_event_name": "SessionStart",
  "source": "startup|resume|clear|compact"
}
```

**Output:**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "Restored session context..."
  }
}
```

### A.3 PreToolUse

**Input:**
```json
{
  "session_id": "abc123",
  "transcript_path": "~/.factory/projects/.../transcript.jsonl",
  "cwd": "/project/path",
  "permission_mode": "default",
  "hook_event_name": "PreToolUse",
  "tool_name": "Edit",
  "tool_input": {
    "file_path": "/path/to/file.ts",
    "old_string": "...",
    "new_string": "..."
  }
}
```

**Output (context injection):**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "additionalContext": "Consider delegation..."
  }
}
```

**Output (permission control):**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow|deny|ask",
    "permissionDecisionReason": "reason"
  }
}
```

**Output (input modification):**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow",
    "updatedInput": {
      "field_to_modify": "new_value"
    }
  }
}
```

### A.4 PostToolUse

**Input:**
```json
{
  "session_id": "abc123",
  "transcript_path": "~/.factory/projects/.../transcript.jsonl",
  "cwd": "/project/path",
  "permission_mode": "default",
  "hook_event_name": "PostToolUse",
  "tool_name": "Edit",
  "tool_input": {...},
  "tool_response": {
    "success": true,
    "filePath": "/path/to/file.ts"
  }
}
```

**Output:**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "Verify changes..."
  }
}
```

### A.5 Stop / SubagentStop

**Input:**
```json
{
  "session_id": "abc123",
  "transcript_path": "~/.factory/projects/.../transcript.jsonl",
  "cwd": "/project/path",
  "permission_mode": "default",
  "hook_event_name": "Stop",
  "stop_hook_active": false
}
```

**Output (allow stop):**
```json
{}
```

**Output (block stop):**
```json
{
  "decision": "block",
  "reason": "<ralph-loop-continuation>\nMust continue...\n</ralph-loop-continuation>"
}
```

### A.6 PreCompact

**Input:**
```json
{
  "session_id": "abc123",
  "transcript_path": "~/.factory/projects/.../transcript.jsonl",
  "cwd": "/project/path",
  "permission_mode": "default",
  "hook_event_name": "PreCompact",
  "trigger": "manual|auto",
  "custom_instructions": ""
}
```

**Output:**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreCompact",
    "additionalContext": "Wisdom preserved: 5 learnings, 3 decisions."
  }
}
```

> **Note:** PreCompact hooks cannot block compaction. They are for preserving state before context is compacted.

### A.7 SessionEnd

**Input:**
```json
{
  "session_id": "abc123",
  "transcript_path": "~/.factory/projects/.../transcript.jsonl",
  "cwd": "/project/path",
  "permission_mode": "default",
  "hook_event_name": "SessionEnd",
  "reason": "clear|logout|prompt_input_exit|other"
}
```

**Output:**
```json
{}
```

> **Note:** SessionEnd hooks cannot block session termination. They are for cleanup tasks only. Output is logged only for debug.

### A.8 Error

**Input:**
```json
{
  "session_id": "abc123",
  "transcript_path": "~/.factory/projects/.../transcript.jsonl",
  "cwd": "/project/path",
  "permission_mode": "default",
  "hook_event_name": "Error",
  "error_type": "context_window_overflow|edit_conflict|tool_execution|session_corrupt|unknown",
  "error_message": "Context window exceeded maximum token limit",
  "error_details": {
    "tool_name": "Edit",
    "file_path": "/path/to/file.ts",
    "stack_trace": "...",
    "additional_info": {}
  }
}
```

**Output (recovery guidance injection):**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "Error",
    "additionalContext": "<error-recovery type=\"context_window_overflow\">\n## Recovery Guide\n1. Context compaction is needed\n2. Critical state has been preserved\n3. Next steps: ...\n</error-recovery>"
  }
}
```

**Output (auto-recovery attempt):**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "Error",
    "recoveryAction": "auto_compact|retry|skip|abort",
    "recoveryContext": {
      "preserved_state": {},
      "retry_params": {}
    },
    "additionalContext": "Auto-recovery will be attempted..."
  }
}
```

> **Note:** Error hooks can provide recovery guidance or attempt auto-recovery when errors occur. Use `recoveryAction` to specify the recovery strategy.

### A.9 SessionIdle

**Input:**
```json
{
  "session_id": "abc123",
  "transcript_path": "~/.factory/projects/.../transcript.jsonl",
  "cwd": "/project/path",
  "permission_mode": "default",
  "hook_event_name": "SessionIdle",
  "idle_duration_ms": 30000,
  "last_activity": "tool_use|user_message|assistant_response",
  "last_activity_timestamp": "2024-01-26T10:00:00Z"
}
```

**Output (continuation prompt):**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "SessionIdle",
    "additionalContext": "<session-idle-continuation>\nRalph loop is active. Incomplete tasks remain:\n- [ ] Task 1\n- [ ] Task 2\nPlease continue.\n</session-idle-continuation>",
    "continueSession": true
  }
}
```

**Output (allow idle):**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "SessionIdle",
    "continueSession": false
  }
}
```

> **Note:** SessionIdle hooks are called when the session has been idle for a certain duration. When persistence modes (ralph, ultrawork, etc.) are active, continuation prompts can be injected to resume work.

### A.10 MessagesTransform

**Input:**
```json
{
  "session_id": "abc123",
  "transcript_path": "~/.factory/projects/.../transcript.jsonl",
  "cwd": "/project/path",
  "permission_mode": "default",
  "hook_event_name": "MessagesTransform",
  "messages": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant",
      "content": ""
    },
    {
      "role": "user",
      "content": [
        {
          "type": "thinking",
          "thinking": "Let me analyze..."
        },
        {
          "type": "text",
          "text": "Response"
        }
      ]
    }
  ]
}
```

**Output:**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "MessagesTransform",
    "transformedMessages": [
      {
        "role": "user",
        "content": "Hello"
      },
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Response"
          }
        ]
      }
    ],
    "transformationLog": [
      "Removed empty assistant message at index 1",
      "Removed thinking block from user message at index 2"
    ]
  }
}
```

> **Note:** MessagesTransform hooks transform the message array before API calls. They can remove empty messages, clean thinking blocks, merge consecutive roles, etc. If `transformedMessages` is provided, it replaces the original messages.

### A.11 ChatParams

**Input:**
```json
{
  "session_id": "abc123",
  "transcript_path": "~/.factory/projects/.../transcript.jsonl",
  "cwd": "/project/path",
  "permission_mode": "default",
  "hook_event_name": "ChatParams",
  "current_params": {
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 8192,
    "temperature": 0.7,
    "thinking": {
      "type": "disabled"
    }
  },
  "active_modes": ["ultrawork", "ecomode"],
  "task_context": {
    "complexity": "low|medium|high",
    "task_type": "coding|debugging|documentation|analysis|other"
  }
}
```

**Output:**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "ChatParams",
    "modifiedParams": {
      "model": "claude-opus-4-5-20251101",
      "max_tokens": 16384,
      "temperature": 0.3,
      "thinking": {
        "type": "enabled",
        "budget_tokens": 10000
      }
    },
    "parameterChangeLog": [
      "Upgraded model to Opus for high complexity debugging",
      "Enabled thinking mode with 10000 token budget",
      "Reduced temperature for more deterministic output"
    ]
  }
}
```

> **Note:** ChatParams hooks adjust model parameters before API calls. They can dynamically adjust model, thinking settings, temperature, etc. based on active modes, task complexity, and task type. If `modifiedParams` is provided, only those fields override the original parameters.

---

## Appendix B: Environment Variables

| Variable | Description |
|----------|-------------|
| `FACTORY_PROJECT_DIR` | Absolute path to project root |
| `DROID_PLUGIN_ROOT` | Absolute path to plugin directory |
| `OMD_DEBUG` | Enable debug logging |
| `OMD_CONFIG_PATH` | Custom configuration file path |
| `OMD_MAX_BACKGROUND_TASKS` | Maximum concurrent background tasks (default: 5) |
| `OMD_CIRCUIT_BREAKER_THRESHOLD` | Circuit breaker threshold (default: 3) |
| `OMD_DIAGNOSTICS_STRATEGY` | Diagnostics strategy (auto, tsc, lsp) |

---

## Appendix C: Magic Keywords Reference

| Keyword | Mode | State File | Description |
|---------|------|------------|-------------|
| `autopilot`, `build me`, `I want a` | Autopilot | `.omd/autopilot-state.json` | Fully autonomous execution |
| `ultrapilot`, `parallel build` | Ultrapilot | `.omd/ultrapilot-state.json` | Parallel autopilot |
| `ralph`, `don't stop`, `must complete` | Ralph | `.omd/ralph-state.json` | Persistence loop |
| `ulw`, `ultrawork`, `fast`, `parallel` | Ultrawork | `.omd/ultrawork-state.json` | Maximum parallelization |
| `eco`, `ecomode`, `budget`, `efficient` | Ecomode | `.omd/ecomode-state.json` | Token efficiency |
| `ultrathink`, `think` | Think Mode | (context only) | Extended reasoning |
| `search`, `find`, `locate`, `explore` | Search | (context only) | Search guidance |
| `analyze`, `investigate`, `debug` | Analysis | (context only) | Analysis guidance |
| `stop`, `cancel`, `abort` | Cancel | (removes active) | Cancel active mode |

---

*End of Design Document*
