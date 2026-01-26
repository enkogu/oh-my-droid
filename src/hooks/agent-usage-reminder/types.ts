/**
 * Agent Usage Reminder Types
 *
 * Type definitions for the agent usage reminder hook.
 * Adapted from oh-my-claudecode.
 */

/**
 * Session state for tracking reminder display
 */
export interface ReminderSessionState {
  /** When the session started */
  startedAt: number;
  /** Number of reminders shown in this session */
  reminderCount: number;
  /** Timestamp of last reminder */
  lastReminderAt: number;
  /** Session ID */
  sessionId: string;
}

/**
 * Configuration for the reminder hook
 */
export interface ReminderConfig {
  /** Minimum prompt length to trigger analysis */
  minPromptLength?: number;
  /** Cooldown period in ms */
  cooldownMs?: number;
  /** Maximum reminders per session */
  maxRemindersPerSession?: number;
  /** Custom keywords to detect */
  customKeywords?: string[];
  /** Whether to enable the reminder */
  enabled?: boolean;
}

/**
 * Result of reminder analysis
 */
export interface ReminderAnalysis {
  /** Whether to show the reminder */
  shouldShow: boolean;
  /** Reason for the decision */
  reason: string;
  /** Detected keywords */
  detectedKeywords?: string[];
}
