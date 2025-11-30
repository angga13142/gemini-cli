# Dependencies Catalog

**Created**: 2025-11-30  
**Purpose**: Categorize all dependencies into UI-related (removable) and
logic-related (essential) categories

## Categorization Criteria

- **UI Dependencies**: Only imported in UI/presentation files, used for
  rendering/formatting/display
- **Logic Dependencies**: Used in backend/core logic, required for API
  communication or data processing
- **Shared Dependencies**: Used in both UI and logic, or serves
  configuration/validation purposes used by both layers

## UI Dependencies (🔴 - Removable)

| Package Name        | Version                 | Usage Locations                                                                          | Essential | Rationale                                                                      | Can Remove |
| ------------------- | ----------------------- | ---------------------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------ | ---------- |
| ink                 | npm:@jrichman/ink@6.4.6 | packages/cli/src/ui/\*_/_.tsx, packages/cli/src/gemini.tsx                               | ❌        | React-based CLI UI library for terminal rendering, only used for UI components | ✅         |
| react               | ^19.2.0                 | packages/cli/src/ui/\*_/_.tsx, packages/cli/src/gemini.tsx                               | ❌        | React framework for UI components, only used in CLI UI layer                   | ✅         |
| react-dom           | ^19.2.0                 | packages/cli/src/test-utils/render.tsx                                                   | ❌        | React DOM renderer for testing UI components                                   | ✅         |
| ink-spinner         | ^5.0.0                  | packages/cli/src/ui/components/CliSpinner.tsx                                            | ❌        | Spinner component for loading indicators in UI                                 | ✅         |
| ink-gradient        | ^3.0.0                  | packages/cli/src/ui/\*_/_.tsx                                                            | ❌        | Gradient text effects for UI display                                           | ✅         |
| highlight.js        | ^11.11.1                | packages/cli/src/ui/utils/highlight.test.ts, packages/cli/src/ui/utils/CodeColorizer.tsx | ❌        | Syntax highlighting for code display in terminal UI                            | ✅         |
| lowlight            | ^3.3.0                  | packages/cli/src/ui/utils/CodeColorizer.tsx                                              | ❌        | Syntax highlighting library for code display in UI                             | ✅         |
| chalk               | ^6.2.2                  | packages/cli/src/ui/components/InputPrompt.tsx                                           | ❌        | Terminal string styling for UI formatting                                      | ✅         |
| clipboardy          | ^5.0.0                  | packages/cli/src/ui/components/InputPrompt.tsx                                           | ❌        | Clipboard operations for UI copy/paste functionality                           | ✅         |
| prompts             | ^2.4.2                  | packages/cli/src/\*_/_.ts                                                                | ❌        | Interactive CLI prompts for user input in UI                                   | ✅         |
| ansi-regex          | ^6.2.2                  | packages/cli/src/\*_/_.ts                                                                | ❌        | ANSI escape code regex for terminal formatting                                 | ✅         |
| string-width        | ^8.1.0                  | packages/cli/src/\*_/_.ts                                                                | ❌        | Calculate string width for terminal display                                    | ✅         |
| wrap-ansi           | 9.0.2                   | packages/cli/src/\*_/_.ts                                                                | ❌        | Word wrap text with ANSI escape codes for UI display                           | ✅         |
| tinygradient        | ^1.1.5                  | packages/cli/src/\*_/_.ts                                                                | ❌        | Color gradient generation for UI effects                                       | ✅         |
| ink-testing-library | ^4.0.0                  | packages/cli/src/\*_/_.test.tsx                                                          | ❌        | Testing utilities for Ink/React UI components                                  | ✅         |

## Logic Dependencies (🟢 - Essential)

