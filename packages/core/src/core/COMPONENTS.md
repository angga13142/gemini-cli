# Backend Components Documentation

**Created**: 2025-01-27  
**Purpose**: Document current backend component locations in
`packages/core/src/core/`  
**Status**: Phase 1 - Initial Documentation

## Overview

This document catalogs all backend components currently located in
`packages/core/src/core/`. These components represent the "Otak" (brain) of the
application - pure business logic that must be preserved during frontend
refactoring.

## Core Components

### Authentication & Credentials

| File                         | Component/Class                           | Purpose                       |
| ---------------------------- | ----------------------------------------- | ----------------------------- |
| `apiKeyCredentialStorage.ts` | `loadApiKey`, `saveApiKey`, `clearApiKey` | API key storage and retrieval |

### Content Generation

| File                           | Component/Class                                                                        | Purpose                                       |
| ------------------------------ | -------------------------------------------------------------------------------------- | --------------------------------------------- |
| `contentGenerator.ts`          | `ContentGenerator` interface, `createContentGenerator`, `createContentGeneratorConfig` | Content generator factory and configuration   |
| `loggingContentGenerator.ts`   | `LoggingContentGenerator`                                                              | Content generator with logging wrapper        |
| `recordingContentGenerator.ts` | `RecordingContentGenerator`                                                            | Content generator with recording capabilities |
| `fakeContentGenerator.ts`      | `FakeContentGenerator`                                                                 | Mock content generator for testing            |

### Chat & Messaging

| File               | Component/Class                    | Purpose                                            |
| ------------------ | ---------------------------------- | -------------------------------------------------- |
| `client.ts`        | `GeminiClient`                     | Main client for sending messages and managing chat |
| `geminiChat.ts`    | `GeminiChat`, `InvalidStreamError` | Chat management and streaming response handling    |
| `turn.ts`          | `Turn`, `GeminiEventType`          | Turn-based conversation management                 |
| `baseLlmClient.ts` | `BaseLlmClient`                    | Base LLM client interface                          |

### Tool Execution

| File                            | Component/Class                                                | Purpose                                 |
| ------------------------------- | -------------------------------------------------------------- | --------------------------------------- |
| `coreToolScheduler.ts`          | `CoreToolScheduler`, `ValidatingToolCall`, `ScheduledToolCall` | Tool call scheduling and validation     |
| `nonInteractiveToolExecutor.ts` | `NonInteractiveToolExecutor`                                   | Tool execution for non-interactive mode |
| `geminiRequest.ts`              | (functions)                                                    | Gemini API request utilities            |

### Prompts & System Messages

| File         | Component/Class                             | Purpose                                      |
| ------------ | ------------------------------------------- | -------------------------------------------- |
| `prompts.ts` | `getCoreSystemPrompt`, `resolvePathFromEnv` | System prompt generation and path resolution |

### Token Management

| File             | Component/Class | Purpose                                  |
| ---------------- | --------------- | ---------------------------------------- |
| `tokenLimits.ts` | `tokenLimit`    | Token limit configuration and validation |

### Logging & Debugging

| File        | Component/Class      | Purpose                   |
| ----------- | -------------------- | ------------------------- |
| `logger.ts` | `Logger`, `LogEntry` | Structured logging system |

### Hooks & Triggers

| File                        | Component/Class                             | Purpose                    |
| --------------------------- | ------------------------------------------- | -------------------------- |
| `clientHookTriggers.ts`     | `fireBeforeAgentHook`, `fireAfterAgentHook` | Client lifecycle hooks     |
| `geminiChatHookTriggers.ts` | (functions)                                 | GeminiChat lifecycle hooks |
| `coreToolHookTriggers.ts`   | (functions)                                 | Core tool lifecycle hooks  |

## Component Categories

### Critical Backend Components (Must Preserve)

1. **Authentication**: `apiKeyCredentialStorage.ts`
2. **API Communication**: `contentGenerator.ts`, `geminiChat.ts`, `client.ts`
3. **State Management**: `geminiChat.ts`, `turn.ts`
4. **Tool Execution**: `coreToolScheduler.ts`, `nonInteractiveToolExecutor.ts`
5. **Configuration**: `prompts.ts`, `tokenLimits.ts`

### Testing Components

- `*.test.ts` files: Unit tests for each component
- `__snapshots__/`: Snapshot test files

## Notes

- All components in this directory are **backend logic** and must be preserved
- Components should return structured data (objects/interfaces), not formatted
  strings
- No UI dependencies (chalk, ink, react) should be present in these files
- Components are organized by responsibility (auth, chat, tools, etc.)

## Next Steps

During refactoring:

1. Verify all components return structured data
2. Remove any UI side effects (console.log, chalk, etc.)
3. Ensure all imports are backend-only
4. Create data contracts for component interfaces
