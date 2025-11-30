# State Management Components

This directory contains state management components for the Gemini CLI backend.

## Components to Move Here (from packages/core/src/core/):

- `turn.ts` - Turn-based conversation management
- `geminiChat.ts` - Chat state management (partially - also has API logic)

## Status

Currently, these components remain in `packages/core/src/core/` to avoid
breaking changes. They will be moved here in a future phase after all import
paths are updated.

## Note

`geminiChat.ts` contains both API handling and state management logic. Consider
splitting it into separate files when moving.
