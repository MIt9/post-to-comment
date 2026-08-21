export interface ProviderConfig {
  command: string | string[];
  timeoutSec: number;
  stdin?: boolean;
}

export interface PersonaConfig {
  description: string;
  promptFile: string;
  variants?: number;
  maxWords?: number;
  ai?: string;
}

export interface Config {
  defaultPersona: string;
  ai: { default: string; providers: Record<string, ProviderConfig> };
  personas: Record<string, PersonaConfig>;
  configDir: string;
}

export interface ProviderResult {
  ok: boolean;
  stdout: string;
  stderr: string;
}

export interface CommentGenerateOptions {
  postText: string;
  personaKey?: string;
  variantCount?: number;
  maxWords?: number;
  jsonOutput?: boolean;
  outFile?: string;
}
