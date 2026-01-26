/**
 * Oh-My-Droid
 *
 * A multi-agent orchestration system for the Android Factory SDK.
 * Inspired by oh-my-claudecode, adapted for Android Factory.
 *
 * Main features:
 * - Droid: Primary orchestrator that delegates to specialized subagents
 * - Parallel execution: Background agents run concurrently
 * - LSP/AST tools: IDE-like capabilities for agents
 * - Context management: Auto-injection from AGENTS.md/FACTORY.md
 * - Continuation enforcement: Ensures tasks complete before stopping
 * - Magic keywords: Special triggers for enhanced behaviors
 */

import { loadConfig, findContextFiles, loadContextFromFiles } from './config/loader.js';
import { getAgentDefinitions, omdSystemPrompt } from './agents/definitions.js';
import { getDefaultMcpServers, toSdkMcpFormat } from './mcp/servers.js';
import { createMagicKeywordProcessor, detectMagicKeywords } from './features/magic-keywords.js';
import { continuationSystemPromptAddition } from './features/continuation-enforcement.js';
import {
  createBackgroundTaskManager,
  shouldRunInBackground as shouldRunInBackgroundFn,
  type BackgroundTaskManager,
  type TaskExecutionDecision
} from './features/background-tasks.js';
import type { PluginConfig, SessionState } from './shared/types.js';

export { loadConfig, getAgentDefinitions, omdSystemPrompt };
export { getDefaultMcpServers, toSdkMcpFormat } from './mcp/servers.js';
export { lspTools, astTools, allCustomTools } from './tools/index.js';
export { createMagicKeywordProcessor, detectMagicKeywords } from './features/magic-keywords.js';
export {
  createBackgroundTaskManager,
  shouldRunInBackground,
  getBackgroundTaskGuidance,
  DEFAULT_MAX_BACKGROUND_TASKS,
  LONG_RUNNING_PATTERNS,
  BLOCKING_PATTERNS,
  type BackgroundTaskManager,
  type TaskExecutionDecision
} from './features/background-tasks.js';
export {
  // Auto-update types
  type VersionMetadata,
  type ReleaseInfo,
  type UpdateCheckResult,
  type UpdateResult,
  // Auto-update constants
  REPO_OWNER,
  REPO_NAME,
  GITHUB_API_URL,
  FACTORY_CONFIG_DIR,
  VERSION_FILE,
  // Auto-update functions
  getInstalledVersion,
  saveVersionMetadata,
  checkForUpdates,
  performUpdate,
  formatUpdateNotification,
  shouldCheckForUpdates,
  backgroundUpdateCheck,
  compareVersions
} from './features/auto-update.js';
export * from './shared/types.js';

// Hooks module exports
export * from './hooks/index.js';

