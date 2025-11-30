# Backend Components (Otak) - Analysis Results

**Created**: 2025-11-30  
**Last Updated**: 2025-01-27 (Post Phase 3.2 Refactoring)  
**Purpose**: Document all backend logic components that must be preserved during
refactoring

## ⚠️ Update Notice

This document has been updated to reflect the new backend structure after Phase
3.2 refactoring (Backend-Frontend Separation). Components are now organized into
subdirectories:

- `packages/core/src/core/auth/` - Authentication components
- `packages/core/src/core/api/` - API handling components
- `packages/core/src/core/processing/` - Data processing components
- `packages/core/src/core/state/` - State management components (prepared for
  future)

## Component Categories

### Authentication Components

| File Path                                              | Function/Class Name | Responsibility                                                                                                           | Category       | Dependencies                                         | Preserve |
| ------------------------------------------------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------- | ---------------------------------------------------- | -------- |
| packages/core/src/core/auth/apiKeyCredentialStorage.ts | loadApiKey          | Load API key from secure storage (HybridTokenStorage)                                                                    | authentication | HybridTokenStorage                                   | ✅       |
| packages/core/src/core/auth/apiKeyCredentialStorage.ts | saveApiKey          | Save API key to secure storage                                                                                           | authentication | HybridTokenStorage                                   | ✅       |
| packages/core/src/core/auth/apiKeyCredentialStorage.ts | clearApiKey         | Clear cached API key from storage                                                                                        | authentication | HybridTokenStorage                                   | ✅       |
| packages/core/src/core/auth/authService.ts             | AuthService         | Authentication service with structured data contracts (authenticate, refresh, clear, isAuthenticated)                    | authentication | AuthRequest, AuthResult, BackendError                | ✅       |
| packages/cli/src/ui/auth/useAuth.ts                    | useAuthCommand      | Authentication method selection and validation hook (⚠️ Note: Located in UI directory but uses AuthService from backend) | authentication | Config, AuthService                                  | ✅       |
| packages/core/src/config/config.ts                     | refreshAuth         | Refresh authentication and reinitialize content generator                                                                | authentication | createContentGeneratorConfig, createContentGenerator | ✅       |

### API Payload Construction

| File Path                                  | Function/Class Name          | Responsibility                                                | Category    | Dependencies                            | Preserve |
| ------------------------------------------ | ---------------------------- | ------------------------------------------------------------- | ----------- | --------------------------------------- | -------- |
| packages/core/src/core/contentGenerator.ts | createContentGeneratorConfig | Create configuration for content generator with auth settings | api-payload | loadApiKey, Config                      | ✅       |
| packages/core/src/core/geminiChat.ts       | makeApiCallAndProcessStream  | Construct API payload and process streaming response          | api-payload | ContentGenerator, GenerateContentConfig | ✅       |

### HTTP Request Handling

| File Path                                  | Function/Class Name                    | Responsibility                                                  | Category     | Dependencies                           | Preserve |
| ------------------------------------------ | -------------------------------------- | --------------------------------------------------------------- | ------------ | -------------------------------------- | -------- |
| packages/core/src/core/contentGenerator.ts | createContentGenerator                 | Create ContentGenerator instance with HTTP client configuration | http-request | GoogleGenAI, ContentGeneratorConfig    | ✅       |
| packages/core/src/core/contentGenerator.ts | ContentGenerator.generateContentStream | Make HTTP request to Gemini API and return streaming response   | http-request | GoogleGenAI, GenerateContentParameters | ✅       |
| packages/core/src/core/contentGenerator.ts | ContentGenerator.generateContent       | Make HTTP request to Gemini API and return complete response    | http-request | GoogleGenAI, GenerateContentParameters | ✅       |

### Response Parsing

| File Path                            | Function/Class Name   | Responsibility                                                           | Category         | Dependencies            | Preserve |
| ------------------------------------ | --------------------- | ------------------------------------------------------------------------ | ---------------- | ----------------------- | -------- |
| packages/core/src/core/geminiChat.ts | processStreamResponse | Parse streaming GenerateContentResponse chunks and extract content parts | response-parsing | GenerateContentResponse | ✅       |
| packages/core/src/utils/partUtils.ts | getResponseText       | Extract text content from GenerateContentResponse (utility function)     | response-parsing | GenerateContentResponse | ✅       |

