# Tasks: Backend-Frontend Architecture Separation

**Input**: Design documents from `/specs/002-backend-frontend-separation/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories),
research.md, data-model.md, contracts/

**Tests**: Tests are NOT included - this is a refactoring feature focused on
code organization and separation.

**Organization**: Tasks are grouped by user story to enable independent
implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Monorepo**: `packages/core/src/` (backend), `packages/cli/src/` (frontend)
- Backend contracts: `packages/core/src/contracts/`
- Frontend adapters: `packages/cli/src/adapters/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and contract structure

- [x] T001 Create contracts directory structure in packages/core/src/contracts/
- [x] T002 [P] Create adapters directory structure in packages/cli/src/adapters/
- [x] T003 [P] Document current backend component locations in
      packages/core/src/core/
- [x] T004 [P] Document current frontend component locations in
      packages/cli/src/ui/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can
be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 [P] [US2] Create ApiRequest interface in
      packages/core/src/contracts/api.ts
- [x] T006 [P] [US2] Create ApiResponse interface in
      packages/core/src/contracts/api.ts
- [x] T007 [P] [US2] Create ResponseMetadata interface in
      packages/core/src/contracts/api.ts
- [x] T008 [P] [US2] Create ResponseChunk interface in
      packages/core/src/contracts/api.ts
- [x] T009 [P] [US2] Create BackendError class in
      packages/core/src/contracts/errors.ts
- [x] T010 [P] [US2] Create ErrorType enum in
      packages/core/src/contracts/errors.ts
- [x] T011 [P] [US2] Create ErrorCode enum in
      packages/core/src/contracts/errors.ts
- [x] T012 [P] [US2] Create createBackendError helper function in
      packages/core/src/contracts/errors.ts
- [x] T013 [P] [US3] Create ChatState interface in
      packages/core/src/contracts/state.ts
- [x] T014 [P] [US3] Create SessionMetadata interface in
      packages/core/src/contracts/state.ts
- [x] T015 [P] [US3] Create StateService interface in
      packages/core/src/contracts/state.ts
- [x] T016 [P] [US2] Create AuthResult interface in
      packages/core/src/contracts/auth.ts
- [x] T017 [P] [US2] Create AuthRequest interface in
      packages/core/src/contracts/auth.ts
- [x] T018 [P] [US2] Create AuthService interface in
      packages/core/src/contracts/auth.ts
- [x] T019 Export all contracts from packages/core/src/contracts/index.ts
- [x] T020 Update packages/core/package.json to export contracts in main/types
      fields

**Checkpoint**: Foundation ready - user story implementation can now begin in
parallel

---

## Phase 3: User Story 1 - Separate Backend Logic from UI (Priority: P1) 🎯 MVP

**Goal**: Refactor codebase to create strict separation between backend business
logic and frontend UI code. Backend functions return structured data, no UI
formatting.

**Independent Test**: Verify that all backend functions return structured data
(objects/JSON) without any UI formatting, and that no backend code contains
UI-related imports or calls (console.log, chalk, prompts, etc.).

### Implementation for User Story 1

#### Phase 1: Safe Harbor Creation (Folder Core)

- [ ] T021 [US1] Verify all 15 backend components exist in
      packages/core/src/core/ per docs/analysis/backend-components.md
- [ ] T022 [US1] Identify any backend logic in packages/cli/src/core/ that needs
      relocation
- [ ] T023 [US1] Create packages/core/src/core/auth/ directory for
      authentication components
- [ ] T024 [US1] Create packages/core/src/core/api/ directory for API handling
      components
- [ ] T025 [US1] Create packages/core/src/core/state/ directory for state
      management components
- [ ] T026 [US1] Create packages/core/src/core/processing/ directory for data
      processing components
- [ ] T027 [US1] Move authentication components to packages/core/src/core/auth/
      if not already there
- [ ] T028 [US1] Move API handling components to packages/core/src/core/api/ if
      not already there
- [ ] T029 [US1] Move state management components to
      packages/core/src/core/state/ if not already there
- [ ] T030 [US1] Move data processing components to
      packages/core/src/core/processing/ if not already there
- [ ] T031 [US1] Update all import paths in packages/core/src/ after file moves
- [ ] T032 [US1] Update all import paths in packages/cli/src/ to use
      @google/gemini-cli-core workspace imports
