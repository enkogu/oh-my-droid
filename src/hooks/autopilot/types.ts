/**
 * Autopilot Types
 *
 * Type definitions for the autopilot mode.
 * Adapted from oh-my-claudecode.
 */

/**
 * Autopilot session state
 */
export interface AutopilotState {
  /** Whether autopilot is active */
  active: boolean;
  /** When autopilot started */
  started_at: string;
  /** The original task/goal */
  goal: string;
  /** Current phase */
  phase: AutopilotPhase;
  /** Number of iterations */
  iteration: number;
  /** Maximum iterations allowed */
  max_iterations: number;
  /** Session ID */
  session_id?: string;
  /** Whether architect verification is required */
  require_verification: boolean;
  /** Last verification result */
  last_verification?: {
    approved: boolean;
    feedback: string;
    timestamp: string;
  };
}

/**
 * Autopilot phases
 */
export type AutopilotPhase =
  | 'planning'
  | 'executing'
  | 'verifying'
  | 'complete'
  | 'failed';

/**
 * Autopilot configuration
 */
export interface AutopilotConfig {
  /** Maximum iterations (default: 15) */
  maxIterations?: number;
  /** Whether to require architect verification */
  requireVerification?: boolean;
  /** Custom planning prompt */
  planningPrompt?: string;
  /** Custom verification prompt */
  verificationPrompt?: string;
}

/**
 * Autopilot result
 */
export interface AutopilotResult {
  /** Whether the goal was achieved */
  success: boolean;
  /** Number of iterations taken */
  iterations: number;
  /** Final phase */
  phase: AutopilotPhase;
  /** Summary of what was done */
  summary?: string;
  /** Reason for failure if any */
  failureReason?: string;
}
