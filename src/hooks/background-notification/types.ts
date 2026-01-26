/**
 * Background Notification Types
 *
 * Type definitions for background task notification system.
 * Adapted from oh-my-claudecode.
 */

/**
 * Background task status
 */
export type TaskStatus = 'pending' | 'running' | 'completed' | 'error' | 'cancelled';

/**
 * Background task information
 */
export interface BackgroundTask {
  /** Unique task identifier */
  id: string;
  /** Session ID the task belongs to */
  sessionId: string;
  /** Task description */
  description: string;
  /** Subagent type */
  subagentType?: string;
  /** Current status */
  status: TaskStatus;
  /** When the task was started */
  startedAt: string;
  /** When the task completed */
  completedAt?: string;
  /** Task output/result */
  output?: string;
  /** Error message if failed */
  error?: string;
}

/**
 * Notification configuration
 */
export interface NotificationConfig {
  /** Whether to show notifications */
  enabled?: boolean;
  /** Whether to show completion notifications */
  showCompletion?: boolean;
  /** Whether to show error notifications */
  showErrors?: boolean;
  /** Custom notification format */
  customFormat?: (task: BackgroundTask) => string;
}
