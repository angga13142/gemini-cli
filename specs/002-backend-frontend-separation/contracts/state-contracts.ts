/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * State Contracts for Backend State Management
 *
 * This file defines the data structures for application state managed
 * by the backend. Frontend retrieves state via getter methods, never
 * manages business logic state locally.
 *
 * Location: packages/core/src/contracts/state.ts (after implementation)
 */

import type { Content } from '@google/genai';

/**
 * Chat state managed by backend
 */
export interface ChatState {
  /** Array of Content objects (alternating user/model messages) */
  history: Content[];
  /** Unique session identifier */
  sessionId: string;
  /** Session metadata */
  metadata: SessionMetadata;
}

/**
 * Session metadata
 */
export interface SessionMetadata {
  /** Project hash identifier */
  projectHash: string;
  /** Session start time */
  startTime: Date;
  /** Last update time */
  lastUpdated: Date;
  /** Total message count */
  messageCount: number;
}

/**
 * State service interface for retrieving state
 */
export interface StateService {
  /**
   * Get current chat history
   * @param curated Whether to return curated history (valid turns only)
   * @returns Chat state with history
   */
  getChatState(curated?: boolean): ChatState;

  /**
   * Clear chat history
   */
  clearHistory(): void;

  /**
   * Get session metadata
   * @returns Session metadata
   */
  getSessionMetadata(): SessionMetadata;
}
