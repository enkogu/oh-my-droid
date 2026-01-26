/**
 * Autopilot Cancel
 *
 * Handles cancellation of autopilot mode.
 * Adapted from oh-my-claudecode.
 */

import { readAutopilotState, clearAutopilotState } from './state.js';
import type { AutopilotResult } from './types.js';

/**
 * Cancel autopilot session
 */
export function cancelAutopilot(directory: string): {
  cancelled: boolean;
  result?: AutopilotResult;
  message: string;
} {
  const state = readAutopilotState(directory);

  if (!state || !state.active) {
    return {
      cancelled: false,
      message: 'No active autopilot session to cancel.'
    };
  }

  const result: AutopilotResult = {
    success: false,
    iterations: state.iteration,
    phase: state.phase,
    failureReason: 'Cancelled by user'
  };

  const cleared = clearAutopilotState(directory);

  return {
    cancelled: cleared,
    result,
    message: cleared
      ? `Autopilot cancelled after ${state.iteration} iterations. Phase was: ${state.phase}`
      : 'Failed to clear autopilot state.'
  };
}

/**
 * Generate cancel confirmation message
 */
export function getCancelMessage(): string {
  return `<autopilot-cancelled>

[AUTOPILOT CANCELLED]

The autopilot session has been cancelled. You can:
- Start a new autopilot session with a different goal
- Continue manually from where autopilot left off
- Check the todo list for remaining tasks

</autopilot-cancelled>

---

`;
}
