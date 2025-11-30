# Data Model: Backend-Frontend Architecture Separation

**Created**: 2025-01-27  
**Feature**: Backend-Frontend Architecture Separation  
**Status**: Design Complete

## Overview

This document defines the data entities and structures used for communication
between backend and frontend layers. All entities follow the principle of
structured data exchange - backend returns objects, frontend formats for
display.

## Core Entities

### 1. ApiRequest

**Purpose**: Structured input for backend API functions

**Location**: `packages/core/src/contracts/api.ts`

**Definition**:

```typescript
interface ApiRequest {
  message: string | PartListUnion;
  config?: GenerateContentConfig;
  metadata?: Record<string, unknown>;
}
```

**Fields**:

- `message`: User input as string or structured PartListUnion (for @commands)
- `config`: Optional API configuration (model, temperature, etc.)
- `metadata`: Optional additional metadata (request ID, user context, etc.)

**Usage**: Passed to backend functions like `GeminiChat.sendMessageStream()`

**Validation**: TypeScript compile-time checking, optional runtime validation

---

### 2. ApiResponse

**Purpose**: Structured output from backend API functions

**Location**: `packages/core/src/contracts/api.ts`

**Definition**:

```typescript
interface ApiResponse {
  text: string;
  metadata: ResponseMetadata;
  stream?: AsyncGenerator<ResponseChunk>;
}

interface ResponseMetadata {
  tokens?: {
    input?: number;
    output?: number;
  };
  model?: string;
  timestamp: Date;
  finishReason?: string;
}

interface ResponseChunk {
  text: string;
  isComplete: boolean;
  metadata?: Partial<ResponseMetadata>;
}
```

**Fields**:

- `text`: Complete response text (for non-streaming) or accumulated text (for
  streaming)
- `metadata`: Response metadata (tokens, model, timestamp, etc.)
- `stream`: Optional async generator for streaming responses

**Usage**: Returned from backend functions, frontend formats for display

**Validation**: TypeScript compile-time checking

---

### 3. ChatState

**Purpose**: Application state managed by backend

**Location**: `packages/core/src/contracts/state.ts`

**Definition**:

```typescript
interface ChatState {
  history: Content[];
  sessionId: string;
  metadata: SessionMetadata;
}

interface SessionMetadata {
  projectHash: string;
  startTime: Date;
  lastUpdated: Date;
  messageCount: number;
}
```

**Fields**:

- `history`: Array of Content objects (alternating user/model messages)
- `sessionId`: Unique session identifier
- `metadata`: Session metadata (project, timestamps, counts)

**Usage**: Retrieved from backend via `GeminiChat.getHistory()`, frontend
displays

**State Management**: Backend classes (`GeminiChat`, `ChatRecordingService`)
manage state, frontend retrieves via getter methods

---

### 4. BackendError

**Purpose**: Structured error objects from backend

**Location**: `packages/core/src/contracts/errors.ts`

**Definition**:

```typescript
class BackendError extends Error {
  type: string;
  code?: string;
  metadata?: Record<string, unknown>;

  constructor(params: {
    type: string;
    message: string;
    code?: string;
    metadata?: Record<string, unknown>;
  }) {
    super(params.message);
    this.type = params.type;
    this.code = params.code;
    this.metadata = params.metadata;
  }
}
```

**Fields**:

- `type`: Error category (e.g., "API_ERROR", "AUTH_ERROR", "VALIDATION_ERROR")
- `message`: Human-readable error message
- `code`: Optional error code for programmatic handling
- `metadata`: Optional additional error context

**Usage**: Backend throws BackendError, frontend catches and formats for display

**Error Types**:

- `API_ERROR`: API call failures
- `AUTH_ERROR`: Authentication failures
- `VALIDATION_ERROR`: Input validation failures
- `NETWORK_ERROR`: Network connectivity issues
- `CONFIG_ERROR`: Configuration errors

---

### 5. AuthResult

**Purpose**: Authentication operation result

**Location**: `packages/core/src/contracts/auth.ts`

**Definition**:

```typescript
interface AuthResult {
  status: 'authenticated' | 'failed' | 'pending';
  apiKey?: string;
  method?: string;
  error?: BackendError;
}
```

**Fields**:

- `status`: Authentication status
- `apiKey`: API key if authenticated (optional for security)
- `method`: Authentication method used
- `error`: Error object if authentication failed

**Usage**: Returned from `AuthService.authenticate()`, frontend updates UI state

---

## State Transitions

### Chat State Lifecycle

```
Initial State
  → User Input (ApiRequest)
  → Backend Processing
  → Response Generated (ApiResponse)
  → State Updated (ChatState)
  → Frontend Displays
```

### Authentication State Lifecycle

```
Unauthenticated
  → Auth Request (AuthRequest)
  → Backend Processing
  → Auth Result (AuthResult)
  → State Updated
  → Frontend Updates UI
```

## Validation Rules

### ApiRequest Validation

- `message` must be non-empty string or valid PartListUnion
- `config` must be valid GenerateContentConfig if provided
- `metadata` is optional, no validation required

### ApiResponse Validation

- `text` must be string (can be empty for streaming)
- `metadata.timestamp` must be valid Date
- `stream` must be AsyncGenerator if provided

### ChatState Validation

- `history` must be array of Content objects
- `sessionId` must be non-empty string
- `metadata.startTime` must be valid Date

### BackendError Validation

- `type` must be one of defined error types
- `message` must be non-empty string
- `code` is optional but recommended for programmatic handling

## Relationships

### Entity Relationships

```
ApiRequest
  → processed by → Backend Functions
  → returns → ApiResponse

ChatState
  → managed by → GeminiChat, ChatRecordingService
  → retrieved by → Frontend Components

BackendError
  → thrown by → Backend Functions
  → caught by → Frontend Error Handlers

AuthResult
  → returned by → AuthService
  → consumed by → Frontend Auth Components
```

### Data Flow

```
Frontend Input
  → ApiRequest (structured)
  → Backend Processing
  → ApiResponse (structured)
  → Frontend Formatting
  → User Display

Backend State
  → ChatState (structured)
  → Frontend Retrieval
  → Frontend Display
```

## Notes

- All entities are TypeScript interfaces/classes for compile-time type safety
- No runtime schema validation required (TypeScript provides type checking)
- All entities defined in `packages/core/src/contracts/` for shared access
- Frontend imports contracts from `@google/gemini-cli-core` workspace package
- Backend functions return these entities, never formatted strings
- Frontend formats entities for display (markdown, colors, etc.)
