#!/usr/bin/env node
/**
 * list-updates.mjs — read local sources.json and print pending-review candidates.
 * No network. Does not write site pages.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sourcesPath = join(__dirname, "sources.json");

function load() {
  const raw = readFileSync(sourcesPath, "utf8");
  return JSON.parse(raw);
}

function main() {
  const data = load();
  const sources = Array.isArray(data.sources) ? data.sources : [];
  const pending = sources.filter((s) => s && s.pending_review === true);
  const reviewedOn = data.reviewed_on || "(unset)";

  console.log("Mika research sources — pending review list");
  console.log(`Registry reviewed_on: ${reviewedOn}`);
  console.log(`Total sources: ${sources.length}`);
  console.log(`Pending review: ${pending.length}`);
  console.log("");

  if (pending.length === 0) {
    console.log("No pending-review candidates.");
    console.log("Tip: set pending_review=true on a source after you notice an upstream change.");
    return;
  }

  for (const s of pending) {
    console.log("---");
    console.log(`id:            ${s.id || "(missing)"}`);
    console.log(`repository:    ${s.repository || "(missing)"}`);
    console.log(`license:       ${s.license || "(missing)"}`);
    console.log(`source_url:    ${s.source_url || "(missing)"}`);
    console.log(`viewed_on:     ${s.viewed_on || "(missing)"}`);
    console.log(`article_slug:  ${s.article_slug || "(none)"}`);
    console.log(`last_known_pushed_at: ${s.last_known_pushed_at || "(unset)"}`);
    if (s.notes) console.log(`notes:         ${s.notes}`);
  }

  console.log("");
  console.log("Next step: human review → original brief → Mika article (no auto-publish).");
}

try {
  main();
} catch (err) {
  console.error("Failed to list updates:", err && err.message ? err.message : err);
  process.exitCode = 1;
}
