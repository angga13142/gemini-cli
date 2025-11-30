# Data Flow Analysis

**Created**: 2025-11-30  
**Last Updated**: 2025-01-27 (Post Phase 3.2 Refactoring)  
**Purpose**: Document complete data flow from user input through all
transformation stages to final formatted output

## ⚠️ Update Notice

This document has been updated to reflect changes after Phase 3.2 refactoring
(Backend-Frontend Separation). The data flow now uses backend services:

- Step 2: `parseSlashCommand` from `SlashCommandService` (backend)
- Step 3: `parseAllAtCommands`, `resolveAtCommandPaths` from `AtCommandService`
  (backend)
- Step 6: API calls use `ApiService.sendMessageStreamWithEvents()` (backend)

## Sample Input

**Chosen Input**: `"Explain this code @src/main.ts"`

**Rationale**: This input meets all criteria:

- ✅ **@command**: `@src/main.ts` - file inclusion command
- ✅ **Plain text query**: `"Explain this code"` - natural language query
- ✅ **Typical workflow**: Represents common user scenario of asking about code
  with file reference

**Note**: While this example doesn't include a slash command, slash commands
(e.g., `/help`, `/clear`) are handled separately in Step 2 and don't proceed
through the full data flow pipeline. They are executed directly by
`handleSlashCommand()` and don't reach the API.

## Data Flow Pipeline

### Step 1: Raw Input Collection

- **Input Format**: `string` (user types in terminal)
  - Example: `"Explain this code @src/main.ts"`
- **Component**: `InputPrompt` component in
  `packages/cli/src/ui/components/InputPrompt.tsx`
- **Transformation**:
  - User keyboard input → captured as string
  - Handles keyboard events, history navigation, autocomplete
  - Trims whitespace: `query.trim()`
- **Output Format**: `string` (sanitized user input)
  - TypeScript: `string`
  - Example: `"Explain this code @src/main.ts"` (trimmed)
- **File Path**: `packages/cli/src/ui/components/InputPrompt.tsx`
- **Key Function**: `handleSubmit()` → calls `onSubmit(trimmedMessage)`

---

### Step 2: Command Parsing

- **Input Format**: `string` (sanitized user input)
  - Example: `"Explain this code @src/main.ts"`
- **Component**: `parseSlashCommand()` from `SlashCommandService` in
  `packages/core/src/core/api/slashCommandService.ts`
- **Transformation**:
  - Checks if input starts with `/` (slash command)
  - If slash command: parses into `ParsedSlashCommand` with `commandToExecute`,
    `args`, `canonicalPath`
  - If not slash command: passes through unchanged
  - **Note**: Slash commands are handled separately and don't proceed to API
- **Output Format**: `ParsedSlashCommand | string`
  - TypeScript:
    ```typescript
    type ParsedSlashCommand = {
      commandToExecute: SlashCommand | undefined;
      args: string;
      canonicalPath: string[];
    };
    ```
  - For non-slash commands: returns original `string`
- **File Path**: `packages/core/src/core/api/slashCommandService.ts` (backend
  service)
- **Key Function**:
  `parseSlashCommand(query: string, commands: readonly CommandForParsing[]): ParsedSlashCommand`
- **Note**: This is now a backend service, called from frontend via
  `handleSlashCommand()`

---

### Step 3: @Command Processing

- **Input Format**: `string` (with @commands)
  - Example: `"Explain this code @src/main.ts"`
- **Component**: `handleAtCommand()` in
  `packages/cli/src/ui/hooks/atCommandProcessor.ts` (uses `AtCommandService`
  from backend)
- **Backend Service**: `AtCommandService` in
  `packages/core/src/core/api/atCommandService.ts`
- **Transformation**:
  - Parses `@path` commands using `AtCommandService.parseAllAtCommands()`
    (backend)
  - Resolves file paths using `AtCommandService.resolveAtCommandPaths()`
    (backend)
  - Reads file content using `ReadManyFilesTool`
  - Combines text query with file content into structured `PartListUnion`
  - Handles file filtering (git ignore, gemini ignore)
  - Returns `{ processedQuery: PartListUnion | null, shouldProceed: boolean }`
- **Output Format**: `PartListUnion` (array of Part objects)
  - TypeScript:
    ```typescript
    type PartListUnion = string | Part | PartUnion | PartUnion[];
    type PartUnion = Part | { text: string } | { fileData: FileData } | ...;
    ```
  - Example structure:
    ```typescript
    [
      { text: 'Explain this code ' },
      { fileData: { mimeType: 'text/plain', fileUri: 'src/main.ts' } },
    ];
    ```
