/**
 * Autopilot State Management
 *
 * Manages persistent state for autopilot sessions.
 * Adapted from oh-my-claudecode.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import type { AutopilotState, AutopilotPhase } from './types.js';

/**
 * Get the state file path
 */
function getStateFilePath(directory: string): string {
  const omdDir = join(directory, '.omd');
  return join(omdDir, 'autopilot-state.json');
}

/**
 * Ensure the .omd directory exists
 */
function ensureStateDir(directory: string): void {
  const omdDir = join(directory, '.omd');
  if (!existsSync(omdDir)) {
    mkdirSync(omdDir, { recursive: true });
  }
}

/**
 * Read autopilot state from disk
 */
export function readAutopilotState(directory: string): AutopilotState | null {
  const stateFile = getStateFilePath(directory);

  if (!existsSync(stateFile)) {
    return null;
  }

  try {
    const content = readFileSync(stateFile, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

/**
 * Write autopilot state to disk
 */
export function writeAutopilotState(directory: string, state: AutopilotState): boolean {
  try {
    ensureStateDir(directory);
    const stateFile = getStateFilePath(directory);
    writeFileSync(stateFile, JSON.stringify(state, null, 2));
    return true;
  } catch {
    return false;
  }
}

/**
 * Clear autopilot state
 */
export function clearAutopilotState(directory: string): boolean {
  const stateFile = getStateFilePath(directory);

  if (!existsSync(stateFile)) {
    return true;
  }

  try {
    unlinkSync(stateFile);
    return true;
  } catch {
    return false;
  }
}

/**
 * Update autopilot phase
 */
export function updatePhase(directory: string, phase: AutopilotPhase): AutopilotState | null {
  const state = readAutopilotState(directory);
  if (!state) return null;

  state.phase = phase;
  if (writeAutopilotState(directory, state)) {
    return state;
  }
  return null;
}

/**
 * Increment iteration count
 */
export function incrementIteration(directory: string): AutopilotState | null {
  const state = readAutopilotState(directory);
  if (!state) return null;

  state.iteration += 1;
  if (writeAutopilotState(directory, state)) {
    return state;
  }
  return null;
}

/**
 * Check if autopilot is active
 */
export function isAutopilotActive(directory: string): boolean {
  const state = readAutopilotState(directory);
  return state !== null && state.active === true;
}
