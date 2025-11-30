/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Frontend Adapter for ApiService
 *
 * This adapter provides a clean interface for UI components to interact with
 * the backend ApiService. It handles conversion between UI types and backend
 * contract types, and provides error handling and formatting.
 *
 * Location: packages/cli/src/adapters/apiAdapter.ts
 */

import type {
  ApiService,
  ApiRequest,
  ApiResponse,
  ResponseChunk,
  ApiServiceImpl,
  ServerGeminiStreamEvent,
} from '@google/gemini-cli-core';
import type {
  PartListUnion,
  Content,
  GenerateContentResponse,
} from '@google/genai';

// ModelConfigKey interface - matches the definition in modelConfigService
interface ModelConfigKey {
  model: string;
  overrideScope?: string;
}

/**
 * Frontend adapter for API service
 */
export class ApiAdapter {
  constructor(private apiService: ApiService) {}

  /**
   * Send message and get streaming response
   * @param message User message (string or PartListUnion)
   * @param config Optional API configuration
   * @param metadata Optional request metadata (promptId, abortSignal, etc.)
   * @returns Async generator of response chunks
   */
  async *sendMessageStream(
    message: string | PartListUnion,
    config?: ApiRequest['config'],
    metadata?: ApiRequest['metadata'],
  ): AsyncGenerator<ResponseChunk> {
    const request: ApiRequest = {
      message,
      config,
      metadata,
    };

    // Re-throw backend errors - UI layer will handle formatting
    yield* this.apiService.sendMessageStream(request);
  }

  /**
   * Send message and get complete response
   * @param message User message (string or PartListUnion)
   * @param config Optional API configuration
   * @param metadata Optional request metadata
   * @returns Complete API response
   */
  async sendMessage(
    message: string | PartListUnion,
    config?: ApiRequest['config'],
    metadata?: ApiRequest['metadata'],
  ): Promise<ApiResponse> {
    const request: ApiRequest = {
      message,
      config,
      metadata,
    };

    // Re-throw backend errors - UI layer will handle formatting
    return await this.apiService.sendMessage(request);
  }

  /**
   * Send message stream with full event support - for complex UI interactions
   *
   * This method exposes the full ServerGeminiStreamEvent stream for UI components
   * that need to handle tool calls, confirmations, etc.
   */
  async *sendMessageStreamWithEvents(
    request: PartListUnion,
    signal: AbortSignal,
    promptId: string,
  ): AsyncGenerator<ServerGeminiStreamEvent> {
    // Cast to ApiServiceImpl to access extension method
    const apiServiceImpl = this.apiService as unknown as ApiServiceImpl;
    if (
      apiServiceImpl &&
      typeof apiServiceImpl.sendMessageStreamWithEvents === 'function'
    ) {
      yield* apiServiceImpl.sendMessageStreamWithEvents(
        request,
        signal,
        promptId,
      );
    } else {
      throw new Error(
        'sendMessageStreamWithEvents is not available on ApiService instance',
      );
    }
  }

  /**
   * Generate content (non-streaming) - for simple API calls like prompt completion
   */
  async generateContent(
    modelConfigKey: ModelConfigKey,
    contents: Content[],
    abortSignal: AbortSignal,
  ): Promise<GenerateContentResponse> {
    // Cast to ApiServiceImpl to access extension method
    const apiServiceImpl = this.apiService as unknown as ApiServiceImpl;
    if (
      apiServiceImpl &&
      typeof apiServiceImpl.generateContent === 'function'
    ) {
      return await apiServiceImpl.generateContent(
        modelConfigKey,
        contents,
        abortSignal,
      );
    } else {
      throw new Error(
        'generateContent is not available on ApiService instance',
      );
    }
  }
}

/**
 * Create an ApiAdapter instance
 */
export function createApiAdapter(apiService: ApiService): ApiAdapter {
  return new ApiAdapter(apiService);
}
