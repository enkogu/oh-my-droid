/**
 * Auto Slash Command Detector
 *
 * Detects slash command patterns in user prompts.
 * Adapted from oh-my-claudecode.
 */

import {
  TRIGGER_KEYWORDS,
  COMMAND_MAPPINGS,
  COMMAND_PRIORITY,
  DEFAULT_CONFIDENCE_THRESHOLD
} from './constants.js';
import type { CommandDetection, DetectorConfig } from './types.js';

/**
 * Detect slash command in prompt
 */
export function detectCommand(
  prompt: string,
  config?: DetectorConfig
): CommandDetection | null {
  const promptLower = prompt.toLowerCase().trim();
  const keywords = config?.customKeywords ?? TRIGGER_KEYWORDS;
  const disabledCommands = new Set(config?.disabledCommands ?? []);

  // Check for explicit slash commands first
  const explicitMatch = promptLower.match(/^\/(oh-my-droid:)?(\w+)/);
  if (explicitMatch) {
    const command = explicitMatch[2];
    const skill = COMMAND_MAPPINGS[command];
    if (skill && !disabledCommands.has(command)) {
      const args = prompt.slice(explicitMatch[0].length).trim();
      return {
        command,
        skill,
        confidence: 1.0,
        matchedKeywords: [explicitMatch[0]],
        originalPrompt: prompt,
        args: args || undefined
      };
    }
  }

  // Detect by keywords
  const detections: CommandDetection[] = [];

  for (const [command, commandKeywords] of Object.entries(keywords)) {
    if (disabledCommands.has(command)) continue;

    const skill = COMMAND_MAPPINGS[command];
    if (!skill) continue;

    const matched: string[] = [];
    for (const keyword of commandKeywords) {
      if (promptLower.includes(keyword.toLowerCase())) {
        matched.push(keyword);
      }
    }

    if (matched.length > 0) {
      // Calculate confidence based on match quality
      const confidence = calculateConfidence(prompt, matched, commandKeywords as unknown as string[]);

      detections.push({
        command,
        skill,
        confidence,
        matchedKeywords: matched,
        originalPrompt: prompt
      });
    }
  }

  if (detections.length === 0) {
    return null;
  }

  // Sort by priority and confidence
  detections.sort((a, b) => {
    const priorityDiff =
      (COMMAND_PRIORITY[b.command] ?? 0) - (COMMAND_PRIORITY[a.command] ?? 0);
    if (priorityDiff !== 0) return priorityDiff;
    return b.confidence - a.confidence;
  });

  // Return best match if it meets threshold
  const best = detections[0];
  const threshold = config?.confidenceThreshold ?? DEFAULT_CONFIDENCE_THRESHOLD;

  if (best.confidence >= threshold) {
    return best;
  }

  return null;
}

/**
 * Calculate confidence score for a detection
 */
function calculateConfidence(
  prompt: string,
  matched: string[],
  allKeywords: string[]
): number {
  // Base confidence from keyword matches
  let confidence = matched.length / allKeywords.length;

  // Boost if keyword appears at start
  const promptLower = prompt.toLowerCase();
  if (matched.some(kw => promptLower.startsWith(kw.toLowerCase()))) {
    confidence += 0.2;
  }

  // Boost for explicit command-like patterns
  if (/^\s*\w+:\s/.test(prompt)) {
    confidence += 0.1;
  }

  return Math.min(1.0, confidence);
}

/**
 * Check if auto-execute should trigger
 */
export function shouldAutoExecute(
  detection: CommandDetection | null,
  config?: DetectorConfig
): boolean {
  if (!detection) return false;
  if (config?.autoExecute === false) return false;

  const threshold = config?.confidenceThreshold ?? DEFAULT_CONFIDENCE_THRESHOLD;
  return detection.confidence >= threshold;
}
