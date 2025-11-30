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

| Component                        | Used By | Relationship Type | Can Split? | Notes |
| -------------------------------- | ------- | ----------------- | ---------- | ----- |
| _[To be filled during analysis]_ |         |                   |            |       |

## Dependency Graph

_[To be created as visual/text representation]_

## Critical Relationships

Components marked as "Critical" indicate relationships that MUST be preserved
during refactoring. Breaking these relationships would cause system failure.

## Notes

- All relationships documented here are discovered during code tracing
- Critical relationships are highlighted for refactoring planning
- Shared components need special attention to determine if they can be split
