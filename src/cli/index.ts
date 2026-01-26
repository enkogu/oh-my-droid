#!/usr/bin/env node

/**
 * Oh-My-Droid CLI
 *
 * Command-line interface for the multi-agent orchestration system.
 *
 * Commands:
 * - stats: Show aggregate statistics
 * - cost: Generate cost reports
 * - sessions: View session history
 * - agents: Show agent usage breakdown
 * - export: Export data to JSON/CSV
 * - cleanup: Clean up old logs
 * - backfill: Backfill analytics from transcripts
 * - tui: Launch interactive token visualization
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import * as fs from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';
import {
  loadConfig,
  getConfigPaths,
  generateConfigSchema
} from '../config/loader.js';
import { statsCommand } from './commands/stats.js';
import { costCommand } from './commands/cost.js';
import { sessionsCommand } from './commands/sessions.js';
import { agentsCommand } from './commands/agents.js';
import { exportCommand } from './commands/export.js';
import { cleanupCommand } from './commands/cleanup.js';
import { backfillCommand } from './commands/backfill.js';
import {
  launchTokscaleTUI,
  isTokscaleCLIAvailable,
  getInstallInstructions
} from './utils/tokscale-launcher.js';
import {
  install as installOmd,
  installSlashCommands,
  listInstalledCommands,
  uninstallSlashCommands,
  cleanupLegacyCommands,
  uninstall as uninstallOmd,
  cleanInstall as cleanInstallOmd,
  isInstalled,
  getInstallInfo,
  FACTORY_COMMANDS_DIR,
  FACTORY_CONFIG_DIR
} from '../installer/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Try to load package.json for version
let version = '1.0.0';
try {
  const pkgPath = join(__dirname, '../../package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  version = pkg.version;
} catch {
  // Use default version
}

const program = new Command();

// Helper functions for auto-backfill
async function checkIfBackfillNeeded(): Promise<boolean> {
  const tokenLogPath = join(homedir(), '.factory', 'omd', 'state', 'token-tracking.jsonl');
  try {
    await fs.access(tokenLogPath);
    const stats = await fs.stat(tokenLogPath);
    // Backfill if file is older than 1 hour or very small
    const ageMs = Date.now() - stats.mtimeMs;
    return stats.size < 100 || ageMs > 3600000;
  } catch {
    return true; // File doesn't exist
  }
}

async function runQuickBackfill(silent: boolean = false): Promise<void> {
  const { BackfillEngine } = await import('../analytics/backfill-engine.js');
  const engine = new BackfillEngine();
  const result = await engine.run({ verbose: false });
  if (result.entriesAdded > 0 && !silent) {
    console.log(chalk.green(`Backfilled ${result.entriesAdded} entries in ${result.timeElapsed}ms`));
  }
}

// Auto-backfill before analytics commands
async function ensureBackfillDone(): Promise<void> {
  const shouldBackfill = await checkIfBackfillNeeded();
  if (shouldBackfill) {
    await runQuickBackfill(true); // Silent backfill for subcommands
  }
}

// Display enhanced banner using gradient-string (loaded dynamically)
async function displayAnalyticsBanner() {
  try {
    // @ts-ignore - gradient-string will be installed during setup
    const gradient = await import('gradient-string');
    const banner = gradient.default.pastel.multiline([
      '╔═══════════════════════════════════════╗',
      '║   Oh-My-Droid - Analytics Dashboard   ║',
      '╚═══════════════════════════════════════╝'
    ].join('\n'));
    console.log(banner);
    console.log('');
  } catch (error) {
    // Fallback if gradient-string not installed
    console.log('╔═══════════════════════════════════════╗');
    console.log('║   Oh-My-Droid - Analytics Dashboard   ║');
    console.log('╚═══════════════════════════════════════╝');
    console.log('');
  }
}

// Default action when running 'omd' with no args - show everything
async function defaultAction() {
  await displayAnalyticsBanner();

  // Check if we need to backfill for agent data
  const shouldAutoBackfill = await checkIfBackfillNeeded();
  if (shouldAutoBackfill) {
    console.log(chalk.yellow('First run detected - backfilling agent data...'));
    await runQuickBackfill();
  }

  // Show aggregate session stats
  console.log(chalk.bold('📊 Aggregate Session Statistics'));
  console.log(chalk.gray('─'.repeat(50)));
  await statsCommand({ json: false });

  console.log('\n');

  // Show cost breakdown
  console.log(chalk.bold('💰 Cost Analysis (Monthly)'));
  console.log(chalk.gray('─'.repeat(50)));
  await costCommand('monthly', { json: false });

  console.log('\n');

  // Show top agents
  console.log(chalk.bold('🤖 Top Agents'));
  console.log(chalk.gray('─'.repeat(50)));
  await agentsCommand({ json: false, limit: 10 });

  console.log('\n');
  console.log(chalk.dim('Run with --help to see all available commands'));

  // Show tokscale hint if available
  const tuiAvailable = await isTokscaleCLIAvailable();

  if (tuiAvailable) {
    console.log('');
    console.log(chalk.dim('Tip: Run `omd tui` for an interactive token visualization dashboard'));
  }
}

program
  .name('omd')
  .description('Multi-agent orchestration system for Claude Agent SDK with analytics')
  .version(version)
  .action(defaultAction);

/**
 * Analytics Commands
 */

