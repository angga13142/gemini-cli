# API Components

This directory contains API handling components for the Gemini CLI backend.

## Components to Move Here (from packages/core/src/core/):

- `client.ts` - GeminiClient (main client for sending messages)
- `geminiChat.ts` - GeminiChat (chat management and streaming)
- `contentGenerator.ts` - ContentGenerator interface and factory
- `loggingContentGenerator.ts` - LoggingContentGenerator wrapper
- `recordingContentGenerator.ts` - RecordingContentGenerator wrapper
- `fakeContentGenerator.ts` - FakeContentGenerator for testing
- `baseLlmClient.ts` - BaseLlmClient interface
- `geminiRequest.ts` - Gemini API request utilities

## Status

Currently, these components remain in `packages/core/src/core/` to avoid
breaking changes. They will be moved here in a future phase after all import
paths are updated.

## Note

Moving these components requires updating imports across the entire codebase.
This is a large refactoring that should be done carefully with comprehensive
testing.
