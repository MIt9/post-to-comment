import { chmodSync, writeFileSync, copyFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { tmpdir, homedir } from "node:os";
import { VERSION } from "../version.ts";

export async function updateCommand(): Promise<void> {
  console.log(`Current version: v${VERSION}`);
  console.log("Checking for updates from GitHub releases (MIt9/post-to-comment)...");

  const url = "https://github.com/MIt9/post-to-comment/releases/latest/download/post-to-comment-macos";

  try {
    const res = await fetch(url, {
      headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    const tempPath = join(tmpdir(), `post-to-comment-update-${Date.now()}`);
    writeFileSync(tempPath, bytes);
    chmodSync(tempPath, 0o755);

    let targetPath = process.execPath;
    if (targetPath.endsWith("bun") || targetPath.endsWith("node")) {
      targetPath = join(homedir(), ".local/bin", "post-to-comment");
    }

    copyFileSync(tempPath, targetPath);
    chmodSync(targetPath, 0o755);
    try {
      unlinkSync(tempPath);
    } catch {}

    console.log(`✅ Successfully updated post-to-comment at ${targetPath}`);
  } catch (err) {
    console.error(`❌ Update failed: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}
