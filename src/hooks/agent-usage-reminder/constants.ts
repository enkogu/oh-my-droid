/**
 * Agent Usage Reminder Constants
 *
 * Configuration and message templates for the agent usage reminder hook.
 * Adapted from oh-my-claudecode.
 */

/**
 * Keywords that indicate agent delegation might be appropriate
 */
export const DELEGATION_KEYWORDS = [
  'implement',
  'refactor',
  'build',
  'create',
  'add',
  'fix',
  'update',
  'modify',
  'change',
  'write',
  'develop',
  'design',
  'analyze',
  'debug',
  'test',
  'review',
  'document',
  'migrate',
  'upgrade',
  'deploy'
] as const;

/**
 * Minimum prompt length to trigger reminder
 */
export const MIN_PROMPT_LENGTH = 50;

/**
 * Cooldown period between reminders (ms)
 */
export const REMINDER_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Maximum reminders per session
 */
export const MAX_REMINDERS_PER_SESSION = 3;

/**
 * Reminder message template
 */
export const REMINDER_MESSAGE = `<agent-usage-reminder>

[REMINDER: Multi-Agent Orchestration Available]

You have access to specialized agents for complex tasks. Consider delegating:

- **executor**: Code implementation (single/multi-file changes)
- **architect**: Deep analysis, debugging, system design
- **designer**: UI/UX, frontend components
- **researcher**: Documentation lookup, API research
- **writer**: Documentation, technical writing

Use the Task tool with subagent_type="oh-my-droid:<agent>" to delegate.

Example:
\`\`\`
Task(subagent_type="oh-my-droid:executor", prompt="Implement the user authentication feature...")
\`\`\`

</agent-usage-reminder>

---

`;
