/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Contracts for Backend-Frontend Communication
 *
 * This module exports all data contracts used for communication between
 * backend and frontend layers. All contracts follow the principle of
 * structured data exchange - backend returns objects, frontend formats
 * for display.
 */

// API Contracts
export type {
  ApiRequest,
  ApiResponse,
  ResponseMetadata,
  ResponseChunk,
  ApiService,
} from './api.js';

// Error Contracts
export {
  BackendError,
  ErrorType,
  ErrorCode,
  createBackendError,
} from './errors.js';

// State Contracts
export type { ChatState, SessionMetadata, StateService } from './state.js';

// Auth Contracts
export type { AuthResult, AuthRequest } from './auth.js';
export type { AuthService as IAuthService } from './auth.js';
