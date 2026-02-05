import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execFileSync } from 'child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

function runNodeScript(scriptPath: string, input: unknown, env: NodeJS.ProcessEnv): Record<string, unknown> {
  const stdout = execFileSync('node', [scriptPath], {
    input: JSON.stringify(input),
    env,
    encoding: 'utf8',
  });

  const lastLine = stdout.trim().split(/\r?\n/).pop();
  if (!lastLine) throw new Error('No stdout from hook script');
  return JSON.parse(lastLine) as Record<string, unknown>;
}

describe('pre-tool-use hook script', () => {
  let homeDir: string;
  let projectDir: string;

  beforeEach(() => {
    homeDir = mkdtempSync(join(tmpdir(), 'omd-home-'));
    projectDir = mkdtempSync(join(tmpdir(), 'omd-project-'));
  });

  afterEach(() => {
    rmSync(homeDir, { recursive: true, force: true });
    rmSync(projectDir, { recursive: true, force: true });
  });

  it('adds run_in_background for Task calls during ultrawork', () => {
    mkdirSync(join(projectDir, '.omd', 'state'), { recursive: true });
    writeFileSync(
      join(projectDir, '.omd', 'state', 'ultrawork-state.json'),
      JSON.stringify({ active: true, started_at: new Date().toISOString() }, null, 2)
    );

    const scriptPath = join(process.cwd(), 'templates', 'hooks', 'pre-tool-use.mjs');

    const output = runNodeScript(
      scriptPath,
      {
        directory: projectDir,
        tool_name: 'Task',
        tool_input: {
          subagent_type: 'oh-my-droid:explore',
          description: 'scan repo',
          prompt: 'find files',
        },
      },
      { ...process.env, HOME: homeDir }
    );

    expect(output.continue).toBe(true);
    const hso = output.hookSpecificOutput as any;
    expect(hso?.hookEventName).toBe('PreToolUse');
    expect(hso?.updatedInput?.run_in_background).toBe(true);
  });

  it('respects explicit run_in_background=false', () => {
    mkdirSync(join(projectDir, '.omd', 'state'), { recursive: true });
    writeFileSync(
      join(projectDir, '.omd', 'state', 'ultrawork-state.json'),
      JSON.stringify({ active: true, started_at: new Date().toISOString() }, null, 2)
    );

    const scriptPath = join(process.cwd(), 'templates', 'hooks', 'pre-tool-use.mjs');

    const output = runNodeScript(
      scriptPath,
      {
        directory: projectDir,
        tool_name: 'Task',
        tool_input: {
          subagent_type: 'oh-my-droid:explore',
          description: 'scan repo',
          prompt: 'find files',
          run_in_background: false,
        },
      },
      { ...process.env, HOME: homeDir }
    );

    expect(output.continue).toBe(true);
    expect(output.hookSpecificOutput).toBeUndefined();
  });
});
