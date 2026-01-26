/**
 * Auto Slash Command Hook
 *
 * Automatically detects and executes slash commands from natural language.
 * Adapted from oh-my-claudecode.
 */

import { detectCommand, shouldAutoExecute } from './detector.js';
import { executeCommand, formatAnnouncement } from './executor.js';
import type { DetectorConfig, CommandDetection, ExecutorResult } from './types.js';

// Export types
export type { CommandDetection, DetectorConfig, ExecutorResult } from './types.js';

// Export constants
export {
  TRIGGER_KEYWORDS,
  COMMAND_MAPPINGS,
  COMMAND_PRIORITY,
  DEFAULT_CONFIDENCE_THRESHOLD,
  AUTO_EXECUTE_COOLDOWN_MS
} from './constants.js';

// Export functions
export { detectCommand, shouldAutoExecute } from './detector.js';
export { executeCommand, formatAnnouncement } from './executor.js';

/**
 * State for cooldown tracking
 */
const lastExecutionTime = new Map<string, number>();

/**
 * Create the auto slash command hook
 */
export function createAutoSlashCommandHook(config?: DetectorConfig) {
  return {
    /**
     * PreToolUse - Detect and execute slash commands
     */
    preToolUse: (input: {
      session_id: string;
      tool_input: { prompt?: string };
    }): string | null => {
      const prompt = input.tool_input.prompt;
      if (!prompt) return null;

      // Check cooldown
      const lastExec = lastExecutionTime.get(input.session_id) ?? 0;
      const now = Date.now();
      if (now - lastExec < 5000) {
        return null;
      }

      // Detect command
      const detection = detectCommand(prompt, config);
      if (!detection || !shouldAutoExecute(detection, config)) {
        return null;
      }

      // Execute
      const result = executeCommand(detection);
      if (!result.executed || !result.message) {
        return null;
      }

      // Record execution time
      lastExecutionTime.set(input.session_id, now);

      return result.message;
    },

    /**
     * Detect command without executing (for inspection)
     */
    detect: (prompt: string): CommandDetection | null => {
      return detectCommand(prompt, config);
    }
  };
}
