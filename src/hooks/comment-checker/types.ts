/**
 * Comment Checker Types
 *
 * Type definitions for the comment checker hook.
 * Adapted from oh-my-claudecode.
 */

/**
 * Comment type categories
 */
export type CommentType =
  | 'todo'
  | 'fixme'
  | 'hack'
  | 'note'
  | 'xxx'
  | 'bug'
  | 'optimize'
  | 'review';

/**
 * Detected comment
 */
export interface DetectedComment {
  /** Comment type */
  type: CommentType;
  /** The full comment text */
  text: string;
  /** File path where comment was found */
  file: string;
  /** Line number */
  line: number;
  /** Priority (1-3, 1 is highest) */
  priority: number;
}

/**
 * Comment check result
 */
export interface CommentCheckResult {
  /** Whether there are unresolved comments */
  hasUnresolved: boolean;
  /** List of detected comments */
  comments: DetectedComment[];
  /** Summary message */
  summary: string;
}

/**
 * Comment checker configuration
 */
export interface CommentCheckerConfig {
  /** Whether to enable the checker */
  enabled?: boolean;
  /** Comment types to check */
  types?: CommentType[];
  /** File patterns to include */
  includePatterns?: string[];
  /** File patterns to exclude */
  excludePatterns?: string[];
  /** Whether to block on comments */
  blocking?: boolean;
}
