/**
 * Comment Checker Hook
 *
 * Detects and warns about unresolved TODO/FIXME comments in code.
 * Adapted from oh-my-claudecode.
 */

import {
  COMMENT_PATTERNS,
  COMMENT_PRIORITY,
  COMMENT_WARNING_MESSAGE
} from './constants.js';
import { shouldIncludeFile, isSourceFile } from './filters.js';
import type {
  CommentType,
  DetectedComment,
  CommentCheckResult,
  CommentCheckerConfig
} from './types.js';

// Export types
export type {
  CommentType,
  DetectedComment,
  CommentCheckResult,
  CommentCheckerConfig
} from './types.js';

// Export constants
export {
  COMMENT_PATTERNS,
  COMMENT_PRIORITY,
  DEFAULT_INCLUDE_PATTERNS,
  DEFAULT_EXCLUDE_PATTERNS,
  COMMENT_WARNING_MESSAGE
} from './constants.js';

// Export filters
export { shouldIncludeFile, isSourceFile, getFileExtension } from './filters.js';

/**
 * Detect comments in file content
 */
export function detectComments(
  content: string,
  filePath: string,
  types?: CommentType[]
): DetectedComment[] {
  const comments: DetectedComment[] = [];
  const lines = content.split('\n');
  const typesToCheck = types ?? (Object.keys(COMMENT_PATTERNS) as CommentType[]);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    for (const type of typesToCheck) {
      const patterns = COMMENT_PATTERNS[type];

      for (const pattern of patterns) {
        if (pattern.test(line)) {
          comments.push({
            type,
            text: line.trim(),
            file: filePath,
            line: i + 1,
            priority: COMMENT_PRIORITY[type]
          });
          break; // Don't double-count same line
        }
      }
    }
  }

  return comments;
}

/**
 * Check files for comments
 */
export function checkFiles(
  files: Array<{ path: string; content: string }>,
  config?: CommentCheckerConfig
): CommentCheckResult {
  const allComments: DetectedComment[] = [];

  for (const file of files) {
    if (!shouldIncludeFile(file.path, config?.includePatterns, config?.excludePatterns)) {
      continue;
    }

    const comments = detectComments(file.content, file.path, config?.types);
    allComments.push(...comments);
  }

  // Sort by priority
  allComments.sort((a, b) => a.priority - b.priority);

  const summary = allComments.length > 0
    ? `Found ${allComments.length} unresolved comment(s)`
    : 'No unresolved comments found';

  return {
    hasUnresolved: allComments.length > 0,
    comments: allComments,
    summary
  };
}

/**
 * Format comments for display
 */
export function formatComments(comments: DetectedComment[]): string {
  if (comments.length === 0) {
    return '';
  }

  return comments
    .map(c => `- [${c.type.toUpperCase()}] ${c.file}:${c.line}: ${c.text}`)
    .join('\n');
}

/**
 * Generate warning message
 */
export function getWarningMessage(result: CommentCheckResult): string {
  if (!result.hasUnresolved) {
    return '';
  }

  return COMMENT_WARNING_MESSAGE.replace('{comments}', formatComments(result.comments));
}

/**
 * Create the comment checker hook
 */
export function createCommentCheckerHook(config?: CommentCheckerConfig) {
  return {
    /**
     * PostToolUse - Check for comments in written files
     */
    postToolUse: (input: {
      session_id: string;
      tool_name: string;
      tool_input: Record<string, unknown>;
      tool_response?: string;
    }): string | null => {
      if (config?.enabled === false) return null;

      // Only check after Write/Edit operations
      if (!['Write', 'Edit'].includes(input.tool_name)) {
        return null;
      }

      const filePath = input.tool_input.file_path as string;
      if (!filePath || !isSourceFile(filePath)) {
        return null;
      }

      // We'd need the file content to check - this is a simplified version
      // In a full implementation, we'd read the file after write
      return null;
    }
  };
}
