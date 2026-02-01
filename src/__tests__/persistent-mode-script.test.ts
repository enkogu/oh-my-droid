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

describe('persistent-mode hook scripts', () => {
  let homeDir: string;
  let projectDir: string;

  beforeEach(() => {
    homeDir = mkdtempSync(join(tmpdir(), 'omd-home-'));
    projectDir = mkdtempSync(join(tmpdir(), 'omd-project-'));

    mkdirSync(join(projectDir, '.omd', 'state'), { recursive: true });
    writeFileSync(
      join(projectDir, '.omd', 'state', 'ultrawork-state.json'),
      JSON.stringify(
        {
          active: true,
          started_at: new Date().toISOString(),
          last_checked_at: new Date().toISOString(),
          original_prompt: 'test ultrawork',
          reinforcement_count: 0,
        },
        null,
        2
      )
    );
  });

  afterEach(() => {
    rmSync(homeDir, { recursive: true, force: true });
    rmSync(projectDir, { recursive: true, force: true });
  });

  it('templates/hooks/persistent-mode.mjs returns {continue:true} (no legacy decision:block)', () => {
    const scriptPath = join(process.cwd(), 'templates', 'hooks', 'persistent-mode.mjs');

    const output = runNodeScript(
      scriptPath,
      { directory: projectDir, sessionId: 'session_1' },
      { ...process.env, HOME: homeDir }
    );

    expect(output.continue).toBe(true);
    expect(output.decision).toBeUndefined();
    expect(typeof output.message).toBe('string');
    expect(output.message).toContain('[ULTRAWORK');
  });

  it('scripts/persistent-mode.mjs returns {continue:true} (no legacy decision:block)', () => {
    const scriptPath = join(process.cwd(), 'scripts', 'persistent-mode.mjs');

    const output = runNodeScript(
      scriptPath,
      { directory: projectDir, sessionId: 'session_1' },
      { ...process.env, HOME: homeDir }
    );

    expect(output.continue).toBe(true);
    expect(output.decision).toBeUndefined();
    expect(typeof output.message).toBe('string');
    expect(output.message).toContain('[ULTRAWORK');
  });
});
