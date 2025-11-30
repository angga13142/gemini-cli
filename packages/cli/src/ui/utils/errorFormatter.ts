/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Error Formatter for Frontend
 *
 * This utility provides functions to format backend errors for display in the UI.
 * It handles BackendError instances and converts them to user-friendly messages.
 *
 * Location: packages/cli/src/ui/utils/errorFormatter.ts
 */

import type { BackendError } from '@google/gemini-cli-core';
import { getErrorMessage } from '@google/gemini-cli-core';

/**
 * Check if an error is a BackendError
 */
export function isBackendError(error: unknown): error is BackendError {
  if (!error || typeof error !== 'object') {
    return false;
  }
  const err = error as Error & {
    type?: unknown;
    code?: unknown;
    metadata?: unknown;
  };
  return 'type' in err && 'message' in err && err.name === 'BackendError';
}

/**
 * Format a BackendError for display in the UI
 * @param error The error to format (can be BackendError or any Error)
 * @returns User-friendly error message string
 */
export function formatBackendError(error: unknown): string {
  if (isBackendError(error)) {
    // BackendError has structured information
    let message = error.message;

    // Add error code if available for debugging
    if (error.code && process.env['NODE_ENV'] === 'development') {
      message = `[${error.code}] ${message}`;
    }

    // Add metadata context if available
    if (error.metadata && Object.keys(error.metadata).length > 0) {
      const metadataStr = JSON.stringify(error.metadata, null, 2);
      if (process.env['NODE_ENV'] === 'development') {
        message = `${message}\n\nMetadata: ${metadataStr}`;
      }
    }

    return message;
  }

  // Fallback to generic error formatting
  return getErrorMessage(error) || 'An unknown error occurred';
}

/**
 * Format any error (BackendError or regular Error) for display
 * This is a convenience function that handles both types
 */
export function formatErrorForDisplay(error: unknown): string {
  if (isBackendError(error)) {
    return formatBackendError(error);
  }

  // For non-BackendError, use existing error formatting
  return getErrorMessage(error) || 'An unknown error occurred';
}
