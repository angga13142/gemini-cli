# Codebase Architecture Analysis - Component Map Index

**Created**: 2025-11-30  
**Purpose**: Central index linking all analysis documents for easy navigation

## Overview

This directory contains comprehensive documentation of the Gemini CLI codebase
architecture, identifying all backend logic components (Otak), frontend/UI
components (Wajah), data flow patterns, and dependencies.

## Quick Start

1. **Start Here**: Read [SUMMARY.md](./SUMMARY.md) for executive summary
2. **Entry Points**: See [entry-points.md](./entry-points.md) to understand
   where the application starts
3. **Components**: Review [backend-components.md](./backend-components.md) and
   [frontend-components.md](./frontend-components.md)
4. **Data Flow**: Trace the pipeline in [data-flow.md](./data-flow.md)
5. **Dependencies**: Check [dependencies.md](./dependencies.md) for dependency
   categorization
6. **Relationships**: Understand component dependencies in
   [component-relationships.md](./component-relationships.md)
7. **Edge Cases**: Review special considerations in
   [edge-cases.md](./edge-cases.md)

## Document Index

### Core Analysis Documents

| Document                                                   | Purpose                               | Key Content                                                                                                      |
| ---------------------------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| [SUMMARY.md](./SUMMARY.md)                                 | Executive summary                     | Overview, key findings, verification status                                                                      |
| [entry-points.md](./entry-points.md)                       | Entry point identification            | 3 entry points: Interactive CLI, Non-Interactive CLI, A2A Server                                                 |
| [backend-components.md](./backend-components.md)           | Backend components (Otak)             | 15 components across 5 categories: Authentication, API Payload, HTTP Requests, Response Parsing, Data Processing |
| [frontend-components.md](./frontend-components.md)         | Frontend components (Wajah)           | 12 components across 4 categories: Input Handling, Output Formatting, Navigation, Display                        |
| [data-flow.md](./data-flow.md)                             | Data flow pipeline                    | 8-step pipeline from user input to formatted output                                                              |
| [dependencies.md](./dependencies.md)                       | Dependency catalog                    | 60+ dependencies categorized as UI (removable), Logic (essential), or Shared (analyze)                           |
| [component-relationships.md](./component-relationships.md) | Component relationships               | Backend-to-backend, frontend-to-backend, frontend-to-frontend dependencies                                       |
| [edge-cases.md](./edge-cases.md)                           | Edge cases and special considerations | Dual-purpose components, unclear categorizations, data flow edge cases, dependency edge cases                    |

## Analysis Results Summary

### Backend Components (Otak) - 20 Components (Updated)

**Location**: `packages/core/src/core/` with subdirectories:

- `auth/` - Authentication components
- `api/` - API service components
- `processing/` - Data processing components
- `state/` - State management components (prepared for future)

**Status**: ✅ **ALL MUST BE PRESERVED**

- **Authentication** (6): loadApiKey, saveApiKey, clearApiKey, AuthService,
  useAuthCommand, refreshAuth
- **API Service** (3): ApiServiceImpl, parseSlashCommand (SlashCommandService),
  parseAllAtCommands (AtCommandService)
- **API Payload Construction** (2): createContentGeneratorConfig,
  makeApiCallAndProcessStream
- **HTTP Request Handling** (3): createContentGenerator, generateContentStream,
  generateContent
- **Response Parsing** (2): processStreamResponse, getResponseText
- **Data Processing** (4): convertSessionToHistoryFormats (DataProcessor),
  GeminiClient.sendMessageStream, GeminiClient.generateContent,
  GeminiChat.sendMessageStream

**See**: [backend-components.md](./backend-components.md) for complete details

### Frontend Components (Wajah) - 12 Components

**Location**: `packages/cli/src/ui/`  
**Status**: ❌ **ALL CAN BE REPLACED**

- **Input Handling** (4): InputPrompt, parseSlashCommand (backend service),
  handleSlashCommand (uses backend), handleAtCommand (uses backend)
- **Output Formatting** (3): MarkdownDisplay, ToolResultDisplay, AnsiOutputText
- **Navigation** (2): AppContainer, useSessionBrowser
- **Display** (3): InputPrompt, MarkdownDisplay, ToolResultDisplay

**Replaceability**:

- **High** (9 components): Can be easily replaced
- **Medium** (3 components): Require some refactoring

**See**: [frontend-components.md](./frontend-components.md) for complete details

### Data Flow Pipeline - 8 Steps

**Sample Input**: `"Explain this code @src/main.ts"`

