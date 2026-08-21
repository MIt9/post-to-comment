import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Config, CommentGenerateOptions } from "./types.ts";
import { runProvider } from "./ai.ts";
import { appendCommentAntiSlopInstructions, sanitizeComment } from "./antislop.ts";

export async function generateComments(
  config: Config,
  options: CommentGenerateOptions,
): Promise<{ variants: string[]; outputText: string }> {
  let postText = options.postText.trim();
  if (existsSync(postText)) {
    postText = readFileSync(postText, "utf-8").trim();
  }

  if (!postText) {
    throw new Error("Source post text is empty.");
  }

  const personaKey = options.personaKey ?? config.defaultPersona;
  const persona = config.personas[personaKey];
  if (!persona) {
    throw new Error(`Unknown persona/style: "${personaKey}". Available: ${Object.keys(config.personas).join(", ")}`);
  }

  const providerKey = persona.ai ?? config.ai.default;
  const provider = config.ai.providers[providerKey];
  if (!provider) {
    throw new Error(`Unknown AI provider: "${providerKey}". Available: ${Object.keys(config.ai.providers).join(", ")}`);
  }

  const maxWords = options.maxWords ?? persona.maxWords;
  const promptFilePath = join(config.configDir, persona.promptFile);
  const rawPrompt = existsSync(promptFilePath) ? readFileSync(promptFilePath, "utf-8") : "Write a professional, insightful comment.";
  const prompt = appendCommentAntiSlopInstructions(rawPrompt, maxWords);

  const count = options.variantCount ?? persona.variants ?? 3;
  const variants: string[] = [];

  for (let i = 0; i < count; i++) {
    const result = await runProvider(provider, { postText, prompt });
    if (!result.ok) {
      throw new Error(result.stderr.trim() || "AI provider exited with a non-zero status");
    }
    const clean = sanitizeComment(result.stdout.trim(), maxWords);
    variants.push(clean);
  }

  let outputText = "";
  if (options.jsonOutput) {
    outputText = JSON.stringify(variants, null, 2);
  } else {
    outputText = variants.map((v, i) => `--- Variant ${i + 1} ---\n${v}`).join("\n\n");
  }

  if (options.outFile) {
    writeFileSync(options.outFile, outputText);
  }

  return { variants, outputText };
}
