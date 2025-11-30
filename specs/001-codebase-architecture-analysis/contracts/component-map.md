# Component Map Contract

**Created**: 2025-11-30  
**Feature**: [spec.md](../spec.md)

## Component Identification Contract

### What Makes a Component Identifiable?

A component is identifiable if it meets these criteria:

1. **Has a clear file location**: File path is unambiguous
2. **Has a named function/class**: Not anonymous or inline
3. **Has a single responsibility**: One clear purpose
4. **Is importable/exportable**: Can be referenced by other code

### Identification Format

```typescript
interface ComponentIdentifier {
  filePath: string; // Relative from repo root
  functionName: string; // Function/class/method name
  lineRange?: [number, number]; // Optional: specific lines
  exportType: 'function' | 'class' | 'interface' | 'type' | 'const';
}
```

---

## Categorization Contract

### Backend vs Frontend Criteria

**Backend Component** (🟢) if:

- Handles authentication or authorization
- Constructs API payloads or requests
- Makes HTTP/network calls
- Parses API responses
- Processes or transforms data
- Manages business logic
- Handles state management (non-UI state)

**Frontend Component** (🔴) if:

- Handles user input (keyboard, mouse, CLI commands)
- Formats or displays output (colors, layout, markdown)
- Renders UI elements (React components, terminal widgets)
- Manages UI state (display state, view state)
- Handles navigation or menus
- Provides user interaction handlers

**Shared Component** (🟡) if:

- Used by both backend and frontend
- Needs analysis to determine if it can be split
- Examples: Configuration, error handling, logging (if format-agnostic)

### Categorization Decision Tree

```
Is it used for user interaction or display?
├─ Yes → Frontend (🔴)
└─ No → Does it handle API calls or data processing?
    ├─ Yes → Backend (🟢)
    └─ No → Shared (🟡) - needs further analysis
```

---

## Data Flow Contract

### Transformation Stage Requirements

Each data flow step must document:

1. **Input**: Data structure/type before transformation
2. **Transformation**: What changes (format, structure, content)
3. **Output**: Data structure/type after transformation
4. **Component**: Which component performs the transformation
5. **Location**: File path where transformation occurs

### Data Flow Format

```typescript
interface DataFlowStep {
  stepNumber: number;
  stepName: string;
  inputFormat: string; // e.g., "string", "PartListUnion"
  transformationLogic: string; // Description of what happens
  outputFormat: string; // e.g., "GenerateContentConfig"
  componentResponsible: string; // Function/class name
  filePath: string; // Where it happens
  dependencies: string[]; // Other components used
}
```

### Complete Flow Example

```
Step 1: Raw Input
  Input: string (user types in terminal)
  Output: string (sanitized)
  Component: InputPrompt, InputHandler
  Location: packages/cli/src/ui/components/InputPrompt.tsx

Step 2: Command Parsing
  Input: string
  Output: ParsedCommand | PartListUnion
  Component: parseSlashCommand, handleAtCommand
  Location: packages/cli/src/ui/hooks/slashCommandProcessor.ts

Step 3: Query Preparation
  Input: PartListUnion
  Output: PartListUnion (processed)
  Component: prepareQueryForGemini
  Location: packages/cli/src/ui/hooks/useGeminiStream.ts

Step 4: Payload Construction
  Input: PartListUnion
  Output: GenerateContentConfig
  Component: makeApiCallAndProcessStream
  Location: packages/core/src/core/geminiChat.ts

Step 5: HTTP Request
  Input: GenerateContentConfig
  Output: GenerateContentResponse (stream)
  Component: generateContentStream
  Location: packages/core/src/core/contentGenerator.ts

Step 6: Response Parsing
  Input: GenerateContentResponse
  Output: string (text content)
  Component: processStreamResponse, getResponseText
  Location: packages/core/src/core/geminiChat.ts

Step 7: Output Formatting
  Input: string
  Output: FormattedOutput (with colors, markdown)
  Component: MarkdownDisplay, ToolResultDisplay
  Location: packages/cli/src/ui/utils/MarkdownDisplay.tsx
```

---

## Dependency Categorization Contract

### UI vs Logic Classification

**UI Dependency** (🔴 - Removable) if:

- Only imported in UI/presentation files
- Used for rendering, formatting, or display
- Examples: `ink`, `react`, `chalk`, `ora`, `highlight.js`

**Logic Dependency** (🟢 - Essential) if:

- Used in backend/core logic
- Required for API communication or data processing
- Examples: `@google/genai`, `google-auth-library`, `undici`

**Shared Dependency** (🟡 - Analyze) if:

- Used in both UI and logic
- May need to be kept or split
- Examples: `zod` (validation), `dotenv` (config)

### Dependency Analysis Format

```typescript
interface DependencyAnalysis {
  name: string;
  version: string;
  category: 'ui' | 'logic' | 'shared';
  usageLocations: string[]; // Files that import it
  essential: boolean;
  rationale: string;
  canRemove: boolean; // true for UI, false for logic
}
```

---

## Component Relationship Contract

### Dependency Graph Rules

1. **Backend components** can depend on other backend components
2. **Frontend components** can depend on backend components (for data)
3. **Frontend components** can depend on other frontend components
4. **Backend components** should NOT depend on frontend components (violation if
   found)
5. **Shared components** can be used by both, but should be analyzed for
   splitting

### Relationship Documentation

```typescript
interface ComponentRelationship {
  from: ComponentIdentifier;
  to: ComponentIdentifier;
  relationshipType: 'depends-on' | 'uses' | 'imports' | 'calls';
  direction: 'one-way' | 'bidirectional';
  critical: boolean; // Is this relationship critical for functionality?
}
```

---

## Validation Rules

1. All backend components must have `preserve: true`
2. All frontend components must have `preserve: false`
3. Data flow steps must be sequential (no gaps)
4. Each step must reference a valid component
5. Dependencies must match their usage pattern
6. No circular dependencies between backend and frontend (if found, document as
   violation)

---

## Edge Cases

### Dual-Purpose Components

If a component serves both UI and logic:

- Document both responsibilities
- Mark as 🟡 Shared
- Suggest separation strategy
- Note which parts are UI vs logic

### Embedded Logic in UI

If authentication/logic is embedded in UI:

- Document the coupling
- Mark as violation of separation
- Suggest refactoring approach
- Note risk level

### Unclear Categorization

If component doesn't clearly fit:

- Mark as "needs further analysis"
- Document reasoning
- Suggest investigation approach
- Note in edge cases section
