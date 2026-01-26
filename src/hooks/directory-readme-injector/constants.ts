/**
 * Directory README Injector Constants
 *
 * Configuration for README file detection and injection.
 * Adapted from oh-my-claudecode.
 */

/**
 * README file names to look for (in priority order)
 */
export const DEFAULT_README_NAMES = [
  'AGENTS.md',
  'README.md',
  'readme.md',
  'README.txt',
  'readme.txt'
];

/**
 * Maximum depth to traverse up for READMEs
 */
export const DEFAULT_MAX_DEPTH = 3;

/**
 * Directories to ignore
 */
export const DEFAULT_IGNORE_DIRS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.omd',
  '__pycache__',
  'vendor'
];

/**
 * Injection message template
 */
export const INJECTION_TEMPLATE = `<directory-context>

[Directory Context: {directory}]

{content}

</directory-context>

---

`;

/**
 * Cache TTL in milliseconds (5 minutes)
 */
export const CACHE_TTL_MS = 5 * 60 * 1000;
