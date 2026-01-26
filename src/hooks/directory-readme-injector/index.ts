/**
 * Directory README Injector Hook
 *
 * Injects directory-specific README/AGENTS.md content into context
 * when working with files in that directory.
 * Adapted from oh-my-claudecode.
 */

import { existsSync, readFileSync } from 'fs';
import { join, dirname, basename } from 'path';
import {
  DEFAULT_README_NAMES,
  DEFAULT_MAX_DEPTH,
  DEFAULT_IGNORE_DIRS,
  INJECTION_TEMPLATE
} from './constants.js';
import { wasInjected, recordInjection, cleanupStaleCaches } from './storage.js';
import type { ReadmeInfo, InjectionResult, ReadmeInjectorConfig } from './types.js';

// Export types
export type { ReadmeInfo, InjectionResult, ReadmeInjectorConfig } from './types.js';

// Export constants
export {
  DEFAULT_README_NAMES,
  DEFAULT_MAX_DEPTH,
  DEFAULT_IGNORE_DIRS,
  INJECTION_TEMPLATE,
  CACHE_TTL_MS
} from './constants.js';

// Export storage functions
export {
  wasInjected,
  recordInjection,
  getInjectedReadmes,
  clearSessionCache,
  cleanupStaleCaches
} from './storage.js';

/**
 * Find README file in a directory
 */
export function findReadme(
  directory: string,
  readmeNames?: string[]
): ReadmeInfo | null {
  const names = readmeNames ?? DEFAULT_README_NAMES;

  for (const name of names) {
    const path = join(directory, name);
    if (existsSync(path)) {
      try {
        const content = readFileSync(path, 'utf-8');
        return {
          path,
          directory,
          content,
          filename: name
        };
      } catch {
        continue;
      }
    }
  }

  return null;
}

/**
 * Find READMEs in directory hierarchy
 */
export function findReadmesInHierarchy(
  startDir: string,
  config?: ReadmeInjectorConfig
): ReadmeInfo[] {
  const readmes: ReadmeInfo[] = [];
  const maxDepth = config?.maxDepth ?? DEFAULT_MAX_DEPTH;
  const ignoreDirs = new Set(config?.ignoreDirs ?? DEFAULT_IGNORE_DIRS);

  let currentDir = startDir;
  let depth = 0;

  while (depth < maxDepth) {
    // Skip ignored directories
    const dirName = basename(currentDir);
    if (!ignoreDirs.has(dirName)) {
      const readme = findReadme(currentDir, config?.readmeNames);
      if (readme) {
        readmes.push(readme);
      }
    }

    // Move up one level
    const parentDir = dirname(currentDir);
    if (parentDir === currentDir) {
      break; // Reached root
    }

    currentDir = parentDir;
    depth++;
  }

  return readmes;
}

/**
 * Format injection message
 */
export function formatInjection(readmes: ReadmeInfo[]): string {
  if (readmes.length === 0) {
    return '';
  }

  return readmes
    .map(readme =>
      INJECTION_TEMPLATE
        .replace('{directory}', readme.directory)
        .replace('{content}', readme.content)
    )
    .join('\n');
}

/**
 * Inject READMEs for a file operation
 */
export function injectForFile(
  sessionId: string,
  filePath: string,
  config?: ReadmeInjectorConfig
): InjectionResult {
  if (config?.enabled === false) {
    return { injected: false, readmes: [] };
  }

  const directory = dirname(filePath);

  // Check cache
  if (config?.useCache !== false && wasInjected(sessionId, directory)) {
    return { injected: false, readmes: [] };
  }

  // Find READMEs
  const readmes = findReadmesInHierarchy(directory, config);

  if (readmes.length === 0) {
    return { injected: false, readmes: [] };
  }

  // Record injection
  if (config?.useCache !== false) {
    recordInjection(sessionId, directory, readmes);
  }

  return {
    injected: true,
    readmes,
    message: formatInjection(readmes)
  };
}

/**
 * Create the README injector hook
 */
export function createReadmeInjectorHook(config?: ReadmeInjectorConfig) {
  // Start cleanup interval
  setInterval(cleanupStaleCaches, 10 * 60 * 1000);

  return {
    /**
     * PreToolUse - Inject READMEs before file operations
     */
    preToolUse: (input: {
      session_id: string;
      tool_name: string;
      tool_input: Record<string, unknown>;
    }): string | null => {
      // Only inject for file operations
      if (!['Read', 'Write', 'Edit'].includes(input.tool_name)) {
        return null;
      }

      const filePath = input.tool_input.file_path as string;
      if (!filePath) {
        return null;
      }

      const result = injectForFile(input.session_id, filePath, config);
      return result.message || null;
    }
  };
}
