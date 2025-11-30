# Frontend/UI Components (Wajah) - Analysis Results

**Created**: 2025-11-30  
**Purpose**: Document all frontend/UI components that can be replaced during
refactoring

## Component Categories

### Input Handling Components

| File Path                                          | Component/Function Name | UI Responsibility                                                          | Category       | Replaceability | Dependencies                                           | Preserve |
| -------------------------------------------------- | ----------------------- | -------------------------------------------------------------------------- | -------------- | -------------- | ------------------------------------------------------ | -------- |
| packages/cli/src/ui/components/InputPrompt.tsx     | InputPrompt             | User input collection, keyboard handling, history navigation, autocomplete | input-handling | High           | useInputHistory, useShellHistory, useCommandCompletion | ❌       |
| packages/cli/src/utils/commands.ts                 | parseSlashCommand       | Parse slash command strings into command, args, and canonical path         | input-handling | High           | SlashCommand types                                     | ❌       |
| packages/cli/src/ui/hooks/slashCommandProcessor.ts | handleSlashCommand      | Process and execute slash commands (e.g., /help, /clear)                   | input-handling | Medium         | Config, CommandService, addItem                        | ❌       |
| packages/cli/src/ui/hooks/atCommandProcessor.ts    | handleAtCommand         | Process @path commands, read files, and prepare query with file content    | input-handling | Medium         | Config, ReadManyFilesTool, addItem                     | ❌       |

### Output Formatting Components

| File Path                                                     | Component/Function Name | UI Responsibility                                                                | Category          | Replaceability | Dependencies                              | Preserve |
| ------------------------------------------------------------- | ----------------------- | -------------------------------------------------------------------------------- | ----------------- | -------------- | ----------------------------------------- | -------- |
| packages/cli/src/ui/utils/MarkdownDisplay.tsx                 | MarkdownDisplay         | Render markdown text with syntax highlighting, tables, code blocks, lists        | output-formatting | High           | ink, CodeColorizer, TableRenderer         | ❌       |
| packages/cli/src/ui/components/messages/ToolResultDisplay.tsx | ToolResultDisplay       | Format and display tool execution results (markdown, plain text, diffs)          | output-formatting | High           | MarkdownDisplay, DiffRenderer, AnsiOutput | ❌       |
| packages/cli/src/ui/components/AnsiOutput.tsx                 | AnsiOutputText          | Render ANSI color-coded output with formatting (colors, bold, italic, underline) | output-formatting | High           | ink Text component                        | ❌       |

### Navigation Components

| File Path                                      | Component/Function Name | UI Responsibility                                                | Category   | Replaceability | Dependencies                                           | Preserve |
| ---------------------------------------------- | ----------------------- | ---------------------------------------------------------------- | ---------- | -------------- | ------------------------------------------------------ | -------- |
| packages/cli/src/ui/AppContainer.tsx           | AppContainer            | Main UI container, orchestrates all UI components, manages state | navigation | Medium         | Config, useHistory, useSettings, InputPrompt, Composer | ❌       |
| packages/cli/src/ui/hooks/useSessionBrowser.ts | useSessionBrowser       | Session browser hook for loading/deleting conversation sessions  | navigation | Medium         | Config, fs, path                                       | ❌       |

### Display Components

| File Path                                                     | Component/Function Name | UI Responsibility                                          | Category | Replaceability | Dependencies                     | Preserve |
| ------------------------------------------------------------- | ----------------------- | ---------------------------------------------------------- | -------- | -------------- | -------------------------------- | -------- |
| packages/cli/src/ui/components/InputPrompt.tsx                | InputPrompt             | Display input field, suggestions, history, cursor position | display  | High           | ink Box/Text, SuggestionsDisplay | ❌       |
| packages/cli/src/ui/utils/MarkdownDisplay.tsx                 | MarkdownDisplay         | Display formatted markdown content in terminal             | display  | High           | ink Box/Text, CodeColorizer      | ❌       |
| packages/cli/src/ui/components/messages/ToolResultDisplay.tsx | ToolResultDisplay       | Display tool execution results in formatted view           | display  | High           | MarkdownDisplay, DiffRenderer    | ❌       |

## Replaceability Assessment

**High Replaceability**: Components that can be easily replaced with alternative
UI frameworks or libraries  
**Medium Replaceability**: Components that require some refactoring but can be
replaced  
**Low Replaceability**: Components tightly coupled to backend but still
UI-focused

### Replaceability Summary

- **High Replaceability (9 components)**: InputPrompt, parseSlashCommand,
  MarkdownDisplay, ToolResultDisplay, AnsiOutputText, InputPrompt (display),
  MarkdownDisplay (display), ToolResultDisplay (display)
  - These components primarily handle UI rendering and formatting
  - Can be replaced with alternative UI libraries (e.g., React Native, Vue, or
    custom terminal UI)
  - Minimal backend coupling

- **Medium Replaceability (3 components)**: handleSlashCommand, handleAtCommand,
  AppContainer, useSessionBrowser
  - These components have some backend logic integration
  - Require refactoring to separate UI from business logic
  - Still replaceable with proper abstraction layer

## Summary

**Total Frontend Components Identified**: 12

- **Input Handling**: 4 components
  - InputPrompt: User input collection and display
  - parseSlashCommand: Slash command parsing
  - handleSlashCommand: Slash command execution
  - handleAtCommand: @path command processing
- **Output Formatting**: 3 components
  - MarkdownDisplay: Markdown rendering
  - ToolResultDisplay: Tool result formatting
  - AnsiOutputText: ANSI color formatting
- **Navigation**: 2 components
  - AppContainer: Main UI container
  - useSessionBrowser: Session management
- **Display**: 3 components (overlap with formatting)
  - InputPrompt: Input field display
  - MarkdownDisplay: Markdown content display
  - ToolResultDisplay: Tool result display

## Notes

- All components in this document CAN be replaced during refactoring
- Replaceability status indicates how easily the component can be swapped
- Dependencies show which backend components this UI component uses
- Some components appear in multiple categories (e.g., InputPrompt is both
  input-handling and display)
- Components marked as "Medium Replaceability" may need abstraction layers to
  fully decouple from backend