- **File Path**:
  - Frontend: `packages/cli/src/ui/hooks/atCommandProcessor.ts`
  - Backend Service: `packages/core/src/core/api/atCommandService.ts`
- **Key Functions**:
  - Frontend:
    `handleAtCommand(params: HandleAtCommandParams): Promise<HandleAtCommandResult>`
  - Backend: `parseAllAtCommands(query: string): ParsedAtCommand[]`,
    `resolveAtCommandPaths(commands: ParsedAtCommand[], config: Config): Promise<ResolvedAtCommandPaths>`

---

### Step 4: Query Preparation

- **Input Format**: `PartListUnion` (processed from Step 3)
  - Example: `[{ text: "Explain this code " }, { fileData: {...} }]`
- **Component**: `prepareQueryForGemini()` in
  `packages/cli/src/ui/hooks/useGeminiStream.ts`
- **Transformation**:
  - Handles slash commands (returns early if slash command)
  - Processes @commands via `handleAtCommand()` if detected
  - Handles shell commands if in shell mode
  - Validates query is not empty
  - Returns `{ queryToSend: PartListUnion | null, shouldProceed: boolean }`
- **Output Format**: `PartListUnion` (ready for API)
  - TypeScript: `PartListUnion` (same type as input, but validated and
    processed)
  - Example: `[{ text: "Explain this code " }, { fileData: {...} }]` (validated)
- **File Path**: `packages/cli/src/ui/hooks/useGeminiStream.ts`
- **Key Function**:
  `prepareQueryForGemini(query: PartListUnion, ...): Promise<{ queryToSend: PartListUnion | null, shouldProceed: boolean }>`

---

### Step 5: Payload Construction

- **Input Format**: `PartListUnion` (ready for API from Step 4)
  - Example: `[{ text: "Explain this code " }, { fileData: {...} }]`
- **Component**: `makeApiCallAndProcessStream()` in
  `packages/core/src/core/geminiChat.ts`
- **Transformation**:
  - Converts `PartListUnion` to `Content` using `createUserContent(message)`
  - Adds to chat history: `this.history.push(userContent)`
  - Gets curated history: `this.getHistory(true)`
  - Constructs `GenerateContentParameters` with:
    - `model`: string (e.g., "gemini-2.0-flash-exp")
    - `contents`: `Content[]` (history + current message)
    - `config`: `GenerateContentConfig` (system instruction, tools, temperature,
      etc.)
- **Output Format**: `GenerateContentParameters` (API request configuration)
  - TypeScript:
    ```typescript
    type GenerateContentParameters = {
      model: string;
      contents: Content[];
      config: GenerateContentConfig;
    };
    type Content = {
      role: 'user' | 'model';
      parts: Part[];
    };
    ```
- **File Path**: `packages/core/src/core/geminiChat.ts`
- **Key Function**:
  `makeApiCallAndProcessStream(model: string, generateContentConfig: GenerateContentConfig, requestContents: Content[], prompt_id: string): Promise<AsyncGenerator<GenerateContentResponse>>`

---

### Step 6: HTTP Request

- **Input Format**: `PartListUnion` (from Step 4) or `ApiRequest` (structured
  request)
  - Contains:
    `{ message: PartListUnion, config?: GenerateContentConfig, metadata?: Record<string, unknown> }`
- **Component**: `ApiService.sendMessageStreamWithEvents()` in
  `packages/core/src/core/api/apiService.ts` (backend service)
- **Internal Component**: `ContentGenerator.generateContentStream()` in
  `packages/core/src/core/contentGenerator.ts` (called by ApiService)
- **Transformation**:
  - ApiService wraps GeminiClient and provides clean interface
  - Makes HTTP POST request to Gemini API endpoint via GeminiClient
  - Uses `GoogleGenAI.models.generateContentStream()`
  - Sends request with authentication headers (API key or OAuth token)
  - Receives streaming response chunks
  - Converts `ServerGeminiStreamEvent` to `ResponseChunk` (for simple API calls)
    or returns full event stream
