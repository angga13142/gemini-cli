# Feature Specification: Backend-Frontend Architecture Separation

**Feature Branch**: `002-backend-frontend-separation`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "Spesifikasi Teknis - Anda harus mengubah struktur
kode saat ini menjadi arsitektur yang terpisah secara tegas."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Separate Backend Logic from UI (Priority: P1)

A developer needs to refactor the codebase to create a strict separation between
backend business logic and frontend UI code. This separation enables safe
replacement of the frontend layer without affecting core functionality, and
ensures backend logic remains testable and maintainable without UI dependencies.

**Why this priority**: This is the foundational architectural change that
enables all subsequent improvements. Without clear separation, refactoring
becomes risky and error-prone.

**Independent Test**: Can be fully tested by verifying that all backend
functions return structured data (objects/JSON) without any UI formatting, and
that no backend code contains UI-related imports or calls (console.log, chalk,
prompts, etc.).

**Acceptance Scenarios**:

1. **Given** existing codebase with mixed backend/frontend code, **When**
   refactoring is complete, **Then** all backend code in
   `packages/core/src/core/` returns structured data objects without any UI
   formatting
2. **Given** a backend function that processes API responses, **When** called
   from frontend, **Then** it returns raw data (JSON/Object) that frontend can
   format as needed
3. **Given** backend code, **When** reviewed, **Then** no UI-related
   dependencies (chalk, console.log for display, prompts, spinners) are present

---

### User Story 2 - Establish Data Contracts Between Layers (Priority: P1)

A developer needs standardized interfaces for communication between frontend and
backend layers. All data exchange must use structured formats (JSON/Object)
rather than formatted strings, enabling frontend flexibility and backend
testability.

**Why this priority**: Data contracts are critical for maintaining separation.
Without clear contracts, layers will inevitably become coupled again.

**Independent Test**: Can be fully tested by verifying that all functions called
from frontend return structured data types (objects, arrays, typed responses)
and that no formatted strings are returned from backend to frontend.

**Acceptance Scenarios**:

1. **Given** a backend function that processes user input, **When** called,
   **Then** it returns a structured object (e.g.,
   `{ text: string, timestamp: Date, metadata: object }`) not a formatted string
2. **Given** frontend code calling backend functions, **When** receiving
   responses, **Then** it receives raw data objects that it can format for
   display
3. **Given** error conditions in backend, **When** errors occur, **Then**
   backend throws structured error objects, not formatted error messages

---

### User Story 3 - Centralize State Management in Backend (Priority: P2)

A developer needs to move application state (such as chat history) from UI loops
and components into centralized backend classes or modules. Frontend should not
store business logic state.

**Why this priority**: Centralized state management improves maintainability and
enables state sharing across different frontend implementations. However, this
can be done after basic separation is established.

**Independent Test**: Can be fully tested by verifying that chat history and
other application state are managed in backend classes/modules, and that
frontend only holds transient UI state (input values, display preferences).

**Acceptance Scenarios**:

1. **Given** chat history currently stored in UI components, **When**
   refactoring is complete, **Then** chat history is managed by a backend
   class/module
2. **Given** application state, **When** accessed from frontend, **Then**
   frontend retrieves state from backend through defined interfaces
3. **Given** state updates, **When** state changes occur, **Then** backend
   manages state persistence and frontend receives updates through data
   contracts

---

### Edge Cases

- What happens when backend needs to return complex nested data structures?
- How does system handle errors when data contracts are violated (wrong format
  returned)?
- What happens when frontend needs to display data that backend hasn't
  formatted?
- How does system handle state synchronization when multiple frontend instances
  access the same backend state?
- What happens when backend functions need to return streaming data (e.g.,
  real-time responses)?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST organize all backend business logic in a dedicated
  directory (`packages/core/src/core/`)
- **FR-002**: System MUST organize all frontend UI code in a separate directory
  (`packages/cli/src/ui/`)
- **FR-003**: Backend code MUST NOT contain any UI-related code (no
  `console.log` for display, no `chalk`, no `prompt`, no terminal colors, no
  spinners)
- **FR-004**: Backend functions MUST return structured data (JSON/Object/typed
  responses) instead of formatted strings
- **FR-005**: Backend functions MUST only return data or throw errors - no side
  effects related to UI display
- **FR-006**: Frontend code MUST format all display output - backend must not
  format text for terminal display
- **FR-007**: Communication between frontend and backend MUST use standardized
  data contracts (structured objects)
- **FR-008**: Application state (chat history, session data) MUST be managed in
  backend classes/modules, not in frontend components
- **FR-009**: Frontend MUST retrieve state from backend through defined
  interfaces, not maintain business logic state locally
- **FR-010**: Backend error handling MUST return structured error objects, not
  formatted error messages
- **FR-011**: All data exchange between layers MUST be through function calls
  that return structured data types

### Key Entities _(include if feature involves data)_

- **Backend Module**: Represents a collection of backend functions organized by
  domain (API handling, data processing, state management)
- **Data Contract**: Defines the structure and type of data exchanged between
  frontend and backend layers
- **State Manager**: Backend class/module responsible for managing application
  state (chat history, sessions, configuration)
- **Frontend Component**: UI component that receives structured data from
  backend and formats it for display
- **Error Response**: Structured error object returned from backend containing
  error type, message, and metadata

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of backend code in `packages/core/src/core/` directory
  returns structured data (objects/JSON) with zero formatted strings returned to
  frontend
- **SC-002**: 100% of backend functions can be tested without any UI
  dependencies or mocks
- **SC-003**: Zero UI-related imports (chalk, console.log for display, prompts,
  spinners) in backend code directories
- **SC-004**: All application state (chat history, sessions) is managed in
  backend classes/modules, with zero business logic state in frontend components
- **SC-005**: Frontend can be replaced with alternative UI implementation
  without modifying any backend code
- **SC-006**: All data contracts between layers are documented with clear type
  definitions or schemas
- **SC-007**: Backend code passes all tests without requiring UI framework
  dependencies
