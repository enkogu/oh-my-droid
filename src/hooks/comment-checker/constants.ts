/**
 * Comment Checker Constants
 *
 * Patterns and configuration for comment detection.
 * Adapted from oh-my-claudecode.
 */

import type { CommentType } from './types.js';

/**
 * Comment patterns by type
 */
export const COMMENT_PATTERNS: Record<CommentType, RegExp[]> = {
  todo: [
    /\/\/\s*TODO[:\s]/i,
    /\/\*\s*TODO[:\s]/i,
    /#\s*TODO[:\s]/i,
    /<!--\s*TODO[:\s]/i
  ],
  fixme: [
    /\/\/\s*FIXME[:\s]/i,
    /\/\*\s*FIXME[:\s]/i,
    /#\s*FIXME[:\s]/i,
    /<!--\s*FIXME[:\s]/i
  ],
  hack: [
    /\/\/\s*HACK[:\s]/i,
    /\/\*\s*HACK[:\s]/i,
    /#\s*HACK[:\s]/i
  ],
  note: [
    /\/\/\s*NOTE[:\s]/i,
    /\/\*\s*NOTE[:\s]/i,
    /#\s*NOTE[:\s]/i
  ],
  xxx: [
    /\/\/\s*XXX[:\s]/i,
    /\/\*\s*XXX[:\s]/i,
    /#\s*XXX[:\s]/i
  ],
  bug: [
    /\/\/\s*BUG[:\s]/i,
    /\/\*\s*BUG[:\s]/i,
    /#\s*BUG[:\s]/i
  ],
  optimize: [
    /\/\/\s*OPTIMIZE[:\s]/i,
    /\/\*\s*OPTIMIZE[:\s]/i,
    /#\s*OPTIMIZE[:\s]/i
  ],
  review: [
    /\/\/\s*REVIEW[:\s]/i,
    /\/\*\s*REVIEW[:\s]/i,
    /#\s*REVIEW[:\s]/i
  ]
};

/**
 * Priority by comment type (1 = highest)
 */
export const COMMENT_PRIORITY: Record<CommentType, number> = {
  bug: 1,
  fixme: 1,
  hack: 2,
  todo: 2,
  xxx: 2,
  optimize: 3,
  review: 3,
  note: 3
};

/**
 * Default file patterns to include
 */
export const DEFAULT_INCLUDE_PATTERNS = [
  '**/*.ts',
  '**/*.tsx',
  '**/*.js',
  '**/*.jsx',
  '**/*.py',
  '**/*.go',
  '**/*.rs',
  '**/*.java',
  '**/*.c',
  '**/*.cpp',
  '**/*.h'
];

/**
 * Default file patterns to exclude
 */
export const DEFAULT_EXCLUDE_PATTERNS = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/.git/**',
  '**/vendor/**',
  '**/__pycache__/**'
];

/**
 * Warning message template
 */
export const COMMENT_WARNING_MESSAGE = `<unresolved-comments>

[WARNING: Unresolved Comments Detected]

The following comments were found in changed files:

{comments}

Consider addressing these before committing.

</unresolved-comments>

---

`;
