/**
 * Configuration Module Exports
 */

export {
  loadConfig,
  loadJsoncFile,
  loadEnvConfig,
  getConfigPaths,
  deepMerge,
  findContextFiles,
  loadContextFromFiles,
  generateConfigSchema,
  getConfigValue,
  isFeatureEnabled,
  getAgentConfig,
  getAgentModel,
  isAgentEnabled,
  DEFAULT_CONFIG
} from './loader.js';

export type {
  PluginConfig,
  ModelType,
  AgentConfig,
  SessionState,
  AgentState,
  BackgroundTask,
  MagicKeyword,
  HookDefinition,
  HookContext,
  HookResult
} from './types.js';
