/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Error Contracts for Backend Error Handling
 *
 * This file defines structured error objects returned from backend.
 * Backend throws structured errors, frontend catches and formats for display.
 *
 * Location: packages/core/src/contracts/errors.ts (after implementation)
 */

/**
 * Structured error object from backend
 */
export class BackendError extends Error {
  /** Error category */
  type: string;
  /** Optional error code for programmatic handling */
  code?: string;
  /** Optional additional error context */
  metadata?: Record<string, unknown>;

  constructor(params: {
    type: string;
    message: string;
    code?: string;
    metadata?: Record<string, unknown>;
  }) {
    super(params.message);
    this.name = 'BackendError';
    this.type = params.type;
    this.code = params.code;
    this.metadata = params.metadata;

    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BackendError);
    }
  }
}

/**
 * Error types
 */
export enum ErrorType {
  API_ERROR = 'API_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  CONFIG_ERROR = 'CONFIG_ERROR',
  STATE_ERROR = 'STATE_ERROR',
}

/**
 * Error code constants
 */
export enum ErrorCode {
  // API Errors
  API_RATE_LIMIT = 'API_001',
  API_INVALID_REQUEST = 'API_002',
  API_MODEL_UNAVAILABLE = 'API_003',

  // Auth Errors
  AUTH_MISSING_KEY = 'AUTH_001',
  AUTH_INVALID_KEY = 'AUTH_002',
  AUTH_EXPIRED = 'AUTH_003',

  // Validation Errors
  VALIDATION_INVALID_INPUT = 'VAL_001',
  VALIDATION_MISSING_REQUIRED = 'VAL_002',

  // Network Errors
  NETWORK_TIMEOUT = 'NET_001',
  NETWORK_CONNECTION_FAILED = 'NET_002',

  // Config Errors
  CONFIG_MISSING = 'CFG_001',
  CONFIG_INVALID = 'CFG_002',

  // State Errors
  STATE_SESSION_NOT_FOUND = 'STATE_001',
  STATE_HISTORY_CORRUPTED = 'STATE_002',
}

/**
 * Helper function to create BackendError
 */
export function createBackendError(
  type: ErrorType,
  message: string,
  code?: ErrorCode,
  metadata?: Record<string, unknown>,
): BackendError {
  return new BackendError({
    type,
    message,
    code,
    metadata,
  });
}
