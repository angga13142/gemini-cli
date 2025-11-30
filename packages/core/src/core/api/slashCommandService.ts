/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Slash Command Service for Backend
 *
 * This service handles slash command parsing and execution logic.
 * It returns structured data that frontend can use for UI state management.
 *
 * Location: packages/core/src/core/api/slashCommandService.ts
 */

import type { Config } from '../../config/config.js';
import {
  logSlashCommand,
  makeSlashCommandEvent,
  SlashCommandStatus,
} from '../../telemetry/index.js';

/**
 * Minimal command interface for parsing (avoids dependency on CLI types)
 */
export interface CommandForParsing {
  name: string;
  altNames?: string[];
  subCommands?: CommandForParsing[];
}

/**
 * Result of parsing a slash command
 */
export interface ParsedSlashCommand<
  T extends CommandForParsing = CommandForParsing,
> {
  /** The resolved command (undefined if not found) */
  commandToExecute: T | undefined;
  /** The command arguments */
  args: string;
  /** The canonical command path */
  canonicalPath: string[];
  /** The subcommand (if any) */
  subcommand?: string;
}

/**
 * Parse a slash command string
 * Extracted from packages/cli/src/utils/commands.ts to backend core.
 *
 * @param query The raw input string (e.g., "/memory add some data")
 * @param commands The list of available commands
 * @returns Parse result with command details
 */
export function parseSlashCommand<T extends CommandForParsing>(
  query: string,
  commands: readonly T[],
): ParsedSlashCommand<T> {
  const trimmed = query.trim();

  const parts = trimmed.substring(1).trim().split(/\s+/);
  const commandPath = parts.filter((p) => p);

  let currentCommands: readonly T[] = commands;
  let commandToExecute: T | undefined;
  let pathIndex = 0;
  const canonicalPath: string[] = [];

  for (const part of commandPath) {
    // First pass: check for exact match on primary command name
    let foundCommand = currentCommands.find((cmd) => cmd.name === part);

    // Second pass: if no primary name matches, check for an alias
    if (!foundCommand) {
      foundCommand = currentCommands.find((cmd) =>
        cmd.altNames?.includes(part),
      );
    }

    if (foundCommand) {
      commandToExecute = foundCommand;
      canonicalPath.push(foundCommand.name);
      pathIndex++;
      if (foundCommand.subCommands) {
        currentCommands = foundCommand.subCommands as unknown as readonly T[];
      } else {
        break;
      }
    } else {
      break;
    }
  }

  const args = parts.slice(pathIndex).join(' ');
  const subcommand =
    canonicalPath.length > 1 ? canonicalPath.slice(1).join(' ') : undefined;

  return {
    commandToExecute,
    args,
    canonicalPath,
    subcommand,
  };
}

/**
 * Execution result for slash commands
 */
export interface SlashCommandExecutionResult {
  /** Execution status */
  status: 'success' | 'error' | 'not_found';
  /** Command name */
  commandName: string;
  /** Subcommand (if any) */
  subcommand?: string;
  /** Error message (if status is 'error') */
  error?: string;
}

/**
 * Log slash command execution
 * @param config Configuration object
 * @param result Execution result
 * @param extensionId Optional extension ID
 */
export function logSlashCommandExecution(
  config: Config,
  result: SlashCommandExecutionResult,
  extensionId?: string,
): void {
  const event = makeSlashCommandEvent({
    command: result.commandName,
    subcommand: result.subcommand,
    status:
      result.status === 'success'
        ? SlashCommandStatus.SUCCESS
        : SlashCommandStatus.ERROR,
    extension_id: extensionId,
  });
  logSlashCommand(config, event);
}
