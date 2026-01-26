/**
 * Auto Slash Command Executor
 *
 * Executes detected slash commands by injecting skill invocation prompts.
 * Adapted from oh-my-claudecode.
 */

import type { CommandDetection, ExecutorResult } from './types.js';

/**
 * Execute a detected command by generating injection message
 */
export function executeCommand(detection: CommandDetection): ExecutorResult {
  if (!detection) {
    return { executed: false };
  }

  const message = generateInjectionMessage(detection);

  return {
    executed: true,
    command: detection.command,
    skill: detection.skill,
    message
  };
}

/**
 * Generate the injection message for a command
 */
function generateInjectionMessage(detection: CommandDetection): string {
  const { command, skill, matchedKeywords, originalPrompt, args } = detection;

  // Extract the task from the prompt (remove the keyword)
  let task = originalPrompt;
  for (const kw of matchedKeywords) {
    task = task.replace(new RegExp(kw, 'gi'), '').trim();
  }
  task = task.replace(/^[:\s]+/, '').trim();

  return `<auto-slash-command>

[AUTO-DETECTED: ${command.toUpperCase()} MODE]

The user's request matches the "${command}" skill pattern.
Activating: ${skill}

**Original Request:**
${originalPrompt}

**Task:**
${task || args || originalPrompt}

---

The ${command} skill is now active. Follow its protocols.

</auto-slash-command>

---

`;
}

/**
 * Format announcement for auto-execution
 */
export function formatAnnouncement(detection: CommandDetection): string {
  return `I'm activating **${detection.command}** mode based on your request.`;
}
