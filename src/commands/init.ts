import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const DEFAULT_CONFIG = {
  defaultPersona: "professional",
  ai: {
    default: "mycli",
    providers: {
      mycli: {
        command: "mycli --pipe --once",
        timeoutSec: 120,
      },
    },
  },
  personas: {
    professional: {
      description: "Thoughtful professional comment for LinkedIn/Twitter",
      promptFile: "prompts/professional.txt",
      variants: 3,
    },
    engineer: {
      description: "Technical, architecture-focused comment",
      promptFile: "prompts/engineer.txt",
      variants: 3,
    },
  },
};

export const DEFAULT_PROFESSIONAL_PROMPT = `
You are a senior professional commenting on a post/article.
- Express a thoughtful, experienced perspective.
- Share a brief real-world observation or practical takeaway.
- Keep it concise, natural, and engaging (2-4 sentences).
`;

export const DEFAULT_ENGINEER_PROMPT = `
You are a senior software engineer/architect commenting on a technical post.
- Focus on technical tradeoffs, performance, edge cases, or architecture.
- Sound like an engineer discussing real production code.
- Keep it concise and direct (2-4 sentences).
`;

export function initCommand(cwd: string, explicitPath?: string): void {
  const configPath = explicitPath ? (explicitPath.startsWith("/") ? explicitPath : join(cwd, explicitPath)) : join(cwd, "post-to-comment.config.json");
  if (existsSync(configPath)) {
    console.log(`Config file already exists at "${configPath}". Delete it or specify another directory.`);
    return;
  }

  const promptsDir = join(cwd, "prompts");
  mkdirSync(promptsDir, { recursive: true });

  writeFileSync(join(promptsDir, "professional.txt"), DEFAULT_PROFESSIONAL_PROMPT.trim());
  writeFileSync(join(promptsDir, "engineer.txt"), DEFAULT_ENGINEER_PROMPT.trim());
  writeFileSync(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2));

  console.log(`Scaffolded config at "${configPath}" and prompt files in "${promptsDir}".`);
}
