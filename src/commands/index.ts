/**
 * Command Expansion Utilities
 *
 * Provides SDK-compatible access to slash commands by reading
 * command templates and expanding them with arguments.
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

export interface CommandInfo {
  name: string;
  description: string;
  template: string;
  filePath: string;
}

export interface ExpandedCommand {
  name: string;
  prompt: string;
  description: string;
}

/**
 * Get the personal commands directory path (Factory Droid standard)
 */
export function getCommandsDir(): string {
  return join(homedir(), '.factory', 'commands');
}

/**
 * Get the workspace commands directory path
 */
export function getWorkspaceCommandsDir(): string {
  const projectDir = process.env.FACTORY_PROJECT_DIR || process.cwd();
  return join(projectDir, '.factory', 'commands');
}

/**
 * Parse command frontmatter and content
 */
function parseCommandFile(content: string): { description: string; template: string } {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!frontmatterMatch) {
    return { description: '', template: content };
  }

  const frontmatter = frontmatterMatch[1];
  const template = frontmatterMatch[2];

  // Extract description from frontmatter
  const descMatch = frontmatter.match(/description:\s*(.+)/);
  const description = descMatch ? descMatch[1].trim() : '';

  return { description, template };
}

/**
 * Get a specific command by name
 * Checks workspace first, then personal directory
 */
export function getCommand(name: string): CommandInfo | null {
  // Check workspace first (takes precedence)
  const workspaceDir = getWorkspaceCommandsDir();
  const workspaceCommand = getCommandFromDir(workspaceDir, name);
  if (workspaceCommand) {
    return workspaceCommand;
  }

  // Fall back to personal commands
  const personalDir = getCommandsDir();
  return getCommandFromDir(personalDir, name);
}

/**
 * Get all available commands from both personal and workspace directories
 * Workspace commands take precedence over personal commands
 */
export function getAllCommands(): CommandInfo[] {
  const personalDir = getCommandsDir();
  const workspaceDir = getWorkspaceCommandsDir();
  const commandMap = new Map<string, CommandInfo>();

  // Load personal commands first
  if (existsSync(personalDir)) {
    try {
      const files = readdirSync(personalDir).filter(f => f.endsWith('.md'));
      for (const file of files) {
        const name = file.replace('.md', '');
        const command = getCommandFromDir(personalDir, name);
        if (command) {
          commandMap.set(name, command);
        }
      }
    } catch (error) {
      console.error('Error listing personal commands:', error);
    }
  }

  // Load workspace commands (override personal)
  if (existsSync(workspaceDir) && workspaceDir !== personalDir) {
    try {
      const files = readdirSync(workspaceDir).filter(f => f.endsWith('.md'));
      for (const file of files) {
        const name = file.replace('.md', '');
        const command = getCommandFromDir(workspaceDir, name);
        if (command) {
          commandMap.set(name, command);
        }
      }
    } catch (error) {
      console.error('Error listing workspace commands:', error);
    }
  }

  return Array.from(commandMap.values());
}

/**
 * Get a command from a specific directory
 */
function getCommandFromDir(dir: string, name: string): CommandInfo | null {
  const filePath = join(dir, `${name}.md`);

  if (!existsSync(filePath)) {
    return null;
  }

  try {
    const content = readFileSync(filePath, 'utf-8');
    const { description, template } = parseCommandFile(content);

    return {
      name,
      description,
      template,
      filePath
    };
  } catch (error) {
    console.error(`Error reading command ${name}:`, error);
    return null;
  }
}

/**
 * List available command names
 */
export function listCommands(): string[] {
  return getAllCommands().map(c => c.name);
}

/**
 * Expand a command template with arguments
 *
 * @param name - Command name (without leading slash)
 * @param args - Arguments to substitute for $ARGUMENTS
 * @returns Expanded command ready for SDK query
 *
 * @example
 * ```typescript
 * import { expandCommand } from 'oh-my-droid';
 *
 * const prompt = expandCommand('ralph', 'Build a REST API');
 * // Returns the full ralph template with "Build a REST API" substituted
 * ```
 */
export function expandCommand(name: string, args: string = ''): ExpandedCommand | null {
  const command = getCommand(name);

  if (!command) {
    return null;
  }

  // Replace $ARGUMENTS placeholder with actual arguments
  const prompt = command.template.replace(/\$ARGUMENTS/g, args);

  return {
    name,
    prompt: prompt.trim(),
    description: command.description
  };
}

/**
 * Expand a command and return just the prompt string
 * Convenience function for direct use with SDK query
 *
 * @example
 * ```typescript
 * import { expandCommandPrompt } from 'oh-my-droid';
 * import { query } from '@anthropic-ai/claude-agent-sdk';
 *
 * const prompt = expandCommandPrompt('ultrawork', 'Refactor the auth module');
 *
 * for await (const msg of query({ prompt })) {
 *   console.log(msg);
 * }
 * ```
 */
export function expandCommandPrompt(name: string, args: string = ''): string | null {
  const expanded = expandCommand(name, args);
  return expanded ? expanded.prompt : null;
}

/**
 * Check if a command exists
 */
export function commandExists(name: string): boolean {
  return getCommand(name) !== null;
}

/**
 * Batch expand multiple commands
 */
export function expandCommands(commands: Array<{ name: string; args?: string }>): ExpandedCommand[] {
  return commands
    .map(({ name, args }) => expandCommand(name, args))
    .filter((c): c is ExpandedCommand => c !== null);
}
