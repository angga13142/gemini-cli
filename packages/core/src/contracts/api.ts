/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * API Contracts for Backend-Frontend Communication
 *
 * This file defines the data structures used for communication between
 * backend and frontend layers. All contracts follow the principle of
 * structured data exchange - backend returns objects, frontend formats
 * for display.
 *
 * Location: packages/core/src/contracts/api.ts
 */

import type { PartListUnion, GenerateContentConfig } from '@google/genai';

/**
 * Request contract for API calls
 */
export interface ApiRequest {
  /** User input as string or structured PartListUnion (for @commands) */
  message: string | PartListUnion;
  /** Optional API configuration (model, temperature, etc.) */
  config?: GenerateContentConfig;
  /** Optional additional metadata (request ID, user context, etc.) */
  metadata?: Record<string, unknown>;
}

/**
 * Response contract from API calls
 */
export interface ApiResponse {
  /** Complete response text (for non-streaming) or accumulated text (for streaming) */
  text: string;
  /** Response metadata (tokens, model, timestamp, etc.) */
  metadata: ResponseMetadata;
  /** Optional async generator for streaming responses */
  stream?: AsyncGenerator<ResponseChunk>;
}

/**
 * Response metadata
 */
export interface ResponseMetadata {
  /** Token usage statistics */
  tokens?: {
    input?: number;
    output?: number;
  };
  /** Model used for generation */
  model?: string;
  /** Response timestamp */
  timestamp: Date;
  /** Finish reason (stop, length, etc.) */
  finishReason?: string;
}

/**
 * Streaming response chunk
 */
export interface ResponseChunk {
  /** Chunk text content */
  text: string;
  /** Whether this is the final chunk */
  isComplete: boolean;
  /** Partial metadata for this chunk */
  metadata?: Partial<ResponseMetadata>;
}

/**
 * Backend API service interface
 */
export interface ApiService {
  /**
   * Send message and get streaming response
   * @param request API request with message and config
   * @returns Async generator of response chunks
   */
  sendMessageStream(request: ApiRequest): AsyncGenerator<ResponseChunk>;

  /**
   * Send message and get complete response
   * @param request API request with message and config
   * @returns Complete API response
   */
  sendMessage(request: ApiRequest): Promise<ApiResponse>;
}
