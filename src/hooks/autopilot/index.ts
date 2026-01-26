/**
 * Autopilot Hook
 *
 * Fully autonomous execution mode from idea to working code.
 * Adapted from oh-my-claudecode.
 */

import {
  readAutopilotState,
  writeAutopilotState,
  clearAutopilotState,
  updatePhase,
  incrementIteration,
  isAutopilotActive
} from './state.js';
import {
  getPlanningPrompt,
  getExecutionPrompt,
  getVerificationPrompt,
  getContinuationPrompt
} from './prompts.js';
import { detectCompletion, validateCanContinue, needsVerification, createResult } from './validation.js';
import { getEnforcementMessage, shouldBlockStop } from './enforcement.js';
import { cancelAutopilot, getCancelMessage } from './cancel.js';
import type { AutopilotState, AutopilotConfig, AutopilotResult, AutopilotPhase } from './types.js';

// Export types
export type { AutopilotState, AutopilotConfig, AutopilotResult, AutopilotPhase } from './types.js';

// Export state functions
export {
  readAutopilotState,
  writeAutopilotState,
  clearAutopilotState,
  updatePhase,
  incrementIteration,
  isAutopilotActive
} from './state.js';

// Export prompt functions
export {
  getPlanningPrompt,
  getExecutionPrompt,
  getVerificationPrompt,
  getContinuationPrompt
} from './prompts.js';

// Export validation functions
export { detectCompletion, validateCanContinue, needsVerification, createResult } from './validation.js';

// Export enforcement functions
export { getEnforcementMessage, shouldBlockStop } from './enforcement.js';

// Export cancel functions
export { cancelAutopilot, getCancelMessage } from './cancel.js';

/**
 * Start autopilot mode
 */
export function startAutopilot(
  directory: string,
  goal: string,
  sessionId: string,
  config?: AutopilotConfig
): { success: boolean; state?: AutopilotState; message: string } {
  // Check if already active
  if (isAutopilotActive(directory)) {
    return {
      success: false,
      message: 'Autopilot is already active. Cancel it first with /oh-my-droid:cancel-autopilot'
    };
  }

  const state: AutopilotState = {
    active: true,
    started_at: new Date().toISOString(),
    goal,
    phase: 'planning',
    iteration: 1,
    max_iterations: config?.maxIterations ?? 15,
    session_id: sessionId,
    require_verification: config?.requireVerification ?? true
  };

  const written = writeAutopilotState(directory, state);

  if (!written) {
    return {
      success: false,
      message: 'Failed to initialize autopilot state.'
    };
  }

  return {
    success: true,
    state,
    message: getPlanningPrompt(goal)
  };
}

/**
 * Create the autopilot hook
 */
export function createAutopilotHook(config?: AutopilotConfig) {
  return {
    /**
     * Stop handler - block premature stopping
     */
    stop: (input: { session_id: string; directory?: string }): string | null => {
      const directory = input.directory || process.cwd();
      const state = readAutopilotState(directory);

      if (shouldBlockStop(state)) {
        return getEnforcementMessage(state!);
      }

      return null;
    },

    /**
     * Session start - restore autopilot state
     */
    sessionStart: (input: { session_id: string; directory?: string }): string | null => {
      const directory = input.directory || process.cwd();
      const state = readAutopilotState(directory);

      if (state && state.active) {
        incrementIteration(directory);
        return getContinuationPrompt(state);
      }

      return null;
    },

    /**
     * Post tool use - check for completion
     */
    postToolUse: (input: {
      session_id: string;
      tool_response?: string;
      directory?: string;
    }): string | null => {
      if (!input.tool_response) return null;

      const directory = input.directory || process.cwd();
      const state = readAutopilotState(directory);

      if (!state || !state.active) return null;

      // Check for completion
      if (detectCompletion(input.tool_response)) {
        updatePhase(directory, 'complete');
        clearAutopilotState(directory);
        return null; // Allow natural completion
      }

      return null;
    },

    /**
     * Start autopilot (for skill invocation)
     */
    start: (directory: string, goal: string, sessionId: string) =>
      startAutopilot(directory, goal, sessionId, config),

    /**
     * Cancel autopilot
     */
    cancel: (directory: string) => cancelAutopilot(directory),

    /**
     * Get current state
     */
    getState: (directory: string) => readAutopilotState(directory)
  };
}