### API Service Components

| File Path                                         | Function/Class Name                       | Responsibility                                                                     | Category    | Dependencies                          | Preserve |
| ------------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------- | ----------- | ------------------------------------- | -------- |
| packages/core/src/core/api/apiService.ts          | ApiServiceImpl                            | API service wrapper following ApiService contract (sendMessageStream, sendMessage) | api-service | GeminiClient, ApiRequest, ApiResponse | ✅       |
| packages/core/src/core/api/slashCommandService.ts | parseSlashCommand                         | Parse slash command strings into structured data                                   | api-service | CommandForParsing, ParsedSlashCommand | ✅       |
| packages/core/src/core/api/atCommandService.ts    | parseAllAtCommands, resolveAtCommandPaths | Parse @commands and resolve file paths                                             | api-service | ParsedAtCommand, ResolvedPath         | ✅       |

### Data Processing

| File Path                                          | Function/Class Name            | Responsibility                                                       | Category        | Dependencies                            | Preserve |
| -------------------------------------------------- | ------------------------------ | -------------------------------------------------------------------- | --------------- | --------------------------------------- | -------- |
| packages/core/src/core/processing/dataProcessor.ts | convertSessionToHistoryFormats | Convert session data to UI and client history formats                | data-processing | ConversationRecord, UIHistoryItem       | ✅       |
| packages/core/src/core/client.ts                   | GeminiClient.sendMessageStream | Process message stream with tool calls and multi-turn handling       | data-processing | GeminiChat, ContentGenerator            | ✅       |
| packages/core/src/core/client.ts                   | GeminiClient.generateContent   | Generate content with fallback handling and retry logic              | data-processing | ContentGenerator, Config                | ✅       |
| packages/core/src/core/geminiChat.ts               | GeminiChat.sendMessageStream   | Send message to model and return streaming response with retry logic | data-processing | ContentGenerator, GenerateContentConfig | ✅       |

## Component Relationships

Component relationships and dependencies are documented in
[component-relationships.md](./component-relationships.md).

Key relationships:

- **Backend-to-Backend**: 8 critical dependencies documented
- **Frontend-to-Backend**: 2 dependencies (useAuthCommand → Config.refreshAuth,
  loadApiKey)

## Summary

**Total Backend Components Identified**: 20 (updated after Phase 3.2)

- **Authentication**: 6 components
  - API key storage: loadApiKey, saveApiKey, clearApiKey (moved to `auth/`)
  - Auth service: AuthService (new, in `auth/`)
  - Auth method selection: useAuthCommand, refreshAuth
- **API Service**: 3 components (new category)
  - ApiServiceImpl: API service wrapper following contracts
  - parseSlashCommand: Slash command parsing (extracted to `api/`)
  - parseAllAtCommands, resolveAtCommandPaths: @command processing (extracted to
    `api/`)
- **API Payload Construction**: 2 components
  - createContentGeneratorConfig, makeApiCallAndProcessStream
- **HTTP Request Handling**: 3 components
  - createContentGenerator, generateContentStream, generateContent
- **Response Parsing**: 2 components
  - processStreamResponse, getResponseText
- **Data Processing**: 4 components
  - convertSessionToHistoryFormats: Session data conversion (new, in
    `processing/`)
  - GeminiClient.sendMessageStream, GeminiClient.generateContent,
    GeminiChat.sendMessageStream

## Notes

- All components in this document MUST be preserved during refactoring
- Components are categorized by their primary responsibility
- Dependencies show which other components this component relies on
- **New Structure**: After Phase 3.2 refactoring, components are organized into
  subdirectories:
  - `auth/` - Authentication components (apiKeyCredentialStorage.ts moved here)
  - `api/` - API service components (apiService.ts, slashCommandService.ts,
    atCommandService.ts)
  - `processing/` - Data processing components (dataProcessor.ts)
  - `state/` - State management components (prepared for future)
- **Edge Case**: `useAuth.ts` is located in UI directory but uses AuthService
  from backend
- **File Path Correction**: `getResponseText` is in
  `packages/core/src/utils/partUtils.ts`, not `geminiChat.ts` as initially
  referenced
- **Contracts**: New backend services follow data contracts defined in
  `packages/core/src/contracts/`