// Stats command
program
  .command('stats')
  .description('Show aggregate statistics (or specific session with --session)')
  .option('--json', 'Output as JSON')
  .option('--session <id>', 'Show stats for specific session (defaults to aggregate)')
  .action(async (options) => {
    await ensureBackfillDone();
    await statsCommand(options);
  });

// Cost command
program
  .command('cost [period]')
  .description('Generate cost report (period: daily, weekly, monthly)')
  .option('--json', 'Output as JSON')
  .action(async (period = 'monthly', options) => {
    if (!['daily', 'weekly', 'monthly'].includes(period)) {
      console.error('Invalid period. Use: daily, weekly, or monthly');
      process.exit(1);
    }
    await ensureBackfillDone();
    await costCommand(period as 'daily' | 'weekly' | 'monthly', options);
  });

// Sessions command
program
  .command('sessions')
  .description('View session history')
  .option('--json', 'Output as JSON')
  .option('--limit <number>', 'Limit number of sessions', '10')
  .action(async (options) => {
    await ensureBackfillDone();
    await sessionsCommand({ ...options, limit: parseInt(options.limit) });
  });

// Agents command
program
  .command('agents')
  .description('Show agent usage breakdown')
  .option('--json', 'Output as JSON')
  .option('--limit <number>', 'Limit number of agents', '10')
  .action(async (options) => {
    await ensureBackfillDone();
    await agentsCommand({ ...options, limit: parseInt(options.limit) });
  });

// Export command
program
  .command('export <type> <format> <output>')
  .description('Export data (type: cost, sessions, patterns; format: json, csv)')
  .option('--period <period>', 'Period for cost report (daily, weekly, monthly)', 'monthly')
  .action((type, format, output, options) => {
    if (!['cost', 'sessions', 'patterns'].includes(type)) {
      console.error('Invalid type. Use: cost, sessions, or patterns');
      process.exit(1);
    }
    if (!['json', 'csv'].includes(format)) {
      console.error('Invalid format. Use: json or csv');
      process.exit(1);
    }
    exportCommand(type as any, format as any, output, options);
  });

// Cleanup command
program
  .command('cleanup')
  .description('Clean up old logs and orphaned background tasks')
  .option('--retention <days>', 'Retention period in days', '30')
  .action(options => {
    cleanupCommand({ ...options, retention: parseInt(options.retention) });
  });

