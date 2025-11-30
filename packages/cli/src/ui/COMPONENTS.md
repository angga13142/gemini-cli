# Frontend Components Documentation

**Created**: 2025-01-27  
**Purpose**: Document current frontend component locations in
`packages/cli/src/ui/`  
**Status**: Phase 1 - Initial Documentation

## Overview

This document catalogs all frontend/UI components currently located in
`packages/cli/src/ui/`. These components represent the "Wajah" (face) of the
application - UI code that can be replaced during refactoring.

## Component Structure

### Main Application Components

| File               | Component      | Purpose                                        |
| ------------------ | -------------- | ---------------------------------------------- |
| `App.tsx`          | `App`          | Root application component                     |
| `AppContainer.tsx` | `AppContainer` | Main UI container orchestrating all components |

### Input Handling Components

| Directory                         | Components           | Purpose                                                      |
| --------------------------------- | -------------------- | ------------------------------------------------------------ |
| `components/InputPrompt.tsx`      | `InputPrompt`        | User input collection, keyboard handling, history navigation |
| `components/ShellInputPrompt.tsx` | `ShellInputPrompt`   | Shell command input handling                                 |
| `hooks/slashCommandProcessor.ts`  | `handleSlashCommand` | Slash command processing                                     |
| `hooks/atCommandProcessor.ts`     | `handleAtCommand`    | @path command processing                                     |

### Output Formatting Components

| Directory                                   | Components               | Purpose                                     |
| ------------------------------------------- | ------------------------ | ------------------------------------------- |
| `utils/MarkdownDisplay.tsx`                 | `MarkdownDisplay`        | Markdown rendering with syntax highlighting |
| `utils/CodeColorizer.tsx`                   | `CodeColorizer`          | Code syntax highlighting                    |
| `utils/TableRenderer.tsx`                   | `TableRenderer`          | Table rendering                             |
| `utils/InlineMarkdownRenderer.tsx`          | `InlineMarkdownRenderer` | Inline markdown rendering                   |
| `components/messages/ToolResultDisplay.tsx` | `ToolResultDisplay`      | Tool execution result formatting            |
| `components/messages/DiffRenderer.tsx`      | `DiffRenderer`           | Diff rendering                              |
| `components/messages/AnsiOutput.tsx`        | `AnsiOutputText`         | ANSI color-coded output                     |

### Message Display Components

| Directory                                    | Components           | Purpose                          |
| -------------------------------------------- | -------------------- | -------------------------------- |
| `components/messages/GeminiMessage.tsx`      | `GeminiMessage`      | Gemini model message display     |
| `components/messages/UserMessage.tsx`        | `UserMessage`        | User message display             |
| `components/messages/ToolMessage.tsx`        | `ToolMessage`        | Tool execution message display   |
| `components/messages/ErrorMessage.tsx`       | `ErrorMessage`       | Error message display            |
| `components/messages/InfoMessage.tsx`        | `InfoMessage`        | Info message display             |
| `components/messages/WarningMessage.tsx`     | `WarningMessage`     | Warning message display          |
| `components/messages/CompressionMessage.tsx` | `CompressionMessage` | Compression notification display |

### Navigation & Layout Components

| Directory                             | Components              | Purpose                         |
| ------------------------------------- | ----------------------- | ------------------------------- |
| `layouts/DefaultAppLayout.tsx`        | `DefaultAppLayout`      | Default application layout      |
| `layouts/ScreenReaderAppLayout.tsx`   | `ScreenReaderAppLayout` | Screen reader accessible layout |
| `components/MainContent.tsx`          | `MainContent`           | Main content area               |
| `components/StickyHeader.tsx`         | `StickyHeader`          | Sticky header component         |
| `components/views/ChatList.tsx`       | `ChatList`              | Chat history list view          |
| `components/views/ToolsList.tsx`      | `ToolsList`             | Tools list view                 |
| `components/views/ExtensionsList.tsx` | `ExtensionsList`        | Extensions list view            |

### Settings & Configuration UI

| Directory                               | Components               | Purpose                   |
| --------------------------------------- | ------------------------ | ------------------------- |
| `components/SettingsDialog.tsx`         | `SettingsDialog`         | Settings dialog           |
| `components/ThemeDialog.tsx`            | `ThemeDialog`            | Theme selection dialog    |
| `components/MultiFolderTrustDialog.tsx` | `MultiFolderTrustDialog` | Multi-folder trust dialog |
| `components/EditorSettingsDialog.tsx`   | `EditorSettingsDialog`   | Editor settings dialog    |

### Authentication UI

