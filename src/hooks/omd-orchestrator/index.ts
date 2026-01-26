/**
 * OMD Orchestrator Hook
 *
 * Main orchestration layer for Oh-My-Droid multi-agent system.
 * Handles delegation enforcement and audit logging.
 * Adapted from oh-my-claudecode.
 */

import { extname } from 'path';
import { homedir } from 'os';
import {
  AGENT_PREFIX,
  MODEL_TIERS,
  AGENT_MODELS,
  ALLOWED_WRITE_PATHS,
  SOURCE_EXTENSIONS
} from './constants.js';
import { auditWriteWarning, auditDelegation, auditDirectAction } from './audit.js';

// Export constants
export {
  AGENT_PREFIX,
  MODEL_TIERS,
  AGENT_MODELS,
  ALLOWED_WRITE_PATHS,
  SOURCE_EXTENSIONS,
  AUDIT_LOG_PATH
} from './constants.js';

// Export audit functions
export {
  writeAuditEntry,
  auditWriteWarning,
  auditDelegation,
  auditDirectAction,
  getAuditLogPath
} from './audit.js';

// Export types
export type { AuditEntry } from './audit.js';

/**
 * Check if a path is in the allowed list
 */
export function isAllowedPath(filePath: string): boolean {
  const normalizedPath = filePath.replace(homedir(), '~');

  for (const pattern of ALLOWED_WRITE_PATHS) {
    // Simple glob matching
    if (pattern.endsWith('/**')) {
      const prefix = pattern.slice(0, -3);
      if (normalizedPath.startsWith(prefix)) {
        return true;
      }
    } else if (normalizedPath === pattern || normalizedPath.endsWith('/' + pattern)) {
      return true;
    }
  }

  return false;
}

/**
 * Check if a file is a source file (should be delegated)
 */
export function isSourceFile(filePath: string): boolean {
  const ext = extname(filePath).toLowerCase();
  return SOURCE_EXTENSIONS.includes(ext);
}

/**
 * Get model for an agent type
 */
export function getModelForAgent(agentType: string): string {
  // Remove prefix if present
  const cleanType = agentType.replace(AGENT_PREFIX, '');
  return AGENT_MODELS[cleanType] ?? MODEL_TIERS.MEDIUM;
}

/**
 * Format delegation warning message
 */
export function getDelegationWarning(filePath: string): string {
  return `<delegation-warning>

[SOFT WARNING: Direct Source File Modification]

You are about to modify a source file directly:
  ${filePath}

Consider delegating to an executor agent instead:
\`\`\`
Task(subagent_type="${AGENT_PREFIX}executor", prompt="Edit ${filePath} to...")
\`\`\`

This is a soft warning only. The operation will proceed, but delegation is recommended.

</delegation-warning>

---

`;
}

/**
 * Orchestrator configuration
 */
export interface OrchestratorConfig {
  /** Whether to enable delegation warnings */
  enableWarnings?: boolean;
  /** Whether to enable audit logging */
  enableAudit?: boolean;
  /** Additional allowed paths */
  additionalAllowedPaths?: string[];
}

/**
 * Create the OMD orchestrator hook
 */
export function createOmdOrchestratorHook(config?: OrchestratorConfig) {
  return {
    /**
     * PreToolUse - Check for source file writes
     */
    preToolUse: (input: {
      session_id: string;
      tool_name: string;
      tool_input: Record<string, unknown>;
      directory?: string;
    }): string | null => {
      // Only check Write/Edit operations
      if (!['Write', 'Edit'].includes(input.tool_name)) {
        return null;
      }

      const filePath = input.tool_input.file_path as string;
      if (!filePath) {
        return null;
      }

      const directory = input.directory || process.cwd();

      // Check if path is allowed
      if (isAllowedPath(filePath)) {
        if (config?.enableAudit) {
          auditDirectAction(directory, input.session_id, filePath);
        }
        return null;
      }

      // Check additional allowed paths
      if (config?.additionalAllowedPaths?.some(p => filePath.includes(p))) {
        return null;
      }

      // Check if source file
      if (!isSourceFile(filePath)) {
        return null;
      }

      // Warn about source file modification
      if (config?.enableWarnings !== false) {
        if (config?.enableAudit) {
          auditWriteWarning(directory, input.session_id, filePath);
        }
        return getDelegationWarning(filePath);
      }

      return null;
    },

    /**
     * Track Task tool delegations
     */
    postToolUse: (input: {
      session_id: string;
      tool_name: string;
      tool_input: Record<string, unknown>;
      directory?: string;
    }): string | null => {
      if (input.tool_name !== 'Task') {
        return null;
      }

      const subagentType = input.tool_input.subagent_type as string;
      if (!subagentType) {
        return null;
      }

      const directory = input.directory || process.cwd();

      if (config?.enableAudit) {
        auditDelegation(
          directory,
          input.session_id,
          subagentType,
          getModelForAgent(subagentType)
        );
      }

      return null;
    }
  };
}