- [ ] T033 [US1] Verify application runs without errors after file moves in
      packages/core/src/core/

#### Phase 2: Logic Extraction (The Purge)

- [ ] T034 [US1] Review packages/cli/src/ui/auth/useAuth.ts for backend logic to
      extract
- [ ] T035 [US1] Extract auth logic from useAuth.ts to
      packages/core/src/core/auth/authService.ts
- [ ] T036 [US1] Update useAuth.ts in packages/cli/src/ui/auth/useAuth.ts to
      call authService
- [ ] T037 [US1] Review packages/cli/src/ui/hooks/slashCommandProcessor.ts for
      backend logic
- [ ] T038 [US1] Extract slash command business logic to
      packages/core/src/core/api/slashCommandService.ts
- [ ] T039 [US1] Update handleSlashCommand in
      packages/cli/src/ui/hooks/slashCommandProcessor.ts to call
      slashCommandService
- [ ] T040 [US1] Review packages/cli/src/ui/hooks/atCommandProcessor.ts for
      backend logic
- [ ] T041 [US1] Extract @command processing logic to
      packages/core/src/core/api/atCommandService.ts
- [ ] T042 [US1] Update handleAtCommand in
      packages/cli/src/ui/hooks/atCommandProcessor.ts to call atCommandService
- [ ] T043 [US1] Identify all API call blocks in packages/cli/src/ui/ components
- [ ] T044 [US1] Extract API call logic to
      packages/core/src/core/api/apiService.ts
- [ ] T045 [US1] Update UI components to call apiService instead of direct API
      calls
- [ ] T046 [US1] Identify all data processing blocks in packages/cli/src/ui/
      components
- [ ] T047 [US1] Extract data processing logic to
      packages/core/src/core/processing/dataProcessor.ts
- [ ] T048 [US1] Update UI components to call dataProcessor instead of
      processing inline

#### Phase 3: Side Effects Purge

- [ ] T049 [US1] Search packages/core/src/ for console.log usage (excluding
      debugLogger)
- [ ] T050 [US1] Replace console.log with debugLogger or remove in
      packages/core/src/
- [ ] T051 [US1] Search packages/core/src/ for chalk or colors imports
- [ ] T052 [US1] Remove chalk/colors imports and usage from packages/core/src/
- [ ] T053 [US1] Search packages/core/src/ for prompt, readline, or input usage
- [ ] T054 [US1] Remove prompt/readline/input usage from packages/core/src/
- [ ] T055 [US1] Search packages/core/src/ for spinner or loading indicator
      usage
- [ ] T056 [US1] Remove spinner/loading indicator usage from packages/core/src/
- [ ] T057 [US1] Search packages/core/src/ for ink or react imports
- [ ] T058 [US1] Remove ink/react imports from packages/core/src/
- [ ] T059 [US1] Audit packages/core/package.json for UI dependencies
- [ ] T060 [US1] Remove UI-related packages (ink, react, react-dom, chalk) from
      packages/core/package.json
- [ ] T061 [US1] Replace console.error() with structured BackendError throws in
      packages/core/src/
- [ ] T062 [US1] Update error handling to throw BackendError instances in
      packages/core/src/
- [ ] T063 [US1] Verify all backend functions return structured data or throw
      errors in packages/core/src/

**Checkpoint**: At this point, User Story 1 should be fully functional - backend
returns structured data, no UI dependencies

---

## Phase 4: User Story 2 - Establish Data Contracts Between Layers (Priority: P1)

**Goal**: Standardize interfaces for communication between frontend and backend
layers. All data exchange uses structured formats (JSON/Object) rather than
formatted strings.

**Independent Test**: Verify that all functions called from frontend return
structured data types (objects, arrays, typed responses) and that no formatted
strings are returned from backend to frontend.

### Implementation for User Story 2

- [ ] T064 [US2] Implement ApiService interface in
      packages/core/src/core/api/apiService.ts using ApiRequest/ApiResponse
      contracts
- [ ] T065 [US2] Update GeminiChat.sendMessageStream to return ApiResponse in
      packages/core/src/core/geminiChat.ts
- [ ] T066 [US2] Update GeminiChat.sendMessageStream to accept ApiRequest in
      packages/core/src/core/geminiChat.ts
