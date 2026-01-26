/**
 * Hook Bridge - TypeScript logic invoked by shell scripts
 *
 * This module provides the main entry point for shell hooks to call TypeScript
 * for complex processing. The shell script reads stdin, passes it to this module,
 * and writes the JSON output to stdout.
 *
 * Usage from shell:
 * ```bash
 * #!/bin/bash
 * INPUT=$(cat)
 * echo "$INPUT" | node ~/.factory/omd/hook-bridge.mjs --hook=keyword-detector
 * ```
 */

/**
 * Input format from hooks (via stdin)
 */
export interface HookInput {
  /** Session identifier */
  sessionId?: string;
  /** User prompt text */
  prompt?: string;
  /** Message content (alternative to prompt) */
  message?: {
    content?: string;
  };
  /** Message parts (alternative structure) */
  parts?: Array<{
    type: string;
    text?: string;
  }>;
  /** Tool name (for tool hooks) */
  toolName?: string;
  /** Tool input parameters */
  toolInput?: unknown;
  /** Tool output (for post-tool hooks) */
  toolOutput?: unknown;
  /** Working directory */
  directory?: string;
}

/**
 * Output format for hooks (to stdout)
 */
export interface HookOutput {
  /** Whether to continue with the operation */
  continue: boolean;
  /** Optional message to inject into context */
  message?: string;
  /** Reason for blocking (when continue=false) */
  reason?: string;
  /** Modified tool input (for pre-tool hooks) */
  modifiedInput?: unknown;
}

/**
 * Hook types that can be processed
 */
export type HookType =
  | 'keyword-detector'
  | 'stop-continuation'
  | 'persistent-mode'
  | 'session-start'
  | 'pre-tool-use'
  | 'post-tool-use';

/**
 * Extract prompt text from various input formats
 */
function getPromptText(input: HookInput): string {
  if (input.prompt) {
    return input.prompt;
  }
  if (input.message?.content) {
    return input.message.content;
  }
  if (input.parts) {
    return input.parts
      .filter(p => p.type === 'text' && p.text)
      .map(p => p.text)
      .join(' ');
  }
  return '';
}

/**
 * Process keyword detection hook
 * Detects keywords and returns injection message
 */
function processKeywordDetector(input: HookInput): HookOutput {
  const promptText = getPromptText(input);
  if (!promptText) {
    return { continue: true };
  }

  // Basic keyword detection - extend as needed
  const promptLower = promptText.toLowerCase();

  // Detect ultrawork-style keywords
  if (promptLower.includes('ultrawork') || promptLower.includes('ulw')) {
    return {
      continue: true,
      message: '[ULTRAWORK MODE] Maximum parallel execution activated.'
    };
  }

  // Detect deep analysis keywords
  if (promptLower.includes('analyze') || promptLower.includes('investigate')) {
    return {
      continue: true,
      message: '[ANALYSIS MODE] Deep analysis requested.'
    };
  }

  return { continue: true };
}

/**
 * Process stop continuation hook
 * Checks for incomplete tasks and blocks stop if needed
 */
async function processStopContinuation(input: HookInput): Promise<HookOutput> {
  // Placeholder - extend with actual todo/task checking
  return { continue: true };
}

/**
 * Process persistent mode hook (unified stop handler)
 */
async function processPersistentMode(input: HookInput): Promise<HookOutput> {
  // Placeholder - extend with persistent mode checking
  return { continue: true };
}

/**
 * Process session start hook
 * Restores persistent mode states and injects context if needed
 */
async function processSessionStart(input: HookInput): Promise<HookOutput> {
  const directory = input.directory || process.cwd();
  const messages: string[] = [];

  // Check for restore conditions here
  // Placeholder for session restore logic

  if (messages.length > 0) {
    return {
      continue: true,
      message: messages.join('\n')
    };
  }

  return { continue: true };
}

/**
 * Process pre-tool-use hook
 * Tracks background tasks when Task tool is invoked
 */
function processPreToolUse(input: HookInput): HookOutput {
  // Track Task tool invocations for background tasks display
  if (input.toolName === 'Task') {
    const toolInput = input.toolInput as {
      description?: string;
      subagent_type?: string;
      run_in_background?: boolean;
    } | undefined;

    // Placeholder for background task tracking
  }

  return { continue: true };
}

/**
 * Process post-tool-use hook
 * Marks background tasks as completed
 */
function processPostToolUse(input: HookInput): HookOutput {
  // Track Task tool completion
  if (input.toolName === 'Task') {
    // Placeholder for task completion tracking
  }

  return { continue: true };
}

/**
 * Main hook processor
 * Routes to specific hook handler based on type
 */
export async function processHook(
  hookType: HookType,
  input: HookInput
): Promise<HookOutput> {
  try {
    switch (hookType) {
      case 'keyword-detector':
        return processKeywordDetector(input);

      case 'stop-continuation':
        return await processStopContinuation(input);

      case 'persistent-mode':
        return await processPersistentMode(input);

      case 'session-start':
        return await processSessionStart(input);

      case 'pre-tool-use':
        return processPreToolUse(input);

      case 'post-tool-use':
        return processPostToolUse(input);

      default:
        return { continue: true };
    }
  } catch (error) {
    // Log error but don't block execution
    console.error(`[hook-bridge] Error in ${hookType}:`, error);
    return { continue: true };
  }
}

/**
 * CLI entry point for shell script invocation
 * Reads JSON from stdin, processes hook, writes JSON to stdout
 */
export async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const hookArg = args.find(a => a.startsWith('--hook='));

  if (!hookArg) {
    console.error('Usage: node hook-bridge.mjs --hook=<type>');
    process.exit(1);
  }

  const hookType = hookArg.split('=')[1] as HookType;

  // Read stdin
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }

  const inputStr = Buffer.concat(chunks).toString('utf-8');

  let input: HookInput;
  try {
    input = JSON.parse(inputStr);
  } catch {
    input = {};
  }

  // Process hook
  const output = await processHook(hookType, input);

  // Write output to stdout
  console.log(JSON.stringify(output));
}

// Entry point for CLI invocation is handled externally
// This module is designed to be imported and used by the hook system
