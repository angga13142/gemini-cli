# Data Model: Codebase Architecture Analysis

**Created**: 2025-11-30  
**Feature**: [spec.md](./spec.md)

## Entities

### BackendComponent

Represents a piece of backend logic that must be preserved during refactoring.

**Attributes**:

- `filePath`: string - Absolute or relative path to file containing component
- `functionName`: string - Name of function/class/method
- `responsibility`: string - What this component does (e.g., "API key
  authentication", "Payload construction")
- `dependencies`: string[] - Other components this depends on
- `category`: "authentication" | "api-payload" | "http-request" |
  "response-parsing" | "data-processing"
- `preserve`: boolean - Always true for backend components

**Relationships**:

- Depends on: Other BackendComponents, FrontendComponents (if shared)
- Used by: FrontendComponents, DataFlowSteps

**Examples**:

```typescript
{
  filePath: "packages/core/src/core/apiKeyCredentialStorage.ts",
  functionName: "loadApiKey",
  responsibility: "Load API key from secure storage",
  dependencies: ["HybridTokenStorage"],
  category: "authentication",
  preserve: true
}
```

---

### FrontendComponent

Represents a piece of UI logic that can be replaced during refactoring.

**Attributes**:

- `filePath`: string - Absolute or relative path to file
- `functionName`: string - Name of function/component
- `uiResponsibility`: string - UI function (e.g., "Input parsing", "Markdown
  rendering")
- `replaceability`: "high" | "medium" | "low" - How easily this can be replaced
- `dependencies`: string[] - Other components this depends on
- `category`: "input-handling" | "output-formatting" | "navigation" | "display"
- `preserve`: boolean - Always false for frontend components

**Relationships**:

- Depends on: BackendComponents (for data), Other FrontendComponents
- Used by: DataFlowSteps (for input/output stages)

**Examples**:

```typescript
{
  filePath: "packages/cli/src/ui/components/InputPrompt.tsx",
  functionName: "InputPrompt",
  uiResponsibility: "User input collection and display",
  replaceability: "high",
  dependencies: ["useGeminiStream"],
  category: "input-handling",
  preserve: false
}
```

---

### DataFlowStep

Represents a transformation stage in the data flow pipeline.

**Attributes**:

- `stepNumber`: number - Order in the flow (1, 2, 3...)
- `stepName`: string - Name of transformation step
- `inputFormat`: string - Data structure/type at input
- `transformationLogic`: string - What transformation occurs
- `outputFormat`: string - Data structure/type at output
- `componentResponsible`: string - Component performing transformation
- `filePath`: string - Where transformation occurs

**Relationships**:

- Preceded by: DataFlowStep (previous step)
- Followed by: DataFlowStep (next step)
- Uses: BackendComponent or FrontendComponent

**Examples**:

```typescript
{
  stepNumber: 3,
  stepName: "Query Preparation",
  inputFormat: "string (user input)",
  transformationLogic: "Parse @commands, handle slash commands, convert to PartListUnion",
  outputFormat: "PartListUnion (array of Part objects)",
  componentResponsible: "handleAtCommand, prepareQueryForGemini",
  filePath: "packages/cli/src/ui/hooks/atCommandProcessor.ts"
}
```

---

### Dependency

Represents a library or package used by the application.

**Attributes**:

- `name`: string - Package name
- `version`: string - Version or version range
- `category`: "ui" | "logic" | "shared" | "dev"
- `usageLocations`: string[] - Files/packages that import this
- `essential`: boolean - Must be preserved (true for logic, false for UI)
- `rationale`: string - Why categorized this way

**Relationships**:

- Used by: BackendComponents, FrontendComponents
- Replaces: Other Dependencies (if UI dependency can be replaced)

**Examples**:

```typescript
{
  name: "@google/genai",
  version: "1.30.0",
  category: "logic",
  usageLocations: ["packages/core/src/core/contentGenerator.ts"],
  essential: true,
  rationale: "Core library for Gemini API interaction, required for backend functionality"
}
```

```typescript
{
  name: "ink",
  version: "npm:@jrichman/ink@6.4.6",
  category: "ui",
  usageLocations: ["packages/cli/src/ui/**/*.tsx"],
  essential: false,
  rationale: "React-based CLI UI library, only used for terminal rendering, can be replaced"
}
```

---

## State Transitions

### Component Identification Process

```
[Entry Point]
  → [Code Tracing]
  → [Tagging]
  → [Categorization]
  → [Documentation]
```

### Data Flow Pipeline

```
[Raw User Input: string]
  → [Sanitized Input: string]
  → [Parsed Command: ParsedCommand]
  → [Query Parts: PartListUnion]
  → [API Payload: GenerateContentConfig]
  → [HTTP Request]
  → [API Response: GenerateContentResponse]
  → [Parsed Response: string]
  → [Formatted Output: FormattedOutput]
```

---

## Validation Rules

1. **BackendComponent**: Must have `preserve: true` and category from backend
   categories
2. **FrontendComponent**: Must have `preserve: false` and category from frontend
   categories
3. **DataFlowStep**: `stepNumber` must be sequential, `componentResponsible`
   must reference existing component
4. **Dependency**: `category` must match usage pattern (if used only in UI,
   category should be "ui")

---

## Relationships Summary

```
BackendComponent ──depends on──> BackendComponent
BackendComponent ──used by──> FrontendComponent
FrontendComponent ──depends on──> BackendComponent
FrontendComponent ──depends on──> FrontendComponent
DataFlowStep ──uses──> BackendComponent | FrontendComponent
Dependency ──used by──> BackendComponent | FrontendComponent
```

---

## Key Insights

1. **Clear Separation**: Backend components in `packages/core`, Frontend in
   `packages/cli/src/ui`
2. **Shared Dependencies**: Some dependencies (zod, dotenv) used by both - need
   careful analysis
3. **Data Flow**: Linear pipeline with clear transformation stages
4. **Replaceability**: High for UI components, zero for backend components