- **Output Format**: `AsyncGenerator<ServerGeminiStreamEvent>` (full event
  stream) or `AsyncGenerator<ResponseChunk>` (simplified)
  - TypeScript:

    ```typescript
    // Full event stream (for complex UI interactions)
    type ServerGeminiStreamEvent =
      | ServerGeminiContentEvent
      | ServerGeminiFinishedEvent
      | ServerGeminiToolCallRequestEvent
      | ...;

    // Simplified chunks (for simple API calls)
    type ResponseChunk = {
      text: string;
      isComplete: boolean;
      metadata?: Partial<ResponseMetadata>;
    };
    ```

  - Each chunk contains partial response data

- **File Path**:
  - Backend Service: `packages/core/src/core/api/apiService.ts`
  - Internal: `packages/core/src/core/contentGenerator.ts`
- **Key Functions**:
  - `ApiServiceImpl.sendMessageStreamWithEvents(request: PartListUnion, signal: AbortSignal, promptId: string): AsyncGenerator<ServerGeminiStreamEvent>`
  - `ContentGenerator.generateContentStream(request: GenerateContentParameters, userPromptId: string): Promise<AsyncGenerator<GenerateContentResponse>>`

---

### Step 7: Response Parsing

- **Input Format**: `AsyncGenerator<GenerateContentResponse>` (streaming
  response from Step 6)
  - Each chunk: `GenerateContentResponse` with partial content
- **Component**: `processStreamResponse()` in
  `packages/core/src/core/geminiChat.ts`
- **Transformation**:
  - Iterates through streaming chunks:
    `for await (const chunk of streamResponse)`
  - Extracts text parts: `content.parts.filter((part) => part.text)`
  - Filters out thoughts: `content.parts.filter((part) => !part.thought)`
  - Consolidates text parts (merges consecutive text parts)
  - Yields each chunk immediately for UI streaming
  - Records token usage from `chunk.usageMetadata`
  - Final output: consolidated text string from all parts
- **Output Format**: `string` (extracted text content)
  - TypeScript: `string`
  - Example: `"This code implements a function that..."` (full response text)
  - Also yields: `AsyncGenerator<GenerateContentResponse>` (for streaming to UI)
- **File Path**: `packages/core/src/core/geminiChat.ts`
- **Key Function**:
  `processStreamResponse(model: string, streamResponse: AsyncGenerator<GenerateContentResponse>, originalRequest: GenerateContentParameters): AsyncGenerator<GenerateContentResponse>`

---

### Step 8: Output Formatting

- **Input Format**: `string` (text content from Step 7)
  - Example:
    `"This code implements a function that...\n\n## Explanation\n\n..."`
    (markdown text)
- **Component**: `MarkdownDisplay` component in
  `packages/cli/src/ui/utils/MarkdownDisplay.tsx`
- **Transformation**:
  - Parses markdown: headers, code blocks, lists, tables, horizontal rules
  - Applies syntax highlighting to code blocks using `CodeColorizer`
  - Renders tables using `TableRenderer`
  - Applies theme colors from `semantic-colors.js`
  - Wraps text for terminal width
  - Renders as React/Ink components (`Box`, `Text`)
- **Output Format**: `React.JSX.Element` (formatted for terminal display)
  - TypeScript: `React.FC<MarkdownDisplayProps>` returns `React.JSX.Element`
  - Visual representation: Formatted markdown with colors, syntax highlighting,
    proper spacing
  - Rendered using Ink (React for CLI) components
- **File Path**: `packages/cli/src/ui/utils/MarkdownDisplay.tsx`
- **Key Component**:
  `MarkdownDisplay({ text, isPending, terminalWidth, renderMarkdown }): React.JSX.Element`

---

## Data Structures

### TypeScript Type Definitions

```typescript
// Step 1-2: Input
type InputString = string;

// Step 2: Parsed Command
type ParsedSlashCommand = {
  commandToExecute: SlashCommand | undefined;
  args: string;
  canonicalPath: string[];
};

// Step 3-4: Query Parts
type PartListUnion = string | Part | PartUnion | PartUnion[];

type PartUnion =
  | { text: string }
  | { fileData: FileData }
  | { inlineData: InlineData }
  | { functionCall: FunctionCall }
  | { functionResponse: FunctionResponse }
  | Part;

type Part = {
  text?: string;
  fileData?: FileData;
  inlineData?: InlineData;
  functionCall?: FunctionCall;
  functionResponse?: FunctionResponse;
  thought?: string;
  // ... other fields
};

// Step 5: API Request
type GenerateContentParameters = {
  model: string;
  contents: Content[];
  config: GenerateContentConfig;
};

type Content = {
  role: 'user' | 'model';
  parts: Part[];
};

type GenerateContentConfig = {
  systemInstruction?: string;
  tools?: Tool[];
  temperature?: number;
  topP?: number;
  topK?: number;
  maxOutputTokens?: number;
  // ... other config options
};

// Step 6-7: API Response
type GenerateContentResponse = {
  candidates?: Candidate[];
  usageMetadata?: UsageMetadata;
  modelVersion?: string;
  promptFeedback?: PromptFeedback;
};

type Candidate = {
  content?: Content;
  finishReason?: FinishReason;
  safetyRatings?: SafetyRating[];
};

// Step 8: Formatted Output
type FormattedOutput = React.JSX.Element; // Rendered Ink component
```