| Package Name                                          | Version  | Usage Locations                                                                                                                                            | Essential | Rationale                                                                   | Can Remove |
| ----------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------- | ---------- |
| @google/genai                                         | 1.30.0   | packages/core/src/core/contentGenerator.ts, packages/core/src/core/geminiChat.ts, packages/core/src/core/client.ts, packages/core/src/\*_/_.ts (108 files) | ✅        | Core library for Gemini API interaction, required for all backend API calls | ❌         |
| google-auth-library                                   | ^9.11.0  | packages/core/src/mcp/google-auth-provider.ts, packages/core/src/code\*assist/oauth2.ts, packages/core/src/code_assist/\*\*/\_.ts                          | ✅        | Google OAuth authentication for API access, required for backend auth       | ❌         |
| undici                                                | ^7.10.0  | packages/core/src/utils/fetch.ts, packages/core/src/ide/ide-client.ts, packages/cli/src/utils/gitUtils.ts                                                  | ✅        | HTTP client for API requests, used in backend for network operations        | ❌         |
| @google-cloud/logging                                 | ^11.2.1  | packages/core/src/\*_/_.ts                                                                                                                                 | ✅        | Google Cloud logging service for backend telemetry                          | ❌         |
| @google-cloud/opentelemetry-cloud-monitoring-exporter | ^0.21.0  | packages/core/src/\*_/_.ts                                                                                                                                 | ✅        | OpenTelemetry exporter for backend monitoring                               | ❌         |
| @google-cloud/opentelemetry-cloud-trace-exporter      | ^3.0.0   | packages/core/src/\*_/_.ts                                                                                                                                 | ✅        | OpenTelemetry trace exporter for backend observability                      | ❌         |
| @opentelemetry/api                                    | ^1.9.0   | packages/core/src/\*_/_.ts                                                                                                                                 | ✅        | OpenTelemetry API for backend telemetry                                     | ❌         |
| @opentelemetry/sdk-node                               | ^0.203.0 | packages/core/src/\*_/_.ts                                                                                                                                 | ✅        | OpenTelemetry SDK for Node.js backend instrumentation                       | ❌         |
| @opentelemetry/instrumentation-http                   | ^0.203.0 | packages/core/src/\*_/_.ts                                                                                                                                 | ✅        | HTTP instrumentation for backend telemetry                                  | ❌         |
| marked                                                | ^15.0.12 | packages/core/src/utils/memoryImportProcessor.ts                                                                                                           | ✅        | Markdown parser for processing markdown content in backend logic            | ❌         |
| @modelcontextprotocol/sdk                             | ^1.23.0  | packages/core/src/tools/mcp-tool.ts, packages/core/src/tools/mcp-client.ts                                                                                 | ✅        | Model Context Protocol SDK for backend tool integration                     | ❌         |
| simple-git                                            | ^3.28.0  | packages/core/src/**/\*.ts, packages/cli/src/**/\*.ts                                                                                                      | ✅        | Git operations library used in backend for file operations                  | ❌         |
| diff                                                  | ^7.0.0   | packages/core/src/**/\*.ts, packages/cli/src/**/\*.ts                                                                                                      | ✅        | Text diff algorithm for backend code comparison                             | ❌         |
| glob                                                  | ^12.0.0  | packages/core/src/**/\*.ts, packages/cli/src/**/\*.ts                                                                                                      | ✅        | File pattern matching for backend file operations                           | ❌         |
| fzf                                                   | ^0.5.2   | packages/core/src/**/\*.ts, packages/cli/src/**/\*.ts                                                                                                      | ✅        | Fuzzy finder for backend file search operations                             | ❌         |
| fdir                                                  | ^6.4.6   | packages/core/src/\*_/_.ts                                                                                                                                 | ✅        | Fast directory traversal for backend file operations                        | ❌         |
| ignore                                                | ^7.0.0   | packages/core/src/\*_/_.ts                                                                                                                                 | ✅        | Git ignore pattern matching for backend file filtering                      | ❌         |
| picomatch                                             | ^4.0.1   | packages/core/src/\*_/_.ts                                                                                                                                 | ✅        | Glob pattern matching for backend file operations                           | ❌         |
| shell-quote                                           | ^1.8.3   | packages/core/src/**/\*.ts, packages/cli/src/**/\*.ts                                                                                                      | ✅        | Shell command parsing for backend command execution                         | ❌         |
| mime                                                  | 4.0.7    | packages/core/src/\*_/_.ts                                                                                                                                 | ✅        | MIME type detection for backend file processing                             | ❌         |
| html-to-text                                          | ^9.0.5   | packages/core/src/\*_/_.ts                                                                                                                                 | ✅        | HTML to text conversion for backend content processing                      | ❌         |
| chardet                                               | ^2.1.0   | packages/core/src/\*_/_.ts                                                                                                                                 | ✅        | Character encoding detection for backend file reading                       | ❌         |
| fast-levenshtein                                      | ^2.0.6   | packages/core/src/\*_/_.ts                                                                                                                                 | ✅        | String similarity algorithm for backend text processing                     | ❌         |
| fast-uri                                              | ^3.0.6   | packages/core/src/\*_/_.ts                                                                                                                                 | ✅        | URI parsing for backend URL processing                                      | ❌         |
| tree-sitter-bash                                      | ^0.25.0  | packages/core/src/\*_/_.ts                                                                                                                                 | ✅        | Bash parser for backend code analysis                                       | ❌         |
| web-tree-sitter                                       | ^0.25.10 | packages/core/src/\*_/_.ts                                                                                                                                 | ✅        | Tree-sitter parser runtime for backend code parsing                         | ❌         |
| ajv                                                   | ^8.17.1  | packages/core/src/\*_/_.ts                                                                                                                                 | ✅        | JSON schema validator for backend data validation                           | ❌         |
| ajv-formats                                           | ^3.0.0   | packages/core/src/\*_/_.ts                                                                                                                                 | ✅        | Additional formats for AJV validator in backend                             | ❌         |
| @iarna/toml                                           | ^2.2.5   | packages/core/src/policy/toml-loader.ts, packages/cli/src/\*_/_.ts                                                                                         | ✅        | TOML parser for backend configuration parsing                               | ❌         |
| read-package-up                                       | ^11.0.0  | packages/core/src/**/\*.ts, packages/cli/src/**/\*.ts                                                                                                      | ✅        | Package.json reader for backend configuration                               | ❌         |
| https-proxy-agent                                     | ^7.0.6   | packages/core/src/\*_/_.ts                                                                                                                                 | ✅        | HTTPS proxy agent for backend network requests                              | ❌         |
| ws                                                    | ^8.18.0  | packages/core/src/\*_/_.ts                                                                                                                                 | ✅        | WebSocket client for backend real-time communication                        | ❌         |
| open                                                  | ^10.1.2  | packages/core/src/**/\*.ts, packages/cli/src/**/\*.ts                                                                                                      | ✅        | Open URLs/files in backend operations                                       | ❌         |
| mnemonist                                             | ^0.40.3  | packages/core/src/**/\*.ts, packages/cli/src/**/\*.ts                                                                                                      | ✅        | Data structures library for backend algorithms                              | ❌         |
| strip-ansi                                            | ^7.1.0   | packages/core/src/**/\*.ts, packages/cli/src/**/\*.ts                                                                                                      | ✅        | Strip ANSI codes for backend text processing                                | ❌         |
| @xterm/headless                                       | 5.5.0    | packages/core/src/\*_/_.ts                                                                                                                                 | ✅        | Headless terminal emulator for backend terminal operations                  | ❌         |
| @joshua.litt/get-ripgrep                              | ^0.0.3   | packages/core/src/\*_/_.ts                                                                                                                                 | ✅        | Ripgrep binary for backend text search                                      | ❌         |
| latest-version                                        | ^9.0.0   | packages/cli/src/\*_/_.ts (root package.json)                                                                                                              | ✅        | Check latest package version for backend update checks                      | ❌         |
| command-exists                                        | ^1.2.9   | packages/cli/src/\*_/_.ts                                                                                                                                  | ✅        | Check if command exists for backend command validation                      | ❌         |
| comment-json                                          | ^4.2.5   | packages/cli/src/\*_/_.ts                                                                                                                                  | ✅        | JSON parser with comment support for backend config parsing                 | ❌         |
| extract-zip                                           | ^2.0.1   | packages/cli/src/\*_/_.ts                                                                                                                                  | ✅        | ZIP extraction for backend file operations                                  | ❌         |
| tar                                                   | ^7.5.2   | packages/cli/src/\*_/_.ts                                                                                                                                  | ✅        | TAR archive operations for backend file operations                          | ❌         |
| strip-json-comments                                   | ^3.1.1   | packages/cli/src/\*_/_.ts                                                                                                                                  | ✅        | Remove comments from JSON for backend config parsing                        | ❌         |
| yargs                                                 | ^17.7.2  | packages/cli/src/\*_/_.ts                                                                                                                                  | ✅        | CLI argument parser for backend command processing                          | ❌         |