- [ ] T067 [US2] Update GeminiClient.sendMessageStream to use
      ApiRequest/ApiResponse contracts in packages/core/src/core/client.ts
- [ ] T068 [US2] Update GeminiClient.generateContent to use
      ApiRequest/ApiResponse contracts in packages/core/src/core/client.ts
- [ ] T069 [US2] Update makeApiCallAndProcessStream to return ApiResponse in
      packages/core/src/core/geminiChat.ts
- [ ] T070 [US2] Update processStreamResponse to return structured ResponseChunk
      objects in packages/core/src/core/geminiChat.ts
- [ ] T071 [US2] Implement AuthService interface in
      packages/core/src/core/auth/authService.ts using AuthRequest/AuthResult
      contracts
- [ ] T072 [US2] Update loadApiKey to return structured auth data in
      packages/core/src/core/apiKeyCredentialStorage.ts
- [ ] T073 [US2] Update refreshAuth to return AuthResult in
      packages/core/src/config/config.ts
- [ ] T074 [US2] Create frontend adapter for ApiService in
      packages/cli/src/adapters/apiAdapter.ts
- [ ] T075 [US2] Create frontend adapter for AuthService in
      packages/cli/src/adapters/authAdapter.ts
- [ ] T076 [US2] Update UI components to use apiAdapter instead of direct
      backend calls in packages/cli/src/ui/
- [ ] T077 [US2] Update UI components to use authAdapter instead of direct
      backend calls in packages/cli/src/ui/
- [ ] T078 [US2] Verify all backend functions return contract types
      (ApiResponse, AuthResult, etc.) in packages/core/src/
- [ ] T079 [US2] Verify no formatted strings returned from backend functions in
      packages/core/src/
- [ ] T080 [US2] Update frontend error handling to catch BackendError and format
      for display in packages/cli/src/ui/

**Checkpoint**: At this point, User Story 2 should be complete - all data
exchange uses structured contracts

---

## Phase 5: User Story 3 - Centralize State Management in Backend (Priority: P2)

**Goal**: Move application state (chat history, sessions) from UI components
into centralized backend classes. Frontend retrieves state via interfaces.

**Independent Test**: Verify that chat history and other application state are
managed in backend classes/modules, and that frontend only holds transient UI
state (input values, display preferences).

### Implementation for User Story 3

- [ ] T081 [US3] Verify GeminiChat.getHistory returns ChatState contract in
      packages/core/src/core/geminiChat.ts
- [ ] T082 [US3] Verify ChatRecordingService manages session state in
      packages/core/src/services/chatRecordingService.ts
- [ ] T083 [US3] Implement StateService interface in
      packages/core/src/core/state/stateService.ts
- [ ] T084 [US3] Update GeminiChat to implement StateService.getChatState in
      packages/core/src/core/geminiChat.ts
- [ ] T085 [US3] Update GeminiChat to implement StateService.getSessionMetadata
      in packages/core/src/core/geminiChat.ts
- [ ] T086 [US3] Create frontend adapter for StateService in
      packages/cli/src/adapters/stateAdapter.ts
- [ ] T087 [US3] Update useHistory hook to use stateAdapter instead of direct
      state access in packages/cli/src/ui/hooks/useHistoryManager.ts
- [ ] T088 [US3] Verify AppContainer retrieves state from stateAdapter in
      packages/cli/src/ui/AppContainer.tsx
- [ ] T089 [US3] Remove business logic state from frontend components in
      packages/cli/src/ui/
- [ ] T090 [US3] Verify frontend only holds transient UI state (input values,
      display prefs) in packages/cli/src/ui/
- [ ] T091 [US3] Update useSessionBrowser to use stateAdapter for session
      operations in packages/cli/src/ui/hooks/useSessionBrowser.ts

**Checkpoint**: At this point, User Story 3 should be complete - state managed
in backend, frontend retrieves via adapters

---

## Phase 6: Backend Independence Validation (Dummy Runner)

**Purpose**: Prove backend is independent of UI by creating test script

- [ ] T092 Create test script packages/core/test-backend-only.ts
- [ ] T093 Import backend core functions in packages/core/test-backend-only.ts
      (GeminiChat, ApiService, etc.)
- [ ] T094 Implement test function that calls backend without UI in
      packages/core/test-backend-only.ts
