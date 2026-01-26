/**
 * Auto Slash Command Types
 *
 * Type definitions for automatic slash command detection and execution.
 * Adapted from oh-my-claudecode.
 */

/**
 * Detection result for a slash command
 */
export interface CommandDetection {
  /** The detected command name */
  command: string;
  /** The skill to invoke */
  skill: string;
  /** Confidence level (0-1) */
  confidence: number;
  /** The matched keywords */
  matchedKeywords: string[];
  /** The original prompt */
  originalPrompt: string;
  /** Extracted arguments */
  args?: string;
}

/**
 * Configuration for the detector
 */
export interface DetectorConfig {
  /** Minimum confidence to trigger auto-execution */
  confidenceThreshold?: number;
  /** Whether to enable auto-execution */
  autoExecute?: boolean;
  /** Custom keyword overrides */
  customKeywords?: Record<string, string[]>;
  /** Commands to disable */
  disabledCommands?: string[];
}

/**
 * Executor result
 */
export interface ExecutorResult {
  /** Whether execution was attempted */
  executed: boolean;
  /** The command that was executed */
  command?: string;
  /** The skill that was invoked */
  skill?: string;
  /** Injection message */
  message?: string;
  /** Error if any */
  error?: string;
}