// Features module exports (boulder-state, context-injector, etc.)
export {
  // Boulder State
  type BoulderState,
  type PlanProgress,
  type PlanSummary,
  BOULDER_DIR,
  BOULDER_FILE,
  BOULDER_STATE_PATH,
  NOTEPAD_DIR,
  NOTEPAD_BASE_PATH,
  PLANNER_PLANS_DIR,
  PLAN_EXTENSION,
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
  getActivePlanPath,
  // Context Injector
  ContextCollector,
  contextCollector,
  injectPendingContext,
  injectContextIntoText,
  createContextInjectorHook,
  type ContextSourceType,
  type ContextPriority,
  type ContextEntry,
  type RegisterContextOptions,
  type PendingContext,
  type MessageContext,
  type OutputPart,
  type InjectionStrategy,
  type InjectionResult,
  // Background Agent
  BackgroundManager,
  ConcurrencyManager,
  getBackgroundManager,
  resetBackgroundManager,
  type BackgroundTask,
  type BackgroundTaskStatus,
  type BackgroundTaskConfig,
  type LaunchInput,
  type ResumeInput,
  type TaskProgress,
  // Builtin Skills
  createBuiltinSkills,
  getBuiltinSkill,
  listBuiltinSkillNames,
  type BuiltinSkill,
  type SkillMcpConfig,
  type SkillRegistry,
  // Model Routing
  routeTask,
  routeWithEscalation,
  routeAndAdaptTask,
  escalateModel,
  canEscalate,
  explainRouting,
  quickTierForAgent,
  extractLexicalSignals,
  extractStructuralSignals,
  extractContextSignals,
  extractAllSignals,
  calculateComplexityScore,
  calculateComplexityTier,
  scoreToTier,
  getScoreBreakdown,
  calculateConfidence,
  evaluateRules,
  getMatchingRules,
  createRule,
  mergeRules,
  DEFAULT_ROUTING_RULES,
  adaptPromptForTier,
  getPromptStrategy,
  getPromptPrefix,
  getPromptSuffix,
  createDelegationPrompt,
  getTaskInstructions,
  TIER_MODELS,
  TIER_TO_MODEL_TYPE,
  DEFAULT_ROUTING_CONFIG,
  AGENT_CATEGORY_TIERS,
  COMPLEXITY_KEYWORDS,
  TIER_PROMPT_STRATEGIES,
  TIER_TASK_INSTRUCTIONS,
  type ComplexityTier,
  type ComplexitySignals,
  type LexicalSignals,
  type StructuralSignals,
  type ContextSignals,
  type RoutingDecision,
  type RoutingContext,
  type RoutingConfig,
  type RoutingRule,
  type PromptAdaptationStrategy,
  // Notepad Wisdom
  initPlanNotepad,
  readPlanWisdom,
  addLearning,
  addDecision,
  addIssue,
  addProblem,
  getWisdomSummary,
  type WisdomEntry,
  type WisdomCategory,
  type PlanWisdom,
  // Delegation Categories
  resolveCategory,
  isValidCategory,
  getAllCategories,
  getCategoryDescription,
  getCategoryTier,
  getCategoryTemperature,
  getCategoryThinkingBudget,
  getCategoryThinkingBudgetTokens,
  getCategoryForTask,
  detectCategoryFromPrompt,
  enhancePromptWithCategory,
  CATEGORY_CONFIGS,
  THINKING_BUDGET_TOKENS,
  type DelegationCategory,
  type CategoryConfig,
  type ResolvedCategory,
  type CategoryContext,
  type ThinkingBudget,
  // State Manager (from features)
  StateManager,
  createStateManager,
  getStatePath,
  getLegacyPaths,
  ensureStateDir,
  readState,
  writeState,
  clearState,
  migrateState,
  listStates,
  cleanupOrphanedStates,
  StateLocation,
  isStateLocation,
  DEFAULT_STATE_CONFIG,
  type StateConfig,
  type StateReadResult,
  type StateWriteResult,
  type StateClearResult,
  type StateMigrationResult,
  type StateFileInfo,
  type ListStatesOptions,
  type CleanupOptions,
  type CleanupResult,
  type StateData,
  // Verification
  createProtocol,
  createChecklist,
  runVerification,
  checkEvidence,
  formatReport,
  validateChecklist,
  STANDARD_CHECKS,
  type VerificationProtocol,
  type VerificationCheck,
  type VerificationChecklist,
  type VerificationEvidence,
  type VerificationEvidenceType,
  type VerificationSummary,
  type ValidationResult,
  type VerificationOptions,
  type ReportOptions,
  // Task Decomposer
  decomposeTask,
  analyzeTask,
  identifyComponents,
  generateSubtasks,
  assignFileOwnership,
  identifySharedFiles,
  type TaskAnalysis,
  type Component,
  type Subtask,
  type SharedFile,
  type DecompositionResult,
  type ProjectContext,
  type TaskType,
  type ComponentRole,
  type FileOwnership,
  type DecompositionStrategy
} from './features/index.js';

// Agent module exports (modular agent system)
export {
  // Types
  type ModelType,
  type AgentCost,
  type AgentCategory,
  type DelegationTrigger,
  type AgentPromptMetadata,
  type AgentConfig,
  type FullAgentConfig,
  type AgentOverrideConfig,
  type AgentOverrides,
  type AgentFactory,
  type AvailableAgent,
  isGptModel,
  isClaudeModel,
  getDefaultModelForCategory,
  // Utilities
  createAgentToolRestrictions,
  mergeAgentConfig,
  buildDelegationTable,
  buildUseAvoidSection,
  createEnvContext,
  getAvailableAgents,
  buildKeyTriggersSection,
  validateAgentConfig,
  deepMerge,
  // Individual agents with metadata (rebranded intuitive names)
  architectAgent,
  ARCHITECT_PROMPT_METADATA,
  exploreAgent,
  EXPLORE_PROMPT_METADATA,
  researcherAgent,
  RESEARCHER_PROMPT_METADATA,
  executorAgent,
  SISYPHUS_JUNIOR_PROMPT_METADATA,
  designerAgent,
  FRONTEND_ENGINEER_PROMPT_METADATA,
  writerAgent,
  DOCUMENT_WRITER_PROMPT_METADATA,
  visionAgent,
  MULTIMODAL_LOOKER_PROMPT_METADATA,
  criticAgent,
  CRITIC_PROMPT_METADATA,
  analystAgent,
  ANALYST_PROMPT_METADATA,
  coordinatorAgent,
  ORCHESTRATOR_SISYPHUS_PROMPT_METADATA,
  plannerAgent,
  PLANNER_PROMPT_METADATA
} from './agents/index.js';

