/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Frontend Adapter for AuthService
 *
 * This adapter provides a clean interface for UI components to interact with
 * the backend AuthService. It handles conversion between UI types and backend
 * contract types, and provides error handling and formatting.
 *
 * Location: packages/cli/src/adapters/authAdapter.ts
 */

import type {
  AuthService,
  AuthRequest,
  AuthResult,
  BackendError,
} from '@google/gemini-cli-core';

/**
 * Frontend adapter for authentication service
 */
export class AuthAdapter {
  constructor(private authService: AuthService) {}

  /**
   * Authenticate with provided credentials
   * @param method Authentication method
   * @param apiKey Optional API key (if method is api-key)
   * @param params Optional additional auth parameters
   * @returns Authentication result
   */
  async authenticate(
    method: AuthRequest['method'],
    apiKey?: string,
    params?: AuthRequest['params'],
  ): Promise<AuthResult> {
    const request: AuthRequest = {
      method,
      apiKey,
      params,
    };

    try {
      return await this.authService.authenticate(request);
    } catch (error) {
      // Convert unexpected errors to AuthResult
      return {
        status: 'failed',
        error:
          error instanceof Error && 'type' in error
            ? (error as BackendError)
            : {
                type: 'AUTH_ERROR',
                message: error instanceof Error ? error.message : String(error),
                name: 'BackendError',
              },
      };
    }
  }

  /**
   * Refresh authentication
   * @returns Authentication result
   */
  async refresh(): Promise<AuthResult> {
    try {
      return await this.authService.refresh();
    } catch (error) {
      // Convert unexpected errors to AuthResult
      return {
        status: 'failed',
        error:
          error instanceof Error && 'type' in error
            ? (error as BackendError)
            : {
                type: 'AUTH_ERROR',
                message: error instanceof Error ? error.message : String(error),
                name: 'BackendError',
              },
      };
    }
  }

  /**
   * Clear authentication
   */
  async clear(): Promise<void> {
    try {
      await this.authService.clear();
    } catch (_error) {
      // Log error but don't throw - clearing is best-effort
      // Error is intentionally ignored for best-effort clearing
    }
  }

  /**
   * Check if currently authenticated
   * @returns True if authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      return await this.authService.isAuthenticated();
    } catch (_error) {
      // On error, assume not authenticated
      return false;
    }
  }
}

/**
 * Create an AuthAdapter instance
 */
export function createAuthAdapter(authService: AuthService): AuthAdapter {
  return new AuthAdapter(authService);
}
