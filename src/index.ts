#!/usr/bin/env bun
import { parseArgs } from "node:util";
import { HELP } from "./help.ts";
import { loadConfig } from "./config.ts";
import { initCommand } from "./commands/init.ts";
import { runSetupWizard, createStdioWizardIO } from "./commands/setup.ts";
import { updateCommand } from "./commands/update.ts";
import { generateComments } from "./generate.ts";
import { VERSION } from "./version.ts";

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const first = args[0];

  if (first === "--version" || first === "-v" || first === "version") {
    console.log(`post-to-comment v${VERSION}`);
    return;
  }

  if (!first || first === "--help" || first === "-h") {
    console.log(HELP);
    return;
  }

  const { values, positionals } = parseArgs({
    args,
    options: {
      config: { type: "string" },
      persona: { type: "string" },
      count: { type: "string", short: "n" },
      "max-words": { type: "string", short: "w" },
      out: { type: "string", short: "o" },
      json: { type: "boolean" },
      help: { type: "boolean", short: "h" },
      version: { type: "boolean", short: "v" },
    },
    allowPositionals: true,
    strict: false,
  });

  if (values.help) {
    console.log(HELP);
    return;
  }

  if (values.version) {
    console.log(`post-to-comment v${VERSION}`);
    return;
  }

  const configPath = typeof values.config === "string" ? values.config : undefined;
  const command = positionals[0];

  switch (command) {
    case "init":
      initCommand(process.cwd(), configPath);
      return;
    case "setup": {
      const io = createStdioWizardIO();
      try {
        await runSetupWizard(process.cwd(), io, configPath);
      } finally {
        io.close();
      }
      return;
    }
    case "update":
      await updateCommand();
      return;
  }

  // Primary action: generate comments for post/article
  const postInput = positionals[0];
  if (!postInput) {
    fail("Error: Please provide post text or path to post file. Run 'post-to-comment --help' for usage.");
  }

  const personaKey = (typeof values.persona === "string" ? values.persona : positionals[1]);
  const variantCount = values.count ? parseInt(String(values.count), 10) : undefined;
  const maxWordsVal = values["max-words"] ? parseInt(String(values["max-words"]), 10) : undefined;
  const jsonOutput = Boolean(values.json);
  const outFile = typeof values.out === "string" ? values.out : undefined;

  const config = loadConfig(configPath, process.cwd());
  const { outputText } = await generateComments(config, {
    postText: postInput,
    personaKey,
    variantCount,
    maxWords: maxWordsVal,
    jsonOutput,
    outFile,
  });

  if (!outFile) {
    console.log(outputText);
  } else {
    console.log(`Saved comments to ${outFile}`);
  }
}

try {
  await main();
} catch (err) {
  fail(err instanceof Error ? err.message : String(err));
}
