import { test, expect, afterEach } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadConfig, ConfigError } from "../src/config.ts";

let cwd: string;
afterEach(() => rmSync(cwd, { recursive: true, force: true }));

test("loadConfig throws ConfigError when file is missing", () => {
  cwd = mkdtempSync(join(tmpdir(), "p2c-test-"));
  expect(() => loadConfig(undefined, cwd)).toThrow(ConfigError);
});

test("loadConfig parses valid config file", () => {
  cwd = mkdtempSync(join(tmpdir(), "p2c-test-"));
  const configContent = {
    defaultPersona: "pro",
    ai: { default: "mock", providers: { mock: { command: "echo test", timeoutSec: 10 } } },
    personas: { pro: { description: "Pro", promptFile: "prompts/pro.txt", variants: 2 } },
  };
  writeFileSync(join(cwd, "post-to-comment.config.json"), JSON.stringify(configContent));

  const config = loadConfig(undefined, cwd);
  expect(config.defaultPersona).toBe("pro");
  expect(config.ai.default).toBe("mock");
  expect(config.personas["pro"]?.variants).toBe(2);
});
