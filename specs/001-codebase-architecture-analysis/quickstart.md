# Quickstart: Codebase Architecture Analysis

**Created**: 2025-11-30  
**Feature**: [spec.md](./spec.md)

## Overview

This guide provides step-by-step instructions for performing the codebase
architecture analysis to identify backend logic, frontend UI, data flow, and
dependencies.

## Prerequisites

- Access to Gemini CLI codebase
- Code reading/analysis tools (grep, code search, file browser)
- Text editor or documentation tool (Markdown editor)
- Understanding of TypeScript/JavaScript

## Step-by-Step Process

### Step 1: Identify Entry Points (15-30 minutes)

**Goal**: Find where the application starts when executed.

1. **Check package.json**:

   ```bash
   cat package.json | grep -A 5 '"bin"'
   ```
   - Look for: `"bin": { "gemini": "bundle/gemini.js" }`
   - This points to the main executable

2. **Trace to source**:
   - Find where `bundle/gemini.js` is built from
   - Check build scripts in `package.json`
   - Locate source file (likely `packages/cli/src/gemini.tsx`)

3. **Find main function**:
   - Look for `main()` or entry function
   - Document: `packages/cli/src/gemini.tsx::main()`

4. **Check for other entry points**:
   - Non-interactive CLI: `packages/cli/src/nonInteractiveCli.ts`
   - A2A server: `packages/a2a-server/src/index.ts`

**Output**: List of entry points with file paths

---

### Step 2: Static Analysis - Code Tracing (1-2 hours)

**Goal**: Trace code from entry points and tag components.

1. **Start from entry point**:
   - Open `packages/cli/src/gemini.tsx`
   - Find `main()` function
   - Follow function calls

2. **Tag components as you trace**:
   - 🔴 **Frontend**: UI, display, formatting
   - 🟢 **Backend**: API, data processing, logic
   - 🟡 **Shared**: Used by both

3. **Example tracing**:

   ```
   main()
     → startInteractiveUI()
       → AppContainer (🔴 Frontend)
         → useGeminiStream()
           → prepareQueryForGemini()
             → handleAtCommand() (🔴 Frontend - input)
           → geminiClient.sendMessageStream()
             → GeminiChat.sendMessageStream() (🟢 Backend)
               → makeApiCallAndProcessStream()
                 → generateContentStream() (🟢 Backend)
   ```

4. **Create dependency graph**:
   - Document which components call which
   - Note dependencies between frontend and backend

**Output**: Tagged component list with file paths and relationships

---

### Step 3: Dynamic Analysis - Data Flow (1 hour)

**Goal**: Trace a sample input through the system to understand data
transformations.

1. **Choose sample input**:

   ```
   User types: "Explain this code @src/main.ts"
   ```

2. **Trace through system**:
   - **Step 1**: Raw input → `string: "Explain this code @src/main.ts"`
   - **Step 2**: Input parsing → `ParsedCommand` (slash command check)
   - **Step 3**: @command processing → `handleAtCommand()` reads file
   - **Step 4**: Query preparation → `PartListUnion` with file content
   - **Step 5**: Payload construction → `GenerateContentConfig`
   - **Step 6**: HTTP request → API call to Gemini
   - **Step 7**: Response parsing → `GenerateContentResponse` → `string`
   - **Step 8**: Output formatting → Markdown rendering → Display

3. **Document each step**:
   - Input format
   - Transformation
   - Output format
   - Component responsible
   - File location

**Output**: Complete data flow diagram with data structures

---

### Step 4: Component Categorization (1-2 hours)

**Goal**: Categorize all identified components as backend or frontend.

1. **Review tagged components**:
   - Go through your tagged list
   - Verify categorization

2. **Backend components** (🟢 - Preserve):
   - Authentication: `packages/core/src/core/apiKeyCredentialStorage.ts`
   - API interaction: `packages/core/src/core/geminiChat.ts`
   - Content generation: `packages/core/src/core/contentGenerator.ts`
   - Response parsing: `packages/core/src/core/turn.ts`

3. **Frontend components** (🔴 - Replaceable):
   - Input: `packages/cli/src/ui/components/InputPrompt.tsx`
   - Output: `packages/cli/src/ui/utils/MarkdownDisplay.tsx`
   - Navigation: `packages/cli/src/ui/AppContainer.tsx`

4. **Shared components** (🟡 - Analyze):
   - Configuration: `packages/cli/src/config/config.ts`
   - Error handling: Check if UI-specific or logic-specific

**Output**: Categorized component list with file paths

---

### Step 5: Dependency Analysis (30 minutes)

**Goal**: Categorize dependencies as UI-related or logic-related.

1. **Review package.json files**:

   ```bash
   cat packages/core/package.json | grep -A 50 '"dependencies"'
   cat packages/cli/package.json | grep -A 50 '"dependencies"'
   ```

2. **Search for imports**:

   ```bash
   # Find where a dependency is used
   grep -r "@google/genai" packages/
   grep -r "ink" packages/cli/
   ```

3. **Categorize**:
   - **UI**: `ink`, `react`, `ink-spinner`, `highlight.js` → Used only in UI
   - **Logic**: `@google/genai`, `google-auth-library`, `undici` → Used in core
   - **Shared**: `zod`, `dotenv` → Used in both

4. **Document rationale**:
   - Why categorized this way
   - Where it's used
   - Can it be removed? (UI: yes, Logic: no)

**Output**: Categorized dependency list with usage locations

---

### Step 6: Create Component Map (1 hour)

**Goal**: Create comprehensive documentation of all findings.

1. **Backend Component Map**:
   - List all 🟢 components
   - File paths, function names, responsibilities
   - Dependencies between components

2. **Frontend Component Map**:
   - List all 🔴 components
   - File paths, function names, UI responsibilities
   - Replaceability assessment

3. **Data Flow Diagram**:
   - Visual/text representation of data flow
   - All transformation steps
   - Data structures at each stage

4. **Dependency Catalog**:
   - UI dependencies (removable)
   - Logic dependencies (essential)
   - Shared dependencies (analyze)

**Output**: Complete component map documentation

---

## Verification Checklist

- [ ] All entry points identified
- [ ] All components tagged (🔴/🟢/🟡)
- [ ] Data flow traced with sample input
- [ ] All dependencies categorized
- [ ] Component relationships documented
- [ ] File paths verified (components can be located)
- [ ] No critical components missed

---

## Common Pitfalls

1. **Missing shared components**: Don't forget components used by both
2. **Incorrect categorization**: Verify by checking actual usage, not just file
   location
3. **Incomplete data flow**: Make sure to trace all the way from input to output
4. **Outdated file paths**: Verify paths exist in current codebase
5. **Missing dependencies**: Check all package.json files, not just root

---

## Tools & Commands

```bash
# Find entry points
grep -r "main()" packages/cli/src/

# Search for imports
grep -r "from '@google/genai'" packages/

# Find component usage
grep -r "useGeminiStream" packages/

# Check dependencies
cat packages/*/package.json | grep -A 20 '"dependencies"'
```

---

## Next Steps

After completing analysis:

1. Review findings with team
2. Validate component categorization
3. Use documentation for refactoring planning
4. Update documentation as codebase evolves
