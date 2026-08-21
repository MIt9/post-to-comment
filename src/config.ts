import { readFileSync, existsSync } from "node:fs";
import { dirname, join, isAbsolute } from "node:path";
import type { Config } from "./types.ts";

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

export function resolveConfigPath(cwd: string, explicitPath?: string): string {
  if (explicitPath) return isAbsolute(explicitPath) ? explicitPath : join(cwd, explicitPath);
  if (process.env.POST2COMMENT_CONFIG) return isAbsolute(process.env.POST2COMMENT_CONFIG) ? process.env.POST2COMMENT_CONFIG : join(cwd, process.env.POST2COMMENT_CONFIG);
  return join(cwd, "post-to-comment.config.json");
}

export function loadConfig(explicitPath?: string, cwd = process.cwd()): Config {
  const path = resolveConfigPath(cwd, explicitPath);
  if (!existsSync(path)) {
    throw new ConfigError(`Config file not found: "${path}". Run "post-to-comment setup" or "post-to-comment init" first.`);
  }

  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(path, "utf-8"));
  } catch (err) {
    throw new ConfigError(`Invalid JSON in "${path}": ${err instanceof Error ? err.message : String(err)}`);
  }

  if (typeof raw !== "object" || raw === null) throw new ConfigError(`Config file "${path}" must be a JSON object.`);
  const c = raw as Record<string, unknown>;

  if (typeof c.defaultPersona !== "string" || !c.defaultPersona) throw new ConfigError(`Config at "${path}" missing required string "defaultPersona".`);
  if (typeof c.ai !== "object" || c.ai === null) throw new ConfigError(`Config at "${path}" missing required object "ai".`);
  const ai = c.ai as Record<string, unknown>;

  const defaultProviderKey = (process.env.POST2COMMENT_AI_DEFAULT || ai.default) as string;
  if (typeof defaultProviderKey !== "string" || !defaultProviderKey) {
    throw new ConfigError(`Config at "${path}" missing required string "ai.default".`);
  }

  if (typeof ai.providers !== "object" || ai.providers === null) throw new ConfigError(`Config at "${path}" missing required object "ai.providers".`);
  const providers = ai.providers as Record<string, unknown>;

  if (typeof c.personas !== "object" || c.personas === null) throw new ConfigError(`Config at "${path}" missing required object "personas".`);
  const personas = c.personas as Record<string, unknown>;

  return {
    defaultPersona: c.defaultPersona,
    ai: { default: defaultProviderKey, providers: providers as Config["ai"]["providers"] },
    personas: personas as Config["personas"],
    configDir: dirname(path),
  };
}