| Directory                 | Components       | Purpose                                         |
| ------------------------- | ---------------- | ----------------------------------------------- |
| `auth/AuthDialog.tsx`     | `AuthDialog`     | Authentication dialog                           |
| `auth/ApiAuthDialog.tsx`  | `ApiAuthDialog`  | API key authentication dialog                   |
| `auth/AuthInProgress.tsx` | `AuthInProgress` | Authentication progress indicator               |
| `auth/useAuth.ts`         | `useAuthCommand` | Authentication hook (⚠️ contains backend logic) |

### Context Providers

| Directory                       | Components         | Purpose                    |
| ------------------------------- | ------------------ | -------------------------- |
| `contexts/AppContext.tsx`       | `AppContext`       | Application context        |
| `contexts/ConfigContext.tsx`    | `ConfigContext`    | Configuration context      |
| `contexts/SessionContext.tsx`   | `SessionContext`   | Session management context |
| `contexts/StreamingContext.tsx` | `StreamingContext` | Streaming state context    |
| `contexts/KeypressContext.tsx`  | `KeypressContext`  | Keyboard input context     |
| `contexts/MouseContext.tsx`     | `MouseContext`     | Mouse input context        |
| `contexts/SettingsContext.tsx`  | `SettingsContext`  | Settings state context     |
| `contexts/VimModeContext.tsx`   | `VimModeContext`   | Vim mode context           |

### Hooks

| Directory | Hooks      | Purpose                                            |
| --------- | ---------- | -------------------------------------------------- |
| `hooks/`  | 100+ hooks | UI state management, event handling, data fetching |

### Commands

| Directory   | Commands     | Purpose                                               |
| ----------- | ------------ | ----------------------------------------------------- |
| `commands/` | 30+ commands | CLI command implementations (help, auth, clear, etc.) |

### Shared Components

| Directory                                 | Components          | Purpose                    |
| ----------------------------------------- | ------------------- | -------------------------- |
| `components/shared/TextInput.tsx`         | `TextInput`         | Text input component       |
| `components/shared/ScrollableList.tsx`    | `ScrollableList`    | Scrollable list component  |
| `components/shared/VirtualizedList.tsx`   | `VirtualizedList`   | Virtualized list component |
| `components/shared/BaseSelectionList.tsx` | `BaseSelectionList` | Base selection list        |
| `components/shared/RadioButtonSelect.tsx` | `RadioButtonSelect` | Radio button selection     |
| `components/shared/EnumSelector.tsx`      | `EnumSelector`      | Enum value selector        |

### Utilities

| Directory | Utilities | Purpose                           |
| --------- | --------- | --------------------------------- |
| `utils/`  | 47 files  | UI utilities, formatters, helpers |

### Themes

| Directory | Files    | Purpose                             |
| --------- | -------- | ----------------------------------- |
| `themes/` | 21 files | Theme definitions and color schemes |

### Privacy & Legal

| Directory                            | Components               | Purpose                        |
| ------------------------------------ | ------------------------ | ------------------------------ |
| `privacy/PrivacyNotice.tsx`          | `PrivacyNotice`          | Privacy notice display         |
| `privacy/GeminiPrivacyNotice.tsx`    | `GeminiPrivacyNotice`    | Gemini-specific privacy notice |
| `privacy/CloudFreePrivacyNotice.tsx` | `CloudFreePrivacyNotice` | Cloud-free privacy notice      |
| `privacy/CloudPaidPrivacyNotice.tsx` | `CloudPaidPrivacyNotice` | Cloud-paid privacy notice      |

## Component Categories

### High Replaceability (Can be easily replaced)

- Input components: `InputPrompt`, `ShellInputPrompt`
- Output formatting: `MarkdownDisplay`, `CodeColorizer`, `ToolResultDisplay`
- Message display: All message components
- Layout: `DefaultAppLayout`, `ScreenReaderAppLayout`
- Settings UI: All dialog components

### Medium Replaceability (Require refactoring)

- Context providers: May contain business logic that needs extraction
- Commands: Some commands may have mixed UI/logic
- Hooks: Some hooks may contain business logic

### Special Cases

- `auth/useAuth.ts`: Located in UI directory but contains backend auth logic
  (needs extraction)

## Notes

- All components in this directory are **frontend/UI** and can be replaced
- Components should receive structured data from backend, format for display
- Components use UI libraries: ink, react, react-dom, chalk, highlight.js
- During refactoring, these components will be replaced or refactored to use
  adapters

## Next Steps

During refactoring:

1. Create adapters in `packages/cli/src/adapters/` to bridge frontend and
   backend
2. Extract business logic from UI components to backend
3. Ensure UI components only handle display/formatting
4. Replace UI components with alternative implementations if needed
