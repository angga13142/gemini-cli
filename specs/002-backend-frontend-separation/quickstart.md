# Quickstart: Backend-Frontend Architecture Separation

**Created**: 2025-01-27  
**Feature**: Backend-Frontend Architecture Separation  
**Purpose**: Validation scenarios for refactoring

## Overview

This document provides quick validation scenarios to verify that the
backend-frontend separation refactoring is successful. Each scenario tests a
specific aspect of the separation.

## Validation Scenarios

### Scenario 1: Backend Returns Structured Data

**Objective**: Verify backend functions return structured objects, not formatted
strings

**Steps**:

1. Call backend function: `GeminiChat.sendMessageStream("Test message")`
2. Receive response
3. Verify response is object with `text` property (not formatted string)
4. Verify response has `metadata` property

**Expected Result**:

```typescript
{
  text: "Response text here",
  metadata: {
    timestamp: Date,
    model: "gemini-pro",
    tokens: { input: 10, output: 20 }
  }
}
```

**Validation**: ✅ Response is structured object, not formatted string

---

### Scenario 2: Frontend Formats Backend Data

**Objective**: Verify frontend receives structured data and formats for display

**Steps**:

1. Frontend calls backend:
   `const response = await chatService.sendMessage(request)`
2. Frontend receives structured `ApiResponse`
3. Frontend formats: `MarkdownDisplay.format(response.text)`
4. Display formatted output to user

**Expected Result**: User sees formatted markdown output (colors, syntax
highlighting)

**Validation**: ✅ Frontend formats backend data, backend doesn't format

---

### Scenario 3: Backend Error Handling

**Objective**: Verify backend throws structured errors, frontend formats

**Steps**:

1. Trigger error condition (e.g., invalid API key)
2. Backend throws `BackendError` with structured properties
3. Frontend catches error
4. Frontend formats error message for display

**Expected Result**:

```typescript
// Backend throws
throw new BackendError({
  type: "AUTH_ERROR",
  message: "Invalid API key",
  code: "AUTH_002"
});

// Frontend catches and formats
catch (error) {
  if (error instanceof BackendError) {
    displayError(chalk.red(`Error: ${error.message}`));
  }
}
```

**Validation**: ✅ Backend throws structured errors, frontend formats

---

### Scenario 4: State Management

**Objective**: Verify state is managed in backend, frontend retrieves

**Steps**:

1. Send message via backend
2. Backend updates chat history (state)
3. Frontend retrieves state: `const state = chatService.getChatState()`
4. Frontend displays history from state

**Expected Result**: Chat history managed in backend, frontend displays from
retrieved state

**Validation**: ✅ State managed in backend, frontend retrieves

---

### Scenario 5: Backend Independence Test

**Objective**: Verify backend can function without UI

**Steps**:

1. Run test script: `node packages/core/test-backend-only.ts`
2. Script imports backend functions (no UI imports)
3. Script calls backend: `chat.sendMessageStream("Test")`
4. Script receives structured response
5. Script verifies response structure

**Expected Result**: Test script runs successfully, backend processes request,
returns structured data

**Validation**: ✅ Backend independent of UI

---

### Scenario 6: No UI Dependencies in Backend

**Objective**: Verify backend has zero UI-related imports

**Steps**:

1. Search `packages/core/src/` for UI imports:
   - `import ... from 'chalk'`
   - `import ... from 'ink'`
   - `import ... from 'react'`
2. Verify no UI imports found
3. Verify `console.log` only used in `debugLogger` (dev tool)

**Expected Result**: Zero UI imports in backend, only debugLogger uses console

**Validation**: ✅ Backend has no UI dependencies

---

### Scenario 7: Data Contract Validation

**Objective**: Verify all data exchange uses defined contracts

**Steps**:

1. Review all backend functions that return data
2. Verify return types match contract definitions:
   - `ApiResponse` for API calls
   - `ChatState` for state retrieval
   - `BackendError` for errors
   - `AuthResult` for auth operations
3. Verify frontend uses contracts for type checking

**Expected Result**: All data exchange uses defined contracts, TypeScript
compiles without errors

**Validation**: ✅ Data contracts enforced via TypeScript

---

## Success Criteria

All scenarios must pass for refactoring to be considered complete:

- ✅ **Scenario 1**: Backend returns structured data
- ✅ **Scenario 2**: Frontend formats backend data
- ✅ **Scenario 3**: Backend error handling structured
- ✅ **Scenario 4**: State management centralized
- ✅ **Scenario 5**: Backend independence verified
- ✅ **Scenario 6**: No UI dependencies in backend
- ✅ **Scenario 7**: Data contracts validated

## Testing Commands

### Run Backend Independence Test

```bash
cd packages/core
node test-backend-only.ts
```

### Verify No UI Imports

```bash
cd packages/core
grep -r "from ['\"]chalk['\"]" src/
grep -r "from ['\"]ink['\"]" src/
grep -r "from ['\"]react['\"]" src/
# Should return no results
```

### Run Full Test Suite

```bash
npm run test
npm run test:integration
```

### Type Check Contracts

```bash
npm run typecheck
# Should compile without errors if contracts are correct
```

## Notes

- All scenarios test the separation principles defined in the specification
- Scenarios can be run incrementally during refactoring to verify progress
- Final validation requires all scenarios to pass
- Test script (Scenario 5) is created in Phase 4 of the refactoring plan
