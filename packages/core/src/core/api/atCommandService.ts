/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @Command Service for Backend
 *
 * This service handles @command parsing and file path resolution logic.
 * It returns structured data that frontend can use for UI state management.
 *
 * Location: packages/core/src/core/api/atCommandService.ts
 */

import * as path from 'node:path';
import { unescapePath } from '../../utils/paths.js';
import type { Config } from '../../config/config.js';

/**
 * Part of an @command query
 */
export interface AtCommandPart {
  type: 'text' | 'atPath';
  content: string;
}

/**
 * Result of parsing @commands from a query
 */
export interface ParsedAtCommand {
  /** All parts of the query (text and @paths) */
  parts: AtCommandPart[];
  /** Only the @path parts */
  atPathParts: AtCommandPart[];
}

/**
 * Parse a query string to find all '@<path>' commands and text segments.
 * Handles \ escaped spaces within paths.
 *
 * Extracted from packages/cli/src/ui/hooks/atCommandProcessor.ts
 *
 * @param query The input query string
 * @returns Parsed result with parts and @path parts
 */
export function parseAllAtCommands(query: string): ParsedAtCommand {
  const parts: AtCommandPart[] = [];
  let currentIndex = 0;

  while (currentIndex < query.length) {
    let atIndex = -1;
    let nextSearchIndex = currentIndex;
    // Find next unescaped '@'
    while (nextSearchIndex < query.length) {
      if (
        query[nextSearchIndex] === '@' &&
        (nextSearchIndex === 0 || query[nextSearchIndex - 1] !== '\\')
      ) {
        atIndex = nextSearchIndex;
        break;
      }
      nextSearchIndex++;
    }

    if (atIndex === -1) {
      // No more @
      if (currentIndex < query.length) {
        parts.push({ type: 'text', content: query.substring(currentIndex) });
      }
      break;
    }

    // Add text before @
    if (atIndex > currentIndex) {
      parts.push({
        type: 'text',
        content: query.substring(currentIndex, atIndex),
      });
    }

    // Parse @path
    let pathEndIndex = atIndex + 1;
    let inEscape = false;
    while (pathEndIndex < query.length) {
      const char = query[pathEndIndex];
      if (inEscape) {
        inEscape = false;
      } else if (char === '\\') {
        inEscape = true;
      } else if (/[,\s;!?()[\]{}]/.test(char)) {
        // Path ends at first whitespace or punctuation not escaped
        break;
      } else if (char === '.') {
        // For . we need to be more careful - only terminate if followed by whitespace or end of string
        // This allows file extensions like .txt, .js but terminates at sentence endings like "file.txt. Next sentence"
        const nextChar =
          pathEndIndex + 1 < query.length ? query[pathEndIndex + 1] : '';
        if (nextChar === '' || /\s/.test(nextChar)) {
          break;
        }
      }
      pathEndIndex++;
    }
    const rawAtPath = query.substring(atIndex, pathEndIndex);
    // unescapePath expects the @ symbol to be present, and will handle it.
    const atPath = unescapePath(rawAtPath);
    parts.push({ type: 'atPath', content: atPath });
    currentIndex = pathEndIndex;
  }
  // Filter out empty text parts that might result from consecutive @paths or leading/trailing spaces
  const filteredParts = parts.filter(
    (part) => !(part.type === 'text' && part.content.trim() === ''),
  );

  return {
    parts: filteredParts,
    atPathParts: filteredParts.filter((part) => part.type === 'atPath'),
  };
}

/**
 * Resolved path information
 */
export interface ResolvedPath {
  /** Original @path (e.g., "@file.txt") */
  originalAtPath: string;
  /** Resolved path spec for reading */
  resolvedSpec: string;
  /** Display path (relative) */
  displayPath: string;
  /** Absolute path */
  absolutePath: string;
}

/**
 * Result of resolving @command paths
 */
export interface ResolvedAtCommandPaths {
  /** Successfully resolved paths */
  resolvedPaths: ResolvedPath[];
  /** Paths that were ignored (with reason) */
  ignoredPaths: Array<{ path: string; reason: 'git' | 'gemini' | 'both' }>;
  /** Paths that failed to resolve */
  failedPaths: string[];
}

/**
 * Resolve @command paths to file system paths
 * This is a simplified version - the full resolution logic with glob search
 * remains in the UI layer as it requires tool execution.
 *
 * @param atPathParts The @path parts to resolve
 * @param config Configuration object
 * @returns Resolved paths information
 */
export async function resolveAtCommandPaths(
  atPathParts: AtCommandPart[],
  config: Config,
): Promise<ResolvedAtCommandPaths> {
  const resolvedPaths: ResolvedPath[] = [];
  const ignoredPaths: Array<{
    path: string;
    reason: 'git' | 'gemini' | 'both';
  }> = [];
  const failedPaths: string[] = [];

  const fileDiscovery = config.getFileService();
  const respectFileIgnore = config.getFileFilteringOptions();
  const workspaceContext = config.getWorkspaceContext();

  for (const atPathPart of atPathParts) {
    const originalAtPath = atPathPart.content; // e.g., "@file.txt" or "@"

    if (originalAtPath === '@') {
      // Lone @ - skip
      continue;
    }

    const pathName = originalAtPath.substring(1);
    if (!pathName) {
      failedPaths.push(originalAtPath);
      continue;
    }

    // Check if path is within workspace
    if (!workspaceContext.isPathWithinWorkspace(pathName)) {
      failedPaths.push(pathName);
      continue;
    }

    // Check if path should be ignored
    const gitIgnored =
      respectFileIgnore.respectGitIgnore &&
      fileDiscovery.shouldIgnoreFile(pathName, {
        respectGitIgnore: true,
        respectGeminiIgnore: false,
      });
    const geminiIgnored =
      respectFileIgnore.respectGeminiIgnore &&
      fileDiscovery.shouldIgnoreFile(pathName, {
        respectGitIgnore: false,
        respectGeminiIgnore: true,
      });

    if (gitIgnored || geminiIgnored) {
      const reason =
        gitIgnored && geminiIgnored ? 'both' : gitIgnored ? 'git' : 'gemini';
      ignoredPaths.push({ path: pathName, reason });
      continue;
    }

    // Try to resolve path in workspace directories
    let resolved = false;
    for (const dir of workspaceContext.getDirectories()) {
      try {
        const absolutePath = path.isAbsolute(pathName)
          ? pathName
          : path.resolve(dir, pathName);
        const relativePath = path.isAbsolute(pathName)
          ? path.relative(dir, absolutePath)
          : pathName;

        // Note: Full resolution with directory detection and glob search
        // is handled in the UI layer as it requires tool execution.
        // This backend service provides the basic path resolution.

        resolvedPaths.push({
          originalAtPath,
          resolvedSpec: relativePath,
          displayPath: relativePath,
          absolutePath,
        });
        resolved = true;
        break;
      } catch {
        // Continue to next directory
      }
    }

    if (!resolved) {
      failedPaths.push(pathName);
    }
  }

  return { resolvedPaths, ignoredPaths, failedPaths };
}
