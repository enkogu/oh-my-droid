# Differences from oh-my-claudecode (Excluding Unavoidable Differences)

This document outlines the differences between `oh-my-claudecode/` (legacy) and the current project (root), **excluding unavoidable differences** such as platform/naming conventions.

- Unavoidable differences (platform/path/naming/default Hook input/output fields, etc.) are already documented in `DESIGN.md` under **"10. Key Differences from oh-my-claudecode"** and will not be repeated here.

> Notation Convention: **KEEP** (intentional extension/differentiation), **SYNC** (functional equivalence required), **REVIEW** (intent/direction confirmation needed)

---

## 1) Reduced Packaging/Distribution Scope (REVIEW)

**Files:**
- `package.json`
- `oh-my-claudecode/package.json`

**Difference:**
- Legacy includes **distribution/CLI-centric packaging** with `bin`, `exports`, numerous runtime `dependencies`, `build:bridge`, `sync-metadata`, etc.
- Current project only has minimal devDependencies centered on `tsc/vitest/eslint` + dist build, without `bin`/runtime deps.

**Impact:**
- Not equivalent to oh-my-claudecode's **CLI/runtime functionality distributed/executed as an NPM package**.

---

## 2) Significantly Reduced TypeScript Implementation Scope (Code Functionality) (REVIEW)

**Evidence (paths):**
- legacy: `oh-my-claudecode/src/**` (numerous files including hud, analytics, hooks, mcp, cli, tools, etc.)
- current: `src/` contains only a few files like `state-manager`, `config-loader`, etc.

**Difference:**
- The current project does not include much of the "plugin runtime (feature implementation)" and appears to be **focused on marketplace definitions/scripts**.

**Impact:**
- Features provided by legacy such as HUD/Analytics/MCP/CLI are **not equivalently provided**.

---

## 3) Hook Event Coverage/Matcher/Chain Differences (REVIEW/KEEP)

**Files:**
- current: `hooks/hooks.json`
- legacy: `oh-my-claudecode/hooks/hooks.json`

**Differences (only in current):**
- `PreCompact` (`scripts/pre-compact.mjs`)
- `SubagentStop` (`scripts/persistent-mode.mjs`)
- `SessionEnd` (`scripts/session-end.mjs`)
- `Notification` (`scripts/session-idle.mjs`)

**Differences (same event but different behavior):**
- `PreToolUse.matcher`: legacy uses `"*"` (all tools) / current uses `"Edit|Write"` with **reduced scope**
- `PostToolUse`: legacy has 1 handler (`post-tool-verifier`) / current has **2-stage chain** (`post-tool-verifier` + `error-recovery`)

**Impact:**
- The "pre-tool reminder/guard" performed in PreToolUse is now **only applied to Edit/Write**.
- PostToolUse has **extended behavior** with added error recovery.

---

## 4) PreToolUse Script Policy Difference (All Tools vs. Only During Source File Modification) (REVIEW)

**Files:**
- current: `scripts/pre-tool-enforcer.mjs`
- legacy: `oh-my-claudecode/scripts/pre-tool-enforcer.mjs`

**Difference:**
- Legacy has a strong characteristic of providing context reminders "before all tool executions".
- Current is **policy-based**, only outputting "delegation reminder" under conditions: `Edit/Write` + (source extension) + (excluding allowed paths).

**Impact:**
- The previous "consistent reminder" is removed, and the nature changes to "guard only during code modification".

---

## 5) Keyword Detector Triggers Additional Modes (KEEP/REVIEW)

**Files:**
- current: `scripts/keyword-detector.mjs`
- legacy: `oh-my-claudecode/scripts/keyword-detector.mjs`

**Difference:**
- Legacy is centered on `ultrawork/ultrathink/search/analyze`.
- Current includes `autopilot`, `ralph`, `eco` mode messages/state file generation.

**Impact:**
- For the same user prompt, **the injected mode/state may differ**.

---

## 6) Skills Set Differences (KEEP)

**Evidence (paths):**
- Only in current: `skills/planner/SKILL.md`
- Only in legacy: `oh-my-claudecode/skills/omc-setup/SKILL.md`, `oh-my-claudecode/skills/learn-about-omc/SKILL.md` (replaced with `omd-setup`, `learn-about-omd` in current)

**Additional differences:**
- Some skill examples/verification commands have been changed to Android-focused, which is partially documented in the "Adaptation Notes" of `skills/README.md`.

---

## 7) Droid (Agent) Definition Tool Whitelist Mismatch: Missing `TodoWrite` (SYNC)

**Files:**
- current: `droids/executor.md`
- legacy: `oh-my-claudecode/agents/executor.md`

**Difference:**
- Legacy executor includes `TodoWrite` in frontmatter `tools`.
- Current executor requires TodoWrite as "NON-NEGOTIABLE" in the body text, but `TodoWrite` is absent from the frontmatter `tools` array.

**Impact:**
- If the platform strictly enforces the tool whitelist, it could make the droid's own rule ("TodoWrite FIRST") **unexecutable**.

---

## 8) Missing tsconfig Options (SYNC)

**Files:**
- current: `tsconfig.json`
- legacy: `oh-my-claudecode/tsconfig.json`

**Difference:**
- Options such as `lib`, `types`, `resolveJsonModule` present in legacy are missing from the current `tsconfig.json`.

**Impact:**
- As the project grows, type checking/build behavior may differ in areas such as JSON imports/Node type resolution.

---

## 9) Templates Structure Differences (KEEP)

**Evidence (paths):**
- legacy: `oh-my-claudecode/templates/rules/*`, `oh-my-claudecode/templates/hooks/*`
- current: `templates/commands/*`, `templates/droids/*` (+ `templates/CONVERSION_SUMMARY.md`)

**Difference:**
- From legacy's "rules/hooks templates" focus, current has been restructured to focus on "marketplace command/droid templates".
