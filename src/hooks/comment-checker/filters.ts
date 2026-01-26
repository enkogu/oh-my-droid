/**
 * Comment Checker Filters
 *
 * File filtering utilities for comment checking.
 * Adapted from oh-my-claudecode.
 */

import { DEFAULT_INCLUDE_PATTERNS, DEFAULT_EXCLUDE_PATTERNS } from './constants.js';

/**
 * Simple glob pattern matching
 */
function matchesPattern(path: string, pattern: string): boolean {
  // Convert glob to regex
  const regex = pattern
    .replace(/\*\*/g, '<<<DOUBLE>>>')
    .replace(/\*/g, '[^/]*')
    .replace(/<<<DOUBLE>>>/g, '.*')
    .replace(/\?/g, '.')
    .replace(/\./g, '\\.');

  return new RegExp(`^${regex}$`).test(path);
}

/**
 * Check if a file should be included
 */
export function shouldIncludeFile(
  filePath: string,
  includePatterns?: string[],
  excludePatterns?: string[]
): boolean {
  const includes = includePatterns ?? DEFAULT_INCLUDE_PATTERNS;
  const excludes = excludePatterns ?? DEFAULT_EXCLUDE_PATTERNS;

  // Check excludes first
  for (const pattern of excludes) {
    if (matchesPattern(filePath, pattern)) {
      return false;
    }
  }

  // Check includes
  for (const pattern of includes) {
    if (matchesPattern(filePath, pattern)) {
      return true;
    }
  }

  return false;
}

/**
 * Get file extension
 */
export function getFileExtension(filePath: string): string {
  const match = filePath.match(/\.([^.]+)$/);
  return match ? match[1] : '';
}

/**
 * Check if file is a source code file
 */
export function isSourceFile(filePath: string): boolean {
  const sourceExtensions = new Set([
    'ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs',
    'py', 'go', 'rs', 'java', 'c', 'cpp', 'h', 'hpp',
    'rb', 'php', 'swift', 'kt', 'scala', 'cs'
  ]);

  const ext = getFileExtension(filePath);
  return sourceExtensions.has(ext);
}
