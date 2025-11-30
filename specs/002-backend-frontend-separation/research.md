# Research: Backend-Frontend Architecture Separation

**Created**: 2025-01-27  
**Feature**: Backend-Frontend Architecture Separation  
**Status**: Complete

## Research Objectives

This research phase resolves technical unknowns and establishes best practices
for refactoring the Gemini CLI codebase to achieve strict backend-frontend
separation.

## Research Findings

### 1. Refactoring Patterns for Monorepo Architecture

**Decision**: Maintain monorepo structure with strict package boundaries

**Rationale**:

- Current monorepo structure (`packages/core/`, `packages/cli/`) already
  provides natural separation boundaries
- Workspace dependencies (`@google/gemini-cli-core`) enable clean imports
- No need to restructure entire codebase - enforce boundaries within existing
  structure

**Alternatives Considered**:

- **Option A**: Complete restructure into `src/core/` and `src/ui/` (rejected -
  breaks existing package structure, requires massive import updates)
- **Option B**: Separate repositories (rejected - adds complexity, breaks
  workspace benefits)
- **Option C**: Current approach - enforce boundaries within monorepo (chosen -
  minimal disruption, clear separation)

**Best Practices Applied**:

- Package boundaries enforced via TypeScript path mapping
- Workspace dependencies for cross-package imports
- Clear directory structure within each package

---

### 2. Data Contract Design Patterns

**Decision**: Use TypeScript interfaces + structured objects for data contracts

**Rationale**:

- TypeScript provides compile-time type checking
- Structured objects enable frontend flexibility
- No runtime overhead (unlike JSON schema validation)
- Matches existing codebase patterns

**Alternatives Considered**:

- **Option A**: JSON Schema validation (rejected - runtime overhead, complexity)
- **Option B**: Protocol Buffers (rejected - overkill for CLI, adds
  dependencies)
- **Option C**: TypeScript interfaces only (chosen - simple, type-safe, no
  overhead)

**Contract Structure**:

```typescript
// Request contract
interface ApiRequest {
  message: string | PartListUnion;
  config?: GenerateContentConfig;
  metadata?: Record<string, unknown>;
}

// Response contract
interface ApiResponse {
  text: string;
  metadata: ResponseMetadata;
  stream?: AsyncGenerator<ResponseChunk>;
}

// Error contract
interface BackendError {
  type: string;
  message: string;
  code?: string;
  metadata?: Record<string, unknown>;
}
```

**Best Practices Applied**:

- All contracts defined in `packages/core/src/contracts/`
- Shared types exported from core package
- Frontend imports contracts from core package

---

### 3. State Management Centralization

**Decision**: Centralize state in backend classes, frontend retrieves via
interfaces

**Rationale**:

- Chat history already managed in `GeminiChat` class (backend)
- State persistence handled by `ChatRecordingService` (backend)
- Frontend should only hold transient UI state (input values, display prefs)
- Enables state sharing across frontend implementations

**Current State**:

- Chat history: `GeminiChat.getHistory()` (backend) ✅
- Session data: `ChatRecordingService` (backend) ✅
- Input history: `useInputHistoryStore` (frontend) - UI state, acceptable
- UI preferences: Frontend state - acceptable

**Migration Strategy**:

- No migration needed for chat history (already in backend)
- Verify all business logic state is in backend
- Frontend state hooks remain for UI-only state

**Best Practices Applied**:

- Backend classes manage persistent state
- Frontend retrieves state via getter methods
- State updates flow: Frontend → Backend → State update → Frontend receives
  update

---

### 4. Side Effect Removal Patterns

**Decision**: Replace UI side effects with structured data/errors, keep
debugLogger for development

**Rationale**:

- `console.log` for user output → Remove (frontend formats)
- `console.error` for errors → Replace with structured Error objects
- `debugLogger` for development → Keep (acceptable in backend for debugging)
- Terminal formatting (chalk, colors) → Remove (frontend handles)

**Patterns Identified**:

1. **Error Handling**:

   ```typescript
   // Before (mixed)
   console.error('API call failed:', error);

   // After (backend)
   throw new BackendError({
     type: 'API_ERROR',
     message: 'API call failed',
     code: 'API_001',
     metadata: { originalError: error },
   });
   ```