## Shared Dependencies (🟡 - Analyze)

| Package Name            | Version                        | Usage Locations                                                                                                                                                    | Essential | Rationale                                                                                                                                                   | Can Remove |
| ----------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| zod                     | ^3.25.76 (core), ^3.23.8 (cli) | packages/core/src/**/\*.ts, packages/cli/src/**/\*.ts, packages/cli/src/zed-integration/schema.ts                                                                  | ⚠️        | Schema validation used in both backend (config validation) and frontend (UI form validation). Can potentially be split but serves validation in both layers | ⚠️         |
| dotenv                  | ^17.1.0                        | packages/core/src/\*_/_.ts, packages/cli/src/config/settings.ts, packages/cli/src/config/extensions/extensionSettings.ts, packages/a2a-server/src/config/config.ts | ⚠️        | Environment variable loading used in both backend (core config) and frontend (CLI config). Shared configuration dependency                                  | ⚠️         |
| @google/gemini-cli-core | file:../core                   | packages/cli/src/\*_/_.ts                                                                                                                                          | ⚠️        | Core package imported by CLI. Contains both backend logic and shared utilities. CLI depends on core for backend functionality                               | ⚠️         |

## Optional Dependencies

| Package Name     | Version | Usage Locations                                       | Essential | Rationale                                                                                                               | Can Remove |
| ---------------- | ------- | ----------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------- | ---------- |
| @lydell/node-pty | 1.1.0   | packages/core/src/**/\*.ts, packages/cli/src/**/\*.ts | ⚠️        | Platform-specific PTY implementations for terminal operations. Optional - only needed for interactive terminal features | ⚠️         |
| node-pty         | ^1.0.0  | packages/core/src/**/\*.ts, packages/cli/src/**/\*.ts | ⚠️        | PTY implementation for terminal operations. Optional - only needed for shell integration                                | ⚠️         |

