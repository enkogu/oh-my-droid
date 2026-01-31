#!/usr/bin/env node

/**
 * oh-my-droid Session Start Hook (Node.js)
 * Restores persistent mode states when session starts
 * Cross-platform: Windows, macOS, Linux
 */

import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { homedir } from 'os';
import { fileURLToPath } from 'url';

// Read all stdin
async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

// Read JSON file safely
function readJsonFile(path) {
  try {
    if (!existsSync(path)) return null;
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch {
    return null;
  }
}

function getPluginRoot() {
  if (process.env.DROID_PLUGIN_ROOT) return process.env.DROID_PLUGIN_ROOT;
  // Fallback: repo-relative when running scripts locally
  return join(dirname(fileURLToPath(import.meta.url)), '..');
}

function convertSkillFrontmatterToCommand(content) {
  // Remove `name:` from YAML frontmatter since Factory slash commands use filename as the command name.
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) return content;

  const frontmatter = match[1];
  const body = match[2];
  const newLines = frontmatter
    .split('\n')
    .filter(line => !line.trimStart().startsWith('name:'));

  return `---\n${newLines.join('\n')}\n---\n${body}`;
}

function ensureOmdSlashCommands() {
  const pluginRoot = getPluginRoot();
  const skillsDir = join(pluginRoot, 'skills');
  const commandsDir = join(homedir(), '.factory', 'commands');
  const markerDir = join(homedir(), '.factory', 'omd');
  const markerPath = join(markerDir, 'commands-installed.json');

  const result = { installed: [], skipped: [], errors: [] };

  try {
    if (!existsSync(skillsDir)) return result;

    if (!existsSync(commandsDir)) {
      try {
        mkdirSync(commandsDir, { recursive: true });
      } catch {
        // If we can't create, just stop silently
        return result;
      }
    }

    const force = process.env.OMD_FORCE_COMMANDS === '1';
    const skillDirs = readdirSync(skillsDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    for (const skillName of skillDirs) {
      const skillPath = join(skillsDir, skillName, 'SKILL.md');
      if (!existsSync(skillPath)) continue;

      const targetPath = join(commandsDir, `omd-${skillName}.md`);
      if (existsSync(targetPath) && !force) {
        result.skipped.push(skillName);
        continue;
      }

      try {
        const content = readFileSync(skillPath, 'utf-8');
        const commandContent = convertSkillFrontmatterToCommand(content);
        writeFileSync(targetPath, commandContent);
        result.installed.push(skillName);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        result.errors.push(`${skillName}: ${msg}`);
      }
    }

    try {
      if (!existsSync(markerDir)) {
        mkdirSync(markerDir, { recursive: true });
      }
      writeFileSync(
        markerPath,
        JSON.stringify(
          {
            updatedAt: new Date().toISOString(),
            installed: result.installed,
            skipped: result.skipped,
            errors: result.errors
          },
          null,
          2
        )
      );
    } catch {
      // ignore marker failures
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    result.errors.push(msg);
  }

  return result;
}

// Count incomplete todos
function countIncompleteTodos(todosDir, projectDir) {
  let count = 0;

  // Check global todos
  if (existsSync(todosDir)) {
    try {
      const files = readdirSync(todosDir).filter(f => f.endsWith('.json'));
      for (const file of files) {
        const todos = readJsonFile(join(todosDir, file));
        if (Array.isArray(todos)) {
          count += todos.filter(t => t.status !== 'completed' && t.status !== 'cancelled').length;
        }
      }
    } catch {}
  }

  // Check project todos
  for (const path of [
    join(projectDir, '.omd', 'todos.json'),
    join(projectDir, '.factory', 'todos.json')
  ]) {
    const data = readJsonFile(path);
    const todos = data?.todos || data;
    if (Array.isArray(todos)) {
      count += todos.filter(t => t.status !== 'completed' && t.status !== 'cancelled').length;
    }
  }

  return count;
}

// Main
async function main() {
  try {
    const input = await readStdin();
    let data = {};
    try { data = JSON.parse(input); } catch {}

    const directory = data.cwd || process.cwd();
    const messages = [];

    // Ensure /omd-* slash commands exist (Factory only scans ~/.factory/commands and <repo>/.factory/commands)
    const cmdResult = ensureOmdSlashCommands();
    if (cmdResult.installed.length > 0) {
      messages.push(`<session-restore>

[OMD SLASH COMMANDS INSTALLED]

Installed/updated ${cmdResult.installed.length} commands in ~/.factory/commands.
Examples: /omd-setup, /omd-help

If commands don't appear yet, open /commands and press R to reload, or restart Droid.

</session-restore>

---
`);
    }

    // Check for ultrawork state
    const ultraworkState = readJsonFile(join(directory, '.omd', 'ultrawork-state.json'))
      || readJsonFile(join(homedir(), '.factory', 'omd', 'ultrawork-state.json'));

    if (ultraworkState?.active) {
      messages.push(`<session-restore>

[ULTRAWORK MODE RESTORED]

You have an active ultrawork session from ${ultraworkState.started_at}.
Original task: ${ultraworkState.original_prompt}

Continue working in ultrawork mode until all tasks are complete.

</session-restore>

---
`);
    }

    // Check for autopilot state
    const autopilotState = readJsonFile(join(directory, '.omd', 'autopilot-state.json'));
    if (autopilotState?.active) {
      messages.push(`<session-restore>

[AUTOPILOT MODE RESTORED]

You have an active autopilot session from ${autopilotState.started_at}.
Original task: ${autopilotState.original_prompt}

Continue working autonomously until the task is complete.

</session-restore>

---
`);
    }

    // Check for ralph loop state
    const ralphState = readJsonFile(join(directory, '.omd', 'ralph-state.json'));
    if (ralphState?.active) {
      messages.push(`<session-restore>

[RALPH LOOP RESTORED]

You have an active ralph-loop session.
Original task: ${ralphState.prompt || 'Task in progress'}
Iteration: ${ralphState.iteration || 1}/${ralphState.max_iterations || 100}

Continue working until the task is verified complete.

</session-restore>

---
`);
    }

    // Check for eco mode state
    const ecoState = readJsonFile(join(directory, '.omd', 'eco-state.json'));
    if (ecoState?.active) {
      messages.push(`<session-restore>

[ECO MODE RESTORED]

You have an active eco mode session from ${ecoState.started_at}.
Original task: ${ecoState.original_prompt}

Continue operating in token-efficient mode.

</session-restore>

---
`);
    }

    // Check for incomplete todos
    const todosDir = join(homedir(), '.factory', 'todos');
    const incompleteCount = countIncompleteTodos(todosDir, directory);

    if (incompleteCount > 0) {
      messages.push(`<session-restore>

[PENDING TASKS DETECTED]

You have ${incompleteCount} incomplete tasks from a previous session.
Please continue working on these tasks.

</session-restore>

---
`);
    }

    // Check for notepad Priority Context
    const notepadPath = join(directory, '.omd', 'notepad.md');
    if (existsSync(notepadPath)) {
      try {
        const notepadContent = readFileSync(notepadPath, 'utf-8');
        const priorityMatch = notepadContent.match(/## Priority Context\n([\s\S]*?)(?=## |$)/);
        if (priorityMatch && priorityMatch[1].trim()) {
          const priorityContext = priorityMatch[1].trim();
          // Only inject if there's actual content (not just the placeholder comment)
          const cleanContent = priorityContext.replace(/<!--[\s\S]*?-->/g, '').trim();
          if (cleanContent) {
            messages.push(`<notepad-context>
[NOTEPAD - Priority Context]
${cleanContent}
</notepad-context>`);
          }
        }
      } catch (err) {
        // Silently ignore notepad read errors
      }
    }

    if (messages.length > 0) {
      console.log(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'SessionStart',
          additionalContext: messages.join('\n')
        }
      }));
    } else {
      console.log(JSON.stringify({ continue: true }));
    }
  } catch (error) {
    console.log(JSON.stringify({ continue: true }));
  }
}

main();
