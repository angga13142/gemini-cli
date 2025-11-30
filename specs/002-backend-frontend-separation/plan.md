# Implementation Plan: Backend-Frontend Architecture Separation

**Branch**: `002-backend-frontend-separation` | **Date**: 2025-01-27 | **Spec**:
[spec.md](./spec.md) **Input**: Feature specification from
`/specs/002-backend-frontend-separation/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See
`.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Refactor the Gemini CLI codebase to create strict architectural separation
between backend business logic and frontend UI code. This refactoring enables
safe frontend replacement, improves testability, and ensures backend logic
remains independent of UI frameworks. The implementation follows a 4-phase
approach: creating backend "safe harbor" structure, extracting mixed logic,
purging UI side effects, and validating backend independence.

**Technical Approach**: Based on analysis from `docs/analysis/`, the codebase
already has partial separation with `packages/core/` (backend) and
`packages/cli/src/ui/` (frontend). However, mixed code exists that needs
extraction and cleanup. The refactoring will:

1. Consolidate backend logic into `packages/core/src/core/` (Safe Harbor)
2. Extract mixed logic from UI components to backend modules
3. Remove all UI side effects (console.log, chalk, prompts) from backend
4. Establish data contracts for layer communication
5. Centralize state management in backend classes

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js >=20.0.0  
**Primary Dependencies**:

- Backend: @google/genai, google-auth-library, undici, OpenTelemetry packages
- Frontend: ink (React for CLI), react, react-dom, highlight.js, lowlight
- Shared: zod, dotenv, @google/gemini-cli-core (workspace dependency)

**Storage**: File-based (chat history, sessions in `~/.gemini/tmp/`), in-memory
state  
**Testing**: vitest (unit/integration), test coverage for critical paths  
**Target Platform**: Node.js CLI (Linux, macOS, Windows)  
**Project Type**: Monorepo (packages: core, cli, a2a-server,
vscode-ide-companion)

**Performance Goals**:

- Sub-500ms boot time (per constitution)
- Non-blocking async operations
- Minimal dependency footprint

**Constraints**:

- Must preserve all 15 backend components identified in analysis
- Must maintain backward compatibility during refactoring
- Cannot break existing functionality
- Must pass all existing tests

**Scale/Scope**:

- 15 backend components to preserve
- 12 frontend components to refactor
- 60+ dependencies to categorize and manage
- 8-step data flow pipeline to maintain

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Code Quality Gates

- ✅ **Type Safety**: TypeScript strict mode enforced - refactoring maintains
  type safety
- ✅ **Immutability**: Backend functions return new data structures, not mutate
  state
- ✅ **Modularity**: Separation creates clearer module boundaries
- ⚠️ **Documentation**: Refactoring must maintain or improve code clarity

### Testing Standards Gates

- ✅ **Mocking AI**: Backend tests already use mocks - separation improves
  testability
- ✅ **Critical Path Coverage**: All backend functions must remain testable
- ✅ **Integration Testing**: Data contracts must be integration tested

### UX Consistency Gates

- ⚠️ **Human-Readable Output**: Frontend must handle all formatting - backend
  returns raw data
- ✅ **Predictable Patterns**: Data contracts standardize interaction patterns
- ✅ **Error Reporting**: Backend throws structured errors, frontend formats for
  display

### Performance Requirements Gates

- ✅ **Boot Time**: Backend separation enables lazy loading of UI dependencies
- ✅ **Async Operations**: Backend already async - separation maintains this
- ✅ **Dependency Footprint**: Removing UI deps from backend reduces footprint

**Gate Status**: ✅ **PASS** - All gates pass with minor documentation
requirements

## Project Structure

### Documentation (this feature)

