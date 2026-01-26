/**
 * Hooks Module for Oh-My-Droid
 *
 * This module provides the TypeScript bridge for hook system.
 * Shell scripts call these TypeScript functions for complex logic processing.
 *
 * Architecture:
 * - Android Factory runs shell scripts on hook events
 * - Shell scripts invoke Node.js bridge for complex processing
 * - Bridge returns JSON response that shell passes back
 */

export {
  // Hook Bridge (main entry point for shell scripts)
  processHook,
  type HookInput,
  type HookOutput
} from './bridge.js';

export {
  // Learned Skills (Learner)
  createLearnedSkillsHook,
  processMessageForSkills,
  isLearnerEnabled,
  getAllSkills,
  clearSkillSession,
  findMatchingSkills,
  loadAllSkills,
  loadSkillById,
  findSkillFiles,
  getSkillsDir,
  ensureSkillsDir,
  parseSkillFile,
  generateSkillFrontmatter,
  validateExtractionRequest,
  validateSkillMetadata,
  writeSkill,
  checkDuplicateTriggers,
  detectExtractableMoment,
  shouldPromptExtraction,
  generateExtractionPrompt,
  processResponseForDetection,
  getLastDetection,
  clearDetectionState,
  getDetectionStats,
  getPromotionCandidates,
  promoteLearning,
  listPromotableLearnings,
  loadConfig as loadLearnerConfig,
  saveConfig as saveLearnerConfig,
  getConfigValue as getLearnerConfigValue,
  setConfigValue as setLearnerConfigValue,
  // Matcher exports
  matchSkills,
  fuzzyMatch,
  extractContext,
  calculateConfidence,
  // Auto-invoke exports
  loadInvocationConfig,
  initAutoInvoke,
  shouldAutoInvoke,
  recordInvocation,
  updateInvocationSuccess,
  formatAutoInvoke,
  getInvocationStats,
  saveInvocationHistory,
  loadInvocationHistory,
  getAggregatedStats,
  // Auto-learner exports (renamed to avoid collisions)
  initAutoLearner,
  calculateSkillWorthiness,
  extractTriggers,
  getSuggestedSkills,
  patternToSkillMetadata,
  recordSkillPattern,
  // Constants
  USER_SKILLS_DIR,
  PROJECT_SKILLS_SUBDIR,
  SKILL_EXTENSION,
  FEATURE_FLAG_KEY,
  MAX_SKILL_CONTENT_LENGTH,
  MIN_QUALITY_SCORE,
  MAX_SKILLS_PER_SESSION,
  // Types
  type SkillMetadata,
  type LearnedSkill,
  type SkillFileCandidate,
  type QualityValidation,
  type SkillExtractionRequest,
  type InjectedSkillsData,
  type HookContext as SkillHookContext,
  type DetectionResult,
  type DetectionConfig,
  type PromotionCandidate,
  type LearnerConfig,
  type WriteSkillResult,
  type SkillParseResult,
  type MatchResult,
  type MatchContext,
  type InvocationConfig,
  type InvocationRecord,
  type AutoInvokeState,
  type PatternDetection,
  type AutoLearnerState
} from './learner/index.js';

// Re-export bridge types
export {
  // Bridge types for skill injection
  getInjectedSkillPaths,
  markSkillsInjected,
  matchSkillsForInjection,
  type MatchedSkill,
  type ParseResult
} from './learner/bridge.js';
