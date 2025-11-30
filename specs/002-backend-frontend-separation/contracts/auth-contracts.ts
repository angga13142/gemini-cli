/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Authentication Contracts for Backend-Frontend Communication
 *
 * This file defines the data structures for authentication operations.
 * Backend handles auth logic, frontend manages UI state.
 *
 * Location: packages/core/src/contracts/auth.ts (after implementation)
 */

import type { BackendError } from './error-contracts.js';

/**
 * Authentication operation result
 */
export interface AuthResult {
  /** Authentication status */
  status: 'authenticated' | 'failed' | 'pending';
  /** API key if authenticated (optional for security) */
  apiKey?: string;
  /** Authentication method used */
  method?: string;
  /** Error object if authentication failed */
  error?: BackendError;
}

/**
 * Authentication request
 */
export interface AuthRequest {
  /** Authentication method */
  method: 'api-key' | 'oauth' | 'service-account';
  /** API key (if method is api-key) */
  apiKey?: string;
  /** Additional auth parameters */
  params?: Record<string, unknown>;
}

/**
 * Authentication service interface
 */
export interface AuthService {
  /**
   * Authenticate with provided credentials
   * @param request Authentication request
   * @returns Authentication result
   */
  authenticate(request: AuthRequest): Promise<AuthResult>;

  /**
   * Refresh authentication
   * @returns Authentication result
   */
  refresh(): Promise<AuthResult>;

  /**
   * Clear authentication
   */
  clear(): Promise<void>;

  /**
   * Check if currently authenticated
   * @returns True if authenticated
   */
  isAuthenticated(): Promise<boolean>;
}
