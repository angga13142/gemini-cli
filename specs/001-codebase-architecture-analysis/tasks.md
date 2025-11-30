# Tasks: Codebase Architecture Analysis

**Input**: Design documents from `/specs/001-codebase-architecture-analysis/`
**Prerequisites**: plan.md (required), spec.md (required for user stories),
research.md, data-model.md, contracts/

**Tests**: Tests are NOT included - this is a documentation/analysis feature,
not code implementation.

**Organization**: Tasks are grouped by user story to enable independent analysis
and documentation of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Documentation: `specs/001-codebase-architecture-analysis/`
- Analysis output: `specs/001-codebase-architecture-analysis/analysis/`
- Component maps:
  `specs/001-codebase-architecture-analysis/analysis/backend-components.md`,
  `frontend-components.md`

---

## Phase 1: Setup (Documentation Infrastructure)

**Purpose**: Create documentation structure and analysis workspace

- [x] T001 Create analysis output directory structure in
      specs/001-codebase-architecture-analysis/analysis/
- [x] T002 [P] Create backend-components.md template in
      specs/001-codebase-architecture-analysis/analysis/backend-components.md
- [x] T003 [P] Create frontend-components.md template in
      specs/001-codebase-architecture-analysis/analysis/frontend-components.md
- [x] T004 [P] Create data-flow.md template in
      specs/001-codebase-architecture-analysis/analysis/data-flow.md
- [x] T005 [P] Create dependencies.md template in
      specs/001-codebase-architecture-analysis/analysis/dependencies.md
- [x] T006 [P] Create component-relationships.md template in
      specs/001-codebase-architecture-analysis/analysis/component-relationships.md

---

## Phase 2: Foundational (Entry Point Identification)

**Purpose**: Identify all application entry points - CRITICAL prerequisite for
all analysis

**⚠️ CRITICAL**: No component analysis can begin until entry points are
identified

**Methodology**: Use "Trace & Tag" approach - follow function calls from entry
points, tag components as frontend/backend, create dependency graph

- [x] T007 Identify main CLI entry point by checking package.json bin field
- [x] T008 Trace bundle/gemini.js to source file location
- [x] T009 Document main() function location in packages/cli/src/gemini.tsx
- [x] T010 [P] Identify non-interactive CLI entry point in
      packages/cli/src/nonInteractiveCli.ts
- [x] T011 [P] Identify A2A server entry point in
      packages/a2a-server/src/index.ts
- [x] T012 Create entry-points.md documenting all entry points in
      specs/001-codebase-architecture-analysis/analysis/entry-points.md

**Checkpoint**: Entry points identified - component tracing can now begin using
"Trace & Tag" methodology

---

## Phase 3: User Story 1 - Identify Backend Logic Components (Priority: P1) 🎯 MVP

**Goal**: Locate and document all backend logic components (authentication, API
payload construction, HTTP requests, response parsing) that must be preserved
during refactoring

**Independent Test**: Verify by checking that all authentication handlers, API
payload builders, HTTP request functions, and response parsers are documented
with file paths and function names. Can be verified by reviewing
backend-components.md and confirming each component can be located within 5
minutes.

### Implementation for User Story 1

- [x] T013 [US1] Trace authentication code from entry point to identify API key
      processing in packages/core/src/core/apiKeyCredentialStorage.ts
- [x] T014 [US1] Document loadApiKey() function in
      packages/core/src/core/apiKeyCredentialStorage.ts
- [x] T015 [US1] Document saveApiKey() function in
      packages/core/src/core/apiKeyCredentialStorage.ts
- [x] T016 [US1] Trace authentication method selection code in
      packages/cli/src/ui/auth/useAuth.ts
- [x] T017 [US1] Document config.refreshAuth() authentication flow in
      packages/core/src/config/config.ts
- [x] T018 [P] [US1] Identify content generator configuration in
      packages/core/src/core/contentGenerator.ts
- [x] T019 [P] [US1] Document createContentGeneratorConfig() function in
      packages/core/src/core/contentGenerator.ts
