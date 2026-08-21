export const HELP = `post-to-comment — generate insightful, anti-AI-slop comments for LinkedIn posts/articles in the matching language

Usage:
  post-to-comment <post_text_or_file_path> [persona] [options]
  post-to-comment <command> [options]

Commands:
  setup                   Interactive wizard to configure AI CLI and personas
  init                    Scaffold post-to-comment.config.json + prompts/
  update                  Check and download the latest release from GitHub

Options:
  --persona <key>          Persona key from config (default: defaultPersona)
  --count, -n <number>    Number of comment variants to generate (default: 3)
  --max-words, -w <n>     Maximum word count limit per comment
  --out, -o <path>        Save comments to specified output file (default: stdout)
  --json                  Output comment variants as a JSON array
  --config <path>         Path to config file (default: ./post-to-comment.config.json)
  --version, -v           Show version
  --help, -h              Show this help

Environment:
  POST2COMMENT_CONFIG       Override config file path
  POST2COMMENT_AI_DEFAULT   Override ai.default provider key
`;
