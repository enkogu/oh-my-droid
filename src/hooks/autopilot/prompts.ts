/**
 * Autopilot Prompts
 *
 * System prompts and messages for autopilot mode.
 * Adapted from oh-my-claudecode.
 */

import type { AutopilotState } from './types.js';

/**
 * Planning phase prompt
 */
export function getPlanningPrompt(goal: string): string {
  return `<autopilot-planning>

[AUTOPILOT: PLANNING PHASE]

You are in autopilot mode. Your goal is:

**${goal}**

## PLANNING INSTRUCTIONS

1. **Analyze the Goal**
   - Break down the task into discrete, actionable steps
   - Identify dependencies between steps
   - Estimate complexity of each step

2. **Create a Plan**
   - Use TodoWrite to create a comprehensive task list
   - Order tasks by dependency and priority
   - Include verification steps

3. **Identify Resources**
   - What files need to be read/modified?
   - What tools are needed?
   - What agents should be delegated to?

4. **Risk Assessment**
   - What could go wrong?
   - What are the rollback options?

After planning, move to EXECUTING phase.

</autopilot-planning>

---

`;
}

/**
 * Execution phase prompt
 */
export function getExecutionPrompt(state: AutopilotState): string {
  return `<autopilot-execution>

[AUTOPILOT: EXECUTION PHASE - Iteration ${state.iteration}/${state.max_iterations}]

Goal: ${state.goal}

## EXECUTION INSTRUCTIONS

1. **Check Todo List**
   - Review current progress
   - Identify next pending task
   - Mark tasks complete as you finish them

2. **Execute with Parallelism**
   - Fire independent operations in parallel
   - Use Task tool for complex subtasks
   - Don't wait unnecessarily

3. **Verify Each Step**
   - Check that changes compile/work
   - Run relevant tests
   - Fix issues immediately

4. **Progress Tracking**
   - Update todos after each step
   - Note any blockers or issues
   - Record learnings

Continue until all todos are complete, then move to VERIFYING phase.

</autopilot-execution>

---

`;
}

/**
 * Verification phase prompt
 */
export function getVerificationPrompt(state: AutopilotState): string {
  return `<autopilot-verification>

[AUTOPILOT: VERIFICATION PHASE]

Goal: ${state.goal}

## VERIFICATION CHECKLIST

${state.require_verification ? `
**ARCHITECT VERIFICATION REQUIRED**

Before claiming completion, you MUST invoke the architect agent to verify:

\`\`\`
Task(subagent_type="oh-my-droid:architect", prompt="Verify this autopilot task completion...")
\`\`\`
` : ''}

1. **Functionality Check**
   - Does the implementation meet all requirements?
   - Are all edge cases handled?

2. **Quality Check**
   - Code compiles without errors
   - Tests pass
   - No linting errors

3. **Completeness Check**
   - All todos marked complete
   - No TODO/FIXME comments left behind
   - Documentation updated if needed

4. **Final Verification**
   - Run the full test suite
   - Verify the feature works end-to-end

If verification passes, output:
\`\`\`
<autopilot-complete>GOAL_ACHIEVED</autopilot-complete>
\`\`\`

If issues found, return to EXECUTING phase.

</autopilot-verification>

---

`;
}

/**
 * Continuation prompt for incomplete state
 */
export function getContinuationPrompt(state: AutopilotState): string {
  return `<autopilot-continuation>

[AUTOPILOT RESTORED - Iteration ${state.iteration}/${state.max_iterations}]

Your autopilot session was interrupted. Resuming...

**Goal:** ${state.goal}
**Phase:** ${state.phase}
${state.last_verification ? `**Last Verification:** ${state.last_verification.approved ? 'Approved' : 'Rejected - ' + state.last_verification.feedback}` : ''}

Continue from where you left off. Check your todo list for pending tasks.

</autopilot-continuation>

---

`;
}