## Dev Dependencies (Not Categorized)

Dev dependencies are not categorized as they are only used during development
and testing, not in production code. Key dev dependencies include:

- TypeScript, Vitest, ESLint, Prettier (development tools)
- @types/\* packages (TypeScript type definitions)
- Testing libraries (vitest, msw, ink-testing-library)

## Dependency Analysis Summary

- **Total Dependencies Analyzed**: 60+ production dependencies
- **UI Dependencies**: 15 dependencies
  - All can be removed when replacing frontend
  - Primary: ink, react, react-dom, ink-spinner, highlight.js, lowlight, chalk
- **Logic Dependencies**: 40+ dependencies
  - All MUST be preserved
  - Primary: @google/genai, google-auth-library, undici, OpenTelemetry packages
- **Shared Dependencies**: 3 dependencies
  - Need analysis to determine if they can be split
  - zod: Used for validation in both layers
  - dotenv: Used for config in both layers
  - @google/gemini-cli-core: Core package dependency

## Notes

- UI dependencies can be removed when replacing frontend
- Logic dependencies MUST be preserved
- Shared dependencies need analysis to determine if they can be split or must be
  kept
- Optional dependencies (node-pty) are only needed for specific features
- Version differences between packages (e.g., zod ^3.25.76 in core vs ^3.23.8 in
  cli) should be resolved during refactoring

## Usage Location Details

### @google/genai

- **Primary Usage**: `packages/core/src/core/contentGenerator.ts` - Creates
  GoogleGenAI client
- **Secondary Usage**: `packages/core/src/core/geminiChat.ts` - API
  request/response handling
- **Total Files**: 108 files import @google/genai
- **Category**: Logic (Essential)

### ink

- **Primary Usage**: `packages/cli/src/ui/**/*.tsx` - All UI components
- **Entry Point**: `packages/cli/src/gemini.tsx` - Main render function
- **Total Files**: 50+ UI component files
- **Category**: UI (Removable)

### react

- **Primary Usage**: `packages/cli/src/ui/**/*.tsx` - All React components
- **Entry Point**: `packages/cli/src/gemini.tsx` - React.StrictMode wrapper
- **Total Files**: 50+ React component files
- **Category**: UI (Removable)

### google-auth-library

- **Primary Usage**: `packages/core/src/mcp/google-auth-provider.ts` - OAuth
  provider
- **Secondary Usage**: `packages/core/src/code_assist/oauth2.ts` - OAuth flow
- **Total Files**: 13 files
- **Category**: Logic (Essential)

### undici

- **Primary Usage**: `packages/core/src/utils/fetch.ts` - HTTP client wrapper
- **Secondary Usage**: `packages/core/src/ide/ide-client.ts` - IDE communication
- **Total Files**: 4 files
- **Category**: Logic (Essential)

### zod

- **Core Package**: `packages/core/src/**/*.ts` - Backend validation
- **CLI Package**: `packages/cli/src/zed-integration/schema.ts` - UI schema
  validation
- **Total Files**: 5+ files across both packages
- **Category**: Shared (Analyze)

### dotenv

- **Core Package**: `packages/core/src/**/*.ts` - Backend config loading
- **CLI Package**: `packages/cli/src/config/settings.ts` - CLI config loading
- **A2A Server**: `packages/a2a-server/src/config/config.ts` - Server config
- **Total Files**: 4 files
- **Category**: Shared (Analyze)
