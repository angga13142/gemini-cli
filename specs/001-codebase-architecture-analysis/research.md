# Research: Codebase Architecture Analysis Methodology

**Created**: 2025-11-30  
**Feature**: [spec.md](./spec.md)

## Research Questions & Decisions

### RQ1: How to Identify CLI Entry Points?

**Research**: CLI applications in Node.js/TypeScript typically define entry
points in:

- `package.json` `bin` field (executable commands)
- `package.json` `main` field (main module)
- CLI argument parsers (yargs, commander, etc.)
- Initialization files (index.ts, main.ts, gemini.tsx)

**Decision**:

- Check `package.json` bin field: `"gemini": "bundle/gemini.js"`
- Trace from bundle entry to source: `packages/cli/src/gemini.tsx`
- Identify `main()` function as primary entry point
- Document all entry points including non-interactive CLI entry

**Rationale**: Entry points are the starting point for code tracing. Multiple
entry points (interactive vs non-interactive) need to be identified separately.

**Alternatives Considered**:

- Only checking `bin` field: Rejected - misses non-interactive entry points
- Manual search for `main()` functions: Rejected - too time-consuming, may miss
  entry points

---

### RQ2: Code Tracing Methodology

**Research**: Best practices for static code analysis:

- Follow function calls from entry point
- Use dependency graphs
- Tag components during traversal
- Document call chains

**Decision**: Use "Trace & Tag" methodology:

1. Start from entry point
2. Follow function calls and imports
3. Tag each component as:
   - 🔴 Frontend (UI, display, formatting)
   - 🟢 Backend (logic, API, data processing)
   - 🟡 Shared (used by both)
4. Create dependency graph
5. Document call chains

**Rationale**: Systematic approach ensures no components are missed. Color
coding makes categorization visual and clear.

**Alternatives Considered**:

- Automated dependency analysis tools: Considered but requires additional setup
- Manual file-by-file review: Rejected - too slow and error-prone

---

### RQ3: Component Categorization Criteria

**Research**: How to distinguish backend from frontend in CLI apps:

- Backend: Data processing, business logic, API communication, state management
- Frontend: User interaction, display, formatting, navigation

**Decision**: Use these criteria:

**Backend (🟢 - Preserve)**:

- Authentication logic (API key handling, credential storage)
- API payload construction
- HTTP request handling
- Response parsing and data transformation
- Business logic and state management
- Data validation

**Frontend (🔴 - Replaceable)**:

- Input parsing and command handling
- Output formatting (colors, markdown, text layout)
- UI rendering (React/Ink components)
- Terminal display management
- User interaction handlers
- Navigation and menu systems

**Shared (🟡 - Analyze)**:

- Configuration management
- Error handling (if UI-specific vs logic-specific)
- Logging (if format-specific vs data-specific)

**Rationale**: Clear criteria prevent misclassification. Shared components need
special attention to determine if they can be split.

**Alternatives Considered**:

- Strict binary classification: Rejected - some components serve both purposes
- More granular categories: Considered but adds complexity without clear benefit

---

### RQ4: Data Flow Analysis Technique

**Research**: Techniques for documenting data transformations:

- Trace sample input through system
- Document data structures at each stage
- Map transformation functions
- Identify state changes

**Decision**: Use input-to-output tracing:

1. Start with sample user input (e.g., "Explain this code")
2. Trace through:
   - Input sanitization → `string`
   - Command parsing → `ParsedCommand`
   - Query preparation → `PartListUnion`
   - Payload construction → `GenerateContentConfig`
   - API request → `HTTP Request`
   - API response → `GenerateContentResponse`
   - Response parsing → `string` (text)
   - Output formatting → `FormattedOutput`
3. Document data structure at each step
4. Identify transformation functions

**Rationale**: Concrete example makes data flow tangible. Documenting data
structures helps understand interfaces.

**Alternatives Considered**:

- Abstract flow diagram only: Rejected - too vague, doesn't show actual data
  structures
- Multiple sample inputs: Considered but one comprehensive example is sufficient

---

### RQ5: Dependency Categorization Method

**Research**: How to categorize dependencies:

- Check import statements in code
- Review package.json dependencies
- Understand library purpose
- Check usage patterns

**Decision**: Use multi-step categorization:

1. Review `package.json` dependencies
2. Search codebase for import/require statements
3. Categorize by usage:
   - UI: Used only in UI components (ink, react, chalk, ora)
   - Logic: Used in backend (google-genai, axios, undici)
   - Shared: Used in both (zod, dotenv)
4. Document usage locations

**Rationale**: Multi-step approach ensures accuracy. Usage-based categorization
is more reliable than name-based.

**Alternatives Considered**:

- Name-based only: Rejected - misleading (e.g., "marked" could be UI or logic)
- Automated analysis: Considered but manual review ensures accuracy

---

## Methodology Summary

**Entry Point Identification**:

- Check `package.json` bin/main fields
- Trace to source files
- Document all entry points

**Code Tracing**:

- Follow function calls from entry points
- Tag components (🔴 Frontend, 🟢 Backend, 🟡 Shared)
- Create dependency graph

**Categorization**:

- Backend: Authentication, API, data processing
- Frontend: UI, formatting, display
- Shared: Analyze for separation potential

**Data Flow**:

- Trace sample input through system
- Document data structures at each stage
- Map transformation functions

**Dependencies**:

- Review package.json
- Check import statements
- Categorize by usage pattern

---

## Tools & Resources

- Codebase: Gemini CLI repository
- Search tools: grep, codebase_search, file reading
- Documentation: Existing code comments, README, architecture docs
- Analysis: Manual code review and tracing

---

## Next Steps

1. Execute entry point identification
2. Perform code tracing with tagging
3. Document data flow with sample input
4. Categorize all dependencies
5. Create component map with relationships
