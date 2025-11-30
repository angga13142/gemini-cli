# Component Relationships Map

**Created**: 2025-11-30  
**Purpose**: Document relationships and dependencies between all identified
components

## Relationship Types

- **depends-on**: Component requires another component to function
- **uses**: Component calls or imports another component
- **imports**: Component imports another component's exports
- **calls**: Component invokes another component's functions/methods

## Backend-to-Backend Dependencies

| From Component                 | To Component                           | Relationship Type | Critical    | Notes                             |
| ------------------------------ | -------------------------------------- | ----------------- | ----------- | --------------------------------- |
| Config.refreshAuth             | createContentGeneratorConfig           | calls             | ✅ Yes      | Creates config with auth settings |
| Config.refreshAuth             | createContentGenerator                 | calls             | ✅ Yes      | Initializes content generator     |
| createContentGeneratorConfig   | loadApiKey                             | calls             | ✅ Yes      | Loads API key for config          |
| GeminiChat.sendMessageStream   | makeApiCallAndProcessStream            | calls             | ✅ Yes      | Core API call flow                |
| makeApiCallAndProcessStream    | ContentGenerator.generateContentStream | calls             | ✅ Yes      | Makes HTTP request                |
| GeminiClient.sendMessageStream | GeminiChat.sendMessageStream           | calls             | ✅ Yes      | Delegates to GeminiChat           |
| GeminiClient.generateContent   | ContentGenerator.generateContent       | calls             | ✅ Yes      | Non-streaming API call            |
| processStreamResponse          | getResponseText                        | uses              | ⚠️ Indirect | Extracts text from response parts |

## Frontend-to-Backend Dependencies

| From Component              | To Component       | Relationship Type | Critical | Notes                        |
| --------------------------- | ------------------ | ----------------- | -------- | ---------------------------- |
| useAuthCommand (useAuth.ts) | Config.refreshAuth | calls             | ✅ Yes   | Triggers auth refresh        |
| useAuthCommand (useAuth.ts) | loadApiKey         | calls             | ✅ Yes   | Loads API key for validation |

## Frontend-to-Frontend Dependencies

| From Component     | To Component       | Relationship Type | Critical       | Notes                                                      |
| ------------------ | ------------------ | ----------------- | -------------- | ---------------------------------------------------------- |
| AppContainer       | Composer           | uses              | ✅ Yes         | Main UI orchestrator uses Composer for layout              |
| Composer           | InputPrompt        | uses              | ✅ Yes         | Composer renders InputPrompt for user input                |
| ToolResultDisplay  | MarkdownDisplay    | uses              | ✅ Yes         | ToolResultDisplay uses MarkdownDisplay for formatting      |
| ToolResultDisplay  | AnsiOutputText     | uses              | ⚠️ Conditional | ToolResultDisplay uses AnsiOutputText for ANSI output      |
| AppContainer       | useSessionBrowser  | uses              | ✅ Yes         | AppContainer uses useSessionBrowser for session management |
| handleSlashCommand | parseSlashCommand  | calls             | ✅ Yes         | Slash command processor uses parser                        |
| handleAtCommand    | parseAllAtCommands | calls             | ✅ Yes         | @command processor uses parser function                    |

## Shared Component Relationships

| Component                   | Used By                                                                                      | Relationship Type | Can Split?   | Notes                                                                                                          |
| --------------------------- | -------------------------------------------------------------------------------------------- | ----------------- | ------------ | -------------------------------------------------------------------------------------------------------------- |
| useAuthCommand (useAuth.ts) | Frontend (UI hooks) and Backend (Config.refreshAuth, loadApiKey)                             | calls             | ⚠️ Can split | Located in UI directory but contains backend auth logic. Can be split into: backend auth logic + UI state hook |
| Config (config.ts)          | Frontend (useAuthCommand) and Backend (createContentGeneratorConfig, createContentGenerator) | calls             | ⚠️ Can split | Configuration management used by both layers. Core config logic is backend, but CLI config extends it          |
| zod (dependency)            | Frontend (UI validation) and Backend (config validation)                                     | uses              | ⚠️ Can split | Schema validation used in both layers. Can potentially use different validation libraries per layer            |
| dotenv (dependency)         | Frontend (CLI config) and Backend (core config)                                              | uses              | ⚠️ Can split | Environment variable loading used in both layers. Can use different config loading strategies per layer        |

## Dependency Graph

### Text Representation

```
Backend Layer (packages/core/src/core/)
├── Authentication
│   ├── loadApiKey → HybridTokenStorage
│   ├── saveApiKey → HybridTokenStorage
│   └── refreshAuth → createContentGeneratorConfig → createContentGenerator
├── API Payload Construction
│   ├── createContentGeneratorConfig → loadApiKey, Config
│   └── makeApiCallAndProcessStream → ContentGenerator, GenerateContentConfig
├── HTTP Request Handling
│   ├── createContentGenerator → GoogleGenAI, ContentGeneratorConfig
│   ├── generateContentStream → GoogleGenAI, GenerateContentParameters
│   └── generateContent → GoogleGenAI, GenerateContentParameters
├── Response Parsing
│   ├── processStreamResponse → GenerateContentResponse
│   └── getResponseText → GenerateContentResponse
└── Data Processing
    ├── GeminiClient.sendMessageStream → GeminiChat.sendMessageStream → makeApiCallAndProcessStream
    ├── GeminiClient.generateContent → ContentGenerator.generateContent
    └── GeminiChat.sendMessageStream → ContentGenerator, GenerateContentConfig

Frontend Layer (packages/cli/src/ui/)
├── Input Handling
│   ├── InputPrompt → useInputHistory, useShellHistory, useCommandCompletion
│   ├── parseSlashCommand → SlashCommand types
│   ├── handleSlashCommand → Config, CommandService, addItem, parseSlashCommand
│   └── handleAtCommand → Config, ReadManyFilesTool, addItem, parseAllAtCommands
├── Output Formatting
│   ├── MarkdownDisplay → ink, CodeColorizer, TableRenderer
│   ├── ToolResultDisplay → MarkdownDisplay, DiffRenderer, AnsiOutput
│   └── AnsiOutputText → ink Text component
└── Navigation
    ├── AppContainer → Config, useHistory, useSettings, InputPrompt, Composer, useSessionBrowser
    └── useSessionBrowser → Config, fs, path

Frontend-to-Backend Bridge
└── useAuthCommand (UI) → Config.refreshAuth (Backend), loadApiKey (Backend)
```

## Critical Relationships

Components marked as "Critical" indicate relationships that MUST be preserved
during refactoring. Breaking these relationships would cause system failure.

## Notes

- All relationships documented here are discovered during code tracing
- Critical relationships are highlighted for refactoring planning
- Shared components need special attention to determine if they can be split
