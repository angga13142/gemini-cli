# Data Contracts Documentation

**Location**: `packages/core/src/contracts/`  
**Purpose**: Define structured data types for backend-frontend communication

## Overview

All data contracts follow the principle of **structured data exchange** -
backend returns objects, frontend formats for display. This ensures backend
logic remains independent of UI frameworks and enables safe frontend
replacement.

## Contract Types

### API Contracts (`api.ts`)

**ApiRequest**: Request contract for API calls

```typescript
interface ApiRequest {
  message: string | PartListUnion;
  config?: GenerateContentConfig;
  metadata?: Record<string, unknown>;
}
```

**ApiResponse**: Response contract from API calls

```typescript
interface ApiResponse {
  text: string;
  metadata: ResponseMetadata;
  stream?: AsyncGenerator<ResponseChunk>;
}
```

**ResponseChunk**: Streaming response chunk

```typescript
interface ResponseChunk {
  text: string;
  isComplete: boolean;
  metadata?: Partial<ResponseMetadata>;
}
```

**Usage Example**:

```typescript
import { ApiService } from '@google/gemini-cli-core';

const apiService = config.getApiService();
const response = await apiService.sendMessage({
  message: 'Hello, world!',
  config: { model: 'gemini-2.0-flash' },
});

// response.text contains the complete response
// response.metadata contains tokens, model, timestamp, etc.
```

### Auth Contracts (`auth.ts`)

**AuthRequest**: Authentication request

```typescript
interface AuthRequest {
  method: 'api-key' | 'oauth' | 'service-account';
  apiKey?: string;
  params?: Record<string, unknown>;
}
```

**AuthResult**: Authentication operation result

```typescript
interface AuthResult {
  status: 'authenticated' | 'failed' | 'pending';
  apiKey?: string;
  method?: string;
  error?: BackendError;
}
```

**ApiKeyData**: Structured API key data

```typescript
interface ApiKeyData {
  apiKey: string | null;
  source: 'storage' | 'environment' | null;
  timestamp?: Date;
}
```

**Usage Example**:

```typescript
import { AuthService } from '@google/gemini-cli-core';

const authService = new AuthService(config);
const result = await authService.authenticate({
  method: 'api-key',
  apiKey: 'your-api-key',
});

if (result.status === 'authenticated') {
  // Success - use result.method to know which auth method was used
} else if (result.error) {
  // Handle error - result.error is a BackendError with structured info
  console.error(result.error.message);
  console.error(result.error.code); // Optional error code
}
```

### Error Contracts (`errors.ts`)

**BackendError**: Structured error object

```typescript
class BackendError extends Error {
  type: string; // ErrorType enum value
  code?: string; // ErrorCode enum value
  metadata?: Record<string, unknown>;
}
```

**ErrorType**: Error categories

- `API_ERROR` - API request failures
- `AUTH_ERROR` - Authentication failures
- `VALIDATION_ERROR` - Input validation failures
- `NETWORK_ERROR` - Network connectivity issues
- `CONFIG_ERROR` - Configuration errors
- `STATE_ERROR` - State management errors

**ErrorCode**: Specific error codes (e.g., `API_001`, `AUTH_001`, etc.)

**Usage Example**:

```typescript
import {
  createBackendError,
  ErrorType,
  ErrorCode,
} from '@google/gemini-cli-core';

// In backend code
throw createBackendError(
  ErrorType.AUTH_ERROR,
  'Invalid API key provided',
  ErrorCode.AUTH_INVALID_KEY,
  { originalError: error },
);

// In frontend code
try {
  await apiService.sendMessage({ message: 'test' });
} catch (error) {
  if (isBackendError(error)) {
    // error.type, error.code, error.metadata available
    displayError(formatBackendError(error));
  }
}
```

### State Contracts (`state.ts`)

**ChatState**: Chat state managed by backend

```typescript
interface ChatState {
  history: Content[];
  sessionId: string;
  metadata: SessionMetadata;
}
```

**StateService**: Interface for retrieving state

```typescript
interface StateService {
  getChatState(curated?: boolean): ChatState;
  clearHistory(): void;
  getSessionMetadata(): SessionMetadata;
}
```

## Best Practices

1. **Always use contracts**: Backend functions should return contract types, not
   formatted strings
2. **Frontend formats**: UI layer is responsible for formatting contract data
   for display
3. **Error handling**: Catch `BackendError` instances and format using
   `formatBackendError()`
4. **Type safety**: Use TypeScript types from contracts for compile-time
   checking
5. **Backward compatibility**: When adding new contract methods, keep old
   methods with `@deprecated` tags

## Migration Guide

### Before (Mixed Backend/Frontend)

```typescript
// Backend
function getApiKey(): string {
  return `Your API key is: ${key}`; // ❌ Formatted string
}

// Frontend
const message = getApiKey(); // Direct formatted string
```

### After (Structured Contracts)

```typescript
// Backend
function getApiKeyData(): ApiKeyData {
  return { apiKey: key, source: 'storage', timestamp: new Date() }; // ✅ Structured data
}

// Frontend
const data = getApiKeyData();
const message = `Your API key is: ${data.apiKey}`; // Frontend formats
```

## Related Files

- `packages/core/src/core/api/apiService.ts` - ApiService implementation
- `packages/core/src/core/auth/authService.ts` - AuthService implementation
- `packages/cli/src/adapters/apiAdapter.ts` - Frontend API adapter
- `packages/cli/src/adapters/authAdapter.ts` - Frontend auth adapter
- `packages/cli/src/ui/utils/errorFormatter.ts` - Error formatting utilities