2. **Debug Logging**:

   ```typescript
   // Acceptable in backend
   debugLogger.debug('Processing request:', requestData);

   // Not acceptable (user-facing)
   console.log('Processing your request...'); // Remove
   ```

3. **Output Formatting**:

   ```typescript
   // Before (mixed)
   return chalk.green('Success!');

   // After (backend)
   return { status: 'success', message: 'Operation completed' };
   ```

**Best Practices Applied**:

- Backend functions return data or throw errors
- No formatted strings returned from backend
- Debug logging acceptable for development
- User-facing messages removed from backend

---

### 5. Testing Backend Independence

**Decision**: Create standalone test script that exercises backend without UI

**Rationale**:

- Proves backend can function independently
- Validates data contracts work correctly
- Enables testing backend logic without UI framework overhead
- Demonstrates frontend can be replaced

**Test Script Pattern**:

```typescript
// packages/core/test-backend-only.ts
import { GeminiChat } from './src/core/geminiChat.js';
import { createContentGeneratorConfig } from './src/core/contentGenerator.js';

async function testBackendIndependence() {
  // Initialize backend without UI
  const config = createContentGeneratorConfig(...);
  const chat = new GeminiChat(config);

  // Test API call
  const response = await chat.sendMessageStream("Test");

  // Verify structured response
  console.assert(response.text !== undefined, "Returns structured data");
  console.assert(typeof response.text === "string", "Text is string");

  // Verify no formatted output
  // (response should be object, not formatted string)
}

testBackendIndependence();
```

**Validation Criteria**:

- Script runs without UI dependencies
- Backend processes requests successfully
- All responses are structured objects
- No formatted strings returned
- Errors are structured Error objects

---

### 6. Mixed Code Extraction Strategy

**Decision**: Extract mixed logic incrementally, maintain backward compatibility

**Rationale**:

- Some components have both UI and logic (e.g., `useAuth.ts`,
  `handleSlashCommand`)
- Need to extract without breaking existing functionality
- Incremental approach reduces risk

**Extraction Pattern**:

1. **Identify Mixed Code**: Find functions with both UI and logic
2. **Extract Logic**: Move logic to backend function
3. **Update UI**: UI calls backend function, formats output
4. **Test**: Verify behavior unchanged
5. **Remove Old Code**: Delete mixed implementation after migration

**Example - useAuth.ts**:

```typescript
// Before (mixed)
export function useAuthCommand() {
  const [authState, setAuthState] = useState(...);

  const authenticate = async () => {
    // Backend logic mixed with UI state
    const apiKey = await loadApiKey();
    await Config.refreshAuth();
    setAuthState("authenticated");
  };
}

// After (separated)
// Backend: packages/core/src/core/auth/authService.ts
export class AuthService {
  async authenticate(): Promise<AuthResult> {
    const apiKey = await loadApiKey();
    await Config.refreshAuth();
    return { status: "authenticated", apiKey };
  }
}

// Frontend: packages/cli/src/ui/auth/useAuth.ts
export function useAuthCommand() {
  const [authState, setAuthState] = useState(...);
  const authService = new AuthService();

  const authenticate = async () => {
    const result = await authService.authenticate();
    setAuthState(result.status); // UI state only
  };
}
```

**Best Practices Applied**:

- Extract logic to backend classes/functions
- UI components become thin adapters
- Maintain existing function signatures during transition
- Remove mixed code after migration complete

---

## Technical Decisions Summary

| Decision Area          | Decision                                       | Rationale                                |
| ---------------------- | ---------------------------------------------- | ---------------------------------------- |
| **Monorepo Structure** | Maintain current structure, enforce boundaries | Minimal disruption, clear separation     |
| **Data Contracts**     | TypeScript interfaces + structured objects     | Type-safe, no runtime overhead           |
| **State Management**   | Centralize in backend, frontend retrieves      | Already mostly correct, verify remaining |
| **Side Effects**       | Remove UI code, keep debugLogger               | Clean separation, dev tools acceptable   |
| **Testing**            | Standalone test script                         | Proves independence                      |
| **Extraction**         | Incremental, backward compatible               | Reduces risk                             |

## Unresolved Questions

**None** - All technical questions resolved through analysis and best practices.

## Next Steps

Proceed to Phase 1: Design & Contracts

- Define data model entities
- Create contract schemas
- Document quickstart scenarios
