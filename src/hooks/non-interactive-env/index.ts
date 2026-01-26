/**
 * Non-Interactive Environment Hook
 *
 * Detects and adapts to non-interactive environments like CI, Docker, etc.
 * Adapted from oh-my-claudecode.
 */

import {
  detectEnvironment,
  isCI,
  isDocker,
  isSSH,
  isCron,
  isExplicitlyNonInteractive
} from './detector.js';
import { NON_INTERACTIVE_ADAPTATIONS } from './constants.js';
import type { EnvironmentType, EnvironmentInfo, EnvironmentConfig } from './types.js';

// Export types
export type { EnvironmentType, EnvironmentInfo, EnvironmentConfig } from './types.js';

// Export constants
export {
  CI_ENV_VARS,
  DOCKER_INDICATORS,
  NON_INTERACTIVE_INDICATORS,
  NON_INTERACTIVE_ADAPTATIONS
} from './constants.js';

// Export detector functions
export {
  detectEnvironment,
  isCI,
  isDocker,
  isSSH,
  isCron,
  isExplicitlyNonInteractive
} from './detector.js';

/**
 * Cached environment info
 */
let cachedEnvInfo: EnvironmentInfo | null = null;

/**
 * Get environment info (cached)
 */
export function getEnvironmentInfo(config?: EnvironmentConfig): EnvironmentInfo {
  if (!cachedEnvInfo || config) {
    cachedEnvInfo = detectEnvironment(config);
  }
  return cachedEnvInfo;
}

/**
 * Format environment info for display
 */
export function formatEnvironmentInfo(info: EnvironmentInfo): string {
  const lines = [
    `Environment: ${info.type}`,
    `Interactive: ${info.isInteractive}`,
    `Indicators: ${info.indicators.join(', ')}`,
  ];

  if (info.adaptations.length > 0) {
    lines.push(`Adaptations: ${info.adaptations.join(', ')}`);
  }

  return lines.join('\n');
}

/**
 * Create the non-interactive environment hook
 */
export function createNonInteractiveEnvHook(config?: EnvironmentConfig) {
  const envInfo = getEnvironmentInfo(config);

  return {
    /**
     * Session start - inject environment adaptations
     */
    sessionStart: (_input: { session_id: string }): string | null => {
      if (envInfo.isInteractive) {
        return null;
      }

      if (config?.injectAdaptations === false) {
        return null;
      }

      return NON_INTERACTIVE_ADAPTATIONS;
    },

    /**
     * Get environment info
     */
    getInfo: () => envInfo,

    /**
     * Check if interactive
     */
    isInteractive: () => envInfo.isInteractive,

    /**
     * Get environment type
     */
    getType: () => envInfo.type
  };
}
