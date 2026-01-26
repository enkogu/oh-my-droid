/**
 * Empty Message Sanitizer Constants
 *
 * Configuration for empty message handling.
 * Adapted from oh-my-claudecode.
 */

/**
 * Default placeholder for empty content
 */
export const DEFAULT_PLACEHOLDER = '[empty]';

/**
 * Part types that require content
 */
export const CONTENT_REQUIRED_TYPES = new Set([
  'text',
  'tool_result'
]);

/**
 * Part types that can be empty
 */
export const EMPTY_ALLOWED_TYPES = new Set([
  'thinking',
  'redacted_thinking',
  'step-start',
  'step-finish'
]);
