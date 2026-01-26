/**
 * Agent Usage Reminder Hook
 *
 * Reminds users about agent orchestration capabilities for complex tasks.
 * Adapted from oh-my-claudecode.
 */

import {
  DELEGATION_KEYWORDS,
  MIN_PROMPT_LENGTH,
  REMINDER_COOLDOWN_MS,
  MAX_REMINDERS_PER_SESSION,
  REMINDER_MESSAGE
} from './constants.js';
import { getSessionState, recordReminder, cleanupStaleSessions } from './storage.js';
import type { ReminderConfig, ReminderAnalysis } from './types.js';

// Export types
export type { ReminderSessionState, ReminderConfig, ReminderAnalysis } from './types.js';

// Export constants
export {
  DELEGATION_KEYWORDS,
  MIN_PROMPT_LENGTH,
  REMINDER_COOLDOWN_MS,
  MAX_REMINDERS_PER_SESSION,
  REMINDER_MESSAGE
} from './constants.js';

// Export storage functions
export {
  getSessionState,
  recordReminder,
  cleanupStaleSessions,
  clearSessionState
} from './storage.js';

/**
 * Analyze if reminder should be shown
 */
export function analyzePrompt(
  prompt: string,
  config?: ReminderConfig
): ReminderAnalysis {
  const minLength = config?.minPromptLength ?? MIN_PROMPT_LENGTH;
  const keywords = config?.customKeywords ?? DELEGATION_KEYWORDS;

  // Check minimum length
  if (prompt.length < minLength) {
    return {
      shouldShow: false,
      reason: 'Prompt too short'
    };
  }

  // Detect keywords
  const promptLower = prompt.toLowerCase();
  const detectedKeywords = keywords.filter(kw =>
    promptLower.includes(kw.toLowerCase())
  );

  if (detectedKeywords.length === 0) {
    return {
      shouldShow: false,
      reason: 'No delegation keywords detected'
    };
  }

  return {
    shouldShow: true,
    reason: 'Complex task detected',
    detectedKeywords: detectedKeywords as string[]
  };
}

/**
 * Check if reminder should be shown for a session
 */
export function shouldShowReminder(
  sessionId: string,
  prompt: string,
  config?: ReminderConfig
): { show: boolean; message?: string } {
  if (config?.enabled === false) {
    return { show: false };
  }

  const state = getSessionState(sessionId);
  const now = Date.now();

  // Check cooldown
  const cooldownMs = config?.cooldownMs ?? REMINDER_COOLDOWN_MS;
  if (now - state.lastReminderAt < cooldownMs) {
    return { show: false };
  }

  // Check max reminders
  const maxReminders = config?.maxRemindersPerSession ?? MAX_REMINDERS_PER_SESSION;
  if (state.reminderCount >= maxReminders) {
    return { show: false };
  }

  // Analyze prompt
  const analysis = analyzePrompt(prompt, config);
  if (!analysis.shouldShow) {
    return { show: false };
  }

  // Record and return
  recordReminder(sessionId);

  return {
    show: true,
    message: REMINDER_MESSAGE
  };
}

/**
 * Create the hook
 */
export function createAgentUsageReminderHook(config?: ReminderConfig) {
  // Start cleanup interval
  setInterval(cleanupStaleSessions, 10 * 60 * 1000); // Every 10 minutes

  return {
    /**
     * PreToolUse - Check before prompts
     */
    preToolUse: (input: {
      session_id: string;
      tool_input: { prompt?: string };
    }): string | null => {
      const prompt = input.tool_input.prompt;
      if (!prompt) {
        return null;
      }

      const result = shouldShowReminder(input.session_id, prompt, config);
      return result.show ? (result.message ?? null) : null;
    }
  };
}
