/**
 * OMD Orchestrator Constants
 *
 * Configuration for the main orchestration layer.
 * Adapted from oh-my-claudecode.
 */

/**
 * Agent prefixes for delegation
 */
export const AGENT_PREFIX = 'oh-my-droid:';

/**
 * Model tiers
 */
export const MODEL_TIERS = {
  LOW: 'haiku',
  MEDIUM: 'sonnet',
  HIGH: 'opus'
} as const;

/**
 * Agent type to model mapping
 */
export const AGENT_MODELS: Record<string, string> = {
  // Low tier (Haiku)
  'architect-low': MODEL_TIERS.LOW,
  'executor-low': MODEL_TIERS.LOW,
  'explore': MODEL_TIERS.LOW,
  'researcher-low': MODEL_TIERS.LOW,
  'designer-low': MODEL_TIERS.LOW,
  'writer': MODEL_TIERS.LOW,
  'security-reviewer-low': MODEL_TIERS.LOW,
  'build-fixer-low': MODEL_TIERS.LOW,
  'tdd-guide-low': MODEL_TIERS.LOW,
  'code-reviewer-low': MODEL_TIERS.LOW,
  'scientist-low': MODEL_TIERS.LOW,

  // Medium tier (Sonnet)
  'architect-medium': MODEL_TIERS.MEDIUM,
  'executor': MODEL_TIERS.MEDIUM,
  'explore-medium': MODEL_TIERS.MEDIUM,
  'researcher': MODEL_TIERS.MEDIUM,
  'designer': MODEL_TIERS.MEDIUM,
  'vision': MODEL_TIERS.MEDIUM,
  'qa-tester': MODEL_TIERS.MEDIUM,
  'build-fixer': MODEL_TIERS.MEDIUM,
  'tdd-guide': MODEL_TIERS.MEDIUM,
  'scientist': MODEL_TIERS.MEDIUM,

  // High tier (Opus)
  'architect': MODEL_TIERS.HIGH,
  'executor-high': MODEL_TIERS.HIGH,
  'designer-high': MODEL_TIERS.HIGH,
  'planner': MODEL_TIERS.HIGH,
  'critic': MODEL_TIERS.HIGH,
  'analyst': MODEL_TIERS.HIGH,
  'qa-tester-high': MODEL_TIERS.HIGH,
  'security-reviewer': MODEL_TIERS.HIGH,
  'code-reviewer': MODEL_TIERS.HIGH,
  'scientist-high': MODEL_TIERS.HIGH
};

/**
 * Allowed paths for direct writes (no delegation warning)
 */
export const ALLOWED_WRITE_PATHS = [
  '~/.factory/omd/**',
  '.omd/**',
  '.claude/**',
  'CLAUDE.md',
  'AGENTS.md'
];

/**
 * Source file extensions that should trigger delegation warning
 */
export const SOURCE_EXTENSIONS = [
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  '.py', '.pyw',
  '.go',
  '.rs',
  '.java', '.kt', '.scala',
  '.c', '.cpp', '.h', '.hpp',
  '.svelte', '.vue',
  '.rb', '.php', '.swift', '.cs'
];

/**
 * Audit log path
 */
export const AUDIT_LOG_PATH = '.omd/logs/delegation-audit.jsonl';