- [x] T020 [P] [US1] Document createContentGenerator() function in
      packages/core/src/core/contentGenerator.ts
- [x] T021 [US1] Trace API payload construction in
      packages/core/src/core/geminiChat.ts
- [x] T022 [US1] Document makeApiCallAndProcessStream() payload construction in
      packages/core/src/core/geminiChat.ts
- [x] T023 [US1] Identify HTTP request handling in
      packages/core/src/core/contentGenerator.ts
- [x] T024 [US1] Document generateContentStream() HTTP request function in
      packages/core/src/core/contentGenerator.ts
- [x] T025 [US1] Trace response parsing code in
      packages/core/src/core/geminiChat.ts
- [x] T026 [US1] Document processStreamResponse() response parsing in
      packages/core/src/core/geminiChat.ts
- [x] T027 [US1] Document getResponseText() response extraction in
      packages/core/src/utils/partUtils.ts
- [x] T028 [US1] Identify GeminiClient class and its API methods in
      packages/core/src/core/client.ts
- [x] T029 [US1] Document sendMessageStream() method in
      packages/core/src/core/client.ts
- [x] T030 [US1] Document generateContent() method in
      packages/core/src/core/client.ts
- [x] T031 [US1] Create backend-components.md with all identified components in
      specs/001-codebase-architecture-analysis/analysis/backend-components.md
- [x] T032 [US1] Document component relationships and dependencies in
      specs/001-codebase-architecture-analysis/analysis/component-relationships.md
      including: backend-to-backend dependencies, frontend-to-backend
      dependencies, frontend-to-frontend dependencies, and shared component
      relationships
- [x] T100 [US1] Document edge cases discovered during backend component
      analysis (dual-purpose components, unclear categorization) in
      specs/001-codebase-architecture-analysis/analysis/edge-cases.md

**Checkpoint**: At this point, all backend logic components should be identified
and documented. Can verify by checking that backend-components.md contains
authentication, payload construction, HTTP requests, and response parsing
components with file paths.

---

## Phase 4: User Story 2 - Identify Frontend/UI Components (Priority: P2)

**Goal**: Locate and document all frontend/UI components (input handling, output
formatting, CLI navigation) that can be replaced during refactoring

**Independent Test**: Verify by checking that all input handlers, output
formatters, and UI navigation components are documented with file paths and
replaceability status. Can be verified by reviewing frontend-components.md and
confirming each component's UI responsibility is clearly stated.

### Implementation for User Story 2

- [x] T033 [US2] Trace input handling from entry point to InputPrompt component
      in packages/cli/src/ui/components/InputPrompt.tsx
- [x] T034 [US2] Document InputPrompt component input collection logic in
      packages/cli/src/ui/components/InputPrompt.tsx
- [x] T035 [US2] Identify command parsing code in
      packages/cli/src/ui/hooks/slashCommandProcessor.ts
- [x] T036 [US2] Document parseSlashCommand() function in
      packages/cli/src/utils/commands.ts
- [x] T037 [US2] Document handleSlashCommand() function in
      packages/cli/src/ui/hooks/slashCommandProcessor.ts
- [x] T038 [US2] Identify @command processing in
      packages/cli/src/ui/hooks/atCommandProcessor.ts
- [x] T039 [US2] Document handleAtCommand() function in
      packages/cli/src/ui/hooks/atCommandProcessor.ts
- [x] T040 [P] [US2] Identify output formatting components in
      packages/cli/src/ui/utils/MarkdownDisplay.tsx
- [x] T041 [P] [US2] Document MarkdownDisplay component markdown rendering in
      packages/cli/src/ui/utils/MarkdownDisplay.tsx
- [x] T042 [P] [US2] Identify ToolResultDisplay component in
      packages/cli/src/ui/components/messages/ToolResultDisplay.tsx
- [x] T043 [P] [US2] Document ToolResultDisplay output formatting in
      packages/cli/src/ui/components/messages/ToolResultDisplay.tsx
- [x] T044 [P] [US2] Identify AnsiOutput component for color coding in
      packages/cli/src/ui/components/AnsiOutput.tsx
