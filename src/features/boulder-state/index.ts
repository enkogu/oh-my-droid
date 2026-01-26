/**
 * Boulder State Module
 *
 * Manages the active work plan state for the orchestrator.
 * Named after the eternal task metaphor - the work that must be completed.
 *
 * Ported from oh-my-claudecode with adaptations for oh-my-droid.
 */

// Types
export type {
  BoulderState,
  PlanProgress,
  PlanSummary
} from './types.js';

// Constants
export {
  BOULDER_DIR,
  BOULDER_FILE,
  BOULDER_STATE_PATH,
  NOTEPAD_DIR,
  NOTEPAD_BASE_PATH,
  PLANNER_PLANS_DIR,
  PLAN_EXTENSION
} from './constants.js';

// Storage operations
export {
  getBoulderFilePath,
  readBoulderState,
  writeBoulderState,
  appendSessionId,
  clearBoulderState,
  findPlannerPlans,
  getPlanProgress,
  getPlanName,
  createBoulderState,
  getPlanSummaries,
  hasBoulder,
  getActivePlanPath
} from './storage.js';
