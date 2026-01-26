/**
 * Empty Message Sanitizer Hook
 *
 * Sanitizes messages to prevent API errors from empty content.
 * Adapted from oh-my-claudecode.
 */

import {
  DEFAULT_PLACEHOLDER,
  CONTENT_REQUIRED_TYPES,
  EMPTY_ALLOWED_TYPES
} from './constants.js';
import type { MessagePart, SanitizationResult, SanitizerConfig } from './types.js';

// Export types
export type { MessagePart, SanitizationResult, SanitizerConfig } from './types.js';

// Export constants
export {
  DEFAULT_PLACEHOLDER,
  CONTENT_REQUIRED_TYPES,
  EMPTY_ALLOWED_TYPES
} from './constants.js';

/**
 * Check if a part has empty content that needs sanitization
 */
export function isEmptyPart(part: MessagePart): boolean {
  // Skip types that don't require content
  if (EMPTY_ALLOWED_TYPES.has(part.type)) {
    return false;
  }

  // Check text parts
  if (part.type === 'text') {
    return !part.text || part.text.trim() === '';
  }

  return false;
}

/**
 * Sanitize a single message part
 */
export function sanitizePart(
  part: MessagePart,
  config?: SanitizerConfig
): MessagePart {
  if (!isEmptyPart(part)) {
    return part;
  }

  const placeholder = config?.placeholder ?? DEFAULT_PLACEHOLDER;

  // Strip if configured
  if (config?.stripEmpty) {
    return { ...part, _stripped: true };
  }

  // Replace empty text
  if (part.type === 'text') {
    return { ...part, text: placeholder };
  }

  return part;
}

/**
 * Sanitize all parts in a message
 */
export function sanitizeMessage(
  parts: MessagePart[],
  config?: SanitizerConfig
): SanitizationResult {
  let emptyCount = 0;
  const sanitizedParts: MessagePart[] = [];

  for (const part of parts) {
    if (isEmptyPart(part)) {
      emptyCount++;
    }

    const sanitized = sanitizePart(part, config);

    // Skip stripped parts
    if (config?.stripEmpty && (sanitized as { _stripped?: boolean })._stripped) {
      continue;
    }

    sanitizedParts.push(sanitized);
  }

  return {
    sanitized: emptyCount > 0,
    emptyPartsCount: emptyCount,
    parts: sanitizedParts
  };
}

/**
 * Create the empty message sanitizer hook
 */
export function createEmptyMessageSanitizerHook(config?: SanitizerConfig) {
  return {
    /**
     * Message pre-processing - sanitize before sending to API
     */
    preProcess: (parts: MessagePart[]): MessagePart[] => {
      const result = sanitizeMessage(parts, config);

      if (config?.debug && result.sanitized) {
        console.log(`[empty-message-sanitizer] Sanitized ${result.emptyPartsCount} empty parts`);
      }

      return result.parts;
    },

    /**
     * Check if message needs sanitization
     */
    needsSanitization: (parts: MessagePart[]): boolean => {
      return parts.some(isEmptyPart);
    }
  };
}
