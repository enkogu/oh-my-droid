/**
 * Agent Usage Reminder Storage
 *
 * Session state management for reminder tracking.
 * Adapted from oh-my-claudecode.
 */

import type { ReminderSessionState } from './types.js';

/**
 * In-memory session state storage
 */
const sessionStates = new Map<string, ReminderSessionState>();

/**
 * Get or create session state
 */
export function getSessionState(sessionId: string): ReminderSessionState {
  let state = sessionStates.get(sessionId);

  if (!state) {
    state = {
      startedAt: Date.now(),
      reminderCount: 0,
      lastReminderAt: 0,
      sessionId
    };
    sessionStates.set(sessionId, state);
  }

  return state;
}

/**
 * Update session state
 */
export function updateSessionState(
  sessionId: string,
  updates: Partial<ReminderSessionState>
): ReminderSessionState {
  const state = getSessionState(sessionId);
  const updated = { ...state, ...updates };
  sessionStates.set(sessionId, updated);
  return updated;
}

/**
 * Record that a reminder was shown
 */
export function recordReminder(sessionId: string): ReminderSessionState {
  const state = getSessionState(sessionId);
  return updateSessionState(sessionId, {
    reminderCount: state.reminderCount + 1,
    lastReminderAt: Date.now()
  });
}

/**
 * Clean up stale sessions (older than 1 hour)
 */
export function cleanupStaleSessions(): void {
  const now = Date.now();
  const maxAge = 60 * 60 * 1000; // 1 hour

  for (const [sessionId, state] of sessionStates) {
    if (now - state.startedAt > maxAge) {
      sessionStates.delete(sessionId);
    }
  }
}

/**
 * Clear session state
 */
export function clearSessionState(sessionId: string): void {
  sessionStates.delete(sessionId);
}
