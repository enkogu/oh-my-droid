/**
 * Directory README Injector Types
 *
 * Type definitions for directory README injection.
 * Adapted from oh-my-claudecode.
 */

/**
 * README file information
 */
export interface ReadmeInfo {
  /** Full path to the README file */
  path: string;
  /** Directory containing the README */
  directory: string;
  /** README content */
  content: string;
  /** File name (e.g., README.md, AGENTS.md) */
  filename: string;
}

/**
 * Injection result
 */
export interface InjectionResult {
  /** Whether injection was performed */
  injected: boolean;
  /** README files that were injected */
  readmes: ReadmeInfo[];
  /** Formatted injection message */
  message?: string;
}

/**
 * Configuration for README injection
 */
export interface ReadmeInjectorConfig {
  /** Whether to enable injection */
  enabled?: boolean;
  /** README file names to look for (priority order) */
  readmeNames?: string[];
  /** Maximum directories to traverse up */
  maxDepth?: number;
  /** Directories to ignore */
  ignoreDirs?: string[];
  /** Whether to cache injected READMEs */
  useCache?: boolean;
}