// Command expansion utilities for SDK integration
export {
  expandCommand,
  expandCommandPrompt,
  getCommand,
  getAllCommands,
  listCommands,
  commandExists,
  expandCommands,
  getCommandsDir,
  type CommandInfo,
  type ExpandedCommand
} from './commands/index.js';

// Installer exports
export {
  install,
  isInstalled,
  getInstallInfo,
  isFactoryInstalled,
  FACTORY_CONFIG_DIR as INSTALLER_FACTORY_CONFIG_DIR,
  DROIDS_DIR,
  COMMANDS_DIR,
  VERSION as INSTALLER_VERSION,
  type InstallResult,
  type InstallOptions
} from './installer/index.js';

// Analytics module exports
export * from './analytics/index.js';

// Config module exports (enhanced with JSONC support, context discovery, schema generation)
export {
  // Core config functions
  loadJsoncFile,
  loadEnvConfig,
  getConfigPaths,
  deepMerge as configDeepMerge,
  getConfigValue,
  isFeatureEnabled,
  getAgentConfig,
  getAgentModel,
  isAgentEnabled,
  DEFAULT_CONFIG,
  // Context file discovery
  findContextFiles,
  loadContextFromFiles,
  // Schema generation
  generateConfigSchema
} from './config/index.js';

// CLI module - primarily a binary, entry point at cli/index.ts
// HUD module - primarily a binary, entry point at hud/index.ts
// Both are executed directly rather than imported programmatically

// Platform detection utilities
export {
  PLATFORM,
  isWindows,
  isMacOS,
  isLinux,
  isUnix,
  isPathRoot
} from './platform/index.js';

// Library utilities
export * from './lib/index.js';

// Utilities
export {
  getLocalStatePath,
  getGlobalStatePath,
  getLocalConfigPath,
  getGlobalConfigPath,
  ensureDir,
  ensureLocalStateDir,
  ensureGlobalStateDir,
  ensureLocalConfigDir,
  ensureGlobalConfigDir,
  resolveProjectPath,
  resolveHomePath,
  pathExists,
  getFileStats
} from './utils/paths.js';

export {
  type JsonParseResult,
  safeJsonParse,
  safeJsonStringify,
  parseJsonOrDefault,
  deepCloneJson,
  isValidJson,
  prettyJson,
  compactJson
} from './utils/json.js';

// MCP Server Configurations
export {
  type McpServerConfig,
  type McpServersConfig,
  createExaServer,
  createContext7Server,
  createPlaywrightServer,
  createFilesystemServer,
  createMemoryServer
} from './mcp/index.js';

// Legacy exports (deprecated - use new modules instead)
export {
  type ConfigPaths,
  loadJsonFile
} from './config-loader.js';

/**
 * Options for creating a Droid session
 */
export interface DroidOptions {
  /** Custom configuration (merged with loaded config) */
  config?: Partial<PluginConfig>;
  /** Working directory (default: process.cwd()) */
  workingDirectory?: string;
  /** Skip loading config files */
  skipConfigLoad?: boolean;
  /** Skip context file injection */
  skipContextInjection?: boolean;
  /** Custom system prompt addition */
  customSystemPrompt?: string;
  /** API key (default: from ANTHROPIC_API_KEY env) */
  apiKey?: string;
}

/**
 * Result of creating a Droid session
 */
export interface DroidSession {
  /** The query options to pass to Android Factory SDK */
  queryOptions: {
    options: {
      systemPrompt: string;
      agents: Record<string, { description: string; prompt: string; tools: string[]; model?: string }>;
      mcpServers: Record<string, { command: string; args: string[] }>;
      allowedTools: string[];
      permissionMode: string;
    };
  };
  /** Session state */
  state: SessionState;
  /** Loaded configuration */
  config: PluginConfig;
  /** Process a prompt (applies magic keywords) */
  processPrompt: (prompt: string) => string;
  /** Get detected magic keywords in a prompt */
  detectKeywords: (prompt: string) => string[];
  /** Background task manager for controlling async execution */
  backgroundTasks: BackgroundTaskManager;
  /** Check if a command should run in background (convenience method) */
  shouldRunInBackground: (command: string) => TaskExecutionDecision;
}