- [x] T045 [P] [US2] Document AnsiOutput color formatting in
      packages/cli/src/ui/components/AnsiOutput.tsx
- [x] T046 [US2] Trace CLI navigation and menu components in
      packages/cli/src/ui/AppContainer.tsx
- [x] T047 [US2] Document AppContainer main UI structure in
      packages/cli/src/ui/AppContainer.tsx
- [x] T048 [US2] Identify session management UI in
      packages/cli/src/ui/hooks/useSessionBrowser.ts
- [x] T049 [US2] Document session navigation components in
      packages/cli/src/ui/hooks/useSessionBrowser.ts
- [x] T050 [US2] Create frontend-components.md with all identified components in
      specs/001-codebase-architecture-analysis/analysis/frontend-components.md
- [x] T051 [US2] Document replaceability assessment for each frontend component
      in
      specs/001-codebase-architecture-analysis/analysis/frontend-components.md
- [x] T101 [US2] Document edge cases discovered during frontend component
      analysis (components serving both UI and logic, embedded logic in UI) in
      specs/001-codebase-architecture-analysis/analysis/edge-cases.md

**Checkpoint**: At this point, all frontend/UI components should be identified
and documented. Can verify by checking that frontend-components.md contains
input handling, output formatting, and navigation components with replaceability
status.

---

## Phase 5: User Story 3 - Document Data Flow (Priority: P2)

**Goal**: Trace and document complete data flow from user input through all
transformation stages to final formatted output

**Independent Test**: Verify by tracing a sample user input through the system
and confirming all transformation steps are documented with input/output formats
and component responsibilities. Can be verified by reviewing data-flow.md and
confirming the flow is complete from input to output.

### Implementation for User Story 3

- [x] T052 [US3] Choose sample user input for data flow tracing following
      criteria: must include @command (file inclusion), must include slash
      command, must include plain text query, should represent typical user
      workflow (e.g., "Explain this code @src/main.ts")
- [x] T053 [US3] Document Step 1: Raw input collection in
      packages/cli/src/ui/components/InputPrompt.tsx
- [x] T054 [US3] Document input format: string at Step 1 in
      specs/001-codebase-architecture-analysis/analysis/data-flow.md
- [x] T055 [US3] Trace Step 2: Command parsing through parseSlashCommand() in
      packages/cli/src/utils/commands.ts
- [x] T056 [US3] Document transformation: string → ParsedCommand at Step 2 in
      specs/001-codebase-architecture-analysis/analysis/data-flow.md
- [x] T057 [US3] Trace Step 3: @command processing through handleAtCommand() in
      packages/cli/src/ui/hooks/atCommandProcessor.ts
- [x] T058 [US3] Document transformation: string → PartListUnion at Step 3 in
      specs/001-codebase-architecture-analysis/analysis/data-flow.md
- [x] T059 [US3] Trace Step 4: Query preparation through prepareQueryForGemini()
      in packages/cli/src/ui/hooks/useGeminiStream.ts
- [x] T060 [US3] Document transformation: PartListUnion → PartListUnion
      (processed) at Step 4 in
      specs/001-codebase-architecture-analysis/analysis/data-flow.md
- [x] T061 [US3] Trace Step 5: Payload construction through
      makeApiCallAndProcessStream() in packages/core/src/core/geminiChat.ts
- [x] T062 [US3] Document transformation: PartListUnion → GenerateContentConfig
      at Step 5 in
      specs/001-codebase-architecture-analysis/analysis/data-flow.md
- [x] T063 [US3] Trace Step 6: HTTP request through generateContentStream() in
      packages/core/src/core/contentGenerator.ts
- [x] T064 [US3] Document transformation: GenerateContentConfig → HTTP Request →
      GenerateContentResponse (stream) at Step 6 in
      specs/001-codebase-architecture-analysis/analysis/data-flow.md
- [x] T065 [US3] Trace Step 7: Response parsing through processStreamResponse()
      in packages/core/src/core/geminiChat.ts
