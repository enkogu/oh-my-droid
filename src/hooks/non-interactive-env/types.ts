/**
 * Non-Interactive Environment Types
 *
 * Type definitions for non-interactive environment detection.
 * Adapted from oh-my-claudecode.
 */

/**
 * Environment type
 */
export type EnvironmentType = 'interactive' | 'ci' | 'docker' | 'ssh' | 'cron' | 'unknown';

/**
 * Environment detection result
 */
export interface EnvironmentInfo {
  /** Detected environment type */
  type: EnvironmentType;
  /** Whether the environment is interactive */
  isInteractive: boolean;
  /** Environment indicators found */
  indicators: string[];
  /** Suggested adaptations */
  adaptations: string[];
}

/**
 * Configuration for environment detection
 */
export interface EnvironmentConfig {
  /** Force non-interactive mode */
  forceNonInteractive?: boolean;
  /** Additional environment variables to check */
  additionalEnvVars?: string[];
  /** Whether to inject adaptations */
  injectAdaptations?: boolean;
}