// Backfill command (deprecated - auto-backfill runs on every command)
program
  .command('backfill')
  .description('[DEPRECATED] Backfill now runs automatically. Use for manual re-sync only.')
  .option('--project <path>', 'Filter to specific project path')
  .option('--from <date>', 'Start date (ISO format: YYYY-MM-DD)')
  .option('--to <date>', 'End date (ISO format: YYYY-MM-DD)')
  .option('--dry-run', 'Preview without writing data')
  .option('--reset', 'Clear deduplication index and re-process all transcripts')
  .option('--verbose', 'Show detailed progress')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    if (!options.reset && !options.project && !options.from && !options.to) {
      console.log(chalk.yellow('Note: Backfill now runs automatically with every omd command.'));
      console.log(chalk.gray('Use --reset to force full re-sync, or --project/--from/--to for filtered backfill.\n'));
    }
    await backfillCommand(options);
  });

// TUI command
program
  .command('tui')
  .description('Launch tokscale interactive TUI for token visualization')
  .option('--light', 'Use light theme')
  .option('--models', 'Show models view')
  .option('--daily', 'Show daily view')
  .option('--stats', 'Show stats view')
  .option('--no-claude', 'Show all providers (not just Claude)')
  .action(async (options) => {
    const available = await isTokscaleCLIAvailable();

    if (!available) {
      console.log(chalk.yellow('tokscale is not installed.'));
      console.log(getInstallInstructions());
      process.exit(1);
    }

    const view = options.models ? 'models'
               : options.daily ? 'daily'
               : options.stats ? 'stats'
               : 'overview';

    try {
      await launchTokscaleTUI({
        light: options.light,
        view,
        claude: options.claude
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(chalk.red(`Failed to launch TUI: ${message}`));
      process.exit(1);
    }
  });

/**
 * Init command - Initialize configuration
 */
program
  .command('init')
  .description('Initialize oh-my-droid configuration in the current directory')
  .option('-g, --global', 'Initialize global user configuration')
  .option('-f, --force', 'Overwrite existing configuration')
  .action(async (options) => {
    console.log(chalk.yellow('⚠️  DEPRECATED: The init command is deprecated.'));
    console.log(chalk.gray('Configuration is now managed automatically. Use /oh-my-droid:omd-setup instead.\n'));

    const paths = getConfigPaths();
    const targetPath = options.global ? paths.user : paths.project;
    const targetDir = dirname(targetPath);

    console.log(chalk.blue('Oh-My-Droid Configuration Setup\n'));

    // Check if config already exists
    if (existsSync(targetPath) && !options.force) {
      console.log(chalk.yellow(`Configuration already exists at ${targetPath}`));
      console.log(chalk.gray('Use --force to overwrite'));
      return;
    }

    // Create directory if needed
    if (!existsSync(targetDir)) {
      mkdirSync(targetDir, { recursive: true });
      console.log(chalk.green(`Created directory: ${targetDir}`));
    }

    // Generate config content
    const configContent = `// Oh-My-Droid Configuration
// See: https://github.com/your-repo/oh-my-droid for documentation
{
  "$schema": "./omd-schema.json",

  // Agent model configurations
  "agents": {
    "omd": {
      // Main orchestrator - uses the most capable model
      "model": "claude-opus-4-5-20251101"
    },
    "architect": {
      // Architecture and debugging expert
      "model": "claude-opus-4-5-20251101",
      "enabled": true
    },
    "researcher": {
      // Documentation and codebase analysis
      "model": "claude-sonnet-4-5-20250514"
    },
    "explore": {
      // Fast pattern matching - uses fastest model
      "model": "claude-3-5-haiku-20241022"
    },
    "frontendEngineer": {
      "model": "claude-sonnet-4-5-20250514",
      "enabled": true
    },
    "documentWriter": {
      "model": "claude-3-5-haiku-20241022",
      "enabled": true
    },
    "multimodalLooker": {
      "model": "claude-sonnet-4-5-20250514",
      "enabled": true
    }
  },

  // Feature toggles
  "features": {
    "parallelExecution": true,
    "lspTools": true,
    "astTools": true,
    "continuationEnforcement": true,
    "autoContextInjection": true
  },

  // MCP server integrations
  "mcpServers": {
    "exa": {
      "enabled": true
      // Set EXA_API_KEY environment variable for API key
    },
    "context7": {
      "enabled": true
    }
  },

  // Permission settings
  "permissions": {
    "allowBash": true,
    "allowEdit": true,
    "allowWrite": true,
    "maxBackgroundTasks": 5
  },

  // Magic keyword triggers (customize if desired)
  "magicKeywords": {
    "ultrawork": ["ultrawork", "ulw", "uw"],
    "search": ["search", "find", "locate"],
    "analyze": ["analyze", "investigate", "examine"]
  }
}
`;

    writeFileSync(targetPath, configContent);
    console.log(chalk.green(`Created configuration: ${targetPath}`));

    // Also create the JSON schema for editor support
    const schemaPath = join(targetDir, 'omd-schema.json');
    writeFileSync(schemaPath, JSON.stringify(generateConfigSchema(), null, 2));
    console.log(chalk.green(`Created JSON schema: ${schemaPath}`));

    console.log(chalk.blue('\nSetup complete!'));
    console.log(chalk.gray('Edit the configuration file to customize your setup.'));

    // Create DROID.md template if it doesn't exist
    const droidMdPath = join(process.cwd(), 'DROID.md');
    if (!existsSync(droidMdPath) && !options.global) {
      const droidMdContent = `# Project Agents Configuration

This file provides context and instructions to AI agents working on this project.

## Project Overview

<!-- Describe your project here -->

## Architecture

<!-- Describe the architecture and key components -->

## Conventions

<!-- List coding conventions, naming patterns, etc. -->

## Important Files

<!-- List key files agents should know about -->

## Common Tasks

<!-- Describe common development tasks and how to perform them -->
`;
      writeFileSync(droidMdPath, droidMdContent);
      console.log(chalk.green(`Created DROID.md template`));
    }
  });

/**
 * Config command - Show or validate configuration
 */
program
  .command('config')
  .description('Show current configuration')
  .option('-v, --validate', 'Validate configuration')
  .option('-p, --paths', 'Show configuration file paths')
  .action(async (options) => {
    if (options.paths) {
      const paths = getConfigPaths();
      console.log(chalk.blue('Configuration file paths:'));
      console.log(`  User:    ${paths.user}`);
      console.log(`  Project: ${paths.project}`);

      console.log(chalk.blue('\nFile status:'));
      console.log(`  User:    ${existsSync(paths.user) ? chalk.green('exists') : chalk.gray('not found')}`);
      console.log(`  Project: ${existsSync(paths.project) ? chalk.green('exists') : chalk.gray('not found')}`);
      return;
    }

    const config = loadConfig();

    if (options.validate) {
      console.log(chalk.blue('Validating configuration...\n'));

      // Check for required fields
      const warnings: string[] = [];
      const errors: string[] = [];

      if (!process.env.ANTHROPIC_API_KEY) {
        warnings.push('ANTHROPIC_API_KEY environment variable not set');
      }

      if (config.mcpServers?.exa?.enabled && !process.env.EXA_API_KEY && !config.mcpServers.exa.apiKey) {
        warnings.push('Exa is enabled but EXA_API_KEY is not set');
      }

      if (errors.length > 0) {
        console.log(chalk.red('Errors:'));
        errors.forEach(e => console.log(chalk.red(`  - ${e}`)));
      }

      if (warnings.length > 0) {
        console.log(chalk.yellow('Warnings:'));
        warnings.forEach(w => console.log(chalk.yellow(`  - ${w}`)));
      }

      if (errors.length === 0 && warnings.length === 0) {
        console.log(chalk.green('Configuration is valid!'));
      }

      return;
    }

    console.log(chalk.blue('Current configuration:\n'));
    console.log(JSON.stringify(config, null, 2));
  });

/**
 * Info command - Show system information
 */
program
  .command('info')
  .description('Show system and agent information')
  .action(async () => {
    const config = loadConfig();

    console.log(chalk.blue.bold('\nOh-My-Droid System Information\n'));
    console.log(chalk.gray('━'.repeat(50)));

    console.log(chalk.blue('\nConfigured Agents:'));
    const agents = config.agents;
    if (agents) {
      for (const [name, agentConfig] of Object.entries(agents)) {
        const typedConfig = agentConfig as { model?: string; enabled?: boolean };
        const status = typedConfig.enabled === false ? chalk.gray('(disabled)') : '';
        console.log(`  ${chalk.green(name)} ${status}`);
        if (typedConfig.model) {
          console.log(`    ${chalk.gray(`Model: ${typedConfig.model}`)}`);
        }
      }
    }

    console.log(chalk.blue('\nEnabled Features:'));
    const features = config.features;
    if (features) {
      console.log(`  Parallel Execution:      ${features.parallelExecution ? chalk.green('enabled') : chalk.gray('disabled')}`);
      console.log(`  LSP Tools:               ${features.lspTools ? chalk.green('enabled') : chalk.gray('disabled')}`);
      console.log(`  AST Tools:               ${features.astTools ? chalk.green('enabled') : chalk.gray('disabled')}`);
      console.log(`  Continuation Enforcement:${features.continuationEnforcement ? chalk.green('enabled') : chalk.gray('disabled')}`);
      console.log(`  Auto Context Injection:  ${features.autoContextInjection ? chalk.green('enabled') : chalk.gray('disabled')}`);
    }

    console.log(chalk.blue('\nMCP Servers:'));
    const mcpServers = config.mcpServers;
    if (mcpServers) {
      for (const [name, serverConfig] of Object.entries(mcpServers)) {
        const typedConfig = serverConfig as { enabled?: boolean };
        const status = typedConfig.enabled ? chalk.green('enabled') : chalk.gray('disabled');
        console.log(`  ${name}: ${status}`);
      }
    }

    console.log(chalk.blue('\nMagic Keywords:'));
    console.log(`  Ultrawork: ${chalk.cyan(config.magicKeywords?.ultrawork?.join(', ') ?? 'ultrawork, ulw, uw')}`);
    console.log(`  Search:    ${chalk.cyan(config.magicKeywords?.search?.join(', ') ?? 'search, find, locate')}`);
    console.log(`  Analyze:   ${chalk.cyan(config.magicKeywords?.analyze?.join(', ') ?? 'analyze, investigate, examine')}`);

    console.log(chalk.gray('\n━'.repeat(50)));
    console.log(chalk.gray(`Version: ${version}`));
  });

/**
 * Version command - Show version information
 */
program
  .command('version')
  .description('Show detailed version information')
  .action(async () => {
    console.log(chalk.blue.bold('\nOh-My-Droid Version Information\n'));
    console.log(chalk.gray('━'.repeat(50)));

    console.log(`\n  Package version:   ${chalk.green(version)}`);

    console.log(chalk.gray('\n━'.repeat(50)));
    console.log(chalk.gray('\nTo check for updates, run: omd update --check'));
  });

/**
 * Install command - Full installation to ~/.factory/
 */
program
  .command('install')
  .description('Install oh-my-droid agents, hooks, and commands to Factory config (~/.factory/)')
  .option('-f, --force', 'Overwrite existing files')
  .option('-q, --quiet', 'Suppress output except for errors')
  .option('--skip-factory-check', 'Skip checking if Factory Droid is installed')
  .action(async (options) => {
    if (!options.quiet) {
      console.log(chalk.blue('╔═══════════════════════════════════════════════════════════╗'));
      console.log(chalk.blue('║              Oh-My-Droid Installer                        ║'));
      console.log(chalk.blue('║   Multi-Agent Orchestration for Factory Droid            ║'));
      console.log(chalk.blue('╚═══════════════════════════════════════════════════════════╝'));
      console.log('');
    }

    // Check if already installed
    if (isInstalled() && !options.force) {
      const info = getInstallInfo();
      if (!options.quiet) {
        console.log(chalk.yellow('Oh-My-Droid is already installed.'));
        if (info) {
          console.log(chalk.gray(`  Version: ${info.version}`));
          console.log(chalk.gray(`  Installed: ${info.installedAt}`));
        }
        console.log(chalk.gray('\nUse --force to reinstall.'));
      }
      return;
    }

    // Run installation
    const result = installOmd({
      force: options.force,
      verbose: !options.quiet,
      skipFactoryCheck: options.skipFactoryCheck
    });

    if (result.success) {
      // Clean up legacy omd- prefixed commands from older versions
      const legacyCleanup = cleanupLegacyCommands({ verbose: !options.quiet });
      if (legacyCleanup.removed.length > 0 && !options.quiet) {
        console.log(chalk.blue(`\nCleaned up ${legacyCleanup.removed.length} legacy commands`));
      }

      // Also install slash commands
      if (!options.quiet) {
        console.log(chalk.blue('\nInstalling slash commands...'));
      }
      const cmdResult = installSlashCommands({ force: options.force, verbose: !options.quiet });

      if (!options.quiet) {
        console.log('');
        console.log(chalk.green('╔═══════════════════════════════════════════════════════════╗'));
        console.log(chalk.green('║              Installation Complete!                       ║'));
        console.log(chalk.green('╚═══════════════════════════════════════════════════════════╝'));
        console.log('');
        console.log(chalk.gray(`Installed to: ${FACTORY_CONFIG_DIR}`));
        console.log(chalk.gray(`Commands at:  ${FACTORY_COMMANDS_DIR}`));
        console.log('');
        console.log(chalk.yellow('Slash Commands:'));
        console.log('  /omd-autopilot <task>         # Full autonomous execution');
        console.log('  /omd-ultrawork <task>         # Maximum performance mode');
        console.log('  /omd-ralph <task>             # Persistence until complete');
        console.log('  /omd-deepsearch <query>       # Thorough codebase search');
        console.log('  /omd-analyze <target>         # Deep analysis mode');
        console.log('  /omd-plan <description>       # Start planning with Planner');
        console.log('  /omd-setup                    # Configure oh-my-droid');
        console.log('');
        console.log(chalk.yellow('Available Agents (via Task tool):'));
        console.log(chalk.gray('  Base Agents:'));
        console.log('    oh-my-droid:architect       - Architecture & debugging (Opus)');
        console.log('    oh-my-droid:researcher      - Documentation & research (Sonnet)');
        console.log('    oh-my-droid:explore         - Fast pattern matching (Haiku)');
        console.log('    oh-my-droid:designer        - UI/UX specialist (Sonnet)');
        console.log('    oh-my-droid:executor        - Focused execution (Sonnet)');
        console.log('    oh-my-droid:planner         - Strategic planning (Opus)');
        console.log(chalk.gray('  Tiered Variants:'));
        console.log('    oh-my-droid:executor-high   - Complex tasks (Opus)');
        console.log('    oh-my-droid:executor-low    - Trivial tasks (Haiku)');
        console.log('');
        console.log(chalk.blue('Quick Start:'));
        console.log('  1. Run Factory Droid in your project');
        console.log('  2. Type \'/omd-setup\' to configure');
        console.log('  3. Or use \'/omd-autopilot <task>\' for autonomous execution');
      }
    } else {
      console.error(chalk.red(`Installation failed: ${result.message}`));
      if (result.errors.length > 0) {
        result.errors.forEach(err => console.error(chalk.red(`  - ${err}`)));
      }
      process.exit(1);
    }
  });

/**
 * Postinstall command - Silent install for npm postinstall hook
 */
program
  .command('postinstall', { hidden: true })
  .description('Run post-install setup (called automatically by npm)')
  .action(async () => {
    // Silent install - only show errors
    const result = installOmd({
      force: false,
      verbose: false,
      skipFactoryCheck: true
    });

    if (result.success) {
      console.log(chalk.green('✓ Oh-My-Droid installed successfully!'));
      console.log(chalk.gray('  Run "oh-my-droid info" to see available agents.'));
      console.log(chalk.gray('  Run "oh-my-droid install-commands" to add slash commands.'));
    } else {
      // Don't fail the npm install, just warn
      console.warn(chalk.yellow('⚠ Could not complete setup:'), result.message);
      console.warn(chalk.gray('  Run "oh-my-droid install" manually to complete setup.'));
    }
  });

/**
 * Install Commands - Install oh-my-droid skills as Factory slash commands
 */
program
  .command('install-commands')
  .description('Install oh-my-droid skills as Factory Droid slash commands')
  .option('-f, --force', 'Overwrite existing commands')
  .option('-v, --verbose', 'Show detailed progress')
  .action(async (options) => {
    console.log(chalk.blue('\nInstalling oh-my-droid slash commands...\n'));
    console.log(chalk.gray(`Target: ${FACTORY_COMMANDS_DIR}\n`));

    const result = installSlashCommands({
      force: options.force,
      verbose: true
    });

    if (result.success) {
      console.log(chalk.green(`\n✓ Successfully installed ${result.installed.length} commands`));
      if (result.skipped.length > 0) {
        console.log(chalk.yellow(`  Skipped ${result.skipped.length} existing commands (use --force to overwrite)`));
      }
      console.log(chalk.gray(`\nCommands are available as /omd-<skill-name>`));
      console.log(chalk.gray('Example: /omd-autopilot, /omd-ultrawork, /omd-ralph, /omd-setup'));
    } else {
      console.log(chalk.red(`\n✗ Installation failed with ${result.errors.length} errors`));
      result.errors.forEach(err => console.log(chalk.red(`  - ${err}`)));
      process.exit(1);
    }
  });

/**
 * List Commands - List installed oh-my-droid slash commands
 */
program
  .command('list-commands')
  .description('List installed oh-my-droid slash commands')
  .action(async () => {
    const commands = listInstalledCommands();

    if (commands.length === 0) {
      console.log(chalk.yellow('No oh-my-droid commands installed.'));
      console.log(chalk.gray('Run `omd install-commands` to install them.'));
      return;
    }

    console.log(chalk.blue(`\nInstalled oh-my-droid commands (${commands.length}):\n`));
    commands.forEach(cmd => {
      console.log(`  /${cmd}`);
    });
    console.log(chalk.gray(`\nLocation: ${FACTORY_COMMANDS_DIR}`));
  });

/**
 * Uninstall Commands - Remove oh-my-droid slash commands
 */
program
  .command('uninstall-commands')
  .description('Remove oh-my-droid slash commands from Factory')
  .option('-v, --verbose', 'Show detailed progress')
  .action(async (options) => {
    console.log(chalk.blue('\nRemoving oh-my-droid slash commands...\n'));

    const result = uninstallSlashCommands({
      verbose: options.verbose
    });

    if (result.removed.length > 0) {
      console.log(chalk.green(`\n✓ Removed ${result.removed.length} commands`));
    } else {
      console.log(chalk.yellow('No commands to remove.'));
    }

    if (result.errors.length > 0) {
      console.log(chalk.red(`\n✗ ${result.errors.length} errors occurred`));
      result.errors.forEach(err => console.log(chalk.red(`  - ${err}`)));
    }
  });

/**
 * Cleanup Legacy Commands - Remove legacy omd/ subfolder
 */
program
  .command('cleanup-legacy')
  .description('Remove legacy omd/ subfolder from ~/.factory/commands/')
  .option('-v, --verbose', 'Show detailed progress')
  .action(async (options) => {
    console.log(chalk.blue('\nCleaning up legacy omd/ subfolder...\n'));

    const result = cleanupLegacyCommands({
      verbose: options.verbose
    });

    if (result.removed.length > 0) {
      console.log(chalk.green(`\n✓ Removed ${result.removed.length} legacy files`));
    } else {
      console.log(chalk.yellow('No legacy files to remove.'));
    }

    if (result.errors.length > 0) {
      console.log(chalk.red(`\n✗ ${result.errors.length} errors occurred`));
      result.errors.forEach(err => console.log(chalk.red(`  - ${err}`)));
    }
  });

/**
 * Uninstall - Remove all oh-my-droid components
 */
program
  .command('uninstall')
  .description('Remove all oh-my-droid components (commands, state, configuration)')
  .option('-v, --verbose', 'Show detailed progress')
  .action(async (options) => {
    console.log(chalk.blue('\nUninstalling oh-my-droid...\n'));

    const result = uninstallOmd({
      verbose: options.verbose
    });

    if (result.success) {
      console.log(chalk.green('\n✓ Successfully uninstalled oh-my-droid'));
      console.log(`  Commands removed: ${result.removedCommands.length}`);
      console.log(`  State directory removed: ${result.removedState ? 'Yes' : 'No'}`);
    } else {
      console.log(chalk.yellow('\n⚠ Uninstall completed with errors'));
      result.errors.forEach(err => console.log(chalk.red(`  - ${err}`)));
    }
  });

/**
 * Clean Install - Uninstall and reinstall fresh
 */
program
  .command('clean-install')
  .description('Clean install: remove everything and reinstall fresh')
  .option('-v, --verbose', 'Show detailed progress')
  .action(async (options) => {
    console.log(chalk.blue('\n🧹 Starting clean install of oh-my-droid...\n'));

    const result = cleanInstallOmd({
      verbose: options.verbose,
      force: true
    });

    // Summary
    console.log(chalk.blue('\n=== Clean Install Summary ===\n'));

    // Uninstall results
    if (result.uninstallResult.success) {
      console.log(chalk.green('✓ Uninstall: Success'));
      console.log(`  Removed ${result.uninstallResult.removedCommands.length} commands`);
    } else {
      console.log(chalk.yellow('⚠ Uninstall: Completed with errors'));
    }

    // Install results
    if (result.installResult.success) {
      console.log(chalk.green('✓ Install: Success'));
      console.log(`  Droids: ${result.installResult.installedDroids.length}`);
      console.log(`  Skills: ${result.installResult.installedSkills.length}`);
      console.log(`  Hooks: ${result.installResult.hooksConfigured ? 'Configured' : 'Skipped'}`);
    } else {
      console.log(chalk.red('✗ Install: Failed'));
      result.installResult.errors.forEach(err => console.log(chalk.red(`  - ${err}`)));
    }

    // Commands results
    if (result.commandsResult.errors.length === 0) {
      console.log(chalk.green('✓ Slash Commands: Success'));
      console.log(`  Installed: ${result.commandsResult.installed}`);
    } else {
      console.log(chalk.yellow('⚠ Slash Commands: Completed with errors'));
      result.commandsResult.errors.forEach(err => console.log(chalk.red(`  - ${err}`)));
    }

    console.log(chalk.blue('\n---'));
    console.log('Commands are available as /omd-<skill-name>');
    console.log('Example: /omd-setup, /omd-autopilot, /omd-ultrawork');
    console.log(chalk.gray('\nRestart Factory Droid to see the changes.'));
  });

// Parse arguments
program.parse();
