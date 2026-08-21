# CLAUDE.md — post-to-comment

CLI orchestrator for generating anti-AI-slop comments for LinkedIn posts/articles in the matching source language.

## Build & Test Commands

- **Run tests:** `bun test`
- **Typecheck:** `bun run typecheck` (or `tsc --noEmit`)
- **Build standalone binary:** `bun run build` (produces executable `post-to-comment`)

## Architecture & Code Structure

- **[src/index.ts](src/index.ts)** — Main CLI entry point, argument parsing (`node:util` `parseArgs`).
- **[src/antislop.ts](src/antislop.ts)** — Anti-AI-slop directives, language-matching prompt injection, sycophancy cleaning, and word limit truncation.
- **[src/generate.ts](src/generate.ts)** — Core comment generation orchestrator.
- **[src/ai.ts](src/ai.ts)** — Subprocess launcher for external AI CLIs (`Bun.spawn`).
- **[src/config.ts](src/config.ts)** — Config loader for `post-to-comment.config.json`.
- **[src/commands/](src/commands/)** — CLI commands (`init`, `setup`, `update`).

## Key Guidelines

1. **Zero Runtime Dependencies:** Built strictly on Bun runtime, `node:*` builtins, and external AI CLI sub-processes.
2. **Language Matching:** Always enforce source post language matching in generated comments.
3. **Anti-Slop:** Ban empty sycophancy, throat-clearing, and cliché buzzwords.
