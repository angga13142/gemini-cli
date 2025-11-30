/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Authentication Service for Backend
 *
 * This service handles all authentication logic, returning structured data
 * that frontend can use for UI state management.
 *
 * Location: packages/core/src/core/auth/authService.ts
 */

import { AuthType } from '../contentGenerator.js';
import type { Config } from '../../config/config.js';
import { loadApiKey } from './apiKeyCredentialStorage.js';
import type {
  AuthResult,
  AuthRequest,
  AuthService as IAuthService,
  ApiKeyData,
} from '../../contracts/auth.js';
import {
  createBackendError,
  ErrorType,
  ErrorCode,
} from '../../contracts/errors.js';
import { debugLogger } from '../../utils/debugLogger.js';
import { getErrorMessage } from '../../utils/errors.js';

/**
 * Authentication service implementation
 */
export class AuthService implements IAuthService {
  constructor(private config: Config) {}

  /**
   * Validate authentication method
   */
  validateAuthMethod(authMethod: AuthType): string | null {
    if (
      authMethod === AuthType.LOGIN_WITH_GOOGLE ||
      authMethod === AuthType.COMPUTE_ADC
    ) {
      return null;
    }

    if (authMethod === AuthType.USE_GEMINI) {
      if (!process.env['GEMINI_API_KEY']) {
        return (
          'When using Gemini API, you must specify the GEMINI_API_KEY environment variable.\n' +
          'Update your environment and try again (no reload needed if using .env)!'
        );
      }
      return null;
    }

    if (authMethod === AuthType.USE_VERTEX_AI) {
      const hasVertexProjectLocationConfig =
        !!process.env['GOOGLE_CLOUD_PROJECT'] &&
        !!process.env['GOOGLE_CLOUD_LOCATION'];
      const hasGoogleApiKey = !!process.env['GOOGLE_API_KEY'];
      if (!hasVertexProjectLocationConfig && !hasGoogleApiKey) {
        return (
          'When using Vertex AI, you must specify either:\n' +
          '• GOOGLE_CLOUD_PROJECT and GOOGLE_CLOUD_LOCATION environment variables.\n' +
          '• GOOGLE_API_KEY environment variable (if using express mode).\n' +
          'Update your environment and try again (no reload needed if using .env)!'
        );
      }
      return null;
    }

    return 'Invalid auth method selected.';
  }

  /**
   * Validate authentication method with settings
   */
  validateAuthMethodWithSettings(
    authType: AuthType,
    settings: {
      merged?: {
        security?: {
          auth?: {
            enforcedType?: AuthType;
            useExternal?: boolean;
            selectedType?: AuthType;
          };
        };
      };
    },
  ): string | null {
    const enforcedType = settings.merged?.security?.auth?.enforcedType;
    if (enforcedType && enforcedType !== authType) {
      return `Authentication is enforced to be ${enforcedType}, but you are currently using ${authType}.`;
    }
    if (settings.merged?.security?.auth?.useExternal) {
      return null;
    }
    // If using Gemini API key, we don't validate it here as we might need to prompt for it.
    if (authType === AuthType.USE_GEMINI) {
      return null;
    }
    return this.validateAuthMethod(authType);
  }

  /**
   * Load API key from storage or environment
   * @returns API key string
   */
  async loadApiKey(): Promise<string> {
    const storedKey = (await loadApiKey()) ?? '';
    const envKey = process.env['GEMINI_API_KEY'] ?? '';
    return envKey || storedKey;
  }

  /**
   * Load API key with structured data
   * @returns Structured API key data
   */
  async loadApiKeyData(): Promise<ApiKeyData> {
    const { loadApiKeyData } = await import('./apiKeyCredentialStorage.js');
    return await loadApiKeyData();
  }

  /**
   * Authenticate with provided credentials
   */
  async authenticate(request: AuthRequest): Promise<AuthResult> {
    try {
      // Map AuthRequest method to AuthType
      let authType: AuthType;
      switch (request.method) {
        case 'api-key':
          authType = AuthType.USE_GEMINI;
          break;
        case 'oauth':
          authType = AuthType.LOGIN_WITH_GOOGLE;
          break;
        case 'service-account':
          authType = AuthType.COMPUTE_ADC;
          break;
        default:
          return {
            status: 'failed',
            error: createBackendError(
              ErrorType.AUTH_ERROR,
              `Invalid authentication method: ${request.method}`,
              ErrorCode.AUTH_INVALID_KEY,
            ),
          };
      }

      // Validate API key if provided
      if (request.method === 'api-key' && request.apiKey) {
        if (!request.apiKey.trim()) {
          return {
            status: 'failed',
            error: createBackendError(
              ErrorType.AUTH_ERROR,
              'API key cannot be empty',
              ErrorCode.AUTH_MISSING_KEY,
            ),
          };
        }
      }

      // Validate auth method
      const validationError = this.validateAuthMethod(authType);
      if (validationError) {
        return {
          status: 'failed',
          error: createBackendError(
            ErrorType.AUTH_ERROR,
            validationError,
            ErrorCode.AUTH_INVALID_KEY,
          ),
        };
      }

      // Validate GEMINI_DEFAULT_AUTH_TYPE if set
      const defaultAuthType = process.env['GEMINI_DEFAULT_AUTH_TYPE'];
      if (
        defaultAuthType &&
        !Object.values(AuthType).includes(defaultAuthType as AuthType)
      ) {
        return {
          status: 'failed',
          error: createBackendError(
            ErrorType.AUTH_ERROR,
            `Invalid value for GEMINI_DEFAULT_AUTH_TYPE: "${defaultAuthType}". ` +
              `Valid values are: ${Object.values(AuthType).join(', ')}.`,
            ErrorCode.AUTH_INVALID_KEY,
          ),
        };
      }

      // Perform authentication via config
      await this.config.refreshAuth(authType);

      debugLogger.log(`Authenticated via "${authType}".`);

      return {
        status: 'authenticated',
        method: request.method,
        apiKey: request.method === 'api-key' ? request.apiKey : undefined,
      };
    } catch (error) {
      return {
        status: 'failed',
        error: createBackendError(
          ErrorType.AUTH_ERROR,
          `Failed to login. Message: ${getErrorMessage(error)}`,
          ErrorCode.AUTH_INVALID_KEY,
          { originalError: error },
        ),
      };
    }
  }

  /**
   * Refresh authentication
   */
  async refresh(): Promise<AuthResult> {
    // Get current auth type from config
    const currentAuthType =
      this.config.getContentGeneratorConfig()?.authType || AuthType.USE_GEMINI;

    // Use refreshAuthWithResult for structured return type
    return await this.config.refreshAuthWithResult(currentAuthType);
  }

  /**
   * Clear authentication
   */
  async clear(): Promise<void> {
    // Clear API key from storage
    const { clearApiKey } = await import('./apiKeyCredentialStorage.js');
    await clearApiKey();
    // Note: Config state is managed by Config class, not cleared here
  }

  /**
   * Check if currently authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const contentGenerator = this.config.getContentGenerator();
      return contentGenerator !== null && contentGenerator !== undefined;
    } catch {
      return false;
    }
  }
}
