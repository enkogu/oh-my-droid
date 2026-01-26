/**
 * Notepad Hook
 *
 * Plan-scoped wisdom capture for learnings, decisions, issues, and problems.
 * Adapted from oh-my-claudecode.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync, appendFileSync } from 'fs';
import { join } from 'path';

/**
 * Notepad entry types
 */
export type NotepadType = 'learnings' | 'decisions' | 'issues' | 'problems';

/**
 * Notepad entry
 */
export interface NotepadEntry {
  timestamp: string;
  content: string;
  context?: string;
}

/**
 * Wisdom summary
 */
export interface WisdomSummary {
  learnings: number;
  decisions: number;
  issues: number;
  problems: number;
  totalEntries: number;
}

/**
 * Get notepads directory path
 */
export function getNotepadsDir(directory: string): string {
  return join(directory, '.omd', 'notepads');
}

/**
 * Get plan notepad directory
 */
export function getPlanNotepadDir(directory: string, planName: string): string {
  return join(getNotepadsDir(directory), planName);
}

/**
 * Get notepad file path
 */
export function getNotepadPath(directory: string, planName: string, type: NotepadType): string {
  return join(getPlanNotepadDir(directory, planName), `${type}.md`);
}

/**
 * Initialize a plan notepad
 */
export function initPlanNotepad(directory: string, planName: string): boolean {
  const notepadDir = getPlanNotepadDir(directory, planName);

  try {
    if (!existsSync(notepadDir)) {
      mkdirSync(notepadDir, { recursive: true });
    }

    // Create initial files
    const types: NotepadType[] = ['learnings', 'decisions', 'issues', 'problems'];
    for (const type of types) {
      const path = getNotepadPath(directory, planName, type);
      if (!existsSync(path)) {
        const header = `# ${type.charAt(0).toUpperCase() + type.slice(1)}\n\nPlan: ${planName}\nStarted: ${new Date().toISOString()}\n\n---\n\n`;
        writeFileSync(path, header);
      }
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Add an entry to a notepad
 */
function addEntry(
  directory: string,
  planName: string,
  type: NotepadType,
  content: string,
  context?: string
): boolean {
  const path = getNotepadPath(directory, planName, type);

  // Ensure notepad exists
  if (!existsSync(path)) {
    initPlanNotepad(directory, planName);
  }

  const timestamp = new Date().toISOString();
  let entry = `## ${timestamp}\n\n${content}\n`;

  if (context) {
    entry += `\n**Context:** ${context}\n`;
  }

  entry += '\n---\n\n';

  try {
    appendFileSync(path, entry);
    return true;
  } catch {
    return false;
  }
}

/**
 * Add a learning
 */
export function addLearning(
  directory: string,
  planName: string,
  content: string,
  context?: string
): boolean {
  return addEntry(directory, planName, 'learnings', content, context);
}

/**
 * Add a decision
 */
export function addDecision(
  directory: string,
  planName: string,
  content: string,
  context?: string
): boolean {
  return addEntry(directory, planName, 'decisions', content, context);
}

/**
 * Add an issue
 */
export function addIssue(
  directory: string,
  planName: string,
  content: string,
  context?: string
): boolean {
  return addEntry(directory, planName, 'issues', content, context);
}

/**
 * Add a problem
 */
export function addProblem(
  directory: string,
  planName: string,
  content: string,
  context?: string
): boolean {
  return addEntry(directory, planName, 'problems', content, context);
}

/**
 * Read notepad content
 */
export function readNotepad(
  directory: string,
  planName: string,
  type: NotepadType
): string | null {
  const path = getNotepadPath(directory, planName, type);

  if (!existsSync(path)) {
    return null;
  }

  try {
    return readFileSync(path, 'utf-8');
  } catch {
    return null;
  }
}

/**
 * Read all plan wisdom
 */
export function readPlanWisdom(
  directory: string,
  planName: string
): Record<NotepadType, string | null> {
  return {
    learnings: readNotepad(directory, planName, 'learnings'),
    decisions: readNotepad(directory, planName, 'decisions'),
    issues: readNotepad(directory, planName, 'issues'),
    problems: readNotepad(directory, planName, 'problems')
  };
}

/**
 * Count entries in a notepad
 */
function countEntries(content: string | null): number {
  if (!content) return 0;
  // Count entry separators (---) minus the header separator
  const matches = content.match(/\n---\n/g);
  return matches ? Math.max(0, matches.length - 1) : 0;
}

/**
 * Get wisdom summary
 */
export function getWisdomSummary(directory: string, planName: string): WisdomSummary {
  const wisdom = readPlanWisdom(directory, planName);

  const learnings = countEntries(wisdom.learnings);
  const decisions = countEntries(wisdom.decisions);
  const issues = countEntries(wisdom.issues);
  const problems = countEntries(wisdom.problems);

  return {
    learnings,
    decisions,
    issues,
    problems,
    totalEntries: learnings + decisions + issues + problems
  };
}

/**
 * Format wisdom for context injection
 */
export function formatWisdomForContext(directory: string, planName: string): string {
  const wisdom = readPlanWisdom(directory, planName);
  const summary = getWisdomSummary(directory, planName);

  if (summary.totalEntries === 0) {
    return '';
  }

  const parts: string[] = [
    `<plan-wisdom plan="${planName}">`,
    '',
    `Summary: ${summary.learnings} learnings, ${summary.decisions} decisions, ${summary.issues} issues, ${summary.problems} problems`,
    ''
  ];

  if (wisdom.learnings && summary.learnings > 0) {
    parts.push('## Recent Learnings');
    parts.push(extractRecentEntries(wisdom.learnings, 3));
    parts.push('');
  }

  if (wisdom.decisions && summary.decisions > 0) {
    parts.push('## Recent Decisions');
    parts.push(extractRecentEntries(wisdom.decisions, 3));
    parts.push('');
  }

  parts.push('</plan-wisdom>');
  parts.push('');
  parts.push('---');
  parts.push('');

  return parts.join('\n');
}

/**
 * Extract recent entries from content
 */
function extractRecentEntries(content: string, count: number): string {
  const entries = content.split(/\n---\n/).slice(1); // Skip header
  const recent = entries.slice(-count);
  return recent.join('\n---\n').trim();
}

/**
 * Create the notepad hook
 */
export function createNotepadHook(defaultPlanName?: string) {
  const planName = defaultPlanName || 'default';

  return {
    /**
     * Session start - inject wisdom context
     */
    sessionStart: (input: { session_id: string; directory?: string }): string | null => {
      const directory = input.directory || process.cwd();
      return formatWisdomForContext(directory, planName) || null;
    },

    /**
     * Add entries programmatically
     */
    addLearning: (directory: string, content: string, context?: string) =>
      addLearning(directory, planName, content, context),

    addDecision: (directory: string, content: string, context?: string) =>
      addDecision(directory, planName, content, context),

    addIssue: (directory: string, content: string, context?: string) =>
      addIssue(directory, planName, content, context),

    addProblem: (directory: string, content: string, context?: string) =>
      addProblem(directory, planName, content, context),

    /**
     * Get summary
     */
    getSummary: (directory: string) => getWisdomSummary(directory, planName)
  };
}
