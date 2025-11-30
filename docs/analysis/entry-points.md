# Entry Points Analysis

**Created**: 2025-11-30  
**Purpose**: Document all application entry points - CRITICAL prerequisite for
all component analysis

## Entry Point Identification Methodology

Entry points were identified by:

1. Checking `package.json` `bin` field for executable commands
2. Tracing bundle files to source locations
3. Identifying main functions and initialization code
4. Documenting all entry points including non-interactive and server modes

## Main CLI Entry Point (Interactive)

**Executable**: `gemini` (from `package.json` bin field)  
**Bundle Location**: `bundle/gemini.js`  
**Source Location**: `packages/cli/src/gemini.tsx`  
**Main Function**: `main()` at line 283

### Details

- **File Path**: `packages/cli/src/gemini.tsx`
- **Function Name**: `main()`
- **Line Number**: 283
- **Build Process**:
  - Built via `npm run bundle` command
  - Uses `esbuild.config.js` to bundle source files
  - Output: `bundle/gemini.js`
- **Purpose**: Primary entry point for interactive CLI mode
- **Key Functions**:
  - `main()`: Main entry function
  - `startInteractiveUI()`: Starts the interactive UI (line 169)

### Code Flow

```
bundle/gemini.js (executable)
  → packages/cli/src/gemini.tsx::main()
    → parseArguments()
    → loadCliConfig()
    → startInteractiveUI() (if interactive)
    → runNonInteractive() (if non-interactive)
```

---

## Non-Interactive CLI Entry Point

**File Path**: `packages/cli/src/nonInteractiveCli.ts`  
**Function Name**: `runNonInteractive()`  
**Entry Point**: Called from `packages/cli/src/gemini.tsx::main()` when not in
interactive mode

### Details

- **File Path**: `packages/cli/src/nonInteractiveCli.ts`
- **Function Name**: `runNonInteractive()`
- **Purpose**: Handles non-interactive CLI execution (piped input, --prompt
  flag)
- **Invoked From**: `packages/cli/src/gemini.tsx::main()` (line 617)
- **Conditions**:
  - When `!config.isInteractive()`
  - When input is provided via stdin or --prompt flag

---

## A2A Server Entry Point

**File Path**: `packages/a2a-server/src/index.ts`  
**Purpose**: Agent-to-Agent (A2A) server entry point

### Details

- **File Path**: `packages/a2a-server/src/index.ts`
- **Exports**:
  - `./agent/executor.js`
  - `./http/app.js`
  - `./types.js`
- **Purpose**: A2A server for agent-to-agent communication
- **Start Command**: `npm run start:a2a-server` (from root package.json)

---

## Entry Point Summary

| Entry Point         | Bundle/Executable  | Source File                             | Main Function         | Purpose                   |
| ------------------- | ------------------ | --------------------------------------- | --------------------- | ------------------------- |
| Interactive CLI     | `bundle/gemini.js` | `packages/cli/src/gemini.tsx`           | `main()`              | Primary interactive CLI   |
| Non-Interactive CLI | (same bundle)      | `packages/cli/src/nonInteractiveCli.ts` | `runNonInteractive()` | Non-interactive execution |
| A2A Server          | (separate package) | `packages/a2a-server/src/index.ts`      | (exports)             | Agent-to-agent server     |

---

## Build Process

### Bundle Creation

1. **Command**: `npm run bundle`
2. **Steps**:
   - `npm run generate` - Generate git commit info
   - `node esbuild.config.js` - Bundle TypeScript source files
   - `node scripts/copy_bundle_assets.js` - Copy bundle assets
3. **Output**: `bundle/gemini.js`
4. **Source**: `packages/cli/src/gemini.tsx` and dependencies

### Entry Point Resolution

When user runs `gemini` command:

1. Node.js resolves `bundle/gemini.js` from `package.json` bin field
2. Bundle executes and calls `main()` from `packages/cli/src/gemini.tsx`
3. `main()` determines mode (interactive vs non-interactive)
4. Routes to appropriate handler (`startInteractiveUI()` or
   `runNonInteractive()`)

---

## Notes

- All entry points must be identified before component tracing can begin
- Entry points are the starting point for "Trace & Tag" methodology
- The bundle file (`bundle/gemini.js`) is the actual executable, but source
  analysis should focus on source files
- A2A server is a separate package with its own entry point

---

## Next Steps

With entry points identified, component tracing can now begin:

1. Start from `main()` in `packages/cli/src/gemini.tsx`
2. Follow function calls to identify components
3. Tag components as frontend (🔴) or backend (🟢)
4. Document component relationships
