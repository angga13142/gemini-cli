# Backend Components (Otak) - Analysis Results

**Created**: 2025-11-30  
**Purpose**: Document all backend logic components that must be preserved during
refactoring

## Component Categories

### Authentication Components

| File Path                                         | Function/Class Name | Responsibility                                                                                                         | Category       | Dependencies                                         | Preserve |
| ------------------------------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------- | ---------------------------------------------------- | -------- |
| packages/core/src/core/apiKeyCredentialStorage.ts | loadApiKey          | Load API key from secure storage (HybridTokenStorage)                                                                  | authentication | HybridTokenStorage                                   | ✅       |
| packages/core/src/core/apiKeyCredentialStorage.ts | saveApiKey          | Save API key to secure storage                                                                                         | authentication | HybridTokenStorage                                   | ✅       |
| packages/core/src/core/apiKeyCredentialStorage.ts | clearApiKey         | Clear cached API key from storage                                                                                      | authentication | HybridTokenStorage                                   | ✅       |
| packages/cli/src/ui/auth/useAuth.ts               | useAuthCommand      | Authentication method selection and validation hook (⚠️ Note: Located in UI directory but contains backend auth logic) | authentication | Config, loadApiKey                                   | ✅       |
| packages/core/src/config/config.ts                | refreshAuth         | Refresh authentication and reinitialize content generator                                                              | authentication | createContentGeneratorConfig, createContentGenerator | ✅       |

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

### Data Processing

| File Path                            | Function/Class Name            | Responsibility                                                       | Category        | Dependencies                            | Preserve |
| ------------------------------------ | ------------------------------ | -------------------------------------------------------------------- | --------------- | --------------------------------------- | -------- |
| packages/core/src/core/client.ts     | GeminiClient.sendMessageStream | Process message stream with tool calls and multi-turn handling       | data-processing | GeminiChat, ContentGenerator            | ✅       |
| packages/core/src/core/client.ts     | GeminiClient.generateContent   | Generate content with fallback handling and retry logic              | data-processing | ContentGenerator, Config                | ✅       |
| packages/core/src/core/geminiChat.ts | GeminiChat.sendMessageStream   | Send message to model and return streaming response with retry logic | data-processing | ContentGenerator, GenerateContentConfig | ✅       |

## Component Relationships

Component relationships and dependencies are documented in
[component-relationships.md](./component-relationships.md).

Key relationships:

- **Backend-to-Backend**: 8 critical dependencies documented
- **Frontend-to-Backend**: 2 dependencies (useAuthCommand → Config.refreshAuth,
  loadApiKey)

## Summary

**Total Backend Components Identified**: 15

- **Authentication**: 5 components
  - API key storage: loadApiKey, saveApiKey, clearApiKey
  - Auth method selection: useAuthCommand, refreshAuth
- **API Payload Construction**: 2 components
  - createContentGeneratorConfig, makeApiCallAndProcessStream
- **HTTP Request Handling**: 3 components
  - createContentGenerator, generateContentStream, generateContent
- **Response Parsing**: 2 components
  - processStreamResponse, getResponseText
- **Data Processing**: 3 components
  - GeminiClient.sendMessageStream, GeminiClient.generateContent,
    GeminiChat.sendMessageStream

## Notes

- All components in this document MUST be preserved during refactoring
- Components are categorized by their primary responsibility
- Dependencies show which other components this component relies on
- **Edge Case**: `useAuth.ts` is located in UI directory but contains backend
  auth logic (see [edge-cases.md](./edge-cases.md))
- **File Path Correction**: `getResponseText` is in
  `packages/core/src/utils/partUtils.ts`, not `geminiChat.ts` as initially
  referenced
