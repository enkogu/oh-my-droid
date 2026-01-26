/**
 * Non-Interactive Environment Detector
 *
 * Detects various non-interactive environments.
 * Adapted from oh-my-claudecode.
 */

import { existsSync } from 'fs';
import {
  CI_ENV_VARS,
  DOCKER_INDICATORS,
  NON_INTERACTIVE_INDICATORS
} from './constants.js';
import type { EnvironmentType, EnvironmentInfo, EnvironmentConfig } from './types.js';

/**
 * Check if running in CI environment
 */
export function isCI(): { isCI: boolean; ciSystem?: string } {
  for (const envVar of CI_ENV_VARS) {
    if (process.env[envVar]) {
      return { isCI: true, ciSystem: envVar };
    }
  }
  return { isCI: false };
}

/**
 * Check if running in Docker
 */
export function isDocker(): boolean {
  for (const indicator of DOCKER_INDICATORS) {
    if (existsSync(indicator)) {
      return true;
    }
  }

  // Check cgroup
  try {
    const { readFileSync } = require('fs');
    const cgroup = readFileSync('/proc/1/cgroup', 'utf-8');
    return cgroup.includes('docker') || cgroup.includes('containerd');
  } catch {
    return false;
  }
}

/**
 * Check if running via SSH
 */
export function isSSH(): boolean {
  return !!(process.env.SSH_CLIENT || process.env.SSH_TTY || process.env.SSH_CONNECTION);
}

/**
 * Check if running from cron
 */
export function isCron(): boolean {
  return !process.stdout.isTTY && !process.env.TERM;
}

/**
 * Check if explicitly non-interactive
 */
export function isExplicitlyNonInteractive(): boolean {
  for (const indicator of NON_INTERACTIVE_INDICATORS) {
    if (process.env[indicator]) {
      return true;
    }
  }
  return process.env.DEBIAN_FRONTEND === 'noninteractive';
}

/**
 * Detect environment type
 */
export function detectEnvironment(config?: EnvironmentConfig): EnvironmentInfo {
  const indicators: string[] = [];
  const adaptations: string[] = [];

  // Check for forced non-interactive
  if (config?.forceNonInteractive) {
    return {
      type: 'unknown',
      isInteractive: false,
      indicators: ['FORCED_NON_INTERACTIVE'],
      adaptations: ['All non-interactive adaptations applied']
    };
  }

  // Check CI
  const ciCheck = isCI();
  if (ciCheck.isCI) {
    indicators.push(`CI: ${ciCheck.ciSystem}`);
    adaptations.push('Use CI-friendly output');
    adaptations.push('Respect CI timeout limits');

    return {
      type: 'ci',
      isInteractive: false,
      indicators,
      adaptations
    };
  }

  // Check Docker
  if (isDocker()) {
    indicators.push('Docker container detected');
    adaptations.push('Container-aware file operations');

    return {
      type: 'docker',
      isInteractive: false,
      indicators,
      adaptations
    };
  }

  // Check SSH
  if (isSSH()) {
    indicators.push('SSH session detected');
    adaptations.push('Use text-based output');

    return {
      type: 'ssh',
      isInteractive: true, // SSH can still be interactive
      indicators,
      adaptations
    };
  }

  // Check cron
  if (isCron()) {
    indicators.push('Cron/background job detected');
    adaptations.push('No terminal interaction');

    return {
      type: 'cron',
      isInteractive: false,
      indicators,
      adaptations
    };
  }

  // Check explicit non-interactive
  if (isExplicitlyNonInteractive()) {
    indicators.push('Explicit non-interactive flag');

    return {
      type: 'unknown',
      isInteractive: false,
      indicators,
      adaptations: ['Non-interactive mode requested']
    };
  }

  // Check additional env vars
  if (config?.additionalEnvVars) {
    for (const envVar of config.additionalEnvVars) {
      if (process.env[envVar]) {
        indicators.push(`Custom env: ${envVar}`);
      }
    }
  }

  // Default to interactive
  return {
    type: 'interactive',
    isInteractive: true,
    indicators: indicators.length > 0 ? indicators : ['TTY available'],
    adaptations: []
  };
}
