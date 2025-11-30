# UI Dependencies in Backend - Special Cases

**Created**: 2025-01-27  
**Purpose**: Document acceptable UI dependencies in backend code  
**Status**: Phase 3.3 - Side Effects Purge

## Overview

This document lists UI-related code in `packages/core/src/` that is acceptable
as special cases. These are exceptions to the general rule that backend code
should not have UI dependencies.

## Acceptable UI Dependencies

### 1. Error Reporting Utility (`utils/errorReporting.ts`)

**Location**: `packages/core/src/utils/errorReporting.ts`

**UI Dependency**: `console.error`

**Reason**: This is an error reporting utility that must be able to log errors
even when all other mechanisms fail. Using `console.error` as a last-resort
fallback is acceptable because:

- It's a utility function, not business logic
- It needs to work even when error reporting infrastructure fails
- It's the final fallback when structured error reporting cannot complete

**Status**: ACCEPTABLE - No changes needed

### 2. OAuth Authentication Flow (`code_assist/oauth2.ts`)

**Location**: `packages/core/src/code_assist/oauth2.ts`

**UI Dependencies**:

- `readline` (for OAuth code input)
- `writeToStdout`, `writeToStderr` (for OAuth flow messages)
- Terminal manipulation functions (`enterAlternateScreen`,
  `exitAlternateScreen`, etc.)

**Reason**: OAuth flows inherently require user interaction as part of the
authentication process. This is backend authentication logic that requires:

- Displaying OAuth URLs to users
- Prompting for authorization codes
- Terminal state management during OAuth flow

**Future Refactoring**: In a future phase, OAuth flows could be refactored to:

1. Backend generates auth URL and returns structured data
2. Frontend displays URL and prompts for code
3. Frontend passes code to backend
4. Backend completes OAuth flow

**Status**: ACCEPTABLE for now - Documented for future refactoring

### 3. SSE Stream Parsing (`code_assist/server.ts`)

**Location**: `packages/core/src/code_assist/server.ts`

**UI Dependency**: `readline` (for parsing Server-Sent Events streams)

**Reason**: `readline` is used here for parsing HTTP response streams, not for
user input. This is a legitimate backend operation for processing SSE streams.

**Status**: ACCEPTABLE - Not a UI dependency

### 4. Debug Logger (`utils/debugLogger.ts`)

**Location**: `packages/core/src/utils/debugLogger.ts`

**UI Dependency**: `console.log`, `console.warn`, `console.error`,
`console.debug`

**Reason**: This is a debug logging utility. Using `console.*` methods is
acceptable because:

- It's explicitly for developer debugging, not user-facing output
- It provides a centralized logging interface
- The ConsolePatcher intercepts these calls for UI routing

**Status**: ACCEPTABLE - Explicitly allowed in backend

## Summary

- **Total UI Dependencies Found**: 3 special cases
- **Acceptable**: All 3 (error reporting fallback, OAuth flow, debug logger)
- **Future Refactoring Needed**: OAuth flow (can be refactored to return
  structured data)

## Verification

All other UI dependencies have been removed:

- ✅ No `chalk` or `colors` imports
- ✅ No `spinner` or loading indicator imports
- ✅ No `ink` or `react` imports (except false positives from `@google/genai`)
- ✅ No UI-related packages in `package.json`
- ✅ All `console.log`/`console.error` replaced with `debugLogger` (except
  special cases above)
