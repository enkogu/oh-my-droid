/**
 * OMD Orchestrator Audit
 *
 * Audit logging for delegation decisions.
 * Adapted from oh-my-claudecode.
 */

import { existsSync, mkdirSync, appendFileSync } from 'fs';
import { join, dirname } from 'path';
import { AUDIT_LOG_PATH } from './constants.js';

/**
 * Audit entry
 */
export interface AuditEntry {
  timestamp: string;
  sessionId: string;
  action: 'write_warning' | 'delegation' | 'direct_action';
  path?: string;
  agent?: string;
  model?: string;
  reason?: string;
}

/**
 * Get audit log path for a directory
 */
export function getAuditLogPath(directory: string): string {
  return join(directory, AUDIT_LOG_PATH);
}

/**
 * Ensure audit log directory exists
 */
function ensureAuditDir(logPath: string): void {
  const dir = dirname(logPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

/**
 * Write an audit entry
 */
export function writeAuditEntry(directory: string, entry: AuditEntry): boolean {
  const logPath = getAuditLogPath(directory);

  try {
    ensureAuditDir(logPath);
    const line = JSON.stringify({ ...entry, timestamp: new Date().toISOString() }) + '\n';
    appendFileSync(logPath, line);
    return true;
  } catch {
    return false;
  }
}

/**
 * Audit a write warning
 */
export function auditWriteWarning(
  directory: string,
  sessionId: string,
  filePath: string
): boolean {
  return writeAuditEntry(directory, {
    timestamp: new Date().toISOString(),
    sessionId,
    action: 'write_warning',
    path: filePath,
    reason: 'Source file write without delegation'
  });
}

/**
 * Audit a delegation
 */
export function auditDelegation(
  directory: string,
  sessionId: string,
  agent: string,
  model?: string
): boolean {
  return writeAuditEntry(directory, {
    timestamp: new Date().toISOString(),
    sessionId,
    action: 'delegation',
    agent,
    model
  });
}

/**
 * Audit a direct action (allowed)
 */
export function auditDirectAction(
  directory: string,
  sessionId: string,
  path: string
): boolean {
  return writeAuditEntry(directory, {
    timestamp: new Date().toISOString(),
    sessionId,
    action: 'direct_action',
    path,
    reason: 'Path in allowed list'
  });
}