```text
specs/002-backend-frontend-separation/
├── plan.md              # This file
├── research.md          # Phase 0 output (refactoring patterns, data contract design)
├── data-model.md        # Phase 1 output (state entities, data contracts)
├── quickstart.md        # Phase 1 output (refactoring validation scenarios)
├── contracts/           # Phase 1 output (data contract schemas, API interfaces)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

**Current Structure** (Monorepo):

```text
packages/
├── core/                    # Backend logic package
│   └── src/
│       ├── core/           # Core backend components (15 components)
│       ├── utils/          # Backend utilities
│       ├── config/         # Configuration management
│       └── ...
├── cli/                     # Frontend UI package
│   └── src/
│       ├── ui/             # Frontend components (12 components)
│       ├── utils/          # Frontend utilities
│       ├── core/           # ⚠️ Mixed: Some backend logic here
│       └── ...
└── a2a-server/              # Separate server package
```

**Target Structure** (After Refactoring):

```text
packages/
├── core/                    # Backend logic package (Safe Harbor)
│   └── src/
│       ├── core/           # Pure backend logic (no UI dependencies)
│       │   ├── api/        # API client, payload construction
│       │   ├── auth/       # Authentication logic
│       │   ├── state/       # State management (chat history, sessions)
│       │   └── processing/ # Data processing, response parsing
│       ├── utils/          # Backend utilities (no UI code)
│       ├── config/         # Configuration (backend only)
│       └── contracts/      # Data contract definitions
├── cli/                     # Frontend UI package
│   └── src/
│       ├── ui/             # Pure UI components (formatting, display)
│       ├── adapters/       # Adapters to backend (call backend, format output)
│       └── utils/          # Frontend utilities (UI formatting only)
└── a2a-server/              # Separate server package (unchanged)
```

**Structure Decision**: Maintain monorepo structure but enforce strict
separation:

- `packages/core/` = Backend Safe Harbor (zero UI dependencies)
- `packages/cli/src/ui/` = Frontend Zone (formatting, display only)
- `packages/cli/src/adapters/` = New layer for backend communication
- Data contracts defined in `packages/core/src/contracts/`

## Refactoring Action Plan

Based on user instructions and analysis from `docs/analysis/`, the refactoring
follows 4 sequential phases:

### Phase 1: Safe Harbor Creation (Folder Core)

**Objective**: Establish clean backend structure and move pure logic files

**Tasks**:

1. **Verify Backend Core Structure**:
   - Confirm `packages/core/src/core/` contains all 15 backend components
   - Document current structure vs. target structure
   - Identify files that need relocation

2. **Move Pure Logic Files**:
   - Based on analysis: Most backend logic already in `packages/core/src/core/`
   - Identify any backend logic in `packages/cli/src/core/` or mixed locations
   - Move pure logic files to `packages/core/src/core/` by category:
     - Authentication → `packages/core/src/core/auth/`
     - API handling → `packages/core/src/core/api/`
     - State management → `packages/core/src/core/state/`
     - Data processing → `packages/core/src/core/processing/`

3. **Fix Import Paths**:
   - Update all imports after file moves
   - Ensure `packages/cli/` imports from `@google/gemini-cli-core` (workspace)
   - Verify application still runs (functional verification)

**Validation**: Application runs without errors, all imports resolve correctly

---

### Phase 2: Logic Extraction (The Purge)

**Objective**: Extract mixed logic from UI components to backend modules

**Tasks**:

1. **Identify Mixed Code**:
   - Review files in `packages/cli/src/ui/` for backend logic
   - Check `packages/cli/src/core/` for mixed code
   - Identify components with both UI and logic (per edge-cases.md):
     - `useAuth.ts` (UI directory but backend auth logic)
     - `handleSlashCommand`, `handleAtCommand` (UI hooks with business logic)

2. **Extract API Call Logic**:
   - Identify blocks that call Gemini API
   - Extract to functions in `packages/core/src/core/api/`
   - Functions must: accept parameters, return structured data, no UI formatting

3. **Extract Data Processing Logic**:
   - Identify blocks that process API responses
   - Extract to functions in `packages/core/src/core/processing/`
   - Functions must: accept raw API responses, return structured objects

4. **Update UI Components**:
   - Replace extracted logic with calls to new backend functions
   - UI components receive structured data and format for display
   - Maintain existing UI behavior (no visual changes)

**Validation**: UI components call backend functions, receive structured data,
format correctly

---

### Phase 3: Side Effects Purge

**Objective**: Remove all UI-related code from backend directories

**Tasks**:

1. **Scan Backend Code**:
   - Search `packages/core/src/` for UI keywords:
     - `console.log` (for display - keep debugLogger for dev logs)
     - `chalk`, `colors`, terminal formatting
     - `prompt`, `readline`, `input`
     - `spinner`, loading indicators
     - Any UI framework imports (ink, react)

2. **Refactor Error Handling**:
   - Replace `console.error()` with structured error objects
   - Backend throws `Error` objects with structured properties
   - Frontend catches and formats errors for display

3. **Refactor Debug Logging**:
   - Keep `debugLogger` for development (acceptable in backend)
   - Remove any `console.log` used for user-facing output
   - Ensure all user-facing messages removed from backend

4. **Remove UI Dependencies**:
   - Audit `packages/core/package.json` for UI dependencies
   - Remove any UI-related packages (ink, react, chalk, etc.)
   - Update imports to remove UI dependencies

**Validation**: Zero UI-related imports in `packages/core/`, all functions
return data or throw errors

---

### Phase 4: Backend Independence Validation (Dummy Runner)

**Objective**: Prove backend is independent of UI by creating test script

**Tasks**:

1. **Create Test Script**:
   - Create `packages/core/test-backend-only.ts` (or `.js`)
   - Import backend core functions (ChatService, API client, etc.)
   - Simulate user interaction without UI:

     ```typescript
     import { GeminiChat } from './src/core/geminiChat.js';

     async function test() {
       const chat = new GeminiChat(config);
       const response = await chat.sendMessageStream('Test message');
       // Verify response is structured data, not formatted string
       console.assert(
         response.text !== undefined,
         'Backend returns structured data',
       );
     }
     ```

2. **Validate Data Contracts**:
   - Verify all backend functions return structured objects
   - Verify no formatted strings returned
   - Verify errors are structured Error objects

3. **Run Without UI**:
   - Execute test script without loading UI framework
   - Verify backend can process requests independently
   - Verify backend returns data that can be consumed by any frontend

**Validation**: Test script runs successfully, backend processes requests,
returns structured data, no UI dependencies required

---

## Data Contract Design

### Contract Types

1. **API Request Contract**: Structured input for backend functions

   ```typescript
   type ApiRequest = {
     message: string | PartListUnion;
     config?: GenerateContentConfig;
     metadata?: Record<string, unknown>;
   };
   ```

2. **API Response Contract**: Structured output from backend

   ```typescript
   type ApiResponse = {
     text: string;
     metadata: {
       tokens?: number;
       model?: string;
       timestamp: Date;
     };
     stream?: AsyncGenerator<ResponseChunk>;
   };
   ```

3. **State Contract**: Application state structure

   ```typescript
   type ChatState = {
     history: Content[];
     sessionId: string;
     metadata: SessionMetadata;
   };
   ```

4. **Error Contract**: Structured error objects
   ```typescript
   type BackendError = {
     type: string;
     message: string;
     code?: string;
     metadata?: Record<string, unknown>;
   };
   ```

### Contract Enforcement

- TypeScript interfaces for compile-time checking
- Runtime validation using zod schemas (if needed)
- Documentation in `packages/core/src/contracts/`

---

## Migration Strategy

### Incremental Refactoring

1. **Phase 1-2**: Move and extract (maintains functionality)
2. **Phase 3**: Purge side effects (may require frontend updates)
3. **Phase 4**: Validate independence (proves separation)

### Backward Compatibility

- Maintain existing function signatures where possible
- Add new backend functions alongside old ones (deprecation path)
- Update frontend to use new functions incrementally
- Remove old mixed code after migration complete

### Testing Strategy

- Run existing test suite after each phase
- Add tests for data contracts
- Integration tests for frontend-backend communication
- Test backend independence script (Phase 4)

---

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - refactoring improves modularity and maintains constitution
principles.
