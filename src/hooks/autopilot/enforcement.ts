/**
 * Autopilot Enforcement
 *
 * Enforces autopilot mode rules and prevents premature stopping.
 * Adapted from oh-my-claudecode.
 */

import type { AutopilotState } from './types.js';
import { validateCanContinue, needsVerification } from './validation.js';
import { getExecutionPrompt, getVerificationPrompt, getContinuationPrompt } from './prompts.js';

/**
 * Generate enforcement message when stop is attempted
 */
export function getEnforcementMessage(state: AutopilotState): string {
  const validation = validateCanContinue(state);

  if (!validation.canContinue) {
    return ''; // Allow stop
  }

  return `<autopilot-enforcement>

[AUTOPILOT: STOP BLOCKED]

You are in autopilot mode. You cannot stop until:
1. All todos are complete
2. Verification has passed
3. Goal is achieved

**Current State:**
- Phase: ${state.phase}
- Iteration: ${state.iteration}/${state.max_iterations}
- Goal: ${state.goal}

Continue working on the next pending task.

</autopilot-enforcement>

---

${getPhasePrompt(state)}
`;
}

/**
 * Get appropriate prompt for current phase
 */
function getPhasePrompt(state: AutopilotState): string {
  switch (state.phase) {
    case 'planning':
      return getExecutionPrompt(state); // Move to execution
    case 'executing':
      if (needsVerification(state)) {
        return getVerificationPrompt(state);
      }
      return getExecutionPrompt(state);
    case 'verifying':
      return getVerificationPrompt(state);
    default:
      return getContinuationPrompt(state);
  }
}

/**
 * Check if stop should be blocked
 */
export function shouldBlockStop(state: AutopilotState | null): boolean {
  if (!state || !state.active) {
    return false;
  }

  const validation = validateCanContinue(state);
  return validation.canContinue;
}
