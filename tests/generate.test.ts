import { test, expect, afterEach } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync, chmodSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Config } from "../src/types.ts";
import { generateComments } from "../src/generate.ts";

let cwd: string;
let scriptPath: string;
afterEach(() => rmSync(cwd, { recursive: true, force: true }));

function setupFixture(scriptContent: string): Config {
  cwd = mkdtempSync(join(tmpdir(), "p2c-gen-test-"));
  scriptPath = join(cwd, "fixture.sh");
  writeFileSync(scriptPath, scriptContent);
  chmodSync(scriptPath, 0o755);

  return {
    defaultPersona: "professional",
    ai: {
      default: "mock",
      providers: {
        mock: {
          command: [scriptPath],
          timeoutSec: 5,
        },
      },
    },
    personas: {
      professional: {
        description: "Pro",
        promptFile: "prompts/pro.txt",
        variants: 2,
      },
    },
    configDir: cwd,
  };
}

test("generateComments produces requested variant count and strips sycophancy", async () => {
  const config = setupFixture(`#!/bin/sh\necho "Great post! This is a solid observation."\n`);
  const { variants, outputText } = await generateComments(config, {
    postText: "We reduced deploy times by 50%.",
    variantCount: 2,
  });

  expect(variants).toHaveLength(2);
  expect(variants[0]).toBe("This is a solid observation.");
  expect(outputText).toContain("--- Variant 1 ---");
  expect(outputText).toContain("This is a solid observation.");
});

test("generateComments supports JSON output", async () => {
  const config = setupFixture(`#!/bin/sh\necho "Great writeup! Practical take."\n`);
  const { variants, outputText } = await generateComments(config, {
    postText: "Some post about tech.",
    variantCount: 2,
    jsonOutput: true,
  });

  expect(variants).toHaveLength(2);
  const parsed = JSON.parse(outputText);
  expect(Array.isArray(parsed)).toBe(true);
  expect(parsed[0]).toBe("Practical take.");
});