- [ ] T095 Verify backend returns structured data in test script
      packages/core/test-backend-only.ts
- [ ] T096 Verify no formatted strings returned in test script
      packages/core/test-backend-only.ts
- [ ] T097 Verify errors are structured BackendError objects in test script
      packages/core/test-backend-only.ts
- [ ] T098 Run test script and verify it executes without UI dependencies
- [ ] T099 Verify backend can process requests independently in test script
- [ ] T100 Verify backend returns data consumable by any frontend in test script
- [ ] T101 [US2] Document data contracts with clear type definitions in
      packages/core/src/contracts/README.md
- [ ] T102 [US2] Verify all contracts are documented with examples and usage
      patterns in packages/core/src/contracts/README.md
- [ ] T103 Create minimal frontend replacement test to validate SC-005 (frontend
      replaceability) in packages/core/test-frontend-replacement.ts

**Checkpoint**: Backend independence validated - test script runs successfully
without UI

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and documentation

- [ ] T104 [P] Run quickstart.md validation scenarios from
      specs/002-backend-frontend-separation/quickstart.md
- [ ] T105 [P] Verify all 7 validation scenarios pass
- [ ] T106 [P] Run full test suite: npm run test
- [ ] T107 [P] Verify zero UI imports in packages/core/src/ using grep
- [ ] T108 [P] Verify all backend functions return structured data (no formatted
      strings)
- [ ] T109 [P] Update documentation in packages/core/README.md with contract
      usage
- [ ] T110 [P] Update documentation in packages/cli/README.md with adapter usage
- [ ] T111 [P] Verify application still runs: npm start
- [ ] T112 [P] Verify application functionality unchanged (no visual/behavior
      changes)
- [ ] T113 [P] Run frontend replacement test (T103) to validate SC-005

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user
  stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion - Can start
  after Phase 2
- **User Story 2 (Phase 4)**: Depends on Foundational completion - Can start in
  parallel with US1 after Phase 2
- **User Story 3 (Phase 5)**: Depends on Foundational completion - Can start in
  parallel with US1/US2 after Phase 2
- **Backend Independence (Phase 6)**: Depends on US1, US2, US3 completion
- **Polish (Phase 7)**: Depends on all previous phases

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No
  dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Can run in
  parallel with US1
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Can run in
  parallel with US1/US2

### Within Each User Story

- Phase 1 (Safe Harbor) before Phase 2 (Extraction)
- Phase 2 (Extraction) before Phase 3 (Side Effects Purge)
- Contract definitions before implementation
- Backend changes before frontend adapter updates

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational contract tasks marked [P] can run in parallel (within
  Phase 2)
- Once Foundational phase completes, US1, US2, US3 can start in parallel (if
  team capacity allows)
- Within US1: Safe Harbor tasks can run in parallel with different file groups
- Within US1: Side effects purge tasks can run in parallel (different files)
- Polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all Safe Harbor directory creation tasks together:
Task: "Create packages/core/src/core/auth/ directory"
Task: "Create packages/core/src/core/api/ directory"
Task: "Create packages/core/src/core/state/ directory"
Task: "Create packages/core/src/core/processing/ directory"

# Launch all side effects search tasks together:
Task: "Search packages/core/src/ for console.log usage"
Task: "Search packages/core/src/ for chalk or colors imports"
Task: "Search packages/core/src/ for prompt, readline, or input usage"
Task: "Search packages/core/src/ for spinner or loading indicator usage"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (all 3 sub-phases: Safe Harbor, Extraction,
   Side Effects)
4. **STOP and VALIDATE**: Verify backend returns structured data, no UI
   dependencies
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Verify backend separation → Deploy/Demo (MVP!)
3. Add User Story 2 → Verify data contracts → Deploy/Demo
4. Add User Story 3 → Verify state centralization → Deploy/Demo
5. Add Backend Independence Validation → Prove separation → Deploy/Demo
6. Each phase adds value without breaking previous work

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Safe Harbor + Extraction + Side Effects)
   - Developer B: User Story 2 (Data Contracts)
   - Developer C: User Story 3 (State Management)
3. Stories complete and integrate independently
4. Team validates Backend Independence together

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break
  independence
- This is a refactoring task - maintain backward compatibility throughout
- All existing tests must continue to pass after each phase