1. Raw Input Collection → `string`
2. Command Parsing → `ParsedSlashCommand | string`
3. @Command Processing → `PartListUnion`
4. Query Preparation → `PartListUnion`
5. Payload Construction → `GenerateContentParameters`
6. HTTP Request → `AsyncGenerator<GenerateContentResponse>`
7. Response Parsing → `string`
8. Output Formatting → `React.JSX.Element`

**See**: [data-flow.md](./data-flow.md) for complete pipeline with TypeScript
types

### Dependencies - 60+ Packages

- **UI Dependencies** (15): Removable - ink, react, react-dom, highlight.js,
  etc.
- **Logic Dependencies** (40+): Essential - @google/genai, google-auth-library,
  undici, etc.
- **Shared Dependencies** (3): Analyze - zod, dotenv, @google/gemini-cli-core

**See**: [dependencies.md](./dependencies.md) for complete catalog with usage
locations

### Component Relationships

- **Backend-to-Backend** (8): Critical dependencies for API flow
- **Frontend-to-Backend** (2): Authentication flow dependencies
- **Frontend-to-Frontend** (7): UI component dependencies

**See**: [component-relationships.md](./component-relationships.md) for complete
relationship map

## Entry Points

1. **Interactive CLI**: `packages/cli/src/gemini.tsx::main()` →
   `bundle/gemini.js`
2. **Non-Interactive CLI**:
   `packages/cli/src/nonInteractiveCli.ts::runNonInteractive()`
3. **A2A Server**: `packages/a2a-server/src/index.ts`

**See**: [entry-points.md](./entry-points.md) for complete entry point
documentation

## Edge Cases

Documented edge cases include:

- Dual-purpose components (useAuth.ts)
- Unclear categorizations (getResponseText)
- Data flow edge cases (slash commands, streaming dual output, PartListUnion
  complexity)
- Dependency edge cases (version conflicts, optional dependencies)

**See**: [edge-cases.md](./edge-cases.md) for complete edge case documentation

## Verification Status

✅ **All Components Documented**: File paths and function/class names verified  
✅ **Data Flow Complete**: All 8 steps documented with input/output formats  
✅ **Dependencies Categorized**: All 60+ dependencies categorized with usage
locations  
✅ **Relationships Documented**: All relationship types documented  
✅ **Edge Cases Consolidated**: All edge cases documented

## Usage Guide

### For Refactoring Planning

1. Review [SUMMARY.md](./SUMMARY.md) for overview
2. Check [backend-components.md](./backend-components.md) to identify what must
   be preserved
3. Review [frontend-components.md](./frontend-components.md) to identify what
   can be replaced
4. Understand [data-flow.md](./data-flow.md) to maintain data flow integrity
5. Check [dependencies.md](./dependencies.md) for dependency removal strategy
6. Review [component-relationships.md](./component-relationships.md) to preserve
   critical relationships

### For Component Location

1. Check [entry-points.md](./entry-points.md) to find where the application
   starts
2. Use [backend-components.md](./backend-components.md) or
   [frontend-components.md](./frontend-components.md) to locate specific
   components
3. Follow [component-relationships.md](./component-relationships.md) to
   understand dependencies
4. Review [data-flow.md](./data-flow.md) to trace component usage in data flow

### For Dependency Management

1. Review [dependencies.md](./dependencies.md) for complete dependency catalog
2. Check categorization (UI/Logic/Shared) to determine removal strategy
3. Review usage locations to understand impact of removal
4. Check [edge-cases.md](./edge-cases.md) for dependency-related edge cases

## Analysis Methodology

This analysis followed the "Trace & Tag" methodology:

1. **Entry Point Identification**: Started from package.json bin field
2. **Code Tracing**: Followed function calls from entry points
3. **Component Tagging**: Tagged as 🔴 Frontend, 🟢 Backend, 🟡 Shared
4. **Data Flow Tracing**: Traced sample input through complete pipeline
5. **Dependency Analysis**: Categorized by usage pattern (UI vs Logic)

**See**: [../research.md](../research.md) for detailed methodology

## Related Documents

- **Specification**: [../spec.md](../spec.md)
- **Implementation Plan**: [../plan.md](../plan.md)
- **Tasks**: [../tasks.md](../tasks.md)
- **Research**: [../research.md](../research.md)
- **Data Model**: [../data-model.md](../data-model.md)
- **Quickstart Guide**: [../quickstart.md](../quickstart.md)
- **Contracts**: [../contracts/](../contracts/)

## Notes

- All file paths verified to exist in current codebase
- All function/class names verified to exist in source files
- Component relationships verified through code tracing
- Dependencies verified through import statement analysis
- Analysis complete and ready for refactoring planning

---

**Last Updated**: 2025-01-27 (Post Phase 3.2 Refactoring)  
**Status**: Complete ✅ (Updated for Backend-Frontend Separation)
