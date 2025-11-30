/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import type { LoadedSettings } from '../../config/settings.js';
import { AuthType, type Config } from '@google/gemini-cli-core';
import { AuthService } from '@google/gemini-cli-core';
import { AuthState } from '../types.js';

/**
 * Validate authentication method with settings
 * This is a wrapper around AuthService.validateAuthMethodWithSettings
 * for backward compatibility with existing code.
 */
export function validateAuthMethodWithSettings(
  authType: AuthType,
  settings: LoadedSettings,
  config: Config,
): string | null {
  const authService = new AuthService(config);
  return authService.validateAuthMethodWithSettings(authType, settings);
}

export const useAuthCommand = (settings: LoadedSettings, config: Config) => {
  const [authState, setAuthState] = useState<AuthState>(
    AuthState.Unauthenticated,
  );

  const [authError, setAuthError] = useState<string | null>(null);
  const [apiKeyDefaultValue, setApiKeyDefaultValue] = useState<
    string | undefined
  >(undefined);

  // Create auth service instance
  const authService = useCallback(() => new AuthService(config), [config]);

  const onAuthError = useCallback(
    (error: string | null) => {
      setAuthError(error);
      if (error) {
        setAuthState(AuthState.Updating);
      }
    },
    [setAuthError, setAuthState],
  );

  const reloadApiKey = useCallback(async () => {
    const key = await authService().loadApiKey();
    setApiKeyDefaultValue(key);
    return key; // Return the key for immediate use
  }, [authService]);

  useEffect(() => {
    if (authState === AuthState.AwaitingApiKeyInput) {
      reloadApiKey();
    }
  }, [authState, reloadApiKey]);

  useEffect(() => {
    (async () => {
      if (authState !== AuthState.Unauthenticated) {
        return;
      }

      const authType = settings.merged.security?.auth?.selectedType;
      if (!authType) {
        if (process.env['GEMINI_API_KEY']) {
          onAuthError(
            'Existing API key detected (GEMINI_API_KEY). Select "Gemini API Key" option to use it.',
          );
        } else {
          onAuthError('No authentication method selected.');
        }
        return;
      }

      if (authType === AuthType.USE_GEMINI) {
        const key = await reloadApiKey(); // Use the unified function
        if (!key) {
          setAuthState(AuthState.AwaitingApiKeyInput);
          return;
        }
      }

      // Use auth service to validate
      const service = authService();
      const error = service.validateAuthMethodWithSettings(authType, settings);
      if (error) {
        onAuthError(error);
        return;
      }

      // Map AuthType to AuthRequest method
      let method: 'api-key' | 'oauth' | 'service-account';
      switch (authType) {
        case AuthType.USE_GEMINI:
          method = 'api-key';
          break;
        case AuthType.LOGIN_WITH_GOOGLE:
          method = 'oauth';
          break;
        case AuthType.COMPUTE_ADC:
        case AuthType.USE_VERTEX_AI:
          method = 'service-account';
          break;
        default:
          method = 'api-key';
      }

      // Authenticate using auth service
      const apiKey =
        authType === AuthType.USE_GEMINI ? await reloadApiKey() : undefined;
      const authResult = await service.authenticate({
        method,
        apiKey,
      });

      if (authResult.status === 'authenticated') {
        setAuthError(null);
        setAuthState(AuthState.Authenticated);
      } else if (authResult.status === 'failed' && authResult.error) {
        onAuthError(authResult.error.message);
      } else {
        onAuthError('Authentication failed with unknown error');
      }
    })();
  }, [
    settings,
    config,
    authState,
    setAuthState,
    setAuthError,
    onAuthError,
    reloadApiKey,
    authService,
  ]);

  return {
    authState,
    setAuthState,
    authError,
    onAuthError,
    apiKeyDefaultValue,
    reloadApiKey,
  };
};
