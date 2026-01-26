/**
 * Auto Slash Command Constants
 *
 * Patterns and configuration for automatic slash command detection.
 * Adapted from oh-my-claudecode.
 */

/**
 * Keywords that trigger slash command execution
 */
export const TRIGGER_KEYWORDS = {
  autopilot: ['autopilot', 'build me', 'i want a', 'create me'],
  ralph: ['ralph', "don't stop", 'must complete', 'keep going until'],
  ultrawork: ['ultrawork', 'ulw', 'parallel', 'fast mode'],
  planner: ['plan this', 'plan the', 'planning mode'],
  analyze: ['analyze', 'debug', 'investigate', 'deep dive'],
  deepsearch: ['search for', 'find in codebase', 'look for']
} as const;

/**
 * Command to skill mappings
 */
export const COMMAND_MAPPINGS: Record<string, string> = {
  autopilot: 'oh-my-droid:autopilot',
  ralph: 'oh-my-droid:ralph',
  ultrawork: 'oh-my-droid:ultrawork',
  planner: 'oh-my-droid:planner',
  analyze: 'oh-my-droid:analyze',
  deepsearch: 'oh-my-droid:deepsearch'
};

/**
 * Priority order for command detection (higher = checked first)
 */
export const COMMAND_PRIORITY: Record<string, number> = {
  autopilot: 100,
  ralph: 90,
  ultrawork: 80,
  planner: 70,
  analyze: 60,
  deepsearch: 50
};

/**
 * Default confidence threshold for auto-execution
 */
export const DEFAULT_CONFIDENCE_THRESHOLD = 0.8;

/**
 * Cooldown between auto-executions (ms)
 */
export const AUTO_EXECUTE_COOLDOWN_MS = 5000;