### Data Structure Flow Summary

```
string (user input)
  → string (trimmed)
  → PartListUnion (with file content)
  → PartListUnion (validated)
  → GenerateContentParameters (API request)
  → AsyncGenerator<GenerateContentResponse> (streaming response)
  → string (extracted text)
  → React.JSX.Element (formatted markdown)
```

## Complete Flow Diagram

```
[Step 1: Raw User Input]
    Input: User types "Explain this code @src/main.ts"
    Component: InputPrompt
    Output: string ("Explain this code @src/main.ts")
    ↓
[Step 2: Command Parsing]
    Input: string
    Component: parseSlashCommand()
    Output: string (if not slash command) | ParsedSlashCommand (if slash command)
    Note: Slash commands exit here, don't proceed to API
    ↓
[Step 3: @Command Processing]
    Input: string ("Explain this code @src/main.ts")
    Component: handleAtCommand()
    Output: PartListUnion ([{ text: "Explain this code " }, { fileData: {...} }])
    ↓
[Step 4: Query Preparation]
    Input: PartListUnion
    Component: prepareQueryForGemini()
    Output: PartListUnion (validated and ready)
    ↓
[Step 5: Payload Construction]
    Input: PartListUnion
    Component: makeApiCallAndProcessStream()
    Output: GenerateContentParameters ({ model, contents, config })
    ↓
[Step 6: HTTP Request]
    Input: GenerateContentParameters
    Component: ContentGenerator.generateContentStream()
    Output: AsyncGenerator<GenerateContentResponse> (streaming)
    ↓
[Step 7: Response Parsing]
    Input: AsyncGenerator<GenerateContentResponse>
    Component: processStreamResponse()
    Output: string (extracted text) + AsyncGenerator<GenerateContentResponse> (for UI)
    ↓
[Step 8: Output Formatting]
    Input: string (markdown text)
    Component: MarkdownDisplay
    Output: React.JSX.Element (formatted terminal output)
```

## Summary

**Total Transformation Steps**: 8

1. **Raw Input Collection** (Frontend): User input → string
2. **Command Parsing** (Frontend): string → ParsedSlashCommand | string
3. **@Command Processing** (Frontend): string → PartListUnion
4. **Query Preparation** (Frontend): PartListUnion → PartListUnion (validated)
5. **Payload Construction** (Backend): PartListUnion → GenerateContentParameters
6. **HTTP Request** (Backend): GenerateContentParameters →
   AsyncGenerator<GenerateContentResponse>
7. **Response Parsing** (Backend): AsyncGenerator<GenerateContentResponse> →
   string
8. **Output Formatting** (Frontend): string → React.JSX.Element

**Key Insights**:

- Steps 1-4 are frontend transformations (UI layer), but Steps 2-3 now use
  backend services
- Steps 5-7 are backend transformations (API layer)
- Step 8 is frontend transformation (display layer)
- Data flows: string → PartListUnion → GenerateContentParameters →
  GenerateContentResponse → string → React.JSX.Element
- Slash commands exit early at Step 2 and don't proceed through full pipeline
- **Post Phase 3.2**: Backend services provide clean interfaces:
  - Step 2: `SlashCommandService.parseSlashCommand()` (backend)
  - Step 3: `AtCommandService.parseAllAtCommands()`, `resolveAtCommandPaths()`
    (backend)
  - Step 6: `ApiService.sendMessageStreamWithEvents()` (backend)

## Notes

- Each step transforms data from one format to another
- Components responsible for each transformation are documented
- File paths allow quick location of transformation logic
- TypeScript types are documented for each data structure
- Sample input demonstrates typical user workflow with @command
- Slash commands are handled separately and don't proceed through full pipeline
