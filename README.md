# post-to-comment

CLI tool: generate insightful, anti-AI-slop comments for LinkedIn posts and articles in the matching source language.

## Purpose

Given a post/article (as raw text or a file path), `post-to-comment` invokes your configured AI provider to produce multiple comment variants (default: 3).

### Key Features
1. **Strict Language Matching:** Automatically detects the language of the source post/article (e.g. Ukrainian, English, German) and generates all comments in that exact same language.
2. **Anti-AI Slop:** Built-in anti-slop rules eliminate sycophancy ("Great post!"), throat-clearing openers, AI clichés (`delve`, `leverage`, `tapestry`, `занурюватися`), binary contrasts, and formatting clutter.
3. **Multiple Output Formats:** Output cleanly to stdout (text or `--json` array for AI pipelines) or save directly to a file (`--out comments.md`).
4. **Configurable Personas:** Define custom personas/styles (e.g., `professional`, `engineer`, `thoughtful`, `witty`) via `post-to-comment.config.json`.

## Quick Start

```bash
# Setup wizard
post-to-comment setup

# Generate comments for text directly
post-to-comment "We reduced build times by 40% using custom Bun plugins."

# Generate comments for a post file in JSON format
post-to-comment post.txt --json

# Save 3 engineer persona comments to a file
post-to-comment post.txt engineer -n 3 -o comments.md
```

## CLI Surface

```
post-to-comment <post_text_or_file> [persona] [options]

Commands:
  setup                   Interactive wizard to configure AI CLI and personas
  init                    Scaffold post-to-comment.config.json + prompts/
  update                  Check and download the latest release from GitHub

Options:
  --persona <key>          Persona key from config (default: defaultPersona)
  --count, -n <number>    Number of comment variants to generate (default: 3)
  --out, -o <path>        Save comments to specified output file (default: stdout)
  --json                  Output comment variants as a JSON array
  --config <path>         Path to config file (default: ./post-to-comment.config.json)
  --version, -v           Show version
  --help, -h              Show this help
```

## Config Schema (`post-to-comment.config.json`)

```jsonc
{
  "defaultPersona": "professional",
  "ai": {
    "default": "claude",
    "providers": {
      "claude": {
        "command": ["claude", "-p"],
        "timeoutSec": 120
      }
    }
  },
  "personas": {
    "professional": {
      "description": "Professional LinkedIn comments",
      "promptFile": "prompts/professional.txt",
      "variants": 3
    },
    "engineer": {
      "description": "Technical & architecture focused comments",
      "promptFile": "prompts/engineer.txt",
      "variants": 3
    }
  }
}
```

## Building & Testing

```bash
bun test             # Run test suite
bun run typecheck    # Typecheck with tsc
bun run build        # Build standalone binary
```