/**
 * Create a Droid orchestration session
 *
 * This prepares all the configuration and options needed
 * to run a query with the Android Factory SDK.
 *
 * @example
 * ```typescript
 * import { createDroidSession } from 'oh-my-droid';
 * import { query } from '@anthropic-ai/factory-sdk';
 *
 * const session = createDroidSession();
 *
 * // Use with Android Factory SDK
 * for await (const message of query({
 *   prompt: session.processPrompt("ultrawork refactor the authentication module"),
 *   ...session.queryOptions
 * })) {
 *   console.log(message);
 * }
 * ```
 */
export function createDroidSession(options?: DroidOptions): DroidSession {
  // Load configuration
  const loadedConfig = options?.skipConfigLoad ? {} : loadConfig();
  const config: PluginConfig = {
    ...loadedConfig,
    ...options?.config
  };

  // Find and load context files
  let contextAddition = '';
  if (!options?.skipContextInjection && config.features?.autoContextInjection !== false) {
    const contextFiles = findContextFiles(options?.workingDirectory);
    if (contextFiles.length > 0) {
      contextAddition = `\n\n## Project Context\n\n${loadContextFromFiles(contextFiles)}`;
    }
  }

  // Build system prompt
  let systemPrompt = omdSystemPrompt;

  // Add continuation enforcement
  if (config.features?.continuationEnforcement !== false) {
    systemPrompt += continuationSystemPromptAddition;
  }

  // Add custom system prompt
  if (options?.customSystemPrompt) {
    systemPrompt += `\n\n## Custom Instructions\n\n${options.customSystemPrompt}`;
  }

  // Add context from files
  if (contextAddition) {
    systemPrompt += contextAddition;
  }

  // Get agent definitions
  const agents = getAgentDefinitions();

  // Build MCP servers configuration
  const mcpServers = getDefaultMcpServers({
    exaApiKey: config.mcpServers?.exa?.apiKey,
    enableExa: config.mcpServers?.exa?.enabled,
    enableContext7: config.mcpServers?.context7?.enabled
  });

  // Build allowed tools list
  const allowedTools: string[] = [
    'Read', 'Glob', 'Grep', 'WebSearch', 'WebFetch', 'Task', 'TodoWrite'
  ];

  if (config.permissions?.allowBash !== false) {
    allowedTools.push('Bash');
  }

  if (config.permissions?.allowEdit !== false) {
    allowedTools.push('Edit');
  }

  if (config.permissions?.allowWrite !== false) {
    allowedTools.push('Write');
  }

  // Add MCP tool names
  for (const serverName of Object.keys(mcpServers)) {
    allowedTools.push(`mcp__${serverName}__*`);
  }

  // Create magic keyword processor
  const processPrompt = createMagicKeywordProcessor(config.magicKeywords);

  // Initialize session state
  const state: SessionState = {
    activeAgents: new Map(),
    backgroundTasks: [],
    contextFiles: findContextFiles(options?.workingDirectory)
  };

  // Create background task manager
  const backgroundTaskManager = createBackgroundTaskManager(state, config);

  return {
    queryOptions: {
      options: {
        systemPrompt,
        agents,
        mcpServers: toSdkMcpFormat(mcpServers),
        allowedTools,
        permissionMode: 'acceptEdits'
      }
    },
    state,
    config,
    processPrompt,
    detectKeywords: (prompt: string) => detectMagicKeywords(prompt, config.magicKeywords),
    backgroundTasks: backgroundTaskManager,
    shouldRunInBackground: (command: string) => shouldRunInBackgroundFn(
      command,
      backgroundTaskManager.getRunningCount(),
      backgroundTaskManager.getMaxTasks()
    )
  };
}

/**
 * Quick helper to process a prompt with Droid enhancements
 */
export function enhancePrompt(prompt: string, config?: PluginConfig): string {
  const processor = createMagicKeywordProcessor(config?.magicKeywords);
  return processor(prompt);
}

/**
 * Get the system prompt for the orchestrator (for direct use)
 */
export function getOmdSystemPrompt(options?: {
  includeContinuation?: boolean;
  customAddition?: string;
}): string {
  let prompt = omdSystemPrompt;

  if (options?.includeContinuation !== false) {
    prompt += continuationSystemPromptAddition;
  }

  if (options?.customAddition) {
    prompt += `\n\n${options.customAddition}`;
  }

  return prompt;
}

// Plugin initialization functions
export function initialize() {
  console.log('Oh My Droid plugin initialized');
}

export function shutdown() {
  console.log('Oh My Droid plugin shutting down');
}
