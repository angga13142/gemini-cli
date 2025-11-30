/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { HybridTokenStorage } from '../../mcp/token-storage/hybrid-token-storage.js';
import type { OAuthCredentials } from '../../mcp/token-storage/types.js';
import { debugLogger } from '../../utils/debugLogger.js';
import type { ApiKeyData } from '../../contracts/auth.js';

const KEYCHAIN_SERVICE_NAME = 'gemini-cli-api-key';
const DEFAULT_API_KEY_ENTRY = 'default-api-key';

const storage = new HybridTokenStorage(KEYCHAIN_SERVICE_NAME);

/**
 * Load cached API key
 * @returns API key string or null if not found
 * @deprecated Use loadApiKeyData() for structured data
 */
export async function loadApiKey(): Promise<string | null> {
  const data = await loadApiKeyData();
  return data.apiKey;
}

/**
 * Load API key with structured data
 * @returns Structured API key data
 */
export async function loadApiKeyData(): Promise<ApiKeyData> {
  try {
    const credentials = await storage.getCredentials(DEFAULT_API_KEY_ENTRY);

    if (credentials?.token?.accessToken) {
      return {
        apiKey: credentials.token.accessToken,
        source: 'storage',
        timestamp: credentials.updatedAt
          ? new Date(credentials.updatedAt)
          : new Date(),
      };
    }

    // Check environment variable
    const envKey = process.env['GEMINI_API_KEY'];
    if (envKey) {
      return {
        apiKey: envKey,
        source: 'environment',
        timestamp: new Date(),
      };
    }

    return {
      apiKey: null,
      source: null,
      timestamp: new Date(),
    };
  } catch (error: unknown) {
    // Log other errors but don't crash, just return null so user can re-enter key
    debugLogger.error('Failed to load API key from storage:', error);
    return {
      apiKey: null,
      source: null,
      timestamp: new Date(),
    };
  }
}

/**
 * Save API key
 */
export async function saveApiKey(
  apiKey: string | null | undefined,
): Promise<void> {
  if (!apiKey || apiKey.trim() === '') {
    try {
      await storage.deleteCredentials(DEFAULT_API_KEY_ENTRY);
    } catch (error: unknown) {
      // Ignore errors when deleting, as it might not exist
      debugLogger.warn('Failed to delete API key from storage:', error);
    }
    return;
  }

  // Wrap API key in OAuthCredentials format as required by HybridTokenStorage
  const credentials: OAuthCredentials = {
    serverName: DEFAULT_API_KEY_ENTRY,
    token: {
      accessToken: apiKey,
      tokenType: 'ApiKey',
    },
    updatedAt: Date.now(),
  };

  await storage.setCredentials(credentials);
}

/**
 * Clear cached API key
 */
export async function clearApiKey(): Promise<void> {
  try {
    await storage.deleteCredentials(DEFAULT_API_KEY_ENTRY);
  } catch (error: unknown) {
    debugLogger.error('Failed to clear API key from storage:', error);
  }
}