- [x] T066 [US3] Document transformation: GenerateContentResponse → string
      (text) at Step 7 in
      specs/001-codebase-architecture-analysis/analysis/data-flow.md
- [x] T067 [US3] Trace Step 8: Output formatting through MarkdownDisplay in
      packages/cli/src/ui/utils/MarkdownDisplay.tsx
- [x] T068 [US3] Document transformation: string → FormattedOutput (with colors,
      markdown) at Step 8 in
      specs/001-codebase-architecture-analysis/analysis/data-flow.md
- [x] T069 [US3] Create complete data-flow.md with all transformation steps in
      specs/001-codebase-architecture-analysis/analysis/data-flow.md
- [x] T070 [US3] Document data structures at each step with TypeScript types in
      specs/001-codebase-architecture-analysis/analysis/data-flow.md
- [x] T102 [US3] Document edge cases discovered during data flow analysis
      (missing transformation steps, unclear data structures) in
      specs/001-codebase-architecture-analysis/analysis/edge-cases.md

**Checkpoint**: At this point, complete data flow should be documented. Can
verify by reviewing data-flow.md and confirming all 8 steps are documented with
input/output formats and component locations.

---

## Phase 6: User Story 4 - Catalog Dependencies (Priority: P3)

**Goal**: Categorize all dependencies into UI-related (removable) and
logic-related (essential) categories with usage locations and rationale

**Independent Test**: Verify by checking that all dependencies from package.json
files are categorized with clear rationale. Can be verified by reviewing
dependencies.md and confirming each dependency has category, usage locations,
and essential status.

### Implementation for User Story 4

- [ ] T071 [US4] Review root package.json dependencies in package.json
- [ ] T072 [US4] Review packages/core/package.json dependencies in
      packages/core/package.json
- [ ] T073 [US4] Review packages/cli/package.json dependencies in
      packages/cli/package.json
- [ ] T074 [P] [US4] Search for @google/genai imports to identify usage
      locations
- [ ] T075 [P] [US4] Search for ink imports to identify UI usage locations
- [ ] T076 [P] [US4] Search for react imports to identify UI usage locations
- [ ] T077 [P] [US4] Search for google-auth-library imports to identify backend
      usage locations
- [ ] T078 [P] [US4] Search for undici imports to identify HTTP client usage
      locations
- [ ] T079 [US4] Categorize @google/genai as logic dependency with usage in
      packages/core/src/core/contentGenerator.ts
- [ ] T080 [US4] Categorize google-auth-library as logic dependency with usage
      locations
- [ ] T081 [US4] Categorize undici as logic dependency with usage in HTTP
      requests
- [ ] T082 [US4] Categorize ink as UI dependency with usage in
      packages/cli/src/ui/\*_/_.tsx
- [ ] T083 [US4] Categorize react as UI dependency with usage in
      packages/cli/src/ui/\*_/_.tsx
- [ ] T084 [US4] Categorize ink-spinner as UI dependency with usage in UI
      components
- [ ] T085 [US4] Categorize highlight.js as UI dependency with usage in code
      display
- [ ] T086 [US4] Identify shared dependencies using criteria: dependency is
      imported in both packages/core and packages/cli, or used in both UI
      components and backend logic files, or serves configuration/validation
      purposes used by both layers (e.g., zod, dotenv)
- [ ] T087 [US4] Document rationale for each dependency categorization
- [ ] T088 [US4] Create dependencies.md with categorized list in
      specs/001-codebase-architecture-analysis/analysis/dependencies.md
- [ ] T089 [US4] Document usage locations for each dependency in
      specs/001-codebase-architecture-analysis/analysis/dependencies.md
- [ ] T103 [US4] Document edge cases discovered during dependency analysis
      (dependencies with unclear categorization, version conflicts) in
      specs/001-codebase-architecture-analysis/analysis/edge-cases.md

**Checkpoint**: At this point, all dependencies should be categorized. Can
verify by reviewing dependencies.md and confirming each dependency has category
(UI/logic/shared), usage locations, and essential status.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Finalize documentation, verify completeness, and create summary

