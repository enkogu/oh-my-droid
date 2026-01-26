/**
 * Autopilot Validation
 *
 * Validates autopilot completion and progress.
 * Adapted from oh-my-claudecode.
 */

import type { AutopilotState, AutopilotResult } from './types.js';

/**
 * Pattern to detect completion claim
 */
const COMPLETION_PATTERN = /<autopilot-complete>.*?GOAL_ACHIEVED.*?<\/autopilot-complete>/is;

/**
 * Check if text contains completion claim
 */
export function detectCompletion(text: string): boolean {
  return COMPLETION_PATTERN.test(text);
}

/**
 * Validate that autopilot can continue
 */
export function validateCanContinue(state: AutopilotState): {
  canContinue: boolean;
  reason?: string;
} {
  if (!state.active) {
    return { canContinue: false, reason: 'Autopilot not active' };
  }

  if (state.iteration >= state.max_iterations) {
    return { canContinue: false, reason: 'Maximum iterations reached' };
  }

  if (state.phase === 'complete') {
    return { canContinue: false, reason: 'Already complete' };
  }

  if (state.phase === 'failed') {
    return { canContinue: false, reason: 'Autopilot failed' };
  }

  return { canContinue: true };
}

/**
 * Check if verification is needed
 */
export function needsVerification(state: AutopilotState): boolean {
  if (!state.require_verification) {
    return false;
  }

  if (state.phase !== 'verifying') {
    return false;
  }

  // Check if we have a recent verification
  if (state.last_verification) {
    const verificationTime = new Date(state.last_verification.timestamp).getTime();
    const now = Date.now();
    // Re-verify if more than 5 minutes since last verification
    return now - verificationTime > 5 * 60 * 1000;
  }

  return true;
}

/**
 * Create result from state
 */
export function createResult(state: AutopilotState, success: boolean, reason?: string): AutopilotResult {
  return {
    success,
    iterations: state.iteration,
    phase: state.phase,
    failureReason: success ? undefined : reason
  };
}
