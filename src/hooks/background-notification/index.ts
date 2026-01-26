/**
 * Background Notification Hook
 *
 * Tracks and notifies about background task completion.
 * Adapted from oh-my-claudecode.
 */

import type { BackgroundTask, TaskStatus, NotificationConfig } from './types.js';

// Export types
export type { BackgroundTask, TaskStatus, NotificationConfig } from './types.js';

/**
 * In-memory storage for background tasks
 */
const tasks = new Map<string, BackgroundTask>();
const sessionTasks = new Map<string, Set<string>>();

/**
 * Generate unique task ID
 */
function generateTaskId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Register a new background task
 */
export function registerTask(
  sessionId: string,
  description: string,
  subagentType?: string
): BackgroundTask {
  const id = generateTaskId();

  const task: BackgroundTask = {
    id,
    sessionId,
    description,
    subagentType,
    status: 'pending',
    startedAt: new Date().toISOString()
  };

  tasks.set(id, task);

  // Track by session
  if (!sessionTasks.has(sessionId)) {
    sessionTasks.set(sessionId, new Set());
  }
  sessionTasks.get(sessionId)!.add(id);

  return task;
}

/**
 * Update task status
 */
export function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
  output?: string,
  error?: string
): BackgroundTask | null {
  const task = tasks.get(taskId);
  if (!task) return null;

  task.status = status;

  if (status === 'completed' || status === 'error' || status === 'cancelled') {
    task.completedAt = new Date().toISOString();
  }

  if (output) task.output = output;
  if (error) task.error = error;

  return task;
}

/**
 * Get all tasks for a session
 */
export function getSessionTasks(sessionId: string): BackgroundTask[] {
  const taskIds = sessionTasks.get(sessionId);
  if (!taskIds) return [];

  return Array.from(taskIds)
    .map(id => tasks.get(id))
    .filter((t): t is BackgroundTask => t !== undefined);
}

/**
 * Get pending tasks for a session
 */
export function getPendingTasks(sessionId: string): BackgroundTask[] {
  return getSessionTasks(sessionId).filter(t =>
    t.status === 'pending' || t.status === 'running'
  );
}

/**
 * Get completed tasks that haven't been acknowledged
 */
export function getCompletedTasks(sessionId: string): BackgroundTask[] {
  return getSessionTasks(sessionId).filter(t =>
    t.status === 'completed' || t.status === 'error'
  );
}

/**
 * Remove a task
 */
export function removeTask(taskId: string): boolean {
  const task = tasks.get(taskId);
  if (!task) return false;

  tasks.delete(taskId);
  sessionTasks.get(task.sessionId)?.delete(taskId);

  return true;
}

/**
 * Clean up completed tasks for a session
 */
export function cleanupSessionTasks(sessionId: string): number {
  const completed = getCompletedTasks(sessionId);
  for (const task of completed) {
    removeTask(task.id);
  }
  return completed.length;
}

/**
 * Format task completion notification
 */
export function formatNotification(task: BackgroundTask): string {
  const statusEmoji = task.status === 'completed' ? '[DONE]' : '[ERROR]';
  const duration = task.completedAt
    ? Math.round((new Date(task.completedAt).getTime() - new Date(task.startedAt).getTime()) / 1000)
    : 0;

  let message = `${statusEmoji} Background task completed: ${task.description}`;

  if (duration > 0) {
    message += ` (${duration}s)`;
  }

  if (task.error) {
    message += `\nError: ${task.error}`;
  }

  return message;
}

/**
 * Create the background notification hook
 */
export function createBackgroundNotificationHook(config?: NotificationConfig) {
  return {
    /**
     * PreToolUse - Register new background tasks
     */
    preToolUse: (input: {
      session_id: string;
      tool_name: string;
      tool_input: Record<string, unknown>;
    }): string | null => {
      if (input.tool_name !== 'Task') return null;

      const toolInput = input.tool_input as {
        description?: string;
        subagent_type?: string;
        run_in_background?: boolean;
      };

      if (!toolInput.run_in_background) return null;

      registerTask(
        input.session_id,
        toolInput.description || 'Background task',
        toolInput.subagent_type
      );

      return null;
    },

    /**
     * PostToolUse - Check for completed tasks
     */
    postToolUse: (input: {
      session_id: string;
      tool_name: string;
    }): string | null => {
      if (config?.enabled === false) return null;

      const completed = getCompletedTasks(input.session_id);
      if (completed.length === 0) return null;

      const notifications = completed.map(task => formatNotification(task));
      cleanupSessionTasks(input.session_id);

      if (notifications.length === 0) return null;

      return `<background-tasks-completed>

${notifications.join('\n\n')}

</background-tasks-completed>

---

`;
    },

    /**
     * Get pending tasks count
     */
    getPendingCount: (sessionId: string): number => {
      return getPendingTasks(sessionId).length;
    }
  };
}