- [ ] T090 [P] Create summary document in
      specs/001-codebase-architecture-analysis/analysis/SUMMARY.md
- [ ] T091 [P] Verify all backend components have file paths AND
      function/class/method names in
      specs/001-codebase-architecture-analysis/analysis/backend-components.md
      (each entry must include both file path and function name)
- [ ] T092 [P] Verify all frontend components have file paths AND
      component/function names in
      specs/001-codebase-architecture-analysis/analysis/frontend-components.md
      (each entry must include both file path and component/function name)
- [ ] T093 [P] Verify data flow is complete from input to output in
      specs/001-codebase-architecture-analysis/analysis/data-flow.md
- [ ] T094 [P] Verify all dependencies are categorized in
      specs/001-codebase-architecture-analysis/analysis/dependencies.md
- [ ] T095 Verify component relationships are documented comprehensively in
      specs/001-codebase-architecture-analysis/analysis/component-relationships.md
      including all relationship types (backend-to-backend, frontend-to-backend,
      frontend-to-frontend, shared)
- [ ] T096 Create component map index linking all analysis documents in
      specs/001-codebase-architecture-analysis/analysis/README.md
- [ ] T097 Conduct 5-minute location test: Have developer unfamiliar with
      codebase locate 3 random components using documentation and verify
      completion within 5 minutes per component
- [ ] T098 Consolidate and review all edge cases documented across user story
      phases in specs/001-codebase-architecture-analysis/analysis/edge-cases.md
- [ ] T099 Run quickstart.md validation to ensure analysis methodology is
      documented

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user
  story analysis
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  (entry points must be identified first)
  - User stories can proceed in parallel (if multiple analysts)
  - Or sequentially in priority order (US1 P1 → US2 P2 → US3 P2 → US4 P3)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No
  dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent
  analysis, can run parallel with US1
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - May reference
  components from US1/US2 but analysis is independent
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - Independent
  dependency analysis

### Within Each User Story

- Component identification before documentation
- File path verification before documenting
- Component relationships documented after component identification
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if
  multiple analysts)
- Component identification tasks within a story marked [P] can run in parallel
- Different user stories can be analyzed in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all parallel component identification tasks together:
Task: "Identify content generator configuration in packages/core/src/core/contentGenerator.ts"
Task: "Document createContentGeneratorConfig() function in packages/core/src/core/contentGenerator.ts"
Task: "Document createContentGenerator() function in packages/core/src/core/contentGenerator.ts"
```

---

## Parallel Example: User Story 2

```bash
# Launch all parallel output formatting component identification together:
Task: "Identify output formatting components in packages/cli/src/ui/utils/MarkdownDisplay.tsx"
Task: "Identify ToolResultDisplay component in packages/cli/src/ui/components/messages/ToolResultDisplay.tsx"
Task: "Identify AnsiOutput component for color coding in packages/cli/src/ui/components/AnsiOutput.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all analysis)
3. Complete Phase 3: User Story 1 (Backend Components)
4. **STOP and VALIDATE**: Verify all backend components are documented
5. Review and refine documentation

### Incremental Delivery

1. Complete Setup + Foundational → Entry points identified
2. Add User Story 1 → Backend components documented → Review (MVP!)
3. Add User Story 2 → Frontend components documented → Review
4. Add User Story 3 → Data flow documented → Review
5. Add User Story 4 → Dependencies categorized → Review
6. Each story adds value without breaking previous documentation

### Parallel Team Strategy

With multiple analysts:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Analyst A: User Story 1 (Backend Components)
   - Analyst B: User Story 2 (Frontend Components)
   - Analyst C: User Story 3 (Data Flow)
   - Analyst D: User Story 4 (Dependencies)
3. Stories complete and document independently
4. Polish phase consolidates all findings

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and verifiable
- Verify file paths exist before documenting
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, missing file paths, incomplete component identification
- This is documentation/analysis - no code implementation required
- All tasks focus on identifying, tracing, and documenting existing code
