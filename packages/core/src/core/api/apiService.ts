/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * API Service for Backend-Frontend Communication
 *
 * This service wraps GeminiClient and provides a clean interface following
 * the ApiService contract. It converts between GeminiClient's internal
 * types and the contract types.
 *
 * Location: packages/core/src/core/api/apiService.ts
 */

import type {
  PartListUnion,
  GenerateContentResponse,
  Content,
} from '@google/genai';
import type {
  ApiRequest,
  ApiResponse,
  ResponseChunk,
  ResponseMetadata,
  ApiService as IApiService,
} from '../../contracts/api.js';
import type { GeminiClient } from '../client.js';
import type { ServerGeminiStreamEvent } from '../turn.js';
import { GeminiEventType } from '../turn.js';
// getResponseText not needed - Finished events don't contain text
import {
  createBackendError,
  ErrorType,
  ErrorCode,
} from '../../contracts/errors.js';
import type { ModelConfigKey } from '../../services/modelConfigService.js';

/**
 * API Service implementation
 *
 * Wraps GeminiClient to provide a clean API following the ApiService contract.
 */
export class ApiServiceImpl implements IApiService {
  constructor(private readonly geminiClient: GeminiClient) {}

  /**
   * Send message and get streaming response
   */
  async *sendMessageStream(request: ApiRequest): AsyncGenerator<ResponseChunk> {
    // Convert ApiRequest to GeminiClient's expected format
    const message = request.message;
    const promptId =
      (request.metadata?.['promptId'] as string) || this.generatePromptId();
    const abortSignal =
      (request.metadata?.['abortSignal'] as AbortSignal) ||
      new AbortController().signal;

    try {
      // Call GeminiClient's sendMessageStream
      const stream = this.geminiClient.sendMessageStream(
        message as PartListUnion,
        abortSignal,
        promptId,
      );

      // Convert ServerGeminiStreamEvent to ResponseChunk
      for await (const event of stream) {
        const chunk = this.convertEventToChunk(event);
        if (chunk) {
          yield chunk;
        }
      }
    } catch (error) {
      // Convert errors to BackendError format
      throw createBackendError(
        ErrorType.API_ERROR,
        error instanceof Error ? error.message : String(error),
        ErrorCode.API_INVALID_REQUEST,
        { originalError: error },
      );
    }
  }

  /**
   * Send message and get complete response
   *
   * For simple API calls that don't need streaming or tool calls.
   */
  async sendMessage(request: ApiRequest): Promise<ApiResponse> {
    const chunks: ResponseChunk[] = [];
    let completeText = '';
    let metadata: ResponseMetadata = {
      timestamp: new Date(),
    };

    try {
      // Collect all chunks from stream
      for await (const chunk of this.sendMessageStream(request)) {
        chunks.push(chunk);
        completeText += chunk.text;

        // Update metadata from chunk if available
        if (chunk.metadata) {
          metadata = { ...metadata, ...chunk.metadata };
        }

        // If this is the final chunk, we're done
        if (chunk.isComplete) {
          break;
        }
      }

      return {
        text: completeText,
        metadata,
      };
    } catch (error) {
      throw createBackendError(
        ErrorType.API_ERROR,
        error instanceof Error ? error.message : String(error),
        ErrorCode.API_INVALID_REQUEST,
        { originalError: error },
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
    return this.geminiClient.generateContent(
      modelConfigKey,
      contents,
      abortSignal,
    );
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
    yield* this.geminiClient.sendMessageStream(request, signal, promptId);
  }

  /**
   * Convert ServerGeminiStreamEvent to ResponseChunk
   *
   * Note: Only content and finished events are converted to chunks.
   * Tool calls and other events are handled separately by the UI.
   */
  private convertEventToChunk(
    event: ServerGeminiStreamEvent,
  ): ResponseChunk | null {
    switch (event.type) {
      case GeminiEventType.Content: {
        // event.value is a string for Content events
        const text = typeof event.value === 'string' ? event.value : '';
        return {
          text,
          isComplete: false,
          metadata: {
            timestamp: new Date(),
          },
        };
      }

      case GeminiEventType.Finished: {
        // Finished event contains usage metadata and finish reason
        // Text content is already yielded in Content events before Finished
        const finishedValue = event.value;
        return {
          text: '', // Text is already in previous Content chunks
          isComplete: true,
          metadata: {
            timestamp: new Date(),
            finishReason: finishedValue?.reason,
            tokens:
              finishedValue?.usageMetadata !== undefined
                ? {
                    input: finishedValue.usageMetadata.promptTokenCount,
                    output: finishedValue.usageMetadata.candidatesTokenCount,
                  }
                : undefined,
          },
        };
      }

      case GeminiEventType.Error: {
        // Errors should be thrown, not returned as chunks
        const errorValue = event.value;
        throw createBackendError(
          ErrorType.API_ERROR,
          errorValue?.error?.message || 'API request failed',
          ErrorCode.API_INVALID_REQUEST,
          { status: errorValue?.error?.status },
        );
      }

      case GeminiEventType.ModelInfo: {
        // Model info is metadata only
        return {
          text: '',
          isComplete: false,
          metadata: {
            timestamp: new Date(),
            model: event.value,
          },
        };
      }

      // Tool calls, confirmations, and other events don't map to response chunks
      // These are handled separately by the UI layer
      default:
        return null;
    }
  }

  /**
   * Generate a prompt ID
   */
  private generatePromptId(): string {
    return `prompt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
}

/**
 * Create an ApiService instance
 */
export function createApiService(geminiClient: GeminiClient): IApiService {
  return new ApiServiceImpl(geminiClient);
}
