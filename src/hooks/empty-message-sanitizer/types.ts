/**
 * Empty Message Sanitizer Types
 *
 * Type definitions for empty message sanitization.
 * Adapted from oh-my-claudecode.
 */

/**
 * Message part structure
 */
export interface MessagePart {
  type: string;
  text?: string;
  [key: string]: unknown;
}

/**
 * Sanitization result
 */
export interface SanitizationResult {
  /** Whether sanitization was applied */
  sanitized: boolean;
  /** Original empty parts count */
  emptyPartsCount: number;
  /** Parts after sanitization */
  parts: MessagePart[];
}

/**
 * Configuration for sanitizer
 */
export interface SanitizerConfig {
  /** Placeholder text for empty content */
  placeholder?: string;
  /** Whether to strip empty parts entirely */
  stripEmpty?: boolean;
  /** Whether to log sanitization */
  debug?: boolean;
}
