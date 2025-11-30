# Data Flow Analysis

**Created**: 2025-11-30  
**Purpose**: Document complete data flow from user input through all
transformation stages to final formatted output

## Sample Input

_[To be chosen following criteria: must include @command, slash command, plain
text, typical workflow]_

Example: `"Explain this code @src/main.ts"`

## Data Flow Pipeline

### Step 1: Raw Input Collection

- **Input Format**: `string` (user types in terminal)
- **Component**: `InputPrompt` in
  `packages/cli/src/ui/components/InputPrompt.tsx`
- **Transformation**: User keyboard input → string
- **Output Format**: `string` (sanitized user input)
- **File Path**: `packages/cli/src/ui/components/InputPrompt.tsx`

---

### Step 2: Command Parsing

- **Input Format**: `string` (sanitized user input)
- **Component**: `parseSlashCommand()` in `packages/cli/src/utils/commands.ts`
- **Transformation**: string → `ParsedCommand` | `PartListUnion`
- **Output Format**: `ParsedCommand` or `PartListUnion`
- **File Path**: `packages/cli/src/utils/commands.ts`

---

### Step 3: @Command Processing

- **Input Format**: `string` (with @commands)
- **Component**: `handleAtCommand()` in
  `packages/cli/src/ui/hooks/atCommandProcessor.ts`
- **Transformation**: string → `PartListUnion` (with file content included)
- **Output Format**: `PartListUnion` (array of Part objects)
- **File Path**: `packages/cli/src/ui/hooks/atCommandProcessor.ts`

---

### Step 4: Query Preparation

- **Input Format**: `PartListUnion` (processed)
- **Component**: `prepareQueryForGemini()` in
  `packages/cli/src/ui/hooks/useGeminiStream.ts`
- **Transformation**: `PartListUnion` → `PartListUnion` (finalized for API)
- **Output Format**: `PartListUnion` (ready for API)
- **File Path**: `packages/cli/src/ui/hooks/useGeminiStream.ts`

---

### Step 5: Payload Construction

- **Input Format**: `PartListUnion` (ready for API)
- **Component**: `makeApiCallAndProcessStream()` in
  `packages/core/src/core/geminiChat.ts`
- **Transformation**: `PartListUnion` → `GenerateContentConfig`
- **Output Format**: `GenerateContentConfig` (API request configuration)
- **File Path**: `packages/core/src/core/geminiChat.ts`

---

### Step 6: HTTP Request

- **Input Format**: `GenerateContentConfig`
- **Component**: `generateContentStream()` in
  `packages/core/src/core/contentGenerator.ts`
- **Transformation**: `GenerateContentConfig` → HTTP Request →
  `GenerateContentResponse` (stream)
- **Output Format**: `AsyncGenerator<GenerateContentResponse>`
- **File Path**: `packages/core/src/core/contentGenerator.ts`

---

### Step 7: Response Parsing

- **Input Format**: `GenerateContentResponse` (stream)
- **Component**: `processStreamResponse()` in
  `packages/core/src/core/geminiChat.ts`
- **Transformation**: `GenerateContentResponse` → `string` (text content)
- **Output Format**: `string` (extracted text from response)
- **File Path**: `packages/core/src/core/geminiChat.ts`

---

### Step 8: Output Formatting

- **Input Format**: `string` (text content)
- **Component**: `MarkdownDisplay` in
  `packages/cli/src/ui/utils/MarkdownDisplay.tsx`
- **Transformation**: `string` → `FormattedOutput` (with colors, markdown
  rendering)
- **Output Format**: `FormattedOutput` (formatted for terminal display)
- **File Path**: `packages/cli/src/ui/utils/MarkdownDisplay.tsx`

---

## Data Structures

_[To be documented with TypeScript types during analysis]_

## Complete Flow Diagram

```
[Raw User Input: string]
    ↓
[Sanitized Input: string]
    ↓
[Parsed Command: ParsedCommand | PartListUnion]
    ↓
[Query Parts: PartListUnion]
    ↓
[API Payload: GenerateContentConfig]
    ↓
[HTTP Request]
    ↓
[API Response: GenerateContentResponse (stream)]
    ↓
[Parsed Response: string]
    ↓
[Formatted Output: FormattedOutput]
```

## Notes

- Each step transforms data from one format to another
- Components responsible for each transformation are documented
- File paths allow quick location of transformation logic
