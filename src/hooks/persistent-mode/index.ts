/**
 * Persistent Mode Hook
 *
 * Unified stop handler that checks for active modes (ralph, ultrawork, autopilot)
 * and prevents premature stopping.
 * Adapted from oh-my-claudecode.
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

/**
 * Active mode types
 */
export type ActiveModeType = 'ralph' | 'ultrawork' | 'autopilot' | 'ultraqa' | null;

/**
 * Mode state
 */
export interface ModeState {
  active: boolean;
  iteration?: number;
  max_iterations?: number;
  started_at?: string;
  [key: string]: unknown;
}

/**
 * Check result
 */
export interface PersistentModeCheck {
  /** Whether any persistent mode is active */
  isActive: boolean;
  /** The active mode type */
  activeMode: ActiveModeType;
  /** The mode state */
  state: ModeState | null;
  /** Enforcement message if stop should be blocked */
  message?: string;
}

/**
 * State file locations
 */
const STATE_FILES: Record<string, string> = {
  ralph: '.omd/ralph-state.json',
  ultrawork: '.omd/ultrawork-state.json',
  autopilot: '.omd/autopilot-state.json',
  ultraqa: '.omd/ultraqa-state.json'
};

/**
 * Read state file
 */
function readStateFile(directory: string, filename: string): ModeState | null {
  const filepath = join(directory, filename);

  if (!existsSync(filepath)) {
    return null;
  }

  try {
    const content = readFileSync(filepath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

/**
 * Check for active persistent modes
 */
export function checkPersistentModes(directory: string): PersistentModeCheck {
  for (const [mode, filename] of Object.entries(STATE_FILES)) {
    const state = readStateFile(directory, filename);

    if (state && state.active) {
      return {
        isActive: true,
        activeMode: mode as ActiveModeType,
        state,
        message: getEnforcementMessage(mode as ActiveModeType, state)
      };
    }
  }

  return {
    isActive: false,
    activeMode: null,
    state: null
  };
}

/**
 * Generate enforcement message for a mode
 */
function getEnforcementMessage(mode: ActiveModeType, state: ModeState): string {
  const iteration = state.iteration || 1;
  const maxIterations = state.max_iterations || 10;

  const messages: Record<string, string> = {
    ralph: `<ralph-enforcement>

[RALPH MODE: STOP BLOCKED - Iteration ${iteration}/${maxIterations}]

You are in ralph mode. You cannot stop until:
1. All todos are complete
2. The completion promise is output: <promise>TASK_COMPLETE</promise>

Continue working on the next pending task.

</ralph-enforcement>

---

`,
    ultrawork: `<ultrawork-enforcement>

[ULTRAWORK MODE: STOP BLOCKED]

You are in ultrawork mode. Maximum parallel execution is active.

REMEMBER THE RULES:
- PARALLEL: Fire independent calls simultaneously
- BACKGROUND FIRST: Use Task(run_in_background=true) for exploration
- TODO: Track EVERY step. Mark complete IMMEDIATELY
- VERIFY: Check ALL requirements met before done
- NO Premature Stopping: ALL TODOs must be complete

Continue working. Do NOT stop until all tasks are done.

</ultrawork-enforcement>

---

`,
    autopilot: `<autopilot-enforcement>

[AUTOPILOT MODE: STOP BLOCKED - Iteration ${iteration}/${maxIterations}]

You are in autopilot mode. Autonomous execution is active.

You cannot stop until:
1. All todos are complete
2. Verification has passed
3. Goal is achieved

Continue working on the next pending task.

</autopilot-enforcement>

---

`,
    ultraqa: `<ultraqa-enforcement>

[ULTRAQA MODE: STOP BLOCKED - Cycle ${iteration}/${maxIterations}]

You are in ultraqa mode. QA cycling is active.

Continue the test -> fix -> verify cycle until:
1. All tests pass
2. Build succeeds
3. Quality goal is met

</ultraqa-enforcement>

---

`
  };

  return messages[mode || ''] || '';
}

/**
 * Configuration for persistent mode hook
 */
export interface PersistentModeConfig {
  /** Whether to enable enforcement */
  enabled?: boolean;
  /** Modes to enforce (default: all) */
  enforceModes?: ActiveModeType[];
}

/**
 * Create the persistent mode hook
 */
export function createPersistentModeHook(config?: PersistentModeConfig) {
  const enforceModes = config?.enforceModes;

  return {
    /**
     * Stop handler - block premature stopping
     */
    stop: (input: { session_id: string; directory?: string }): string | null => {
      if (config?.enabled === false) {
        return null;
      }

      const directory = input.directory || process.cwd();
      const check = checkPersistentModes(directory);

      if (!check.isActive) {
        return null;
      }

      // Check if mode is in enforced list
      if (enforceModes && !enforceModes.includes(check.activeMode)) {
        return null;
      }

      return check.message || null;
    },

    /**
     * Check if any persistent mode is active
     */
    isActive: (directory?: string): PersistentModeCheck => {
      return checkPersistentModes(directory || process.cwd());
    }
  };
}
